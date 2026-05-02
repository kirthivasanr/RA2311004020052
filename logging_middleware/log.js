const express = require('express');
const app = express();
const port = 3000;
// Logging middleware

async function Log(stack, level, packageName, message) {
  const payload = { stack, level, package: packageName, message, timestamp: new Date().toISOString() };
  await fetch("https://20.207.122.201/evaluation-service/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      stack : "backend",
      level : "error",
      package: "handler",
      message : "processed request",
      timestamp: new Date().toISOString()
    })
  });
}


app.listen(port, () => {
  console.log(`Logging middleware is running on port ${port}`);
});