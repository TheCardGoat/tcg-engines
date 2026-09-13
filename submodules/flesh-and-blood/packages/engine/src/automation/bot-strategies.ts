import {
  decodeFabCommand,
  type FabCommandExecutionContext,
  type FabMoveLog,
  type FabUndoBarrier,
} from "../moves.ts";
import type { CommittedEvent } from "../rules/events.ts";
import type { FabPlayerLog } from "../player-log.ts";
import { FabMatchRuntime } from "../runtime.ts";
import type { FabRulesView } from "../rules/rules-view.ts";
import { buildFabRulesView } from "../rules/state-rules-view.ts";
import type { FabCompiledLine, FabLineRankingHint } from "./heuristic/types.ts";
import type { FabLegalCommand } from "./legal-commands.ts";
import {
  botEligibleFabCommands,
  listLegalCommands,
  rulesViewForLegalCommands,
} from "./legal-commands.ts";
import { chooseCompiledLineCommand, compileTurnLine } from "./heuristic/line-compiler.ts";
import { buildHeuristicSnapshot } from "./heuristic/snapshot.ts";

export interface FabBotDecisionContext {
  /** Deterministic RNG in [0, 1). Defaults to Math.random when omitted. */
  readonly random?: () => number;
  /**
   * Optional line-compiler ranking input. A preferred card or combo role
   * reweights the goldfish / future hero profile without replacing the compiler.
   */
  readonly ranking?: FabLineRankingHint;
  /** Optional benchmark/explanation observer. It never participates in selection. */
  readonly onRanked?: (lines: readonly FabCompiledLine[]) => void;
}

/** Complete chooser boundary, including candidate generation and required progress handling. */
export type FabBotPolicy = (
  runtime: FabMatchRuntime,
  actorId: string,
  context?: FabBotDecisionContext,
) => FabLegalCommand | null;

const BEATEN_TRACKERS_CANONICAL_ID = "zCWhR7jRCmH7D7fKDGKcF";

/**
 * Beaten Trackers still triggers after its controller randomly discards a
 * 6-power card on the opponent's turn. CR 1.13.2b replaces its AP gain with
 * no gain there, so spending the Battleworn equipment is strictly harmful.
 */
function beatenTrackersNoValueDecline(
  runtime: FabMatchRuntime,
  actorId: string,
  legal: readonly FabLegalCommand[],
): FabLegalCommand | null {
  const state = runtime.getState();
  if (actorId === state.activePlayerId) return null;
  const topLayer = state.rulesStack.at(-1);
  if (
    topLayer?.kind !== "triggered" ||
    topLayer.source.canonicalId !== BEATEN_TRACKERS_CANONICAL_ID
  ) {
    return null;
  }
  return (
    legal.find(
      (command) =>
        command.move === "answer-decision" &&
        isBooleanDecisionAnswer(command.payload.answer, false),
    ) ?? null
  );
}

function isBooleanDecisionAnswer(value: unknown, expected: boolean): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { kind?: unknown }).kind === "boolean" &&
    (value as { value?: unknown }).value === expected
  );
}

/**
 * Choose a legal command for `actorId`, or null when the strategy abstains.
 * Strategies must only return commands from the provided legal list.
 */
export type FabBotStrategy = (
  runtime: FabMatchRuntime,
  actorId: string,
  legalCommands: readonly FabLegalCommand[],
  context?: FabBotDecisionContext,
) => FabLegalCommand | null;

function withoutConcede(legal: readonly FabLegalCommand[]): FabLegalCommand[] {
  return botEligibleFabCommands(legal).filter((c) => c.move !== "concede");
}

function emptyDefend(command: FabLegalCommand): boolean {
  const ids = command.payload.instanceIds;
  return Array.isArray(ids) && ids.length === 0;
}

/**
 * CR 4.4.3f refills the non-turn player's hand at the end of turn 1. Every
 * automated seat therefore shares one opening-defense policy, independent of
 * its normal persona: preserve the most valuable card as a future threat or
 * reaction and defend with the rest. Against an attack without go again, the
 * value compiler may deliberately overblock to cycle weak cards before that
 * refill.
 */
function firstTurnRefillDefense(
  runtime: FabMatchRuntime,
  actorId: string,
  legal: readonly FabLegalCommand[],
  context?: FabBotDecisionContext,
): FabLegalCommand | null {
  if (!legal.some((command) => command.move === "defend")) return null;

  const stateID = runtime.getStateID();
  const view = rulesViewForLegalCommands(legal, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  if (!snapshot.defending || !snapshot.refillsHandAtEndOfTurn || snapshot.combatStep !== "defend") {
    return null;
  }

  return chooseCompiledLineCommand(
    compileTurnLine(snapshot, legal, { persona: "value-extract", onRanked: context?.onRanked }),
    legal,
  );
}

/**
 * When a defender's life lead is at least this much, the heuristic stops
 * spending hand cards on blocks it can easily survive and preserves them to
 * race. Without this, a ahead defender full-blocking every counter (plus a
 * turtling opponent + healing) can loop the game to the action cap.
 */
const HEURISTIC_RACE_LIFE_LEAD = 6;

/** Prefer pass / end-turn / resolve prompt; never initiates plays when possible. */
export const passOnlyStrategy: FabBotStrategy = (runtime, actorId, legalCommands) => {
  const legal = withoutConcede(legalCommands);
  const state = runtime.getState();
  const activeOutsideCombat =
    actorId === state.activePlayerId && !state.combat?.open && state.rulesStack.length === 0;

  // Active player free-pass only yields priority; end-turn is the progress move.
  if (activeOutsideCombat) {
    return (
      legal.find((c) => c.move === "end-turn") ??
      legal.find((c) => c.move === "pass") ??
      legal[0] ??
      null
    );
  }

  return (
    legal.find((c) => c.move === "pass") ??
    legal.find((c) => c.move === "end-turn") ??
    legal.find((c) => c.move === "defend" && emptyDefend(c)) ??
    legal[0] ??
    null
  );
};

/** Deterministic: first non-concede legal command in enumeration order. */
export const firstLegalStrategy: FabBotStrategy = (_runtime, _actorId, legalCommands) => {
  return withoutConcede(legalCommands)[0] ?? null;
};

/** Seeded (or Math.random) pick among non-concede legal commands. */
export const randomStrategy: FabBotStrategy = (_runtime, _actorId, legalCommands, context) => {
  const legal = withoutConcede(legalCommands);
  if (legal.length === 0) return null;
  const roll = context?.random ?? Math.random;
  const index = Math.min(legal.length - 1, Math.floor(roll() * legal.length));
  return legal[index] ?? null;
};

/**
 * Deterministic fixture strategy: open attack actions, resolve their required
 * decisions, and otherwise advance without playing buffs, reactions, or blocks.
 */
export const attackOnlyStrategy: FabBotStrategy = (runtime, _actorId, legalCommands) => {
  const legal = withoutConcede(legalCommands);
  const state = runtime.getState();
  const view = buildFabRulesView(state);
  const attack = legal.find((command) => {
    if (command.move !== "begin-play" || typeof command.payload.instanceId !== "string") {
      return false;
    }
    const record = state.objects[command.payload.instanceId];
    if (!record) return false;
    return (
      view
        .object({ instanceId: record.instanceId, incarnation: record.incarnation })
        ?.current.typeBox.subtypes.includes("Attack") === true
    );
  });

  return (
    legal.find((command) => command.move === "answer-decision") ??
    attack ??
    legal.find((command) => command.move === "defend" && emptyDefend(command)) ??
    legal.find((command) => command.move === "pass") ??
    legal.find((command) => command.move === "end-turn") ??
    null
  );
};

/**
 * Lightweight priority heuristic:
 * resolve prompts → useful blocks → plays → pitch → end-turn (when active) → pass.
 *
 * Empty defend is the required no-block declaration when no useful block is
 * available. Active free-pass is ranked below
 * end-turn so the bot does not priority-ping-pong.
 */
export const heuristicStrategy: FabBotStrategy = (runtime, actorId, legalCommands) => {
  const stateID = runtime.getStateID();
  let view: FabRulesView | null = rulesViewForLegalCommands(legalCommands, stateID);
  const legal = withoutConcede(legalCommands);
  if (legal.length === 0) return null;

  let best: FabLegalCommand | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  const getView = (): FabRulesView => (view ??= buildFabRulesView(runtime.getState()));

  for (const command of legal) {
    const score = scoreCommand(runtime, actorId, command, getView);
    if (score > bestScore) {
      bestScore = score;
      best = command;
    }
  }
  return best;
};

function remainingAttackDamage(
  runtime: FabMatchRuntime,
  defenderId: string,
  getView: () => FabRulesView,
): number | null {
  const state = runtime.getState();
  const combat = state.combat;
  if (!combat?.open || !combat.activeLink) return null;
  if (combat.activeLink.defendingPlayerId !== defenderId) return null;
  if (combat.step !== "defend" && combat.step !== "reaction") {
    // Still useful on defend primarily.
  }
  const view = getView();
  const evaluatedCombat = view.combat();
  return evaluatedCombat
    ? Math.max(0, evaluatedCombat.attackPower - evaluatedCombat.defense)
    : null;
}

function scoreCommand(
  runtime: FabMatchRuntime,
  actorId: string,
  command: FabLegalCommand,
  getView: () => FabRulesView,
): number {
  const state = runtime.getState();
  const player = state.players[actorId];
  const combatOpen = Boolean(state.combat?.open);
  const stackOpen = state.rulesStack.length > 0;
  const isActive = actorId === state.activePlayerId;

  switch (command.move) {
    case "answer-decision":
      return 1_000;
    case "defend": {
      const ids = Array.isArray(command.payload.instanceIds)
        ? (command.payload.instanceIds as string[])
        : [];
      // CR 7.3.2: an explicit empty declaration completes the game process.
      if (ids.length === 0) return 350;

      const remaining = remainingAttackDamage(runtime, actorId, getView);
      // Outside defend / not the defender: low priority (should be rare).
      if (remaining === null) return 100;

      // Already fully blocked — further blocks waste cards; pass instead.
      if (remaining <= 0) return -50;

      // Far ahead on life: don't spend cards on a block we can easily survive —
      // preserve the hand to race. Two full-blocking sides plus healing can loop
      // the game to the action cap (e.g. vs a turtling opponent sitting at 1 life).
      const opponentId = Object.keys(state.players).find((id) => id !== actorId);
      const lifeLead = (player?.life ?? 0) - (state.players[opponentId ?? ""]?.life ?? 0);
      if (lifeLead >= HEURISTIC_RACE_LIFE_LEAD) return 100;

      let defense = 0;
      const view = getView();
      for (const id of ids) {
        defense += evaluatedNumeric(state, view, id, "defense");
      }
      const useful = Math.min(defense, remaining);
      const overblock = Math.max(0, defense - remaining);
      const isFirstTurnDefender =
        state.turnNumber === 1 && actorId !== state.activePlayerId && combatOpen;
      const hand = state.containers.zonesByPlayerId[actorId]?.hand ?? [];
      const spentHandValue = ids.reduce((total, id) => {
        if (!hand.includes(id)) return total;
        const object = state.objects[id];
        if (!object) return total;
        return (
          total +
          Math.max(
            evaluatedNumeric(state, view, id, "power"),
            evaluatedNumeric(state, view, id, "defense"),
          )
        );
      }, 0);
      // On the defending half of turn 1, cards spent from hand refill at end
      // of turn. Prefer low-value legal blocks, but keep normal overblock
      // discipline while the attack can continue through go again.
      const firstTurnPreference = isFirstTurnDefender ? 120 - spentHandValue * 8 : 0;
      const firstTurnOverblockPenalty =
        isFirstTurnDefender &&
        !getView()
          .combat()
          ?.attack.current.keywords.some((keyword) => keyword.name === "go-again")
          ? Math.max(0, overblock - 2) * 2
          : overblock * 5;
      const firstTurnFullCoverBonus = isFirstTurnDefender && defense >= remaining ? 120 : 0;
      // Outside the first-turn exception, prefer covering remaining damage with fewer cards.
      return (
        400 +
        useful * 25 -
        ids.length * (isFirstTurnDefender ? 5 : 20) -
        firstTurnOverblockPenalty +
        firstTurnPreference +
        firstTurnFullCoverBonus
      );
    }
    case "begin-play": {
      const instanceId =
        typeof command.payload.instanceId === "string" ? command.payload.instanceId : undefined;
      const view = getView();
      const power = instanceId ? evaluatedNumeric(state, view, instanceId, "power") : 0;
      const cost = instanceId ? evaluatedNumeric(state, view, instanceId, "cost") : 0;
      const resources = player?.resourcePoints ?? 0;
      const pitchCount = Array.isArray(command.payload.pitch)
        ? (command.payload.pitch as string[]).length
        : 0;
      // Prefer on-curve attacks; slight penalty for heavy pitch bundles.
      return 300 + power * 10 - Math.max(0, cost - resources) * 5 - pitchCount * 2;
    }
    case "pass": {
      // Defend step: if fully blocked, pass is the progress move.
      const remaining = remainingAttackDamage(runtime, actorId, getView);
      if (remaining !== null && remaining <= 0) return 700;
      if (remaining !== null && remaining > 0) {
        // Still taking damage — pass is fine once no efficient block remains.
        return 350;
      }
      // Active free pass outside combat/stack yields priority without ending the turn.
      if (isActive && !combatOpen && !stackOpen) return 15;
      return 50;
    }
    case "end-turn": {
      // Active player must end the turn to progress when no more plays.
      if (isActive && !combatOpen && !stackOpen) return 120;
      return 20;
    }
    default:
      return 0;
  }
}

function evaluatedNumeric(
  state: ReturnType<FabMatchRuntime["getState"]>,
  view: FabRulesView,
  instanceId: string,
  property: "cost" | "defense" | "power",
): number {
  const object = state.objects[instanceId];
  if (!object) return 0;
  return (
    view.object({
      instanceId: object.instanceId,
      incarnation: object.incarnation,
    })?.current.numeric[property] ?? 0
  );
}

/** True when this seat must act now (priority, defend declaration, or a decision). */
export function seatMustAct(runtime: FabMatchRuntime, actorId: string): boolean {
  if (runtime.hasGameEnded()) return false;
  const state = runtime.getState();
  if (state.decision?.actorId === actorId) return true;
  const combat = state.combat;
  if (
    combat?.open &&
    combat.step === "defend" &&
    combat.defenseDeclarationPending &&
    combat.activeLink?.defendingPlayerId === actorId
  ) {
    return true;
  }
  return runtime.getPriorityPlayerId() === actorId;
}

function isCancelPlay(command: FabLegalCommand): boolean {
  const answer = command.payload.answer;
  return (
    command.move === "answer-decision" &&
    typeof answer === "object" &&
    answer !== null &&
    (answer as { kind?: string }).kind === "cancel"
  );
}

/**
 * Pass priority, end the turn, or cancel an unpayable play. Never invents a
 * concede — callers add that only when this returns null and the seat must act.
 */
export function progressCommand(
  runtime: FabMatchRuntime,
  actorId: string,
  legal: readonly FabLegalCommand[],
): FabLegalCommand | null {
  const state = runtime.getState();
  const activeOutsideCombat =
    actorId === state.activePlayerId && !state.combat?.open && state.rulesStack.length === 0;
  if (activeOutsideCombat) {
    return (
      legal.find((command) => command.move === "end-turn") ??
      legal.find((command) => command.move === "pass") ??
      legal.find(isCancelPlay) ??
      null
    );
  }
  return (
    legal.find((command) => command.move === "pass") ??
    legal.find((command) => command.move === "end-turn") ??
    legal.find(isCancelPlay) ??
    null
  );
}

/** Concede command when the engine enumerates it, else a last-resort payload. */
export function concedeCommand(runtime: FabMatchRuntime, actorId: string): FabLegalCommand {
  const listed = listLegalCommands(runtime, actorId, { includeConcede: true }).find(
    (command) => command.move === "concede",
  );
  return listed ?? { move: "concede", payload: {}, label: "Concede" };
}

/**
 * List legal commands, run the strategy, then guarantee progress:
 * play/act → pass priority or end turn (or cancel a stuck payment) → concede
 * when this seat must act and cannot pass.
 */
export function chooseAutomatedAction(
  runtime: FabMatchRuntime,
  actorId: string,
  strategy: FabBotStrategy,
  context?: FabBotDecisionContext,
): FabLegalCommand | null {
  const listed = botEligibleFabCommands(listLegalCommands(runtime, actorId));
  // Never cancel a live payment while pitch cards remain — that loops
  // announce → pitch → cancel → announce until max-actions.
  const decision = runtime.getState().decision;
  const canKeepPaying =
    decision?.kind === "payment" && decision.actorId === actorId && decision.candidates.length > 0;
  const legal = canKeepPaying ? listed.filter((command) => !isCancelPlay(command)) : listed;
  const forcedDecline = beatenTrackersNoValueDecline(runtime, actorId, legal);
  if (forcedDecline) return forcedDecline;
  const openingDefense = firstTurnRefillDefense(runtime, actorId, legal, context);
  if (openingDefense) return openingDefense;
  const chosen = strategy(runtime, actorId, legal, context);
  if (chosen && chosen.move !== "concede" && !(canKeepPaying && isCancelPlay(chosen))) {
    if (chosen.move === "pass") {
      const endTurn = legal.find((command) => command.move === "end-turn");
      if (endTurn) return endTurn;
    }
    return chosen;
  }
  const progress = progressCommand(runtime, actorId, legal);
  if (progress && !isCancelPlay(progress)) return progress;
  const playable = legal.find((command) => command.move !== "concede" && !isCancelPlay(command));
  if (playable) return playable;
  if (progress) return progress;
  if (seatMustAct(runtime, actorId)) return concedeCommand(runtime, actorId);
  return null;
}

export interface SubmitAutomatedActionResult {
  readonly command: FabLegalCommand;
  readonly advanced: boolean;
  readonly conceded: boolean;
  readonly moveLogs: readonly FabMoveLog[];
  /** The command-local player narrative when an engine command was accepted. */
  readonly playerLog: FabPlayerLog | null;
  readonly committedEvents: readonly CommittedEvent[];
  /** Validated snapshot of the accepted automated command, when it advanced. */
  readonly snapshot?: import("../snapshot/match-context.ts").FabMatchSnapshotV21;
  /** Information exposed by the accepted automated command, if any. */
  readonly undoBarrier: FabUndoBarrier | null;
  readonly error?: string;
}

function commandKey(command: FabLegalCommand): string {
  return `${command.move}:${JSON.stringify(command.payload)}`;
}

function optionDecisionCommands(runtime: FabMatchRuntime, actorId: string): FabLegalCommand[] {
  const decision = runtime.getState().decision;
  if (!decision || decision.actorId !== actorId || decision.kind !== "option") return [];

  const commands: FabLegalCommand[] = [];
  const selected: string[] = [];
  // Small choices are exhaustive (the common modal case). Keep pathological
  // any-number decisions bounded while still trying smaller selections first.
  const maxCommands = 256;
  const visit = (start: number, targetSize: number): void => {
    if (commands.length >= maxCommands) return;
    if (selected.length === targetSize) {
      const labels = selected.flatMap(
        (id) => decision.options.find((option) => option.id === id)?.label ?? [],
      );
      commands.push({
        move: "answer-decision",
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "option", optionIds: [...selected] },
        },
        label: labels.length > 0 ? `${decision.label}: ${labels.join("; ")}` : decision.label,
      });
      return;
    }
    for (let index = start; index < decision.options.length; index += 1) {
      const option = decision.options[index];
      if (!option) continue;
      selected.push(option.id);
      visit(index + 1, targetSize);
      selected.pop();
      if (commands.length >= maxCommands) return;
    }
  };
  for (let size = decision.min; size <= decision.max && commands.length < maxCommands; size += 1) {
    visit(0, size);
  }
  return commands;
}

function entityTargetDecisionCommands(
  runtime: FabMatchRuntime,
  actorId: string,
): FabLegalCommand[] {
  const decision = runtime.getState().decision;
  if (!decision || decision.actorId !== actorId || decision.kind !== "entity-target") return [];

  const commands: FabLegalCommand[] = [];
  const selected: string[] = [];
  const maxCommands = 256;
  const visit = (start: number, targetSize: number): void => {
    if (commands.length >= maxCommands) return;
    if (selected.length === targetSize) {
      commands.push({
        move: "answer-decision",
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [...selected] },
        },
        label: selected.length === 0 ? decision.label : `${decision.label} (${selected.length})`,
      });
      return;
    }
    for (let index = start; index < decision.candidates.length; index += 1) {
      const candidate = decision.candidates[index];
      if (!candidate) continue;
      selected.push(candidate.instanceId);
      visit(index + 1, targetSize);
      selected.pop();
      if (commands.length >= maxCommands) return;
    }
  };
  for (let size = decision.min; size <= decision.max && commands.length < maxCommands; size += 1) {
    visit(0, size);
  }
  return commands;
}

function tryApplyCommand(
  runtime: FabMatchRuntime,
  actorId: string,
  command: FabLegalCommand,
  execution?: FabCommandExecutionContext,
):
  | {
      readonly kind: "advanced";
      readonly moveLogs: readonly FabMoveLog[];
      readonly playerLog: FabPlayerLog;
      readonly committedEvents: readonly CommittedEvent[];
      readonly snapshot: import("../snapshot/match-context.ts").FabMatchSnapshotV21;
      readonly undoBarrier: FabUndoBarrier | null;
    }
  | { readonly kind: "reversed"; readonly error: string }
  | { readonly kind: "stuck" }
  | { readonly kind: "rejected"; readonly error: string } {
  const before = runtime.getStateID();
  try {
    const decoded = decodeFabCommand(command.move, command.payload);
    if (!decoded) return { kind: "rejected", error: "decode" };
    const applied = runtime.applyCommand(actorId, decoded, execution);
    if (!applied.success) {
      return {
        kind: "rejected",
        error: applied.diagnostic?.failedInvariant ?? applied.error,
      };
    }
    // A rules reversal is an accepted command receipt, so it advances the
    // public state ID, but the proposed play/activation did not advance the
    // game. Treating the receipt as progress makes stateless bots announce
    // the same reversible action forever.
    if (applied.outcome.kind === "rules-action-reversed") {
      return { kind: "reversed", error: applied.outcome.reason.message };
    }
    if (runtime.hasGameEnded() || runtime.getStateID() !== before) {
      return {
        kind: "advanced",
        moveLogs: applied.moveLogs,
        playerLog: applied.playerLog,
        committedEvents: applied.committedEvents,
        snapshot: applied.snapshot,
        undoBarrier: applied.undoBarrier,
      };
    }
    return { kind: "stuck" };
  } catch (caught) {
    return {
      kind: "rejected",
      error: caught instanceof Error ? caught.message : String(caught),
    };
  }
}

function describeAttempt(
  command: FabLegalCommand,
  outcome: { readonly kind: string; readonly error?: string },
): string {
  const detail = outcome.error ? `:${outcome.error}` : "";
  return `${command.move}:${outcome.kind}${detail}`;
}

function shortCircuitAfterRulesReversal(
  runtime: FabMatchRuntime,
  actorId: string,
  execution: FabCommandExecutionContext | undefined,
  reversalError: string,
): SubmitAutomatedActionResult {
  const freshLegal = botEligibleFabCommands(
    listLegalCommands(runtime, actorId, { includeConcede: true }),
  );
  const pass = freshLegal.find((command) => command.move === "pass");
  if (pass) {
    const passOutcome = tryApplyCommand(runtime, actorId, pass, execution);
    if (passOutcome.kind === "advanced") {
      return {
        command: pass,
        advanced: true,
        conceded: false,
        moveLogs: passOutcome.moveLogs,
        playerLog: passOutcome.playerLog,
        committedEvents: passOutcome.committedEvents,
        snapshot: passOutcome.snapshot,
        undoBarrier: passOutcome.undoBarrier,
      };
    }
  }

  const concede = concedeCommand(runtime, actorId);
  const concedeOutcome = tryApplyCommand(runtime, actorId, concede, execution);
  if (concedeOutcome.kind === "advanced" || runtime.hasGameEnded()) {
    return {
      command: concede,
      advanced: true,
      conceded: true,
      moveLogs: concedeOutcome.kind === "advanced" ? concedeOutcome.moveLogs : [],
      playerLog: concedeOutcome.kind === "advanced" ? concedeOutcome.playerLog : null,
      committedEvents: concedeOutcome.kind === "advanced" ? concedeOutcome.committedEvents : [],
      ...(concedeOutcome.kind === "advanced" ? { snapshot: concedeOutcome.snapshot } : {}),
      undoBarrier: concedeOutcome.kind === "advanced" ? concedeOutcome.undoBarrier : null,
      error: `Rules action repeatedly reversed: ${reversalError}`,
    };
  }

  return {
    command: concede,
    advanced: false,
    conceded: false,
    moveLogs: [],
    playerLog: null,
    committedEvents: [],
    undoBarrier: null,
    error: `Could not pass or concede after rules reversal: ${reversalError}`,
  };
}

/**
 * Apply the chosen command. Decision answers are first probed on an isolated
 * runtime so a rules reversal cannot erase the live decision. If an answer
 * reverses, try the remaining option selections. If every selection reverses,
 * commit one known reversal to restore the pre-action priority state, then
 * short-circuit through pass and finally concede. Other rejected commands fall
 * back through the remaining progress options, then concede.
 *
 * `execution` is the caller-owned command context forwarded to every attempt
 * (including the concede fallback). The engine stays clock-free: omitting it
 * keeps the deterministic stateID-counter default, while wall-clock callers
 * (local practice) opt in so their move logs carry real timestamps.
 */
export function submitAutomatedAction(
  runtime: FabMatchRuntime,
  actorId: string,
  chosen: FabLegalCommand,
  legal: readonly FabLegalCommand[] = listLegalCommands(runtime, actorId),
  execution?: FabCommandExecutionContext,
): SubmitAutomatedActionResult {
  legal = botEligibleFabCommands(legal);
  const tried = new Set<string>();
  const queue: FabLegalCommand[] = [
    chosen,
    ...optionDecisionCommands(runtime, actorId),
    ...entityTargetDecisionCommands(runtime, actorId),
  ];
  const progress = progressCommand(runtime, actorId, legal);
  if (progress) queue.push(progress);
  for (const command of legal) {
    if (command.move === "concede") continue;
    queue.push(command);
  }

  const attempts: string[] = [];
  let lastError: string | undefined;
  let reversedAttempt: { readonly command: FabLegalCommand; readonly error: string } | undefined;
  for (const command of queue) {
    const key = commandKey(command);
    if (tried.has(key)) continue;
    tried.add(key);
    // Decision continuations can reverse the entire proposed rules action.
    // Probe them on an isolated runtime first so one bad option does not erase
    // the live decision before automation can try another option.
    if (command.move === "answer-decision") {
      const preview = tryApplyCommand(new FabMatchRuntime(runtime.getState()), actorId, command);
      if (preview.kind !== "advanced") {
        lastError = describeAttempt(command, preview);
        attempts.push(lastError);
        if (preview.kind === "reversed") {
          reversedAttempt = { command, error: preview.error };
          lastError = `${command.move}:rules-action-reversed: ${preview.error}`;
        }
        continue;
      }
    }
    const outcome = tryApplyCommand(runtime, actorId, command, execution);
    if (outcome.kind === "advanced") {
      return {
        command,
        advanced: true,
        conceded: command.move === "concede",
        moveLogs: outcome.moveLogs,
        playerLog: outcome.playerLog,
        committedEvents: outcome.committedEvents,
        snapshot: outcome.snapshot,
        undoBarrier: outcome.undoBarrier,
      };
    }
    if (outcome.kind === "reversed") {
      return shortCircuitAfterRulesReversal(runtime, actorId, execution, outcome.error);
    }
    lastError = describeAttempt(command, outcome);
    attempts.push(lastError);
    if (outcome.kind === "stuck" && (command.move === "pass" || command.move === "end-turn")) {
      break;
    }
  }

  if (reversedAttempt) {
    const reversal = tryApplyCommand(runtime, actorId, reversedAttempt.command, execution);
    if (reversal.kind === "advanced") {
      return {
        command: reversedAttempt.command,
        advanced: true,
        conceded: false,
        moveLogs: reversal.moveLogs,
        playerLog: reversal.playerLog,
        committedEvents: reversal.committedEvents,
        snapshot: reversal.snapshot,
        undoBarrier: reversal.undoBarrier,
      };
    }
    if (reversal.kind === "reversed") {
      return shortCircuitAfterRulesReversal(runtime, actorId, execution, reversal.error);
    }
    lastError = describeAttempt(reversedAttempt.command, reversal);
    attempts.push(lastError);
  }

  const fresh = botEligibleFabCommands(listLegalCommands(runtime, actorId));
  for (const command of [
    ...fresh.filter((candidate) => candidate.move === "end-turn" || candidate.move === "pass"),
    ...entityTargetDecisionCommands(runtime, actorId),
  ]) {
    const key = commandKey(command);
    if (tried.has(key)) continue;
    tried.add(key);
    if (command.move === "answer-decision") {
      const preview = tryApplyCommand(new FabMatchRuntime(runtime.getState()), actorId, command);
      if (preview.kind !== "advanced") {
        lastError = describeAttempt(command, preview);
        attempts.push(lastError);
        continue;
      }
    }
    const outcome = tryApplyCommand(runtime, actorId, command, execution);
    if (outcome.kind === "advanced") {
      return {
        command,
        advanced: true,
        conceded: false,
        moveLogs: outcome.moveLogs,
        playerLog: outcome.playerLog,
        committedEvents: outcome.committedEvents,
        snapshot: outcome.snapshot,
        undoBarrier: outcome.undoBarrier,
      };
    }
    lastError = describeAttempt(command, outcome);
    attempts.push(lastError);
  }

  const concede = concedeCommand(runtime, actorId);
  const concedeOutcome = tryApplyCommand(runtime, actorId, concede, execution);
  if (concedeOutcome.kind === "advanced" || runtime.hasGameEnded()) {
    return {
      command: concede,
      advanced: true,
      conceded: true,
      moveLogs: concedeOutcome.kind === "advanced" ? concedeOutcome.moveLogs : [],
      playerLog: concedeOutcome.kind === "advanced" ? concedeOutcome.playerLog : null,
      committedEvents: concedeOutcome.kind === "advanced" ? concedeOutcome.committedEvents : [],
      ...(concedeOutcome.kind === "advanced" ? { snapshot: concedeOutcome.snapshot } : {}),
      undoBarrier: concedeOutcome.kind === "advanced" ? concedeOutcome.undoBarrier : null,
      error: attempts.length > 0 ? attempts.join(" || ") : lastError,
    };
  }
  return {
    command: concede,
    advanced: false,
    conceded: false,
    moveLogs: [],
    playerLog: null,
    committedEvents: [],
    undoBarrier: null,
    error: lastError ?? "Could not play, pass, or concede.",
  };
}
