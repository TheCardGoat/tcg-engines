import { getContext, setContext } from "svelte";
import { readable, writable, type Readable, type Writable } from "svelte/store";
import type { HumanVsAiOrchestratorState } from "./types.js";

const HUMAN_VS_AI_CONTEXT_KEY = Symbol.for("lorcana.humanVsAi");

export interface AiControllableOrchestrator {
  readonly state: HumanVsAiOrchestratorState;
  setSpeed(speed: HumanVsAiOrchestratorState["aiSpeed"]): void;
  setStrategy(strategyId: string): void;
  stepAi(): void;
  takeover(): void;
  releaseTakeover(): void;
  togglePlayMode(): void;
}

type AiOrchestratorStore = Writable<AiControllableOrchestrator | null>;

const EMPTY_AI_ORCHESTRATOR_STORE = readable<AiControllableOrchestrator | null>(null);

export function createHumanVsAiContext(
  orchestrator: AiControllableOrchestrator | null = null,
): AiOrchestratorStore {
  const store = writable<AiControllableOrchestrator | null>(orchestrator);
  setContext(HUMAN_VS_AI_CONTEXT_KEY, store);
  return store;
}

export function setHumanVsAiContext(
  orchestrator: AiControllableOrchestrator,
): AiControllableOrchestrator {
  createHumanVsAiContext(orchestrator);
  return orchestrator;
}

export function useHumanVsAiOrchestrator(): Readable<AiControllableOrchestrator | null> {
  try {
    return getContext<AiOrchestratorStore>(HUMAN_VS_AI_CONTEXT_KEY) ?? EMPTY_AI_ORCHESTRATOR_STORE;
  } catch {
    return EMPTY_AI_ORCHESTRATOR_STORE;
  }
}
