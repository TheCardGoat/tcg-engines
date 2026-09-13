import { decodeFabCommand } from "../moves.ts";
import { nextRandom, seedFromString } from "../random.ts";
import { serializeFabMatchSnapshot } from "../snapshot/match-context.ts";
import { createFabPracticeMatch } from "../automation/create-practice-match.ts";
import { DEFAULT_BOT_DECK_ID } from "../automation/deck-text-fixtures.ts";
import { listLegalCommands } from "../automation/legal-commands.ts";
import { seatMustAct } from "../automation/bot-strategies.ts";
import type { FabMatchRuntime } from "../runtime.ts";
import type { FabLegalCommand } from "../rules/legal-commands/index.ts";
import type { FabPriorityAutomationMode } from "../state.ts";
import type { FabDeckCardLibrary } from "../automation/resolve-text-deck.ts";

/**
 * Deterministic random-play driver that serializes after EVERY command. Any
 * intermediate state the engine cannot persist is a P0 bug; on refusal the
 * caller receives the thrown {@link serializeFabMatchSnapshot} error and the
 * recorded command history for replay.
 */

const AUTOMATION_MODES: readonly FabPriorityAutomationMode[] = [
  "auto-pass",
  "always-hold",
  "play-and-skip",
];

export interface FuzzHistoryEntry {
  readonly step: number;
  readonly actorId: string;
  readonly move: string;
  readonly payload: unknown;
  readonly stateID: number;
  readonly turnNumber: number;
  readonly phase: string;
}

export interface FuzzMatchResult {
  readonly termination: "life" | "max-actions" | "stall";
  readonly actions: number;
  readonly history: readonly FuzzHistoryEntry[];
}

export interface FuzzStepObservation {
  readonly step: number;
  readonly runtime: FabMatchRuntime;
  readonly stateID: number;
}

export interface RunFuzzMatchOptions {
  readonly cardLibrary: FabDeckCardLibrary;
  readonly seed: string;
  readonly player1DeckId: string;
  readonly player2DeckId?: string;
  readonly maxActions?: number;
  readonly startingLife?: number;
  /** Deterministic frequency of priority-automation rerolls. */
  readonly automationRerolls?: boolean;
  /** Observe state after each serialize checkpoint. */
  readonly onStep?: (observation: FuzzStepObservation) => void;
}

function pickRandom<T>(items: readonly T[], roll: number): T {
  return items[Math.floor(roll * items.length) % items.length]!;
}

function actorsWithCommands(
  runtime: FabMatchRuntime,
  player1Id: string,
  player2Id: string,
): readonly { actorId: string; legal: readonly FabLegalCommand[] }[] {
  const seats = [player1Id, player2Id].filter((actorId) => seatMustAct(runtime, actorId));
  const candidates = seats.length > 0 ? seats : [player1Id, player2Id];
  return candidates
    .map((actorId) => ({ actorId, legal: listLegalCommands(runtime, actorId) }))
    .filter((seat) => seat.legal.length > 0);
}

export function runFuzzMatch(options: RunFuzzMatchOptions): FuzzMatchResult {
  const {
    seed,
    player1DeckId,
    player2DeckId = DEFAULT_BOT_DECK_ID,
    maxActions = 300,
    startingLife = 10,
    automationRerolls = true,
    onStep,
  } = options;
  const match = createFabPracticeMatch(options.cardLibrary, {
    seed,
    player1DeckId,
    player2DeckId,
    player1Life: startingLife,
    player2Life: startingLife,
  });
  const { runtime, player1Id, player2Id } = match;
  const history: FuzzHistoryEntry[] = [];
  let rng = seedFromString(seed);
  const roll = () => {
    const drawn = nextRandom(rng);
    rng = drawn.state;
    return drawn.value;
  };
  const applyOrRecord = (actorId: string, command: FabLegalCommand): boolean => {
    const decoded = decodeFabCommand(command.move, command.payload);
    if (!decoded) return false;
    const state = runtime.getState();
    const retainedInputSnapshot = serializeFabMatchSnapshot(state);
    const result = runtime.applyCommand(actorId, decoded, {
      commandId: `fuzz:${seed}:${state.stateID + 1}`,
      timestamp: Date.now(),
    });
    history.push({
      step: history.length,
      actorId,
      move: command.move,
      payload: command.payload,
      stateID: state.stateID,
      turnNumber: state.turnNumber,
      phase: state.phase,
    });
    const retainedAfterCommand = serializeFabMatchSnapshot(state);
    if (JSON.stringify(retainedAfterCommand) !== JSON.stringify(retainedInputSnapshot)) {
      throw new Error(
        `FAB command ${command.move} mutated its retained pre-command state at fuzz step ${history.length - 1}.`,
      );
    }
    return result.success;
  };

  const rerollAutomation = () => {
    for (const actorId of [player1Id, player2Id]) {
      if (roll() < 0.5) continue;
      runtime.applyCommand(actorId, {
        move: "set-automation-preferences",
        preferences: { priorityMode: pickRandom(AUTOMATION_MODES, roll()) },
      });
    }
  };

  if (automationRerolls) rerollAutomation();
  try {
    for (let step = 0; step < maxActions; step += 1) {
      // The core assertion: every intermediate state must be persistable.
      serializeFabMatchSnapshot(runtime.getState());
      onStep?.({ step, runtime, stateID: runtime.getStateID() });
      if (runtime.hasGameEnded()) return { termination: "life", actions: history.length, history };
      if (automationRerolls && step % 25 === 24) rerollAutomation();
      if (automationRerolls && roll() < 0.1) {
        const holder = runtime.getPriorityPlayerId();
        if (holder) runtime.applyCommand(holder, { move: "arm-priority-hold" });
      }
      const seats = actorsWithCommands(runtime, player1Id, player2Id);
      if (seats.length === 0) return { termination: "stall", actions: history.length, history };
      const seat = pickRandom(seats, roll());
      const command = pickRandom(seat.legal, roll());
      applyOrRecord(seat.actorId, command);
    }
  } catch (error) {
    // Attach the replayable command history to whatever escaped (refusals,
    // engine throws) so dumps can reconstruct the path offline.
    Object.assign(error as object, { fuzzHistory: history, fuzzSeed: seed });
    throw error;
  }
  return { termination: "max-actions", actions: history.length, history };
}
