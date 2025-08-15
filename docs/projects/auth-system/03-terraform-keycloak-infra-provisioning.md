---
id: 03-terraform-keycloak-infra-provisioning
title: Keycloak Infra Provisioning
sidebar_position: 3
---

# Keycloak Infra Provisioning (Terraform + Docker)

Provision Keycloak realms and OpenID clients using Terraform. Everything is containerized using Docker for consistent, repeatable infra setup — especially useful for development environments.

---

## Project Structure

```
keycloak-infra/
├── Dockerfile              # Container to run Terraform commands
├── main.tf                 # Terraform configuration (Keycloak provider, realm, clients)
├── terraform.tfstate       # (Generated) stores the state after apply
├── terraform.lock.hcl      # (Generated) locks provider versions
└── README.md               # You're here
```

---

## Prerequisites

- Docker installed on your machine
- Running Keycloak server at `http://localhost:8080`  
  (with default admin credentials: `admin` / `admin`)
- Internet access to pull Terraform provider plugins

---

## main.tf

```tf
provider "keycloak" {
  client_id     = "admin-cli"
  username      = "admin"
  password      = "admin"
  url           = "http://host.docker.internal:8080"
  realm         = "master"
}

# 1. Realm
resource "keycloak_realm" "megatron" {
  realm   = "megatron"
  enabled = true

  registration_allowed = true                # This enables "User registration" in Login tab
  login_with_email_allowed = true            # Optional: login via email
  duplicate_emails_allowed = false           # Optional: don't allow same email for multiple users
  reset_password_allowed = true              # Optional: forgot password link
  remember_me = true                         # Optional: Remember Me checkbox
  verify_email = false                       # Optional: turn on email verification
}

# 2. Public Client (Frontend)
resource "keycloak_openid_client" "megatron_ui" {
  realm_id                     = keycloak_realm.megatron.id
  client_id                    = "megatron-ui"
  name                         = "megatron-ui"
  access_type                  = "PUBLIC"
  standard_flow_enabled        = true
  implicit_flow_enabled        = false
  direct_access_grants_enabled = false
  root_url                     = "http://localhost:3000"
  valid_redirect_uris          = ["http://localhost:3000/*"]
  web_origins                  = ["*"]
  pkce_code_challenge_method   = "S256"
}

# 3. Confidential Client (Backend)
resource "keycloak_openid_client" "megatron_store" {
  realm_id                     = keycloak_realm.megatron.id
  client_id                    = "megatron-store"
  name                         = "megatron-store"
  access_type                  = "CONFIDENTIAL"
  standard_flow_enabled        = true
  service_accounts_enabled     = true
  valid_redirect_uris          = ["http://localhost:8081/*"]
  web_origins                  = []
}

output "megatron_store_client_secret" {
  value = keycloak_openid_client.megatron_store.client_secret
  sensitive = true
}
```

## Dockerfile

```Dockerfile
# Use official Terraform image
FROM hashicorp/terraform:latest

WORKDIR /app

COPY . .

RUN chmod -R +x /app

ENTRYPOINT ["terraform"]
```

---

## Build Docker Image

```bash
docker build -t keycloak-infra-provisioning .
```

---

## Terraform Usage (via Docker)

> **Note:** Use `host.docker.internal` to access Keycloak on your Windows host from inside the Docker container.

### 1. Initialize

```bash
docker run --rm -v "%cd%":/app keycloak-infra-provisioning init
```

### 2. Plan

```bash
docker run --rm -v "%cd%":/app keycloak-infra-provisioning plan
```

### 3. Apply

```bash
docker run --rm -v "%cd%":/app keycloak-infra-provisioning apply -auto-approve
```

---

## What’s Being Created?

1. **Realm: `megatron`**

   - Registration allowed
   - Remember me
   - Reset password enabled

2. **Public Client: `megatron-ui`**

   - For React frontend
   - Redirect URI: `http://localhost:3000/*`

3. **Confidential Client: `megatron-store`**
   - For Spring Boot backend
   - Service accounts enabled
   - Redirect URI: `http://localhost:8081/*`

---

## Output

Terraform will output the confidential client’s client secret securely:

```hcl
output "megatron_store_client_secret" {
  value     = keycloak_openid_client.megatron_store.client_secret
  sensitive = true
}
```

---

## Troubleshooting

### Provider Not Found

If you see:

```
Could not retrieve the list of available versions for provider hashicorp/keycloak
```

Fix in `main.tf`:

```hcl
terraform {
  required_providers {
    keycloak = {
      source  = "mrparkers/keycloak"
      version = "~> 4.0"
    }
  }
}
```

---

### Connection Refused

If you see:

```
failed to perform initial login to Keycloak: ... connect: connection refused
```

Make sure:

- Keycloak is running at `localhost:8080`
- You're using `url = "http://host.docker.internal:8080"` in provider block

---

## References

- [mrparkers/keycloak Terraform Provider](https://registry.terraform.io/providers/mrparkers/keycloak/latest)
- [Docker for Windows - host.docker.internal](https://docs.docker.com/desktop/networking/#use-cases-and-workarounds)

---
