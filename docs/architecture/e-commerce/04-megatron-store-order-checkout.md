---
id: 04-megatron-store-order-checkout
title: Megatron Store – Order Checkout Flow
sidebar_position: 4
---

# Megatron Store – Order Checkout Flow (Event Driven)

This document explains the **Order Checkout** architecture and flow in Megatron Store, using a scalable, event-driven, microservices approach. The system leverages REST for synchronous calls and Kafka for asynchronous event-driven communication. All services are built with Spring Boot, use MySQL for persistence, and Redis for caching.

---

## Real-Time Example

**Scenario:**  
Ravi, a user from Delhi, adds an iPhone 15 and a Laptop to his cart. He proceeds to checkout and pays using UPI. The system must validate his cart, reserve inventory, process payment, and notify him of the order status.

---

## Step-by-Step Flow

1. **User Initiates Checkout**  
   Ravi clicks "Checkout" on the web/mobile UI.  
   → UI sends a REST request to the API Gateway.

2. **API Gateway Fetches Cart**  
   API Gateway calls Cart Service to get Ravi's cart details.  
   → Cart Service fetches the cart/session from Redis.

3. **Cart Service Returns Cart**  
   Cart Service returns the cart items and prices to the API Gateway.

4. **API Gateway Creates Order**  
   API Gateway sends a REST request to Order Service to create a new order with the cart details.

5. **Order Service Writes Order**  
   Order Service writes a new order (status=CREATED) to the orders_db.

6. **Order Service Publishes OrderPlaced Event**  
   Order Service publishes an `OrderPlaced` event to Kafka for downstream processing.

7. **Inventory Reservation (Async)**  
   Kafka triggers Inventory Service to reserve stock for the order.  
   → Inventory Service updates inventory_db.

8. **Inventory Service Publishes Result**  
   Inventory Service publishes an `InventoryReserved` or `InventoryFailed` event to Kafka.

9. **Payment Processing (Async)**  
   Kafka triggers Payment Service to process payment for the order.  
   → Payment Service creates a payment transaction in payment_db and calls the external Payment Gateway (e.g., UPI).

10. **Payment Service Publishes Result**  
    Payment Service publishes a `PaymentConfirmed` or `PaymentFailed` event to Kafka.

11. **Order Service Updates Status**  
    Order Service consumes payment/inventory events from Kafka and updates the order status in orders_db (e.g., CONFIRMED, FAILED).

12. **User Notification**  
    Order Service notifies Notification Service (sync REST call) about the order status.  
    → Notification Service sends email/SMS to Ravi and also publishes a notification event to Kafka for logging/metrics.

---

## Architecture Diagram

## Diagram

![Order Checkout](/img/ecom/ecom-checkout.png)

## UI/UX Design

![Order Checkout Page](/img/ecom/checkout-page-ui.png)

![Order Confirmed Page](/img/ecom/order-confirm-page-ui.png)
