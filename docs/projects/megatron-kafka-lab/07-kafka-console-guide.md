# Kafka Console Testing Guide (Docker Setup)

This guide explains how to test Kafka basics using console producer/consumer inside Docker.

---

## Step 0: Access Kafka container

```bash
docker compose exec -it kafka bash
```

---

## Scenario 1: Produce message with key

### Create topic

```bash
/opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092   --create --topic onboarding-requested --partitions 1 --replication-factor 1
```

### Verify topic

```bash
/opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092 --list
```

### Produce (with key)

```bash
/opt/bitnami/kafka/bin/kafka-console-producer.sh   --bootstrap-server kafka:9092   --topic onboarding-requested   --property parse.key=true   --property key.separator=:
```

### Consume (from beginning)

```bash
/opt/bitnami/kafka/bin/kafka-console-consumer.sh   --bootstrap-server kafka:9092   --topic onboarding-requested   --from-beginning   --property print.key=true   --property print.partition=true
```

---

## Scenario 2: Produce message without key

### Produce (no key)

```bash
/opt/bitnami/kafka/bin/kafka-console-producer.sh   --bootstrap-server kafka:9092   --topic onboarding-requested
```

### Consume (from beginning)

```bash
/opt/bitnami/kafka/bin/kafka-console-consumer.sh   --bootstrap-server kafka:9092   --topic onboarding-requested   --from-beginning   --property print.key=true   --property print.partition=true
```

### Note

- Without `--from-beginning`, consumer will only read **new messages**.
- This is a **console consumer without group** → offsets are **not committed**.

---

## Scenario 3: Console consumer with --group

### Run consumer with group

```bash
/opt/bitnami/kafka/bin/kafka-console-consumer.sh   --bootstrap-server kafka:9092   --topic onboarding-requested   --group group-kyc   --property print.key=true   --property print.partition=true
```

### Behavior

- Consumer commits offsets in `__consumer_offsets`.
- If restarted, resumes from last committed offset.
- `--from-beginning` applies only if group is new and has no committed offsets.

---

## Scenario 4: Consumers in same group (1 partition)

### Start two consumers in same group (in two terminals)

```bash
/opt/bitnami/kafka/bin/kafka-console-consumer.sh   --bootstrap-server kafka:9092   --topic onboarding-requested   --group group-kyc   --property print.key=true   --property print.partition=true
```

```bash
/opt/bitnami/kafka/bin/kafka-console-consumer.sh   --bootstrap-server kafka:9092   --topic onboarding-requested   --group group-kyc   --property print.key=true   --property print.partition=true
```

### Produce messages

```bash
/opt/bitnami/kafka/bin/kafka-console-producer.sh   --bootstrap-server kafka:9092   --topic onboarding-requested   --property parse.key=true   --property key.separator=:
```

### Observation

- Only **one consumer** will receive messages (since topic has 1 partition).

---

## Scenario 5: Consumers in same group (2 partitions)

### Create topic with 2 partitions

```bash
/opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092   --create --topic kyc-request --partitions 2 --replication-factor 1
```

### Start two consumers in same group (different terminals)

```bash
/opt/bitnami/kafka/bin/kafka-console-consumer.sh   --bootstrap-server kafka:9092   --topic kyc-request   --group group-kyc   --property print.key=true   --property print.partition=true
```

```bash
/opt/bitnami/kafka/bin/kafka-console-consumer.sh   --bootstrap-server kafka:9092   --topic kyc-request   --group group-kyc   --property print.key=true   --property print.partition=true
```

### Produce messages

```bash
/opt/bitnami/kafka/bin/kafka-console-producer.sh   --bootstrap-server kafka:9092   --topic kyc-request   --property parse.key=true   --property key.separator=:
```

### Observation

- Consumers split partitions → each one reads its assigned partition.
- Same key always goes to the same partition.

---

## Scenario 6: Consumers in different groups

### Start consumer in a different group

```bash
/opt/bitnami/kafka/bin/kafka-console-consumer.sh   --bootstrap-server kafka:9092   --topic kyc-request   --group notify-kyc   --property print.key=true   --property print.partition=true
```

### Observation

- Consumers in `group-kyc` share partitions (load balancing).
- Consumer in `notify-kyc` receives **all messages independently**.
- Real-world use:
  - Same group = scaling/load balancing.
  - Different groups = different services consuming same data for different purposes.

---

## Useful Verification Commands

### List topics

```bash
/opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092 --list
```

### Describe consumer group

```bash
/opt/bitnami/kafka/bin/kafka-consumer-groups.sh   --bootstrap-server kafka:9092   --describe --group group-kyc
```

---

## Recap

- Without group: ephemeral consumer, no offset tracking.
- With group: offsets committed, resumes from last point.
- Same group + multiple consumers: partitions are split.
- Different groups: each gets all messages.
