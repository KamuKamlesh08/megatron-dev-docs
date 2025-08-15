---
id: 02-keycloak-setup-docker-compose
title: Keycloak Setup with Docker Compose
sidebar_position: 2
---

# Keycloak Setup using Docker Compose

In this step, we will set up a **Keycloak server** locally using Docker Compose, which will act as our Identity Provider (IdP) for authentication.

---

## 1. Project Directory Structure

```
auth-system/
│
├── keycloak/
│ ├── docker-compose.yml
│ └── keycloak-themes/megatron-login ← Custom themes go here (optional)
|                     |__ theme.properties
|                     |__ login
|                     |    |__ common.ftl
|                     |    |__ login.ftl
|                     |    |__ register.ftl
|                     |__ resources/css
|                     |             |__style.css

```

---

## 2. `docker-compose.yml`

```yaml
services:
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    container_name: keycloak
    ports:
      - "8080:8080"
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
      KC_DB: postgres
      KC_DB_URL_HOST: keycloak-db
      KC_DB_URL_PORT: 5432
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: keycloak
    depends_on:
      - keycloak-db
    volumes:
      - ./keycloak-themes:/opt/keycloak/themes
    command:
      [
        "start-dev",
        "--spi-theme-login-default=megatron-login",
        "--spi-theme-welcome-default=base",
      ]

  keycloak-db:
    image: postgres:15
    container_name: keycloak-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: keycloak
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 3. `Keycloak custom theme`

- theme.properties

```properties
parent=base
import=common/keycloak
```

- login.ftl

```ftl
<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true; section>
  <div class="megatron-login-box">
    <h1>Login to Megatron Store</h1>
    <form id="kc-form-login" action="${url.loginAction}" method="post">
      <input type="text" name="username" placeholder="Username or Email" class="input-field"/><br/>
      <input type="password" name="password" placeholder="Password" class="input-field"/><br/>
      <input type="submit" value="Login" class="btn-login"/>
    </form>
    <a href="${url.registrationUrl}">Register</a>
  </div>
</@layout.registrationLayout>
```

- register.ftl

```ftl
<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true; section>
  <div class="megatron-login-box">
    <h1>Register at Megatron Store</h1>
    <form id="kc-register-form" action="${url.registrationAction}" method="post">
      <input type="text" id="username" name="username" placeholder="Username" class="input-field"/><br/>
      <input type="text" id="email" name="email" placeholder="Email" class="input-field"/><br/>
      <input type="password" id="password" name="password" placeholder="Password" class="input-field"/><br/>
      <input type="password" id="password-confirm" name="password-confirm" placeholder="Confirm Password" class="input-field"/><br/>
      <input type="submit" value="Register" class="btn-login"/>
    </form>
    <a href="${url.loginUrl}">Back to Login</a>
  </div>
</@layout.registrationLayout>
```

- style.css

```css
body {
  background-color: #f4f6f9;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.megatron-login-box {
  max-width: 400px;
  margin: 60px auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.input-field {
  width: 90%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.btn-login {
  width: 95%;
  background-color: #0066cc;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-login:hover {
  background-color: #004b99;
}
```

---

## 4. `Start keycloak`

```cmd
cd keycloak
```

```docker
 docker-compose up -d
```
