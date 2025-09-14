# Kafka Lab via Docker Compose (KRaft & ZooKeeper)

This repository helps you run Apache **Kafka locally** in two ways:

1. **KRaft mode** (no ZooKeeper; modern, simpler)
2. **ZooKeeper-based** (legacy/compatible)

---

## 1) Project Layout

```
kafka-lab/
├─ docker-compose.yml            # KRaft setup (default)
├─ docker-compose.zookeeper.yml  # ZooKeeper-based setup (optional)
├─ .env                          # optional overrides
└─ docs/
   └─ Readme.md
```

---

## 2) Prerequisites

- Docker ≥ 24.x and Docker Compose plugin
- Free ports:
  - **KRaft**: 9099 (external), 8029 (Kafka-UI)
  - **ZooKeeper**: 2181 (ZK), 9094 (external), 8030 (Kafka-UI)
- On Windows, prefer **WSL2** backend

---

## 3) Optional `.env`

Create a `.env` if you want custom host/IP/ports.

```env
# KRaft
KAFKA_KRAFT_EXTERNAL_HOST=localhost
KAFKA_KRAFT_EXTERNAL_PORT=9099
KAFKA_UI_KRAFT_PORT=8029

# ZooKeeper stack
KAFKA_ZK_EXTERNAL_HOST=localhost
KAFKA_ZK_EXTERNAL_PORT=9094
KAFKA_UI_ZK_PORT=8030
```

> If you set these, update the compose files to reference the env vars.

---

## 4) `docker-compose.yml` (KRaft: Kafka 3.7, single node)

```yaml
version: "3.8"

services:
  kafka:
    image: bitnami/kafka:3.7
    container_name: kafka
    restart: unless-stopped
    ports:
      - "9099:9099" # EXTERNAL listener exposed to host
    environment:
      # --- KRaft (no ZooKeeper) ---
      KAFKA_ENABLE_KRAFT: "yes"
      KAFKA_CFG_NODE_ID: "1"
      KAFKA_CFG_PROCESS_ROLES: "broker,controller"
      KAFKA_CFG_CONTROLLER_LISTENER_NAMES: "CONTROLLER"
      KAFKA_CFG_CONTROLLER_QUORUM_VOTERS: "1@kafka:9093"

      # --- Listeners ---
      # Internal for docker network (kafka:9092), External for host (localhost:9099), Controller for quorum
      KAFKA_CFG_LISTENERS: "PLAINTEXT://:9092,EXTERNAL://:9099,CONTROLLER://:9093"
      KAFKA_CFG_ADVERTISED_LISTENERS: "PLAINTEXT://kafka:9092,EXTERNAL://localhost:9099"
      KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP: "PLAINTEXT:PLAINTEXT,EXTERNAL:PLAINTEXT,CONTROLLER:PLAINTEXT"

      # --- Broker tuning (dev) ---
      KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE: "false"
      KAFKA_CFG_NUM_PARTITIONS: "1"
      KAFKA_CFG_OFFSETS_TOPIC_REPLICATION_FACTOR: "1"
      KAFKA_CFG_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1"
      KAFKA_CFG_TRANSACTION_STATE_LOG_MIN_ISR: "1"
      KAFKA_CFG_ALLOW_EVERYONE_IF_NO_ACL_FOUND: "true"

    volumes:
      - kafka_data:/bitnami/kafka

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: kafka-ui
    restart: unless-stopped
    ports:
      - "8029:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: "local-kraft"
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: "kafka:9092"
    depends_on:
      - kafka

volumes:
  kafka_data:
```

### Start (KRaft)

```bash
docker compose up -d
# UI:
# http://localhost:8029
```

### Stop / Reset (KRaft)

```bash
docker compose down                # stop and keep data
docker compose down -v             # stop and delete data
```

---

## 5) `docker-compose.zookeeper.yml` (ZooKeeper-based)

> This stack runs one ZooKeeper + one Kafka broker + Kafka-UI (on a different port).

```yaml
version: "3.8"

services:
  zookeeper:
    image: bitnami/zookeeper:3.9
    container_name: zookeeper
    restart: unless-stopped
    environment:
      ALLOW_ANONYMOUS_LOGIN: "yes"
    ports:
      - "2181:2181"
    volumes:
      - zk_data:/bitnami/zookeeper

  kafka:
    image: bitnami/kafka:3.7
    container_name: kafka-zk
    restart: unless-stopped
    depends_on:
      - zookeeper
    ports:
      - "9094:9094" # external listener for host
    environment:
      # --- ZooKeeper mode ---
      KAFKA_ENABLE_KRAFT: "no"
      KAFKA_CFG_ZOOKEEPER_CONNECT: "zookeeper:2181"

      # --- Listeners: internal & external ---
      KAFKA_CFG_LISTENERS: "PLAINTEXT://:9092,EXTERNAL://:9094"
      KAFKA_CFG_ADVERTISED_LISTENERS: "PLAINTEXT://kafka-zk:9092,EXTERNAL://localhost:9094"
      KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP: "PLAINTEXT:PLAINTEXT,EXTERNAL:PLAINTEXT"

      # --- Broker tuning (dev) ---
      KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE: "false"
      KAFKA_CFG_NUM_PARTITIONS: "1"
      KAFKA_CFG_OFFSETS_TOPIC_REPLICATION_FACTOR: "1"
      KAFKA_CFG_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1"
      KAFKA_CFG_TRANSACTION_STATE_LOG_MIN_ISR: "1"
      KAFKA_CFG_ALLOW_EVERYONE_IF_NO_ACL_FOUND: "true"

    volumes:
      - kafka_zk_data:/bitnami/kafka

  kafka-ui-zk:
    image: provectuslabs/kafka-ui:latest
    container_name: kafka-ui-zk
    restart: unless-stopped
    ports:
      - "8030:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: "local-zk"
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: "kafka-zk:9092"
    depends_on:
      - kafka

volumes:
  zk_data:
  kafka_zk_data:
```

### Start (ZooKeeper-based)

```bash
docker compose -f docker-compose.zookeeper.yml up -d
# UI:
# http://localhost:8030
```

### Stop / Reset (ZooKeeper-based)

```bash
docker compose -f docker-compose.zookeeper.yml down
docker compose -f docker-compose.zookeeper.yml down -v
```

---

## 6) Quick Smoke Test (both stacks)

> Use the **internal** listener inside the container (`localhost:9092`) when executing CLI tools via `docker exec`.

Create topic:

```bash
# KRaft stack
docker exec -it kafka bash -lc "kafka-topics.sh --create \
  --topic quickstart --bootstrap-server localhost:9092 \
  --partitions 1 --replication-factor 1"

# ZooKeeper stack
docker exec -it kafka-zk bash -lc "kafka-topics.sh --create \
  --topic quickstart --bootstrap-server localhost:9092 \
  --partitions 1 --replication-factor 1"
```

List:

```bash
docker exec -it kafka bash -lc "kafka-topics.sh --list --bootstrap-server localhost:9092"
docker exec -it kafka-zk bash -lc "kafka-topics.sh --list --bootstrap-server localhost:9092"
```

Produce (inside container):

```bash
docker exec -it kafka bash -lc "kafka-console-producer.sh --broker-list localhost:9092 --topic quickstart"
# type a few lines, Ctrl+C to exit

docker exec -it kafka-zk bash -lc "kafka-console-producer.sh --broker-list localhost:9092 --topic quickstart"
```

Consume (inside container):

```bash
docker exec -it kafka bash -lc "kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic quickstart --from-beginning --timeout-ms 5000"
docker exec -it kafka-zk bash -lc "kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic quickstart --from-beginning --timeout-ms 5000"
```

---

## 7) Connectivity Cheat Sheet

| Scenario                                      | Bootstrap to use |
| --------------------------------------------- | ---------------- |
| Host apps (KRaft)                             | `localhost:9099` |
| Host apps (ZooKeeper)                         | `localhost:9094` |
| Containers on same Docker network (KRaft)     | `kafka:9092`     |
| Containers on same Docker network (ZooKeeper) | `kafka-zk:9092`  |

To allow **remote** machines to connect, replace `localhost` in the `KAFKA_CFG_ADVERTISED_LISTENERS` with your host IP/DNS and ensure firewall/port access.

---

## 8) Troubleshooting (both stacks)

| Symptom                      | Cause                        | Fix                                              |
| ---------------------------- | ---------------------------- | ------------------------------------------------ |
| Clients hang / can't connect | Wrong `advertised.listeners` | Set EXTERNAL to reachable host/IP; restart       |
| Kafka-UI shows no brokers    | Wrong bootstrap in UI env    | Use `kafka:9092` (KRaft) or `kafka-zk:9092` (ZK) |
| Port in use                  | Another process bound        | Change host ports or free the port               |
| Replica errors               | Single-node RF mismatch      | Keep replication factor = 1                      |
| Data persists after `down`   | Named volumes remain         | Use `down -v` to wipe                            |

Logs:

```bash
docker logs -f kafka
docker logs -f kafka-ui
docker logs -f zookeeper
docker logs -f kafka-zk
docker logs -f kafka-ui-zk
```

---

## 9) KRaft vs ZooKeeper — At a Glance

| Aspect              | **KRaft (Kafka Raft)**                | **ZooKeeper-based**           |
| ------------------- | ------------------------------------- | ----------------------------- |
| External dependency | **None** (built-in controller quorum) | Requires ZooKeeper cluster    |
| Setup complexity    | **Simpler**                           | More moving parts             |
| Metadata store      | Raft log in Kafka                     | ZooKeeper                     |
| Startup             | Generally faster                      | Slower (ZK + Kafka)           |
| Operational model   | Unified controller/broker roles       | Split responsibilities        |
| Scaling controllers | Via Raft voters                       | Scale ZooKeeper ensemble      |
| Kafka versions      | Stable in 3.7+                        | Legacy path, still supported  |
| Migration           | Tools exist ZK → KRaft                | —                             |
| New deployments     | **Recommended**                       | Only for legacy compatibility |

---

## 10) Security Notes (dev vs prod)

These stacks use **PLAINTEXT** for simplicity. For production:

- Use **SSL/SASL_SSL**
- Configure **ACLs** and disable `ALLOW_EVERYONE_IF_NO_ACL_FOUND`
- Multi-broker clusters (≥3) and controller quorum (≥3 or 5 voters)
- Externalized volumes, monitoring, proper resource limits

---

## 11) Cleanup

```bash
# KRaft
docker compose down -v

# ZooKeeper
docker compose -f docker-compose.zookeeper.yml down -v

docker system prune -f
docker volume prune -f
```

---

## 12) Next Steps

- Point your apps to the relevant bootstrap (`localhost:9099` for KRaft, `localhost:9094` for ZK)
- Explore topics, consumer groups, and messages in Kafka-UI
- Add example producers/consumers under `/examples/` if needed
