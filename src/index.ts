#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "./app";
import http from "http";
import debug from "debug";
import { mongoConnect } from "./configs/mongo.config";
import client from "./services/redis.service";
import { ENV_CONFIG } from "./configs/env.config";
import enforce from 'express-sslify'
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(ENV_CONFIG.PORT || "8080");
app.use(enforce.HTTPS({ trustAzureHeader: true }))

app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

startServer();
/**
 * Listen on provided port, on all network interfaces.
 */

/**
 * Normalize a port into a number, string, or false.
 */

async function startServer() {
  await mongoConnect();
  await client.connect()
  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);
}

function normalizePort(val: string) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: { syscall: string; code: any }) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  debug("Listening on " + bind);
}
