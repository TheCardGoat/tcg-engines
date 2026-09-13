import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { canAttackWith, legalAttackTargets } from "../battle.ts";
import {
  canActivateEffect,
  canAttachDon,
  canDeclareAttack,
  canPlayCard,
} from "../engine/legality.ts";
import { cardName, getCardForInstance, getInstance, getPlayer } from "../shared.ts";
import type {
  ApplyCommandResult,
  CardZone,
  EngineCommand,
  MatchSeat,
  MatchState,
  PlayerView,
  ProjectedDecision,
  PromptResolutionContext,
} from "../types.ts";
import type { OnePieceTestEngine } from "./test-engine.ts";
import type { CardRef } from "./test-fixtures.ts";

/**
 * Seat-bound fluent driver for One Piece engine tests.
 *
 * Prefer `engine.asSouth()` / `engine.asNorth()` so the IDE autocompletes
 * player actions and every call is implicitly scoped to that seat.
 *
 * Action helpers resolve catalog cards to live instances, run preflight
 * legality checks, and throw human-readable errors aimed at both humans and
 * AI agents debugging a failing comprehensive-rules (or other) test.
 */
export class OnePieceTestPlayer {
  private readonly engine: OnePieceTestEngine;
  readonly seat: MatchSeat;

  constructor(engine: OnePieceTestEngine, seat: MatchSeat) {
    this.engine = engine;
    this.seat = seat;
  }

  /** Opponent seat (the other head-to-head player). */
  get opponentSeat(): MatchSeat {
    return this.seat === "south" ? "north" : "south";
  }

  view(): PlayerView {
    return this.engine.getView(this.seat);
  }

  leader(): string {
    return this.engine.leader(this.seat);
  }

  opponentLeader(): string {
    return this.engine.leader(this.opponentSeat);
  }

  /**
   * Find a card in a specific zone for this seat. Throws a descriptive error
   * listing what is actually present when the card is missing.
   */
  findInZone(zone: CardZone, card: CardRef): string {
    const cardId = cardRefId(card);
    try {
      return this.engine.findCardInZone(this.seat, zone, card);
    } catch {
      throw new Error(this.describeMissingCard(cardId, zone));
    }
  }

  /** Find a Character on this seat's field. */
  findOnField(card: CardRef): string {
    return this.findInZone("character", card);
  }

  /**
   * Play a card from this player's hand by catalog definition.
   * PrefLights: card is in hand, play is legal (phase, DON!!, slots, etc.).
   */
  play(card: CardRef, slotIndex?: number): ApplyCommandResult {
    const label = describeCardRef(card);
    let instanceId: string;
    try {
      instanceId = this.engine.findCardInZone(this.seat, "hand", card);
    } catch {
      throw new Error(
        [
          `as${capitalize(this.seat)}().play(${label}): card is not in ${this.seat}'s hand.`,
          this.zoneInventory("hand"),
          this.matchContext(),
        ].join("\n"),
      );
    }

    const legality = canPlayCard(this.state, this.seat, instanceId, slotIndex);
    if (!legality.ok) {
      throw new Error(
        [
          `as${capitalize(this.seat)}().play(${label}): play is not legal.`,
          `  reason: ${legality.reason ?? "unknown"}`,
          `  activeDon: ${getPlayer(this.state, this.seat).activeDon}`,
          `  cardCost: ${this.instanceCostHint(instanceId)}`,
          this.matchContext(),
        ].join("\n"),
      );
    }

    return this.engine.playCard(card, this.seat, slotIndex);
  }

  /**
   * Declare an attack. `attacker` and `target` may be catalog cards or live
   * instance IDs. Prefer catalog cards for readability:
   *
   *   engine.asSouth().attack(eb01MountainGod018, engine.asNorth().leader());
   *
   * PrefLights existence, attackability, and legal target set.
   */
  attack(attacker: CardRef | string, target: CardRef | string): ApplyCommandResult {
    const attackerLabel = describeCardRef(attacker);
    const targetLabel = describeCardRef(target);
    const prefix = `as${capitalize(this.seat)}().attack(${attackerLabel}, ${targetLabel})`;

    const attackerId = this.resolveOwnBoardCard(attacker, "attacker", prefix);
    const targetId = this.resolveOpponentBoardCard(target, "target", prefix);

    const attackability = this.explainAttacker(attackerId);
    if (!attackability.ok) {
      throw new Error(
        [
          `${prefix}: attacker cannot attack.`,
          ...attackability.details.map((line) => `  ${line}`),
          this.matchContext(),
        ].join("\n"),
      );
    }

    const legality = canDeclareAttack(this.state, this.seat, attackerId, targetId);
    if (!legality.ok) {
      const legalTargets = legalAttackTargets(this.state, this.seat, attackerId);
      throw new Error(
        [
          `${prefix}: attack is not legal.`,
          `  reason: ${legality.reason ?? "unknown"}`,
          `  attacker: ${this.describeInstance(attackerId)}`,
          `  target: ${this.describeInstance(targetId)}`,
          `  legalTargets: [${legalTargets.map((id) => this.describeInstance(id)).join(", ") || "none"}]`,
          this.matchContext(),
        ].join("\n"),
      );
    }

    return this.engine.declareAttack(attackerId, targetId, this.seat);
  }

  /**
   * Activate a Main / Activate: Main ability on a field card or Leader.
   */
  activateMain(source: CardRef | string): ApplyCommandResult {
    const label = describeCardRef(source);
    const prefix = `as${capitalize(this.seat)}().activateMain(${label})`;
    const sourceId = this.resolveOwnBoardCard(source, "source", prefix, [
      "character",
      "leader",
      "stage",
    ]);

    const legality = canActivateEffect(this.state, this.seat, sourceId, "activateMain");
    if (!legality.ok) {
      throw new Error(
        [
          `${prefix}: activation is not legal.`,
          `  reason: ${legality.reason ?? "unknown"}`,
          `  source: ${this.describeInstance(sourceId)}`,
          this.matchContext(),
        ].join("\n"),
      );
    }

    return this.engine.activateEffect(sourceId, "activateMain", this.seat);
  }

  attachDon(target: CardRef | string, amount = 1): ApplyCommandResult {
    const label = describeCardRef(target);
    const prefix = `as${capitalize(this.seat)}().attachDon(${label}, ${amount})`;
    const targetId = this.resolveOwnBoardCard(target, "target", prefix, ["character", "leader"]);

    const legality = canAttachDon(this.state, this.seat, targetId, amount);
    if (!legality.ok) {
      throw new Error(
        [
          `${prefix}: attach DON!! is not legal.`,
          `  reason: ${legality.reason ?? "unknown"}`,
          `  activeDon: ${getPlayer(this.state, this.seat).activeDon}`,
          this.matchContext(),
        ].join("\n"),
      );
    }

    return this.engine.attachDon(targetId, amount, this.seat);
  }

  endTurn(): ApplyCommandResult {
    return this.engine.endTurn(this.seat);
  }

  passTurn(): ApplyCommandResult {
    return this.endTurn();
  }

  concede(): ApplyCommandResult {
    return this.engine.concede(this.seat);
  }

  // ---------------------------------------------------------------------------
  // Named prompt resolvers (readable for rules authors)
  // ---------------------------------------------------------------------------

  /** Resolve the battle Blocker step. Pass a card, or nothing / empty for no block. */
  chooseBlocker(card?: CardRef | string | null): ApplyCommandResult {
    if (card === undefined || card === null) {
      return this.chooseEmpty("battleBlocker");
    }
    return this.chooseCards("battleBlocker", [card]);
  }

  /** Resolve the battle Counter step with zero or more Counter cards from hand. */
  chooseCounter(...cards: Array<CardRef | string>): ApplyCommandResult {
    return this.chooseCards("battleCounter", cards);
  }

  /** Select effect targets (generic entity selection). */
  chooseTargets(...cards: Array<CardRef | string>): ApplyCommandResult {
    return this.chooseCards("effectTargetSelection", cards);
  }

  /** Decline / pick zero targets on an "up to" target selection. */
  chooseNoTargets(): ApplyCommandResult {
    return this.chooseEmpty("effectTargetSelection");
  }

  /** Trash selected hand cards for an effect (or pay a trash cost). */
  trashFromHand(...cards: Array<CardRef | string>): ApplyCommandResult {
    return this.chooseCards("effectTrashFromHandSelection", cards);
  }

  /** Choose cards to play from an effect play selection. */
  choosePlay(...cards: Array<CardRef | string>): ApplyCommandResult {
    return this.chooseCards("effectPlaySelection", cards);
  }

  /** Decline / pick zero cards on an effect play selection. */
  chooseNoPlay(): ApplyCommandResult {
    return this.chooseEmpty("effectPlaySelection");
  }

  /** Choose cards from a search selection. */
  chooseSearch(...cards: Array<CardRef | string>): ApplyCommandResult {
    return this.chooseCards("effectSearchSelection", cards);
  }

  /** Decline / pick zero cards on a search selection. */
  chooseNoSearch(): ApplyCommandResult {
    return this.chooseEmpty("effectSearchSelection");
  }

  /**
   * Resolve an ordered multi-card selection (search remainder, deck rearrange,
   * return-to-deck order, etc.) by submitting instance IDs in order.
   */
  orderCards(
    intent: PromptResolutionContext["intent"],
    cards: Array<CardRef | string>,
  ): ApplyCommandResult {
    return this.chooseCards(intent, cards);
  }

  /** Rest selected field cards as an activation / effect cost. */
  restCards(...cards: Array<CardRef | string>): ApplyCommandResult {
    return this.chooseCards("effectCostRestCards", cards);
  }

  /** Choose how many DON!! to add from the DON!! deck (effectAddDon). */
  chooseAddDon(amount: number): ApplyCommandResult {
    return this.chooseOption("effectAddDon", String(amount));
  }

  /** Choose a draw count option (effectDrawCount). */
  chooseDrawCount(amount: number): ApplyCommandResult {
    return this.chooseOption("effectDrawCount", String(amount));
  }

  /** Choose how many DON!! to set active (effectSetActiveDon). */
  chooseSetActiveDon(amount: number): ApplyCommandResult {
    return this.chooseOption("effectSetActiveDon", String(amount));
  }

  /** Accept an optional "you may" effect (Yes). */
  acceptOptional(): ApplyCommandResult {
    return this.engine.resolveDecision("effectOptional", { optionId: "yes" }, this.seat);
  }

  /** Decline an optional "you may" effect (No). */
  declineOptional(): ApplyCommandResult {
    return this.engine.resolveDecision("effectOptional", { optionId: "no" }, this.seat);
  }

  /** Activate a pending Life Trigger. */
  activateLifeTrigger(): ApplyCommandResult {
    return this.engine.resolveDecision("lifeTrigger", { optionId: "activate" }, this.seat);
  }

  /** Decline / skip a pending Life Trigger. */
  declineLifeTrigger(): ApplyCommandResult {
    return this.engine.resolveDecision("lifeTrigger", { optionId: "skip" }, this.seat);
  }

  /** Accept a K.O. (or similar) replacement effect. */
  acceptKoReplacement(): ApplyCommandResult {
    return this.engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, this.seat);
  }

  /** Decline a K.O. replacement effect. */
  declineKoReplacement(): ApplyCommandResult {
    return this.engine.resolveDecision("effectKoReplacement", { optionId: "no" }, this.seat);
  }

  /**
   * Pick a numeric amount option (DON!! give count, draw count, etc.).
   * Defaults to `effectGiveDonCount`; pass `intent` for other amount prompts.
   */
  chooseAmount(
    amount: number,
    intent: PromptResolutionContext["intent"] = "effectGiveDonCount",
  ): ApplyCommandResult {
    return this.engine.resolveDecision(intent, { optionId: String(amount) }, this.seat);
  }

  /**
   * Escape hatch for uncommon intents: resolve by selecting cards.
   * Prefer named helpers (`chooseBlocker`, `chooseTargets`, …) when available.
   */
  choose(
    intent: PromptResolutionContext["intent"],
    cards: Array<CardRef | string> = [],
  ): ApplyCommandResult {
    return this.chooseCards(intent, cards);
  }

  /**
   * Escape hatch for option-based prompts (position, yes/no not covered above).
   */
  chooseOption(intent: PromptResolutionContext["intent"], optionId: string): ApplyCommandResult {
    try {
      return this.engine.resolveDecision(intent, { optionId }, this.seat);
    } catch (error) {
      throw new Error(
        [
          `as${capitalize(this.seat)}().chooseOption(${intent}, ${optionId}): failed.`,
          `  cause: ${error instanceof Error ? error.message : String(error)}`,
          this.pendingPromptSummary(),
          this.matchContext(),
        ].join("\n"),
      );
    }
  }

  /**
   * Expected-failure helper with this seat filled in. Prefer for negative
   * proofs that still need the raw EngineCommand shape.
   *
   * Accepts a command body without `seat` (or with it); the driver's seat is
   * always applied so callers do not need to repeat it.
   */
  expectFailure(command: { type: string } & Record<string, unknown>): ApplyCommandResult {
    return this.engine.expectFailure({ ...command, seat: this.seat } as EngineCommand);
  }

  hasPendingChoice(): boolean {
    return this.engine.hasPendingChoice(this.seat);
  }

  pendingDecision(intent: PromptResolutionContext["intent"]): ProjectedDecision {
    try {
      return this.engine.pendingDecision(intent, this.seat);
    } catch (error) {
      throw new Error(
        [
          `as${capitalize(this.seat)}().pendingDecision(${intent}): no matching pending prompt.`,
          `  cause: ${error instanceof Error ? error.message : String(error)}`,
          this.pendingPromptSummary(),
          this.matchContext(),
        ].join("\n"),
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  private get state(): MatchState {
    return this.engine.getState();
  }

  private chooseEmpty(intent: PromptResolutionContext["intent"]): ApplyCommandResult {
    return this.chooseCards(intent, []);
  }

  private chooseCards(
    intent: PromptResolutionContext["intent"],
    cards: Array<CardRef | string>,
  ): ApplyCommandResult {
    const prefix = `as${capitalize(this.seat)}().choose(${intent}, [${cards.map(describeCardRef).join(", ")}])`;
    // Happy-path choose skips documenting the optional yes; decline tests use decline().
    if (intent !== "effectOptional") {
      this.engine.acceptLeadingOptional(this.seat);
    }
    let decision: ProjectedDecision;
    try {
      decision = this.engine.pendingDecision(intent, this.seat);
    } catch (error) {
      throw new Error(
        [
          `${prefix}: no pending ${intent} prompt for ${this.seat}.`,
          `  cause: ${error instanceof Error ? error.message : String(error)}`,
          this.pendingPromptSummary(),
          this.matchContext(),
        ].join("\n"),
      );
    }

    const selectedIds = cards.map((card) => this.resolvePromptCandidate(decision, card, prefix));
    return this.engine.resolveDecision(intent, { selectedIds }, this.seat);
  }

  private resolvePromptCandidate(
    decision: ProjectedDecision,
    card: CardRef | string,
    prefix: string,
  ): string {
    // Prefer an exact projected candidate id first so DON!! tokens
    // (`active-don:0`) and live instance IDs pass through without catalog lookup.
    if (typeof card === "string") {
      for (const step of decision.steps) {
        if (step.kind !== "selectEntity") continue;
        const exact = step.candidates.find((candidate) => candidate.ref.id === card);
        if (exact) return exact.ref.id;
      }
      if (this.state.cards[card]) {
        return card;
      }
    }

    const cardId = cardRefId(card);
    for (const step of decision.steps) {
      if (step.kind !== "selectEntity") continue;
      const match = step.candidates.find((candidate) => {
        const instance = this.state.cards[candidate.ref.id];
        return instance?.cardId === cardId || candidate.ref.id === cardId;
      });
      if (match) return match.ref.id;
    }

    // Synthetic DON!! tokens and some cost prompts project without catalog
    // candidates; pass the raw id through so the engine revalidates it.
    if (typeof card === "string") {
      return card;
    }

    const candidateSummary = decision.steps
      .filter((step) => step.kind === "selectEntity")
      .flatMap((step) =>
        step.kind === "selectEntity"
          ? step.candidates.map((c) => {
              const instance = this.state.cards[c.ref.id];
              return instance ? this.describeInstance(c.ref.id) : c.ref.id;
            })
          : [],
      );

    throw new Error(
      [
        `${prefix}: ${describeCardRef(card)} is not among the projected candidates.`,
        `  candidates: [${candidateSummary.join(", ") || "none"}]`,
        this.matchContext(),
      ].join("\n"),
    );
  }

  private resolveOwnBoardCard(
    card: CardRef | string,
    role: string,
    prefix: string,
    zones: Array<"character" | "leader" | "stage" | "hand"> = ["character", "leader", "stage"],
  ): string {
    if (typeof card === "string" && this.state.cards[card]) {
      const instance = this.state.cards[card]!;
      if (instance.controller !== this.seat) {
        throw new Error(
          [
            `${prefix}: ${role} instance is controlled by ${instance.controller}, not ${this.seat}.`,
            `  instance: ${this.describeInstance(card)}`,
            this.matchContext(),
          ].join("\n"),
        );
      }
      return card;
    }

    const cardId = cardRefId(card);
    for (const zone of zones) {
      try {
        return this.engine.findCardInZone(this.seat, zone, cardId);
      } catch {
        // try next
      }
    }

    throw new Error(
      [
        `${prefix}: could not find ${role} ${describeCardRef(card)} on ${this.seat}'s board.`,
        ...zones.map((zone) => `  ${this.zoneInventory(zone)}`),
        this.matchContext(),
      ].join("\n"),
    );
  }

  private resolveOpponentBoardCard(card: CardRef | string, role: string, prefix: string): string {
    if (typeof card === "string" && this.state.cards[card]) {
      return card;
    }

    // Leaders are commonly passed as engine.leader("north") already.
    const cardId = cardRefId(card);
    const opponent = this.opponentSeat;
    for (const zone of ["character", "leader", "stage"] as const) {
      try {
        return this.engine.findCardInZone(opponent, zone, cardId);
      } catch {
        // try next
      }
    }

    throw new Error(
      [
        `${prefix}: could not find ${role} ${describeCardRef(card)} on ${opponent}'s board.`,
        `  ${this.zoneInventoryFor(opponent, "character")}`,
        `  ${this.zoneInventoryFor(opponent, "leader")}`,
        this.matchContext(),
      ].join("\n"),
    );
  }

  private explainAttacker(attackerId: string): { ok: boolean; details: string[] } {
    const details: string[] = [`attacker: ${this.describeInstance(attackerId)}`];
    const instance = getInstance(this.state, attackerId);

    if (instance.controller !== this.seat) {
      return {
        ok: false,
        details: [...details, `controller is ${instance.controller}, expected ${this.seat}`],
      };
    }
    if (instance.zone !== "leader" && instance.zone !== "character") {
      return { ok: false, details: [...details, `zone is ${instance.zone}, not leader/character`] };
    }
    if (instance.rested) {
      details.push("attacker is rested");
    }
    const turnsStarted = getPlayer(this.state, this.seat).turnsStarted;
    if (turnsStarted < 2) {
      details.push(
        `first-turn battle ban (6-5-6-1): ${this.seat} turnsStarted=${turnsStarted} (need ≥ 2)`,
      );
    }
    if (instance.zone === "character" && instance.playedOnTurn === this.state.turnNumber) {
      details.push(
        `played this turn (playedOnTurn=${instance.playedOnTurn}, turnNumber=${this.state.turnNumber}); needs [Rush]`,
      );
    }

    if (canAttackWith(this.state, this.seat, attackerId)) {
      return { ok: true, details };
    }
    return { ok: false, details: [...details, "canAttackWith=false"] };
  }

  private describeInstance(instanceId: string): string {
    const instance = this.state.cards[instanceId];
    if (!instance) return `${instanceId} (missing)`;
    try {
      const card = getCardForInstance(this.state, instanceId);
      return `${cardName(card)} (${instance.cardId}) @${instance.zone}${instance.rested ? " rested" : ""}`;
    } catch {
      return `${instance.cardId} @${instance.zone}`;
    }
  }

  private describeMissingCard(cardId: string, zone: CardZone): string {
    return [
      `as${capitalize(this.seat)}(): could not find ${describeCardId(cardId)} in ${this.seat} ${zone}.`,
      `  ${this.zoneInventory(zone)}`,
      this.matchContext(),
    ].join("\n");
  }

  private zoneInventory(zone: CardZone): string {
    return this.zoneInventoryFor(this.seat, zone);
  }

  private zoneInventoryFor(seat: MatchSeat, zone: CardZone): string {
    const player = getPlayer(this.state, seat);
    const ids = (() => {
      switch (zone) {
        case "leader":
          return [player.leaderInstanceId];
        case "character":
          return player.characterArea.filter((entry): entry is string => Boolean(entry));
        case "stage":
          return player.stageArea ? [player.stageArea] : [];
        case "deck":
        case "hand":
        case "life":
        case "trash":
          return player[zone];
        case "resolution":
          return Object.values(this.state.cards)
            .filter((instance) => instance.controller === seat && instance.zone === "resolution")
            .map((instance) => instance.instanceId);
      }
    })();
    const labels = ids.map((id) => {
      const instance = this.state.cards[id];
      return instance ? instance.cardId : id;
    });
    return `${seat}.${zone}=[${labels.join(", ") || "empty"}]`;
  }

  private pendingPromptSummary(): string {
    const pending = this.state.promptQueue.filter((prompt) => prompt.status === "pending");
    if (pending.length === 0) return "  pendingPrompts: none";
    return [
      "  pendingPrompts:",
      ...pending.map((prompt) => {
        const intent = prompt.resolutionContext?.intent ?? "unknown";
        return `    - ${prompt.kind} seat=${prompt.seat} intent=${intent} label=${JSON.stringify(prompt.label)}`;
      }),
    ].join("\n");
  }

  private matchContext(): string {
    const state = this.state;
    return [
      "  match:",
      `    status=${state.status} phase=${state.phase} activeSeat=${state.activeSeat} turnNumber=${state.turnNumber}`,
      `    south.turnsStarted=${state.players.south.turnsStarted} north.turnsStarted=${state.players.north.turnsStarted}`,
    ].join("\n");
  }

  private instanceCostHint(instanceId: string): string {
    try {
      const card = getCardForInstance(this.state, instanceId);
      if (card.cardType === "leader" || card.cardType === "don") return "0";
      if ("cost" in card && typeof card.cost === "number") return String(card.cost);
      return "?";
    } catch {
      return "?";
    }
  }
}

function cardRefId(card: CardRef | string): string {
  return typeof card === "string" ? card : card.id;
}

function describeCardRef(card: CardRef | string): string {
  if (typeof card === "string") {
    // Instance id or bare card id — prefer catalog name when it is a card id.
    try {
      const definition = getCard(card);
      return `${cardName(definition)} (${card})`;
    } catch {
      return card;
    }
  }
  try {
    const definition = getCard(card.id);
    return `${cardName(definition)} (${card.id})`;
  } catch {
    return card.id;
  }
}

function describeCardId(cardId: string): string {
  try {
    return `${cardName(getCard(cardId))} (${cardId})`;
  } catch {
    return cardId;
  }
}

function capitalize(seat: MatchSeat): string {
  return seat === "south" ? "South" : "North";
}
