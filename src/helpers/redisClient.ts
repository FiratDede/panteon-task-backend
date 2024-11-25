import { createClient } from "redis";

// Redis istemcisi oluştur
 const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("connect", () => {
  console.log("Redis connected successfully!");
});

redisClient.on("error", (err: Error) => {
  console.error("Redis connection error:", err);
});

export async function connectRedisServer(){
  await redisClient.connect();
}

export default redisClient