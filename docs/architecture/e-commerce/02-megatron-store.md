---
id: 02-megatron-store
title: Megatron Store - Database Design
sidebar_position: 2
---

# Megatron Store - Database Design

This document explains the database schema and flow for the **Megatron Store** e-commerce application.

---

## Database Schema Overview

The database schema contains the following tables:

1. **users**

   - Stores customer information.
   - Fields: id, name, email, password, city, created_at.
   - Example: `User from Delhi named Ravi with email ravi@example.com`.

2. **categories & subcategories**

   - Categories: Electronics, Fashion, Home, Beauty, Grocery.
   - Subcategories: Mobiles, Laptops, Clothing, etc.

3. **products**

   - Each product belongs to a subcategory and is available in multiple cities.
   - Fields: id, subcategory_id, name, description, price.

4. **inventory**

   - Tracks stock per product per city.
   - Fields: id, product_id, city_id, stock.
   - Example: iPhone 15 -> Delhi -> 20 units.

5. **orders**

   - Stores order-level details for each purchase.
   - Fields: id, user_id, total_amount, order_date, status.

6. **order_items**

   - Line items under an order (specific products and quantities).
   - Fields: id, order_id, product_id, quantity, price.
   - Example: Order #12 contains 2 iPhones and 1 Laptop.

7. **offers**
   - Discounts or promotional offers on categories or products.
   - Fields: id, offer_name, discount_percent, category_id (nullable), product_id (nullable), valid_from, valid_to.

---

## Flow Explanation (Step by Step)

### 1. User Browsing

- A **user** opens the Megatron Store website.
- The **location (city)** is detected.
- Products are shown from **inventory** where stock is available in that city.

### 2. Category/Subcategory Navigation

- Products are grouped by **category** and **subcategory**.
- Example: Electronics → Mobiles → iPhone 15.

### 3. Adding to Cart (Not stored in DB yet)

- When a product is added to cart, system checks `inventory` stock.

### 4. Order Placement

- User confirms checkout.
- A new row is created in **orders** table.
- Corresponding **order_items** rows are created for each product in cart.

### 5. Inventory Update

- After successful order, `inventory.stock` is reduced per city.

### 6. Applying Offers/Discounts

- At checkout, system checks **offers** table.
- If any discount applies (per category or product), total order amount is updated.

### 7. Order History

- User can view their past **orders** and **order_items**.

---

## Example Data Flow

- **Ravi (Delhi)** logs in.
- Browses **Electronics → Mobiles**.
- Sees **iPhone 15 (20 units in Delhi)**.
- Adds 1 iPhone to cart.
- Places order → Creates row in `orders` + `order_items`.
- Inventory for iPhone in Delhi decreases to 19.
- If an **offer (10% on Electronics)** is active, final bill is discounted.

---

## How to Import SQL

```bash
mysql -u root -p megatron_store < megatron_store_full.sql
```

---

## Future Enhancements

- Shopping cart table.
- Payment transactions table.
- Reviews and ratings table.
- Wishlists and saved items.

---

**Author:** Megatron Store Backend Team
