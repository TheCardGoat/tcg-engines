/**
 * Worker entry point for parallel batch runs. Receives either a
 * {@link BatchOptions} (strategy batch) or a
 * {@link DeckRoundRobinWorkerPayload} (deck round-robin chunk) via
 * `workerData`, runs it synchronously, and posts the resulting summary back.
 * Spawned by `runBatchParallel` / `runDeckRoundRobinParallel`.
 */
import { parentPort, workerData } from "node:worker_threads";
import { runBatch, type BatchOptions } from "./runner.ts";
import { runDeckPairings, type DeckRoundRobinWorkerPayload } from "./deck-round-robin.ts";

if (!parentPort) {
  throw new Error("ai-runner worker must be spawned via worker_threads");
}

const payload = workerData as BatchOptions | DeckRoundRobinWorkerPayload;

function isDeckRoundRobinPayload(
  value: BatchOptions | DeckRoundRobinWorkerPayload,
): value is DeckRoundRobinWorkerPayload {
  return "kind" in value && value.kind === "deck-round-robin";
}

if (isDeckRoundRobinPayload(payload)) {
  parentPort.postMessage(runDeckPairings(payload.options, payload.pairIndices));
} else {
  parentPort.postMessage(runBatch(payload));
}
