import { create } from "mutative";
import type { StructuredCardDefinition, CardZone } from "@tcg/cyberpunk-types";
import type { MatchState } from "../types/match-state.ts";
import type {
  CommandResult,
  CommandSuccess,
  CommandFailure,
  MoveInput,
} from "../types/commands.ts";
import type { CardInstance } from "../types/card-instance.ts";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { GigDie } from "../types/gig-die.ts";
import type { GameEvent, ActionLogEvent } from "../types/game-events.ts";
import type {
  ActiveEffect,
  AttackState,
  PendingChoice,
  TurnMetadata,
} from "../types/match-state.ts";
import { asCardInstanceId } from "../types/branded.ts";
import { LocalEngine } from "../transport/local-engine.ts";
import { judgeAllMoves } from "../moves/judge.ts";
import { registerMoves } from "../command/index.ts";
import type { CardMeta } from "../types/card-instance.ts";
import type { FilteredMatchView } from "../view/filter.ts";
import type { PlayerPrompt } from "../view/player-prompt.ts";
import {
  type GigFixtureEntry,
  type PlayerFixture,
  type TestEngineOptions,
} from "./test-fixtures.ts";
import { createTestMatchState, P1, P2 } from "./test-state.ts";
import { recomputeActiveEffects } from "../active-effects/index.ts";

// Custom vitest matchers (toBeSuccessfulCommand, toBeInZone, toHaveEddies,
// toBeInPhase, toHaveEffectivePower) are NOT registered automatically.
// Tests that use them must `import { registerMatchers } from "../testing/register-matchers.ts"`
// and call `registerMatchers()` themselves. This keeps the test engine
// importable from non-test environments (e.g. the simulator app) without
// pulling vitest into the bundle.

export { P1, P2 };

/** Standard die set: d20, d12, d10, d8, d6, d4 (same order as STANDARD_GIG_DICE). */
export const ALL_DICE: GigFixtureEntry[] = [
  { dieType: "d20", faceValue: 1 },
  { dieType: "d12", faceValue: 1 },
  { dieType: "d10", faceValue: 1 },
  { dieType: "d8", faceValue: 1 },
  { dieType: "d6", faceValue: 1 },
  { dieType: "d4", faceValue: 1 },
];

export type CardRef = string | CardInstance | StructuredCardDefinition;
type GameEventType = GameEvent["type"];
type GameEventOfType<T extends GameEventType> = Extract<GameEvent, { type: T }>;

export interface ResolveTargets {
  friendlyGig?: GigDie["dieType"];
  rivalGig?: GigDie["dieType"];
}

interface PlayCardOpts extends MoveOpts, ResolveTargets {}

/**
 * Error thrown when a move fails during test execution.
 * Use `engine.expectFailure()` to catch and inspect these.
 */
export class MoveFailedError extends Error {
  readonly failure: CommandFailure;

  constructor(failure: CommandFailure) {
    super(`Move failed: ${failure.error} (${failure.errorCode})`);
    this.name = "MoveFailedError";
    this.failure = failure;
  }
}

function resolveCardRef(
  state: MatchState,
  card: CardRef,
  zone?: CardZone,
  playerId?: PlayerId,
): CardInstanceId {
  if (typeof card === "string") {
    return asCardInstanceId(card);
  }

  if ("instanceId" in card && "zone" in card) {
    return (card as CardInstance).instanceId;
  }

  const definition = card as StructuredCardDefinition;
  const pid = playerId ? (playerId as string) : "p1";
  const searchZones: CardZone[] = zone
    ? [zone]
    : ["hand", "field", "legendArea", "deck", "trash", "eddieArea"];

  for (const pidToSearch of [pid, "p1", "p2"]) {
    const player = state.G.players[pidToSearch];
    if (!player) continue;
    for (const z of searchZones) {
      const ids = player.zones[z];
      if (!ids) continue;
      for (const id of ids) {
        const inst = state.G.cardIndex[id as string];
        if (inst && inst.definitionId === definition.id) {
          return inst.instanceId;
        }
      }
    }
  }

  throw new Error(
    `Card "${definition.slug ?? definition.name ?? definition.id}" not found in state.`,
  );
}

function assertChoiceSourceMatchesCard(
  state: MatchState,
  sourceCardId: CardInstanceId,
  card: CardRef,
): void {
  if (typeof card === "string") {
    if (sourceCardId !== card) {
      throw new Error(`Pending choice source ${sourceCardId as string} does not match ${card}`);
    }
    return;
  }
  if ("instanceId" in card && "zone" in card) {
    if (sourceCardId !== card.instanceId) {
      throw new Error(
        `Pending choice source ${sourceCardId as string} does not match ${card.instanceId}`,
      );
    }
    return;
  }
  const sourceCard = state.G.cardIndex[sourceCardId as string];
  if (sourceCard?.definitionId !== card.id) {
    throw new Error(
      `Pending choice source ${sourceCard?.definitionId ?? "unknown"} does not match ${card.id}`,
    );
  }
}

function hasResolveTargets(targets: ResolveTargets): boolean {
  return targets.friendlyGig !== undefined || targets.rivalGig !== undefined;
}

export class CyberpunkTestEngine {
  private engine: LocalEngine;
  private eventLog: GameEvent[] = [];
  private autoGainGig: boolean;
  // Monotonic counter for synthesised command IDs. Replaces wall-clock /
  // Math.random ids so runs (and replays) are byte-identical given the same
  // sequence of moves.
  private commandCounter = 0;

  private constructor(state: MatchState, opts?: TestEngineOptions) {
    const stateWithActiveEffects = create(state, (draft) => {
      recomputeActiveEffects(draft);
    });
    this.engine = new LocalEngine(stateWithActiveEffects);
    registerMoves(judgeAllMoves);
    this.autoGainGig = opts?.autoGainGig ?? true;
    // The auto-advance from setup→play (via mulligan/keepHand inside
    // createTestMatchState path) may already have set a `gainGig` pending
    // choice. Resolve it on construction so plain skipSetup:true tests don't
    // see a hanging choice.
    this.maybeAutoResolveGainGig();
  }

  static createWithFixture(
    p1: PlayerFixture,
    p2?: PlayerFixture,
    opts?: TestEngineOptions,
  ): CyberpunkTestEngine {
    return new CyberpunkTestEngine(createTestMatchState(p1, p2, opts), opts);
  }

  static fromState(state: MatchState, opts?: TestEngineOptions): CyberpunkTestEngine {
    return new CyberpunkTestEngine(state, opts);
  }

  getState(): MatchState {
    return this.engine.getState();
  }

  getFilteredView(playerId: PlayerId): FilteredMatchView {
    return this.engine.getFilteredView(playerId);
  }

  getPrompt(playerId: PlayerId): PlayerPrompt {
    return this.engine.getPrompt(playerId);
  }

  /**
   * Public accessor for the underlying {@link LocalEngine}, exposed so
   * external tooling (AI harnesses, dev clients) can drive the engine via the
   * canonical command surface — the same surface tests use.
   */
  getLocalEngine(): LocalEngine {
    return this.engine;
  }

  playCard(card: CardRef, opts?: PlayCardOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const cardId = resolveCardRef(this.getState(), card, "hand", playerId);
    const result = this.exec("playCard", { args: { cardId: cardId as string } }, playerId);
    if (opts && hasResolveTargets(opts)) {
      return this.resolve(card, opts, { as: playerId });
    }
    return result;
  }

  attachGear(gear: CardRef, attachTo: CardRef, opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const cardId = resolveCardRef(this.getState(), gear, "hand", playerId);
    const attachToId = resolveCardRef(this.getState(), attachTo);
    return this.exec(
      "playCard",
      { args: { cardId: cardId as string, attachToId: attachToId as string } },
      playerId,
    );
  }

  sellCard(card: CardRef, opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const cardId = resolveCardRef(this.getState(), card, "hand", playerId);
    return this.exec("sellCard", { args: { cardId: cardId as string } }, playerId);
  }

  callLegend(card: CardRef, opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const cardId = resolveCardRef(this.getState(), card, "legendArea", playerId);
    return this.exec("callLegend", { args: { legendId: cardId as string } }, playerId);
  }

  attackUnit(attacker: CardRef, defender: CardRef, opts?: MoveOpts): CommandSuccess {
    const state = this.getState();
    const playerId = opts?.as ?? this.getActivePlayerId();
    const attackerId = resolveCardRef(state, attacker, "field", playerId);
    const opponentId = this.getOpponentOf(playerId);
    const defenderId = resolveCardRef(state, defender, "field", opponentId);
    return this.exec(
      "attackUnit",
      {
        args: {
          attackerId: attackerId as string,
          defenderId: defenderId as string,
        },
      },
      playerId,
    );
  }

  attackRival(attacker: CardRef, opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const attackerId = resolveCardRef(this.getState(), attacker, "field", playerId);
    return this.exec("attackRival", { args: { attackerId: attackerId as string } }, playerId);
  }

  useBlocker(blocker: CardRef, opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const blockerId = resolveCardRef(this.getState(), blocker, "field", playerId);
    return this.exec("useBlocker", { args: { blockerId: blockerId as string } }, playerId);
  }

  passPhase(opts?: MoveOpts): CommandSuccess {
    return this.exec("passPhase", { args: {} }, opts?.as ?? this.getActivePlayerId());
  }

  completeTurn(opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    return this.passPhase({ as: playerId });
  }

  concede(opts?: MoveOpts): CommandSuccess {
    return this.exec("concede", { args: {} }, opts?.as ?? this.getActivePlayerId());
  }

  mulligan(opts?: MoveOpts): CommandSuccess {
    return this.exec("mulligan", { args: {} }, opts?.as ?? P1);
  }

  keepHand(opts?: MoveOpts): CommandSuccess {
    return this.exec("keepHand", { args: {} }, opts?.as ?? P1);
  }

  gainGig(die: string | { id: string }, opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const dieId = typeof die === "string" ? die : die.id;
    return this.exec("gainGig", { args: { dieId } }, playerId);
  }

  resolveAttack(opts?: ResolveAttackOpts): CommandSuccess {
    const result = this.exec(
      "resolveAttack",
      {
        args: {
          gigIdsToSteal: opts?.gigIdsToSteal,
          pass: opts?.pass,
        },
      },
      opts?.as ?? this.getActivePlayerId(),
    );
    // The new chooseGigsToSteal flow suspends mid-attack when the rival has
    // more eligible dice than the steal count. Tests that don't care about
    // the choice mechanics expect the legacy "top of gig area" pick — auto-
    // resolve here unless the caller already supplied gigIdsToSteal.
    if (opts?.gigIdsToSteal === undefined) {
      this.autoResolvePendingStealGigs();
    }
    return result;
  }

  private autoResolvePendingStealGigs(): void {
    const state = this.getState();
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseGigsToSteal") return;
    const dieIds = choice.payload.eligibleDieIds.slice(0, choice.payload.count);
    // eslint-disable-next-line no-console
    console.warn(
      `[test-engine] auto-selected ${dieIds.length} gig(s) to steal for player "${choice.chooserId}" ` +
        `(chooseGigsToSteal pending choice). Pass gigIdsToSteal explicitly to control the selection.`,
    );
    this.exec(
      "resolveStealGigs",
      { args: { dieIds: dieIds.map((id) => id as string) } },
      choice.chooserId,
    );
  }

  resolveCardToPlay(card: CardRef, opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const state = this.getState();
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseCardToPlay") {
      throw new Error("No chooseCardToPlay pending choice to resolve");
    }
    const cardId = resolveCardRef(state, card, undefined, playerId);
    return this.exec("resolveCardToPlay", { args: { cardId: cardId as string } }, playerId);
  }

  resolveCardToMove(card?: CardRef, opts?: { pass?: boolean } & MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const state = this.getState();
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseCardToMove") {
      throw new Error("No chooseCardToMove pending choice to resolve");
    }
    if (opts?.pass) {
      return this.exec("resolveCardToMove", { args: { pass: true } }, playerId);
    }
    if (!card) throw new Error("Must provide a card or pass:true");
    // Gear is in the legend area (attached to a legend), not in hand.
    const cardId = resolveCardRef(state, card);
    return this.exec("resolveCardToMove", { args: { cardId: cardId as string } }, playerId);
  }

  activateAbility(card: CardRef, abilityIndex: number, opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const cardId = resolveCardRef(this.getState(), card, undefined, playerId);
    return this.exec(
      "activateAbility",
      { args: { cardId: cardId as string, abilityIndex } },
      playerId,
    );
  }

  resolveSearchDeck(selectedCards: CardRef[], opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const state = this.getState();
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "searchDeck") {
      throw new Error("No searchDeck pending choice to resolve");
    }
    const selectedCardIds = selectedCards.map(
      (card) => resolveCardRef(state, card, undefined, playerId) as string,
    );
    return this.exec("resolveSearchDeck", { args: { selectedCardIds } }, playerId);
  }

  resolveDiscardFromHand(cards: CardRef[], opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const state = this.getState();
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "discardFromHand") {
      throw new Error("No chooseTarget discardFromHand pending choice to resolve");
    }
    const cardIds = cards.map((card) => resolveCardRef(state, card, "hand", playerId) as string);
    return this.exec("resolveDiscardFromHand", { args: { cardIds } }, playerId);
  }

  resolve(card: CardRef, targets: ResolveTargets, opts?: MoveOpts): CommandSuccess {
    const state = this.getState();
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      throw new Error("No chooseTarget effectTarget pending choice to resolve");
    }
    if (!choice.payload.sourceCardId) {
      throw new Error("Pending effect target choice does not identify a source card");
    }
    assertChoiceSourceMatchesCard(state, choice.payload.sourceCardId, card);

    const playerId = opts?.as ?? choice.chooserId;
    const targetIds: string[] = [];
    if (targets.friendlyGig) {
      targetIds.push(this.findGigIdByType(playerId, targets.friendlyGig));
    }
    if (targets.rivalGig) {
      targetIds.push(this.findGigIdByType(this.getOpponentOf(playerId), targets.rivalGig));
    }
    if (targetIds.length === 0) {
      throw new Error("No supported resolve targets provided");
    }
    return this.exec("resolveEffectTarget", { args: { targetIds } }, playerId);
  }

  resolveEffectTarget(targets: CardRef | CardRef[], opts?: MoveOpts): CommandSuccess {
    const state = this.getState();
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      throw new Error("No chooseTarget effectTarget pending choice to resolve");
    }
    const playerId = opts?.as ?? choice.chooserId;
    const refs = Array.isArray(targets) ? targets : [targets];
    const eligibleIds = choice.payload.eligibleIds ?? [];
    const targetIds = refs.map((card) => {
      if (typeof card !== "string" && !("instanceId" in card)) {
        const eligible = eligibleIds.find((id) => state.G.cardIndex[id]?.definitionId === card.id);
        if (eligible) return eligible as string;
      }
      return resolveCardRef(state, card) as string;
    });
    return this.exec("resolveEffectTarget", { args: { targetIds } }, playerId);
  }

  // ── Judge moves (test-only state manipulation) ─────────────────────

  judgeSpendCard(card: CardRef, opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const cardId = resolveCardRef(this.getState(), card, undefined, playerId);
    return this.exec("judge:spendCard", { args: { cardId: cardId as string } }, playerId);
  }

  judgeReadyCard(card: CardRef, opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const cardId = resolveCardRef(this.getState(), card, undefined, playerId);
    return this.exec("judge:readyCard", { args: { cardId: cardId as string } }, playerId);
  }

  judgeSetCardMeta(card: CardRef, meta: Partial<CardMeta>, opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const cardId = resolveCardRef(this.getState(), card, undefined, playerId);
    return this.exec("judge:setCardMeta", { args: { cardId: cardId as string, meta } }, playerId);
  }

  judgeSetCardDefinition(card: CardRef, definitionId: string, opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const cardId = resolveCardRef(this.getState(), card, undefined, playerId);
    return this.exec(
      "judge:setCardDefinition",
      { args: { cardId: cardId as string, definitionId } },
      playerId,
    );
  }

  judgeMoveCardToZone(
    card: CardRef,
    toZone: CardZone,
    opts?: { playerId?: PlayerId; index?: number } & MoveOpts,
  ): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const cardId = resolveCardRef(this.getState(), card, undefined, opts?.playerId ?? playerId);
    return this.exec(
      "judge:moveCardToZone",
      {
        args: {
          cardId: cardId as string,
          toZone,
          playerId: opts?.playerId as string | undefined,
          index: opts?.index,
        },
      },
      playerId,
    );
  }

  judgeMoveCardToTopOfDeck(card: CardRef, opts?: MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const cardId = resolveCardRef(this.getState(), card, undefined, playerId);
    return this.exec(
      "judge:moveCardToTopOfDeck",
      { args: { cardId: cardId as string, playerId: playerId as string } },
      playerId,
    );
  }

  judgeStackDeck(cards: CardRef[], opts?: { replace?: boolean } & MoveOpts): CommandSuccess {
    const playerId = opts?.as ?? this.getActivePlayerId();
    const state = this.getState();
    const cardIds = cards.map((card) => resolveCardRef(state, card, "deck", playerId) as string);
    return this.exec(
      "judge:stackDeck",
      { args: { playerId: playerId as string, cardIds, replace: opts?.replace } },
      playerId,
    );
  }

  judgeMoveFixerDieToGigArea(
    playerId: PlayerId,
    opts?: { dieId?: string; dieType?: GigDie["dieType"]; faceValue?: number } & MoveOpts,
  ): CommandSuccess {
    return this.exec(
      "judge:moveFixerDieToGigArea",
      {
        args: {
          playerId: playerId as string,
          dieId: opts?.dieId,
          dieType: opts?.dieType,
          faceValue: opts?.faceValue,
        },
      },
      opts?.as ?? playerId,
    );
  }

  judgeMoveAllFixerDiceToGigArea(playerId: PlayerId, opts?: MoveOpts): void {
    while (this.getFixerDice(playerId).length > 0) {
      this.judgeMoveFixerDieToGigArea(playerId, { as: opts?.as ?? playerId });
    }
  }

  judgeMoveGigToPlayer(
    die: string | GigDie,
    toPlayerId: PlayerId,
    opts?: { sourceCardId?: string } & MoveOpts,
  ): CommandSuccess {
    const dieId = typeof die === "string" ? die : die.id;
    return this.exec(
      "judge:moveGigToPlayer",
      {
        args: {
          dieId,
          toPlayerId: toPlayerId as string,
          sourceCardId: opts?.sourceCardId,
        },
      },
      opts?.as ?? toPlayerId,
    );
  }

  judgeAddGigDie(
    playerId: PlayerId,
    dieType: GigDie["dieType"],
    faceValue: number,
    opts?: { id?: string } & MoveOpts,
  ): CommandSuccess {
    return this.exec(
      "judge:addGigDie",
      {
        args: {
          playerId: playerId as string,
          dieType,
          faceValue,
          id: opts?.id,
        },
      },
      opts?.as ?? playerId,
    );
  }

  judgeSetGigValue(die: string | GigDie, value: number, opts?: MoveOpts): CommandSuccess {
    const dieId = typeof die === "string" ? die : die.id;
    return this.exec("judge:setGigValue", { args: { dieId, value } }, opts?.as ?? P1);
  }

  judgeSetTurnMetadata(patch: Partial<TurnMetadata>, opts?: MoveOpts): CommandSuccess {
    return this.exec("judge:setTurnMetadata", { args: { patch } }, opts?.as ?? P1);
  }

  judgeSetAttackState(attackState: AttackState | null, opts?: MoveOpts): CommandSuccess {
    return this.exec("judge:setAttackState", { args: { attackState } }, opts?.as ?? P1);
  }

  judgeSetPendingChoice(pendingChoice: PendingChoice | undefined, opts?: MoveOpts): CommandSuccess {
    return this.exec("judge:setPendingChoice", { args: { pendingChoice } }, opts?.as ?? P1);
  }

  judgeAddActiveEffect(effect: ActiveEffect, opts?: MoveOpts): CommandSuccess {
    return this.exec("judge:addActiveEffect", { args: { effect } }, opts?.as ?? P1);
  }

  judgeRecomputeActiveEffects(opts?: MoveOpts): CommandSuccess {
    return this.exec("judge:recomputeActiveEffects", { args: {} }, opts?.as ?? P1);
  }

  /**
   * Low-level move execution that returns the raw CommandResult without
   * asserting success. Use this when you need to inspect failure details
   * without `expectFailure()`.
   */
  executeMove(move: string, input?: MoveInput, playerId?: PlayerId): CommandResult {
    return this.execRaw(move, input ?? { args: {} }, playerId ?? this.getActivePlayerId());
  }

  as(playerId: PlayerId): PlayerHandle {
    return new PlayerHandle(this, playerId);
  }

  // ── Multi-view API (Lorcana-style) ────────────────────────────────
  //
  // Three explicit views over the same underlying state. Tests pick the
  // perspective that matches what they're asserting:
  //   - asServer() — raw, unfiltered state and an "look anywhere" escape hatch
  //   - asPlayerOne() / asPlayerTwo() — filtered (visibility-correct) view +
  //     full move surface as the named player.
  //
  // The state is single-source: the same LocalEngine is read by all three.
  // A move executed via `asPlayerOne().playCard(...)` is immediately visible
  // through `asServer().getState()` — no sync step.

  /** Authoritative view: raw state + zone-bypassing introspection. */
  asServer(): ServerView {
    return new ServerView(this);
  }

  /** Player 1's view + move surface. Filtered for visibility. */
  asPlayerOne(): PlayerHandle {
    return new PlayerHandle(this, P1);
  }

  /** Player 2's view + move surface. Filtered for visibility. */
  asPlayerTwo(): PlayerHandle {
    return new PlayerHandle(this, P2);
  }

  getCard(card: CardRef, zone?: CardZone, playerId?: PlayerId): CardInstance {
    const id = resolveCardRef(this.getState(), card, zone, playerId ?? this.getActivePlayerId());
    const inst = this.getState().G.cardIndex[id as string];
    if (!inst) throw new Error(`Card instance ${id as string} not found`);
    return inst;
  }

  getCardsInZone(zone: CardZone, playerId: PlayerId): CardInstance[] {
    const state = this.getState();
    const player = state.G.players[playerId as string];
    if (!player) return [];
    return (player.zones[zone] ?? [])
      .map((id) => state.G.cardIndex[id as string])
      .filter((c): c is CardInstance => c !== undefined);
  }

  findCardId(card: CardRef, zone: CardZone, playerId: PlayerId): CardInstanceId {
    return resolveCardRef(this.getState(), card, zone, playerId);
  }

  getGigCount(playerId: PlayerId): number {
    return this.getState().G.players[playerId as string]?.gigArea.length ?? 0;
  }

  getStreetCred(playerId: PlayerId): number {
    const state = this.getState();
    const player = state.G.players[playerId as string];
    if (!player) return 0;
    return player.gigArea.reduce((sum, dieId) => {
      const die = state.G.gigDice[dieId as string];
      return sum + (die?.faceValue ?? 0);
    }, 0);
  }

  getFixerDice(playerId: PlayerId): GigDie[] {
    const state = this.getState();
    const player = state.G.players[playerId as string];
    if (!player) return [];
    return player.fixerArea
      .map((id) => state.G.gigDice[id as string])
      .filter((d): d is GigDie => d !== undefined);
  }

  getGigDice(playerId: PlayerId): GigDie[] {
    const state = this.getState();
    const player = state.G.players[playerId as string];
    if (!player) return [];
    return player.gigArea
      .map((id) => state.G.gigDice[id as string])
      .filter((d): d is GigDie => d !== undefined);
  }

  findGigIdByType(playerId: PlayerId, dieType: GigDie["dieType"]): string {
    const die = this.getGigDice(playerId).find((d) => d.dieType === dieType);
    if (!die) throw new Error(`Expected ${dieType} in ${playerId as string} gig area`);
    return die.id as string;
  }

  getGigValue(playerId: PlayerId, dieIndex = 0): number {
    const dice = this.getGigDice(playerId);
    return dice[dieIndex]?.faceValue ?? 0;
  }

  getHandCount(playerId: PlayerId): number {
    return this.getCardsInZone("hand", playerId).length;
  }

  getPhase(): string {
    return this.getState().G.gamePhase;
  }

  getActivePlayerId(): PlayerId {
    return this.getState().G.turnMetadata.activePlayerId;
  }

  getEddies(playerId: PlayerId): number {
    return this.getState().G.players[playerId as string]?.eddies ?? 0;
  }

  isGameOver(): boolean {
    return this.getState().G.gameEnded;
  }

  getWinnerId(): PlayerId | null {
    return this.getState().G.winnerId;
  }

  getWinReason(): string | null {
    return this.getState().G.winReason;
  }

  getEvents<T extends GameEventType>(type: T): GameEventOfType<T>[];
  getEvents(): GameEvent[];
  getEvents(type?: GameEventType): GameEvent[] {
    if (type) {
      return this.eventLog.filter((e) => e.type === type);
    }
    return [...this.eventLog];
  }

  getLastEvent(type: string): GameEvent | undefined {
    const events = this.eventLog.filter((e) => e.type === type);
    return events[events.length - 1];
  }

  undo(): boolean {
    return this.engine.undo();
  }

  canUndo(): boolean {
    return this.engine.canUndo();
  }

  undoToTurnStart(): boolean {
    return this.engine.undoToTurnStart();
  }

  canUndoToTurnStart(): boolean {
    return this.engine.canUndoToTurnStart();
  }

  // ── Query methods (decouple tests from internal state) ────────────

  isMulliganDone(playerId: PlayerId): boolean {
    return this.getState().G.players[playerId as string]?.mulliganDone ?? false;
  }

  isFirstPlayer(playerId: PlayerId): boolean {
    return this.getState().G.players[playerId as string]?.firstPlayer ?? false;
  }

  getTurnNumber(): number {
    return this.getState().G.turnMetadata.turnNumber;
  }

  getOpponentOf(playerId: PlayerId): PlayerId {
    const state = this.getState();
    return state.ctx.playerIds.find((id) => id !== playerId) ?? P2;
  }

  getSpentLegends(playerId: PlayerId): CardInstance[] {
    return this.getCardsInZone("legendArea", playerId).filter((c) => c.meta.spent);
  }

  getFaceDownLegends(playerId: PlayerId): CardInstance[] {
    return this.getCardsInZone("legendArea", playerId).filter((c) => c.meta.faceDown);
  }

  getAttackState(): AttackState | null {
    return this.getState().G.attackState;
  }

  /**
   * Resolve all steps of a unit-vs-unit fight:
   *   offensive → defensive → fight → defeat.
   */
  resolveFullFight(opts?: { as?: PlayerId }): void {
    const attacker = opts?.as ?? this.getActivePlayerId();
    const defender = this.getOpponentOf(attacker);
    this.resolveAttack({ as: attacker }); // offensive → defensive
    this.resolveAttack({ as: defender, pass: true }); // defensive → fight
    this.resolveAttack({ as: attacker }); // fight → defeat
    this.resolveAttack({ as: attacker }); // defeat → cleared
  }

  /**
   * Resolve all steps of a direct attack / steal:
   *   offensive → defensive → steal.
   */
  resolveFullSteal(opts?: { as?: PlayerId }): void {
    const attacker = opts?.as ?? this.getActivePlayerId();
    const defender = this.getOpponentOf(attacker);
    this.resolveAttack({ as: attacker }); // offensive → defensive
    this.resolveAttack({ as: defender, pass: true }); // defensive → steal
    this.resolveAttack({ as: attacker }); // steal → cleared
  }

  /**
   * Return the most recent `actionLog` event, or `undefined` if none has been
   * emitted yet. Use this instead of `getLastEvent("actionLog")` to get a
   * properly typed result. Trigger queue diagnostics are intentionally skipped
   * here so legacy tests that assert the primary move log do not have to know
   * whether that move also auto-resolved a trigger.
   */
  getLastActionLog(): ActionLogEvent | undefined {
    const events = this.eventLog.filter(
      (e): e is ActionLogEvent => e.type === "actionLog" && !e.messageKey.startsWith("trigger."),
    );
    return events[events.length - 1];
  }

  spendAllLegends(playerId: PlayerId = P1): void {
    for (const legend of this.getCardsInZone("legendArea", playerId)) {
      this.judgeSpendCard(legend, { as: playerId });
    }
  }

  // ── Failure testing ───────────────────────────────────────────────

  /**
   * Executes a callback that is expected to throw `MoveFailedError`.
   * Returns the `CommandFailure` for assertions.
   *
   * @example
   * const failure = engine.expectFailure(() => engine.mulligan({ as: P1 }));
   * expect(failure.errorCode).toBe("ALREADY_MULLIGANED");
   */
  expectFailure(fn: () => void): CommandFailure {
    try {
      fn();
    } catch (e) {
      if (e instanceof MoveFailedError) return e.failure;
      throw e;
    }
    throw new Error("Expected move to fail, but it succeeded");
  }

  // ── Internal ──────────────────────────────────────────────────────

  private exec(move: string, input: MoveInput, playerId: PlayerId): CommandSuccess {
    const result = this.execRaw(move, input, playerId);
    if (!result.success) {
      throw new MoveFailedError(result);
    }
    return result;
  }

  private execRaw(move: string, input: MoveInput, playerId: PlayerId): CommandResult {
    const result = this.engine.processCommand(
      {
        commandID: `cmd-${++this.commandCounter}`,
        move,
        input,
      },
      playerId,
    );

    if (result.success) {
      this.eventLog.push(...result.gameEvents);
      // Most tests don't care about the gainGig choice — auto-resolve so
      // they don't have to call gainGig() after every turn end. Tests that
      // need rules-faithful behavior pass `autoGainGig: false`.
      if (move !== "gainGig") this.maybeAutoResolveGainGig();
    }

    return result;
  }

  /**
   * If a `gainGig` pending choice is open and {@link autoGainGig} is enabled,
   * resolve it by picking the first allowed die. Mirrors the engine's
   * pre-pending-choice behavior (auto-take a non-d20, fall back to d20).
   */
  private maybeAutoResolveGainGig(): void {
    if (!this.autoGainGig) return;
    const choice = this.engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "gainGig") return;
    const dieId = choice.payload.allowedDieIds[0];
    if (!dieId) return;
    // eslint-disable-next-line no-console
    console.warn(
      `[test-engine] auto-selected gig die "${dieId}" for player "${choice.chooserId}" (gainGig pending choice). ` +
        `Pass { autoGainGig: false } or call gainGig() explicitly to control the selection.`,
    );
    const result = this.engine.processCommand(
      {
        commandID: `auto-gaingig-${++this.commandCounter}`,
        move: "gainGig",
        input: { args: { dieId: dieId as string } },
      },
      choice.chooserId,
    );
    if (result.success) {
      this.eventLog.push(...result.gameEvents);
    }
  }
}

interface MoveOpts {
  as?: PlayerId;
}

interface ResolveAttackOpts extends MoveOpts {
  gigIdsToSteal?: string[];
  pass?: boolean;
}

export class PlayerHandle {
  private engine: CyberpunkTestEngine;
  readonly playerId: PlayerId;

  constructor(engine: CyberpunkTestEngine, playerId: PlayerId) {
    this.engine = engine;
    this.playerId = playerId;
  }

  // Actions (throw on failure)
  playCard(card: CardRef): CommandSuccess {
    return this.engine.playCard(card, { as: this.playerId });
  }
  attachGear(gear: CardRef, attachTo: CardRef): CommandSuccess {
    return this.engine.attachGear(gear, attachTo, { as: this.playerId });
  }
  sellCard(card: CardRef): CommandSuccess {
    return this.engine.sellCard(card, { as: this.playerId });
  }
  callLegend(card: CardRef): CommandSuccess {
    return this.engine.callLegend(card, { as: this.playerId });
  }
  attackUnit(attacker: CardRef, defender: CardRef): CommandSuccess {
    return this.engine.attackUnit(attacker, defender, { as: this.playerId });
  }
  attackRival(attacker: CardRef): CommandSuccess {
    return this.engine.attackRival(attacker, { as: this.playerId });
  }
  useBlocker(blocker: CardRef): CommandSuccess {
    return this.engine.useBlocker(blocker, { as: this.playerId });
  }
  passPhase(): CommandSuccess {
    return this.engine.passPhase({ as: this.playerId });
  }
  completeTurn(): CommandSuccess {
    return this.engine.completeTurn({ as: this.playerId });
  }
  concede(): CommandSuccess {
    return this.engine.concede({ as: this.playerId });
  }
  mulligan(): CommandSuccess {
    return this.engine.mulligan({ as: this.playerId });
  }
  keepHand(): CommandSuccess {
    return this.engine.keepHand({ as: this.playerId });
  }
  resolveAttack(opts?: Omit<ResolveAttackOpts, "as">): CommandSuccess {
    return this.engine.resolveAttack({ ...opts, as: this.playerId });
  }
  resolveCardToPlay(card: CardRef): CommandSuccess {
    return this.engine.resolveCardToPlay(card, { as: this.playerId });
  }
  resolveCardToMove(card?: CardRef, opts?: { pass?: boolean }): CommandSuccess {
    return this.engine.resolveCardToMove(card, { ...opts, as: this.playerId });
  }
  activateAbility(card: CardRef, abilityIndex: number): CommandSuccess {
    return this.engine.activateAbility(card, abilityIndex, { as: this.playerId });
  }
  resolveSearchDeck(selectedCards: CardRef[]): CommandSuccess {
    return this.engine.resolveSearchDeck(selectedCards, { as: this.playerId });
  }

  // Judge moves
  judgeSpendCard(card: CardRef): CommandSuccess {
    return this.engine.judgeSpendCard(card, { as: this.playerId });
  }
  judgeReadyCard(card: CardRef): CommandSuccess {
    return this.engine.judgeReadyCard(card, { as: this.playerId });
  }
  judgeSetCardMeta(card: CardRef, meta: Partial<CardMeta>): CommandSuccess {
    return this.engine.judgeSetCardMeta(card, meta, { as: this.playerId });
  }
  judgeSetCardDefinition(card: CardRef, definitionId: string): CommandSuccess {
    return this.engine.judgeSetCardDefinition(card, definitionId, { as: this.playerId });
  }
  judgeMoveCardToZone(
    card: CardRef,
    toZone: CardZone,
    opts?: { playerId?: PlayerId; index?: number },
  ): CommandSuccess {
    return this.engine.judgeMoveCardToZone(card, toZone, { ...opts, as: this.playerId });
  }
  judgeMoveCardToTopOfDeck(card: CardRef): CommandSuccess {
    return this.engine.judgeMoveCardToTopOfDeck(card, { as: this.playerId });
  }
  judgeStackDeck(cards: CardRef[], opts?: { replace?: boolean }): CommandSuccess {
    return this.engine.judgeStackDeck(cards, { ...opts, as: this.playerId });
  }
  judgeMoveFixerDieToGigArea(opts?: {
    dieId?: string;
    dieType?: GigDie["dieType"];
    faceValue?: number;
  }): CommandSuccess {
    return this.engine.judgeMoveFixerDieToGigArea(this.playerId, { ...opts, as: this.playerId });
  }
  judgeMoveAllFixerDiceToGigArea(): void {
    this.engine.judgeMoveAllFixerDiceToGigArea(this.playerId, { as: this.playerId });
  }
  judgeMoveGigToPlayer(die: string | GigDie, toPlayerId: PlayerId): CommandSuccess {
    return this.engine.judgeMoveGigToPlayer(die, toPlayerId, { as: this.playerId });
  }
  judgeAddGigDie(
    dieType: GigDie["dieType"],
    faceValue: number,
    opts?: { id?: string },
  ): CommandSuccess {
    return this.engine.judgeAddGigDie(this.playerId, dieType, faceValue, {
      ...opts,
      as: this.playerId,
    });
  }
  judgeSetGigValue(die: string | GigDie, value: number): CommandSuccess {
    return this.engine.judgeSetGigValue(die, value, { as: this.playerId });
  }
  judgeSetTurnMetadata(patch: Partial<TurnMetadata>): CommandSuccess {
    return this.engine.judgeSetTurnMetadata(patch, { as: this.playerId });
  }
  judgeSetAttackState(attackState: AttackState | null): CommandSuccess {
    return this.engine.judgeSetAttackState(attackState, { as: this.playerId });
  }
  judgeSetPendingChoice(pendingChoice: PendingChoice | undefined): CommandSuccess {
    return this.engine.judgeSetPendingChoice(pendingChoice, { as: this.playerId });
  }
  judgeAddActiveEffect(effect: ActiveEffect): CommandSuccess {
    return this.engine.judgeAddActiveEffect(effect, { as: this.playerId });
  }
  judgeRecomputeActiveEffects(): CommandSuccess {
    return this.engine.judgeRecomputeActiveEffects({ as: this.playerId });
  }

  // Queries
  getState(): MatchState {
    return this.engine.getState();
  }
  getFilteredView(): FilteredMatchView {
    return this.engine.getFilteredView(this.playerId);
  }
  getPrompt(): PlayerPrompt {
    return this.engine.getPrompt(this.playerId);
  }
  getCardsInZone(zone: CardZone): CardInstance[] {
    return this.engine.getCardsInZone(zone, this.playerId);
  }
  getEddies(): number {
    return this.engine.getEddies(this.playerId);
  }
  isMulliganDone(): boolean {
    return this.engine.isMulliganDone(this.playerId);
  }
  isFirstPlayer(): boolean {
    return this.engine.isFirstPlayer(this.playerId);
  }
  getSpentLegends(): CardInstance[] {
    return this.engine.getSpentLegends(this.playerId);
  }
  getFaceDownLegends(): CardInstance[] {
    return this.engine.getFaceDownLegends(this.playerId);
  }
}

/**
 * Authoritative read-only handle over the engine. Mirrors Lorcana's
 * `asServer()`: the explicit "look at anything, including hidden zones"
 * escape hatch for tests.
 *
 * No move execution — server views never act in production, and tests that
 * need to act should do so as a player. Use `asPlayerOne()` / `asPlayerTwo()`
 * for that.
 */
export class ServerView {
  private engine: CyberpunkTestEngine;

  constructor(engine: CyberpunkTestEngine) {
    this.engine = engine;
  }

  /** Raw, unfiltered match state. Includes hidden zones. */
  getState(): MatchState {
    return this.engine.getState();
  }

  /** Cards in any player's zone. Bypasses visibility — hidden zones included. */
  getCardsInZone(zone: CardZone, playerId: PlayerId): CardInstance[] {
    return this.engine.getCardsInZone(zone, playerId);
  }

  /** Card instance lookup by id or definition (any player, any zone). */
  getCard(card: CardRef, zone?: CardZone, playerId?: PlayerId): CardInstance {
    return this.engine.getCard(card, zone, playerId);
  }

  getPhase(): string {
    return this.engine.getPhase();
  }

  getActivePlayerId(): PlayerId {
    return this.engine.getActivePlayerId();
  }

  getTurnNumber(): number {
    return this.engine.getTurnNumber();
  }

  getEddies(playerId: PlayerId): number {
    return this.engine.getEddies(playerId);
  }

  getGigCount(playerId: PlayerId): number {
    return this.engine.getGigCount(playerId);
  }

  findGigIdByType(playerId: PlayerId, dieType: GigDie["dieType"]): string {
    return this.engine.findGigIdByType(playerId, dieType);
  }

  getStreetCred(playerId: PlayerId): number {
    return this.engine.getStreetCred(playerId);
  }

  getAttackState(): AttackState | null {
    return this.engine.getAttackState();
  }

  getEvents<T extends GameEventType>(type: T): GameEventOfType<T>[];
  getEvents(): GameEvent[];
  getEvents(type?: GameEventType): GameEvent[] {
    return type ? this.engine.getEvents(type) : this.engine.getEvents();
  }

  getLastEvent(type: string): GameEvent | undefined {
    return this.engine.getLastEvent(type);
  }

  getLastActionLog(): ActionLogEvent | undefined {
    return this.engine.getLastActionLog();
  }

  isGameOver(): boolean {
    return this.engine.isGameOver();
  }

  getWinnerId(): PlayerId | null {
    return this.engine.getWinnerId();
  }

  getWinReason(): string | null {
    return this.engine.getWinReason();
  }

  /** Shorthand for `getState().G.players[playerId].zones[zone].length`. */
  getZoneCount(zone: CardZone, playerId: PlayerId): number {
    return this.getCardsInZone(zone, playerId).length;
  }
}
