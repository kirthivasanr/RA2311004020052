const express = require('express');
const app = express();

// Logging middleware

async function Log(stack, level, packageName, message) {
  const payload = { stack, level, package: packageName, message, timestamp: new Date().toISOString() };
  await fetch("https://20.207.122.201/evaluation-service/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      stack,
      level,
      package: packageName,
      message,
      timestamp: new Date().toISOString()
    })
  });
}


