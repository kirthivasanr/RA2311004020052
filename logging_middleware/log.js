const DEFAULT_ENDPOINT = "https://20.207.122.201/evaluation-service/logs";

// This function sends one log to the server.
async function Log(stack, level, packageName, message, options = {}) {
  const endpoint = options.endpoint || process.env.LOG_ENDPOINT || DEFAULT_ENDPOINT;

  const payload = {
    stack: stack,
    level: level,
    package: packageName,
    message: message,
    timestamp: new Date().toISOString(),
    meta: options.meta || {}
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok && options.throwOnError) {
      throw new Error("Log request failed with status " + response.status);
    }
  } catch (error) {
    if (options.throwOnError) {
      throw error;
    }
  }
}

// This middleware logs when a request starts and ends.
function createLoggingMiddleware(options = {}) {
  const packageName = options.packageName || "app";
  const stack = options.stack || "middleware";

  return async function loggingMiddleware(req, res, next) {
    const startTime = Date.now();

    await Log(stack, "INFO", packageName, "Request started", {
      endpoint: options.endpoint,
      meta: {
        method: req.method,
        path: req.originalUrl || req.url
      }
    });

    res.on("finish", async () => {
      const durationMs = Date.now() - startTime;

      await Log(stack, "INFO", packageName, "Request completed", {
        endpoint: options.endpoint,
        meta: {
          method: req.method,
          path: req.originalUrl || req.url,
          status: res.statusCode,
          durationMs: durationMs
        }
      });
    });

    next();
  };
}

module.exports = {
  Log: Log,
  createLoggingMiddleware: createLoggingMiddleware
};


