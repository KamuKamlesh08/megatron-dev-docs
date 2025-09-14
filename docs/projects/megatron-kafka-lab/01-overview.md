# Kafka: From Legacy Integration to Real-Time Event Streaming

## 1. Before Kafka Systems

Before Kafka, organizations relied on a mix of:

- **Database Polling** – Applications directly wrote to/queried a shared database.
- **File Transfer (FTP, shared CSVs/XMLs)** – One system generated a file, another picked it up.
- **Traditional Message Queues (JMS, RabbitMQ, ActiveMQ)** – Queues decoupled systems but had limited throughput and lacked durable history.

---

## 2. Problems With These Approaches

- **Tight Coupling**: Producers and consumers were bound to specific database schemas or queue contracts.
- **Latency**: Polling or batch file transfers introduced delays, preventing real-time processing.
- **Scaling Bottlenecks**: Databases and legacy queues struggled with high event throughput.
- **Data Loss / No Replay**: Once a message was consumed from a queue, new consumers could not access past events.
- **Operational Complexity**: Error handling, retries, and compensations were fragile and duplicated across services.
- **Poor Fan-out**: Adding new downstream systems required producer code changes.

---

## 3. How Kafka Resolved These Issues

- **High Throughput & Low Latency**: Handles millions of events per second in real time.
- **Durable Commit Log**: Events stored on disk can be replayed by new consumers at any time.
- **Loose Coupling**: Producers just publish to topics; consumers independently subscribe.
- **Scalability**: Partitioning and replication allow horizontal scaling and fault tolerance.
- **Fan-out by Design**: Any number of services (CRM, Analytics, Audit, Notifications) can consume the same topic.
- **Backpressure Handling**: Kafka buffers spikes in traffic without overwhelming downstream services.
- **Audit-Friendly**: Immutable, ordered log provides a natural audit trail.

---

## 4. Real-Time Banking Onboarding Example

### Actors

- **Customer (Kamu Kamlesh)** – Uses mobile/web app to apply for an account.
- **Identity Service** – Runs KYC + AML checks.
- **Account Service** – Creates account if identity is verified.
- **Notify Service** – Sends SMS/Email/Push updates.

### Flow With Kafka

1. **Customer Onboarding Request**
   - Kamu Kamlesh submits details via Mobile App → API publishes `customer.onboarding.requested`.
2. **Identity Verification**
   - Identity Service consumes onboarding event → publishes `customer.identity.verified` (or `customer.identity.failed`).
3. **Account Creation**
   - Account Service consumes verified event → publishes `account.created`.
4. **Notifications**
   - Notify Service consumes both success (`account.created`) and failure (`identity.failed`) → publishes `customer.notified`.

### Advantages Over Sync APIs

- API responds instantly (“Your request is received”), while downstream services process asynchronously.
- Failure in one service does not block the whole flow; events wait in Kafka until recovery.
- New consumers (CRM, Analytics, Audit) can attach later and replay history.
- Clear audit trail of every step (requested, verified, created, notified).

---

## 5. Sync API vs Kafka Async (Quick Comparison)

| Aspect              | Sync API (Before Kafka)                | Kafka Async (Event Streaming)                 |
| ------------------- | -------------------------------------- | --------------------------------------------- |
| **Coupling**        | Tightly coupled, direct dependencies   | Loosely coupled via topics                    |
| **Latency**         | End-to-end chain adds cumulative delay | API responds fast; processing async           |
| **Scalability**     | Limited by DB/queue bottlenecks        | Horizontally scalable (partitions, groups)    |
| **Error Handling**  | Cascading failures, retries complex    | Failures isolated, events retried safely      |
| **Replay**          | Not possible (once consumed = gone)    | Consumers can replay from log anytime         |
| **Fan-out**         | Adding new consumer = code changes     | New consumers attach without producer changes |
| **Audit**           | Hard to stitch logs                    | Natural immutable event trail                 |
| **User Experience** | Delays, “spinner” till all done        | Quick ACK (“Your request is received”)        |

---

## 5. Banking Platform

![Banking Platform](/img/kafka/banking-platform.png)
