import {
  FAB_MOVE_NAMES,
  decodeFabCommand,
  isFabMoveName,
  type FabCommandResult,
  type FabMoveLog,
  type FabMoveName,
} from "../moves.ts";
import { renderFabPlayerLog, type FabPlayerLog } from "../player-log.ts";
import { createFabLoopGuard, type FabNumericProperty } from "@tcg/flesh-and-blood-types";
import { createFabMatchInitialState, type InitializeFabMatchInput } from "../initialize.ts";
import { FabMatchRuntime } from "../runtime.ts";
import { compileFabMatchProgram } from "../match-program.ts";
import {
  FAB_RUNTIME_TEST_ACCESS,
  FAB_RUNTIME_TEST_RECEIPT,
  transferFabRuntimeTestStateOwnership,
} from "../runtime-access.ts";
import type { CommittedEvent } from "../rules/events.ts";
import type { FabDecision, FabDecisionAnswer } from "../rules/process.ts";
import type { FabLogEntry } from "../state.ts";

/** Legacy-shaped receipt kept entirely inside the fluent test fixture API. */
export type FabTestDispatchResult =
  | {
      readonly accepted: true;
      readonly move: FabMoveName;
      readonly actorId: string;
      readonly state: Extract<FabCommandResult, { readonly success: true }>["state"];
      readonly playerLogs: readonly FabLogEntry[];
      readonly moveLogs: readonly FabMoveLog[];
      readonly playerLog: FabPlayerLog;
      readonly outcome: import("../moves.ts").FabCommandOutcome;
    }
  | { readonly accepted: false; readonly error: string; readonly errorCode?: string };

import { getFabAutoPassPriorityCommand } from "../automation/auto-pass.ts";
import { buildFabRulesView } from "../rules/state-rules-view.ts";
import { readFabWaitState, type FabWaitState } from "../game/wait-state.ts";
import {
  describeFabDecision,
  describeFabWaitState,
  fabListedPartitionGroups,
  fabPayDeclineOptionIds,
  fabWaitStateMatchesStop,
  forcedFabDecisionAnswer,
  type FabDrainPolicy,
} from "./intent.ts";
import { registerFabCardDefinition, type FabCardDefinitionInput } from "../cards.ts";
import { type FabMatchState, type FabZoneKind } from "../state.ts";
import { projectFabViewerState, type FabViewer, type FabViewerState } from "../view.ts";
import {
  createFabTestState,
  deriveFabTestPublicCardIdentities,
  fabCardRefId,
  startFixture,
  type FabCardLike,
  type FabCardRef,
  type FabMatchOptions,
  type FabPlayerSetup,
  type FabTestFixture,
  type FabFixtureObjectSetup,
  type FabTestOptions,
} from "./test-fixtures.ts";
import {
  normalizeFabHarnessConfig,
  orderPitchForBottom,
  selectAutoPitchPayment,
  type FabHarnessConfig,
  type FabHarnessConfigResolved,
} from "./harness-config.ts";
import {
  FabCardRefNotFoundError,
  isFabCardInstanceRef,
  resolveFabCardRef,
  type FabFluentCardRef,
} from "./card-ref.ts";
import { profileFabTestInitialization } from "./test-initialization-profiler.ts";
import { FabTestHelpers } from "./helpers.ts";
import { FabPlayerHandle } from "./player-handle.ts";
import { resolveFabCardTargetInstanceId } from "./target-identity.ts";
import {
  seatCreateObject,
  seatEstablishCombat,
  seatInspectObject,
  seatHostUnder,
  seatMoveObject,
  seatPrepareObject,
  seatSetPriority,
} from "./seating.ts";
import type {
  FabAttackFlowPlayOptions,
  FabBasePlayOptions,
  FabPlayOptions,
} from "./play-options.ts";

export function isArsenalTarget(
  value: FabBasePlayOptions | FabFluentCardRef | readonly FabFluentCardRef[],
): value is FabFluentCardRef | readonly FabFluentCardRef[] {
  return (
    Array.isArray(value) ||
    typeof value === "string" ||
    isFabCardInstanceRef(value) ||
    (typeof value === "object" && value !== null && "canonicalId" in value)
  );
}

/**
 * Raw command accepted by {@link FabTestEngine.exec}. The engine's native move
 * surface is a move name plus a loose payload; the harness wraps both so tests
 * get a single discriminated object and typed helpers stay sugar over it.
 */
export interface FabTestCommand {
  readonly move: string;
  readonly actorId: string;
  readonly payload?: Record<string, unknown>;
}

export type {
  FabAttackFlowPlayOptions,
  FabArcPlayOptions,
  FabBasePlayOptions,
  FabBeatChestPlayOptions,
  FabChargePlayOptions,
  FabCrankPlayOptions,
  FabDecomposePlayOptions,
  FabDestroyThisPlayOptions,
  FabEquipToZonePlayOptions,
  FabFusePlayOptions,
  FabLightningFlowPlayOptions,
  FabSplitCardPlayOptions,
  FabModeSelection,
  FabModalAssassinPlayOptions,
  FabModalPlayOptions,
  FabNamedCardPlayOptions,
  FabNextAttackPowerPlayOptions,
  FabXCostPlayOptions,
  FabPayWithCogPlayOptions,
  FabPayWithGoldPlayOptions,
  FabPlayOptions,
  FabScrapPlayOptions,
} from "./play-options.ts";

/** Union-safe field extraction for the decomposed {@link FabPlayOptions}. */
function playOption<K extends string>(options: FabPlayOptions, key: K): unknown {
  return key in options ? (options as Record<string, unknown>)[key] : undefined;
}

/**
 * CR 5.1.5 / 5.1.8a / 1.10.3: an illegal announce is reversed to before the
 * card or activation was proposed. Quote-deny and mid-procedure reverse are
 * the same player-visible outcome — the fluent must not treat either as a
 * successful play (Icebind-class silent no-op).
 */
function fabRejectedDispatch(
  _command: FabTestCommand,
  result: FabTestDispatchResult,
): Extract<FabTestDispatchResult, { accepted: false }> | null {
  if (!result.accepted) return result;
  if (result.outcome.kind !== "rules-action-reversed") return null;
  return {
    accepted: false,
    error: result.outcome.reason.message,
    errorCode: result.outcome.reason.code,
  };
}

/** Carries the rejection result when an expected-success move is rejected. */
export class FabMoveFailedError extends Error {
  readonly command: FabTestCommand;
  readonly result: Extract<FabTestDispatchResult, { accepted: false }>;

  constructor(
    command: FabTestCommand,
    result: Extract<FabTestDispatchResult, { accepted: false }>,
  ) {
    super(`Move "${command.move}" by ${command.actorId} was rejected: ${result.error}`);
    this.command = command;
    this.result = result;
    this.name = "FabMoveFailedError";
  }
}

/**
 * Fixture-driven test harness for the Flesh and Blood engine.
 *
 * The harness holds one authoritative {@link FabMatchState} inside a real
 * {@link FabMatchRuntime}, so every dispatched move exercises the production
 * turn-flow path — there is no reimplementation of rules logic. Projection
 * goes through the production {@link projectFabViewerState}, so assertions see
 * exactly what the simulator/adapter would render.
 */
export class FabTestEngine {
  private readonly commandMoveLogs: FabMoveLog[] = [];
  private readonly commandNarratives: FabPlayerLog[] = [];
  private readonly runtime: FabMatchRuntime;
  private harnessConfig: FabHarnessConfigResolved;
  private cachedHelpers: FabTestHelpers | undefined;

  private constructor(
    runtime: FabMatchRuntime,
    config?: FabHarnessConfig,
    drainSeatingTriggers = true,
  ) {
    this.runtime = runtime;
    this.harnessConfig = normalizeFabHarnessConfig(config);
    // CR 4.1.4: start-of-game equip may declare "when you equip" layers
    // (Seasoned Saviour). Drain auto-resolvable stack so ordinary priority
    // begins with an empty rules stack before the first player move.
    if (drainSeatingTriggers) {
      profileFabTestInitialization("test-init: drain opening triggers", () => {
        this.drainStartOfGameStack();
      });
    }
  }

  /**
   * Resolve seating-time equip triggers (and other no-decision startup stack)
   * so tests do not fail with "action not legal in current layer position".
   */
  private drainStartOfGameStack(): void {
    for (let safety = 0; safety < 64; safety += 1) {
      if (this.answerForcedDecision()) continue;
      const state = this.getState();
      if (state.decision || state.gameEnded) return;
      if (state.rulesStack.length === 0 && !state.rulesProcess) return;
      const actorId = this.getPriorityPlayerId();
      if (!actorId) return;
      const result = this.dispatchForTest({ move: "pass", actorId });
      if (!result.accepted) return;
    }
  }

  /**
   * Build a fresh engine from a fixture. By default the match starts ready for
   * play (active player seated in the action phase with 1 AP). Smart harness
   * assists default ON; pass `config` to opt out explicitly.
   */
  static create(fixture: FabTestFixture = {}, config?: FabHarnessConfig): FabTestEngine {
    const state = createFabTestState(fixture);
    const runtime = profileFabTestInitialization(
      "test-init: runtime ownership",
      () => new FabMatchRuntime(transferFabRuntimeTestStateOwnership(state)),
    );
    return new FabTestEngine(runtime, config);
  }

  /**
   * Ergonomic **1v1** factory (product scope: exactly two seats). Each player
   * is declared by its imported hero card, which becomes its identity: address
   * the player with {@link FabTestEngine.as} (e.g. `game.as(bravoShowstopper)`).
   * `life` defaults to the hero's printed `health`, so a typical setup names
   * only its hero and its hand.
   *
   * Multiplayer / three-seat matches are not supported — do not reintroduce a
   * third-seat factory for multi-hero scaling or multi-target tables.
   *
   * @example
   * const game = FabTestEngine.start(
   *   { hero: bravo, hand: [snatchRed], deck: 40 },
   *   { hero: dash, hand: [nimblismBlue], deck: 40 },
   * );
   * game.as(bravo).play(snatchRed, { target: game.as(dash).id });
   */
  static start(
    playerA: FabPlayerSetup,
    playerB: FabPlayerSetup,
    options?: FabMatchOptions,
  ): FabTestEngine;
  static start(
    playerA: FabPlayerSetup,
    playerB: FabPlayerSetup,
    options?: FabMatchOptions,
  ): FabTestEngine {
    const state = createFabTestState(startFixture(playerA, playerB, options));
    const runtime = profileFabTestInitialization(
      "test-init: runtime ownership",
      () => new FabMatchRuntime(transferFabRuntimeTestStateOwnership(state)),
    );
    return new FabTestEngine(runtime, options);
  }

  /**
   * Create raw state only for a white-box rule, reducer, or serialization
   * test. Scenario, card-behavior, and acceptance tests must instead use
   * {@link FabTestEngine.start} and assert through the engine/view/snapshot.
   *
   * This is the sole sanctioned test boundary for the production bootstrap;
   * never import `initialize.ts` directly from a test.
   */
  static createStateForRulesTest(
    input: Omit<InitializeFabMatchInput, "publicCardIdentities"> &
      Partial<Pick<InitializeFabMatchInput, "publicCardIdentities">>,
  ): FabMatchState {
    const publicCardIdentities =
      input.publicCardIdentities ?? deriveFabTestPublicCardIdentities(input.cardDefinitions ?? {});
    return createFabMatchInitialState({
      ...input,
      publicCardIdentities,
      skipInitialStartPhase: input.skipInitialStartPhase ?? true,
    });
  }

  /** Wrap an externally-built runtime (e.g. one produced by the adapter). */
  static fromRuntime(runtime: FabMatchRuntime): FabTestEngine {
    return new FabTestEngine(runtime, undefined, false);
  }

  /** Transfer an externally-built test state into a fresh runtime; do not reuse it afterward. */
  static fromState(state: FabMatchState): FabTestEngine {
    return new FabTestEngine(
      new FabMatchRuntime(transferFabRuntimeTestStateOwnership(state)),
      undefined,
      false,
    );
  }

  // ── State access ────────────────────────────────────────────────────────

  getState(): FabMatchState {
    return this.runtime[FAB_RUNTIME_TEST_ACCESS]();
  }

  /**
   * Register extra catalog faces (physical twin tokens, etc.) without the
   * caller mutating the match-state bag.
   */
  registerCardDefinition(definition: FabCardDefinitionInput, ...aliases: readonly string[]): void {
    const state = this.getState();
    const defs = { ...state.cardDefinitions };
    const registered = registerFabCardDefinition(definition);
    defs[registered.canonicalId] = registered;
    for (const alias of aliases) defs[alias] = registered;
    const program = compileFabMatchProgram(defs, state.publicCardIdentities);
    state.cardDefinitions = program.cardDefinitions;
    state.publicCardIdentities = program.publicCardIdentities;
  }

  /** Evaluated life of a living object, or undefined when it has no life property. */
  objectLife(instanceId: string): number | undefined {
    const state = this.runtime.getState();
    const object = state.objects[instanceId];
    if (!object) return undefined;
    return buildFabRulesView(state).object({
      instanceId,
      incarnation: object.incarnation,
    })?.current.numeric.life;
  }

  /**
   * Ephemeral transaction trace for tests that prove reducer/order semantics.
   * It is deliberately separate from the serializable match snapshot.
   */
  committedEvents(): readonly CommittedEvent[] {
    return this.runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents;
  }

  /**
   * Last committed die face. Prefers a resolved `roll` event, then a
   * `roll-request` bound `roll-result`. Throws when the journal has no face.
   */
  lastDieFace(): number {
    const events = this.committedEvents();
    for (let index = events.length - 1; index >= 0; index -= 1) {
      const event = events[index]!;
      if (event.name === "roll") return event.data.result;
      if (event.name === "roll-request") {
        const bound = event.bindings["roll-result"];
        if (typeof bound === "number") return bound;
      }
    }
    throw new Error("No committed die face on the match journal.");
  }

  /**
   * Faces generated for the last committed roll, including extra dice that
   * Ready to Roll ignored. A plain 1d6 is a one-element array. The kept
   * result is `lastDieFace()` (`Math.max(...faces)` when ignoring lowest).
   */
  lastDieFaces(): readonly number[] {
    const events = this.committedEvents();
    for (let index = events.length - 1; index >= 0; index -= 1) {
      const event = events[index]!;
      if (event.name === "roll") {
        if (event.data.faces && event.data.faces.length > 0) return event.data.faces;
        return [event.data.result];
      }
      if (event.name === "roll-request") {
        const bound = event.bindings["roll-result"];
        if (typeof bound === "number") return [bound];
      }
    }
    throw new Error("No committed die face on the match journal.");
  }

  /**
   * Canonical id of the last committed look (CR 8.5.11 observation; the
   * looked card does not change zone). Throws when the journal has no look.
   */
  lastLookedCanonicalId(): string {
    const events = this.committedEvents();
    for (let index = events.length - 1; index >= 0; index -= 1) {
      const event = events[index]!;
      if (event.name === "look" && event.data.object.canonicalId) {
        return event.data.object.canonicalId;
      }
    }
    throw new Error("No committed look on the match journal.");
  }

  /** Player-visible receipt history collected by the test driver, never snapshot state. */
  playerLogs(): readonly FabLogEntry[] {
    return this.runtime[FAB_RUNTIME_TEST_RECEIPT]().playerLogs;
  }

  /** Canonical command-local move logs accumulated across the whole test. */
  moveLogs(): readonly FabMoveLog[] {
    return this.commandMoveLogs;
  }

  /** First-class command narratives accumulated across the whole test. */
  playerNarratives(): readonly FabPlayerLog[] {
    return this.commandNarratives;
  }

  /** Render exactly what one seated player can read, through the production catalog. */
  renderedPlayerNarrative(viewerId: string): readonly string[] {
    const playerIds = this.getState().playerIds;
    return this.playerNarratives().flatMap((log) =>
      renderFabPlayerLog(log, {
        viewerId,
        actorLabel: (actorId, usage) => {
          if (!playerIds.some((playerId) => playerId === actorId)) return undefined;
          const isViewer = actorId === viewerId;
          if (usage === "possessive") return isViewer ? "Your" : "Opponent's";
          if (usage === "possessive-lower") return isViewer ? "your" : "opponent's";
          return isViewer ? "You" : "Opponent";
        },
      }),
    );
  }

  /** Focused IR assertion helper for a not-yet-latched future numeric effect. */
  futureNumericBonus(playerId: string, property: FabNumericProperty): number {
    return this.getState().continuousEffectInstances.reduce((total, effect) => {
      if (
        effect.controllerId !== playerId ||
        !effect.futureApplicability ||
        effect.futureApplicability.remaining <= 0
      ) {
        return total;
      }
      return effect.atoms.reduce(
        (effectTotal, atom) =>
          atom.kind === "numeric" &&
          atom.property === property &&
          atom.operation === "add" &&
          typeof atom.amount === "number"
            ? effectTotal + atom.amount
            : effectTotal,
        total,
      );
    }, 0);
  }

  /** Exact-record test setup/assertion adapter; never part of production state. */
  objectState(instanceId: string): FabFixtureObjectSetup {
    return seatInspectObject(this.getState(), instanceId);
  }

  createObject(input: {
    readonly instanceId: string;
    readonly canonicalId: string;
    readonly ownerId: string;
    readonly zone: FabZoneKind;
  }): void {
    seatCreateObject(this.getState(), input);
  }

  moveObject(instanceId: string, ownerId: string, to: FabZoneKind): void {
    seatMoveObject(this.getState(), instanceId, ownerId, to);
  }

  /** Arrange-only: seat a hosted material directly beneath its live host. */
  hostUnder(instanceId: string, hostInstanceId: string): void {
    seatHostUnder(this.getState(), { instanceId, hostInstanceId });
  }

  setCounters(
    instanceId: string,
    counters: Pick<
      FabFixtureObjectSetup,
      | "defenseCounterTotal"
      | "powerCounterTotal"
      | "namedCounters"
      | "suspenseCounters"
      | "steamCounters"
      | "aimCounters"
      | "goldCounters"
      | "energyCounters"
      | "holoCounters"
      | "balanceCounters"
      | "powerCounters"
    >,
  ): void {
    seatPrepareObject(this.getState(), instanceId, counters);
  }

  setObjectStatus(instanceId: string, status: string | undefined): void {
    seatPrepareObject(this.getState(), instanceId, { status });
  }

  setObjectFaceDown(instanceId: string, faceDown: boolean): void {
    seatPrepareObject(this.getState(), instanceId, { faceDown });
  }

  prepareObject(instanceId: string, setup: FabFixtureObjectSetup): void {
    seatPrepareObject(this.getState(), instanceId, setup);
  }

  establishCombat(input: {
    readonly attackInstanceId: string;
    readonly attackingPlayerId: string;
    readonly defendingPlayerId: string;
    readonly step?: "attack" | "defend" | "reaction" | "damage" | "resolution" | "close";
  }): void {
    seatEstablishCombat(this.getState(), input);
  }

  setPriority(playerId: string): void {
    seatSetPriority(this.getState(), playerId);
  }

  getRuntime(): FabMatchRuntime {
    return this.runtime;
  }

  getConfig(): FabHarnessConfigResolved {
    return { ...this.harnessConfig };
  }

  configure(patch: FabHarnessConfig): this {
    this.harnessConfig = normalizeFabHarnessConfig({ ...this.harnessConfig, ...patch });
    return this;
  }

  getView(viewer: FabViewer): FabViewerState {
    return projectFabViewerState(this.getState(), viewer);
  }

  getStateID(): number {
    return this.runtime.getStateID();
  }

  getActivePlayerId(): string | undefined {
    return this.runtime.getActivePlayerId();
  }

  getPriorityPlayerId(): string | undefined {
    return this.runtime.getPriorityPlayerId();
  }

  hasGameEnded(): boolean {
    return this.runtime.hasGameEnded();
  }

  getGameEndResult(): { winnerId?: string; reason?: string } {
    return this.runtime.getGameEndResult() ?? {};
  }

  /** Assert the match has ended, optionally verifying the winner hero handle or id. */
  assertGameEnded(expectedWinner?: string | FabPlayerHandle): void {
    if (!this.runtime.hasGameEnded()) {
      throw new Error("Expected the game to have ended, but it is still in progress.");
    }
    if (expectedWinner !== undefined) {
      const expectedId = typeof expectedWinner === "string" ? expectedWinner : expectedWinner.id;
      const actual = this.runtime.getGameEndResult()?.winnerId;
      if (actual !== expectedId) {
        throw new Error(`Expected winner "${expectedId}", but got "${actual ?? "none"}".`);
      }
    }
  }

  /** Assert the match is still in progress. */
  assertGameInProgress(): void {
    if (this.runtime.hasGameEnded()) {
      const result = this.runtime.getGameEndResult();
      throw new Error(
        `Expected the game to be in progress, but it ended (winner: ${result?.winnerId ?? "none"}).`,
      );
    }
  }

  // ── Visibility assertions (production viewer projection) ────────────────

  /**
   * Assert a card's identity is hidden from a viewer, built on the production
   * {@link projectFabViewerState} path: hidden hands/arsenals and decks project
   * face-down placeholders, so a visible card is exactly one whose instance id
   * appears in the viewer's projected zones.
   */
  assertCardHiddenFrom(
    viewer: FabPlayerHandle,
    card: FabFluentCardRef,
    owner?: FabPlayerHandle,
  ): void {
    const instanceId = this.resolveVisibilityCard(viewer, card, owner);
    const view = this.getView({ role: "player", actorId: viewer.id });
    for (const playerView of Object.values(view.players)) {
      for (const [zone, ids] of Object.entries(view.players[playerView.playerId]!.zones)) {
        if (ids.includes(instanceId)) {
          throw new Error(
            `Expected card "${instanceId}" to be hidden from ${viewer.id}, but it is visible in ${playerView.playerId} ${zone}.`,
          );
        }
      }
    }
  }

  /** Assert a card's identity is visible to a viewer (see {@link assertCardHiddenFrom}). */
  assertCardVisibleTo(
    viewer: FabPlayerHandle,
    card: FabFluentCardRef,
    owner?: FabPlayerHandle,
  ): void {
    const instanceId = this.resolveVisibilityCard(viewer, card, owner);
    const view = this.getView({ role: "player", actorId: viewer.id });
    for (const playerView of Object.values(view.players)) {
      for (const ids of Object.values(view.players[playerView.playerId]!.zones)) {
        if (ids.includes(instanceId)) return;
      }
    }
    throw new Error(
      `Expected card "${instanceId}" to be visible to ${viewer.id}, but it was not found or is hidden.`,
    );
  }

  private resolveVisibilityCard(
    viewer: FabPlayerHandle,
    card: FabFluentCardRef,
    owner?: FabPlayerHandle,
  ): string {
    if (isFabCardInstanceRef(card)) return card.instanceId;
    if (owner !== undefined) {
      return resolveFabCardRef(this.getState(), owner.id, card).instanceId;
    }
    const state = this.getState();
    const opponentId = state.playerIds.find((id) => id !== viewer.id) ?? viewer.id;
    try {
      return resolveFabCardRef(state, viewer.id, card).instanceId;
    } catch (error) {
      if (error instanceof FabCardRefNotFoundError) {
        return resolveFabCardRef(state, opponentId, card).instanceId;
      }
      throw error;
    }
  }

  combat(): FabViewerState["combat"] {
    return projectFabViewerState(this.getState(), { role: "replay" }).combat;
  }

  /** First-class wait-state (decision, Defend declaration, priority window, or game over). */
  waitState(): FabWaitState {
    return readFabWaitState(this.getState());
  }

  /** Pending public decision, or `null` when the match is not waiting on one. */
  pendingDecision(): FabDecision | null {
    const wait = this.waitState();
    return wait.kind === "decision" ? wait.decision : null;
  }

  /** True when a layer is waiting on the stack (priority window `"stack"`). */
  isStackWaiting(): boolean {
    const wait = this.waitState();
    return wait.kind === "priority" && wait.window === "stack";
  }

  /** Catalog identity of a seated instance, or `undefined` if it is gone. */
  canonicalId(instanceId: string): string | undefined {
    return this.getState().objects[instanceId]?.canonicalId;
  }

  /**
   * Pass / answer-forced until `policy.stopAt`. Never auto-picks a non-forced
   * entity-target. Optional and ordering answers follow the policy; default is throw.
   */
  advanceUntil(policy: FabDrainPolicy): void {
    const maxSteps = policy.maxSteps ?? 96;
    const optionals = policy.optionals ?? "throw";
    const ordering = policy.ordering ?? "throw";
    const entityTargets = policy.entityTargets ?? "throw";
    const optBottom = policy.optBottom;
    for (let step = 0; step < maxSteps; step += 1) {
      const wait = this.waitState();
      if (wait.kind === "game-over") return;
      if (wait.kind === "decision") {
        const forced = forcedFabDecisionAnswer(wait.decision);
        if (forced) {
          this.exec({
            move: "answer-decision",
            actorId: wait.decision.actorId,
            payload: {
              decisionId: wait.decision.decisionId,
              stateVersion: wait.decision.stateVersion,
              answer: forced,
            },
          });
          continue;
        }
        if (policy.stopAt === "on-attack") return;
        const answered = this.answerDrainDecision(wait.decision, {
          optionals,
          ordering,
          entityTargets,
          optBottom,
        });
        if (answered) continue;
        if (entityTargets === "pause") return;
        throw new Error(
          `advanceUntil(${policy.stopAt}) requires an explicit answer for ${describeFabDecision(wait.decision)}.`,
        );
      }
      if (fabWaitStateMatchesStop(wait, policy.stopAt)) return;
      if (wait.kind === "defense-declaration") {
        if (policy.stopAt === "defend" || policy.stopAt === "on-attack") return;
        this.declareNoDefenseIfPending();
        continue;
      }
      if (wait.kind === "priority") {
        this.pass(wait.playerId);
        continue;
      }
      if (wait.kind === "resolving") {
        this.passBoth();
        continue;
      }
      return;
    }
    throw new Error(
      `advanceUntil("${policy.stopAt}") failed; stuck at ${describeFabWaitState(this.waitState())}.`,
    );
  }

  /** Advance open combat to the reaction step. Reaction priority starts with the attacker. */
  toReaction(as: "attacker" | "defender" = "attacker"): void {
    this.advanceUntil({ stopAt: "reaction", optionals: "decline" });
    if (as === "defender") {
      const wait = this.waitState();
      if (wait.kind === "priority") this.pass(wait.playerId);
      const after = this.waitState();
      if (after.kind !== "priority") {
        throw new Error(
          `toReaction("defender") expected defender priority, got ${describeFabWaitState(after)}.`,
        );
      }
    }
  }

  /** Close the open combat chain. Optionals throw unless `optionals` is set. */
  closeCombat(policy: Omit<FabDrainPolicy, "stopAt"> = {}): void {
    this.advanceUntil({ ...policy, stopAt: "combat-close" });
  }

  /** Pass/answer until the action-phase priority window (no combat, empty stack). */
  untilIdle(policy: Omit<FabDrainPolicy, "stopAt"> = {}): void {
    this.advanceUntil({ ...policy, stopAt: "idle" });
  }

  private answerDrainDecision(
    decision: import("../rules/process.ts").FabDecision,
    policy: {
      readonly optionals: "decline" | "accept" | "throw";
      readonly ordering: "listed" | "throw";
      readonly entityTargets: "minimum" | "maximum" | "throw" | "pause";
      readonly optBottom?: number;
    },
  ): boolean {
    if (decision.kind === "boolean" && policy.optionals !== "throw") {
      this.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: policy.optionals === "accept" },
        },
      });
      return true;
    }
    if (decision.kind === "option" && policy.optionals !== "throw") {
      const pair = fabPayDeclineOptionIds(decision);
      if (pair) {
        this.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: {
              kind: "option",
              optionIds: [policy.optionals === "accept" ? pair.pay : pair.decline],
            },
          },
        });
        return true;
      }
      // Optional replacement/prevention chooser (min 0, pick any subset).
      if (decision.min === 0) {
        this.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: {
              kind: "option",
              optionIds:
                policy.optionals === "accept" ? decision.options.map((option) => option.id) : [],
            },
          },
        });
        return true;
      }
    }
    if (decision.kind === "ordering" && policy.ordering === "listed") {
      this.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) },
        },
      });
      return true;
    }
    if (
      decision.kind === "partition" &&
      (policy.ordering === "listed" || policy.optBottom !== undefined)
    ) {
      this.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "partition",
            groups: fabListedPartitionGroups(decision, policy.optBottom ?? 0),
          },
        },
      });
      return true;
    }
    if (
      decision.kind === "entity-target" &&
      (policy.entityTargets === "minimum" || policy.entityTargets === "maximum") &&
      decision.candidates.length >= (policy.entityTargets === "maximum" ? 0 : decision.min)
    ) {
      const take =
        policy.entityTargets === "maximum"
          ? Math.min(decision.max, decision.candidates.length)
          : decision.min;
      this.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: decision.candidates
              .slice(0, take)
              .map((candidate) => candidate.instanceId),
          },
        },
      });
      return true;
    }
    return false;
  }

  phase(): FabMatchState["phase"] {
    return this.runtime.getState().phase;
  }

  legalMoves(actorId: string): readonly FabMoveName[] {
    return this.runtime.enumerateMoves(actorId);
  }

  /** Lazily-cached fluent helper namespace (`game.helpers`). */
  get helpers(): FabTestHelpers {
    if (!this.cachedHelpers) this.cachedHelpers = new FabTestHelpers(this);
    return this.cachedHelpers;
  }

  // ── Ergonomic player handles (identity = imported hero card) ─────────────

  as(hero: FabCardRef, seat?: 1 | 2): FabPlayerHandle {
    const state = this.runtime.getState();
    const canonicalId = fabCardRefId(hero);
    const matching = state.playerIds.filter((id) => {
      const heroInstanceId = state.players[id]?.heroCardId;
      return heroInstanceId ? state.objects[heroInstanceId]?.canonicalId === canonicalId : false;
    });
    if (matching.length === 0) {
      throw new Error(`No player is seated with hero "${canonicalId}".`);
    }
    if (matching.length > 1 && seat === undefined) {
      throw new Error(
        `Hero "${canonicalId}" is seated by both players (mirror match). Specify a seat: as(hero, 1) or as(hero, 2).`,
      );
    }
    const playerId = matching.length > 1 ? this.seatToId(seat as 1 | 2) : matching[0]!;
    return new FabPlayerHandle(this, playerId);
  }

  active(): FabPlayerHandle {
    const id = this.runtime.getActivePlayerId();
    if (!id) throw new Error("No active player — the match has ended.");
    return new FabPlayerHandle(this, id);
  }

  /** Player who currently has priority (may differ from turn player in combat). */
  priority(): FabPlayerHandle {
    const id = this.runtime.getPriorityPlayerId();
    if (!id) throw new Error("No priority player — the match has ended.");
    return new FabPlayerHandle(this, id);
  }

  activeHero(): string | undefined {
    const id = this.runtime.getActivePlayerId();
    if (!id) return undefined;
    const state = this.runtime.getState();
    const heroInstanceId = state.players[id]?.heroCardId;
    return heroInstanceId ? state.objects[heroInstanceId]?.canonicalId : undefined;
  }

  turn(): number {
    return this.runtime.getState().turnNumber;
  }

  private seatToId(seat: 1 | 2): string {
    return this.runtime.getState().playerIds[seat - 1]!;
  }

  // ── Card-instance lookup ────────────────────────────────────────────────

  /**
   * Resolve a printed card reference to one card-instance id in a player's zone.
   * Throws when the card is not present. When multiple copies share a canonical
   * id, returns the first unused match — prefer {@link findCardsInZone} when
   * resolving several refs that may include duplicates.
   */
  findCardInZone(playerId: string, zone: FabZoneKind, card: FabCardRef): string {
    return this.findCardsInZone(playerId, zone, [card])[0]!;
  }

  /**
   * Resolve a play origin that may be another seat's zone (Nuu opposing
   * banished, Annexation opposing arsenal). Prefer the actor's own zone.
   */
  findCardInPlayOrigin(actorId: string, origin: FabZoneKind, card: FabCardRef): string {
    const seats = [
      actorId,
      ...this.getState().playerIds.filter((playerId) => playerId !== actorId),
    ];
    for (const seat of seats) {
      try {
        return this.findCardInZone(seat, origin, card);
      } catch {
        continue;
      }
    }
    throw new Error(
      `Could not find "${fabCardRefId(card)}" in ${origin} for ${actorId} (any seat).`,
    );
  }

  /**
   * Resolve N card refs to N distinct instance ids in order. Two copies of the
   * same printing yield two different instance ids (required for multi-block /
   * multi-pitch with identical catalog cards).
   */
  findCardsInZone(playerId: string, zone: FabZoneKind, cards: readonly FabCardRef[]): string[] {
    const state = this.runtime.getState();
    const player = state.players[playerId];
    if (!player) {
      throw new Error(`Unknown player: ${playerId}`);
    }
    const used = new Set<string>();
    const result: string[] = [];
    for (const card of cards) {
      const canonicalId = fabCardRefId(card);
      const instanceId = state.containers.zonesByPlayerId[playerId]![zone].find(
        (id) => state.objects[id]?.canonicalId === canonicalId && !used.has(id),
      );
      if (instanceId === undefined) {
        throw new Error(
          `Could not find distinct "${canonicalId}" in ${playerId} ${zone} (requested ${cards.length}, found ${result.length}).`,
        );
      }
      used.add(instanceId);
      result.push(instanceId);
    }
    return result;
  }

  // ── Dispatch ────────────────────────────────────────────────────────────

  exec(command: FabTestCommand): Extract<FabTestDispatchResult, { accepted: true }> {
    const result = this.dispatchForTest(command);
    const rejected = fabRejectedDispatch(command, result);
    if (rejected) {
      throw new FabMoveFailedError(command, rejected);
    }
    if (!result.accepted) {
      throw new FabMoveFailedError(command, result);
    }
    if (result.outcome.kind !== "rules-action-reversed") this.autoPassPriority();
    return result;
  }

  expectFailure(command: FabTestCommand): Extract<FabTestDispatchResult, { accepted: false }> {
    const probe = new FabMatchRuntime(
      transferFabRuntimeTestStateOwnership(this.runtime.cloneState()),
    );
    const result = this.dispatchForTest(command, probe);
    const rejected = fabRejectedDispatch(command, result);
    if (!rejected) {
      throw new Error(
        `Expected move "${command.move}" by ${command.actorId} to fail, but it was accepted.`,
      );
    }
    return rejected;
  }

  /**
   * Submit the current player's persisted production decision.
   *
   * This is deliberately the only decision entry point used by card AAA
   * suites: callers state the player's choice, while the runtime still owns
   * legality, candidate validation, and continuation.
   */
  answerDecision(
    actorId: string,
    answer: FabDecisionAnswer,
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    const decision = this.getState().decision;
    if (!decision) throw new Error("No pending decision to answer.");
    if (decision.actorId !== actorId) {
      throw new Error(
        `Decision ${decision.decisionId} belongs to ${decision.actorId}, not ${actorId}.`,
      );
    }
    return this.exec({
      move: "answer-decision",
      actorId,
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer,
      },
    });
  }

  // ── Typed move helpers (sugar over exec) ────────────────────────────────

  endTurn(
    actorId: string,
    payload: Record<string, unknown> = {},
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    let result = this.exec({ move: "end-turn", actorId, payload });
    const pitchOrderGuard = createFabLoopGuard({ label: "test-engine: end-turn pitch ordering" });
    while (this.harnessConfig.pitchStack !== "manual") {
      pitchOrderGuard.tick();
      const decision = this.getState().decision;
      if (
        !decision ||
        decision.kind !== "ordering" ||
        decision.continuation.kind !== "turn-pitch-order"
      )
        break;
      const state = this.getState();
      const rules = buildFabRulesView(state);
      const orderedIds = orderPitchForBottom(
        this.harnessConfig.pitchStack,
        decision.entries.map((entry) => entry.id),
        (instanceId) => {
          const record = state.objects[instanceId];
          if (!record) throw new Error(`pitch-order object ${instanceId} is missing`);
          return (
            rules.object({
              instanceId: record.instanceId,
              incarnation: record.incarnation,
            })?.current.numeric.pitch ?? 0
          );
        },
      );
      result = this.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds },
        },
      });
    }
    return result;
  }

  concede(actorId: string): Extract<FabTestDispatchResult, { accepted: true }> {
    return this.exec({ move: "concede", actorId });
  }

  play(
    actorId: string,
    card: FabCardRef,
    options: FabPlayOptions = {},
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    // Modular equip-to-zone: card is already equipped (not in hand).
    if ("equipToZone" in options && options.equipToZone !== undefined) {
      let cardId: string | undefined;
      for (const z of ["head", "chest", "arms", "legs"] as const) {
        try {
          cardId = this.findCardInZone(actorId, z, card);
          break;
        } catch {
          // try next zone
        }
      }
      if (!cardId) {
        throw new Error(`Could not find equipped card for equipToZone`);
      }
      const payload: Record<string, unknown> = {
        instanceId: cardId,
        target: options.equipToZone,
      };
      return this.exec({ move: "activate", actorId, payload });
    }
    // Residual destroy-this activate: permanent already in arena/equip/arsenal zone.
    if ("activateDestroyThis" in options && options.activateDestroyThis === true) {
      let cardId: string | undefined;
      for (const z of ["arena", "head", "chest", "arms", "legs", "arsenal"] as const) {
        try {
          cardId = this.findCardInZone(actorId, z, card);
          break;
        } catch {
          // try next zone
        }
      }
      if (!cardId) {
        throw new Error(`Could not find permanent for activateDestroyThis`);
      }
      return this.exec({
        move: "activate",
        actorId,
        payload: { instanceId: cardId },
      });
    }
    const sourceZone =
      options.from === "arsenal"
        ? "arsenal"
        : options.from === "banished"
          ? "banished"
          : options.from === "deck"
            ? "deck"
            : options.from === "graveyard"
              ? "graveyard"
              : "hand";
    const cardId = this.findCardInPlayOrigin(actorId, sourceZone, card);
    return this.playInstance(actorId, cardId, options);
  }

  /**
   * Play a pre-resolved card instance (fluent ref fidelity for multi-copy
   * zones). Shares the begin-play decision-driving loop with {@link play}.
   */
  playInstance(
    actorId: string,
    instanceId: string,
    options: FabPlayOptions = {},
    drive: "legacy" | "explicit" = "legacy",
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    const sourceZone =
      options.from === "arsenal"
        ? "arsenal"
        : options.from === "banished"
          ? "banished"
          : options.from === "deck"
            ? "deck"
            : options.from === "graveyard"
              ? "graveyard"
              : "hand";
    const resolvedInstanceId = this.getState().objects[instanceId]
      ? instanceId
      : this.findCardInPlayOrigin(actorId, sourceZone, instanceId);
    const cardId = resolvedInstanceId;
    const payload: Record<string, unknown> = { instanceId: resolvedInstanceId };
    let pitchIds: string[] = [];
    const anyNumberBanishCostCards = playOption(options, "anyNumberBanishCostCards") as
      | readonly FabCardRef[]
      | undefined;
    const anyNumberBanishCostIds =
      anyNumberBanishCostCards === undefined
        ? undefined
        : this.findCardsInZone(actorId, "hand", anyNumberBanishCostCards).filter(
            (candidateId) => candidateId !== cardId,
          );
    if (options.target !== undefined) {
      payload.target = typeof options.target === "string" ? options.target : options.target.id;
    }
    if (options.additionalTarget !== undefined) {
      payload.additionalTarget =
        typeof options.additionalTarget === "string"
          ? options.additionalTarget
          : options.additionalTarget.id;
    }
    if (options.targetInstanceId !== undefined) {
      payload.target = options.targetInstanceId;
    }
    // Mechanic-specific knobs live on the narrow decomposed option shapes
    // (play-options.ts); extract union-safely and forward verbatim.
    const forward = (key: string): void => {
      const value = playOption(options, key);
      if (value !== undefined) payload[key] = value;
    };
    forward("boost");
    forward("scrap");
    forward("beatChest");
    const beatChestInstanceId = playOption(options, "beatChestInstanceId");
    if (typeof beatChestInstanceId === "string") payload.beatChestInstanceId = beatChestInstanceId;
    const scrapCard = playOption(options, "scrapCard") as FabCardRef | undefined;
    if (scrapCard !== undefined) {
      payload.scrapInstanceId = this.findCardInZone(actorId, "graveyard", scrapCard);
    }
    const banishCostCard = playOption(options, "banishCostCard") as FabCardRef | undefined;
    if (banishCostCard !== undefined) {
      payload.banishCostInstanceId = this.findCardInZone(actorId, "graveyard", banishCostCard);
    }
    forward("fuse");
    forward("playMethod");
    forward("crank");
    forward("alternativeCostIndex");
    const fuseCards = playOption(options, "fuseCards") as
      | FabCardRef
      | readonly FabCardRef[]
      | undefined;
    if (fuseCards !== undefined) {
      const fuseList = Array.isArray(fuseCards) ? fuseCards : [fuseCards];
      payload.fuseInstanceIds = this.findCardsInZone(actorId, "hand", fuseList);
    }
    const chargeCard = playOption(options, "chargeCard") as FabCardRef | undefined;
    if (chargeCard !== undefined) {
      payload.chargeInstanceId = this.findCardInZone(actorId, "hand", chargeCard);
    }
    if (options.from !== undefined) payload.from = options.from;
    if (options.playPermission !== undefined) {
      const quote = buildFabRulesView(this.getState()).quotePlay({
        actorId,
        instanceId: resolvedInstanceId,
        from: sourceZone,
      });
      const permission = quote.playPermissionOptions.find(
        (candidate) => candidate.kind === options.playPermission,
      );
      if (!permission) {
        throw new Error(
          `Play of ${cardId} has no ${options.playPermission} play permission from ${sourceZone}.`,
        );
      }
      payload.playPermissionId = permission.id;
    }
    if (options.x !== undefined) payload.x = options.x;
    const payWithLightningFlow = playOption(options, "payWithLightningFlow") as boolean | undefined;
    if (payWithLightningFlow !== undefined) {
      payload.payWithLightningFlow = payWithLightningFlow;
      const payWithGold = playOption(options, "payWithGold") as boolean | undefined;
      if (payWithGold !== undefined) payload.payWithGold = payWithGold;
    } else {
      forward("payWithGold");
    }
    if (options.pitch !== undefined) {
      const pitchList = Array.isArray(options.pitch) ? options.pitch : [options.pitch];
      // Exclude the card being played so pitch of same-printing copies is distinct.
      const foundPitchIds = this.findCardsInZone(actorId, "hand", pitchList);
      if (foundPitchIds.includes(cardId)) {
        // Play card and a pitch copy share the first match — re-resolve pitch
        // excluding the played instance.
        const state = this.runtime.getState();
        const hand = state.containers.zonesByPlayerId[actorId]!.hand;
        const used = new Set<string>([cardId]);
        pitchIds = pitchList.map((c) => {
          const canonicalId = fabCardRefId(c);
          const id = hand.find(
            (inst) => state.objects[inst]?.canonicalId === canonicalId && !used.has(inst),
          );
          if (!id) {
            throw new Error(
              `Could not find distinct pitch copy of "${canonicalId}" excluding the played card.`,
            );
          }
          used.add(id);
          return id;
        });
      } else {
        pitchIds = [...foundPitchIds];
      }
    }
    let result = this.exec({ move: "begin-play", actorId, payload });
    let pitchIndex = 0;
    for (let safety = 0; safety < 100; safety += 1) {
      const decision = this.getState().decision;
      if (!decision) return result;
      if (drive === "explicit") {
        const forced = forcedFabDecisionAnswer(decision);
        if (forced) {
          result = this.exec({
            move: "answer-decision",
            actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: forced,
            },
          });
          continue;
        }
      }
      let answer: Record<string, unknown>;
      switch (decision.kind) {
        case "payment": {
          const explicitInstanceId = pitchIds[pitchIndex++];
          const autoSelected =
            explicitInstanceId || !this.harnessConfig.autoPitch
              ? []
              : selectAutoPitchPayment(
                  decision.candidates.map((candidate) => candidate.instanceId),
                  decision.amount,
                  (instanceId) =>
                    decision.candidates.find((candidate) => candidate.instanceId === instanceId)
                      ?.value ?? 0,
                );
          const instanceIds = explicitInstanceId
            ? [explicitInstanceId]
            : decision.oneAtATime
              ? autoSelected.slice(0, 1)
              : autoSelected;
          if (instanceIds.length === 0) {
            throw new Error(`Play of ${cardId} requires another persisted payment decision.`);
          }
          answer = { kind: "payment", instanceIds };
          break;
        }
        case "option": {
          const requestedIds =
            (playOption(options, "modeIds") as readonly string[] | undefined) ?? [];
          const modeIndexes =
            (playOption(options, "modeIndexes") as readonly number[] | undefined) ?? [];
          const optionIds =
            requestedIds.length > 0
              ? requestedIds
              : modeIndexes.flatMap((index) => decision.options[index]?.id ?? []);
          if (optionIds.length < decision.min) {
            if (drive === "explicit") return result;
            // Optional additional/alternative play-cost Pay/Decline defaults
            // to Decline when the test did not name a cost card or mode —
            // same deterministic default as boolean decisions.
            const canDecline =
              decision.options.some((option) => option.id === "decline") &&
              decision.options.some((option) => option.id === "pay");
            if (canDecline) {
              answer = { kind: "option", optionIds: ["decline"] };
              break;
            }
            throw new Error(`Play of ${cardId} requires explicit modeIds or modeIndexes.`);
          }
          answer = { kind: "option", optionIds };
          break;
        }
        case "entity-target": {
          if (
            decision.continuation.kind === "play-cost-target" &&
            anyNumberBanishCostIds !== undefined
          ) {
            const candidateIds = new Set(
              decision.candidates.map((candidate) => candidate.instanceId),
            );
            if (anyNumberBanishCostIds.some((instanceId) => !candidateIds.has(instanceId))) {
              throw new Error(`Play of ${cardId} received an illegal any-number banish cost card.`);
            }
            answer = { kind: "entity-target", instanceIds: anyNumberBanishCostIds };
            break;
          }
          const cardTarget = options.targetCard
            ? resolveFabCardTargetInstanceId({
                target: options.targetCard,
                candidates: decision.candidates,
                objects: this.getState().objects,
                attackProxies: this.getState().attackProxies,
                activeAttack: this.getState().combat?.activeLink?.activeAttack,
              })
            : undefined;
          const requestedTarget =
            options.targetInstanceId ??
            (typeof options.target === "string" ? options.target : options.target?.id);
          const resolvedTarget =
            cardTarget ??
            resolveHeroTargetCandidate(requestedTarget, decision.candidates, this.getState());
          if (
            drive === "explicit" &&
            resolvedTarget === undefined &&
            !forcedFabDecisionAnswer(decision)
          )
            return result;
          const selected =
            resolvedTarget &&
            decision.candidates.some((candidate) => candidate.instanceId === resolvedTarget)
              ? [resolvedTarget]
              : decision.candidates.length === decision.min && decision.min === decision.max
                ? decision.candidates.map((candidate) => candidate.instanceId)
                : drive === "explicit"
                  ? []
                  : decision.candidates.length > 0
                    ? decision.candidates
                        .slice(0, decision.min)
                        .map((candidate) => candidate.instanceId)
                    : [];
          if (selected.length < decision.min) {
            if (drive === "explicit") return result;
            throw new Error(
              `Play of ${cardId} requires an explicit target, targetCard, or targetInstanceId.`,
            );
          }
          answer = { kind: "entity-target", instanceIds: selected };
          break;
        }
        case "ordering": {
          // No play-option names an ordering; explicit drive leaves it pending so the
          // test answers it directly rather than silently preserving listed order.
          if (drive === "explicit") return result;
          answer = { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) };
          break;
        }
        case "boolean": {
          if (drive === "explicit") return result;
          // Smart default: decline optional resolution effects so the card play
          // proceeds deterministically. Mirrors attackToDefendInternal behavior.
          answer = { kind: "boolean", value: false };
          break;
        }
        case "numeric": {
          const requested = playOption(options, "xValue");
          const isExplicit =
            typeof requested === "number" &&
            Number.isInteger(requested) &&
            requested >= decision.min &&
            requested <= decision.max;
          if (!isExplicit) {
            if (drive === "explicit") return result;
            // Non-explicit plays default to the minimum X so they proceed deterministically.
            answer = { kind: "numeric", value: decision.min };
            break;
          }
          answer = { kind: "numeric", value: requested };
          break;
        }
        case "partition": {
          if (drive === "explicit") return result;
          const requested = playOption(options, "optBottom");
          const bottomCount =
            typeof requested === "number" && Number.isInteger(requested) ? requested : 0;
          answer = {
            kind: "partition",
            groups: fabListedPartitionGroups(decision, bottomCount),
          };
          break;
        }
        case "effect-resolution": {
          if (decision.options.length === 1) {
            answer = { kind: "effect-resolution", optionId: decision.options[0]!.id };
            break;
          }
          // Name-card / choose-color: leave the closed list for `.choose()`.
          return result;
        }
        default:
          throw new Error(`Play of ${cardId} produced unsupported ${decision.kind} decision.`);
      }
      result = this.exec({
        move: "answer-decision",
        actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer,
        },
      });
    }
    throw new Error(`Play of ${cardId} did not reach a stable rules state.`);
  }

  /**
   * Shared implementation of the attack → Defend advance. Internal by
   * convention: called by {@link FabPlayerHandle.attackWith} and
   * {@link FabTestHelpers.attackToDefend}.
   * Must stay public because TypeScript forbids private access across class
   * boundaries; do not call directly from tests.
   */
  attackToDefendInternal(
    attacker: FabPlayerHandle,
    card: FabCardRef,
    defenderId: string,
    options: FabAttackFlowPlayOptions = {},
  ): void {
    // An explicit play target (such as a Spectra aura) wins over the default
    // defending hero.
    attacker.play(card, { ...options, target: options.target ?? defenderId });
    // autoPassPriority may already have walked the layer to Defend.
    if (this.combat()?.step === "defend") return;
    if (this.combat()?.step !== "layer" || this.getState().rulesStack.length === 0) {
      throw new Error("Expected an unresolved attack-card rules process.");
    }
    for (let safety = 0; safety < 64; safety += 1) {
      if (this.combat()?.step === "defend") return;
      const decision = this.getState().decision;
      if (decision) {
        if (decision.kind === "boolean") {
          // Smart default: decline optional resolution effects so the attack can
          // proceed to the Defend step deterministically.
          this.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "boolean", value: false },
            },
          });
          continue;
        }
        if (decision.kind === "partition") {
          // CR 8.5.22 opt on non-attack layers can still be pending; keep top.
          this.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: {
                kind: "partition",
                groups: fabListedPartitionGroups(decision),
              },
            },
          });
          continue;
        }
        if (decision.kind === "entity-target" && decision.candidates.length >= decision.min) {
          // `attackWith` is a public fixture procedure. When an attack opens a
          // required target choice that is independent of its defending hero,
          // advance through a deterministic legal minimum selection rather
          // than reaching into the snapshot or reinstating test-state hooks.
          this.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: {
                kind: "entity-target",
                instanceIds: decision.candidates
                  .slice(0, decision.min)
                  .map((candidate) => candidate.instanceId),
              },
            },
          });
          continue;
        }
        throw new Error(
          `Attack-to-defend requires the persisted ${decision.kind} decision ${decision.decisionId}.`,
        );
      }
      const priority = this.getPriorityPlayerId();
      if (!priority) break;
      this.pass(priority);
    }
    const combat = this.combat();
    if (combat?.step !== "defend") {
      throw new Error(`Expected combat step "defend", got "${combat?.step ?? "closed"}"`);
    }
  }

  defend(
    actorId: string,
    cards: FabCardRef | readonly FabCardRef[] = [],
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    const list = Array.isArray(cards) ? cards : [cards];
    const cardIds = this.findDefendingCardIds(actorId, list);
    return this.exec({ move: "defend", actorId, payload: { instanceIds: cardIds } });
  }

  /**
   * Resolve candidate defending card ids for a probe without mutating state
   * (thin accessor over {@link findDefendingCardIds}).
   */
  resolveDefendingCardIds(actorId: string, cards: readonly FabCardRef[]): string[] {
    return this.findDefendingCardIds(actorId, cards);
  }

  private findDefendingCardIds(actorId: string, cards: readonly FabCardRef[]): string[] {
    const state = this.getState();
    const player = state.players[actorId];
    if (!player) throw new Error(`Unknown player: ${actorId}`);
    const zones = [
      "hand",
      "arsenal",
      "head",
      "chest",
      "arms",
      "legs",
      "weapon1",
      "weapon2",
    ] as const;
    const used = new Set<string>();
    return cards.map((card) => {
      const canonicalId = fabCardRefId(card);
      for (const zone of zones) {
        const instanceId = state.containers.zonesByPlayerId[actorId]![zone].find(
          (candidate) =>
            state.objects[candidate]?.canonicalId === canonicalId && !used.has(candidate),
        );
        if (instanceId) {
          used.add(instanceId);
          return instanceId;
        }
      }
      throw new Error(`Could not find distinct defending card "${canonicalId}" for ${actorId}.`);
    });
  }

  private autoPassPriority(): void {
    if (!this.harnessConfig.autoPassPriority) return;
    for (let safety = 0; safety < 200; safety += 1) {
      if (this.hasGameEnded()) return;
      const actorId = this.getPriorityPlayerId();
      if (!actorId) return;
      const command = getFabAutoPassPriorityCommand(this.runtime);
      if (!command) return;
      const result = this.dispatchForTest({
        move: command.move,
        actorId,
        payload: command.payload,
      });
      if (!result.accepted) {
        throw new FabMoveFailedError(
          { move: command.move, actorId, payload: command.payload },
          result,
        );
      }
    }
    throw new Error("autoPassPriority did not reach a stable priority state.");
  }

  pass(actorId: string): Extract<FabTestDispatchResult, { accepted: true }> {
    return this.exec({ move: "pass", actorId });
  }

  /**
   * Both players pass once (priority holder, then the other). Useful for
   * advancing combat or the non-combat stack when neither has responses
   * (CR 1.11.4a).
   */
  passBoth(): void {
    if (this.declareNoDefenseIfPending() && this.getState().decision) return;
    const a = this.getPriorityPlayerId();
    if (!a) throw new Error("No priority player");
    this.pass(a);
    if (this.hasGameEnded()) return;
    // If the first pass created a pending decision (e.g. a triggered layer
    // from combat resolution), let the caller handle it instead of passing
    // the second player into a rejection.
    if (this.getState().decision) return;
    // Continue when combat is open OR a non-combat stack still needs a second pass.
    const needsSecondPass = Boolean(this.combat()?.open) || this.getState().rulesStack.length > 0;
    if (!needsSecondPass) return;
    const b = this.getPriorityPlayerId();
    if (b) this.pass(b);
  }

  /**
   * Submit the explicit empty defense declaration when combat is waiting for
   * one. Test drain loops call this before looking for a priority holder,
   * because CR 7.3 declaration is a game process and intentionally has none.
   */
  declareNoDefenseIfPending(): boolean {
    const combat = this.combat();
    if (combat?.step !== "defend" || !combat.defenseDeclarationPending || !combat.activeLink) {
      return false;
    }
    this.defend(combat.activeLink.defendingPlayerId, []);
    return true;
  }

  /**
   * Advance only by priority passes until `player` receives the specified
   * persisted decision. Unlike the legacy resolve helpers this never selects
   * an optional mode, target, or payment on the test's behalf.
   */
  advanceToDecision<K extends FabDecision["kind"]>(
    player: FabPlayerHandle,
    kind: K,
    maxPasses = 24,
  ): Extract<FabDecision, { readonly kind: K }> {
    for (let pass = 0; pass < maxPasses; pass += 1) {
      const decision = this.getState().decision;
      if (decision) {
        if (decision.actorId === player.id && decision.kind === kind) {
          return decision as Extract<FabDecision, { readonly kind: K }>;
        }
        if (this.answerForcedDecision()) continue;
        throw new Error(
          `Expected ${kind} decision for ${player.id}, got ${decision.kind} for ${decision.actorId}.`,
        );
      }
      if (this.hasGameEnded()) break;
      this.passBoth();
    }
    throw new Error(`Did not reach ${kind} decision for ${player.id} within ${maxPasses} passes.`);
  }

  /**
   * Pass repeatedly until combat reaches `step`, combat closes, or the game ends.
   * Safety-capped to avoid infinite loops.
   */
  advanceCombatTo(step: string, maxPasses = 24): void {
    for (let i = 0; i < maxPasses; i++) {
      if (this.hasGameEnded()) return;
      const combat = this.combat();
      if (!combat?.open) {
        // Activated weapon attacks begin on the rules stack before their
        // combat link exists. Advance the public priority procedure through
        // that stack instead of requiring tests to emulate private runner
        // internals.
        if (this.getState().rulesStack.length === 0) return;
        if (this.getState().decision) {
          if (this.answerForcedDecision()) continue;
          break;
        }
        this.passBoth();
        continue;
      }
      if (combat.step === step) return;
      this.passBoth();
    }
    throw new Error(
      `advanceCombatTo("${step}") failed; stuck at ${this.combat()?.step ?? "closed"}`,
    );
  }

  /** Resolve combat through damage + close via successive passes (no reactions). */
  resolveCombatNoReactions(maxPasses = 32): void {
    for (let i = 0; i < maxPasses; i++) {
      if (this.hasGameEnded()) return;
      if (!this.combat()?.open) {
        // Smart default: combat not open yet — resolve a still-open attack
        // stack (e.g. right after play()) before giving up.
        if (this.getState().rulesStack.length === 0) {
          // Combat closed. Cycle priority back to the active player so the
          // caller can immediately take their next action.
          const priorityHolder = this.getPriorityPlayerId();
          if (priorityHolder && priorityHolder !== this.getState().activePlayerId) {
            this.dispatchForTest({ move: "pass", actorId: priorityHolder });
          }
          return;
        }
      }
      if (this.getState().decision) {
        if (this.answerForcedDecision()) continue;
        const decision = this.getState().decision!;
        if (decision.kind === "boolean" && !this.combat()?.open) {
          // Smart default: decline optional pre-combat resolution effects so
          // the attack proceeds to the Defend step deterministically.
          this.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "boolean", value: false },
            },
          });
          continue;
        }
        if (decision.kind === "entity-target" && decision.candidates.length >= decision.min) {
          // This public test-driver procedure deliberately advances a legal
          // decision; the engine itself never invents a target selection.
          this.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: {
                kind: "entity-target",
                instanceIds: decision.candidates
                  .slice(0, decision.min)
                  .map((candidate) => candidate.instanceId),
              },
            },
          });
          continue;
        }
        throw new Error(
          `resolveCombatNoReactions requires an explicit ${decision.kind} answer for ${decision.decisionId}.`,
        );
      }
      this.passBoth();
    }
    throw new Error(
      `resolveCombatNoReactions: combat did not close (${JSON.stringify({
        step: this.combat()?.step,
        stack: this.getState().rulesStack.map((layer) => ({
          kind: layer.kind,
          layerId: layer.layerId,
        })),
        process: this.getState().rulesProcess
          ? {
              processId: this.getState().rulesProcess!.processId,
              stage: this.getState().rulesProcess!.stage,
            }
          : null,
        decision: this.getState().decision
          ? {
              decisionId: this.getState().decision!.decisionId,
              kind: this.getState().decision!.kind,
            }
          : null,
      })})`,
    );
  }

  /** Submit a decision only when its answer is mathematically forced. */
  answerForcedDecision(): boolean {
    const decision = this.getState().decision;
    if (!decision) return false;
    let answer: Record<string, unknown> | null = null;
    switch (decision.kind) {
      case "entity-target":
        if (decision.min === decision.max && decision.candidates.length === decision.min) {
          answer = {
            kind: "entity-target",
            instanceIds: decision.candidates.map((candidate) => candidate.instanceId),
          };
        }
        break;
      case "option":
        // Auto-answer by selecting the first `min` options (always valid).
        // Handles both exact-match (min===max===options.length) and
        // over-subscribed decisions like trigger ordering (options > max).
        if (decision.min > 0 && decision.min <= decision.options.length) {
          answer = {
            kind: "option",
            optionIds: decision.options.slice(0, decision.min).map((option) => option.id),
          };
        }
        break;
      case "numeric":
        if (decision.min === decision.max && decision.requiresExplicitAnswer !== true) {
          answer = { kind: "numeric", value: decision.min };
        }
        break;
      case "ordering":
        if (decision.entries.length <= 1) {
          answer = { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) };
        }
        break;
      case "effect-resolution":
        if (decision.options.length === 1) {
          answer = { kind: "effect-resolution", optionId: decision.options[0]!.id };
        }
        break;
      case "boolean":
        // Optional effects need an explicit player choice in AAA tests — do not
        // force-answer true/false here (see 06-effects optional).
        break;
      case "partition":
        // CR 8.5.22 opt: default keep looked cards on top (no reorder).
        answer = { kind: "partition", groups: fabListedPartitionGroups(decision) };
        break;
      case "payment":
        break;
    }
    if (!answer) return false;
    const result = this.dispatchForTest({
      move: "answer-decision",
      actorId: decision.actorId,
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer,
      },
    });
    if (!result.accepted) return false;
    this.autoPassPriority();
    return true;
  }

  /** Keep loose fixture ergonomics at the test boundary, never at the runtime boundary. */
  private dispatchForTest(
    command: FabTestCommand,
    runtime: FabMatchRuntime = this.runtime,
  ): FabTestDispatchResult {
    if (!isFabMoveName(command.move)) {
      return { accepted: false, error: `Unknown move: ${command.move}`, errorCode: "unknown_move" };
    }
    const decoded = decodeFabCommand(command.move, command.payload ?? {});
    if (!decoded) {
      return {
        accepted: false,
        error: "FAB command payload is malformed or uses a legacy field.",
        errorCode: "invalid_command_payload",
      };
    }
    const result = runtime.applyCommand(command.actorId, decoded);
    // Visual fixtures run this driver in the browser too. Public command
    // receipts do not depend on the runtime's private event assertion journal.
    // Legality probes use a separate runtime and must not publish history.
    if (result.success && runtime === this.runtime) {
      this.commandMoveLogs.push(...result.moveLogs);
      this.commandNarratives.push(result.playerLog);
    }
    return testDispatchResult(result);
  }
}

function testDispatchResult(result: FabCommandResult): FabTestDispatchResult {
  if (!result.success) {
    return {
      accepted: false,
      // Production deliberately hides programmer errors from players, but the
      // engine harness must retain the original invariant/error text so tests
      // fail at the actual defect instead of a generic internal-error wrapper.
      error: result.diagnostic?.failedInvariant ?? result.error,
      ...(result.errorCode ? { errorCode: result.errorCode } : {}),
    };
  }
  return {
    accepted: true,
    move: result.processedCommand.move,
    actorId: result.actorId,
    state: result.state,
    playerLogs: [],
    moveLogs: result.moveLogs,
    playerLog: result.playerLog,
    outcome: result.outcome,
  };
}

function resolveHeroTargetCandidate(
  requested: string | undefined,
  candidates: readonly { readonly instanceId: string }[],
  state: FabMatchState,
): string | undefined {
  if (!requested) return requested;
  if (candidates.some((candidate) => candidate.instanceId === requested)) return requested;
  const seated = state.players[requested];
  if (
    seated?.heroCardId &&
    candidates.some((candidate) => candidate.instanceId === seated.heroCardId)
  ) {
    return seated.heroCardId;
  }
  for (const player of Object.values(state.players)) {
    if (
      player.playerId === requested &&
      player.heroCardId &&
      candidates.some((candidate) => candidate.instanceId === player.heroCardId)
    ) {
      return player.heroCardId;
    }
    if (
      player.heroCardId === requested &&
      candidates.some((candidate) => candidate.instanceId === player.playerId)
    ) {
      return player.playerId;
    }
  }
  return requested;
}

export { FabPlayerHandle } from "./player-handle.ts";
export {
  createFabTestState,
  FAB_MOVE_NAMES,
  isFabMoveName,
  type FabCardRef,
  type FabCardLike,
  type FabMatchOptions,
  type FabPlayerSetup,
  type FabTestFixture,
  type FabTestOptions,
};
export { fabToken } from "./test-fixtures.ts";
export type { FabFixtureCardEntry, FabFixtureZoneKind, FabPlayerFixture } from "./test-fixtures.ts";
