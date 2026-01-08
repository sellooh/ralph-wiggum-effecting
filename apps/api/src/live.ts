import { HttpApiBuilder } from "@effect/platform";
import { Layer } from "effect";
import { EchoLabApi } from "./api.js";
import { TransformGroupHandlers } from "./handlers.js";
import {
  HistoryServiceLive,
  TransformationServiceLive,
} from "./services/index.js";

/**
 * Services Layer - Combines all application service layers
 *
 * Includes:
 * - TransformationServiceLive: Text transformation logic
 * - HistoryServiceLive: In-memory history storage
 */
export const ServicesLive = Layer.mergeAll(TransformationServiceLive, HistoryServiceLive);

/**
 * API Layer - HTTP API implementation with all handlers
 *
 * Builds the complete HTTP API from the EchoLabApi definition
 * and wires up the TransformGroupHandlers
 */
export const ApiLive = HttpApiBuilder.api(EchoLabApi).pipe(
  Layer.provide(TransformGroupHandlers),
  Layer.provide(ServicesLive),
);

/**
 * Live Layer - Complete application runtime layer
 *
 * This is the top-level layer that combines all application
 * components and can be provided to the HTTP server
 */
export const Live = ApiLive;
