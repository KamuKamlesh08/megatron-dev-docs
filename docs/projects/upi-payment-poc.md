# 💳 UPI Payment Gateway Integration (POC)

**Tech Stack**: Spring Boot, Razorpay/PhonePe API, PostgreSQL, Docker

## ✅ Use Case

- Build a payment microservice that allows users to pay via UPI apps
- Simulate UPI callback handling and transaction validation

## 🔗 Flow

1. User adds item to cart and initiates checkout
2. UPI payment link is generated using external API
3. Transaction callback handled asynchronously
4. Success/failure is updated in order service

## 🔧 Features

- Webhook endpoint for UPI callbacks
- Transaction signature validation
- Order status sync
- UPI transaction audit logs

## 🖼️ Architecture

![UPI Diagram](/img/upi-arch.png)

## 📘 Learnings

- How to mock UPI gateway during dev
- Security checks with HMAC signatures
- Callback idempotency

🔗 [GitHub Repo](https://github.com/kamukamlesh/upi-payment-poc)
