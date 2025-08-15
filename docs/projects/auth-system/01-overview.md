---
id: 01-overview
title: Auth System Overview
sidebar_position: 1
---

# Authentication System Overview

This document provides a high-level overview of the authentication system used in the Megatron project. The system is based on **Keycloak** for identity and access management, integrated with **React** as frontend and **Spring Boot** as backend.

## Why Keycloak?

- Open-source and enterprise-grade
- Built-in support for OAuth2, OpenID Connect, SAML
- Easily integrates with Spring Boot and frontend clients
- Support for multi-tenancy using realms

## Goals of the Auth System

- Secure login and token-based authentication
- Role-based access control
- Custom login theme (branding)
- Easily deployable using Docker Compose
- Infrastructure as Code using Terraform

## Technology Stack

| Layer       | Tech Used                  |
| ----------- | -------------------------- |
| Auth Server | Keycloak                   |
| Frontend    | React + Keycloak Web       |
| Backend     | Spring Boot (JWT)          |
| Infra       | Docker Compose / Terraform |

## Upcoming Modules

- Docker Compose setup
- Custom Keycloak theme
- React integration with Keycloak
- Spring Boot backend integration
- Terraform infra automation
- Architecture diagram

---

**Next:** [Keycloak Setup with Docker Compose](./02-keycloak-setup-docker-compose.md)
