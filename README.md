Kafka E-Commerce Demo (Docker + Kafka Cluster + MongoDB Atlas)

This project is a Kafka-based event-driven microservices demo built with Node.js (TypeScript), Kafka (3-broker cluster), and MongoDB Atlas.
Flow:
Order Service (Producer) ➜ publishes order.created ➜
Payment / Inventory / Notification (Consumers) consume the event and write results to MongoDB Atlas.
Architecture
Kafka Cluster: 3 brokers + Zookeeper (Docker)
Topics: order.created (3 partitions, replication factor 3)
Services:
* order-service (HTTP API + Kafka producer)
* payment-service (Kafka consumer)
* inventory-service (Kafka consumer)
* notification-service (Kafka consumer)
Database: MongoDB Atlas (shared database, separate collections per service)

Running the Demo 
docker compose up -d zookeeper kafka-1 kafka-2 kafka-3

docker ps

docker exec -it playlistapi-kafka-1-1 kafka-topics --describe --topic order.created --bootstrap-server kafka-1:9092

docker compose build

docker compose up

Testing

curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"productId":"123","quantity":2}'

Observing Event Fan-Out (Logs)
docker compose logs -f payment-service
docker compose logs -f inventory-service
docker compose logs -f inventory-service
