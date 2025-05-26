import { Hono } from "hono";
import { logger } from "hono/logger";
import * as Redis from "@spinframework/spin-redis";
import * as Variables from "@spinframework/spin-variables";

let app = new Hono();
const enc = new TextEncoder();
app.use(logger());

app.post("/", (c) => {
  const redisConnectionString = Variables.get("redis_connection_string");
  const redisChannel = Variables.get("redis_channel");

  if (!redisConnectionString || !redisChannel) {
    console.log("Redis Connection is not configured");
    c.status(500);
    return c.text("Internal Server Error");
  }
  const r = Redis.open(redisConnectionString);
  r.publish(redisChannel, enc.encode("Hello from Spin").buffer);
  return c.text("Your message has been submitted to Redis");
});

app.fire();
