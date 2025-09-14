# Kafka Partitions

---

## 1. What is a Partition?

- A **Partition** is a sub-division of a Kafka Topic.
- Each partition is an **append-only log** where messages are stored in sequence.

```
append-only log means - append (add at end). (Random update/insert/delete not allowed)
(deletion of messages take cares by retention policy)
```

- Every message in a partition has a unique number called an **Offset**.

**Train Analogy:**

- The **Topic is the train**.
- The train has multiple **compartments**, which represent the **Partitions**.
- Inside each compartment, seats are arranged in order — these are the **Offsets**.
- A passenger (message) gets a seat (offset) inside one compartment (partition).

---

## 2. Advantages of Partitions

### a) Scalability

- More partitions → more consumers can read in parallel.
- This increases throughput.

**Train Analogy:**

- If the train has only **one compartment**, only **one ticket checker** can verify passengers → very slow.
- If the train has **ten compartments**, ten ticket checkers can work **in parallel** → faster processing.

---

### b) Ordering (within a partition)

- Kafka guarantees order **within a partition**.
- Across partitions, global ordering is **not guaranteed**.

**Train Analogy:**

- Inside Compartment-1, passengers are seated as Seat #0, Seat #1, Seat #2 → order fixed.
- Compartment-2 has its own independent seat numbers.
- Each compartment’s order is preserved, but across compartments, the order can differ.

---

### c) High Throughput

- With multiple partitions, Kafka can spread messages across them.
- This allows better load balancing and utilization of multiple servers.

**Train Analogy:**

- A train with many compartments can carry **more passengers at once**.
- Similarly, a topic with more partitions can handle **more messages at higher speed**.

---

## 3. Which Message Goes to Which Partition?

Kafka decides partition placement in two ways:

### a) With Key

- If a **key** (e.g., `customerId`) is provided, Kafka uses:

```
partition = hash(key) % total_partitions
```

- All messages with the same key always go to the **same partition**.

**Example:**

- Key = `"virat"` → Partition-1
- Key = `"rohit"` → Partition-0
- Key = `"kamlesh"` → Partition-2

**Train Analogy:**

- Passengers are grouped by **ticket ID**. All tickets with the same ID always go to the **same compartment**.

---

### b) Without Key

- If no key is given, Kafka uses a **sticky partitioner** (or round-robin).
- Messages are distributed across partitions for load balancing.
- The same customer’s messages may end up in **different partitions**, so ordering is not guaranteed.

**Example:**

- Virat’s first event → Partition-0
- Virat’s second event → Partition-2
- Ordering per customer is broken.

**Train Analogy:**

- If passengers don’t have assigned ticket IDs, they are seated randomly in any available compartment.
- Next time, they might be seated in a different compartment.

---

## Quick Recap

- **Partition = Train compartment**
- **Offset = Seat number**
- **Advantages:** Scalability | Ordering per partition | High Throughput
- **Partitioning decision:**
  - With Key → deterministic (same key → same partition)
  - Without Key → round-robin/sticky, ordering per customer not guaranteed

---

# (Kafka Partitions)

![Order Partition](/img/kafka/kafka-partition.png)
