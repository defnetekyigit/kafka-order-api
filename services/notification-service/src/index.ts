import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";
import { getDb } from "./mongo";

type OrderCreatedEvent = {
  orderId: string;
  userId?: string;
  totalPrice?: number;
};

const brokers = (process.env.KAFKA_BROKERS || "").split(",");
const kafka = new Kafka({
  clientId: "notification-service",
  brokers,
});

const consumer = kafka.consumer({
  groupId: "notification-group",
});

async function start() {
  const db = await getDb();

  await consumer.connect();
  await consumer.subscribe({ topic: "order.created" });

  console.log("🔔 Notification Service started");

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(
        message.value.toString()
      ) as OrderCreatedEvent;

      await db.collection("notifications").insertOne({
        orderId: event.orderId,
        type: "ORDER_CREATED",
        message: `Order ${event.orderId} created successfully`,
        createdAt: new Date(),
      });

      console.log(
        `🔔 Notification created for order ${event.orderId}`
      );
    },
  });
}

start().catch((err) => {
  console.error("❌ Notification Service error", err);
  process.exit(1);
});
