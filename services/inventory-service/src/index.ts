import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";
import { getDb } from "./mongo";

type OrderCreatedEvent = {
  orderId: string;
  items?: { productId: string; quantity: number }[];
};

const brokers = (process.env.KAFKA_BROKERS || "").split(",");
const kafka = new Kafka({
  clientId: "inventory-service",
  brokers,
});

const consumer = kafka.consumer({
  groupId: "inventory-group",
});

async function start() {
  const db = await getDb();

  await consumer.connect();
  await consumer.subscribe({ topic: "order.created" });

  console.log("📦 Inventory Service started");

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(
        message.value.toString()
      ) as OrderCreatedEvent;

      // Demo için item yoksa default düş
      const items =
        event.items ?? [{ productId: "default-product", quantity: 1 }];

      for (const item of items) {
        await db.collection("inventory").updateOne(
          { productId: item.productId },
          {
            $inc: { stock: -item.quantity },
            $setOnInsert: { createdAt: new Date() },
            $set: { updatedAt: new Date() },
          },
          { upsert: true }
        );
      }

      console.log(
        `📦 Inventory updated for order ${event.orderId}`
      );
    },
  });
}

start().catch((err) => {
  console.error("❌ Inventory Service error", err);
  process.exit(1);
});
