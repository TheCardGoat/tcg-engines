/**
 * CoreTestEngine - Base class for test engines (no dependency on multiplayer-test-engine).
 *
 * Extracted to break circular dependency: index.ts → multiplayer-test-engine → index.
 */

import type {
  EngineActorContext,
  EngineMoveExecutionResult,
  EngineMoveHistoryEntry,
  EngineMoveValidationResult,
  GameEngine,
} from "../engine";
import type { DeepReadonly, MatchState, MoveInput } from "../runtime";

export type GameTestView = "playerOne" | "playerTwo" | "spectator" | "authoritative";

export const GAME_TEST_VIEWS = [
  "playerOne",
  "playerTwo",
  "spectator",
  "authoritative",
] as const satisfies readonly GameTestView[];

export interface GameTestEngine<
  TVisibleState,
  TMoveMap extends Record<string, MoveInput>,
  TAuthoritativeState = TVisibleState,
  TBoard = unknown,
> {
  getState(): DeepReadonly<TVisibleState>;
  getBoard(): DeepReadonly<TBoard>;
  getStateID(): number;
  validateMove(moveId: string, input: MoveInput): EngineMoveValidationResult;
  executeMove(moveId: string, input: MoveInput): EngineMoveExecutionResult;
  enumerateMoves(): string[];
  getMoveHistory(limit?: number): EngineMoveHistoryEntry[];
  getActorContext(): EngineActorContext;
  dispose(): void | Promise<void>;
  getCurrentView(): GameTestView;
  setCurrentView(view: GameTestView): void;
  getAvailableViews(): readonly GameTestView[];
  getStateForView(view: GameTestView): TVisibleState;
  validateMoveForView<K extends keyof TMoveMap & string>(
    view: GameTestView,
    moveId: K,
    params: TMoveMap[K],
  ): EngineMoveValidationResult;
  executeMoveForView<K extends keyof TMoveMap & string>(
    view: GameTestView,
    moveId: K,
    params: TMoveMap[K],
  ): EngineMoveExecutionResult;

  getEngineForView(view: GameTestView): GameEngine;
  getAuthoritativeState(): DeepReadonly<TAuthoritativeState>;
}

export function isGameTestEngine<
  TVisibleState,
  TMoveMap extends Record<string, MoveInput>,
  TAuthoritativeState = TVisibleState,
>(value: unknown): value is GameTestEngine<TVisibleState, TMoveMap, TAuthoritativeState> {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.getCurrentView === "function" &&
    typeof candidate.setCurrentView === "function" &&
    typeof candidate.getStateForView === "function" &&
    typeof candidate.getEngineForView === "function"
  );
}

/** Result of a cheat attempt in tests */
export type CheatAttemptResult = {
  allowed: boolean;
  error?: string;
  errorCode?: string;
};

/** Result of hidden-info verification in tests */
export type HiddenInfoResult = {
  hidden: boolean;
  path: string;
  message?: string;
  value?: unknown;
};

/** Player-scoped action interface for test engines */
export interface PlayerActionInterface<
  TState = MatchState,
  TBoard = unknown,
  TMoveMap extends Record<string, MoveInput> = Record<string, MoveInput>,
> {
  getState(): DeepReadonly<TState>;
  getBoard(): TBoard;
  executeMove<K extends keyof TMoveMap>(moveId: K, params: TMoveMap[K]): unknown;
  canExecuteMove<K extends keyof TMoveMap>(moveId: K, params: TMoveMap[K]): boolean;
  getValidMoves(): string[];
  playerId: string;
}

function isGameTestView(value: unknown): value is GameTestView {
  return typeof value === "string" && (GAME_TEST_VIEWS as readonly string[]).includes(value);
}

function getPathValue(root: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (!segment) {
      return current;
    }
    if (!current || typeof current !== "object") {
      return undefined;
    }
    return (current as Record<string, unknown>)[segment];
  }, root);
}

/**
 * Runtime-first compatibility base class for legacy test engines.
 *
 * Subclasses can implement the actual runtime mechanics and still inherit a stable
 * GameTestEngine-compatible surface plus old helpers like getServerEngine/getClientEngine/asPlayer.
 */
export abstract class CoreTestEngine<
  TVisibleState = unknown,
  TMoveMap extends Record<string, MoveInput> = Record<string, MoveInput>,
  TAuthoritativeState = TVisibleState,
  TBoard = unknown,
> implements GameTestEngine<TVisibleState, TMoveMap, TAuthoritativeState, TBoard> {
  #currentView: GameTestView = "authoritative";

  constructor(config?: { initialView?: GameTestView } | unknown) {
    if (
      config &&
      typeof config === "object" &&
      "initialView" in (config as Record<string, unknown>)
    ) {
      const maybeView = (config as { initialView?: unknown }).initialView;
      if (isGameTestView(maybeView)) {
        this.#currentView = maybeView;
      }
    }
  }

  getCurrentView(): GameTestView {
    return this.#currentView;
  }

  setCurrentView(view: GameTestView): void {
    this.#currentView = view;
  }

  getAvailableViews(): readonly GameTestView[] {
    return GAME_TEST_VIEWS;
  }

  getState(): DeepReadonly<TVisibleState> {
    return this.getStateForView(this.#currentView) as DeepReadonly<TVisibleState>;
  }

  getBoard(): DeepReadonly<TBoard> {
    return this.getEngineForView(this.#currentView).getBoard() as DeepReadonly<TBoard>;
  }

  getProjection(): DeepReadonly<TBoard> {
    return this.getEngineForView(this.#currentView).getBoard() as DeepReadonly<TBoard>;
  }

  validateMove<K extends keyof TMoveMap & string>(
    moveId: K,
    params: TMoveMap[K],
  ): EngineMoveValidationResult {
    return this.validateMoveForView(this.#currentView, moveId, params);
  }

  executeMove<K extends keyof TMoveMap & string>(
    moveId: K,
    params: TMoveMap[K],
  ): EngineMoveExecutionResult {
    return this.executeMoveForView(this.#currentView, moveId, params);
  }

  enumerateMoves(): Array<keyof TMoveMap & string> {
    const engine = this.getEngineForView(this.#currentView);
    return engine.enumerateMoves();
  }

  getActorContext(): EngineActorContext {
    return this.getEngineForView(this.#currentView).getActorContext();
  }

  getServerState(): DeepReadonly<TAuthoritativeState> {
    return this.getAuthoritativeState();
  }

  getServerEngine(): GameEngine {
    return this.getEngineForView("authoritative") as unknown as GameEngine;
  }

  getClientEngine(playerId: string): GameEngine | undefined {
    const view = this.resolveViewForPlayerId(playerId);
    return view ? this.getEngineForView(view) : undefined;
  }

  asPlayer(playerId: string): PlayerActionInterface<TVisibleState, TBoard, TMoveMap> {
    const view = this.resolveViewForPlayerId(playerId);
    if (!view) {
      throw new Error(`CORE_TEST_ENGINE_UNKNOWN_PLAYER: ${playerId}`);
    }

    return {
      playerId,
      getState: () => this.getStateForView(view) as DeepReadonly<TVisibleState>,
      getBoard: () => this.getEngineForView(view).getBoard() as TBoard,
      executeMove: (moveId, params) => {
        return this.executeMoveForView(
          view,
          String(moveId) as keyof TMoveMap & string,
          params as TMoveMap[keyof TMoveMap & string],
        );
      },
      canExecuteMove: (moveId, params) =>
        this.validateMoveForView(
          view,
          String(moveId) as keyof TMoveMap & string,
          params as TMoveMap[keyof TMoveMap & string],
        ).valid,
      getValidMoves: () => [],
    };
  }

  tryCheatMove(playerId: string, moveId: string, params: unknown): CheatAttemptResult {
    const view = this.resolveViewForPlayerId(playerId);
    if (!view) {
      return { allowed: false, error: `Unknown player '${playerId}'`, errorCode: "UNKNOWN_PLAYER" };
    }

    const result = this.executeMoveForView(
      view,
      moveId as keyof TMoveMap & string,
      params as TMoveMap[keyof TMoveMap & string],
    );
    return {
      allowed: result.success,
      error: result.reason,
      errorCode: result.code,
    };
  }

  verifyHiddenInfo(playerId: string, path: string): HiddenInfoResult {
    const view = this.resolveViewForPlayerId(playerId);
    if (!view) {
      return {
        hidden: false,
        path,
        message: `Unknown player '${playerId}'`,
      };
    }

    const value = getPathValue(this.getStateForView(view) as Record<string, unknown>, path);
    return value === undefined
      ? { hidden: true, path }
      : { hidden: false, path, message: "Value visible in filtered state", value };
  }

  protected resolveViewForPlayerId(playerId: string): GameTestView | undefined {
    if (playerId === "spectator") {
      return "spectator";
    }
    if (playerId === "authoritative") {
      return "authoritative";
    }
    return undefined;
  }

  abstract getStateID(): number;
  abstract getStateForView(view: GameTestView): TVisibleState;

  abstract getBoardForView(view: GameTestView): TBoard;
  abstract validateMoveForView<K extends keyof TMoveMap & string>(
    view: GameTestView,
    moveId: K,
    params: TMoveMap[K],
  ): EngineMoveValidationResult;
  abstract executeMoveForView<K extends keyof TMoveMap & string>(
    view: GameTestView,
    moveId: K,
    params: TMoveMap[K],
  ): EngineMoveExecutionResult;

  abstract getEngineForView(view: GameTestView): GameEngine;
  abstract getAuthoritativeState(): DeepReadonly<TAuthoritativeState>;
  abstract getMoveHistory(limit?: number): EngineMoveHistoryEntry[];
  abstract dispose(): void | Promise<void>;
}
