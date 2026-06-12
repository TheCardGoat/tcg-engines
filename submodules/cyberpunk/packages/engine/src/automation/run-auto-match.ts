import type { CardCatalog, DeckList, PlayerSetup } from "../types/index.ts";
import { createMatchState } from "../state/initial-state.ts";
import { LocalEngine } from "../transport/local-engine.ts";
import { AIPlayer } from "./ai-player.ts";
import type { AIStrategy, StepResult } from "./types.ts";
import { assertNever } from "./util/assert-never.ts";

export interface RunAutoMatchOptions {
  players: [PlayerSetup, PlayerSetup];
  decks: [DeckList, DeckList];
  strategies: [AIStrategy, AIStrategy];
  catalog: CardCatalog;
  seed?: string;
  /** Hard cap on the total number of decision-tree turns before bailing out. */
  maxSteps?: number;
}

export interface AutoMatchLogEntry {
  stepIndex: number;
  playerId: string;
  result: StepResult;
}

export interface AutoMatchResult {
  winnerId: string | null;
  reason: "winCondition" | "concede" | "deckOut" | "stuck" | "illegal" | "maxSteps";
  turnCount: number;
  stepCount: number;
  log: AutoMatchLogEntry[];
}

/**
 * Runs two AI players against each other to completion, returning the result
 * and a per-step log. The harness only ever calls public engine surfaces
 * (`getPrompt`, `getFilteredView`, `processCommand`), so any illegal move or
 * stuck state surfaced here is a real bug — either in the engine or in a
 * strategy.
 */
export function runAutoMatch(opts: RunAutoMatchOptions): AutoMatchResult {
  const matchState = createMatchState({
    players: opts.players,
    catalog: opts.catalog,
    deckLists: opts.decks,
    seed: opts.seed,
  });
  const engine = new LocalEngine(matchState);
  const seed = opts.seed ?? "auto-match";

  const ais = opts.players.map(
    (player, idx) =>
      new AIPlayer(engine, player.id, opts.strategies[idx]!, {
        rngSeed: `${seed}:${player.id as string}`,
      }),
  );

  const maxSteps = opts.maxSteps ?? 5000;
  const log: AutoMatchLogEntry[] = [];

  const probeView = () => engine.getFilteredView(ais[0]!.playerId);

  for (let stepIndex = 0; stepIndex < maxSteps; stepIndex++) {
    const view = probeView();
    if (view.gameEnded) break;

    const ai = pickActiveAi(engine, ais, view.activePlayerId);
    if (!ai) {
      return finalize(engine, log, "stuck", stepIndex, ais[0]!.playerId);
    }

    const result = ai.step();
    log.push({ stepIndex, playerId: ai.playerId as string, result });

    switch (result.kind) {
      case "acted":
      case "idle":
        continue;
      case "stuck":
        return finalize(engine, log, "stuck", stepIndex + 1, ais[0]!.playerId);
      case "illegal":
        return finalize(engine, log, "illegal", stepIndex + 1, ais[0]!.playerId);
      default:
        return assertNever(result, "StepResult");
    }
  }

  return finalize(engine, log, "maxSteps", log.length, ais[0]!.playerId);
}

function pickActiveAi(
  engine: LocalEngine,
  ais: AIPlayer[],
  activePlayerId: string,
): AIPlayer | null {
  const ordered = [...ais].sort((a, b) => {
    const aActive = (a.playerId as string) === activePlayerId ? 0 : 1;
    const bActive = (b.playerId as string) === activePlayerId ? 0 : 1;
    return aActive - bActive;
  });
  for (const ai of ordered) {
    const status = engine.getPrompt(ai.playerId).status;
    if (status === "action" || status === "choice") return ai;
  }
  return null;
}

function finalize(
  engine: LocalEngine,
  log: AutoMatchLogEntry[],
  fallbackReason: AutoMatchResult["reason"],
  stepCount: number,
  probePlayerId: import("../types/branded.ts").PlayerId,
): AutoMatchResult {
  const view = engine.getFilteredView(probePlayerId);
  const winnerId = view.winnerId;
  const reason: AutoMatchResult["reason"] = view.gameEnded
    ? view.winReason === "deckOut"
      ? "deckOut"
      : view.winReason === "concede"
        ? "concede"
        : "winCondition"
    : fallbackReason;
  return {
    winnerId,
    reason,
    turnCount: view.turnNumber,
    stepCount,
    log,
  };
}
