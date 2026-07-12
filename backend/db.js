const { createClient } = require("redis");

const client = createClient();

// Initialize redis
(async () => {
  await client.connect();

  console.log("Redis connected");
})();

module.exports = client;
