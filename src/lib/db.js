import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/digital-library";

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 });
    global._mongoClientPromise = global._mongoClient.connect();
  }
  client = global._mongoClient;
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 });
  clientPromise = client.connect();
}


export async function getDb() {
  const conn = await clientPromise;
 
  return conn.db();
}

export { client, clientPromise };