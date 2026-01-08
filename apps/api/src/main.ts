import { HttpApiBuilder, HttpApiScalar, HttpMiddleware, HttpServer } from "@effect/platform";
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";
import { createServer } from "node:http";
import { ApiLive } from "./live.js";

/**
 * Server configuration
 */
const PORT = 3001;

/**
 * HTTP Server Layer - Creates and configures the Node.js HTTP server
 *
 * Serves the API on the specified port with:
 * - All API endpoints defined in EchoLabApi
 * - Scalar OpenAPI documentation at /docs
 * - Request logging middleware
 * - CORS support for frontend at localhost:5173
 */
const ServerLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiScalar.layer({ path: "/docs" })),
  Layer.provide(HttpApiBuilder.middlewareOpenApi({ path: "/openapi.json" })),
  Layer.provide(
    HttpApiBuilder.middlewareCors({
      allowedOrigins: ["http://localhost:5173"],
      allowedMethods: ["GET", "POST", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
      credentials: false,
    }),
  ),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: PORT })),
);

/**
 * Application entry point
 *
 * Starts the HTTP server and keeps it running until terminated.
 * The server will log its address when ready.
 */
NodeRuntime.runMain(Layer.launch(ServerLive));
