/**
 * Worker entry point for parallel batch runs. Receives a {@link BatchOptions}
 * via `workerData`, runs the batch synchronously, and posts the resulting
 * {@link BatchSummary} back. Spawned by `runBatchParallel`.
 */
import { parentPort, workerData } from "node:worker_threads";
import { runBatch, type BatchOptions } from "./runner.ts";

if (!parentPort) {
  throw new Error("ai-runner worker must be spawned via worker_threads");
}

const opts = workerData as BatchOptions;
const summary = runBatch(opts);
parentPort.postMessage(summary);
