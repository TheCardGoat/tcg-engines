import { decodeFabCommand } from "../../moves.ts";
import { nextRandom, seedFromString } from "../../random.ts";
import { buildFabRulesView } from "../../rules/state-rules-view.ts";
import type { FabRulesView } from "../../rules/rules-view.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import {
  FabSnapshotSerializationRefusalError,
  serializeFabMatchSnapshot,
} from "../../snapshot/match-context.ts";
import {
  chooseAutomatedAction,
  concedeCommand,
  seatMustAct,
  submitAutomatedAction,
  type FabBotPolicy,
} from "../bot-strategies.ts";
import { getFabAutoPassPriorityCommand, type FabAutoPassPolicy } from "../auto-pass.ts";
import { fabPriorityWindowContext } from "../../rules/automation-verdict.ts";
import { DEFAULT_BOT_DECK_ID, DEFAULT_PLAYER_DECK_ID } from "../deck-text-fixtures.ts";
import { PRACTICE_PLAYER_1, PRACTICE_PLAYER_2 } from "../sample-decks.ts";
import { createFabPracticeMatch } from "../create-practice-match.ts";
import { FAB_DEFAULT_AUTOMATION_PREFERENCES } from "../../state.ts";
import type { FabDeckCardLibrary } from "../resolve-text-deck.ts";
import type { FabCompiledLine } from "../heuristic/types.ts";
import { buildHeuristicSnapshot, cardByInstance } from "../heuristic/snapshot.ts";
import {
  botEligibleFabCommands,
  listLegalCommands,
  rulesViewForLegalCommands,
  type FabLegalCommand,
} from "../legal-commands.ts";
import {
  getSafeFabAutomatedActionStrategyOption,
  type FabAutomatedActionStrategyOption,
} from "../strategy-registry.ts";
import type {
  FabDecisionFrame,
  FabDecisionHead,
  FabMatchTermination,
  FabMatchTranscript,
  FabSnapshotRefusalEvidence,
} from "./types.ts";

export interface PlayFabMatchInput {
  readonly cardLibrary: FabDeckCardLibrary;
  readonly seed: string;
  readonly p1Strategy: string;
  readonly p2Strategy: string;
  /** Complete policy overrides allow a frozen baseline to retain its own candidate generation. */
  readonly p1Policy?: { readonly id: string; readonly choose: FabBotPolicy };
  readonly p2Policy?: { readonly id: string; readonly choose: FabBotPolicy };
  /** Seat selected to start, independent of deck/strategy assignment. Defaults to p1. */
  readonly firstPlayer?: "p1" | "p2";
  readonly p1Deck?: string;
  readonly p2Deck?: string;
  readonly p1Life?: number;
  readonly p2Life?: number;
  readonly maxActions?: number;
  /** Actual policy heads recorded per frame. `0` records chosen moves only. */
  readonly considerHeads?: number;
  /** When false, skip goldfish ranking and decision frames (smoke play-throughs). */
  readonly recordFrames?: boolean;
  /**
   * When true, allow a hero-bound strategy (scope "hero") to run on a
   * non-matching seated hero instead of throwing. Intended for smoke
   * code-path tests that exercise a strategy function on a generic deck; the
   * bench leaves this false so a hero/seat mismatch fails loudly.
   */
  /**
   * When true, allow a hero-bound strategy (scope "hero") to run on a
   * non-matching seated hero instead of throwing. Intended for smoke
   * code-path tests that exercise a strategy function on a generic deck; the
   * bench leaves this false so a hero/seat mismatch fails loudly.
   */
  readonly allowStrategyHeroMismatch?: boolean;
  /**
   * When true (default), serialize the match state after every accepted
   * command so self-play and bot-training sweeps double as persistence
   * invariant checks — a state the engine cannot persist fails the match as
   * "snapshot-refusal" with the named-invariant evidence on the transcript.
   * Perf-sensitive hosts may opt out explicitly.
   */
  readonly snapshotValidation?: boolean;
}

/** Read the seated hero identity for `playerId` (mirrors the snapshot path). */
function readSeatedHeroIdentity(
  state: FabRulesSnapshot,
  view: FabRulesView,
  playerId: string,
): { heroName: string; heroCanonicalId: string | null } {
  const heroCardId = state.players[playerId]?.heroCardId ?? null;
  const heroRecord = heroCardId ? state.objects[heroCardId] : undefined;
  if (!heroRecord) return { heroName: "", heroCanonicalId: null };
  const heroObject = view.object({
    instanceId: heroRecord.instanceId,
    incarnation: heroRecord.incarnation,
  });
  return {
    heroCanonicalId: heroObject?.canonicalId ?? heroRecord.canonicalId ?? null,
    heroName: heroObject?.current.names.join(" // ") ?? "",
  };
}

/**
 * Reject a hero-bound strategy seated on a non-matching hero. A mismatch is a
 * configuration error (the strategy would silently degrade to value-extract),
 * so it throws unless the caller opts out for an intentional off-hero run.
 */
function assertHeroBoundStrategies(
  state: FabRulesSnapshot,
  view: FabRulesView,
  seats: readonly (readonly [FabAutomatedActionStrategyOption, string])[],
  allowMismatch: boolean,
): void {
  for (const [option, playerId] of seats) {
    if (option.scope !== "hero" || !option.heroMatch) continue;
    const identity = readSeatedHeroIdentity(state, view, playerId);
    if (option.heroMatch(identity)) continue;
    if (allowMismatch) continue;
    throw new Error(
      `Strategy "${option.id}" is hero-bound but the seated hero is "${identity.heroName}" (${identity.heroCanonicalId ?? "?"}). ` +
        `Provide a matching deck or use the "hero-profile" dispatcher. ` +
        `To deliberately run a hero strategy off-hero (e.g. a smoke code-path test), set allowStrategyHeroMismatch: true.`,
    );
  }
}

export function playFabMatch(input: PlayFabMatchInput): FabMatchTranscript {
  // 400 accommodates legitimately slow control matchups (e.g. a Sigil-of-Solace
  // turtling opponent) that converge past 250 but are not infinite stalls — true
  // exhaustion-deadlocks are prevented by every deck carrying an activatable
  // weapon. The strict CI gate (all-strategies.playability.test.ts) keeps a 250
  // sub-budget as the regression bar.
  const maxActions = input.maxActions ?? 400;
  const considerHeads = input.considerHeads ?? 6;
  const recordFrames = input.recordFrames !== false;
  const p1Deck = input.p1Deck ?? DEFAULT_PLAYER_DECK_ID;
  const p2Deck = input.p2Deck ?? DEFAULT_BOT_DECK_ID;
  const p1 = getSafeFabAutomatedActionStrategyOption(input.p1Strategy);
  const p2 = getSafeFabAutomatedActionStrategyOption(input.p2Strategy);
  const p1Choose: FabBotPolicy =
    input.p1Policy?.choose ??
    ((runtime, actorId, context) => chooseAutomatedAction(runtime, actorId, p1.strategy, context));
  const p2Choose: FabBotPolicy =
    input.p2Policy?.choose ??
    ((runtime, actorId, context) => chooseAutomatedAction(runtime, actorId, p2.strategy, context));
  const botAutomation = {
    priorityMode: "auto-pass" as const,
    autoOrderTriggers: true,
    autoSelectSingletonTargets: true,
  };
  const match = createFabPracticeMatch(input.cardLibrary, {
    seed: input.seed,
    player1DeckId: p1Deck,
    player2DeckId: p2Deck,
    firstPlayerId: input.firstPlayer === "p2" ? PRACTICE_PLAYER_2 : PRACTICE_PLAYER_1,
    ...(input.p1Life !== undefined ? { player1Life: input.p1Life } : {}),
    ...(input.p2Life !== undefined ? { player2Life: input.p2Life } : {}),
    automation: {
      automationPreferences: {
        [PRACTICE_PLAYER_1]: botAutomation,
        [PRACTICE_PLAYER_2]: botAutomation,
      },
    },
  });
  const { runtime, player1Id, player2Id } = match;
  // Enforce hero-bound strategies: a "hero"-scope strategy must match the
  // actually seated hero. Throws (before the match loop) on mismatch unless the
  // caller explicitly opts out — so the bench fails loudly instead of silently
  // degrading a mis-seated hero strategy to value-extract.
  assertHeroBoundStrategies(
    runtime.getState(),
    buildFabRulesView(runtime.getState()),
    [
      [p1, player1Id],
      [p2, player2Id],
    ],
    input.allowStrategyHeroMismatch ?? false,
  );
  const frames: FabDecisionFrame[] = [];
  let actionCount = 0;
  let rng = seedFromString(input.seed);
  let termination: FabMatchTermination = "max-actions";
  let error: string | undefined;
  let snapshotRefusal: FabSnapshotRefusalEvidence | undefined;
  const validateSnapshots = input.snapshotValidation ?? true;

  try {
    for (let index = 0; index < maxActions; index++) {
      if (runtime.hasGameEnded()) {
        const end = runtime.getGameEndResult();
        termination = end?.reason === "concede" ? "concede" : "life";
        break;
      }
      drainAutoPassWindows(runtime, player1Id, player2Id, p1Choose, p2Choose);
      if (runtime.hasGameEnded()) {
        const end = runtime.getGameEndResult();
        termination = end?.reason === "concede" ? "concede" : "life";
        break;
      }
      const state = runtime.getState();
      const next = nextActorWithLegalCommands(runtime, player1Id, player2Id);
      const actorId =
        next?.actorId ??
        state.decision?.actorId ??
        runtime.getPriorityPlayerId() ??
        runtime.getActivePlayerId();
      if (!actorId) {
        termination = "stall";
        error = "No seated player has a legal command.";
        break;
      }
      if (!next && seatMustAct(runtime, actorId)) {
        const lastResort = concedeCommand(runtime, actorId);
        const decodedLast = decodeFabCommand(lastResort.move, lastResort.payload);
        if (decodedLast) runtime.applyCommand(actorId, decodedLast);
        termination = "concede";
        error = `${actorId} had no play, pass, or end-turn and conceded.`;
        break;
      }
      const roll = nextRandom(rng);
      rng = roll.state;
      const choose = actorId === player1Id ? p1Choose : p2Choose;
      let ranked: readonly FabCompiledLine[] = [];
      const chosen =
        choose(runtime, actorId, {
          random: () => roll.value,
          ...(recordFrames && considerHeads > 0
            ? {
                onRanked: (lines: readonly FabCompiledLine[]) => {
                  ranked = lines;
                },
              }
            : {}),
        }) ??
        next?.legal[0] ??
        (seatMustAct(runtime, actorId) ? concedeCommand(runtime, actorId) : null);
      if (!chosen) {
        termination = "stall";
        error = `${actorId} strategy returned null.`;
        break;
      }
      const legal = next?.legal ?? listLegalCommands(runtime, actorId, { includeConcede: true });
      const recordGoldfish = recordFrames && considerHeads > 0;
      const snapshotView = recordGoldfish
        ? (rulesViewForLegalCommands(legal, runtime.getStateID()) ?? buildFabRulesView(state))
        : null;
      const snapshot = recordGoldfish
        ? buildHeuristicSnapshot(runtime, actorId, snapshotView!)
        : null;
      const submitted = submitAutomatedAction(runtime, actorId, chosen, legal);
      actionCount += 1;
      if (recordFrames) {
        const chosenFrame = {
          move: submitted.command.move,
          label: submitted.command.label,
          score:
            ranked.find(
              (line) =>
                line.command.move === submitted.command.move &&
                samePayload(line.command.payload, submitted.command.payload),
            )?.score ?? null,
        } as const;
        frames.push(
          snapshot
            ? toFrame({
                index,
                actorId,
                snapshot,
                legal: legal.map((command) => command.label),
                considered: ranked.slice(0, considerHeads).map((line) => toHead(line, snapshot)),
                chosen: chosenFrame,
              })
            : chosenOnlyFrame({
                index,
                actorId,
                turnNumber: state.turnNumber,
                legal: legal.map((command) => command.label),
                chosen: chosenFrame,
              }),
        );
      }
      if (submitted.conceded || (runtime.hasGameEnded() && submitted.command.move === "concede")) {
        termination = "concede";
        error = submitted.error ?? `${actorId} had no play, pass, or end-turn and conceded.`;
        break;
      }
      if (!submitted.advanced) {
        termination = "illegal";
        error = submitted.error ?? `${actorId} could not apply a command.`;
        break;
      }
      if (validateSnapshots) {
        try {
          serializeFabMatchSnapshot(runtime.getState());
        } catch (caught) {
          // Self-play doubling as a persistence invariant gate: a mid-match
          // state the engine cannot persist is a P0 bug (2026-08-19 incident
          // family). Record the named-invariant evidence and fail the match
          // so sweeps surface it instead of shipping it to players.
          termination = "snapshot-refusal";
          error = caught instanceof Error ? caught.message : String(caught);
          if (caught instanceof FabSnapshotSerializationRefusalError) {
            snapshotRefusal = {
              message: caught.message,
              issues: caught.issues,
              stateSummary: caught.stateSummary,
              rejectedSnapshot: caught.rejectedSnapshot,
            };
          } else {
            snapshotRefusal = {
              message: error,
              issues: null,
              stateSummary: null,
              rejectedSnapshot: null,
            };
          }
          break;
        }
      }
      if (index === maxActions - 1 && !runtime.hasGameEnded()) {
        termination = "max-actions";
      }
    }
  } catch (caught) {
    termination = "engine-throw";
    error = caught instanceof Error ? caught.message : String(caught);
  }

  const end = runtime.getGameEndResult();
  if (runtime.hasGameEnded() && termination === "max-actions") {
    termination = end?.reason === "concede" ? "concede" : "life";
  }

  return {
    seed: input.seed,
    p1Strategy: input.p1Policy?.id ?? p1.id,
    p2Strategy: input.p2Policy?.id ?? p2.id,
    p1Deck,
    p2Deck,
    player1Id,
    player2Id,
    termination,
    winnerId: end?.winnerId ?? null,
    winReason: end?.reason ?? null,
    actionCount,
    turnCount: runtime.getState().turnNumber,
    frames,
    ...(error ? { error } : {}),
    ...(snapshotRefusal ? { snapshotRefusal } : {}),
  };
}

function chosenOnlyFrame(input: {
  readonly index: number;
  readonly actorId: string;
  readonly turnNumber: number;
  readonly legal: readonly string[];
  readonly chosen: FabDecisionFrame["chosen"];
}): FabDecisionFrame {
  return {
    index: input.index,
    turnNumber: input.turnNumber,
    actorId: input.actorId,
    combatOpen: false,
    defending: false,
    life: 0,
    opponentLife: null,
    actionPoints: 0,
    resourcePoints: 0,
    hand: [],
    arsenal: [],
    arena: [],
    equipment: [],
    remainingDamage: null,
    isMirror: false,
    legal: input.legal,
    considered: [],
    chosen: input.chosen,
  };
}

function toFrame(input: {
  readonly index: number;
  readonly actorId: string;
  readonly snapshot: ReturnType<typeof buildHeuristicSnapshot>;
  readonly legal: readonly string[];
  readonly considered: readonly FabDecisionHead[];
  readonly chosen: FabDecisionFrame["chosen"];
}): FabDecisionFrame {
  const snapshot = input.snapshot;
  return {
    index: input.index,
    turnNumber: snapshot.turnNumber,
    actorId: input.actorId,
    combatOpen: snapshot.combatOpen,
    defending: snapshot.defending,
    life: snapshot.life,
    opponentLife: snapshot.opponentLife,
    actionPoints: snapshot.actionPoints,
    resourcePoints: snapshot.resourcePoints,
    hand: snapshot.hand.map((card) => card.name),
    arsenal: snapshot.arsenal.map((card) => card.name),
    arena: snapshot.arena.map((card) => card.name),
    equipment: snapshot.equipment.map((card) => card.name),
    remainingDamage: snapshot.remainingDamage,
    isMirror: snapshot.isMirror,
    legal: input.legal,
    considered: input.considered,
    chosen: input.chosen,
  };
}

function toHead(
  line: FabCompiledLine,
  snapshot: ReturnType<typeof buildHeuristicSnapshot>,
): FabDecisionHead {
  return {
    kind: line.kind,
    score: line.score,
    label: line.command.label,
    ...(line.playInstanceId ? { play: cardByInstance(snapshot, line.playInstanceId)?.name } : {}),
    ...(line.arsenalInstanceId
      ? { arsenal: cardByInstance(snapshot, line.arsenalInstanceId)?.name }
      : {}),
    ...(line.defendInstanceIds
      ? {
          defend: line.defendInstanceIds.map((id) => cardByInstance(snapshot, id)?.name ?? id),
        }
      : {}),
  };
}

function samePayload(left: Record<string, unknown>, right: Record<string, unknown>): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function autoPassPolicyFor(priorityMode: string): FabAutoPassPolicy {
  switch (priorityMode) {
    case "auto-pass":
      return { kind: "pass-only" };
    case "play-and-skip":
      return { kind: "own-skip" };
    default:
      return { kind: "never" };
  }
}

/** Close empty priority windows without spending the converting-action budget. */
function drainAutoPassWindows(
  runtime: ReturnType<typeof createFabPracticeMatch>["runtime"],
  player1Id: string,
  player2Id: string,
  p1Choose: FabBotPolicy,
  p2Choose: FabBotPolicy,
): void {
  for (let safety = 0; safety < 128; safety += 1) {
    if (runtime.hasGameEnded()) return;
    const next = nextActorWithLegalCommands(runtime, player1Id, player2Id);
    const actorId = next?.actorId ?? runtime.getPriorityPlayerId();
    if (!actorId) return;
    const mode =
      runtime.getState().automationPreferences[actorId]?.priorityMode ??
      FAB_DEFAULT_AUTOMATION_PREFERENCES.priorityMode;
    const auto = getFabAutoPassPriorityCommand(runtime, autoPassPolicyFor(mode));
    const choose = actorId === player1Id ? p1Choose : p2Choose;
    const command = auto ?? emptyPriorityPass(runtime, actorId, choose);
    if (!command) return;
    const before = runtime.getStateID();
    const decoded = decodeFabCommand(command.move, command.payload);
    if (!decoded) return;
    const result = runtime.applyCommand(actorId, decoded);
    if (!result.success || runtime.getStateID() === before) return;
  }
}

/**
 * Human auto-pass never closes the attacker's Resolution-step window and
 * treats utility instants as real options. Drain only windows the policy
 * itself passes; labels cannot establish that an instant has no value.
 */
function emptyPriorityPass(
  runtime: ReturnType<typeof createFabPracticeMatch>["runtime"],
  actorId: string,
  choose: FabBotPolicy,
): FabLegalCommand | null {
  const state = runtime.getState();
  if (state.decision) return null;
  const kind = fabPriorityWindowContext(state, actorId).kind;
  if (kind === "decision" || kind === "defense-declaration" || kind === "terminal-action-phase") {
    return null;
  }
  const legal = botEligibleFabCommands(listLegalCommands(runtime, actorId));
  const pass = legal.find((command) => command.move === "pass");
  if (pass?.move !== "pass") return null;
  if (legal.some((command) => command.move !== "pass" && command.move !== "concede")) {
    const chosen = choose(runtime, actorId);
    if (chosen?.move !== "pass") return null;
  }
  return pass;
}

function nextActorWithLegalCommands(
  runtime: ReturnType<typeof createFabPracticeMatch>["runtime"],
  player1Id: string,
  player2Id: string,
): { readonly actorId: string; readonly legal: ReturnType<typeof listLegalCommands> } | null {
  const state = runtime.getState();
  const ordered = [
    state.decision?.actorId,
    runtime.getPriorityPlayerId(),
    runtime.getActivePlayerId(),
    player1Id,
    player2Id,
  ];
  const seen = new Set<string>();
  for (const actorId of ordered) {
    if (!actorId || seen.has(actorId)) continue;
    seen.add(actorId);
    const legal = listLegalCommands(runtime, actorId);
    if (legal.length > 0) return { actorId, legal };
  }
  return null;
}
