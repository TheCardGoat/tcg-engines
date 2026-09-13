import type { FabDecision } from "../rules/process.ts";
import { effectivePlayerIntellect } from "../rules/state-rules-view.ts";
import { libraryPlayerId } from "../rules/shared-library.ts";
import { FAB_ZONE_KINDS, type FabMatchState, type FabZoneKind } from "../state.ts";
import type { FabMoveName } from "../moves.ts";
import {
  isArsenalTarget,
  type FabTestCommand,
  type FabTestDispatchResult,
  type FabTestEngine,
} from "./test-engine.ts";
import type { FabCardRef, FabFixtureZoneKind } from "./test-fixtures.ts";
import {
  isFabCardInstanceRef,
  isPublicFabCardInstance,
  listFabCardRefs,
  listPublicFabCardRefs,
  resolveFabCardRef,
  type FabCardInstanceRef,
  type FabCardRefFilter,
  type FabFluentCardRef,
} from "./card-ref.ts";
import { fabCardRefId } from "./test-fixtures.ts";
import { createFabFluentMust, type FabFluentMust } from "./player-fluent.ts";
import type {
  FabAttackFlowPlayOptions,
  FabBasePlayOptions,
  FabPlayOptions,
} from "./play-options.ts";
import { describeFabDecision, fabOptPartitionGroups, fabPayDeclineOptionIds } from "./intent.ts";
import {
  parseFabTargetArgs,
  resolveFabCardTargetInstanceId,
  type FabTargetOptions,
} from "./target-identity.ts";

/**
 * A player addressed by identity (its hero). Carries the actor implicitly so a
 * test reads as a sequence of that player's choices, such as
 * `Bravo.play(card)` and `Dash.blockWith(card)`.
 */
export class FabPlayerHandle {
  private readonly engine: FabTestEngine;
  private readonly playerId: string;
  private cachedMust: FabFluentMust | undefined;

  constructor(engine: FabTestEngine, playerId: string) {
    this.engine = engine;
    this.playerId = playerId;
  }

  get id(): string {
    return this.playerId;
  }

  /** Access the underlying match state (some fixtures feature-detect this). */
  getState(): FabMatchState {
    return this.engine.getState();
  }

  hero(): string {
    const state = this.state();
    const heroInstanceId = state.players[this.playerId]!.heroCardId;
    return heroInstanceId ? (state.objects[heroInstanceId]?.canonicalId ?? "") : "";
  }

  life(): number {
    return this.state().players[this.playerId]!.life;
  }

  actionPoints(): number {
    return this.state().players[this.playerId]!.actionPoints;
  }

  resourcePoints(): number {
    return this.state().players[this.playerId]!.resourcePoints;
  }

  intellect(): number {
    // Include continuous intellect buffs on the seated hero (Librarian, …).
    return effectivePlayerIntellect(this.state(), this.playerId);
  }

  hand(): string[] {
    return this.canonicalize(this.state().containers.zonesByPlayerId[this.playerId]!.hand);
  }

  handCount(): number {
    return this.state().containers.zonesByPlayerId[this.playerId]!.hand.length;
  }

  zone(zone: FabFixtureZoneKind): string[] {
    const state = this.state();
    // Yorick: deck/graveyard read through the shared-library host seat.
    const ownerId = libraryPlayerId(state, this.playerId, zone);
    return this.canonicalize(state.containers.zonesByPlayerId[ownerId]![zone]);
  }

  findCardInZone(zone: FabFixtureZoneKind, card: FabCardRef): string {
    return this.engine.findCardInZone(this.playerId, zone, card);
  }

  /** Resolve several refs to distinct instance ids (supports same-printing copies). */
  findCardsInZone(zone: FabFixtureZoneKind, cards: readonly FabCardRef[]): string[] {
    return this.engine.findCardsInZone(this.playerId, zone, cards);
  }

  /**
   * Resolve an activation source. Prefers this seat's zones, then other
   * players' arena (printed "Any hero may activate this ability").
   */
  private findActivationSource(ref: FabCardRef, index?: number): string {
    try {
      return this.card(ref, index);
    } catch (error) {
      const canonicalId = fabCardRefId(ref);
      const state = this.state();
      const matches: string[] = [];
      for (const playerId of state.playerIds) {
        if (playerId === this.playerId) continue;
        for (const instanceId of state.containers.zonesByPlayerId[playerId]!.arena) {
          if (state.objects[instanceId]?.canonicalId === canonicalId) matches.push(instanceId);
        }
      }
      if (matches.length === 0) throw error;
      if (index === undefined) {
        if (matches.length > 1) {
          throw new Error(`"${canonicalId}": ${matches.length} copies present, pass an index.`);
        }
        return matches[0]!;
      }
      if (index < 0 || index >= matches.length) {
        throw new Error(
          `"${canonicalId}": index ${index} out of range (${matches.length} copies present).`,
        );
      }
      return matches[index]!;
    }
  }

  private attackActivationAbilityId(card: FabCardRef, index?: number): string | undefined {
    const instanceId = this.findActivationSource(card, index);
    const state = this.state();
    const object = state.objects[instanceId];
    const definition = object ? state.cardDefinitions[object.canonicalId] : undefined;
    const attack = definition?.base.abilities.find(
      (ability) =>
        ability.kind === "activated" &&
        (ability.abilityType === "attack" || ability.effect.type === "attack-with"),
    );
    return attack?.id;
  }

  /**
   * Strict zone-less card resolver: scan ALL of the player's zones (in the
   * fixed {@link FAB_ZONE_KINDS} order, zone-array order within a zone) for
   * instances matching the ref. Exactly one match resolves; ambiguity requires
   * an explicit 0-based `index`.
   */
  card(ref: FabCardRef, index?: number): string {
    const canonicalId = fabCardRefId(ref);
    const state = this.state();
    const player = state.players[this.playerId];
    if (!player) throw new Error(`Unknown player: ${this.playerId}`);
    const matches: string[] = [];
    for (const zone of FAB_ZONE_KINDS) {
      for (const instanceId of state.containers.zonesByPlayerId[this.playerId]![zone]) {
        if (state.objects[instanceId]?.canonicalId === canonicalId) {
          matches.push(instanceId);
        }
      }
    }
    if (matches.length === 0) {
      throw new Error(
        `Could not find "${canonicalId}" in any zone of ${this.playerId} (searched ${FAB_ZONE_KINDS.join(", ")}).`,
      );
    }
    if (index === undefined) {
      if (matches.length > 1) {
        throw new Error(`"${canonicalId}": ${matches.length} copies present, pass an index.`);
      }
      return matches[0]!;
    }
    if (index < 0 || index >= matches.length) {
      throw new Error(
        `"${canonicalId}": index ${index} out of range (${matches.length} copies present).`,
      );
    }
    return matches[index]!;
  }

  legalMoves(): readonly FabMoveName[] {
    return this.engine.legalMoves(this.playerId);
  }

  // ── Fluent card-ref queries ─────────────────────────────────────────────

  /**
   * Resolve a card ref to exactly one instance in the named zone.
   * Zero matches throws {@link FabCardRefNotFoundError}; two or more throw
   * {@link FabAmbiguousCardRefError} — never picks `[0]`.
   */
  cardIn(zone: FabZoneKind, card: FabFluentCardRef, filter?: FabCardRefFilter): FabCardInstanceRef {
    return resolveFabCardRef(this.state(), this.playerId, card, { ...filter, zone });
  }

  /** All instances of a card in the named zone (may be empty). */
  cardsIn(zone: FabZoneKind, card: FabCardRef): FabCardInstanceRef[] {
    return listFabCardRefs(this.state(), this.playerId, card, { zone });
  }

  /**
   * Resolve a card ref across the owner-visible resolution scope
   * (see `docs/fluent-test-api-plan.md`). Unique-or-throw.
   */
  ref(card: FabFluentCardRef): FabCardInstanceRef {
    return resolveFabCardRef(this.state(), this.playerId, card);
  }

  /** Fluent must-act surface; every verb throws {@link FabMoveFailedError} on rejection. */
  get must(): FabFluentMust {
    if (!this.cachedMust) this.cachedMust = createFabFluentMust(this);
    return this.cachedMust;
  }

  isActive(): boolean {
    return this.engine.getActivePlayerId() === this.playerId;
  }

  hasPriority(): boolean {
    return this.engine.getPriorityPlayerId() === this.playerId;
  }

  /** CR 9.3 Marked status on this hero's controller. */
  isMarked(): boolean {
    return this.playerRecord().marked;
  }

  /** CR 8.5.39 active contract task text, or `null` when none is pending. */
  activeContract(): string | null {
    return this.playerRecord().activeContract;
  }

  /** Warmonger's Diplomacy modal (persists across the end-of-turn ledger reset). */
  diplomacyChoice(): "war" | "peace" | null {
    return this.playerRecord().history.game.diplomacyChoice;
  }

  /** True when this player has charged a card to soul this turn (CR 8.5.29). */
  hasChargedThisTurn(): boolean {
    return this.playerRecord().history.turn.charged;
  }

  /** True when this player's crowd has booed this turn. */
  hasCrowdBooedThisTurn(): boolean {
    return this.playerRecord().history.turn.crowdBooed;
  }

  /** Count of weapon attacks declared this turn. */
  weaponAttacksThisTurn(): number {
    return this.playerRecord().history.turn.weaponAttacks;
  }

  /** Test-only: add action points without advancing the turn. */
  gainActionPoints(amount: number): void {
    this.playerRecord().actionPoints += amount;
  }

  // ── Dispatch (actor implicit) ───────────────────────────────────────────

  exec(
    command: Omit<FabTestCommand, "actorId">,
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    return this.engine.exec({ ...command, actorId: this.playerId });
  }

  expectFailure(
    command: Omit<FabTestCommand, "actorId">,
  ): Extract<FabTestDispatchResult, { accepted: false }> {
    return this.engine.expectFailure({ ...command, actorId: this.playerId });
  }

  /** Assert that this player is currently being asked for the named choice. */
  expectDecision<K extends FabDecision["kind"]>(
    kind: K,
  ): Extract<FabDecision, { readonly kind: K }> {
    const decision = this.engine.getState().decision;
    if (!decision || decision.actorId !== this.playerId || decision.kind !== kind) {
      throw new Error(
        `Expected ${this.playerId} to have a pending ${kind} decision, got ${
          decision ? `${decision.kind} for ${decision.actorId}` : "none"
        }.`,
      );
    }
    return decision as Extract<FabDecision, { readonly kind: K }>;
  }

  /** Choose an optional effect explicitly, as a player would in the client. */
  chooseBoolean(value: boolean): Extract<FabTestDispatchResult, { accepted: true }> {
    this.expectDecision("boolean");
    return this.engine.answerDecision(this.playerId, { kind: "boolean", value });
  }

  /** Choose one or more options from the currently presented option prompt. */
  chooseOptions(
    ...optionIds: readonly string[]
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    this.expectDecision("option");
    return this.engine.answerDecision(this.playerId, { kind: "option", optionIds });
  }

  /**
   * Choose cards from the currently presented target prompt by real card
   * reference. Empty args is choose-none (same as {@link target}).
   */
  chooseTargets(
    ...cards: readonly FabFluentCardRef[]
  ): Extract<FabTestDispatchResult, { accepted: true }> | undefined {
    return this.target(...cards);
  }

  /** Fail-loud target intent for tests that require a live chooser. */
  targetRequired(
    ...args: readonly (FabFluentCardRef | FabPlayerHandle | FabTargetOptions)[]
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    this.expectDecision("entity-target");
    const result = this.target(...args);
    if (!result) throw new Error(`Expected a target answer for ${this.playerId}.`);
    return result;
  }

  /** Choose hero targets from the current public target prompt. */
  chooseTargetPlayers(
    ...players: readonly FabPlayerHandle[]
  ): Extract<FabTestDispatchResult, { accepted: true }> | undefined {
    return this.target(...players);
  }

  endTurn(
    payload: Record<string, unknown> = {},
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    return this.engine.endTurn(this.playerId, payload);
  }

  concede(): Extract<FabTestDispatchResult, { accepted: true }> {
    return this.exec({ move: "concede" });
  }

  /** Play an attack action from hand. A sole legal opposing hero is selected automatically. */
  play(
    card: FabCardRef,
    options: FabPlayOptions = {},
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    return this.engine.play(this.playerId, card, options);
  }

  /** Play a pre-resolved card instance (fluent ref fidelity for multi-copy zones). */
  playInstance(
    instanceId: string,
    options: FabPlayOptions = {},
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    return this.engine.playInstance(this.playerId, instanceId, options);
  }

  /**
   * Play an attack and advance to the Defend step. The target defaults to the
   * sole opposing hero; an explicit `options.target` overrides.
   */
  attackWith(card: FabCardRef, options: FabAttackFlowPlayOptions = {}): void {
    const defenderId =
      options.target !== undefined
        ? typeof options.target === "string"
          ? options.target
          : options.target.id
        : this.soleOpponentId();
    this.engine.attackToDefendInternal(this, card, defenderId, options);
  }

  /**
   * Play an attack without inventing non-forced answers.
   * Default stop is the Defend step; `{ stopAt: "on-attack" }` leaves an
   * on-attack decision or trigger for {@link decline} / {@link target} / {@link choose}.
   */
  playAttack(
    card: FabCardRef,
    options: FabAttackFlowPlayOptions & {
      readonly stopAt?: "defend" | "on-attack";
      readonly optionals?: "decline" | "accept" | "throw";
      readonly entityTargets?: "minimum" | "maximum" | "throw" | "pause";
    } = {},
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    const defenderId =
      options.target !== undefined
        ? typeof options.target === "string"
          ? options.target
          : options.target.id
        : this.soleOpponentId();
    const from =
      options.from === "arsenal" ||
      options.from === "banished" ||
      options.from === "deck" ||
      options.from === "graveyard"
        ? options.from
        : "hand";
    const instanceId = this.engine.findCardInPlayOrigin(this.playerId, from, card);
    const { stopAt, optionals, entityTargets, ...playOptions } = options;
    const result = this.engine.playInstance(
      this.playerId,
      instanceId,
      { ...playOptions, target: defenderId },
      "explicit",
    );
    this.engine.advanceUntil({
      stopAt: stopAt ?? "defend",
      optionals: optionals ?? "throw",
      entityTargets: entityTargets ?? "throw",
    });
    return result;
  }

  /**
   * Activate a weapon (or other attack source) and drain to Defend without
   * inventing non-forced answers. Same stop policy as {@link playAttack}.
   */
  activateAttack(
    card: FabCardRef,
    options: {
      readonly stopAt?: "defend" | "on-attack";
      readonly abilityId?: string;
      readonly index?: number;
      readonly alternativeCostIndex?: number;
      readonly optionals?: "decline" | "accept" | "throw";
      readonly entityTargets?: "minimum" | "maximum" | "throw" | "pause";
    } = {},
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    const result = this.activate(card, {
      abilityId: options.abilityId ?? this.attackActivationAbilityId(card, options.index),
      index: options.index,
      alternativeCostIndex: options.alternativeCostIndex,
    });
    this.engine.advanceUntil({
      stopAt: options.stopAt ?? "defend",
      optionals: options.optionals ?? "throw",
      entityTargets: options.entityTargets ?? "throw",
    });
    return result;
  }

  /** Decline a pending optional boolean or pay/decline option. */
  decline(): Extract<FabTestDispatchResult, { accepted: true }> {
    const decision = this.engine.getState().decision;
    if (!decision || decision.actorId !== this.playerId) {
      throw new Error(`No pending decision for ${this.playerId} to decline.`);
    }
    if (decision.kind === "boolean") return this.chooseBoolean(false);
    if (decision.kind === "option") {
      const pair = fabPayDeclineOptionIds(decision);
      if (!pair) {
        throw new Error(`Cannot decline ${describeFabDecision(decision)}.`);
      }
      return this.chooseOptions(pair.decline);
    }
    throw new Error(`Cannot decline ${describeFabDecision(decision)}.`);
  }

  /** Accept a pending optional boolean or pay/decline option. */
  accept(): Extract<FabTestDispatchResult, { accepted: true }> {
    const decision = this.engine.getState().decision;
    if (!decision || decision.actorId !== this.playerId) {
      throw new Error(`No pending decision for ${this.playerId} to accept.`);
    }
    if (decision.kind === "boolean") return this.chooseBoolean(true);
    if (decision.kind === "option") {
      const pair = fabPayDeclineOptionIds(decision);
      if (!pair) {
        throw new Error(`Cannot accept ${describeFabDecision(decision)}.`);
      }
      return this.chooseOptions(pair.pay);
    }
    throw new Error(`Cannot accept ${describeFabDecision(decision)}.`);
  }

  /**
   * Choose a closed-list option by printed name or option id
   * (`option` or `effect-resolution`). Exact id/label wins; otherwise a unique
   * id-or-label substring match is accepted (0 or 2+ matches throw).
   */
  choose(nameOrId: string): Extract<FabTestDispatchResult, { accepted: true }> {
    const decision = this.engine.getState().decision;
    if (!decision || decision.actorId !== this.playerId) {
      throw new Error(`No pending decision for ${this.playerId} to choose ${nameOrId}.`);
    }
    if (decision.kind === "option") {
      const option = matchClosedListOption(decision.options, nameOrId, decision);
      return this.chooseOptions(option.id);
    }
    if (decision.kind === "effect-resolution") {
      const option = matchClosedListOption(decision.options, nameOrId, decision);
      return this.engine.answerDecision(this.playerId, {
        kind: "effect-resolution",
        optionId: option.id,
      });
    }
    throw new Error(`Cannot choose "${nameOrId}" on ${describeFabDecision(decision)}.`);
  }

  /**
   * Answer a pending numeric prompt. Values outside the presented
   * `[min, max]` throw without dispatching.
   */
  chooseNumeric(value: number): Extract<FabTestDispatchResult, { accepted: true }> {
    const decision = this.expectDecision("numeric");
    if (value < decision.min || value > decision.max) {
      throw new Error(
        `Numeric ${value} is outside [${decision.min}, ${decision.max}] for ${describeFabDecision(decision)}.`,
      );
    }
    return this.engine.answerDecision(this.playerId, { kind: "numeric", value });
  }

  /** Answer a partition (reveal/reorder) prompt. Default keeps presented order on `top`. */
  choosePartition(
    groups?: Readonly<Record<string, readonly string[]>>,
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    const decision = this.expectDecision("partition");
    return this.engine.answerDecision(this.playerId, {
      kind: "partition",
      groups: groups ?? { top: decision.entries.map((entry) => entry.id) },
    });
  }

  /**
   * Pitch the first presented payment candidate when a payment prompt is
   * pending. No-op when the player is not on a payment decision (resource-only
   * costs already paid).
   */
  pitchFirst(): Extract<FabTestDispatchResult, { accepted: true }> | undefined {
    const decision = this.engine.getState().decision;
    if (!decision || decision.actorId !== this.playerId || decision.kind !== "payment") {
      return undefined;
    }
    const candidate = decision.candidates[0];
    if (!candidate) {
      throw new Error(`Payment decision ${decision.decisionId} has no candidates.`);
    }
    return this.engine.answerDecision(this.playerId, {
      kind: "payment",
      instanceIds: [candidate.instanceId],
    });
  }

  /** Keep the presented order on an ordering prompt. */
  chooseListedOrder(): Extract<FabTestDispatchResult, { accepted: true }> {
    const decision = this.expectDecision("ordering");
    return this.engine.answerDecision(this.playerId, {
      kind: "ordering",
      orderedIds: decision.entries.map((entry) => entry.id),
    });
  }

  /**
   * Player intent: "this is the object I mean as the parameter."
   *
   * - Pending `entity-target` with named cards/players: answer it. Default
   *   identity is `"attack"` — if the named card has a live attack-proxy among
   *   the candidates, pick the proxy (CR 1.4.3). Pass `{ identity: "source" }`
   *   to force the original.
   * - Pending `entity-target` with no names (`.target()`): choose none. Legal
   *   only when the prompt allows 0 (up-to / min=0). Empty is not a parse error.
   * - No entity-target: no-op. A determined set needs no answer. Boundary tests
   *   that require a chooser use {@link targetRequired} so absence fails loudly.
   */
  target(
    ...args: readonly (FabFluentCardRef | FabPlayerHandle | FabTargetOptions)[]
  ): Extract<FabTestDispatchResult, { accepted: true }> | undefined {
    const { refs, options } = parseFabTargetArgs<FabFluentCardRef | FabPlayerHandle>(args);
    const decision = this.engine.getState().decision;
    if (!decision || decision.actorId !== this.playerId || decision.kind !== "entity-target") {
      return undefined;
    }
    if (refs.length === 0) {
      if (decision.min > 0) {
        throw new Error(
          `target() requires at least one card or player for ${describeFabDecision(decision)}.`,
        );
      }
      return this.engine.answerDecision(this.playerId, { kind: "entity-target", instanceIds: [] });
    }
    const identity = options.identity ?? "attack";
    const instanceIds = refs.map((ref) => {
      if (isFabPlayerHandle(ref)) {
        const state = this.state();
        return (
          resolveHeroTargetCandidate(ref.id, decision.candidates, state) ??
          resolveHeroTargetCandidate(
            state.objects[state.players[ref.id]!.heroCardId ?? ""]?.canonicalId,
            decision.candidates,
            state,
          ) ??
          ref.id
        );
      }
      try {
        return this.resolveCardTargetInstanceId(ref, decision.candidates, identity);
      } catch (error) {
        throw new Error(
          `${error instanceof Error ? error.message : String(error)} for ${describeFabDecision(decision)}.`,
        );
      }
    });
    for (const instanceId of instanceIds) {
      if (!decision.candidates.some((candidate) => candidate.instanceId === instanceId)) {
        throw new Error(
          `Target ${instanceId} is not a legal target for ${describeFabDecision(decision)}.`,
        );
      }
    }
    return this.engine.answerDecision(this.playerId, { kind: "entity-target", instanceIds });
  }

  /** Declare defending cards (CR 7.3). Accepts rest args or a single array. */
  defendWith(
    ...cards: readonly (FabCardRef | readonly FabCardRef[])[]
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    const list = cards.flatMap((entry) => (Array.isArray(entry) ? entry : [entry]));
    return this.engine.defend(this.playerId, list);
  }

  /**
   * Probe a defend declaration that must be rejected, without mutating state.
   * Returns the rejection record so tests keep asserting `rejection.errorCode`.
   */
  expectBlockRejected(
    cards: FabCardRef | readonly FabCardRef[],
  ): Extract<FabTestDispatchResult, { accepted: false }> {
    const list = Array.isArray(cards) ? cards : [cards];
    const cardIds = this.engine.resolveDefendingCardIds(this.playerId, list);
    return this.expectFailure({ move: "defend", payload: { instanceIds: cardIds } });
  }

  /** Probe an activation through the production command boundary without changing match state. */
  expectActivationRejected(
    card: FabFluentCardRef,
    abilityId?: string,
  ): Extract<FabTestDispatchResult, { accepted: false }> {
    return this.expectFailure({
      move: "activate",
      payload: {
        instanceId: this.ref(card).instanceId,
        ...(abilityId ? { ability: abilityId } : {}),
      },
    });
  }

  /**
   * Activate a card instance (resolved zone-less via {@link card}). With
   * `equipToZone`, routes through the modular equip-to-zone play path.
   *
   * After dispatching, drains mathematically-forced decisions (e.g.
   * activation cost-targets with a single candidate) so simple activate
   * calls resolve without manual decision handling. Tests that need to
   * inspect decisions should use `game.exec({ move: "activate", ... })`
   * directly instead.
   */
  activate(
    card: FabCardRef,
    options: {
      equipToZone?: "head" | "chest" | "arms" | "legs";
      /** Required when a source exposes more than one activated ability. */
      abilityId?: string;
      /** Required when more than one copy of `card` is seated. */
      index?: number;
      /** Index of a mixed alternative activation cost (CR 5.1.3c). */
      alternativeCostIndex?: number;
      /** CR 8.5.22 Opt: number of looked cards put on the bottom (play parity). */
      optBottom?: number;
      /** Answer the activation's entity-target decision by selecting the maximum allowed entities. */
      entityTargets?: "maximum";
    } = {},
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    const cardId = this.findActivationSource(card, options.index);
    const result = this.exec({
      move: "activate",
      payload: {
        instanceId: cardId,
        ...(options.abilityId ? { ability: options.abilityId } : {}),
        ...(options.equipToZone ? { target: options.equipToZone } : {}),
        ...(options.alternativeCostIndex !== undefined
          ? { alternativeCostIndex: options.alternativeCostIndex }
          : {}),
      },
    });
    // Drain forced decisions so simple activate calls resolve fully.
    for (let safety = 0; safety < 20; safety += 1) {
      if (!this.engine.answerForcedDecision()) break;
    }
    if (options.entityTargets === "maximum") {
      const decision = this.engine.getState().decision;
      if (decision?.kind === "entity-target" && decision.actorId === this.playerId) {
        this.engine.answerDecision(this.playerId, {
          kind: "entity-target",
          instanceIds: decision.candidates.slice(0, decision.max).map((c) => c.instanceId),
        });
      }
    }
    if (options.optBottom !== undefined) {
      const decision = this.engine.getState().decision;
      if (decision?.kind === "partition" && decision.actorId === this.playerId) {
        this.engine.answerDecision(this.playerId, {
          kind: "partition",
          groups: fabOptPartitionGroups(decision.entries, options.optBottom),
        });
      }
    }
    return result;
  }

  /** Declare defending cards from hand (CR 7.3). Empty = no blocks → damage. */
  blockWith(
    ...cards: readonly (FabCardRef | readonly FabCardRef[])[]
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    return this.defendWith(...cards);
  }

  /** Alias for {@link blockWith}. */
  defend(
    ...cards: readonly (FabCardRef | readonly FabCardRef[])[]
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    return this.defendWith(...cards);
  }

  pass(): Extract<FabTestDispatchResult, { accepted: true }> {
    return this.engine.pass(this.playerId);
  }

  /** Put a hand card into arsenal (end-turn option CR 4.4.3b). */
  endTurnWithArsenal(card: FabCardRef): Extract<FabTestDispatchResult, { accepted: true }> {
    const arsenalInstanceId = this.findCardInZone("hand", card);
    return this.endTurn({ arsenalInstanceId });
  }

  /** Play an attack from arsenal (CR 3.3.4 / 5.1). */
  playFromArsenal(
    card: FabCardRef,
    options?: FabBasePlayOptions,
  ): Extract<FabTestDispatchResult, { accepted: true }>;
  /**
   * Play from arsenal and target one publicly identifiable card. The singleton
   * array form composes with test setup that naturally yields target lists.
   */
  playFromArsenal(
    card: FabCardRef,
    target: FabFluentCardRef | readonly FabFluentCardRef[],
  ): Extract<FabTestDispatchResult, { accepted: true }>;
  playFromArsenal(
    card: FabCardRef,
    optionsOrTarget: FabBasePlayOptions | FabFluentCardRef | readonly FabFluentCardRef[] = {},
  ): Extract<FabTestDispatchResult, { accepted: true }> {
    if (isArsenalTarget(optionsOrTarget)) {
      const targets = Array.isArray(optionsOrTarget) ? optionsOrTarget : [optionsOrTarget];
      if (targets.length !== 1) {
        throw new Error(
          `playFromArsenal target shorthand requires exactly one target, got ${targets.length}.`,
        );
      }
      return this.engine.play(this.playerId, card, {
        from: "arsenal",
        targetInstanceId: this.resolvePublicTarget(targets[0]!),
      });
    }
    return this.engine.play(this.playerId, card, { ...optionsOrTarget, from: "arsenal" });
  }

  private state(): FabMatchState {
    return this.engine.getState();
  }

  private playerRecord() {
    const player = this.state().players[this.playerId];
    if (!player) throw new Error(`Unknown player: ${this.playerId}`);
    return player;
  }

  private resolveCardTargetInstanceId(
    ref: FabFluentCardRef,
    candidates: readonly { readonly instanceId: string }[],
    identity: NonNullable<FabTargetOptions["identity"]>,
  ): string {
    const state = this.state();
    return resolveFabCardTargetInstanceId({
      target: ref,
      candidates,
      objects: state.objects,
      attackProxies: state.attackProxies,
      activeAttack: state.combat?.activeLink?.activeAttack,
      identity,
    });
  }

  /** Resolve a card target across the public zones of both seated players. */
  private resolvePublicTarget(target: FabFluentCardRef): string {
    const state = this.state();
    if (isFabCardInstanceRef(target)) {
      if (!isPublicFabCardInstance(state, target.instanceId)) {
        throw new Error(`Target instance ${target.instanceId} is not a public card target.`);
      }
      return target.instanceId;
    }
    const matches = listPublicFabCardRefs(state, target);
    if (matches.length !== 1) {
      throw new Error(
        `Expected exactly one public target matching "${fabCardRefId(target)}", found ${matches.length}.`,
      );
    }
    return matches[0]!.instanceId;
  }

  /** Resolve the sole opposing seat (1v1 product scope). */
  private soleOpponentId(): string {
    const opponents = this.state().playerIds.filter((id) => id !== this.playerId);
    if (opponents.length !== 1) {
      throw new Error(
        `Cannot derive a sole opponent for ${this.playerId} (found ${opponents.length}; product scope is 1v1).`,
      );
    }
    return opponents[0]!;
  }

  private canonicalize(instanceIds: readonly string[]): string[] {
    const objects = this.state().objects;
    return instanceIds.map((id) => objects[id]?.canonicalId ?? id);
  }
}

function isFabPlayerHandle(value: FabFluentCardRef | FabPlayerHandle): value is FabPlayerHandle {
  return (
    typeof value === "object" && value !== null && "hasPriority" in value && "playAttack" in value
  );
}

function matchClosedListOption(
  options: readonly { readonly id: string; readonly label: string }[],
  nameOrId: string,
  decision: FabDecision,
): { readonly id: string; readonly label: string } {
  const exact = options.find((entry) => entry.id === nameOrId || entry.label === nameOrId);
  if (exact) return exact;
  const needle = nameOrId.toLowerCase();
  const matches = options.filter(
    (entry) =>
      entry.id.toLowerCase().includes(needle) || entry.label.toLowerCase().includes(needle),
  );
  if (matches.length === 1) return matches[0]!;
  if (matches.length > 1) {
    throw new Error(
      `Option "${nameOrId}" is ambiguous in ${describeFabDecision(decision)} (matched ${matches.map((entry) => entry.id).join(", ")}).`,
    );
  }
  throw new Error(`No option "${nameOrId}" in ${describeFabDecision(decision)}.`);
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
      player.heroCardId === requested &&
      candidates.some((candidate) => candidate.instanceId === player.playerId)
    ) {
      return player.playerId;
    }
  }
  return requested;
}
