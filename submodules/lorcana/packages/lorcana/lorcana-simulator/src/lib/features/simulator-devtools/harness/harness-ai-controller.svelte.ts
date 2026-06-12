import {
  createPlayerId,
  getAutomatedActionStrategyOption,
  getSafeAutomatedActionStrategyOption,
  computeAutomatedActionStateFingerprint,
  type AutomatedActionExecutionResult,
  type AutomatedActionStrategyOption,
  type AutomatedActionTraceSink,
  type LorcanaServer,
} from "@tcg/lorcana-engine";
import {
  createRepeatedStateDeadlockTracker,
  resolveRepeatedStateDeadlockByConceding,
} from "../automation-deadlock.js";
import {
  AI_SPEED_MS,
  type AiPlayMode,
  type AiSpeed,
  type HumanVsAiOrchestratorState,
} from "../vs-ai/types.js";
import { resolveHumanVsAiMode } from "../vs-ai/mode-resolution.js";
import type { AiControllableOrchestrator } from "../vs-ai/context.js";

export interface HarnessAiBotConfig {
  strategyId: string;
  initialPlayMode?: AiPlayMode;
}

const HARNESS_AI_PLAYER_ID = createPlayerId("player_two");

export class HarnessAiController implements AiControllableOrchestrator {
  #requestedStrategyId: string;
  #server: LorcanaServer;
  #strategyOption: AutomatedActionStrategyOption;
  #deadlockTracker = createRepeatedStateDeadlockTracker();
  #timer: ReturnType<typeof setTimeout> | null = null;
  #timerRevision = 0;
  #stateUnsubscribe: (() => void) | null = null;

  state = $state<HumanVsAiOrchestratorState>({
    mode: "waiting-for-human",
    aiPlayMode: "auto",
    aiSpeed: "balanced",
    strategyId: "",
    strategyLabel: "",
    currentPerspective: "playerOne",
    turnNumber: 0,
  });

  constructor(server: LorcanaServer, config: HarnessAiBotConfig) {
    const strategyOption = getSafeAutomatedActionStrategyOption(config.strategyId);
    const initialPlayMode = config.initialPlayMode ?? "auto";

    this.#server = server;
    this.#requestedStrategyId = config.strategyId;
    this.#strategyOption =
      this.#server.resolveAutomatedActionStrategyForPlayer(
        this.#requestedStrategyId,
        HARNESS_AI_PLAYER_ID,
      ) ?? strategyOption;

    this.state = {
      mode: "waiting-for-human",
      aiPlayMode: initialPlayMode,
      aiSpeed: "balanced",
      strategyId: this.#strategyOption.id,
      strategyLabel: this.#strategyOption.label,
      currentPerspective: "playerOne",
      turnNumber: this.#server.getTurnNumber(),
    };

    this.#subscribeToStateUpdates();
    this.#syncMode();
  }

  stepAi(): void {
    if (this.state.mode !== "ai-paused" && this.state.mode !== "ai-thinking") {
      return;
    }
    this.#clearTimer();
    this.#executeAiAction();
  }

  togglePlayMode(): void {
    const nextMode: AiPlayMode = this.state.aiPlayMode === "step" ? "auto" : "step";
    this.state = { ...this.state, aiPlayMode: nextMode };

    if (nextMode === "auto" && this.state.mode === "ai-paused") {
      this.state = { ...this.state, mode: "ai-thinking" };
      this.#scheduleAiAction();
    } else if (nextMode === "step") {
      this.#clearTimer();
      if (this.state.mode === "ai-thinking") {
        this.state = { ...this.state, mode: "ai-paused" };
      }
    }
  }

  setSpeed(speed: AiSpeed): void {
    this.state = { ...this.state, aiSpeed: speed };
    if (this.state.mode === "ai-thinking" && this.state.aiPlayMode === "auto") {
      this.#clearTimer();
      this.#scheduleAiAction();
    }
  }

  setStrategy(strategyId: string): void {
    const option = getAutomatedActionStrategyOption(strategyId);
    if (!option) return;

    this.#requestedStrategyId = strategyId;
    this.#strategyOption =
      this.#server.resolveAutomatedActionStrategyForPlayer(
        this.#requestedStrategyId,
        HARNESS_AI_PLAYER_ID,
      ) ?? option;
    this.state = {
      ...this.state,
      strategyId: this.#strategyOption.id,
      strategyLabel: this.#strategyOption.label,
    };
  }

  takeover(): void {
    this.#clearTimer();
    this.state = {
      ...this.state,
      mode: "takeover",
      currentPerspective: "playerTwo",
    };
  }

  releaseTakeover(): void {
    this.#clearTimer();
    this.state = {
      ...this.state,
      currentPerspective: "playerOne",
      mode: "waiting-for-human",
    };
    this.#syncMode();
  }

  dispose(): void {
    this.#clearTimer();
    this.#stateUnsubscribe?.();
    this.#stateUnsubscribe = null;
  }

  #subscribeToStateUpdates(): void {
    this.#stateUnsubscribe = this.#server.onStateUpdate(() => {
      this.#syncMode();
    });
  }

  #syncMode(): void {
    const turnNumber = this.#server.getTurnNumber();
    const { actorId } = this.#server.enumerateAutomatedActionsForCurrentActor({
      strategy: this.#strategyOption.strategy,
    });

    const resolution = resolveHumanVsAiMode({
      state: this.state,
      winner: this.#server.getWinner() ?? undefined,
      turnNumber,
      actorId,
    });

    if (resolution.shouldClearTimer) {
      this.#clearTimer();
    }

    this.state = resolution.nextState;

    if (resolution.shouldScheduleAi) {
      this.#scheduleAiAction();
    }
  }

  #executeAiAction(): void {
    const winner = this.#server.getWinner();
    if (winner) {
      this.state = { ...this.state, mode: "complete", winner };
      return;
    }

    const traceSink: AutomatedActionTraceSink = {
      push() {},
    };

    const fingerprint = computeAutomatedActionStateFingerprint(this.#server.getState());
    let result: AutomatedActionExecutionResult;

    try {
      result = this.#server.takeAutomatedActionForCurrentActor({
        strategy: this.#strategyOption.strategy,
        traceSink,
      });
    } catch (error) {
      this.#clearTimer();
      this.state = {
        ...this.state,
        mode: "error",
        error: error instanceof Error ? error.message : "AI action failed.",
      };
      return;
    }

    if (!result.finalResult.success) {
      this.#clearTimer();
      this.state = {
        ...this.state,
        mode: "error",
        error: result.finalResult.error ?? "AI action failed.",
      };
      return;
    }

    if (result.fallbackTaken === "concede" || this.#server.getWinner()) {
      const winnerAfterAction = this.#server.getWinner();
      if (winnerAfterAction) {
        this.state = { ...this.state, mode: "complete", winner: winnerAfterAction };
      }
      return;
    }

    const observation = this.#deadlockTracker.observe({
      actorId: result.actorId,
      stateFingerprint: fingerprint,
    });
    const deadlockResolution = resolveRepeatedStateDeadlockByConceding({
      actorId: result.actorId,
      concede: (actorId) => this.#server.concede(actorId),
      observation,
    });

    if (deadlockResolution.attempted) {
      if (deadlockResolution.conceded) {
        console.warn(
          `[HarnessAI] AI conceded due to repeated-state deadlock.\n` +
            `  Actor: ${result.actorId}\n` +
            `  State fingerprint (seen ${observation.count}×): ${observation.key ?? fingerprint}\n` +
            `  Strategy: ${this.#strategyOption.label}`,
        );
      } else {
        this.#clearTimer();
        this.state = {
          ...this.state,
          mode: "error",
          error: deadlockResolution.error ?? "Repeated state detected - AI appears stuck.",
        };
        return;
      }
    }

    const { actorId: nextActorId } = this.#server.enumerateAutomatedActionsForCurrentActor({
      strategy: this.#strategyOption.strategy,
    });
    const resolution = resolveHumanVsAiMode({
      state: this.state,
      winner: this.#server.getWinner() ?? undefined,
      turnNumber: this.#server.getTurnNumber(),
      actorId: nextActorId,
    });

    if (resolution.shouldClearTimer) {
      this.#clearTimer();
    }

    this.state = resolution.nextState;

    if (resolution.shouldScheduleAi) {
      this.#scheduleAiAction();
    }
  }

  #scheduleAiAction(): void {
    this.#clearTimer();

    if (this.state.mode !== "ai-thinking") {
      return;
    }

    const revision = ++this.#timerRevision;
    const speedMs = AI_SPEED_MS[this.state.aiSpeed];

    this.#timer = setTimeout(() => {
      if (revision !== this.#timerRevision) return;
      this.#timer = null;
      this.#executeAiAction();
    }, speedMs);
  }

  #clearTimer(): void {
    this.#timerRevision += 1;
    if (this.#timer !== null) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
  }
}
