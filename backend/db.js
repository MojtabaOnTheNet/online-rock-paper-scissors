const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
});

// Initialize redis
(async () => {
  await client.connect();

  console.log("Redis connected");
})();

module.exports = client;
