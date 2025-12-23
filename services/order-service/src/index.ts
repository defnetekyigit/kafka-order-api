import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Kafka } from "kafkajs";
import { getDb } from "./mongo";

const app = express();
app.use(express.json());

const brokers = (process.env.KAFKA_BROKERS || "kafka-1:9092").split(",");
const kafka = new Kafka({ clientId: "order-service", brokers });
const producer = kafka.producer();

type CreateOrderBody = { userId: string; totalPrice: number };

app.post("/orders", async (req, res) => {
  const body = req.body as CreateOrderBody;
  if (!body?.userId || typeof body.totalPrice !== "number") {
    return res.status(400).json({ success: false, message: "Invalid body" });
  }

  const db = await getDb();
  const orderDoc = {
    userId: body.userId,
    totalPrice: body.totalPrice,
    status: "CREATED",
    createdAt: new Date()
  };

  const result = await db.collection("orders").insertOne(orderDoc);

  await producer.connect();
  await producer.send({
    topic: "order.created",
    messages: [
      { value: JSON.stringify({ orderId: result.insertedId.toString(), ...orderDoc }) }
    ]
  });

  return res.json({ success: true, orderId: result.insertedId.toString(), ...orderDoc });
});

app.listen(3000, () => console.log("🛒 Order Service listening on :3000"));
