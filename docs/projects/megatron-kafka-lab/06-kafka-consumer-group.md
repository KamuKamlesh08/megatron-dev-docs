# Kafka Consumers & Consumer Groups

---

## 1. What is a Consumer?

- A **Consumer** is an application that reads messages from a Kafka topic.
- It can read from one or multiple partitions.
- Consumers process the messages and usually commit offsets to track progress.

**Train Analogy:**

- Imagine a **ticket checker** in a train compartment.
- He checks passengers (messages) one seat (offset) at a time.
- Like a consumer, he proceeds in order without skipping.

---

## 2. What is a Consumer Group?

- A **Consumer Group** is a team of consumers working together to consume a topic.
- All consumers in a group share the same **group.id**.
- Kafka ensures:
  - Each partition is consumed by **only one consumer in the group**.
  - Across different groups, the same partition can be consumed independently.

**Train Analogy:**

- A full **team of ticket checkers** assigned to a train.
- Rule: One compartment (partition) → only one ticket checker in that group.
- If 3 compartments exist:
  - **1 checker only:** He must inspect all 3 compartments (slow).
  - **3 checkers:** Each gets 1 compartment (balanced & fast).
  - **5 checkers:** Two remain idle (no two checkers can inspect the same compartment in the same group).

---

## 3. Why are Consumer Groups Needed?

### a) Parallelism

- Multiple consumers can read different partitions at the same time.
- More checkers → faster verification of passengers.

### b) Scalability

- Add more consumers in a group to handle higher load.
- Add more checkers when the train is long and crowded.

### c) Fault Tolerance

- If one consumer fails, Kafka reassigns its partitions to another consumer in the group.
- If one checker leaves mid-journey, the others take over his compartments.

---

## 4. Real-Time Scenarios

### Scenario 1: Multiple services need the same message

- Bank has a topic `onboarding-requested`.
- **Onboarding Service** pushes messages to the topic.
- **KYC Management Service** consumes messages for identity verification.
- **Notification Service** also consumes the same messages to send SMS/emails.

**Solution:**

- Each service belongs to a **different consumer group**.
- Kafka delivers the same message independently to each group.
- Each group maintains its own offsets.

**Analogy:**

- Two different teams of ticket checkers inspect the same train but for different purposes (tickets vs. luggage).

---

### Scenario 2: Same service has multiple instances

- The bank’s **KYC Management Service** runs 2 instances for load-balancing.
- Both instances belong to the **same consumer group**.
- Kafka divides partitions between them (no duplicates).
- Only one instance processes messages from a partition at a time.

**Example:**

- If the topic has 2 partitions and there are 2 instances → each instance gets 1 partition.
- If there are 3 instances but only 2 partitions → 1 instance stays idle.

**Analogy:**

- Two ticket checkers from the same team split compartments.
- One checker cannot re-check a compartment already assigned to another in the same group.

---

## 5. FAQ

### What happens if consumers > partitions?

- Extra consumers remain **idle** because a partition can be assigned to only one consumer in a group.
- Example: 3 compartments and 5 checkers → 2 checkers sit idle.

---

### Can two different consumer groups read the same topic?

- Yes. Each group maintains its own offsets.
- Example: One team checks tickets, another checks luggage. Both inspect the same passengers independently.

---

### What happens when a new consumer joins a group?

- Kafka triggers **rebalancing** and redistributes partitions among all consumers.
- Example: A new checker joins → compartments are re-divided.

---

### What happens when a consumer crashes or leaves?

- Kafka reassigns that consumer’s partitions to the remaining consumers.
- Example: If one checker leaves, the others share his compartments.

---

## Quick Recap

- **Consumer = Ticket checker** → reads messages from a partition.
- **Consumer Group = Team of ticket checkers** → partitions divided among them.
- **Scenario 1:** Different services → different groups → all receive the same messages.
- **Scenario 2:** Multiple instances of the same service → same group → partitions split, no duplicates.
- **Advantages:** Parallelism, Scalability, Fault Tolerance.
