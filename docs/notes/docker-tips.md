# Docker Tips for Java Projects

## Use Multi-Stage Builds

```dockerfile
FROM maven:3.8.5-openjdk-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package

FROM openjdk:17-jdk
COPY --from=builder /app/target/app.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```
