---
id: 01-home-page
title: User Initial Load & Personalized Homepage
sidebar_position: 1
---

# Architecture Decision Record (ADR): User Initial Load & Personalized Homepage

## Status

Accepted

## Context

For a world-class e-commerce experience, Megatron Store must deliver a fast, personalized homepage as soon as a user opens the website or app. This means:

- Detecting the user's location (city) on first load.
- Fetching trending products for that location and selected category.
- Showing personalized recommendations based on user profile and history.
- Displaying the user's active cart items.

The system must ensure this data is fetched with minimal latency, using Redis caching for both location/category-based and user-specific data, and must be robust to cache misses and backend failures.

## Decision

**Production-Ready Initial Load Flow:**

1. **Location Detection (Frontend):**

   - On website/app open, the frontend attempts to detect the user's city using:
     - User profile (if logged in)
     - Browser geolocation (with user permission)
     - IP-based geolocation (fallback)
   - The detected city is sent to the backend via the API Gateway.

2. **Backend Aggregation (API Gateway/Orchestrator):**

   - The backend orchestrates parallel requests to:
     - **Product Service:** For trending products by (city, category).
     - **Recommendation Service:** For personalized recommendations (if user is logged in).
     - **Cart Service:** For user's cart items (if user is logged in).

3. **Redis Caching Strategy:**

   - **Trending Products:**
     - Key: `trending:{city}:{category}`
     - On cache hit: Return cached list.
     - On cache miss: Product Service queries MySQL, updates Redis (with short TTL, e.g., 10-15 min), and returns data.
   - **Personalized Recommendations:**
     - Key: `recommend:{userId}`
     - On cache hit: Return cached recommendations.
     - On cache miss: Recommendation Service computes, updates Redis (short TTL), and returns.
   - **Cart Items:**
     - Key: `cart:{userId}`
     - On cache hit: Return cart from Redis.
     - On cache miss: Cart Service loads from MySQL, updates Redis, and returns.

4. **Parallelization & Fallbacks:**

   - All three data fetches are performed in parallel for minimal latency.
   - If any service is slow or fails, backend returns partial data (e.g., trending only) with appropriate UI messaging.
   - If user is not logged in, only trending products are fetched.

5. **Frontend Rendering:**

   - The frontend receives a single aggregated response and renders:
     - Trending products for the detected city/category.
     - Personalized recommendations (if available).
     - Cart items (if available).

6. **Cache Invalidation & Freshness:**
   - Trending and recommendation caches use short TTLs to ensure freshness.
   - Cart cache is invalidated on cart update events (add/remove/checkout).

## Consequences

- **+** Users see a fast, personalized homepage on every visit.
- **+** Redis caching ensures low latency and reduces DB/service load.
- **+** Parallel backend orchestration minimizes total response time.
- **+** Graceful fallback ensures partial data is shown even if some services are slow/down.
- **–** Requires careful cache key design, TTL tuning, and error handling.
- **–** Slightly increased complexity in backend orchestration and monitoring.

## Example Flow

**Ravi opens Megatron Store from Delhi:**

1. Frontend detects city as "Delhi" (via profile or geolocation) and sends it to backend.
2. Backend (API Gateway/Orchestrator) triggers parallel fetches:
   - Trending products for (Delhi, Electronics) from Redis/Product Service.
   - Personalized recommendations for Ravi from Redis/Recommendation Service.
   - Ravi's cart from Redis/Cart Service.
3. If any data is missing in Redis, respective service loads from MySQL, updates Redis, and returns.
4. Backend aggregates all available data and sends to frontend.
5. Frontend displays trending, personalized, and cart items instantly.

## Data Caching Logic

- **Trending Products Key:** `trending:{city}:{category}`
- **User Recommendations Key:** `recommend:{userId}`
- **User Cart Key:** `cart:{userId}`

If any key is missing in Redis, backend fetches from source, sets in Redis, and serves the response.

## Architecture Diagram

![User Personalized Homepage](/img/ecom/ecom-homepage.png)

## UI/UX Design

![Megatron Store Home Page](/img/ecom/home-page-ui.png)

---

**Decision by:** Megatron Store Backend Team  
**Date:** 15-August-2025
