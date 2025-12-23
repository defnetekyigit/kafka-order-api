import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";
import { getDb } from "./mongo";

const brokers = (process.env.KAFKA_BROKERS || "kafka-1:9092").split(",");
const kafka = new Kafka({ clientId: "payment-service", brokers });
const consumer = kafka.consumer({ groupId: "payment-group" });

async function main() {
  const db = await getDb();

  await consumer.connect();
  await consumer.subscribe({ topic: "order.created" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const evt = JSON.parse(message.value.toString()) as { orderId: string; totalPrice: number };

      await db.collection("payments").insertOne({
        orderId: evt.orderId,
        status: "PAID",
        createdAt: new Date()
      });

      console.log("💳 Payment processed:", evt.orderId);
    }
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
