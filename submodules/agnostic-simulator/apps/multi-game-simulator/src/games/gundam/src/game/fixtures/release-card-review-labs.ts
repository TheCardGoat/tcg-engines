import * as gundamCards from "@tcg/gundam-cards";
import { asPlayerId, pilotSatisfiesUnitLinkCondition, type PlayerId } from "@tcg/gundam-engine";
import type {
  AttributeFilter,
  Card,
  CardEffect,
  Directive,
  EffectCondition,
  TargetFilter,
  UnitCard,
} from "@tcg/gundam-types";

import {
  createDevRuntime,
  DEV_PLAYER_ONE,
  DEV_PLAYER_TWO,
  type DevCardEntry,
  type DevPlayerFixture,
  type DevRuntime,
} from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";
import {
  realResourceCards,
  realShieldCards,
  st01Guncannon003,
  st01Gundam001,
  st01Guntank004,
  st01WhiteBase015,
} from "./real-cards.ts";

export type ReviewTiming =
  | "main"
  | "action"
  | "attack"
  | "burst"
  | "deploy"
  | "when-paired"
  | "when-linked"
  | "destroyed"
  | "battle"
  | "repair"
  | "block"
  | "board";

export interface ReleaseReviewCard {
  readonly card: Card;
  readonly timings: readonly ReviewTiming[];
}

function isCard(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    "cardNumber" in value &&
    typeof value.cardNumber === "string" &&
    "type" in value &&
    typeof value.type === "string"
  );
}

const REVIEW_SET = /^(?:ST10|GD05)-\d{3}$/u;

export const RELEASE_REVIEW_CARDS = Object.values(gundamCards)
  .filter(isCard)
  .filter((card) => REVIEW_SET.test(card.cardNumber))
  .filter(hasStructuredEffect)
  .toSorted((left, right) => left.cardNumber.localeCompare(right.cardNumber));

/**
 * Release-review fixtures exercise card-specific structured behavior. Plain
 * stat-line cards and keyword-only cards do not need dedicated routes because
 * their shared rules behavior is covered by generic engine tests.
 */
function hasStructuredEffect(card: Card): boolean {
  return (card.effects?.length ?? 0) > 0;
}

const ALL_CARDS = Object.values(gundamCards).filter(isCard);
const ALL_UNITS = ALL_CARDS.filter(
  (card): card is Extract<Card, { type: "unit" }> => card.type === "unit",
);
const ALL_PAIRABLE_CARDS = ALL_CARDS.filter(
  (card) => card.type === "pilot" || (card.type === "command" && Boolean(card.pilotName)),
).toSorted(
  (left, right) =>
    Number(left.type !== "pilot") - Number(right.type !== "pilot") ||
    left.cardNumber.localeCompare(right.cardNumber),
);

function timingsFor(card: Card): readonly ReviewTiming[] {
  const timings = new Set<ReviewTiming>();
  const effects = card.effects ?? [];
  for (const effect of effects) {
    for (const timing of effect.activation.timing ?? []) {
      switch (timing) {
        case "main":
        case "activate:main":
          timings.add("main");
          break;
        case "action":
        case "activate:action":
          timings.add("action");
          break;
        case "attack":
          timings.add("attack");
          break;
        case "burst":
          timings.add("burst");
          break;
        case "deploy":
          timings.add("deploy");
          break;
        case "whenPaired":
          timings.add("when-paired");
          break;
        case "whenLinked":
          timings.add("when-linked");
          break;
        case "destroyed":
        case "onDestroyByBattle":
          timings.add("destroyed");
          break;
        case "onBattleDamageDealtToUnit":
        case "onBattleDamageReceived":
        case "onShieldAreaCardDestroyByBattle":
          timings.add("battle");
          break;
      }
    }
  }
  if (card.keywordEffects.some((effect) => effect.keyword === "Repair")) timings.add("repair");
  if (card.keywordEffects.some((effect) => effect.keyword === "Blocker")) timings.add("block");
  if (timings.size === 0)
    timings.add(card.type === "unit" || card.type === "base" ? "board" : "main");
  return [...timings];
}

export const RELEASE_REVIEW_ENTRIES: readonly ReleaseReviewCard[] = RELEASE_REVIEW_CARDS.map(
  (card) => ({ card, timings: timingsFor(card) }),
);

export function reviewFixtureId(cardNumber: string, timing: ReviewTiming): string {
  return `release-review-${cardNumber.toLowerCase()}-${timing}`;
}

export function getReleaseReviewEntry(cardNumber: string): ReleaseReviewCard {
  const entry = RELEASE_REVIEW_ENTRIES.find(
    (candidate) => candidate.card.cardNumber === cardNumber,
  );
  if (!entry) throw new Error(`Unknown release-review card: ${cardNumber}`);
  return entry;
}

function hostForPilot(
  card: Extract<Card, { type: "pilot" | "command" }>,
  requireLink = false,
): Extract<Card, { type: "unit" }> {
  const pilotName = card.type === "command" ? card.pilotName : card.name;
  const matchingLink = ALL_UNITS.find((unit) =>
    card.type === "pilot"
      ? pilotSatisfiesUnitLinkCondition(card, unit)
      : unit.linkCondition
          ?.toLocaleLowerCase()
          .includes(pilotName?.toLocaleLowerCase() ?? "\u0000"),
  );
  const matchingTrait = ALL_UNITS.find((unit) =>
    card.traits.some((trait) =>
      unit.traits.some((unitTrait) => unitTrait.toLocaleLowerCase() === trait.toLocaleLowerCase()),
    ),
  );
  if (requireLink && !matchingLink) {
    throw new Error(`${card.cardNumber}: no real Unit can link with ${card.name}`);
  }
  return matchingLink ?? matchingTrait ?? ALL_UNITS[0]!;
}

function linkedUnitForBase(card: Extract<Card, { type: "base" }>): Extract<Card, { type: "unit" }> {
  return ALL_UNITS.find((unit) => unit.color === card.color) ?? ALL_UNITS[0]!;
}

type FixtureZone =
  | "hand"
  | "deck"
  | "resourceArea"
  | "battleArea"
  | "baseSection"
  | "trash"
  | "shieldArea";
type PlannedCard = Card | DevCardEntry;
type PlannedPlayer = Record<FixtureZone, PlannedCard[]>;
type PlannedPlayerKey = "p1" | "p2";

interface PlannedPairing {
  readonly player: PlannedPlayerKey;
  readonly unit: UnitCard;
  readonly pilot: Card;
}

interface PlannedBattle {
  readonly attacker: UnitCard;
  readonly defender?: UnitCard;
}

interface PlannedHistoryCard {
  readonly player: PlannedPlayerKey;
  readonly card: Card;
}

interface DeckTopRequirement {
  readonly player: PlannedPlayerKey;
  readonly lookCount: number;
  readonly tutorFilter?: TargetFilter;
  readonly source: Card;
}

interface ReviewFixturePlan {
  readonly p1: PlannedPlayer;
  readonly p2: PlannedPlayer;
  readonly pairings: PlannedPairing[];
  readonly activatedCommands: PlannedHistoryCard[];
  readonly deployedThisTurn: PlannedHistoryCard[];
  readonly friendlyDestroyedTraits: Set<string>;
  readonly deckTopRequirements: DeckTopRequirement[];
  activePlayer: typeof DEV_PLAYER_ONE | typeof DEV_PLAYER_TWO;
  opponentDiscardedByP1: boolean;
  actionBattle?: PlannedBattle;
}

function emptyPlannedPlayer(): PlannedPlayer {
  return {
    hand: [],
    deck: [],
    resourceArea: [],
    battleArea: [],
    baseSection: [],
    trash: [],
    shieldArea: [],
  };
}

function cardOf(entry: PlannedCard): Card {
  return "card" in entry ? entry.card : entry;
}

function playerForOwner(
  owner: TargetFilter["owner"],
  controller: PlannedPlayerKey,
): PlannedPlayerKey {
  if (owner === "opponent") return controller === "p1" ? "p2" : "p1";
  return controller;
}

function fixtureZoneFor(filter: TargetFilter, card: Card): FixtureZone {
  if (filter.zone && filter.zone !== "resourceDeck" && filter.zone !== "removalArea") {
    return filter.zone;
  }
  if (card.type === "unit" || card.type === "pilot") return "battleArea";
  if (card.type === "base") return "baseSection";
  if (card.type === "resource") return "resourceArea";
  return "hand";
}

function filterMinimum(filter: TargetFilter): number {
  if (filter.count === "all" || filter.count === undefined) return 1;
  if (typeof filter.count === "number") return Math.max(1, filter.count);
  return Math.max(1, filter.count.min);
}

function compareNumber(
  actual: number,
  comparison: "eq" | "neq" | "lt" | "lte" | "gt" | "gte",
  expected: number,
): boolean {
  switch (comparison) {
    case "eq":
      return actual === expected;
    case "neq":
      return actual !== expected;
    case "lt":
      return actual < expected;
    case "lte":
      return actual <= expected;
    case "gt":
      return actual > expected;
    case "gte":
      return actual >= expected;
  }
}

function referencedStat(value: unknown, source: Card): number | undefined {
  if (typeof value === "number") return value;
  if (!value || typeof value !== "object" || !("stat" in value)) return undefined;
  const stat = value.stat;
  if (stat === "level" || stat === "cost") return source[stat];
  if ((stat === "ap" || stat === "hp") && source.type === "unit") return source[stat];
  if (stat === "hp" && source.type === "base") return source.hp;
  return undefined;
}

function matchesAttribute(
  card: Card,
  filter: AttributeFilter,
  source: Card,
  pairedPilot?: Card,
): boolean {
  if (filter.attribute === "or") {
    return filter.filters.some((candidate) =>
      matchesAttribute(card, candidate, source, pairedPilot),
    );
  }
  if (filter.attribute === "and") {
    return filter.filters.every((candidate) =>
      matchesAttribute(card, candidate, source, pairedPilot),
    );
  }
  if (filter.attribute === "cardType") {
    return filter.comparison === "eq" ? card.type === filter.value : card.type !== filter.value;
  }
  if (filter.attribute === "trait") {
    const includes = card.traits.some(
      (trait) => trait.toLocaleLowerCase() === filter.value.toLocaleLowerCase(),
    );
    return filter.comparison === "includes" ? includes : !includes;
  }
  if (filter.attribute === "name") {
    const name = card.name.toLocaleLowerCase();
    const value = filter.value.toLocaleLowerCase();
    const matches =
      filter.comparison === "eq" || filter.comparison === "neq"
        ? name === value
        : name.includes(value);
    return filter.comparison === "neq" || filter.comparison === "excludes" ? !matches : matches;
  }
  if (filter.attribute === "color") {
    const matches = card.color === filter.value;
    return filter.comparison === "eq" ? matches : !matches;
  }
  if (filter.attribute === "zone") return true;
  if (filter.attribute === "keyword") {
    const includes = card.keywordEffects.some(({ keyword }) => keyword === filter.value);
    return filter.comparison === "includes" ? includes : !includes;
  }
  if (filter.attribute === "effectTiming") {
    const includes = (card.effects ?? []).some((effect) =>
      effect.activation.timing?.includes(filter.value),
    );
    return filter.comparison === "includes" ? includes : !includes;
  }
  if (filter.attribute === "paired") {
    return card.type === "unit" && Boolean(pairedPilot) === filter.value;
  }
  if (filter.attribute === "pairedPilotTrait") {
    const includes = Boolean(
      pairedPilot?.traits.some(
        (trait) => trait.toLocaleLowerCase() === filter.value.toLocaleLowerCase(),
      ),
    );
    return filter.comparison === "includes" ? includes : !includes;
  }
  if (filter.attribute === "pairedPilotColor") {
    const matches = pairedPilot?.color === filter.value;
    return filter.comparison === "eq" ? matches : !matches;
  }
  if (filter.attribute === "pairedPilotLevel") {
    const expected = referencedStat(filter.value, source);
    return expected !== undefined && pairedPilot
      ? compareNumber(pairedPilot.level, filter.comparison, expected)
      : false;
  }
  if (filter.attribute === "pairedUnitLevel") return card.type === "pilot";

  const expected = referencedStat(filter.value, source);
  if (expected === undefined) return false;
  const actual =
    filter.attribute === "level" || filter.attribute === "cost"
      ? card[filter.attribute]
      : card.type === "unit"
        ? card[filter.attribute]
        : filter.attribute === "hp" && card.type === "base"
          ? card.hp
          : undefined;
  return actual !== undefined && compareNumber(actual, filter.comparison, expected);
}

function cardMatchesFilter(
  card: Card,
  filter: TargetFilter,
  source: Card,
  pairedPilot?: Card,
): boolean {
  const cardTypes = Array.isArray(filter.cardType) ? filter.cardType : [filter.cardType];
  if (cardTypes[0] && !cardTypes.includes(card.type)) return false;
  if (
    filter.hasKeyword &&
    !card.keywordEffects.some(({ keyword }) => keyword === filter.hasKeyword)
  ) {
    return false;
  }
  if (
    filter.lacksKeyword &&
    card.keywordEffects.some(({ keyword }) => keyword === filter.lacksKeyword)
  ) {
    return false;
  }
  if (filter.hasAnyKeyword && card.keywordEffects.length === 0) return false;
  if (filter.isToken === true) return false;
  if (filter.isLinkUnit && (card.type !== "unit" || !pairedPilot)) return false;
  return (filter.attributeFilters ?? []).every((attribute) =>
    matchesAttribute(card, attribute, source, pairedPilot),
  );
}

function supportForFilter(
  filter: TargetFilter,
  source: Card,
): { readonly card: Card; readonly pilot?: Card } | undefined {
  const needsPilot =
    filter.isLinkUnit === true ||
    filter.attributeFilters?.some((attribute) =>
      attribute.attribute === "paired"
        ? attribute.value
        : ["pairedPilotTrait", "pairedPilotColor", "pairedPilotLevel"].includes(
            attribute.attribute,
          ),
    );
  const candidates = ALL_CARDS.toSorted((left, right) =>
    left.cardNumber.localeCompare(right.cardNumber),
  );

  for (const candidate of candidates) {
    if (filter.excludeSource && candidate.cardNumber === source.cardNumber) continue;
    if (!needsPilot) {
      if (cardMatchesFilter(candidate, filter, source)) return { card: candidate };
      continue;
    }
    if (candidate.type !== "unit") continue;
    for (const pilot of ALL_PAIRABLE_CARDS) {
      if (filter.isLinkUnit && !pilotSatisfiesUnitLinkCondition(pilot, candidate)) continue;
      if (cardMatchesFilter(candidate, filter, source, pilot)) return { card: candidate, pilot };
    }
  }
  return undefined;
}

function stateEntry(card: Card, filter: TargetFilter): PlannedCard {
  const states = Array.isArray(filter.state) ? filter.state : filter.state ? [filter.state] : [];
  return {
    card,
    exhausted: states.includes("rested"),
    damage: states.includes("damaged") ? 1 : 0,
  };
}

/**
 * Stage visible damage on recover targets so a recoverHP review can prove HP
 * restoration instead of silently recovering zero from an undamaged unit.
 */
function recoverableDamageFor(card: Card, amount: number): number {
  if (card.type !== "unit" && card.type !== "base") return Math.max(1, amount);
  return Math.min(Math.max(1, amount), Math.max(1, card.hp - 1));
}

function ensureRecoverableDamage(
  plan: ReviewFixturePlan,
  filter: TargetFilter,
  source: Card,
  controller: PlannedPlayerKey,
  amount: number,
): void {
  const player = playerForOwner(filter.owner, controller);
  for (const zone of Object.values(plan[player])) {
    for (let index = 0; index < zone.length; index++) {
      const entry = zone[index]!;
      const candidate = cardOf(entry);
      if (!cardMatchesFilter(candidate, filter, source)) continue;
      if (candidate.type !== "unit" && candidate.type !== "base") continue;
      const wanted = recoverableDamageFor(candidate, amount);
      const existing = "card" in entry ? (entry.damage ?? 0) : 0;
      if (existing >= wanted) continue;
      zone[index] = { ...("card" in entry ? entry : { card: entry }), damage: wanted };
    }
  }
}

function ensureTargetFilter(
  plan: ReviewFixturePlan,
  filter: TargetFilter,
  source: Card,
  controller: PlannedPlayerKey,
  timing: ReviewTiming,
  zoneOverride?: FixtureZone,
): void {
  if (filter.owner === "self") return;
  if (filter.isToken === true) return;

  const support = supportForFilter(filter, source);
  if (!support) {
    throw new Error(`${source.cardNumber}: no real card satisfies ${JSON.stringify(filter)}`);
  }
  const player = playerForOwner(filter.owner, controller);
  const zone = zoneOverride ?? fixtureZoneFor(filter, support.card);
  const wanted = filterMinimum(filter);
  const usedPairings = new Set<number>();
  const existing = plan[player][zone].filter((entry) => {
    const candidate = cardOf(entry);
    if (!support.pilot) return cardMatchesFilter(candidate, filter, source);
    const pairingIndex = plan.pairings.findIndex(
      (pairing, index) =>
        !usedPairings.has(index) &&
        pairing.player === player &&
        pairing.unit.cardNumber === candidate.cardNumber &&
        cardMatchesFilter(candidate, filter, source, pairing.pilot),
    );
    if (pairingIndex < 0) return false;
    usedPairings.add(pairingIndex);
    return true;
  }).length;

  for (let index = existing; index < wanted; index++) {
    plan[player][zone].push(stateEntry(support.card, filter));
    if (support.card.type === "unit" && support.pilot) {
      plan[player].battleArea.push(support.pilot);
      plan.pairings.push({ player, unit: support.card, pilot: support.pilot });
    }
  }

  if (timing === "action" && filter.isBattling) {
    if (support.card.type !== "unit") {
      throw new Error(`${source.cardNumber}: battling target must be a Unit`);
    }
    const opponentFilter =
      typeof filter.isBattling === "object" ? filter.isBattling.opponentMatches : undefined;
    const opponentSupport = opponentFilter ? supportForFilter(opponentFilter, source) : undefined;
    if (filter.owner === "opponent") {
      if (opponentSupport?.card.type === "unit") {
        plan.p1.battleArea.push({ card: opponentSupport.card, exhausted: true });
      }
      plan.actionBattle = {
        attacker: support.card,
        defender: opponentSupport?.card.type === "unit" ? opponentSupport.card : undefined,
      };
    }
  }
}

function countRequired(comparison: "eq" | "lt" | "lte" | "gt" | "gte", count: number): number {
  if (comparison === "gt") return count + 1;
  if (comparison === "gte" || comparison === "eq") return count;
  return 0;
}

function updateSourceEntry(
  plan: ReviewFixturePlan,
  source: Card,
  patch: Pick<DevCardEntry, "damage" | "exhausted">,
): void {
  for (const zone of Object.values(plan.p1)) {
    const index = zone.findIndex((entry) => cardOf(entry).cardNumber === source.cardNumber);
    if (index < 0) continue;
    const entry = zone[index]!;
    zone[index] = { ...("card" in entry ? entry : { card: entry }), ...patch };
    return;
  }
}

function movePlannedCard(
  player: PlannedPlayer,
  cardNumber: string,
  destination: FixtureZone,
): void {
  for (const zone of Object.values(player)) {
    const index = zone.findIndex((entry) => cardOf(entry).cardNumber === cardNumber);
    if (index < 0) continue;
    const [entry] = zone.splice(index, 1);
    if (entry) player[destination].push(entry);
    return;
  }
}

function pushUniqueCard(zone: PlannedCard[], card: Card): void {
  if (!zone.some((entry) => cardOf(entry).cardNumber === card.cardNumber)) zone.push(card);
}

function updatePlannedCard(
  player: PlannedPlayer,
  cardNumber: string,
  patch: Pick<DevCardEntry, "damage" | "exhausted">,
  preferredZone?: FixtureZone,
): void {
  const zones = preferredZone
    ? [
        player[preferredZone],
        ...Object.values(player).filter((zone) => zone !== player[preferredZone]),
      ]
    : Object.values(player);
  for (const zone of zones) {
    const index = zone.findIndex((entry) => cardOf(entry).cardNumber === cardNumber);
    if (index < 0) continue;
    const entry = zone[index]!;
    zone[index] = { ...("card" in entry ? entry : { card: entry }), ...patch };
    return;
  }
}

function qualifyingPilotForUnit(
  unit: UnitCard,
  source: Card,
  requireLink: boolean,
  qualification?: AttributeFilter,
): Card {
  const pilot = ALL_PAIRABLE_CARDS.find(
    (candidate) =>
      (!requireLink || pilotSatisfiesUnitLinkCondition(candidate, unit)) &&
      (!qualification || matchesAttribute(candidate, qualification, source)),
  );
  if (!pilot) {
    throw new Error(`${source.cardNumber}: no real Pilot satisfies the pair/link requirement`);
  }
  return pilot;
}

function ensureSourcePairing(
  plan: ReviewFixturePlan,
  source: Card,
  requireLink: boolean,
  qualification?: AttributeFilter,
): void {
  if (source.type === "unit") {
    const pilot = qualifyingPilotForUnit(source, source, requireLink, qualification);
    if (
      plan.pairings.some(
        (pairing) => pairing.player === "p1" && pairing.unit.cardNumber === source.cardNumber,
      )
    ) {
      return;
    }
    if (!plan.p1.battleArea.some((entry) => cardOf(entry).cardNumber === source.cardNumber)) {
      plan.p1.battleArea.push(source);
    }
    plan.p1.battleArea.push(pilot);
    plan.pairings.push({ player: "p1", unit: source, pilot });
    return;
  }
  if (source.type === "pilot") {
    if (
      plan.pairings.some(
        (pairing) => pairing.player === "p1" && pairing.pilot.cardNumber === source.cardNumber,
      )
    ) {
      return;
    }
    const host = hostForPilot(source, requireLink);
    if (!plan.p1.battleArea.some((entry) => cardOf(entry).cardNumber === source.cardNumber)) {
      plan.p1.battleArea.push(source);
    }
    plan.p1.battleArea.push(host);
    plan.pairings.push({ player: "p1", unit: host, pilot: source });
  }
}

function ensurePilotLinkedToTrait(
  plan: ReviewFixturePlan,
  pilot: Extract<Card, { type: "pilot" }>,
  traits: string | readonly string[],
): void {
  const wantedTraits = (Array.isArray(traits) ? traits : [traits]).map((trait) =>
    trait.toLocaleLowerCase(),
  );
  const host = ALL_UNITS.find(
    (unit) =>
      pilotSatisfiesUnitLinkCondition(pilot, unit) &&
      unit.traits.some((trait) => wantedTraits.includes(trait.toLocaleLowerCase())),
  );
  if (!host) {
    throw new Error(`${pilot.cardNumber}: no real linked Unit satisfies ${wantedTraits.join("/")}`);
  }
  if (!plan.p1.battleArea.some((entry) => cardOf(entry).cardNumber === pilot.cardNumber)) {
    plan.p1.battleArea.push(pilot);
  }
  if (!plan.p1.battleArea.some((entry) => cardOf(entry).cardNumber === host.cardNumber)) {
    plan.p1.battleArea.push(host);
  }
  if (
    !plan.pairings.some(
      (pairing) => pairing.player === "p1" && pairing.pilot.cardNumber === pilot.cardNumber,
    )
  ) {
    plan.pairings.push({ player: "p1", unit: host, pilot });
  }
}

function ensureCondition(
  plan: ReviewFixturePlan,
  condition: EffectCondition,
  source: Card,
  controller: PlannedPlayerKey,
  timing: ReviewTiming,
): void {
  if (condition.type === "and") {
    condition.conditions.forEach((candidate) =>
      ensureCondition(plan, candidate, source, controller, timing),
    );
    return;
  }
  if (condition.type === "or") {
    const first = condition.conditions[0];
    if (first) ensureCondition(plan, first, source, controller, timing);
    return;
  }
  if (condition.type === "cardInZone") {
    const count = countRequired(condition.comparison, condition.count);
    if (count === 0) return;
    ensureTargetFilter(
      plan,
      {
        owner: condition.owner,
        zone: condition.zone,
        cardType: condition.cardType,
        count,
        attributeFilters: [
          ...(condition.hasTrait
            ? [
                {
                  attribute: "or" as const,
                  filters: (Array.isArray(condition.hasTrait)
                    ? condition.hasTrait
                    : [condition.hasTrait]
                  ).map((trait) => ({
                    attribute: "trait" as const,
                    comparison: "includes" as const,
                    value: trait,
                  })),
                },
              ]
            : []),
          ...(condition.hasColor
            ? [
                {
                  attribute: "color" as const,
                  comparison: "eq" as const,
                  value: condition.hasColor,
                },
              ]
            : []),
          ...(condition.hasName
            ? [
                {
                  attribute: "name" as const,
                  comparison: "includes" as const,
                  value: condition.hasName,
                },
              ]
            : []),
          ...(condition.attributeFilters ?? []),
        ],
      },
      source,
      controller,
      timing,
    );
    return;
  }
  if (condition.type === "unitCount") {
    const count = countRequired(condition.comparison, condition.count);
    if (count === 0) return;
    ensureTargetFilter(
      plan,
      {
        owner: condition.owner,
        cardType: "unit",
        count,
        state: condition.state,
        hasKeyword: condition.hasKeyword,
        isToken: condition.isToken,
        isLinkUnit: condition.isLinkUnit,
        excludeSource: condition.excludeSelf,
        attributeFilters: [
          ...(condition.hasTrait
            ? [
                {
                  attribute: "or" as const,
                  filters: (Array.isArray(condition.hasTrait)
                    ? condition.hasTrait
                    : [condition.hasTrait]
                  ).map((trait) => ({
                    attribute: "trait" as const,
                    comparison: "includes" as const,
                    value: trait,
                  })),
                },
              ]
            : []),
          ...(condition.attributeFilters ?? []),
        ],
      },
      source,
      controller,
      timing,
    );
    return;
  }
  if (condition.type === "handCount") {
    const count = countRequired(condition.comparison, condition.count);
    const player = playerForOwner(condition.owner, controller);
    while (plan[player].hand.length < count) plan[player].hand.push(st01Guntank004);
    return;
  }
  if (condition.type === "deployedThisTurnCount") {
    const count = countRequired(condition.comparison, condition.count);
    if (count === 0) return;
    const filter: TargetFilter = {
      owner: condition.owner,
      cardType: condition.cardType,
      count,
      attributeFilters: [
        ...(condition.hasTrait
          ? [
              {
                attribute: "or" as const,
                filters: (Array.isArray(condition.hasTrait)
                  ? condition.hasTrait
                  : [condition.hasTrait]
                ).map((trait) => ({
                  attribute: "trait" as const,
                  comparison: "includes" as const,
                  value: trait,
                })),
              },
            ]
          : []),
        ...(condition.attributeFilters ?? []),
      ],
    };
    ensureTargetFilter(plan, filter, source, controller, timing);
    const player = playerForOwner(condition.owner, controller);
    const deployedCards = [...plan[player].battleArea, ...plan[player].baseSection]
      .map(cardOf)
      .filter((candidate) => cardMatchesFilter(candidate, filter, source))
      .slice(0, count);
    plan.deployedThisTurn.push(
      ...deployedCards.map((deployedCard) => ({ player, card: deployedCard })),
    );
    return;
  }
  if (condition.type === "deployedFromZone" && condition.zone === "trash") {
    const enabler = ALL_CARDS.find((candidate) => candidate.cardNumber === "GD02-110");
    if (!enabler) throw new Error(`${source.cardNumber}: missing trash-deploy enabler GD02-110`);
    movePlannedCard(plan[controller], source.cardNumber, "trash");
    pushUniqueCard(plan[controller].hand, enabler);
    return;
  }
  if (condition.type === "duringPair") {
    ensureSourcePairing(plan, source, false);
    return;
  }
  if (condition.type === "duringLink") {
    ensureSourcePairing(plan, source, true);
    return;
  }
  if (condition.type === "linkedUnitHasTrait" && source.type === "pilot") {
    ensurePilotLinkedToTrait(plan, source, condition.trait);
    return;
  }
  if (condition.type === "linkedUnitHasColor" && source.type === "pilot") {
    ensureSourcePairing(plan, source, true);
    return;
  }
  if (
    condition.type === "selfPairedPilotHasTrait" ||
    condition.type === "selfPairedPilotHasColor"
  ) {
    ensureSourcePairing(plan, source, false);
    return;
  }
  if (condition.type === "selfIsDamaged" || condition.type === "selfIsRested") {
    updateSourceEntry(
      plan,
      source,
      condition.type === "selfIsDamaged" ? { damage: 1 } : { exhausted: true },
    );
    return;
  }
  if (condition.type === "isTurn") {
    const friendly = controller === "p1" ? DEV_PLAYER_ONE : DEV_PLAYER_TWO;
    const opponent = friendly === DEV_PLAYER_ONE ? DEV_PLAYER_TWO : DEV_PLAYER_ONE;
    plan.activePlayer = condition.whose === "friendly" ? friendly : opponent;
    return;
  }
  if (condition.type === "friendlyBaseInPlay") {
    const base = ALL_CARDS.find(
      (candidate) =>
        candidate.type === "base" &&
        (!condition.color || candidate.color === condition.color) &&
        (!condition.hasTrait ||
          candidate.traits.some(
            (trait) => trait.toLocaleLowerCase() === condition.hasTrait?.toLocaleLowerCase(),
          )),
    );
    if (base) plan[controller].baseSection = [base];
    return;
  }
  if (
    condition.type === "eventCardMatches" ||
    condition.type === "eventSourceMatches" ||
    condition.type === "eventDefeatedCardMatches"
  ) {
    ensureTargetFilter(plan, condition.target, source, controller, timing);
    return;
  }
  if (condition.type === "opponentDiscardedByYourEffectThisTurn") {
    if (controller === "p1") plan.opponentDiscardedByP1 = true;
    return;
  }
  if (condition.type === "activatedCommandThisTurn") {
    const support = supportForFilter(condition.target, source);
    if (support) {
      const player = playerForOwner(condition.owner, controller);
      plan[player].trash.push(support.card);
      plan.activatedCommands.push({ player, card: support.card });
    }
    return;
  }
  if (condition.type === "friendlyUnitDestroyedByFriendlyTraitThisTurn") {
    plan.friendlyDestroyedTraits.add(condition.trait);
  }
}

function isTargetFilter(value: unknown): value is TargetFilter {
  return Boolean(value && typeof value === "object" && "owner" in value);
}

function ensureAction(
  plan: ReviewFixturePlan,
  action: Record<string, unknown>,
  source: Card,
  controller: PlannedPlayerKey,
  timing: ReviewTiming,
): void {
  const actionName = action.action;
  for (const [key, value] of Object.entries(action)) {
    if (!isTargetFilter(value)) continue;
    const zoneOverride =
      key === "tutorFilter" ||
      (key === "target" &&
        (actionName === "millDeckThenAddToHand" ||
          actionName === "millDeckThenDamageIfTrait" ||
          actionName === "millDeckThenDamageByTraitCount"))
        ? "deck"
        : key === "discardTarget"
          ? "hand"
          : undefined;
    ensureTargetFilter(plan, value, source, controller, timing, zoneOverride);
  }

  // recoverHP is legal against undamaged Units, but a review fixture must
  // start those targets damaged so the HP restore is visible after resolution.
  if (actionName === "recoverHP" && isTargetFilter(action.target)) {
    ensureRecoverableDamage(
      plan,
      action.target,
      source,
      controller,
      Math.max(1, Number(action.amount ?? 1)),
    );
  }

  // lookAtTopDeck reads from the ordered top of the deck (array end). Tutor
  // filters only stage matching cards somewhere in the deck; without pinning
  // them to the top, later padding buries them under generic fillers and the
  // revealed window has zero legal choices (e.g. GD05-019 Londo Bell tutor).
  if (actionName === "lookAtTopDeck") {
    plan.deckTopRequirements.push({
      player: controller,
      lookCount: Math.max(1, Number(action.count ?? 1)),
      tutorFilter: isTargetFilter(action.tutorFilter) ? action.tutorFilter : undefined,
      source,
    });
  }
  if (
    actionName === "millDeckThenAddToHand" ||
    actionName === "millDeckThenDamageIfTrait" ||
    actionName === "millDeckThenDamageByTraitCount"
  ) {
    const millCount = Math.max(1, Number(action.count ?? action.millCount ?? 1));
    plan.deckTopRequirements.push({
      player: controller,
      lookCount: millCount,
      tutorFilter: isTargetFilter(action.target) ? action.target : undefined,
      source,
    });
  }

  if (actionName === "draw" || actionName === "drawThenDiscard") {
    const drawCount =
      actionName === "draw" ? Number(action.count ?? 1) : Number(action.drawCount ?? 1);
    while (plan[controller].deck.length < drawCount) plan[controller].deck.push(st01Guntank004);
  }
  if (actionName === "drawThenDiscard") {
    const discardCount = Number(action.discardCount ?? 1);
    while (plan[controller].hand.length < discardCount) {
      plan[controller].hand.push(st01Guncannon003);
    }
  }
  if (actionName === "discard") {
    const discardCount = Number(action.count ?? 1);
    const sourceInHand = plan[controller].hand.some(
      (entry) => cardOf(entry).cardNumber === source.cardNumber,
    )
      ? 1
      : 0;
    // A Command in hand pays its own play cost before its effect resolves,
    // so it cannot be the card staged for a subsequent discard choice.
    while (plan[controller].hand.length - sourceInHand < discardCount) {
      plan[controller].hand.push(st01Guncannon003);
    }
  }
  if (actionName === "activatePairedCardTiming") {
    ensureSourcePairing(plan, source, true);
  }
  if (actionName === "resolveThenQueue") {
    if (action.first && typeof action.first === "object") {
      ensureAction(plan, action.first as Record<string, unknown>, source, controller, timing);
    }
    if (action.followUp && typeof action.followUp === "object") {
      ensureEffect(plan, action.followUp as CardEffect, source, controller, timing);
    }
  }
  if (
    actionName === "queueEffectForOpponent" &&
    action.effect &&
    typeof action.effect === "object"
  ) {
    ensureEffect(
      plan,
      action.effect as CardEffect,
      source,
      controller === "p1" ? "p2" : "p1",
      timing,
    );
  }
  if (
    actionName === "queueEffectForPlayers" &&
    action.effect &&
    typeof action.effect === "object"
  ) {
    ensureEffect(plan, action.effect as CardEffect, source, "p1", timing);
    ensureEffect(plan, action.effect as CardEffect, source, "p2", timing);
  }
  if (actionName === "createDelayedTrigger" && action.effect && typeof action.effect === "object") {
    ensureEffect(plan, action.effect as CardEffect, source, controller, timing);
  }
}

function ensureDirective(
  plan: ReviewFixturePlan,
  directive: Directive,
  source: Card,
  controller: PlannedPlayerKey,
  timing: ReviewTiming,
): void {
  if ("action" in directive) {
    ensureAction(
      plan,
      directive.action as unknown as Record<string, unknown>,
      source,
      controller,
      timing,
    );
    return;
  }
  if ("condition" in directive) {
    ensureCondition(plan, directive.condition, source, controller, timing);
    directive.thenDirectives.forEach((candidate) =>
      ensureDirective(plan, candidate, source, controller, timing),
    );
    directive.elseDirectives?.forEach((candidate) =>
      ensureDirective(plan, candidate, source, controller, timing),
    );
    return;
  }
  for (const option of directive.options) {
    option.directives.forEach((candidate) =>
      ensureDirective(plan, candidate, source, controller, timing),
    );
  }
}

function ensureEffect(
  plan: ReviewFixturePlan,
  effect: CardEffect,
  source: Card,
  controller: PlannedPlayerKey,
  timing: ReviewTiming,
): void {
  effect.activation.conditions?.forEach((condition) =>
    ensureCondition(plan, condition, source, controller, timing),
  );
  if (effect.cost?.discardCount) {
    const filter: TargetFilter = effect.cost.discardFilter ?? {
      owner: "friendly",
      zone: "hand",
      count: effect.cost.discardCount,
    };
    ensureTargetFilter(
      plan,
      { ...filter, count: effect.cost.discardCount },
      source,
      controller,
      timing,
      "hand",
    );
  }
  if (effect.cost?.restFriendlyUnits) {
    ensureTargetFilter(
      plan,
      {
        owner: "friendly",
        cardType: "unit",
        count: effect.cost.restFriendlyUnits,
        state: "active",
      },
      source,
      controller,
      timing,
    );
  }
  if (effect.cost?.restTarget) {
    ensureTargetFilter(plan, effect.cost.restTarget, source, controller, timing);
  }
  if (effect.cost?.exileFromTrash) {
    ensureTargetFilter(plan, effect.cost.exileFromTrash, source, controller, timing, "trash");
  }
  effect.directives.forEach((directive) =>
    ensureDirective(plan, directive, source, controller, timing),
  );
}

function effectsForTiming(card: Card, timing: ReviewTiming): readonly CardEffect[] {
  const matching = (card.effects ?? []).filter((effect) => hasTiming([effect], timing));
  if (matching.length > 0) return matching;
  if (timing === "board") {
    return (card.effects ?? []).filter((effect) => (effect.activation.timing?.length ?? 0) === 0);
  }
  return [];
}

/** Rule 4-4-2: Resource Area hard cap used by canPlaceResource. */
const MAX_RESOURCE_AREA_TOTAL = 15;

/**
 * Count Resource Area placements from the reviewed effect tree so the fixture
 * leaves headroom under the 15-card cap. Paying a Unit/Base cost rests
 * resources in place — it does not free slots — so a full 15-card start
 * silently blocks placeExResource / placeResource (e.g. GD05-018 Place 3 EX).
 */
function resourcePlacementHeadroom(effects: readonly CardEffect[]): number {
  let total = 0;

  const walkAction = (action: Record<string, unknown>): void => {
    if (action.action === "placeExResource") {
      total += Math.max(1, Number(action.count ?? 1));
    } else if (action.action === "placeResource") {
      total += 1;
    }
    if (action.first && typeof action.first === "object") {
      walkAction(action.first as Record<string, unknown>);
    }
    if (action.followUp && typeof action.followUp === "object") {
      walkEffect(action.followUp as CardEffect);
    }
    if (action.effect && typeof action.effect === "object") {
      walkEffect(action.effect as CardEffect);
    }
  };

  const walkDirective = (directive: Directive): void => {
    if ("action" in directive) {
      walkAction(directive.action as unknown as Record<string, unknown>);
      return;
    }
    if ("condition" in directive) {
      directive.thenDirectives.forEach(walkDirective);
      directive.elseDirectives?.forEach(walkDirective);
      return;
    }
    for (const option of directive.options) option.directives.forEach(walkDirective);
  };

  const walkEffect = (effect: CardEffect): void => {
    effect.directives.forEach(walkDirective);
  };

  effects.forEach(walkEffect);
  return total;
}

function reviewResourceCount(card: Card, effects: readonly CardEffect[]): number {
  const headroom = resourcePlacementHeadroom(effects);
  const minForPlay = Math.max(
    "level" in card && typeof card.level === "number" ? card.level : 0,
    "cost" in card && typeof card.cost === "number" ? card.cost : 0,
    1,
  );
  const maxWithHeadroom = Math.max(0, MAX_RESOURCE_AREA_TOTAL - headroom);
  // Prefer near-full resources for review, but never stage past the headroom
  // required for the printed place-resource effect to resolve fully.
  return Math.max(minForPlay, Math.min(MAX_RESOURCE_AREA_TOTAL, maxWithHeadroom));
}

/**
 * Ordered decks store the top card at the array end. After generic padding,
 * move tutor/mill matches back onto that top so lookAtTopDeck / mill windows
 * contain at least one legal card.
 */
function applyDeckTopRequirements(plan: ReviewFixturePlan): void {
  for (const requirement of plan.deckTopRequirements) {
    const deck = plan[requirement.player].deck;
    const wantedMatches = requirement.tutorFilter ? filterMinimum(requirement.tutorFilter) : 0;

    const matches: PlannedCard[] = [];
    if (requirement.tutorFilter) {
      for (let index = deck.length - 1; index >= 0; index--) {
        const entry = deck[index]!;
        if (!cardMatchesFilter(cardOf(entry), requirement.tutorFilter, requirement.source)) {
          continue;
        }
        matches.unshift(deck.splice(index, 1)[0]!);
        if (matches.length >= wantedMatches) break;
      }
      while (matches.length < wantedMatches) {
        const support = supportForFilter(requirement.tutorFilter, requirement.source);
        if (!support) {
          throw new Error(
            `${requirement.source.cardNumber}: no real card satisfies deck-top tutor filter`,
          );
        }
        matches.push(support.card);
      }
    }

    // Keep enough non-matching cards under the top window so the review still
    // demonstrates "look at N" rather than only a single legal reveal.
    const nonMatchSlots = Math.max(0, requirement.lookCount - matches.length);
    while (deck.length < nonMatchSlots) {
      deck.unshift(st01Guntank004);
    }

    // Top of deck = array end. Place matches last so they appear in the look
    // window; leave prior deck cards as the rest of the top-N when needed.
    deck.push(...matches);
  }
}

function selfZoneFromDirective(directive: Directive): FixtureZone | undefined {
  if ("action" in directive) {
    for (const value of Object.values(directive.action)) {
      if (
        isTargetFilter(value) &&
        value.owner === "self" &&
        value.zone &&
        value.zone !== "resourceDeck" &&
        value.zone !== "removalArea"
      ) {
        return value.zone;
      }
    }
    return undefined;
  }
  if ("condition" in directive) {
    for (const candidate of [...directive.thenDirectives, ...(directive.elseDirectives ?? [])]) {
      const zone = selfZoneFromDirective(candidate);
      if (zone) return zone;
    }
    return undefined;
  }
  for (const option of directive.options) {
    for (const candidate of option.directives) {
      const zone = selfZoneFromDirective(candidate);
      if (zone) return zone;
    }
  }
  return undefined;
}

function sourceStartsInBattle(card: Card, timing: ReviewTiming): boolean {
  if (card.type === "unit") {
    return (
      timing !== "deploy" &&
      timing !== "burst" &&
      timing !== "when-paired" &&
      timing !== "when-linked"
    );
  }
  if (card.type === "pilot") {
    return timing !== "when-paired" && timing !== "when-linked" && timing !== "burst";
  }
  return false;
}

function buildReviewFixturePlan(card: Card, timing: ReviewTiming): ReviewFixturePlan {
  const plan: ReviewFixturePlan = {
    p1: emptyPlannedPlayer(),
    p2: emptyPlannedPlayer(),
    pairings: [],
    activatedCommands: [],
    deployedThisTurn: [],
    friendlyDestroyedTraits: new Set(),
    deckTopRequirements: [],
    activePlayer:
      timing === "burst" || timing === "block" || timing === "action"
        ? DEV_PLAYER_TWO
        : DEV_PLAYER_ONE,
    opponentDiscardedByP1: false,
  };

  if (timing === "burst") {
    plan.p1.shieldArea.push(card);
  } else if (card.type === "base" && timing !== "deploy") {
    plan.p1.baseSection.push(card);
  } else if (sourceStartsInBattle(card, timing)) {
    plan.p1.battleArea.push({ card, damage: timing === "repair" ? 1 : 0 });
  } else {
    plan.p1.hand.push(card);
  }

  const relevantEffects = effectsForTiming(card, timing);
  relevantEffects.forEach((effect) => ensureEffect(plan, effect, card, "p1", timing));
  if (timing === "board") {
    const selfZone = relevantEffects
      .flatMap((effect) => effect.directives)
      .map(selfZoneFromDirective)
      .find((zone) => zone !== undefined);
    if (selfZone) {
      const needsBattleCopy = plan.pairings.some(
        (pairing) => pairing.player === "p1" && pairing.unit.cardNumber === card.cardNumber,
      );
      if (
        needsBattleCopy &&
        !plan.p1[selfZone].some((entry) => cardOf(entry).cardNumber === card.cardNumber)
      ) {
        plan.p1[selfZone].push(card);
      } else if (!needsBattleCopy) {
        movePlannedCard(plan.p1, card.cardNumber, selfZone);
      }
    }
  }

  if ((timing === "when-paired" || timing === "when-linked") && card.type === "unit") {
    const qualification = relevantEffects.find((effect) => effect.activation.qualification)
      ?.activation.qualification;
    plan.p1.battleArea.push(card);
    plan.p1.hand = plan.p1.hand.filter((entry) => cardOf(entry).cardNumber !== card.cardNumber);
    pushUniqueCard(
      plan.p1.hand,
      qualifyingPilotForUnit(card, card, timing === "when-linked", qualification),
    );
  }
  if (card.type === "unit" && sourceStartsInBattle(card, timing)) {
    for (const pilot of ALL_PAIRABLE_CARDS.filter((candidate) =>
      pilotSatisfiesUnitLinkCondition(candidate, card),
    )) {
      pushUniqueCard(plan.p1.hand, pilot);
    }
  }
  if (
    (timing === "when-paired" || timing === "when-linked") &&
    (card.type === "pilot" || (card.type === "command" && Boolean(card.pilotName)))
  ) {
    plan.p1.battleArea.push(hostForPilot(card, timing === "when-linked"));
  }
  if (card.type === "pilot" && sourceStartsInBattle(card, timing)) {
    ensureSourcePairing(plan, card, true);
  }
  if (card.type === "base" && timing === "when-linked") {
    const eventFilter = relevantEffects
      .flatMap((effect) => effect.activation.conditions ?? [])
      .find((condition) => condition.type === "eventCardMatches");
    const hostSupport =
      eventFilter?.type === "eventCardMatches"
        ? supportForFilter(eventFilter.target, card)
        : undefined;
    const host = hostSupport?.card.type === "unit" ? hostSupport.card : linkedUnitForBase(card);
    const pilot = qualifyingPilotForUnit(host, card, true);
    plan.p1.battleArea.push(host);
    plan.p1.hand.push(pilot);
  }

  if (timing === "destroyed" && card.type === "base") {
    const baseDestroyEnabler = ALL_CARDS.find((candidate) => candidate.cardNumber === "GD04-043");
    if (!baseDestroyEnabler) {
      throw new Error(`${card.cardNumber}: missing real Base-damage enabler GD04-043`);
    }
    updatePlannedCard(
      plan.p1,
      card.cardNumber,
      {
        damage: Math.max(0, card.hp - 1),
      },
      "baseSection",
    );
    pushUniqueCard(plan.p2.hand, baseDestroyEnabler);
    plan.activePlayer = DEV_PLAYER_TWO;
  } else if (timing === "destroyed") {
    const destroyTarget = ALL_UNITS.toSorted((left, right) => right.ap - left.ap)[0]!;
    const destroyedUnit =
      card.type === "unit"
        ? card
        : plan.pairings.find(
            (pairing) => pairing.player === "p1" && pairing.pilot.cardNumber === card.cardNumber,
          )?.unit;
    if (destroyedUnit) {
      updatePlannedCard(
        plan.p1,
        destroyedUnit.cardNumber,
        {
          damage: Math.max(0, destroyedUnit.hp - Math.max(1, destroyTarget.ap)),
        },
        "battleArea",
      );
    }
    plan.p2.battleArea.push({ card: destroyTarget, exhausted: true });
  } else if (timing === "attack" || timing === "battle") {
    plan.p2.battleArea.push({ card: st01Gundam001, exhausted: true });
  }

  if (card.cardNumber === "GD05-128" && timing === "main") {
    const risingGundam = gundamCards.gd05RisingGundam072;
    pushUniqueCard(plan.p1.battleArea, risingGundam);
    for (const pilot of ALL_PAIRABLE_CARDS) {
      if (pilot.type === "pilot" && pilotSatisfiesUnitLinkCondition(pilot, risingGundam)) {
        pushUniqueCard(plan.p1.hand, pilot);
      }
    }
  }

  if (card.cardNumber === "GD05-129" && timing === "main") {
    // Sazabi supplies Axis's printed effect-destruction condition during the
    // review instead of relying on synthetic turn history.
    plan.p1.hand = [gundamCards.gd05Sazabi052, gundamCards.gd05GearaDoga061];
    plan.p1.battleArea.push(st01Guncannon003);
    plan.p1.deck = [
      gundamCards.gd05HobbyHizack062,
      st01Gundam001,
      st01Guntank004,
      st01Guncannon003,
      gundamCards.gd05HobbyHizack062,
    ];
    plan.p1.trash = [];
    plan.friendlyDestroyedTraits.clear();
  }

  if (card.cardNumber === "GD05-130" && timing === "destroyed") {
    // Keep a nonmatching Base beside the valid copy so the Destroyed prompt
    // demonstrates the printed Presidential Office name filter.
    pushUniqueCard(plan.p1.hand, st01WhiteBase015);
  }

  if (card.cardNumber === "GD05-079" && timing === "main") {
    const support = ALL_UNITS.find(
      (unit) =>
        unit.cardNumber !== card.cardNumber &&
        unit.traits.some((trait) => ["g team", "preventer"].includes(trait.toLocaleLowerCase())),
    );
    const target = ALL_UNITS.find((unit) => unit.level <= 4);
    if (!support || !target) throw new Error("GD05-079: missing Heavyarms review support cards");
    pushUniqueCard(plan.p1.battleArea, support);
    pushUniqueCard(plan.p2.battleArea, target);
  }

  if (card.cardNumber === "GD05-123" && timing === "deploy") {
    const orbUnit = ALL_UNITS.find((unit) =>
      unit.traits.some((trait) => trait.toLocaleLowerCase() === "orb"),
    );
    if (!orbUnit) throw new Error("GD05-123: missing Orb Unit for Archangel review");
    pushUniqueCard(plan.p1.battleArea, orbUnit);
    pushUniqueCard(plan.p2.hand, gundamCards.gd05DarknessFinger110);
  }

  if (card.cardNumber === "GD05-124" && timing === "deploy") {
    // White Ark replaces the rest cost of a friendly League Militaire
    // Unit's effect. V-Dash supplies that effect, Gun EZ is its separate
    // rest-cost target, and the staged enemy is a legal V-Dash target.
    plan.p1.battleArea.push(gundamCards.gd04VDashGundam006, gundamCards.gd04GunEz015);
    plan.p2.battleArea.push(st01Gundam001);
  }

  if (timing === "action" || timing === "burst" || timing === "block") {
    if (!plan.actionBattle) plan.actionBattle = { attacker: st01Gundam001 };
    if (
      !plan.p2.battleArea.some(
        (entry) => cardOf(entry).cardNumber === plan.actionBattle?.attacker.cardNumber,
      )
    ) {
      plan.p2.battleArea.push(plan.actionBattle.attacker);
    }
  }

  // A Burst can be revealed during either player's turn even when neither
  // player has deployed a Base. Keep that board state minimal so its review
  // lab proves the timing rather than depending on an unrelated Base.
  if (timing !== "burst") {
    // A Base deployment into an occupied Base section must first resolve
    // rule 11-5-2's excess-Base choice. That obscures the printed Deploy
    // effect and, for “add a Shield to hand”, makes the Shield selector
    // appear unavailable until the unrelated Base is discarded. Keep the
    // acting player's Base section empty so each deploy review begins at
    // the card's actual first decision.
    if (plan.p1.baseSection.length === 0 && !(timing === "deploy" && card.type === "base")) {
      plan.p1.baseSection.push(st01WhiteBase015);
    }
    if (plan.p2.baseSection.length === 0) plan.p2.baseSection.push(st01WhiteBase015);
  }
  for (const player of [plan.p1, plan.p2]) {
    while (player.deck.length < 10) {
      player.deck.push([st01Gundam001, st01Guncannon003, st01Guntank004][player.deck.length % 3]!);
    }
  }
  // After padding, re-pin lookAtTopDeck / mill matches onto the ordered top
  // (array end). Padding uses push, which would otherwise bury those cards.
  applyDeckTopRequirements(plan);
  if (plan.p1.shieldArea.length === 0) plan.p1.shieldArea.push(...realShieldCards(3));
  if (plan.p2.shieldArea.length === 0) plan.p2.shieldArea.push(...realShieldCards(4));
  plan.p1.resourceArea.push(...realResourceCards(reviewResourceCount(card, relevantEffects)));
  plan.p2.resourceArea.push(...realResourceCards(8));

  return plan;
}

function asDevPlayerFixture(player: PlannedPlayer): DevPlayerFixture {
  return {
    ...player,
    resourceDeck: 10,
  };
}

function findInstance(
  dev: DevRuntime,
  playerId: typeof DEV_PLAYER_ONE | typeof DEV_PLAYER_TWO,
  zone: FixtureZone,
  cardNumber: string,
  excluded = new Set<string>(),
): string | undefined {
  const state = dev.runtime.getState();
  const instanceIds = state.ctx.zones.private.zoneCards[`${zone}:${playerId}`] ?? [];
  return instanceIds.find((instanceId) => {
    if (excluded.has(instanceId)) return false;
    const definitionId = dev.staticResources.cardsMaps.instances.get(instanceId)?.definitionId;
    return (
      definitionId !== undefined &&
      dev.staticResources.cardsMaps.definitions.get(definitionId)?.cardNumber === cardNumber
    );
  });
}

function applyPlannedRuntimeState(dev: DevRuntime, plan: ReviewFixturePlan): void {
  const state = dev.runtime.getState();
  const usedUnits = new Set<string>();
  const usedPilots = new Set<string>();

  for (const pairing of plan.pairings) {
    const playerId = pairing.player === "p1" ? DEV_PLAYER_ONE : DEV_PLAYER_TWO;
    const unitId = findInstance(dev, playerId, "battleArea", pairing.unit.cardNumber, usedUnits);
    const pilotId = findInstance(dev, playerId, "battleArea", pairing.pilot.cardNumber, usedPilots);
    if (!unitId || !pilotId) {
      throw new Error(
        `${pairing.unit.cardNumber}: could not stage ${pairing.pilot.cardNumber} pairing`,
      );
    }
    usedUnits.add(unitId);
    usedPilots.add(pilotId);
    state.G.pilotAssignments[unitId] = pilotId;
  }

  for (const { player, card: command } of plan.activatedCommands) {
    const playerId = player === "p1" ? DEV_PLAYER_ONE : DEV_PLAYER_TWO;
    const instanceId = findInstance(dev, playerId, "trash", command.cardNumber);
    if (instanceId) state.G.turnMetadata.activatedCommandThisTurn.push(instanceId);
  }
  for (const { player, card: deployed } of plan.deployedThisTurn) {
    const playerId = player === "p1" ? DEV_PLAYER_ONE : DEV_PLAYER_TWO;
    const instanceId =
      findInstance(dev, playerId, "battleArea", deployed.cardNumber) ??
      findInstance(dev, playerId, "baseSection", deployed.cardNumber);
    if (instanceId) state.G.turnMetadata.deployedThisTurn.push(instanceId);
  }
  if (plan.opponentDiscardedByP1) {
    state.G.turnMetadata.opponentDiscardEffectOriginPlayerIds = [DEV_PLAYER_ONE];
  }
  if (plan.friendlyDestroyedTraits.size > 0) {
    state.G.turnMetadata.friendlyUnitDestroyedByFriendlyCardTraits = {
      ...state.G.turnMetadata.friendlyUnitDestroyedByFriendlyCardTraits,
      [DEV_PLAYER_ONE]: [...plan.friendlyDestroyedTraits],
    };
  }
}

/**
 * Produces one exact-card review route per printed timing. The card is never
 * substituted: its own definition is in the decisive zone (Hand, Battle Area,
 * Base section, or Shield Area). Supporting cards are selected from real
 * definitions to satisfy Pilot names/traits where the card data exposes them.
 */
export function loadReleaseCardReviewLab(cardNumber: string, timing: ReviewTiming): DevRuntime {
  const { card } = getReleaseReviewEntry(cardNumber);
  const plan = buildReviewFixturePlan(card, timing);
  const dev = createDevRuntime({
    skipToMainPhase: true,
    initialActivePlayer: plan.activePlayer,
    seed: `${cardNumber}-${timing}-release-review`,
    clockReserveMs: 60 * 60 * 1_000,
    p1: asDevPlayerFixture(plan.p1),
    p2: asDevPlayerFixture(plan.p2),
  });
  applyPlannedRuntimeState(dev, plan);

  if (timing === "deploy" && card.type !== "unit" && card.type !== "base") {
    throw new Error(`${cardNumber}: deploy review requires a Unit or Base`);
  }

  if (timing === "burst" || timing === "block" || timing === "action") {
    const state = dev.runtime.getState();
    const attackerId = plan.actionBattle
      ? findInstance(dev, DEV_PLAYER_TWO, "battleArea", plan.actionBattle.attacker.cardNumber)
      : undefined;
    if (!attackerId) throw new Error(`${cardNumber}: action review requires an opponent attacker`);
    const defenderId = plan.actionBattle?.defender
      ? findInstance(dev, DEV_PLAYER_ONE, "battleArea", plan.actionBattle.defender.cardNumber)
      : undefined;
    const entered = dev.runtime.executeCommand(
      {
        commandID: crypto.randomUUID(),
        move: "enterBattle",
        prevStateID: state.ctx._stateID,
        actorRole: "player",
        args: { attackerId, target: defenderId ?? "direct" },
      },
      asPlayerId(DEV_PLAYER_TWO) as PlayerId,
    );
    if (!entered.success)
      throw new Error(`${cardNumber}: could not enter review battle (${entered.error})`);
    attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  }

  // The card data itself identifies the review capability. This explicit
  // read keeps the fixture honest when a future data migration removes an
  // effect while leaving an old catalog route behind.
  if (
    !hasTiming(card.effects ?? [], timing) &&
    timing !== "repair" &&
    timing !== "block" &&
    timing !== "board"
  ) {
    throw new Error(`${cardNumber}: missing ${timing} effect data`);
  }

  return dev;
}

function hasTiming(effects: readonly CardEffect[], timing: ReviewTiming): boolean {
  const needles: readonly string[] =
    timing === "when-paired"
      ? ["whenPaired"]
      : timing === "when-linked"
        ? ["whenLinked"]
        : timing === "main"
          ? ["main", "activate:main"]
          : timing === "action"
            ? ["action", "activate:action"]
            : timing === "destroyed"
              ? ["destroyed", "onDestroyByBattle"]
              : timing === "battle"
                ? [
                    "onBattleDamageDealtToUnit",
                    "onBattleDamageReceived",
                    "onShieldAreaCardDestroyByBattle",
                  ]
                : [timing];
  return effects.some((effect) =>
    effect.activation.timing?.some((candidate) => needles.includes(candidate)),
  );
}

export function reviewInstructions(card: Card, timing: ReviewTiming): string {
  if (card.cardNumber === "GD05-064" && timing === "deploy") {
    return "Play Awakened Power, choose Force Impulse Gundam in Trash, pay its cost, then choose the staged Shinn Asuka Pilot from Trash.";
  }
  if (card.type === "base" && timing === "destroyed") {
    return "As Player 2, deploy the staged Zssa (Sleeves), target the already-damaged Base, then resolve its Destroyed choices.";
  }
  switch (timing) {
    case "burst":
      return "As Player 2, pass Block and the Action Step to destroy the staged Shield. With both Base sections empty, accept or skip the Burst (every 【Burst】 is optional, including Add this card to hand).";
    case "action":
      return "Skip Block; the opponent auto-passes priority, then play or activate this card in the Action Step and resolve its visible targets.";
    case "when-paired":
      return "Pair the card with the staged compatible Unit and resolve the When Paired prompt or board change.";
    case "when-linked":
      return "Pair the card with the staged linked Unit, then resolve the When Linked effect and inspect the log.";
    case "deploy":
      if (card.cardNumber === "GD05-123") {
        return "Deploy Archangel and add a Shield to your hand. Pass to Player 2; then play the staged Darkness Finger targeting the friendly Orb Unit. Its 2 effect damage must be prevented while Archangel is active.";
      }
      if (card.cardNumber === "GD05-124") {
        return "Deploy White Ark and add a Shield to your hand. Then activate the staged V-Dash Gundam, choose Gun EZ for its rest cost and the staged enemy Unit; accept the prompt to rest White Ark instead.";
      }
      if (card.cardNumber === "ST10-016") {
        return "Deploy Luna Mana & Carry Base, add 1 Shield to hand, then verify the staged damaged friendly (G Generation) Unit recovers 1 HP.";
      }
      if (card.cardNumber === "GD05-018") {
        return "Deploy Gundam Calibarn (cost 7). After it enters the battle area, confirm 3 active EX Resource tokens are added to your Resource Area.";
      }
      return "Deploy the card from Hand with full Resources, then resolve every published target or optional choice.";
    case "attack":
      return "Declare an attack with the staged ready Unit, choose its legal target, and resolve the Attack trigger before battle.";
    case "destroyed":
      if (card.cardNumber === "GD05-019") {
        return "Attack with the rested enemy into Re-GZ (or finish the staged lethal fight). When Destroyed resolves, look at the top 3 deck cards — at least one (Londo Bell) Unit is staged there — optionally reveal it to hand, then return the rest to the bottom.";
      }
      return "Use the staged battle to destroy the source Unit, then resolve its Destroyed trigger and inspect the destination.";
    case "battle":
      return "Attack the staged rested enemy Unit or player so the card's battle-damage trigger reaches its printed condition.";
    case "repair":
      return "Pass Turn with the staged damaged source and verify the Repair amount in its visible HP and log result.";
    case "block":
      return "Declare this staged Blocker at the open Block Step and verify the attack target changes to it.";
    case "board":
      if (card.cardNumber === "GD05-007") {
        return "Inspect linked Asshimar: it should show AP 5 (1 printed + Pilot bonus + During Link AP+2) and <Repair 1>.";
      }
      return (card.effects ?? [])
        .flatMap((effect) => effect.directives)
        .some((directive) => selfZoneFromDirective(directive) === "hand")
        ? "Inspect the card in Hand and verify that the staged turn history applies its continuous effect."
        : "Inspect the card in its active board location, then use its printed legal action or continuous effect.";
    case "main":
      if (card.cardNumber === "GD05-079") {
        return "Activate Gundam Heavyarms Custom (EW). The fixture stages another friendly (G Team)/(Preventer) Unit and an enemy Lv.4-or-lower Unit; choose that enemy and verify AP-1 until end of turn.";
      }
      if (card.cardNumber === "GD05-128") {
        return "With Rising Gundam unlinked, rest Gundam Fight and verify it gives no AP bonus. Reload, pair Rising Gundam with any staged compatible Pilot, then rest Gundam Fight and choose a friendly Unit for AP+2.";
      }
      if (card.cardNumber === "GD05-129") {
        return "Deploy the staged Sazabi, choose another friendly Unit for its Deploy effect, then rest Axis to deploy the staged Geara Doga from Hand.";
      }
      return card.type === "command"
        ? "Play the Command during Main Phase and resolve its visible target, choice, and destination."
        : "Use the staged card's Main Phase action and resolve its visible target or cost.";
  }
}
