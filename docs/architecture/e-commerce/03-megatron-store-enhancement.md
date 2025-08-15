---
id: 03-megatron-store-enhancement
title: Megatron Store - Database Design Enhancements
sidebar_position: 3
---

# Megatron Store - Database Design

This document explains the database schema and flow for the **Megatron Store** e-commerce application.

---

## Future Enhancements (Detailed Design)

To extend Megatron Store into a more production-ready system, we add the following new tables:

### 1. `carts` and `cart_items`

These tables track products a user intends to purchase before checkout.

- **carts**

  - `cart_id` (PK)
  - `user_id` (FK → users)
  - `status` (active, ordered, abandoned)
  - `created_at`, `updated_at`

- **cart_items**
  - `cart_item_id` (PK)
  - `cart_id` (FK → carts)
  - `product_id` (FK → products)
  - `quantity`
  - `price_snapshot` (stores product price at the time of adding)

**Flow:**  
User adds products into a cart. When checkout happens, these rows migrate to `orders` and `order_items`.

---

### 2. `payment_transactions`

Captures all payment activities for orders.

- `payment_id` (PK)
- `order_id` (FK → orders)
- `user_id` (FK → users)
- `amount`
- `payment_method` (UPI, Card, Net Banking, COD)
- `provider` (Razorpay, Stripe, PayPal, etc.)
- `status` (initiated, authorized, captured, failed, refunded)
- `transaction_ref` (gateway reference ID)
- `transaction_date`

**Flow:**  
Whenever a user checks out, a row is created here. Payment status updates drive the order status (e.g., from `Pending` → `Confirmed`).

---

### 3. `product_reviews`

Allows customers to leave reviews and ratings.

- `review_id` (PK)
- `product_id` (FK → products)
- `user_id` (FK → users)
- `rating` (1–5)
- `title`
- `comment`
- `verified_purchase` (boolean)
- `status` (visible, hidden)
- `created_at`

**Flow:**  
After purchasing, users can review a product. Verified purchases are highlighted. These reviews help drive recommendations and trust.

---

### 4. `wishlists` and `wishlist_items`

Let users save items for later.

- **wishlists**

  - `wishlist_id` (PK)
  - `user_id` (FK → users)
  - `name`
  - `is_default`
  - `created_at`

- **wishlist_items**
  - `wishlist_item_id` (PK)
  - `wishlist_id` (FK → wishlists)
  - `product_id` (FK → products)
  - `added_at`

**Flow:**  
Users can create multiple wishlists (e.g., “Work Laptop,” “Birthday Gift”) and save items there. Marketing jobs can notify users if wishlist items go on sale.

---

### 5. `saved_items`

Quick “save for later” option without creating a wishlist.

- `saved_id` (PK)
- `user_id` (FK → users)
- `product_id` (FK → products)
- `note` (optional)
- `saved_at`

**Flow:**  
When a user removes an item from cart but doesn’t want to lose it, it can be moved into `saved_items`.

---

## Updated Flow With Enhancements

1. **User Browsing**
   - Products shown by location and category.
2. **Cart Phase**
   - User adds items to cart (`carts`, `cart_items`).
3. **Checkout**
   - Cart → `orders` + `order_items`.
   - Payment row created in `payment_transactions`.
4. **Payment Gateway**
   - Updates transaction status.
   - On success, order confirmed and inventory reduced.
5. **Post-Purchase**
   - User leaves reviews (`product_reviews`).
   - Unpurchased items stay in `wishlists` or `saved_items`.

---

**Next Steps:**  
These enhancements make Megatron Store feature-rich and closer to a real-world e-commerce platform.
