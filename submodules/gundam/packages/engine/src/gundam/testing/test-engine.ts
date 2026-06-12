/**
 * GundamTestEngine
 *
 * A self-contained test harness for writing Gundam card and rules tests.
 * Provides both single-player and multiplayer test capabilities.
 *
 * Usage:
 *   const engine = GundamTestEngine.create(
 *     { hand: [whiteBase], play: [rxCard], resourceCount: 3 },
 *     { deck: 5 },
 *   );
 *   const p1 = engine.asPlayer("player_one");
 *   expect(p1.deployUnit(rxCard)).toSucceed();
 */

import type { CommandEnvelope, CommandResult } from "../../types/command.ts";
import type { PlayerId } from "../../types/branded.ts";
import type { MatchState } from "../../types/match-state.ts";
import type { FilteredMatchView, ViewRoleContext } from "../../types/projection.ts";
import type { ZoneRef } from "../../types/zone-types.ts";
import type { Card } from "@tcg/gundam-types";
import type { GundamG, GundamCardMeta } from "../types.ts";
import { createMockUnit, createMockResource } from "./card-mocks.ts";
import { getActivatedEffects, isSupportActivatedEffect } from "../rules/derived-state.ts";
import { enqueueOwnCardTriggers } from "../effects/pending-effects.ts";

import { MatchRuntime } from "../../runtime/match-runtime.ts";
import { createStaticResources } from "../../runtime/static-resources.ts";
import type { Player } from "../../runtime/static-resources.ts";
import { createPlayerId, asPlayerId } from "../../types/branded.ts";

export const PLAYER_ONE = "player_one" as const;
export const PLAYER_TWO = "player_two" as const;
export type GundamPlayerId = typeof PLAYER_ONE | typeof PLAYER_TWO;

// =============================================================================
// Test Fixture Types
// =============================================================================

export interface TestCardEntry {
  card: Card;
  exhausted?: boolean;
  damage?: number;
}

export interface TestPlayerState {
  hand?: Array<Card | TestCardEntry>;
  deck?: Array<Card | TestCardEntry> | number;
  resourceDeck?: Array<Card | TestCardEntry> | number;
  /** Cards to place in the resource area. Use TestCardEntry with exhausted:true to pre-exhaust. */
  resourceArea?: Array<Card | TestCardEntry>;
  play?: Array<Card | TestCardEntry>;
  /** Cards to pre-place in the baseSection (bases already "deployed"). */
  baseSection?: Array<Card | TestCardEntry>;
  trash?: Array<Card | TestCardEntry>;
}

let instanceCounter = 0;

function isCardEntry(v: Card | TestCardEntry): v is TestCardEntry {
  return "card" in v;
}

// =============================================================================
// PlayerTestProxy interface (for multiplayer scenarios)
// =============================================================================

export interface PlayerTestProxy {
  readonly playerId: PlayerId;
  doMove(moveName: string, args?: unknown): CommandResult;
  expectMoveToFail(moveName: string, args?: unknown, expectedError?: string): void;
  getView(): FilteredMatchView;
  getHand(): string[];
  getAvailableMoves(): string[];
}

// =============================================================================
// GundamTestEngine
// =============================================================================

export class GundamTestEngine {
  /**
   * Exposed read-only for test harnesses that need to drive the
   * runtime directly — notably the automation package's enumerator
   * and fallback-chain planner tests, which need `runtime.getState()`
   * and `runtime.getStaticResources()`. Still a test-only class;
   * production code should never reach into this field.
   */
  public readonly runtime: MatchRuntime;
  private cmdCounter = 0;

  private constructor(runtime: MatchRuntime) {
    this.runtime = runtime;
  }

  // ── Factory ──────────────────────────────────────────────────────────────

  static create(
    p1State: TestPlayerState = {},
    p2State: TestPlayerState = {},
    opts: { seed?: string; skipToMainPhase?: boolean; initialActivePlayer?: GundamPlayerId } = {},
  ): GundamTestEngine {
    const { seed = "gundam-test-seed", skipToMainPhase = true, initialActivePlayer } = opts;

    // Build card catalog (definition ID = cardNumber)
    const catalog = new Map<string, Card>();
    const p1Cards = collectCards(PLAYER_ONE, p1State);
    const p2Cards = collectCards(PLAYER_TWO, p2State);

    for (const { card } of [...p1Cards, ...p2Cards]) {
      catalog.set(card.cardNumber, card);
    }

    const p1: Player = {
      id: PLAYER_ONE as PlayerId,
      name: "Player One",
      deck: p1Cards.filter((c) => c.zone === "deck").map((c) => c.card.cardNumber),
      resourceDeck: p1Cards.filter((c) => c.zone === "resourceDeck").map((c) => c.card.cardNumber),
    };
    const p2: Player = {
      id: asPlayerId(PLAYER_TWO),
      name: "Player Two",
      deck: p2Cards.filter((c) => c.zone === "deck").map((c) => c.card.cardNumber),
      resourceDeck: p2Cards.filter((c) => c.zone === "resourceDeck").map((c) => c.card.cardNumber),
    };

    const staticResources = createStaticResources([p1, p2], catalog);

    const runtime = new MatchRuntime(staticResources);
    runtime.initialize(
      [p1, p2],
      seed,
      initialActivePlayer ? asPlayerId(initialActivePlayer) : asPlayerId(PLAYER_ONE),
    );

    const engine = new GundamTestEngine(runtime);

    // Inject fixture state
    engine.applyFixture(p1Cards, p2Cards, p1State, p2State);

    if (skipToMainPhase) {
      engine.skipToMainPhase();
    }

    return engine;
  }

  /**
   * Create a GundamTestEngine with an empty board and two bare players.
   * Useful for testing move sequences from scratch.
   */
  static createEmpty(opts: { seed?: string; playerCount?: number } = {}): GundamTestEngine {
    const { seed = "gundam-test-seed", playerCount = 2 } = opts;
    const players: Player[] = [];

    for (let i = 0; i < playerCount; i++) {
      const id = createPlayerId(`player${i + 1}`);
      players.push({
        id,
        name: `Player ${i + 1}`,
        deck: [],
        resourceDeck: [],
      });
    }

    const staticResources = createStaticResources(players, new Map());
    const runtime = new MatchRuntime(staticResources);
    runtime.initialize(players, seed);
    return new GundamTestEngine(runtime);
  }

  // ── Fixture application ──────────────────────────────────────────────────

  private applyFixture(
    p1Cards: CardWithZone[],
    p2Cards: CardWithZone[],
    _p1State: TestPlayerState,
    _p2State: TestPlayerState,
  ): void {
    // Place cards into zones for both players
    for (const [playerId, cards] of [
      [PLAYER_ONE, p1Cards],
      [PLAYER_TWO, p2Cards],
    ] as const) {
      this.placeCards(playerId, cards);
    }
  }

  private placeCards(playerId: GundamPlayerId, cards: CardWithZone[]): void {
    const state = this.runtime.getState();

    for (const { instanceId, card, zone, meta } of cards) {
      const zoneKey = zone === "removalArea" ? zone : `${zone}:${playerId}`;

      // Register in card instance map so framework.cards.getDefinition() can resolve it
      this.runtime.registerCardInstance(instanceId, card.cardNumber, asPlayerId(playerId));

      // Register in zone state
      if (!state.ctx.zones.private.zoneCards[zoneKey]) {
        state.ctx.zones.private.zoneCards[zoneKey] = [];
      }
      state.ctx.zones.private.zoneCards[zoneKey]!.push(instanceId);

      state.ctx.zones.private.cardIndex[instanceId] = {
        zoneKey,
        index: state.ctx.zones.private.zoneCards[zoneKey]!.length - 1,
        ownerID: asPlayerId(playerId),
        controllerID: asPlayerId(playerId),
      };

      state.ctx.zones.private.cardMeta[instanceId] = meta;

      // Update zone summary
      if (!state.ctx.zones.public.zoneSummaries[zoneKey]) {
        state.ctx.zones.public.zoneSummaries[zoneKey] = { revision: 0, count: 0 };
      }
      state.ctx.zones.public.zoneSummaries[zoneKey]!.count++;
      state.ctx.zones.public.zoneSummaries[zoneKey]!.revision++;

      // Apply exhausted/damage state to GundamG
      const g = state.G;
      if (meta.exhausted) g.exhausted[instanceId] = true;
    }
  }

  private skipToMainPhase(): void {
    const state = this.runtime.getState();
    state.ctx.status.gameSegment = "turnCycle";
    state.ctx.status.phase = "main-phase";
    state.ctx.status.pendingDecision = [];
    // turnPlayer starts undefined during setup; set it to activePlayer when skipping ahead
    if (!state.ctx.status.turnPlayer) {
      state.ctx.status.turnPlayer = state.ctx.status.activePlayer;
    }
  }

  // ── Player Actions ────────────────────────────────────────────────────────

  asPlayer(playerId: GundamPlayerId): GundamPlayerActions {
    return new GundamPlayerActions(this.runtime, playerId, () => this.cmdCounter++);
  }

  /**
   * Test-only flow tick: invokes `resolveFlowTransitions` via a no-op
   * `runTestMutation`, which drains auto-resolvable `pendingEffects`
   * and advances any halt-free flow transitions. Use this when a test
   * has seeded `g.pendingEffects` directly and needs the drain to run
   * without dispatching a player move (which would now be blocked by
   * the EFFECT_PENDING gate per rule 5-2).
   *
   * In production, every move's execute path runs the same drain via
   * `onTransitionCheck`, so production code never needs this helper.
   *
   * @internal
   */
  tickFlow(playerId: GundamPlayerId = PLAYER_ONE as GundamPlayerId): void {
    this.runtime.runTestMutation(asPlayerId(playerId), () => {
      // No-op mutation; the post-mutation `resolveFlowTransitions`
      // call inside `runTestMutation` does the work.
    });
  }

  // ── Move helpers (CoreTestEngine-style) ───────────────────────────────────

  /**
   * Execute a move as a named player. Throws on failure.
   */
  doMove(moveName: string, playerId: PlayerId, args?: unknown): CommandResult {
    const envelope: CommandEnvelope = {
      commandID: `test-cmd-${this.cmdCounter++}`,
      move: moveName,
      prevStateID: this.runtime.state.ctx._stateID,
      actorRole: "player",
      args: args ?? {},
    };

    const result = this.runtime.executeCommand(envelope, playerId);
    if (!result.success) {
      throw new Error(
        `Move "${moveName}" failed for player "${playerId}": ${result.error} (${result.errorCode})`,
      );
    }
    return result;
  }

  /**
   * Assert that a move fails. Optionally check the error message.
   */
  expectMoveToFail(
    moveName: string,
    playerId: PlayerId,
    args?: unknown,
    expectedError?: string,
  ): void {
    const envelope: CommandEnvelope = {
      commandID: `test-cmd-${this.cmdCounter++}`,
      move: moveName,
      prevStateID: this.runtime.state.ctx._stateID,
      actorRole: "player",
      args: args ?? {},
    };

    const result = this.runtime.executeCommand(envelope, playerId);
    if (result.success) {
      throw new Error(
        `Expected move "${moveName}" to fail for player "${playerId}", but it succeeded`,
      );
    }

    if (expectedError !== undefined && !result.error.includes(expectedError)) {
      throw new Error(`Expected error to contain "${expectedError}", but got: "${result.error}"`);
    }
  }

  // ── Zone helpers ──────────────────────────────────────────────────────────

  /**
   * Get card instance IDs in a zone.
   */
  getCardsInZone(zone: ZoneRef): string[] {
    const state = this.getState();
    const zoneKey = zone.playerId ? `${zone.zone}:${zone.playerId}` : zone.zone;
    return state.ctx.zones.private.zoneCards[zoneKey] ?? [];
  }

  /**
   * Count cards in a zone.
   */
  getCardCount(zone: ZoneRef): number {
    return this.getCardsInZone(zone).length;
  }

  /**
   * Find a card matching a predicate.
   */
  findCard(predicate: (cardId: string, zoneKey: string) => boolean): string | undefined {
    const state = this.getState();
    const cardIndex = state.ctx.zones.private.cardIndex;
    for (const [cardId, info] of Object.entries(cardIndex)) {
      if (predicate(cardId, info.zoneKey)) {
        return cardId;
      }
    }
    return undefined;
  }

  /**
   * Create a card instance and place it in a zone.
   */
  giveCard(playerId: PlayerId, definitionId: string, zone: ZoneRef): string {
    const state = this.runtime.getState();
    const instanceId = `test_${playerId}_${definitionId}_${this.cmdCounter++}`;
    const zoneKey = zone.playerId ? `${zone.zone}:${zone.playerId}` : zone.zone;

    // Add to zone cards
    if (!state.ctx.zones.private.zoneCards[zoneKey]) {
      state.ctx.zones.private.zoneCards[zoneKey] = [];
    }
    state.ctx.zones.private.zoneCards[zoneKey]!.push(instanceId);

    // Add to card index
    state.ctx.zones.private.cardIndex[instanceId] = {
      zoneKey,
      index: state.ctx.zones.private.zoneCards[zoneKey]!.length - 1,
      ownerID: playerId,
      controllerID: playerId,
    };

    // Add to card meta
    state.ctx.zones.private.cardMeta[instanceId] = {};

    // Update zone summary
    if (!state.ctx.zones.public.zoneSummaries[zoneKey]) {
      state.ctx.zones.public.zoneSummaries[zoneKey] = { revision: 0, count: 0 };
    }
    state.ctx.zones.public.zoneSummaries[zoneKey]!.count++;
    state.ctx.zones.public.zoneSummaries[zoneKey]!.revision++;

    return instanceId;
  }

  // ── Phase / turn helpers ──────────────────────────────────────────────────

  /**
   * Force phase change (testing only).
   */
  setPhase(phase: string): void {
    const state = this.runtime.getState();
    state.ctx.status.phase = phase;
  }

  setStep(step: string): void {
    const state = this.runtime.getState();
    state.ctx.status.step = step;

    if (step === "action-step" && state.ctx.status.phase === "end-phase") {
      const playerIds = [...state.ctx.playerIds] as string[];
      state.ctx.status.pendingDecision = playerIds as PlayerId[];
    }
  }

  /**
   * Force turn number (testing only).
   */
  setTurn(turn: number): void {
    const state = this.runtime.getState();
    state.ctx.status.turn = turn;
  }

  // ── View helpers ──────────────────────────────────────────────────────────

  /**
   * Get filtered view for a player.
   */
  getView(playerId: PlayerId): FilteredMatchView {
    const roleCtx: ViewRoleContext = { role: "player", playerId };
    return this.runtime.getFilteredView(roleCtx);
  }

  // ── Multiplayer proxy helpers ─────────────────────────────────────────────

  /**
   * Assert that a card is hidden from a given player's view.
   */
  assertCardHiddenFrom(cardId: string, playerId: PlayerId): void {
    const view = this.getView(playerId);
    for (const [, zoneData] of Object.entries(view.zones.zones)) {
      for (const card of zoneData.cards) {
        if (card.instanceId === cardId) {
          if (card.definition !== null) {
            throw new Error(
              `Expected card "${cardId}" to be hidden from player "${playerId}", but it is visible with definition "${card.definitionId}"`,
            );
          }
          return;
        }
      }
    }
    // Card not found in any zone view at all — also counts as hidden
  }

  /**
   * Assert that a card is visible to a given player.
   */
  assertCardVisibleTo(cardId: string, playerId: PlayerId): void {
    const view = this.getView(playerId);
    for (const [, zoneData] of Object.entries(view.zones.zones)) {
      for (const card of zoneData.cards) {
        if (card.instanceId === cardId && card.definition !== null) {
          return; // Found and visible
        }
      }
    }
    throw new Error(
      `Expected card "${cardId}" to be visible to player "${playerId}", but it was not found or is hidden`,
    );
  }

  /**
   * Simulate a full turn sequence by executing a series of actions.
   */
  simulateTurn(actions: Array<{ player: PlayerId; move: string; args?: unknown }>): void {
    for (const action of actions) {
      this.doMove(action.move, action.player, action.args);
    }
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /**
   * Assert the game has ended, optionally checking the winner.
   */
  assertGameEnded(expectedWinner?: PlayerId): void {
    const state = this.getState();
    if (!state.ctx.status.gameEnded) {
      throw new Error("Expected game to have ended, but it is still in progress");
    }
    if (expectedWinner !== undefined && state.ctx.status.winner !== expectedWinner) {
      throw new Error(
        `Expected winner to be "${expectedWinner}", but got "${state.ctx.status.winner ?? "none"}"`,
      );
    }
  }

  /**
   * Assert the game is still in progress.
   */
  assertGameNotEnded(): void {
    const state = this.getState();
    if (state.ctx.status.gameEnded) {
      throw new Error(
        `Expected game to still be in progress, but it ended (winner: ${state.ctx.status.winner ?? "none"})`,
      );
    }
  }

  // ── Undo ─────────────────────────────────────────────────────────────────

  undo(playerId?: PlayerId): CommandResult | null {
    const pid = playerId ?? (this.runtime.state.ctx.status.activePlayer as PlayerId);
    return this.runtime.undo(pid);
  }

  // ── Available moves ───────────────────────────────────────────────────────

  getAvailableMoves(playerId: PlayerId): string[] {
    return this.runtime.getAvailableMoves(playerId);
  }

  // ── Combat / lifecycle test fixtures ──────────────────────────────────────

  /**
   * Fire a shield's 【Burst】 without running a full combat sequence.
   *
   * Moves `shieldInstanceId` from the owning player's `shieldArea` into
   * their `trash`, enqueues `shieldDestroyed` triggers against the
   * queue, and drains the queue against a real mutative draft — so
   * Burst effects that need targeting will halt for a `resolveEffect`
   * choice exactly like the production path does.
   *
   * Mirrors the enqueue in `resolve-direct.ts` (rule 10-1-6-8 /
   * 13-1-7-4) but skips the full attacker-declaration dance. The card
   * MUST already be present in `shieldArea:<ownerId>`; otherwise this
   * throws with `SHIELD_NOT_IN_AREA`.
   *
   * `options.targets` pre-commits choices for burst directives that
   * halt on a `resolveEffect` target prompt (e.g. "choose 1 card from
   * your trash", "choose 1 enemy Unit"). When provided, after the
   * trigger enqueue the helper executes a `resolveEffect` move as the
   * shield's owner with those targets and throws if the move fails —
   * so tests can drive burst → target-resolution in a single call.
   * Omit `targets` for bursts that resolve without a choice.
   */
  fireShieldBurst(shieldInstanceId: string, options: { targets?: readonly string[] } = {}): void {
    const state = this.runtime.getState();
    const entry = state.ctx.zones.private.cardIndex[shieldInstanceId];
    if (!entry) {
      throw new Error(`fireShieldBurst: unknown card "${shieldInstanceId}"`);
    }
    const ownerId = entry.ownerID as unknown as string;
    const expectedZone = `shieldArea:${ownerId}`;
    if (entry.zoneKey !== expectedZone) {
      throw new Error(
        `fireShieldBurst: card "${shieldInstanceId}" is in "${entry.zoneKey}", not "${expectedZone}" (SHIELD_NOT_IN_AREA)`,
      );
    }

    this.runtime.runTestMutation(entry.ownerID, ({ G, framework }) => {
      framework.zones.moveCard(shieldInstanceId, { zone: "trash", playerId: ownerId });
      enqueueOwnCardTriggers(
        G,
        {
          type: "shieldDestroyed",
          cardId: shieldInstanceId,
          playerId: ownerId,
        },
        shieldInstanceId,
        ownerId,
        framework,
      );
    });

    if (options.targets && options.targets.length > 0) {
      // Only drive resolveEffect when the engine actually halted on a
      // pending choice — simple bursts with a single eligible target
      // auto-resolve during the inline drain, in which case the queue
      // is already empty and the caller-provided targets were either
      // moot (unique match) or redundant.
      const pending = this.runtime.getState().ctx.status.pendingDecision ?? [];
      if (pending.length > 0) {
        const result = this.runtime.executeCommand(
          {
            commandID: `test-cmd-${this.cmdCounter++}`,
            move: "resolveEffect",
            prevStateID: this.runtime.state.ctx._stateID,
            actorRole: "player",
            args: { targets: options.targets },
          },
          entry.ownerID,
        );
        if (!result.success) {
          throw new Error(
            `fireShieldBurst: resolveEffect failed for shield "${shieldInstanceId}": ${result.error} (${result.errorCode})`,
          );
        }
      }
    }
  }

  /**
   * Destroy a unit/base in play by moving it to trash and enqueuing its
   * `unitDestroyed` triggers (rule 10-1-6-1 / 10-1-6-4). Mirrors the
   * lifecycle hook invoked by combat's `handleUnitDefeated` path but
   * doesn't require setting up a full damage resolution — tests covering
   * `【Destroyed】` triggers (and `duringLink/duringPair + destroyed`
   * constant-event effects) can drive the event directly.
   */
  destroyUnit(cardId: string): void {
    const state = this.runtime.getState();
    const entry = state.ctx.zones.private.cardIndex[cardId];
    if (!entry) {
      throw new Error(`destroyUnit: unknown card "${cardId}"`);
    }
    const ownerId = entry.ownerID as unknown as string;

    this.runtime.runTestMutation(entry.ownerID, ({ G, framework }) => {
      const pairedPilotId = G.pilotAssignments[cardId];
      const event = { type: "unitDestroyed", cardId, ownerId, pairedPilotId };
      // Enqueue the dying card's own 【Destroyed】 triggers BEFORE the
      // move to trash so pair/link state checks (which read `G` +
      // `framework.cards`) still see the live configuration — matches
      // the production `handleUnitDefeated` ordering.
      enqueueOwnCardTriggers(G, event, cardId, ownerId, framework);
      if (pairedPilotId) {
        enqueueOwnCardTriggers(G, event, pairedPilotId, ownerId, framework);
      }
      framework.zones.moveCard(cardId, { zone: "trash", playerId: ownerId });
      // Inline equivalent of `cleanupCardOnLeave` from
      // ../effects/handlers/combat.ts: clear damage / exhausted,
      // trash the paired pilot (if zoned), drop continuous effects
      // referencing this card, and deregister token definitions so
      // longer tests don't observe stale derived state.
      delete G.damage[cardId];
      delete G.exhausted[cardId];
      const pilotId = G.pilotAssignments[cardId];
      if (pilotId) {
        delete G.pilotAssignments[cardId];
        // In production the pilot is always zoned; in unit-test setups
        // the pairing may point at a synthetic-only id (no zone).
        if (framework.cards.get(pilotId)) {
          framework.zones.moveCard(pilotId, { zone: "trash", playerId: ownerId });
        }
      }
      G.continuousEffects = G.continuousEffects.filter(
        (e) => e.sourceId !== cardId && e.targetId !== cardId,
      );
      const meta = framework.cards.getMeta(cardId);
      if (meta?.isToken === true) {
        framework.cards.deregisterDefinition(cardId);
      }
    });
  }

  /**
   * Advance the flow past the current player's end-of-turn lifecycle.
   *
   * Issues `passTurn` for the current `turnPlayer`, then both players'
   * `passActionStep` — that's enough to drive the flow through
   * end-phase action-step → end-step → hand-step → cleanup-step → the
   * turn's `onEnd` hook (`turnCycleOnEnd`, where `<Repair>` fires) →
   * back into the next turn's start/draw/resource/main.
   *
   * If the flow halts before the new main-phase (e.g. an unresolved
   * pending effect, hand >10 cards requiring discardToHandLimit, or a
   * pending combat) the helper throws so callers don't silently skip
   * assertions. For tests that need to clear a hand-discard prompt,
   * call `engine.asPlayer(...).doMove("discardToHandLimit", ...)`
   * first, then call `endTurn()`.
   */
  endTurn(): void {
    const state = this.runtime.getState();
    const turnPlayer = state.ctx.status.turnPlayer;
    if (!turnPlayer) {
      throw new Error("endTurn: no turnPlayer set");
    }
    const passTurnResult = this.runtime.executeCommand(
      {
        commandID: `test-endTurn-passTurn-${this.cmdCounter++}`,
        move: "passTurn",
        prevStateID: this.runtime.state.ctx._stateID,
        actorRole: "player",
        args: {},
      },
      turnPlayer,
    );
    if (!passTurnResult.success) {
      throw new Error(
        `endTurn: passTurn failed (${passTurnResult.errorCode}): ${passTurnResult.error}`,
      );
    }

    // Drain the action-step's pendingDecision queue. Order matches the
    // queue built by actionStepOnEnter (standby player first).
    for (let guard = 0; guard < 8; guard++) {
      const s = this.runtime.getState();
      if (s.ctx.status.phase !== "end-phase") break;
      if (s.ctx.status.step !== "action-step") break;
      const pending = (s.ctx.status.pendingDecision ?? []) as PlayerId[];
      if (pending.length === 0) break;
      const next = pending[0]!;
      const r = this.runtime.executeCommand(
        {
          commandID: `test-endTurn-passActionStep-${this.cmdCounter++}`,
          move: "passActionStep",
          prevStateID: this.runtime.state.ctx._stateID,
          actorRole: "player",
          args: {},
        },
        next,
      );
      if (!r.success) {
        throw new Error(`endTurn: passActionStep failed (${r.errorCode}): ${r.error}`);
      }
    }

    const finalState = this.runtime.getState();
    if (finalState.ctx.status.phase === "end-phase") {
      throw new Error(
        `endTurn: flow halted in end-phase (step=${finalState.ctx.status.step ?? "none"}); resolve prompts manually before retrying`,
      );
    }
    if (finalState.G.pendingEffects.length > 0) {
      throw new Error(
        `endTurn: flow halted with ${finalState.G.pendingEffects.length} pending effect(s); resolve them before retrying`,
      );
    }
  }

  /**
   * Resolve a unit-vs-unit combat end-to-end from main phase by
   * chaining `enterBattle` → (optional block) → `passBattleAction`
   * twice. Defaults to "no block" because the vast majority of test
   * scenarios want to assert post-damage state without Blocker
   * interaction.
   *
   * Returns the `CommandResult` of the final `passBattleAction`,
   * throwing on the first failing step. When `blocker` is supplied
   * the defender declares block with that unit instead of passing.
   *
   * Keep this narrow: test harnesses that need first-strike ordering
   * or mid-step interrupts should orchestrate `enterBattle` /
   * `declareBlock` / `passBattleAction` by hand. This helper exists
   * to unlock "make this attacker damage this target" assertions
   * (Breach N, simple destroyed chains).
   */
  resolveCombat(opts: { attackerId: string; target: string; blockerId?: string }): CommandResult {
    const state = this.runtime.getState();
    const attackerEntry = state.ctx.zones.private.cardIndex[opts.attackerId];
    if (!attackerEntry) {
      throw new Error(`resolveCombat: unknown attacker "${opts.attackerId}"`);
    }
    const attackerPlayer = attackerEntry.ownerID;
    const defenderPlayer =
      (state.ctx.playerIds as readonly PlayerId[]).find((p) => p !== attackerPlayer) ??
      attackerPlayer;

    const enter = this.runtime.executeCommand(
      {
        commandID: `test-resolveCombat-enter-${this.cmdCounter++}`,
        move: "enterBattle",
        prevStateID: this.runtime.state.ctx._stateID,
        actorRole: "player",
        args: { attackerId: opts.attackerId, target: opts.target },
      },
      attackerPlayer,
    );
    if (!enter.success) {
      throw new Error(`resolveCombat: enterBattle failed (${enter.errorCode}): ${enter.error}`);
    }

    if (opts.blockerId) {
      const block = this.runtime.executeCommand(
        {
          commandID: `test-resolveCombat-block-${this.cmdCounter++}`,
          move: "declareBlock",
          prevStateID: this.runtime.state.ctx._stateID,
          actorRole: "player",
          args: { blockerId: opts.blockerId },
        },
        defenderPlayer,
      );
      if (!block.success) {
        throw new Error(`resolveCombat: declareBlock failed (${block.errorCode}): ${block.error}`);
      }
    } else {
      // Defender passes on blocking. When combat already resolved
      // (e.g. attacker destroyed by 8-2-4 interrupt) the block-step
      // is no longer live — passBlock then returns WRONG_STEP, which
      // we treat as "nothing to skip".
      const phase = this.runtime.getState().ctx.status.phase;
      if (phase === "battle-phase") {
        const pb = this.runtime.executeCommand(
          {
            commandID: `test-resolveCombat-passBlock-${this.cmdCounter++}`,
            move: "passBlock",
            prevStateID: this.runtime.state.ctx._stateID,
            actorRole: "player",
            args: {},
          },
          defenderPlayer,
        );
        if (!pb.success && pb.errorCode !== "WRONG_STEP" && pb.errorCode !== "NOT_YOUR_TURN") {
          throw new Error(`resolveCombat: passBlock failed (${pb.errorCode}): ${pb.error}`);
        }
      }
    }

    // Defender then attacker pass battle actions to run damage and
    // close out the battle. Either call may be a no-op once the
    // battle-end-step has already concluded — tolerate WRONG_STEP.
    let last: CommandResult | undefined;
    for (const actor of [defenderPlayer, attackerPlayer]) {
      const s = this.runtime.getState();
      if (s.ctx.status.phase !== "battle-phase") break;
      const r = this.runtime.executeCommand(
        {
          commandID: `test-resolveCombat-passBattleAction-${this.cmdCounter++}`,
          move: "passBattleAction",
          prevStateID: this.runtime.state.ctx._stateID,
          actorRole: "player",
          args: {},
        },
        actor,
      );
      last = r;
      if (!r.success && r.errorCode !== "WRONG_STEP") {
        throw new Error(`resolveCombat: passBattleAction failed (${r.errorCode}): ${r.error}`);
      }
    }
    return (
      last ?? {
        success: true,
        stateID: this.runtime.getState().ctx._stateID,
        state: this.runtime.getState() as MatchState,
        patches: [],
        gameEvents: [],
        logEntries: [],
        processedCommand: {
          commandID: "test-resolveCombat-noop",
          move: "passBattleAction",
          prevStateID: this.runtime.state.ctx._stateID,
          actorRole: "player",
          args: {},
        },
        animations: [],
        undoable: false,
        moveLogs: [],
      }
    );
  }

  // ── Card meta helpers ──────────────────────────────────────────────────────

  markAsToken(cardId: string): void {
    const state = this.getState();
    if (!state.ctx.zones.private.cardMeta[cardId]) {
      throw new Error(`Cannot mark unknown card "${cardId}" as token`);
    }
    state.ctx.zones.private.cardMeta[cardId].isToken = true;
  }

  // ── Queries ──────────────────────────────────────────────────────────────

  getState(): MatchState<GundamG> {
    return this.runtime.getState();
  }

  getG(): GundamG {
    return this.runtime.getState().G;
  }

  getRuntime(): MatchRuntime {
    return this.runtime;
  }

  /**
   * Descriptor for the priority-head pending effect's required input, or
   * `undefined` when nothing is waiting on a choice. Defaults to the
   * judge view (full visibility) so tests can assert prompt contents
   * without per-call role boilerplate; pass an explicit `roleCtx` to
   * exercise role-scoped redaction.
   */
  getPendingChoice(roleCtx: ViewRoleContext = { role: "judge" }) {
    return this.runtime.getPendingChoice(roleCtx);
  }

  // ── Debug ─────────────────────────────────────────────────────────────────

  /**
   * Pretty print state for debugging.
   */
  dumpState(): string {
    const state = this.getState();
    const lines: string[] = [];

    lines.push("=== Match State Dump ===");
    lines.push(`State ID: ${state.ctx._stateID}`);
    lines.push(`Phase: ${state.ctx.status.phase ?? "none"}`);
    lines.push(`Turn: ${state.ctx.status.turn}`);
    lines.push(`Game Ended: ${state.ctx.status.gameEnded}`);
    if (state.ctx.status.winner) {
      lines.push(`Winner: ${state.ctx.status.winner}`);
    }
    lines.push(`Active Player: ${state.ctx.status.activePlayer}`);
    lines.push(`Turn Player: ${state.ctx.status.turnPlayer ?? "none (setup)"}`);

    lines.push("\n--- Zones ---");
    for (const [zoneKey, cards] of Object.entries(state.ctx.zones.private.zoneCards)) {
      lines.push(`  ${zoneKey}: ${cards.length} card(s) [${cards.join(", ")}]`);
    }

    lines.push("\n--- Game State (G) ---");
    lines.push(JSON.stringify(state.G, null, 2));

    const output = lines.join("\n");
    console.log(output);
    return output;
  }
}

// =============================================================================
// GundamPlayerActions
// =============================================================================

export class GundamPlayerActions {
  constructor(
    protected readonly runtime: MatchRuntime,
    readonly playerId: GundamPlayerId,
    private readonly nextId: () => number,
  ) {}

  // ── Moves ─────────────────────────────────────────────────────────────────

  deployUnit(card: Card | string, opts: { targets?: string[] } = {}): CommandResult {
    return this.execute("deployUnit", { cardId: this.resolveId(card), ...opts });
  }

  deployBase(card: Card | string, opts: { targets?: string[] } = {}): CommandResult {
    return this.execute("deployBase", { cardId: this.resolveId(card), ...opts });
  }

  playCommand(card: Card | string, opts: { targets?: string[] } = {}): CommandResult {
    return this.execute("playCommand", { cardId: this.resolveId(card), ...opts });
  }

  assignPilot(pilot: Card | string, unit: Card | string): CommandResult {
    return this.execute("assignPilot", {
      pilotId: this.resolveId(pilot),
      unitId: this.resolveId(unit),
    });
  }

  /**
   * Play a Command card with the 【Pilot】 keyword as a Pilot (rule
   * 3-4-6-2), pairing it with `unit` instead of activating its command
   * effect.
   */
  playCommandAsPilot(card: Card | string, unit: Card | string): CommandResult {
    return this.execute("playCommandAsPilot", {
      cardId: this.resolveId(card),
      unitId: this.resolveId(unit),
    });
  }

  enterBattle(attacker: Card | string, target: Card | string): CommandResult {
    return this.execute("enterBattle", {
      attackerId: this.resolveId(attacker),
      target: target === "direct" ? "direct" : this.resolveId(target),
    });
  }

  declareBlock(blocker: Card | string): CommandResult {
    return this.execute("declareBlock", { blockerId: this.resolveId(blocker) });
  }

  /**
   * Activate a unit's `<Support>` keyword ability. Thin helper — the
   * engine models Support as a synthesised activated ability (rule
   * 13-1-3), so this delegates to `activateAbility` at the Support
   * effect's index in `getActivatedEffects(unit)`.
   *
   * Returns a synthetic `NO_SUPPORT_KEYWORD` failure when the source
   * has no Support keyword, so existing tests that assert on that
   * error code keep working after the useSupport move was deleted.
   */
  useSupport(unit: Card | string, target: Card | string): CommandResult {
    const unitId = this.resolveId(unit);
    const targetId = this.resolveId(target);
    const state = this.runtime.getState();
    const cards = this.runtime.getFrameworkReadAPI().cards;
    const effects = getActivatedEffects(unitId, state.G, cards);
    const supportIndex = effects.findIndex(isSupportActivatedEffect);
    if (supportIndex < 0) {
      return {
        success: false,
        error: "Source does not have <Support>",
        errorCode: "NO_SUPPORT_KEYWORD",
        currentStateID: state.ctx._stateID,
      };
    }
    return this.execute("activateAbility", {
      cardId: unitId,
      effectIndex: supportIndex,
      targets: [targetId],
    });
  }

  resolveEffect(
    opts: {
      targets?: readonly string[];
      pendingEffectId?: string;
      optionalAnswers?: Record<number, boolean>;
      chooseOneAnswers?: Record<number, number>;
      deckLookAnswers?: import("../types.ts").ResolveEffectArgs["deckLookAnswers"];
    } = {},
  ): CommandResult {
    return this.execute("resolveEffect", opts);
  }

  passBlock(): CommandResult {
    return this.execute("passBlock", {});
  }

  passBattleAction(): CommandResult {
    return this.execute("passBattleAction", {});
  }

  passPhase(): CommandResult {
    return this.execute("passTurn", {});
  }

  passActionStep(): CommandResult {
    return this.execute("passActionStep", {});
  }

  concede(): CommandResult {
    return this.execute("concede", {});
  }

  activateAbility(
    card: Card | string,
    effectIndex: number,
    opts: { targets?: string[] } = {},
  ): CommandResult {
    return this.execute("activateAbility", { cardId: this.resolveId(card), effectIndex, ...opts });
  }

  /**
   * Ergonomic wrapper around `activateAbility` for bases sitting in
   * `baseSection`. When `effectIndex` is omitted the helper auto-locates
   * the base's only activated ability via `getActivatedEffects` — most
   * bases print exactly one `【Activate･Main】` clause, so this keeps
   * the call-site short. Passes `targets` through unchanged. Returns a
   * synthetic `NO_ACTIVATED_ABILITY` failure if the base has no
   * activated effect, so tests asserting missing-ability paths keep
   * working.
   */
  activateBaseAbility(
    base: Card | string,
    opts: { effectIndex?: number; targets?: string[] } = {},
  ): CommandResult {
    const baseId = this.resolveId(base);
    let effectIndex = opts.effectIndex;
    if (effectIndex === undefined) {
      const state = this.runtime.getState();
      const cards = this.runtime.getFrameworkReadAPI().cards;
      const effects = getActivatedEffects(baseId, state.G, cards);
      if (effects.length === 0) {
        return {
          success: false,
          error: "Base has no activated ability",
          errorCode: "NO_ACTIVATED_ABILITY",
          currentStateID: state.ctx._stateID,
        };
      }
      // Use the first activated index — `getActivatedEffects` returns
      // effects in their card-data order, so index 0 matches the
      // `effectIndex` that the `activateAbility` move expects.
      effectIndex = 0;
    }
    return this.execute("activateAbility", {
      cardId: baseId,
      effectIndex,
      ...(opts.targets ? { targets: opts.targets } : {}),
    });
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  getResourceCount(): number {
    const zoneKey = `resourceArea:${this.playerId}`;
    return this.runtime.getState().ctx.zones.private.zoneCards[zoneKey]?.length ?? 0;
  }

  getDamage(card: Card | string): number {
    return this.runtime.getState().G.damage[this.resolveId(card)] ?? 0;
  }

  isExhausted(card: Card | string): boolean {
    return this.runtime.getState().G.exhausted[this.resolveId(card)] ?? false;
  }

  getPilotId(unit: Card | string): string | undefined {
    return this.runtime.getState().G.pilotAssignments[this.resolveId(unit)];
  }

  getCardZone(card: Card | string): string | undefined {
    const id = this.resolveId(card);
    return this.runtime.getState().ctx.zones.private.cardIndex[id]?.zoneKey;
  }

  getCardsInZone(zone: string): string[] {
    const zoneKey = `${zone}:${this.playerId}`;
    return this.runtime.getState().ctx.zones.private.zoneCards[zoneKey] ?? [];
  }

  getPhase(): string | undefined {
    return this.runtime.getState().ctx.status.phase;
  }

  getAvailableMoves(): string[] {
    return this.runtime.getAvailableMoves(this.playerId as PlayerId);
  }

  getView(): FilteredMatchView {
    return this.runtime.getFilteredView({ role: "player", playerId: this.playerId as PlayerId });
  }

  getHand(): string[] {
    return this.runtime.getState().ctx.zones.private.zoneCards[`hand:${this.playerId}`] ?? [];
  }

  // ── Internal ─────────────────────────────────────────────────────────────

  protected resolveId(card: Card | string): string {
    if (typeof card === "string") return card;

    const instanceId = this.runtime.getInstanceIdByDefinition(
      asPlayerId(this.playerId),
      card.cardNumber,
    );
    if (instanceId && this.hasInstanceId(instanceId)) {
      return instanceId;
    }

    const zoneInstanceId = this.findExistingInstanceId(card.cardNumber);
    return zoneInstanceId ?? card.cardNumber;
  }

  private hasInstanceId(instanceId: string): boolean {
    const cardIndex = this.runtime.getState().ctx.zones.private.cardIndex;
    return Object.prototype.hasOwnProperty.call(cardIndex, instanceId);
  }

  private findExistingInstanceId(cardNumber: string): string | undefined {
    const zoneCards = this.runtime.getState().ctx.zones.private.zoneCards;
    const prefix = `${this.playerId}_${cardNumber}_`;

    for (const [zoneRef, cards] of Object.entries(zoneCards)) {
      if (!zoneRef.endsWith(`:${this.playerId}`)) continue;
      const match = cards.find(
        (instanceId) => this.hasInstanceId(instanceId) && instanceId.startsWith(prefix),
      );
      if (match) return match;
    }

    return undefined;
  }
  private execute(move: string, args: unknown): CommandResult {
    return this.runtime.executeCommand(
      {
        commandID: `test-cmd-${this.nextId()}`,
        move,
        prevStateID: this.runtime.state.ctx._stateID,
        actorRole: "player",
        args,
      },
      this.playerId as PlayerId,
    );
  }
}

// =============================================================================
// Internal Card-with-zone helper
// =============================================================================

interface CardWithZone {
  instanceId: string;
  card: Card;
  zone: string;
  meta: GundamCardMeta;
}

function collectCards(playerId: string, state: TestPlayerState): CardWithZone[] {
  const cards: CardWithZone[] = [];

  function add(entry: Card | TestCardEntry, zone: string): void {
    const card = isCardEntry(entry) ? entry.card : entry;
    const meta: GundamCardMeta = {
      exhausted: isCardEntry(entry) ? entry.exhausted : false,
    };
    cards.push({
      instanceId: `${playerId}_${card.cardNumber}_${++instanceCounter}`,
      card,
      zone,
      meta,
    });
  }

  for (const entry of asArray(state.hand)) add(entry, "hand");
  for (const entry of asCards(state.deck)) add(entry, "deck");
  for (const entry of asResourceCards(state.resourceDeck)) add(entry, "resourceDeck");
  for (const entry of asArray(state.resourceArea)) add(entry, "resourceArea");
  for (const entry of asArray(state.play)) add(entry, "battleArea");
  for (const entry of asArray(state.baseSection)) add(entry, "baseSection");
  for (const entry of asArray(state.trash)) add(entry, "trash");

  return cards;
}

function asArray(v: Array<Card | TestCardEntry> | undefined): Array<Card | TestCardEntry> {
  return v ?? [];
}

function asCards(v: Array<Card | TestCardEntry> | number | undefined): Array<Card | TestCardEntry> {
  if (typeof v === "number") {
    return Array.from({ length: v }, () => createMockUnit());
  }
  return v ?? [];
}

function asResourceCards(
  v: Array<Card | TestCardEntry> | number | undefined,
): Array<Card | TestCardEntry> {
  if (typeof v === "number") {
    return Array.from({ length: v }, () => createMockResource());
  }
  return v ?? [];
}
