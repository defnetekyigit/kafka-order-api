import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_URL!;
const dbName = process.env.MONGO_DB || "ecommerce";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  console.log("✅ Connected to MongoDB Atlas");
  return db;
}
