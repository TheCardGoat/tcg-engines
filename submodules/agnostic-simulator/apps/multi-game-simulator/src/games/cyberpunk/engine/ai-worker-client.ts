import {
  getDefinition,
  type AIPlayerDecision,
  type MatchState,
  type PlayerId,
} from "@tcg/cyberpunk-engine";
import type { CardDefinition } from "@tcg/cyberpunk-types";
import type { AiWorkerRequest, AiWorkerResponse } from "./ai-worker-protocol";
import type { WorkerStrategy } from "./ai-worker-strategy";

export interface AiDecisionClient {
  decide(
    state: MatchState,
    combatProgression: "automatic" | "manual",
  ): Promise<AIPlayerDecision | null>;
  dispose(): void;
}

export interface AiWorkerPort {
  onmessage: ((event: MessageEvent<AiWorkerResponse>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  onmessageerror: ((event: MessageEvent) => void) | null;
  postMessage(request: AiWorkerRequest): void;
  terminate(): void;
}

/** One in-flight decision per seat; teardown settles callers and stops CPU work. */
export function createAiDecisionClient(
  playerId: PlayerId,
  strategy: WorkerStrategy,
  rngSeed: string,
  createWorker: () => AiWorkerPort = () =>
    new Worker(new URL("./ai-decision.worker.ts", import.meta.url), { type: "module" }),
): AiDecisionClient {
  let worker: AiWorkerPort | null = null;
  let sequence = 0;
  let disposed = false;
  const definitions = new Map<string, CardDefinition>();
  let pending: {
    id: number;
    resolve: (value: AIPlayerDecision | null) => void;
    reject: (error: Error) => void;
    timer: ReturnType<typeof setTimeout>;
  } | null = null;

  function stop() {
    worker?.terminate();
    worker = null;
    definitions.clear();
  }
  function fail(error: Error) {
    const request = pending;
    pending = null;
    stop();
    if (request) {
      clearTimeout(request.timer);
      request.reject(error);
    }
  }
  return {
    decide(state, combatProgression) {
      if (disposed || pending) return Promise.resolve(null);
      return new Promise((resolve, reject) => {
        const id = ++sequence;
        pending = {
          id,
          resolve,
          reject,
          timer: setTimeout(() => fail(new Error("Bot decision timed out")), 15_000),
        };
        try {
          if (!worker) {
            worker = createWorker();
            worker.onmessage = ({ data }: MessageEvent<AiWorkerResponse>) => {
              if (!pending || data.id !== pending.id) return;
              if ("error" in data) {
                fail(new Error(data.error));
                return;
              }
              const request = pending;
              pending = null;
              clearTimeout(request.timer);
              request.resolve(data.selection);
            };
            worker.onerror = () => fail(new Error("Bot worker failed to load or execute"));
            worker.onmessageerror = () =>
              fail(new Error("Bot worker returned an unreadable decision"));
          }
          const changed: CardDefinition[] = [];
          for (const card of Object.values(state.G.cardIndex)) {
            const definition = getDefinition(card.definitionId);
            if (definitions.get(definition.id) === definition) continue;
            changed.push(definition);
            definitions.set(definition.id, definition);
          }
          const request: AiWorkerRequest = {
            id,
            state,
            definitions: changed,
            playerId,
            strategy,
            rngSeed,
            combatProgression,
          };
          worker.postMessage(request);
        } catch (error) {
          fail(error instanceof Error ? error : new Error(String(error)));
        }
      });
    },
    dispose() {
      disposed = true;
      if (pending) {
        clearTimeout(pending.timer);
        pending.resolve(null);
        pending = null;
      }
      stop();
    },
  };
}
