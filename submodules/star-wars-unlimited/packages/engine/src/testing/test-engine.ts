import type { SwuCardDefinition, SwuKeyword, SwuZone } from "@tcg/star-wars-unlimited-types";
import { applyCommand } from "../commands.ts";
import { projectState } from "../projection.ts";
import {
  addCardToState,
  effectiveHp,
  effectiveKeywords,
  effectivePower,
  registerDefinition,
} from "../state.ts";
import type {
  CommandResult,
  MatchState,
  MoveLogEntry,
  PlayerId,
  RuntimeCard,
  SwuCommand,
} from "../types.ts";
import {
  createFixtureState,
  type FixtureCardEntry,
  type FixtureCardState,
  type PlayerFixture,
  type SwuTestFixture,
  P1,
  P2,
} from "./test-fixtures.ts";

export type CardRef = string | RuntimeCard | SwuCardDefinition;

export interface MoveOptions {
  readonly as?: PlayerId;
  readonly zone?: SwuZone;
  readonly target?: CardRef;
}

export class MoveFailedError extends Error {
  readonly result: CommandResult;

  constructor(result: CommandResult) {
    super(`Move failed: ${result.error ?? "unknown error"}`);
    this.name = "MoveFailedError";
    this.result = result;
  }
}

export class FixtureAssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FixtureAssertionError";
  }
}

function isRuntimeCard(card: CardRef): card is RuntimeCard {
  return typeof card === "object" && "instanceId" in card;
}

function isDefinition(card: CardRef): card is SwuCardDefinition {
  return (
    typeof card === "object" &&
    card !== null &&
    "id" in card &&
    "title" in card &&
    "cardType" in card
  );
}

function fixtureCardOverrides(
  definition: SwuCardDefinition,
  entry: FixtureCardState,
): Partial<Omit<RuntimeCard, "instanceId" | "definitionId" | "owner">> {
  return {
    exhausted: entry.exhausted ?? false,
    playedThisPhase: entry.playedThisPhase ?? false,
    damage: entry.damage ?? 0,
    experience: entry.experience ?? 0,
    shield: entry.shield ?? 0,
    temporaryPower: entry.temporaryPower ?? 0,
    temporaryHp: entry.temporaryHp ?? 0,
    keywords: [...(entry.keywords ?? definition.keywords ?? [])],
  };
}

function assertFixture(condition: boolean, message: string): void {
  if (!condition) throw new FixtureAssertionError(message);
}

export function expectSuccessfulCommand(result: CommandResult): CommandResult {
  assertFixture(result.success, `Expected command to succeed, got ${result.error ?? "failure"}.`);
  return result;
}

export class SwuCardExpectation {
  constructor(
    private readonly engine: SwuTestEngine,
    private readonly card: CardRef,
    private readonly opts: { readonly controller?: PlayerId; readonly zone?: SwuZone } = {},
  ) {}

  private get runtimeCard(): RuntimeCard {
    return this.engine.findCard(this.card, this.opts);
  }

  toBeInZone(zone: SwuZone): this {
    const card = this.runtimeCard;
    assertFixture(
      card.zone === zone,
      `Expected ${card.instanceId} to be in ${zone}, got ${card.zone}.`,
    );
    return this;
  }

  toBeExhausted(exhausted = true): this {
    const card = this.runtimeCard;
    assertFixture(
      card.exhausted === exhausted,
      `Expected ${card.instanceId} exhausted=${exhausted}, got ${card.exhausted}.`,
    );
    return this;
  }

  toHaveDamage(amount: number): this {
    const card = this.runtimeCard;
    assertFixture(
      card.damage === amount,
      `Expected ${card.instanceId} damage ${amount}, got ${card.damage}.`,
    );
    return this;
  }

  toHaveShield(amount: number): this {
    const card = this.runtimeCard;
    assertFixture(
      card.shield === amount,
      `Expected ${card.instanceId} shield ${amount}, got ${card.shield}.`,
    );
    return this;
  }

  toHaveExperience(amount: number): this {
    const card = this.runtimeCard;
    assertFixture(
      card.experience === amount,
      `Expected ${card.instanceId} experience ${amount}, got ${card.experience}.`,
    );
    return this;
  }

  toHaveEffectivePower(amount: number): this {
    const card = this.runtimeCard;
    const actual = effectivePower(this.engine.state, card);
    assertFixture(
      actual === amount,
      `Expected ${card.instanceId} effective power ${amount}, got ${actual}.`,
    );
    return this;
  }

  toHaveEffectiveHp(amount: number): this {
    const card = this.runtimeCard;
    const actual = effectiveHp(this.engine.state, card);
    assertFixture(
      actual === amount,
      `Expected ${card.instanceId} effective HP ${amount}, got ${actual}.`,
    );
    return this;
  }

  toHaveKeyword(keyword: SwuKeyword): this {
    const card = this.runtimeCard;
    const keywords = effectiveKeywords(this.engine.state, card);
    assertFixture(
      keywords.includes(keyword),
      `Expected ${card.instanceId} to have keyword ${keyword}, got ${keywords.join(", ")}.`,
    );
    return this;
  }

  toBeAttachedTo(parent: CardRef): this {
    const card = this.runtimeCard;
    const parentCard = this.engine.findCard(parent);
    assertFixture(
      parentCard.upgrades.includes(card.instanceId),
      `Expected ${card.instanceId} to be attached to ${parentCard.instanceId}.`,
    );
    return this;
  }
}

export class SwuPlayerDriver {
  constructor(
    private readonly engine: SwuTestEngine,
    readonly playerId: PlayerId,
  ) {}

  get opponentId(): PlayerId {
    return this.playerId === P1 ? P2 : P1;
  }

  playCard(card: CardRef): CommandResult {
    return this.engine.playCard(card, { as: this.playerId });
  }

  smuggle(card: CardRef): CommandResult {
    return this.engine.playCard(card, { as: this.playerId, zone: "resource" });
  }

  pilot(card: CardRef, target: CardRef): CommandResult {
    return this.engine.playCard(card, { as: this.playerId, target });
  }

  activateAbility(source: CardRef, abilityIndex = 0): CommandResult {
    return this.engine.activateAbility(source, abilityIndex, { as: this.playerId });
  }

  attack(attacker: CardRef, defender: CardRef): CommandResult {
    return this.engine.attack(attacker, defender, { as: this.playerId });
  }

  pass(): CommandResult {
    return this.engine.pass({ as: this.playerId });
  }

  resolveChoice(optionId = "yes", choiceId?: string): CommandResult {
    return this.engine.resolveChoice(optionId, { as: this.playerId, choiceId });
  }

  cardsIn(zone: SwuZone): RuntimeCard[] {
    return this.engine.cardsIn(zone, this.playerId);
  }

  findCard(card: CardRef, zone?: SwuZone): RuntimeCard {
    return this.engine.findCard(card, { controller: this.playerId, zone });
  }

  expectSuccess(result: CommandResult): CommandResult {
    return expectSuccessfulCommand(result);
  }

  expectFailure(run: () => CommandResult): CommandResult {
    return this.engine.expectFailure(run);
  }

  expectCard(card: CardRef, zone?: SwuZone): SwuCardExpectation {
    return this.engine.expectCard(card, { controller: this.playerId, zone });
  }

  expectZoneCount(zone: SwuZone, count: number): void {
    this.engine.expectZoneCount(zone, count, this.playerId);
  }

  expectPendingChoice(prompt?: string): NonNullable<SwuTestEngine["pendingChoice"]> {
    const choice = this.engine.expectPendingChoice(prompt);
    assertFixture(
      choice.playerId === this.playerId,
      `Expected pending choice for ${this.playerId}, got ${choice.playerId}.`,
    );
    return choice;
  }

  expectNoPendingChoices(): void {
    this.engine.expectNoPendingChoices();
  }

  resolveYes(choiceId?: string): CommandResult {
    return this.resolveChoice("yes", choiceId);
  }

  resolveNo(choiceId?: string): CommandResult {
    return this.resolveChoice("no", choiceId);
  }

  resolveFirstChoice(choiceId?: string): CommandResult {
    const choice = this.expectPendingChoice();
    const option = choice.options[0];
    assertFixture(!!option, `Expected pending choice ${choice.id} to have at least one option.`);
    return this.resolveChoice(option.id, choiceId ?? choice.id);
  }
}

export class SwuTestEngine {
  readonly playerOne: SwuPlayerDriver;
  readonly playerTwo: SwuPlayerDriver;

  private constructor(private readonly matchState: MatchState) {
    this.playerOne = new SwuPlayerDriver(this, P1);
    this.playerTwo = new SwuPlayerDriver(this, P2);
  }

  static createWithFixture(
    playerOne: PlayerFixture = {},
    playerTwo: PlayerFixture = {},
    options: Omit<SwuTestFixture, "playerOne" | "playerTwo"> = {},
  ): SwuTestEngine {
    return new SwuTestEngine(createFixtureState({ ...options, playerOne, playerTwo }));
  }

  static fromFixture(fixture: SwuTestFixture = {}): SwuTestEngine {
    return new SwuTestEngine(createFixtureState(fixture));
  }

  static fromState(state: MatchState): SwuTestEngine {
    return new SwuTestEngine(state);
  }

  get state(): MatchState {
    return this.matchState;
  }

  get activePlayerId(): PlayerId {
    return this.state.activePlayer;
  }

  get pendingChoice() {
    return this.state.pendingChoices[0];
  }

  asPlayerOne(): SwuPlayerDriver {
    return this.playerOne;
  }

  asPlayerTwo(): SwuPlayerDriver {
    return this.playerTwo;
  }

  asPlayer(playerId: PlayerId): SwuPlayerDriver {
    return playerId === P1 ? this.playerOne : this.playerTwo;
  }

  defineCard(definition: SwuCardDefinition): SwuCardDefinition {
    return registerDefinition(this.state, definition);
  }

  addCard(entry: FixtureCardEntry, owner: PlayerId, zone: SwuZone): RuntimeCard {
    if (typeof entry === "string") return addCardToState(this.state, entry, owner, zone);
    if ("card" in entry) {
      const definition =
        typeof entry.card === "string"
          ? this.state.definitions[entry.card]
          : registerDefinition(this.state, entry.card);
      return addCardToState(
        this.state,
        definition,
        owner,
        zone,
        fixtureCardOverrides(definition, entry),
      );
    }
    return addCardToState(this.state, registerDefinition(this.state, entry), owner, zone);
  }

  cardsIn(zone: SwuZone, controller?: PlayerId): RuntimeCard[] {
    return Object.values(this.state.cards).filter(
      (card) => card.zone === zone && (!controller || card.controller === controller),
    );
  }

  logEntries(type?: string): MoveLogEntry[] {
    return type ? this.state.moveLog.filter((entry) => entry.type === type) : this.state.moveLog;
  }

  expectCard(
    card: CardRef,
    opts: { readonly controller?: PlayerId; readonly zone?: SwuZone } = {},
  ): SwuCardExpectation {
    return new SwuCardExpectation(this, card, opts);
  }

  expectZoneCount(zone: SwuZone, count: number, controller?: PlayerId): void {
    const actual = this.cardsIn(zone, controller).length;
    assertFixture(
      actual === count,
      `Expected ${controller ?? "any"} ${zone} count ${count}, got ${actual}.`,
    );
  }

  expectLogEntry(type: string): MoveLogEntry {
    const entry = this.state.moveLog.find((candidate) => candidate.type === type);
    assertFixture(!!entry, `Expected move log entry ${type}.`);
    return entry;
  }

  expectPendingChoice(prompt?: string): NonNullable<SwuTestEngine["pendingChoice"]> {
    const choice = this.pendingChoice;
    assertFixture(!!choice, "Expected a pending choice.");
    if (prompt) {
      assertFixture(
        choice.prompt === prompt,
        `Expected pending choice prompt "${prompt}", got "${choice.prompt}".`,
      );
    }
    return choice;
  }

  expectNoPendingChoices(): void {
    assertFixture(
      this.state.pendingChoices.length === 0,
      `Expected no pending choices, got ${this.state.pendingChoices.length}.`,
    );
  }

  findCard(
    card: CardRef,
    opts: { readonly controller?: PlayerId; readonly zone?: SwuZone } = {},
  ): RuntimeCard {
    if (typeof card === "string" && this.state.cards[card]) return this.state.cards[card];
    if (isRuntimeCard(card)) return this.state.cards[card.instanceId] ?? card;
    const definitionId = isDefinition(card) ? card.id : card;
    const match = Object.values(this.state.cards).find((candidate) => {
      const definition = this.state.definitions[candidate.definitionId];
      return (
        (!opts.controller || candidate.controller === opts.controller) &&
        (!opts.zone || candidate.zone === opts.zone) &&
        (candidate.definitionId === definitionId ||
          definition?.internalName === definitionId ||
          definition?.title === definitionId)
      );
    });
    if (!match) throw new Error(`Card not found: ${typeof card === "string" ? card : card.title}`);
    return match;
  }

  playCard(card: CardRef, opts: MoveOptions = {}): CommandResult {
    const playerId = opts.as ?? this.activePlayerId;
    const runtimeCard = this.findCard(card, { controller: playerId, zone: opts.zone ?? "hand" });
    return this.exec({
      type: "playCard",
      playerId,
      cardId: runtimeCard.instanceId,
      targetId: opts.target
        ? this.findCard(opts.target, { controller: playerId }).instanceId
        : undefined,
    });
  }

  activateAbility(source: CardRef, abilityIndex = 0, opts: MoveOptions = {}): CommandResult {
    const playerId = opts.as ?? this.activePlayerId;
    const runtimeCard = this.findCard(source, { controller: playerId });
    return this.exec({
      type: "activateAbility",
      playerId,
      sourceId: runtimeCard.instanceId,
      abilityIndex,
    });
  }

  attack(attacker: CardRef, defender: CardRef, opts: MoveOptions = {}): CommandResult {
    const playerId = opts.as ?? this.activePlayerId;
    return this.exec({
      type: "attack",
      playerId,
      attackerId: this.findCard(attacker, { controller: playerId }).instanceId,
      defenderId: this.findCard(defender, { controller: playerId === P1 ? P2 : P1 }).instanceId,
    });
  }

  pass(opts: MoveOptions = {}): CommandResult {
    return this.exec({ type: "pass", playerId: opts.as ?? this.activePlayerId });
  }

  resolveChoice(
    optionId = "yes",
    opts: MoveOptions & { readonly choiceId?: string } = {},
  ): CommandResult {
    const playerId = opts.as ?? this.activePlayerId;
    const choice = opts.choiceId
      ? this.state.pendingChoices.find((candidate) => candidate.id === opts.choiceId)
      : this.state.pendingChoices.find((candidate) => candidate.playerId === playerId);
    if (!choice) {
      throw new MoveFailedError({ success: false, error: "No pending choice.", state: this.state });
    }
    return this.exec({ type: "resolveChoice", playerId, choiceId: choice.id, optionId });
  }

  getProjectedState(playerId: PlayerId) {
    return projectState(this.state, playerId);
  }

  expectFailure(run: () => CommandResult): CommandResult {
    try {
      const result = run();
      if (result.success) throw new Error("Expected move to fail, but it succeeded.");
      return result;
    } catch (error) {
      if (error instanceof MoveFailedError) return error.result;
      throw error;
    }
  }

  exec(command: SwuCommand): CommandResult {
    const result = applyCommand(this.state, command);
    if (!result.success) throw new MoveFailedError(result);
    return result;
  }
}
