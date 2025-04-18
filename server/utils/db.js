
import { MongoClient } from "mongodb";

const connectionString = "mongodb://root:example@localhost:27017";

export const client = new MongoClient(connectionString, {});

export const db = client.db("auth");

export async function checkConnection() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  } finally {
    await client.close();
  }
}
