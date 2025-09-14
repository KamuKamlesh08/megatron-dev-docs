# Kafka Advanced Console Lab

This lab extends the basics and shows advanced console-only Kafka testing flows.

---

## Step 1: Topic describe and configs

### Create or verify topic

```bash
/opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092   --create --topic onboarding-requested --partitions 1 --replication-factor 1
```

### Describe topic

```bash
/opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092   --describe --topic onboarding-requested
```

### Change retention and verify

```bash
/opt/bitnami/kafka/bin/kafka-configs.sh --bootstrap-server kafka:9092   --alter --entity-type topics --entity-name onboarding-requested   --add-config retention.ms=60000

/opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092   --describe --topic onboarding-requested
```

---

## Step 2: Increase partitions and observe

```bash
/opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092   --alter --topic onboarding-requested --partitions 3

/opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092   --describe --topic onboarding-requested
```

Produce same keys again and check partition assignment with `print.partition=true`.

---

## Step 3: Consumer lag monitoring

```bash
/opt/bitnami/kafka/bin/kafka-consumer-groups.sh   --bootstrap-server kafka:9092   --describe --group group-kyc
```

---

## Step 4: Offset reset demos

### Earliest

```bash
/opt/bitnami/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka:9092   --group group-kyc --topic onboarding-requested   --reset-offsets --to-earliest --execute
```

### Latest

```bash
/opt/bitnami/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka:9092   --group group-kyc --topic onboarding-requested   --reset-offsets --to-latest --execute
```

### By duration (last 24 hours)

```bash
/opt/bitnami/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka:9092   --group group-kyc --topic onboarding-requested   --reset-offsets --by-duration PT24H --execute
```

### Specific offset

```bash
/opt/bitnami/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka:9092   --group group-kyc --topic onboarding-requested:0   --reset-offsets --to-offset 10 --execute
```

Use `--dry-run` before `--execute` to preview.

---

## Step 5: Per-key ordering guarantee

Produce multiple events with same key and verify all land in the same partition in order.

---

## Step 6: Sticky partitioning without key

Run producer without key and send multiple messages quickly:

```bash
/opt/bitnami/kafka/bin/kafka-console-producer.sh   --bootstrap-server kafka:9092 --topic onboarding-requested
```

Observe how batches stick to partitions temporarily.

---

## Step 7: Headers via REST Proxy (if available)

```bash
curl -X POST -H "Content-Type: application/vnd.kafka.json.v2+json"   --data '{"records":[{"value":{"e":"x"},"headers":[{"key":"traceId","value":"dHJhY2Ux"}]}]}'   http://localhost:8082/topics/onboarding-requested
```

Headers are base64-encoded.

---

## Step 8: Multiple topics fan-out

Create additional topics and consumers in different groups. Observe one producer event being consumed by multiple services.

---

## Step 9: Auto-create off validation

With `KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=false`, try producing to a nonexistent topic and check that it fails.

---

## Step 10: Cleanup patterns

- With named volume: `docker compose down -v` wipes all data.
- With bind mount: manually delete `./data` folder for a clean start.

---

## Step 11: Delete topic and verify

```bash
/opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092   --delete --topic onboarding-requested

/opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092 --list
```

---

## Step 12: Producer acknowledgements (concept)

Console producer uses default `acks=1`.  
For advanced durability (`acks=all`, `enable.idempotence=true`), test with code-based producers.

---

## Step 13: Rebalance demo

- Start 2 consumers in same group.
- Add a third consumer.
- Observe temporary pause and new partition assignments:

```bash
/opt/bitnami/kafka/bin/kafka-consumer-groups.sh   --bootstrap-server kafka:9092   --describe --group group-kyc
```

---

## Recap

- Use `describe` and `configs` to validate topics.
- Test partition increase and key routing.
- Monitor consumer lag.
- Reset offsets to earliest, latest, by duration or specific offset.
- Observe per-key ordering and sticky partitioning.
- Try fan-out with multiple groups.
- Validate auto-create setting, retention, and delete topics.
- Watch rebalance when consumers join or leave.
