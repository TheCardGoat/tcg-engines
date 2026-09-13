import {
  registerFabCardDefinition,
  toFabCardDefinition,
  type FabCardDefinitionInput,
} from "../cards.ts";
import { registerTokenDefinitions, tokenDefinitionsBySlug } from "./token-registry.ts";
import { registerDemiHeroDefinitions } from "./demi-hero-registry.ts";
import type { FabPitchStackStrategy } from "./harness-config.ts";
import {
  DEFAULT_FAB_STARTING_LIFE,
  createFabMatchInitialState,
  type FabCardsMaps,
  type InitializeFabMatchInput,
} from "../initialize.ts";
import { createEmptyFabZones, type FabMatchState, type FabZoneKind } from "../state.ts";
import { syntheticTokenBaseProperties } from "../rules/snapshots.ts";
import { applyStartGameSelection } from "../rules/start-game-meta.ts";
import { applySharedLibraryMerge, heroSharesLibrary } from "../rules/shared-library.ts";
import { fabCanonicalCardId, fabObjectInstanceId, fabPlayerId } from "../game/identity.ts";
import { initialFabActiveFace, selectFabActiveFace } from "../game/active-face.ts";
import type { FabBaseObjectProperties, FabFaceId } from "@tcg/flesh-and-blood-types";
import { profileFabTestInitialization } from "./test-initialization-profiler.ts";
import { zoneVisibility } from "../rules/reducers/shared.ts";
import { heroCatalogTreats2hSwordAs1h } from "../rules/equip-restrictions.ts";
import {
  isBowDefinition,
  validateWeaponArea,
  weaponSeatKind,
  type FabWeaponAreaEntry,
} from "../rules/weapons/weapon-area.ts";

/**
 * Structural shape of any card object the harness may receive. Defined
 * structurally so generated card modules, catalog definitions, and projected
 * cards all satisfy it without forcing a `@tcg/flesh-and-blood-cards`
 * dependency into the leaf engine package.
 */
export interface FabCardLike {
  readonly canonicalId: string;
  readonly base?: FabBaseObjectProperties;
  readonly layout?: unknown;
  readonly types?: readonly string[];
  readonly pitch?: string | number;
  readonly cost?: string | number;
  readonly power?: number;
  readonly defense?: number;
  readonly health?: number;
  readonly intelligence?: number;
  readonly keywords?: readonly (string | { readonly name: string })[];
  readonly color?: string;
  readonly faceKind?: string;
  readonly abilities?: readonly unknown[];
  readonly slug?: string;
  readonly name?: string;
}

/**
 * Card reference used throughout the FaB test harness. Accepts the bare
 * canonical id string, or any object carrying one (so generated card modules,
 * catalog definitions, and projected cards all work).
 */
export type FabCardRef = string | FabCardLike;

/** Register or retarget an object in test-only setup without recreating schema-v1 bags. */
export function registerFabTestObject(
  state: FabMatchState,
  instanceId: string,
  canonicalId: string,
  ownerId: string,
): void {
  const existing = state.objects[instanceId];
  if (existing) {
    state.objects[instanceId] = {
      ...existing,
      canonicalId: fabCanonicalCardId(canonicalId),
      ownerId: fabPlayerId(ownerId),
    };
    return;
  }
  state.counters.objectIncarnation += 1;
  state.objects[instanceId] = {
    instanceId: fabObjectInstanceId(instanceId),
    canonicalId: fabCanonicalCardId(canonicalId),
    objectKind: "catalog-card",
    baseSource: { kind: "registered" },
    ownerId: fabPlayerId(ownerId),
    incarnation: state.counters.objectIncarnation,
    visibility: "public",
    activeFace: state.cardDefinitions[canonicalId]
      ? initialFabActiveFace(state.cardDefinitions[canonicalId])
      : { kind: "single" },
    cardPropertyState: { kind: "whole-card" },
    counters: [],
    markers: [],
    history: { moves: [] },
  };
}

export interface FabFixtureObjectSetup {
  defenseCounterTotal?: number;
  powerCounterTotal?: number;
  health?: number;
  suspenseCounters?: number;
  steamCounters?: number;
  aimCounters?: number;
  goldCounters?: number;
  energyCounters?: number;
  holoCounters?: number;
  balanceCounters?: number;
  powerCounters?: number;
  arsenalPowerBonus?: number;
  powerBonus?: number;
  sharpenedThisTurn?: boolean;
  faceDown?: boolean;
  faceUp?: boolean;
  destroyOnChainClose?: boolean;
  banishOnChainClose?: boolean;
  quellPendingDestroy?: boolean;
  equippedZoneSubtype?: "Head" | "Chest" | "Arms" | "Legs";
  activeFaceIds?: readonly string[];
  awakened?: boolean;
  status?: string;
  tapped?: boolean;
  transformed?: boolean;
  copyOf?: string;
  wagered?: boolean;
  attackableMarker?: boolean;
  banishedPlayPermissionMarker?: boolean;
  residualGoAgainUntilEot?: boolean;
  surgeBanish?: boolean;
  namedCounters?: Record<string, number>;
}

/**
 * Test-only annotation sidecar. It is intentionally outside FabMatchState so
 * fixture conveniences cannot become serialized rules state or status-marker
 * encodings. Rules-facing setup must use the explicit native fields above.
 */
const testObjectAnnotations = new WeakMap<FabMatchState, Map<string, FabFixtureObjectSetup>>();

function annotationsFor(state: FabMatchState, instanceId: string): FabFixtureObjectSetup {
  const annotations = testObjectAnnotations.get(state);
  return annotations?.get(instanceId) ?? {};
}

function setAnnotation(
  state: FabMatchState,
  instanceId: string,
  property: keyof FabFixtureObjectSetup,
  value: unknown,
): void {
  let annotations = testObjectAnnotations.get(state);
  if (!annotations) {
    annotations = new Map();
    testObjectAnnotations.set(state, annotations);
  }
  annotations.set(instanceId, { ...annotations.get(instanceId), [property]: value });
}

/** Immutable fixture inspector; never a mutation proxy or part of match state. */
export function inspectFabTestObject(
  state: FabMatchState,
  instanceId: string,
): Readonly<FabFixtureObjectSetup> {
  return deriveFabFixtureObjectSetup(state, instanceId);
}

export function setFabFixtureObjectSetup(
  state: FabMatchState,
  instanceId: string,
  values: FabFixtureObjectSetup,
): void {
  for (const [property, value] of Object.entries(values)) {
    writeFabFixtureObjectSetupProperty(state, instanceId, property, value);
  }
}

function deriveFabFixtureObjectSetup(
  state: FabMatchState,
  instanceId: string,
): FabFixtureObjectSetup {
  const object = state.objects[instanceId];
  if (!object) return {};
  const result: FabFixtureObjectSetup = {};
  const namedCounters: Record<string, number> = {};
  for (const counter of object.counters) {
    if (counter.kind === "numeric") {
      const value = counter.value * counter.count;
      if (counter.property === "defense")
        result.defenseCounterTotal = (result.defenseCounterTotal ?? 0) + value;
      if (counter.property === "power")
        result.powerCounterTotal = (result.powerCounterTotal ?? 0) + value;
      continue;
    }
    if (counter.kind === "damage") continue;
    namedCounters[counter.name] = (namedCounters[counter.name] ?? 0) + counter.count;
    const property = counterProperty(counter.name);
    if (property) Object.assign(result, { [property]: namedCounters[counter.name] });
  }
  if (Object.keys(namedCounters).length > 0) result.namedCounters = namedCounters;
  result.faceDown = object.markers.some((marker) => marker.kind === "face-down");
  result.faceUp = !result.faceDown;
  result.tapped = object.markers.some((marker) => marker.kind === "tapped");
  if (object.activeFace.kind === "paired") {
    result.activeFaceIds = [...object.activeFace.activeFaceIds];
  }
  if (object.markers.some((marker) => marker.kind === "awakened")) {
    result.awakened = true;
  }
  const status = object.markers.find((marker) => marker.kind === "status");
  if (status?.kind === "status") result.status = status.value;
  // CR 8.5.58: production set-status "sharpened-this-turn" from sharpen effect.
  if (
    object.markers.some(
      (marker) => marker.kind === "status" && marker.value === "sharpened-this-turn",
    )
  ) {
    result.sharpenedThisTurn = true;
  }
  const transform = object.markers.find((marker) => marker.kind === "transformed");
  if (transform?.kind === "transformed") {
    result.transformed = true;
    result.copyOf = transform.into;
  }
  result.wagered = object.markers.some((marker) => marker.kind === "wagered");
  return { ...result, ...annotationsFor(state, instanceId) };
}

function writeFabFixtureObjectSetupProperty(
  state: FabMatchState,
  instanceId: string,
  property: string,
  value: unknown,
): void {
  const object = state.objects[instanceId];
  if (!object) throw new Error(`cannot set test state for missing FAB object ${instanceId}`);
  if (property === "defenseCounterTotal" || property === "powerCounterTotal") {
    const numericProperty: "defense" | "power" =
      property === "defenseCounterTotal" ? "defense" : "power";
    const amount = typeof value === "number" ? value : 0;
    const unit = amount < 0 ? -1 : 1;
    const count = Math.abs(amount);
    state.objects[instanceId] = {
      ...object,
      counters: [
        ...object.counters.filter(
          (counter) => counter.kind !== "numeric" || counter.property !== numericProperty,
        ),
        ...(count === 0
          ? []
          : [{ kind: "numeric" as const, property: numericProperty, value: unit, count }]),
      ],
    };
    return;
  }
  if (property === "faceDown" || property === "faceUp" || property === "tapped") {
    const kind = property === "tapped" ? "tapped" : "face-down";
    const enabled = property === "faceUp" ? value === false : value === true;
    state.objects[instanceId] = {
      ...object,
      markers: [
        ...object.markers.filter((marker) => marker.kind !== kind),
        ...(enabled ? [{ kind } as const] : []),
      ],
    };
    return;
  }
  if (property === "activeFaceIds" && Array.isArray(value)) {
    const faceIds = value.filter(isFabFaceId);
    if (faceIds.length !== 1) {
      throw new Error("FAB fixture activeFaceIds must select exactly one face.");
    }
    const definition = state.cardDefinitions[object.canonicalId];
    if (!definition) {
      throw new Error(`cannot select a face for missing definition ${object.canonicalId}`);
    }
    state.objects[instanceId] = {
      ...object,
      activeFace: selectFabActiveFace(definition, faceIds[0]!),
    };
    return;
  }
  if (property === "status" && typeof value === "string") {
    state.objects[instanceId] = {
      ...object,
      markers: [
        ...object.markers.filter((marker) => marker.kind !== "status"),
        { kind: "status", value },
      ],
    };
    return;
  }
  if (property === "namedCounters" && typeof value === "object" && value !== null) {
    for (const [name, count] of Object.entries(value)) {
      if (typeof count === "number") writeNamedTestCounter(state, instanceId, name, count);
    }
    return;
  }
  const counterName = namedCounterForProperty(property);
  if (counterName && typeof value === "number") {
    writeNamedTestCounter(state, instanceId, counterName, value);
    return;
  }
  setAnnotation(state, instanceId, property as keyof FabFixtureObjectSetup, value);
}

function isFabFaceId(value: unknown): value is FabFaceId {
  return typeof value === "string" && /:face:(?:front|back|left|right)$/.test(value);
}

function writeNamedTestCounter(
  state: FabMatchState,
  instanceId: string,
  name: string,
  count: number,
): void {
  const object = state.objects[instanceId]!;
  state.objects[instanceId] = {
    ...object,
    counters: [
      ...object.counters.filter((counter) => counter.kind !== "named" || counter.name !== name),
      ...(count === 0 ? [] : [{ kind: "named" as const, name, count }]),
    ],
  };
}

function counterProperty(name: string): keyof FabFixtureObjectSetup | null {
  switch (name) {
    case "suspense":
      return "suspenseCounters";
    case "steam":
      return "steamCounters";
    case "aim":
      return "aimCounters";
    case "gold":
      return "goldCounters";
    case "energy":
      return "energyCounters";
    case "holo":
      return "holoCounters";
    case "balance":
      return "balanceCounters";
    case "power":
      return "powerCounters";
    default:
      return null;
  }
}

function namedCounterForProperty(property: string): string | null {
  switch (property) {
    case "suspenseCounters":
      return "suspense";
    case "steamCounters":
      return "steam";
    case "aimCounters":
      return "aim";
    case "goldCounters":
      return "gold";
    case "energyCounters":
      return "energy";
    case "holoCounters":
      return "holo";
    case "balanceCounters":
      return "balance";
    case "powerCounters":
      return "power";
    default:
      return null;
  }
}

/**
 * One card in a fixture zone. A state wrapper declares deterministic
 * per-instance test setup at construction time, before any public moves run.
 */
export type FabFixtureCardEntry =
  | FabCardRef
  | { readonly card: FabCardRef; readonly state?: FabFixtureObjectSetup };

/** Zones a fixture may pre-populate for a player. */
export type FabFixtureZoneKind = FabZoneKind;

export interface FabPlayerFixture {
  /** Seated hero canonical id. */
  heroCardId?: FabCardRef;
  /** Per-instance state for the seated hero, applied during fixture construction. */
  heroState?: FabFixtureObjectSetup;
  /** Number == N filler cards; array lists specific cards in declared order. */
  hand?: number | readonly FabFixtureCardEntry[];
  deck?: number | readonly FabFixtureCardEntry[];
  graveyard?: number | readonly FabFixtureCardEntry[];
  banished?: number | readonly FabFixtureCardEntry[];
  arsenal?: number | readonly FabFixtureCardEntry[];
  pitch?: number | readonly FabFixtureCardEntry[];
  combatChain?: number | readonly FabFixtureCardEntry[];
  stack?: number | readonly FabFixtureCardEntry[];
  head?: number | readonly FabFixtureCardEntry[];
  chest?: number | readonly FabFixtureCardEntry[];
  arms?: number | readonly FabFixtureCardEntry[];
  legs?: number | readonly FabFixtureCardEntry[];
  weapon1?: number | readonly FabFixtureCardEntry[];
  weapon2?: number | readonly FabFixtureCardEntry[];
  /** CR 8.5.29 hero soul (charged cards). */
  soul?: number | readonly FabFixtureCardEntry[];
  /** CR 4.1.6 inventory (Taylor / Librarian equipment sideboard). */
  inventory?: number | readonly FabFixtureCardEntry[];
  /** Arena permanents (allies, auras, items). */
  arena?: number | readonly FabFixtureCardEntry[];
  /**
   * CR 1.5.1–1.5.3 Macros: format-selected, non-card arena objects that
   * cease to exist when leaving the arena. Placed before heroes in setup.
   */
  macros?: number | readonly FabFixtureCardEntry[];
  /** Starting life. Defaults to {@link DEFAULT_FAB_STARTING_LIFE}. */
  life?: number;
  actionPoints?: number;
  resourcePoints?: number;
  /** Starting chi, declared while seating the player rather than mutated after start. */
  chiPoints?: number;
  intellect?: number;
  marked?: boolean;
}

/**
 * Low-level two-seat fixture for {@link createFabTestState}.
 * Product scope is **1v1 only** — never add a third seat.
 */
export interface FabTestFixture {
  player1?: FabPlayerFixture;
  player2?: FabPlayerFixture;
  /** Deterministic match seed. Defaults to `"fab-test"`. */
  seed?: string;
  player1Id?: string;
  player2Id?: string;
  /** Player who takes the first turn; defaults to player1. */
  firstPlayerId?: string;
  /** Shared starting life when a player omits `life`. */
  startingLife?: number;
  /** Canonical id minted for numeric (`hand: 4`) filler entries. */
  fillerCardId?: string;
  /** Extra card definitions (canonicalId → stats) merged into match state. */
  cardDefinitions?: Record<string, FabCardDefinitionInput>;
  /** Test-only public naming catalog; may intentionally include cards outside both decks. */
  publicCardIdentities?: readonly import("@tcg/flesh-and-blood-types").FabPublicCardIdentity[];
  /**
   * Automation seed forwarded verbatim to the real factory. Practice/local
   * matches use it to apply a player's saved account defaults (priority mode
   * plus optional-trigger declines) at creation.
   */
  automation?: Pick<InitializeFabMatchInput, "automationPreferences" | "optionalTriggerDeclines">;
}

export interface FabTestOptions {
  player1Id?: string;
  player2Id?: string;
  seed?: string;
  firstPlayerId?: string;
  startingLife?: number;
  fillerCardId?: string;
}

/**
 * Player-centric setup for the ergonomic {@link FabTestEngine.start} factory.
 * The hero card is the player's identity: tests address the player through the
 * imported hero object (`game.as(bravoShowstopper)`), so there is no ambiguity
 * between the many printings of a named hero. `life` defaults to the hero's
 * printed `health` when the card object carries one.
 */
export interface FabPlayerSetup {
  /** The imported hero card (or its canonical id) — this player's identity. */
  hero: FabCardRef;
  /** Per-instance state for the seated hero, applied during fixture construction. */
  heroState?: FabFixtureObjectSetup;
  life?: number;
  /**
   * Starting hand. Omitted/`undefined` seats an empty hand (no default-hand
   * stubs). Pass `"filler"` to opt into the legacy 4-card Browbeat / Enlightened
   * Strike dummy hand.
   */
  hand?: number | "filler" | readonly FabFixtureCardEntry[];
  /**
   * Starting deck, bottom-first when given as an array (last entry is the top
   * card). Prefer {@link deckTop} when you only care about the top cards.
   */
  deck?: number | readonly FabFixtureCardEntry[];
  /**
   * Cards placed on top of `deck` (last entry is the top card). Concatenated
   * after `deck` so they are drawn / revealed first.
   */
  deckTop?: readonly FabFixtureCardEntry[];
  graveyard?: number | readonly FabFixtureCardEntry[];
  banished?: number | readonly FabFixtureCardEntry[];
  arsenal?: number | readonly FabFixtureCardEntry[];
  pitch?: number | readonly FabFixtureCardEntry[];
  combatChain?: number | readonly FabFixtureCardEntry[];
  stack?: number | readonly FabFixtureCardEntry[];
  head?: number | readonly FabFixtureCardEntry[];
  chest?: number | readonly FabFixtureCardEntry[];
  arms?: number | readonly FabFixtureCardEntry[];
  legs?: number | readonly FabFixtureCardEntry[];
  weapon1?: number | readonly FabFixtureCardEntry[];
  weapon2?: number | readonly FabFixtureCardEntry[];
  /** CR 8.5.29 hero soul (charged cards). */
  soul?: number | readonly FabFixtureCardEntry[];
  /** CR 4.1.6 inventory (Taylor / Librarian equipment sideboard). */
  inventory?: number | readonly FabFixtureCardEntry[];
  /** Arena permanents (allies, auras, items). */
  arena?: number | readonly FabFixtureCardEntry[];
  /**
   * CR 1.5.1–1.5.3 Macros: format-selected, non-card arena objects that
   * cease to exist when leaving the arena. Placed before heroes in setup.
   */
  macros?: number | readonly FabFixtureCardEntry[];
  /**
   * CR 4.1.5b start-of-game selection: cards chosen from the starting deck via
   * the hero's meta "start the game with …" ability. Each entry is removed
   * from `deck` and placed in the ability's destination zone (arena, graveyard,
   * …). Does not go through the play procedure. Throws if a selection is not
   * in the deck or fails the hero filter.
   */
  startGame?: readonly FabFixtureCardEntry[];
  actionPoints?: number;
  /**
   * Starting resource points. When omitted, defaults to the sum of the
   * printed costs of all hand cards (floating resources), or `3` when the
   * hand is empty/undefined. Explicit values always win — pass `0` to opt
   * out for pitching / cost-insufficiency tests.
   */
  resourcePoints?: number;
  /** Starting chi, declared while seating the player rather than mutated after start. */
  chiPoints?: number;
  intellect?: number;
  marked?: boolean;
}

/**
 * Options for {@link FabTestEngine.start}.
 *
 * Match seating fields (`seed`, `firstPlayer`, `fillerCardId`) build the fixture.
 * Harness assists (`autoPitch`, `autoPassPriority`, `pitchStack`) live on the
 * engine instance only — they never change engine legality.
 */
export interface FabMatchOptions {
  seed?: string;
  /** Hero card of the player who takes the first turn. */
  firstPlayer?: FabCardRef;
  fillerCardId?: string;
  /** Test-only public naming catalog override. */
  publicCardIdentities?: readonly import("@tcg/flesh-and-blood-types").FabPublicCardIdentity[];
  /**
   * When `play()` omits `pitch` and the card costs more RP than available,
   * greedily pitch highest-value hand cards first. Default `true` (smart
   * default); opt out with `false` when the test exercises payment choice.
   */
  autoPitch?: boolean;
  /**
   * After harness moves, auto-pass stack/combat priority only when no legal
   * non-pass action exists. It never submits a no-blockers declaration or an
   * empty-stack Action Phase pass cycle. Default `true` (smart default); opt
   * out with `false` when the test exercises priority timing.
   */
  autoPassPriority?: boolean;
  /**
   * End-turn multi-card pitch bottom order (CR 4.4.3c).
   * Default `"as-pitched"` (smart default); pass `"manual"` when the test
   * exercises the ordering decision itself.
   */
  pitchStack?: FabPitchStackStrategy;
}

/**
 * Test-only catalog derivation. Production initialization intentionally has no
 * equivalent fallback because its name-card choices must use the global public
 * catalog rather than the cards loaded for one match.
 */
export function deriveFabTestPublicCardIdentities(
  cardDefinitions: Readonly<Record<string, FabCardDefinitionInput>>,
): readonly import("@tcg/flesh-and-blood-types").FabPublicCardIdentity[] {
  const namesByCanonicalId = new Map<string, Set<string>>();
  for (const definition of Object.values(cardDefinitions)) {
    const registered = registerFabCardDefinition(definition);
    const names =
      registered.layout.kind === "split"
        ? registered.layout.faces.map((face) => face.name)
        : registered.layout.kind === "flip" ||
            registered.layout.kind === "twin" ||
            registered.layout.kind === "transcend"
          ? [registered.layout.front.name, registered.layout.back.name]
          : registered.base.names;
    const collected = namesByCanonicalId.get(definition.canonicalId) ?? new Set<string>();
    for (const name of names) collected.add(name);
    namesByCanonicalId.set(definition.canonicalId, collected);
  }
  return [...namesByCanonicalId].map(([canonicalId, names]) => ({
    canonicalId,
    names: [...names],
  }));
}

export const FAB_DEFAULT_PLAYER_1 = "player-1";
export const FAB_DEFAULT_PLAYER_2 = "player-2";
export const FAB_DEFAULT_SEED = "fab-test";
export const FAB_DEFAULT_FILLER_CARD_ID = "fab-test-filler";

/**
 * Default deck cards used when a {@link FabPlayerSetup} omits `deck`.
 * Three copies each of Wounding Blow (red, yellow, blue) so the player
 * has a deterministic 9-card deck and won't lose from an empty library.
 */
const WOUNDING_BLOW_RED: FabCardLike = {
  canonicalId: "rLN8wNfkTtF9zBg8zwGzW",
  types: ["Generic", "Action", "Attack"],
  pitch: "1",
  cost: 0,
  power: 4,
  defense: 3,
  color: "Red",
  slug: "wounding-blow-red",
  name: "Wounding Blow",
};

const WOUNDING_BLOW_YELLOW: FabCardLike = {
  canonicalId: "Tb79JpdtgFJJwfFCGc9Dc",
  types: ["Generic", "Action", "Attack"],
  pitch: "2",
  cost: 0,
  power: 3,
  defense: 3,
  color: "Yellow",
  slug: "wounding-blow-yellow",
  name: "Wounding Blow",
};

const WOUNDING_BLOW_BLUE: FabCardLike = {
  canonicalId: "nGQcDzcjQ8gw8HGzwCGnF",
  types: ["Generic", "Action", "Attack"],
  pitch: "3",
  cost: 0,
  power: 2,
  defense: 3,
  color: "Blue",
  slug: "wounding-blow-blue",
  name: "Wounding Blow",
};

const DEFAULT_DECK: readonly FabFixtureCardEntry[] = [
  WOUNDING_BLOW_RED,
  WOUNDING_BLOW_RED,
  WOUNDING_BLOW_RED,
  WOUNDING_BLOW_YELLOW,
  WOUNDING_BLOW_YELLOW,
  WOUNDING_BLOW_YELLOW,
  WOUNDING_BLOW_BLUE,
  WOUNDING_BLOW_BLUE,
  WOUNDING_BLOW_BLUE,
];

/**
 * Default hand cards used when a {@link FabPlayerSetup} omits `hand`.
 * Three Browbeat (blue) and one Enlightened Strike (red) so the player
 * has a deterministic 4-card opening hand. An explicit empty array
 * (`hand: []`) is still respected.
 */
const BROWBEAT_BLUE: FabCardLike = {
  canonicalId: "RffddJzMgBmzDwQd6JCnf",
  types: ["Generic", "Action", "Attack"],
  pitch: "3",
  cost: 0,
  power: 1,
  defense: 3,
  color: "Blue",
  slug: "browbeat-blue",
  name: "Browbeat",
};

const ENLIGHTENED_STRIKE_RED: FabCardLike = {
  canonicalId: "QDrWjRHBmBWBnJHmmbzRM",
  types: ["Generic", "Action", "Attack"],
  pitch: "1",
  cost: 0,
  power: 5,
  defense: 3,
  color: "Red",
  keywords: ["go again"],
  slug: "enlightened-strike-red",
  name: "Enlightened Strike",
};

function resolveStartHand(
  hand: number | "filler" | readonly FabFixtureCardEntry[] | undefined,
): number | readonly FabFixtureCardEntry[] {
  // Omitted hand seats DEFAULT_HAND (3× Browbeat Blue + Enlightened Strike),
  // matching `"filler"`. Authors MUST write `hand: []` to opt out — flipping
  // the default to empty changes CR end-turn intellect draw and RP defaults
  // (see docs/architecture/harness-intent-api-implementation-plan.md §0).
  if (hand === undefined || hand === "filler") return DEFAULT_HAND;
  return hand;
}

/** Concatenate `deckTop` last so those cards sit on top (array decks are bottom-first). */
function resolveStartDeck(
  deck: number | readonly FabFixtureCardEntry[] | undefined,
  deckTop: readonly FabFixtureCardEntry[] | undefined,
): number | readonly FabFixtureCardEntry[] {
  const top = deckTop ?? [];
  if (top.length === 0) return deck ?? DEFAULT_DECK;
  if (deck === undefined) return [...DEFAULT_DECK, ...top];
  if (typeof deck === "number") {
    return [...Array.from({ length: deck }, () => ({ card: FAB_DEFAULT_FILLER_CARD_ID })), ...top];
  }
  return [...deck, ...top];
}

const DEFAULT_HAND: readonly FabFixtureCardEntry[] = [
  BROWBEAT_BLUE,
  BROWBEAT_BLUE,
  BROWBEAT_BLUE,
  ENLIGHTENED_STRIKE_RED,
];

/** Resolve any {@link FabCardRef} to its canonical id string. */
export function fabCardRefId(ref: FabCardRef): string {
  return typeof ref === "string" ? ref : ref.canonicalId;
}

/** Resolve a hero reference to its default starting life (printed `health`). */
export function heroPrintedLife(hero: FabCardRef): number | undefined {
  if (typeof hero !== "object") return undefined;
  return toFabCardDefinition(hero as Parameters<typeof toFabCardDefinition>[0]).base.numeric.life;
}

/**
 * Build a token fixture entry (e.g. Runechant, Copper) whose
 * `canonicalId` (`token:<token>`) and type-box match the engine's token
 * convention. When the catalog has a real definition for the slug, the
 * returned entry carries the full abilities/keywords/numeric stats so the
 * harness-seeded token is production-equivalent. Use this in `arena`/
 * `banished` fixture zones so token-count selectors and continuous-effect
 * views agree on identity — never inline `{ canonicalId: "token:Runechant",
 * types: [...] }` (the token NAME is not a subtype, and the canonical id is
 * lowercase).
 */
export function fabToken(token: string): FabCardLike {
  const catalog = tokenDefinitionsBySlug.get(token);
  if (catalog) {
    return {
      ...catalog,
      canonicalId: `token:${token}`,
    };
  }
  const base = syntheticTokenBaseProperties(token);
  return {
    canonicalId: `token:${token}`,
    name: base.names[0],
    types: [
      ...base.typeBox.metatypes,
      ...base.typeBox.supertypes,
      ...base.typeBox.types,
      ...base.typeBox.subtypes,
    ],
  };
}

/**
 * Build the ergonomic **1v1** fixture for {@link FabTestEngine.start}. The
 * hero card becomes each player's identity; life defaults to the hero's printed
 * health (falling back to {@link DEFAULT_FAB_STARTING_LIFE}) so a typical test
 * only names its hero and its hand.
 *
 * Multiplayer / three-seat fixtures are intentionally unsupported.
 */
export function startFixture(
  playerA: FabPlayerSetup,
  playerB: FabPlayerSetup,
  options: FabMatchOptions = {},
): FabTestFixture {
  const resolveLife = (setup: FabPlayerSetup): number =>
    setup.life ?? heroPrintedLife(setup.hero) ?? DEFAULT_FAB_STARTING_LIFE;

  // Collect definitions from any object-shaped card refs in the setup.
  const cardDefinitions: Record<string, FabCardDefinitionInput> = {};
  collectDefsFromSetup(playerA, cardDefinitions);
  collectDefsFromSetup(playerB, cardDefinitions);
  assertLegalWeaponArea(playerA, cardDefinitions);
  assertLegalWeaponArea(playerB, cardDefinitions);

  const toFixture = (setup: FabPlayerSetup): FabPlayerFixture => {
    const zones = applyStartGameToSetup(setup, cardDefinitions);
    return {
      heroCardId: setup.hero,
      heroState: setup.heroState,
      life: resolveLife(setup),
      hand: resolveStartHand(zones.hand),
      deck: resolveStartDeck(zones.deck, setup.deckTop),
      graveyard: zones.graveyard,
      banished: zones.banished,
      arsenal: zones.arsenal,
      pitch: setup.pitch,
      combatChain: setup.combatChain,
      stack: setup.stack,
      head: setup.head,
      chest: setup.chest,
      arms: setup.arms,
      legs: setup.legs,
      weapon1: setup.weapon1,
      weapon2: setup.weapon2,
      soul: setup.soul,
      inventory: setup.inventory,
      arena: zones.arena,
      macros: setup.macros,
      actionPoints: setup.actionPoints,
      resourcePoints: setup.resourcePoints ?? defaultResourcePoints(setup, cardDefinitions),
      chiPoints: setup.chiPoints,
      intellect: setup.intellect,
      marked: setup.marked,
    };
  };

  let firstPlayerId: string | undefined;
  if (options.firstPlayer) {
    const firstHero = fabCardRefId(options.firstPlayer);
    firstPlayerId =
      fabCardRefId(playerA.hero) === firstHero
        ? FAB_DEFAULT_PLAYER_1
        : fabCardRefId(playerB.hero) === firstHero
          ? FAB_DEFAULT_PLAYER_2
          : FAB_DEFAULT_PLAYER_1;
  }

  return {
    player1: toFixture(playerA),
    player2: toFixture(playerB),
    seed: options.seed,
    firstPlayerId,
    fillerCardId: options.fillerCardId,
    cardDefinitions,
    publicCardIdentities: options.publicCardIdentities,
  };
}

/**
 * Floating-resource default when a setup omits `resourcePoints`: the sum of
 * the printed costs of every hand card, or a playability floor of `3` when the
 * hand is empty/omitted/`"filler"`. DEFAULT_HAND is all zero-cost stubs, so
 * summing it would leave the seat resource-starved — HEAD floors it to 3.
 * Explicit `resourcePoints` (including `0`) always wins — this is the single
 * defaulting point for the whole harness.
 */
function defaultResourcePoints(
  setup: FabPlayerSetup,
  defs: Record<string, FabCardDefinitionInput>,
): number {
  // Omitted / `"filler"` hand seats DEFAULT_HAND but KEEPS the RP floor of 3.
  // Do NOT sum DEFAULT_HAND's zero-cost stubs — that regresses seats relying on
  // the floor. Write an explicit hand array to get cost-sum RP.
  if (setup.hand === undefined || setup.hand === "filler") return 3;
  if (typeof setup.hand === "number") {
    // Numeric filler entries resolve to the cost-less filler definition.
    return setup.hand > 0 ? 0 : 3;
  }
  if (setup.hand.length === 0) return 3;
  return setup.hand.reduce((sum, entry) => sum + printedCost(defs[entryCanonicalId(entry)]), 0);
}

function entryCanonicalId(entry: FabFixtureCardEntry): string {
  const card = typeof entry === "object" && "card" in entry ? entry.card : entry;
  return fabCardRefId(card);
}

function printedCost(def: FabCardDefinitionInput | undefined): number {
  const cost = def ? registerFabCardDefinition(def).base.numeric.cost : undefined;
  return typeof cost === "number" && Number.isFinite(cost) ? cost : 0;
}

/** CR 8.2.2b / Zane 2H-sword-as-1H: fixture seating uses the same weapon-area
 * rules as pregame. A 2H plus a second weapon is illegal unless the hero's
 * catalog grant treats that 2H sword as 1H. */
function assertLegalWeaponArea(
  setup: FabPlayerSetup,
  defs: Record<string, FabCardDefinitionInput>,
): void {
  const weaponIds = [
    ...(Array.isArray(setup.weapon1) ? setup.weapon1 : []),
    ...(Array.isArray(setup.weapon2) ? setup.weapon2 : []),
  ].map(entryCanonicalId);
  const heroDef = defs[fabCardRefId(setup.hero)];
  const entries: FabWeaponAreaEntry[] = weaponIds.map((id) => {
    const definition = defs[id];
    return {
      canonicalId: id,
      seat: heroCatalogTreats2hSwordAs1h(heroDef, definition)
        ? "1h-weapon"
        : weaponSeatKind(definition),
      isBow: isBowDefinition(definition),
      perched: definition
        ? registerFabCardDefinition(definition).base.keywords.some(
            (keyword) => keyword.name === "perched",
          )
        : false,
    };
  });
  const issues = [
    ...([setup.weapon1, setup.weapon2].some((slot) => Array.isArray(slot) && slot.length > 1)
      ? ["overfull-weapon-slot"]
      : []),
    ...(weaponIds.length > 2 ? ["too-many-weapons"] : []),
    ...(entries.some((entry) => entry.seat === "non-weapon") ? ["non-weapon-in-slot"] : []),
    ...validateWeaponArea(entries),
  ];
  if (issues.length === 0) return;
  const heroName = heroDef
    ? registerFabCardDefinition(heroDef).base.names[0]
    : fabCardRefId(setup.hero);
  throw new Error(`Illegal weapon area for ${heroName}: ${issues.join(", ")} (CR 8.2.2b).`);
}

function collectDefsFromSetup(
  setup: FabPlayerSetup,
  into: Record<string, FabCardDefinitionInput>,
): void {
  registerDef(setup.hero, into);
  for (const zone of [
    setup.hand,
    setup.deck,
    setup.deckTop,
    setup.graveyard,
    setup.banished,
    setup.arsenal,
    setup.pitch,
    setup.combatChain,
    setup.stack,
    setup.head,
    setup.chest,
    setup.arms,
    setup.legs,
    setup.weapon1,
    setup.weapon2,
    setup.soul,
    setup.inventory,
    setup.arena,
    setup.startGame,
    setup.macros,
  ]) {
    if (!Array.isArray(zone)) continue;
    for (const entry of zone) registerDef(entry, into);
  }
}

/**
 * CR 4.1.5b: pull start-game selections out of the deck into their destination
 * zones via the hero's meta ability filter (production seating path).
 */
function applyStartGameToSetup(
  setup: FabPlayerSetup,
  cardDefinitions: Record<string, FabCardDefinitionInput>,
): {
  deck: number | readonly FabFixtureCardEntry[] | undefined;
  arena: number | readonly FabFixtureCardEntry[] | undefined;
  graveyard: number | readonly FabFixtureCardEntry[] | undefined;
  banished: number | readonly FabFixtureCardEntry[] | undefined;
  arsenal: number | readonly FabFixtureCardEntry[] | undefined;
  hand: number | readonly FabFixtureCardEntry[] | undefined;
} {
  if (!setup.startGame || setup.startGame.length === 0) {
    return {
      deck: setup.deck,
      arena: setup.arena,
      graveyard: setup.graveyard,
      banished: setup.banished,
      arsenal: setup.arsenal,
      hand: setup.hand === undefined || setup.hand === "filler" ? DEFAULT_HAND : setup.hand,
    };
  }
  if (typeof setup.deck === "number" || setup.deck === undefined) {
    throw new Error(
      "startGame requires an explicit deck array so CR 4.1.5b can remove selected cards from it.",
    );
  }
  const heroId = fabCardRefId(setup.hero);
  const heroDef =
    cardDefinitions[heroId] ??
    (typeof setup.hero === "object" && setup.hero !== null && "canonicalId" in setup.hero
      ? toFabCardDefinition(setup.hero as never)
      : undefined);
  if (!heroDef) {
    throw new Error(`Cannot resolve hero definition for startGame seating (${heroId}).`);
  }
  // Ensure selected cards' definitions are registered for filter matching.
  for (const entry of setup.startGame) {
    registerDef(entry, cardDefinitions);
  }
  for (const entry of setup.deck) {
    registerDef(entry, cardDefinitions);
  }

  const deckIds = setup.deck.map((entry) => entryCanonicalId(entry));
  const selectedIds = setup.startGame.map((entry) => entryCanonicalId(entry));
  const { remainingDeckCanonicalIds, placements } = applyStartGameSelection({
    hero: heroDef,
    deckCanonicalIds: deckIds,
    selectedCanonicalIds: selectedIds,
    cardDefinitions,
  });

  // Rebuild deck entries in original order, dropping consumed selection copies.
  const remainingEntries: FabFixtureCardEntry[] = [];
  const remainingCounts = new Map<string, number>();
  for (const id of remainingDeckCanonicalIds) {
    remainingCounts.set(id, (remainingCounts.get(id) ?? 0) + 1);
  }
  for (const entry of setup.deck) {
    const id = entryCanonicalId(entry);
    const left = remainingCounts.get(id) ?? 0;
    if (left <= 0) continue;
    remainingCounts.set(id, left - 1);
    remainingEntries.push(entry);
  }

  const appendZone = (
    existing: number | readonly FabFixtureCardEntry[] | undefined,
    add: readonly FabFixtureCardEntry[],
  ): readonly FabFixtureCardEntry[] => {
    const base = typeof existing === "number" || existing === undefined ? [] : [...existing];
    return [...base, ...add];
  };

  let arena = setup.arena;
  let graveyard = setup.graveyard;
  let banished = setup.banished;
  let arsenal = setup.arsenal;
  let hand: number | readonly FabFixtureCardEntry[] | undefined =
    setup.hand === undefined || setup.hand === "filler" ? DEFAULT_HAND : setup.hand;
  for (const placement of placements) {
    // Prefer the original startGame entry object so object-shaped defs ride along.
    const entry =
      setup.startGame.find((e) => entryCanonicalId(e) === placement.canonicalId) ??
      ({ card: placement.canonicalId } as FabFixtureCardEntry);
    switch (placement.zone) {
      case "arena":
        arena = appendZone(arena, [entry]);
        break;
      case "graveyard":
        graveyard = appendZone(graveyard, [entry]);
        break;
      case "banished":
        banished = appendZone(banished, [entry]);
        break;
      case "arsenal":
        arsenal = appendZone(arsenal, [entry]);
        break;
      case "hand":
        hand = appendZone(hand, [entry]);
        break;
      default:
        break;
    }
  }

  return {
    deck: remainingEntries,
    arena,
    graveyard,
    banished,
    arsenal,
    hand,
  };
}

function registerDef(
  entry: FabFixtureCardEntry | FabCardRef | undefined,
  into: Record<string, FabCardDefinitionInput>,
): void {
  if (entry === undefined || typeof entry === "string" || typeof entry === "number") return;
  const card = "card" in entry ? entry.card : entry;
  if (typeof card === "string") return;
  const next = toFabCardDefinition(card as Parameters<typeof toFabCardDefinition>[0]);
  const previous = into[card.canonicalId];
  // Default-hand stubs share real canonical ids (Enlightened Strike, Browbeat).
  // Never let a later stub wipe a seated module's printed abilities.
  if (previous && definitionAbilityCount(previous) > definitionAbilityCount(next)) return;
  into[card.canonicalId] = next;
}

function definitionAbilityCount(definition: FabCardDefinitionInput): number {
  return registerFabCardDefinition(definition).base.abilities.length;
}

/** Resolve a zone entry to its canonical id, unwrapping `{ card }` state. */
export function fabEntryCardId(entry: FabFixtureCardEntry): string {
  return typeof entry === "object" && "card" in entry
    ? fabCardRefId(entry.card)
    : fabCardRefId(entry);
}

function toEntryList(
  zone: number | readonly FabFixtureCardEntry[] | undefined,
  fillerCardId: string,
): readonly FabFixtureCardEntry[] {
  if (zone === undefined) return [];
  if (typeof zone === "number") {
    return Array.from({ length: zone }, () => ({
      card: fillerCardId,
    })) satisfies FabFixtureCardEntry[] as readonly FabFixtureCardEntry[];
  }
  return zone;
}

interface MaterializedPlayer {
  heroCardId: string | null;
  heroState?: FabFixtureObjectSetup;
  life: number;
  drawOpeningHand: boolean;
  actionPoints?: number;
  resourcePoints?: number;
  chiPoints?: number;
  intellect?: number;
  marked?: boolean;
  zones: Record<FabFixtureZoneKind, readonly FabFixtureCardEntry[]>;
  /** CR 1.5.1 Macro canonical ids to seat as ownerless arena objects. */
  macros: readonly FabFixtureCardEntry[];
}

function materializePlayer(
  fixture: FabPlayerFixture | undefined,
  startingLife: number,
  fillerCardId: string,
): MaterializedPlayer {
  const f = fixture ?? {};
  return {
    heroCardId: f.heroCardId === undefined ? null : fabCardRefId(f.heroCardId),
    heroState: f.heroState,
    life: f.life ?? startingLife,
    drawOpeningHand: f.hand === undefined,
    actionPoints: f.actionPoints,
    resourcePoints: f.resourcePoints,
    chiPoints: f.chiPoints,
    intellect: f.intellect,
    zones: {
      deck: toEntryList(f.deck, fillerCardId),
      hand: toEntryList(f.hand, fillerCardId),
      graveyard: toEntryList(f.graveyard, fillerCardId),
      banished: toEntryList(f.banished, fillerCardId),
      arsenal: toEntryList(f.arsenal, fillerCardId),
      pitch: toEntryList(f.pitch, fillerCardId),
      combatChain: toEntryList(f.combatChain, fillerCardId),
      stack: toEntryList(f.stack, fillerCardId),
      arena: toEntryList(f.arena, fillerCardId),
      head: toEntryList(f.head, fillerCardId),
      chest: toEntryList(f.chest, fillerCardId),
      arms: toEntryList(f.arms, fillerCardId),
      legs: toEntryList(f.legs, fillerCardId),
      weapon1: toEntryList(f.weapon1, fillerCardId),
      weapon2: toEntryList(f.weapon2, fillerCardId),
      heroZone: [],
      soul: toEntryList(f.soul, fillerCardId),
      inventory: toEntryList(f.inventory, fillerCardId),
      under: [],
    },
    marked: f.marked,
    macros: toEntryList(f.macros, fillerCardId),
  };
}

function collectDefsFromFixture(
  fixture: FabTestFixture,
  into: Record<string, FabCardDefinitionInput>,
): void {
  for (const player of [fixture.player1, fixture.player2]) {
    if (!player) continue;
    if (player.heroCardId) registerDef(player.heroCardId, into);
    for (const zone of [
      player.hand,
      player.deck,
      player.graveyard,
      player.banished,
      player.arsenal,
      player.pitch,
      player.combatChain,
      player.stack,
      player.head,
      player.chest,
      player.arms,
      player.legs,
      player.weapon1,
      player.weapon2,
      player.soul,
      player.inventory,
      player.arena,
      player.macros,
    ]) {
      if (!Array.isArray(zone)) continue;
      for (const entry of zone) registerDef(entry, into);
    }
  }
}

/**
 * Build an authoritative **1v1** {@link FabMatchState} from a fixture.
 *
 * Mirrors the shared "instantiate via the real factory, then relocate"
 * strategy used across the TCG Online engines: every card is first minted as a
 * real card instance through {@link createFabMatchInitialState} (so the resulting
 * state is production-identical), then the fixture zones re-place those
 * instances. The fixture never invents instance ids, which keeps the engine's
 * `instanceId -> canonicalId` invariant intact.
 *
 * Multiplayer seating is out of product scope; fixtures always seat exactly
 * two players.
 */
export function createFabTestState(fixture: FabTestFixture = {}): FabMatchState {
  const player1Id = fixture.player1Id ?? FAB_DEFAULT_PLAYER_1;
  const player2Id = fixture.player2Id ?? FAB_DEFAULT_PLAYER_2;
  if (player1Id === player2Id) {
    throw new Error(
      `createFabTestState requires two distinct seats (1v1); got "${player1Id}" twice.`,
    );
  }
  const seed = fixture.seed ?? FAB_DEFAULT_SEED;
  const startingLife = fixture.startingLife ?? DEFAULT_FAB_STARTING_LIFE;
  const fillerCardId = fixture.fillerCardId ?? FAB_DEFAULT_FILLER_CARD_ID;

  const [p1, p2] = profileFabTestInitialization(
    "test-init: materialize fixture",
    () =>
      [
        materializePlayer(fixture.player1, startingLife, fillerCardId),
        materializePlayer(fixture.player2, startingLife, fillerCardId),
      ] as const,
  );

  const cardDefinitions: Record<string, FabCardDefinitionInput> = {
    ...fixture.cardDefinitions,
  };
  // Pre-register all catalog token definitions so tokens created at runtime
  // carry their real CR 8.6.x abilities (Gold draw, Ponder end-phase, Runechant
  // arcane damage, Hyper Driver steam counters, etc.) via state.cardDefinitions.
  profileFabTestInitialization("test-init: register universal tokens", () => {
    registerTokenDefinitions(cardDefinitions);
  });
  // HNT Agents of Chaos (and future demi-heroes that enter via transform)
  // must be available without seating them in an opening zone.
  profileFabTestInitialization("test-init: register universal demi-heroes", () => {
    registerDemiHeroDefinitions(cardDefinitions);
  });
  collectDefsFromFixture(fixture, cardDefinitions);
  cardDefinitions[fillerCardId] ??= {
    canonicalId: fillerCardId,
    types: [],
  };

  let counter = 0;
  const canonicalIdsByInstance: Record<string, string> = {};
  const owners: Record<string, string[]> = {
    [player1Id]: [],
    [player2Id]: [],
  };
  const seatMaterialized: { playerId: string; mat: typeof p1 }[] = [
    { playerId: player1Id, mat: p1 },
    { playerId: player2Id, mat: p2 },
  ];
  for (const { playerId, mat } of seatMaterialized) {
    for (const canonicalId of collectCanonicalIds(mat)) {
      const instanceId = `fab-test-${String(counter++).padStart(4, "0")}`;
      canonicalIdsByInstance[instanceId] = canonicalId;
      owners[playerId]!.push(instanceId);
    }
  }
  for (const canonicalId of Object.values(canonicalIdsByInstance)) {
    cardDefinitions[canonicalId] ??= { canonicalId, types: [] };
  }
  for (const heroCardId of [p1.heroCardId, p2.heroCardId]) {
    if (heroCardId) cardDefinitions[heroCardId] ??= { canonicalId: heroCardId, types: ["Hero"] };
  }

  const cardsMaps: FabCardsMaps = { canonicalIdsByInstance, owners };
  const state = profileFabTestInitialization("test-init: production initial state", () =>
    createFabMatchInitialState({
      seed,
      player1Id,
      player2Id,
      cardsMaps,
      startingLife,
      heroes: {
        ...(p1.heroCardId ? { [player1Id]: p1.heroCardId } : {}),
        ...(p2.heroCardId ? { [player2Id]: p2.heroCardId } : {}),
      },
      firstPlayerId: fixture.firstPlayerId ?? player1Id,
      cardDefinitions,
      publicCardIdentities:
        fixture.publicCardIdentities ?? deriveFabTestPublicCardIdentities(cardDefinitions),
      // Most card fixtures arrange an Action Phase board directly. Initial
      // Start Phase behavior is covered through the production bootstrap.
      skipInitialStartPhase: true,
      intellect: {
        ...(p1.intellect !== undefined ? { [player1Id]: p1.intellect } : {}),
        ...(p2.intellect !== undefined ? { [player2Id]: p2.intellect } : {}),
      },
      // Fixtures relocate per-seat decks after init; merge runs after relocate.
      skipSharedLibrary: true,
      ...(fixture.automation?.automationPreferences
        ? { automationPreferences: fixture.automation.automationPreferences }
        : {}),
      ...(fixture.automation?.optionalTriggerDeclines
        ? { optionalTriggerDeclines: fixture.automation.optionalTriggerDeclines }
        : {}),
      macros: {
        ...(p1.macros.length > 0 ? { [player1Id]: p1.macros.map((e) => fabEntryCardId(e)) } : {}),
        ...(p2.macros.length > 0 ? { [player2Id]: p2.macros.map((e) => fabEntryCardId(e)) } : {}),
      },
    }),
  );

  profileFabTestInitialization("test-init: relocate fixture zones", () => {
    relocatePlayer(state, player1Id, p1);
    relocatePlayer(state, player2Id, p2);
  });

  // Apply per-player asset overrides after seating.
  for (const { playerId, mat } of seatMaterialized) {
    if (mat.actionPoints !== undefined) state.players[playerId]!.actionPoints = mat.actionPoints;
    if (mat.resourcePoints !== undefined) {
      state.players[playerId]!.resourcePoints = mat.resourcePoints;
    }
    if (mat.chiPoints !== undefined) state.players[playerId]!.chiPoints = mat.chiPoints;
    if (mat.marked) state.players[playerId]!.marked = true;
  }

  // Seed exact keyword-defined fixture state; printed prose is never executable.
  for (const { playerId } of seatMaterialized) {
    for (const instanceId of state.containers.zonesByPlayerId[playerId]!.arena) {
      const def = state.cardDefinitions[state.objects[instanceId]?.canonicalId ?? ""];
      if (!def) continue;
      const meta = inspectFabTestObject(state, instanceId);
      if (def.base.typeBox.subtypes.includes("Ally") && typeof def.base.numeric.life === "number") {
        setFabFixtureObjectSetup(state, instanceId, { health: def.base.numeric.life });
      }
      // CR 8.3.29 crank: enters with a steam counter when not already set.
      if (baseKeywordNames(def).includes("crank") && meta.steamCounters === undefined) {
        setFabFixtureObjectSetup(state, instanceId, { steamCounters: 1 });
      }
      // CR 8.3.42 suspense: enters with 2 suspense counters.
      if (baseKeywordNames(def).includes("suspense") && meta.suspenseCounters === undefined) {
        setFabFixtureObjectSetup(state, instanceId, { suspenseCounters: 2 });
      }
    }
    // CR 8.3.36 cloaked: equip face-down; CR 8.3.30 modular: zone subtype stamp.
    const zoneSubtype = {
      head: "Head",
      chest: "Chest",
      arms: "Arms",
      legs: "Legs",
    } as const;
    for (const zone of ["head", "chest", "arms", "legs"] as const) {
      for (const instanceId of state.containers.zonesByPlayerId[playerId]![zone]) {
        const def = state.cardDefinitions[state.objects[instanceId]?.canonicalId ?? ""];
        if (!def) continue;
        if (baseKeywordNames(def).includes("cloaked")) {
          setFabFixtureObjectSetup(state, instanceId, { faceDown: true });
        }
        if (baseKeywordNames(def).includes("modular")) {
          setFabFixtureObjectSetup(state, instanceId, { equippedZoneSubtype: zoneSubtype[zone] });
        }
      }
    }
    // CR 8.3 unique: only one unique permanent of the same name in arena.
    enforceUniqueInArena(state, playerId);
    // CR 8.3.26 pairs: equip only with partner object present.
    enforcePairsEquipment(state, playerId);
  }

  // Explicit fixture state is applied after keyword-derived starting state so
  // a focused fixture can intentionally model a face-up Cloaked card or a
  // pre-existing counter without mutating a live match after construction.
  applyFixtureEntryStates(state, seatMaterialized);

  // Yorick: after fixture zones are seated, merge decks/GYs into the host and
  // stamp sharedLibraryHostId so mid-game draws and discards use one library.
  applyFixtureSharedLibrary(state);

  return state;
}

function applyFixtureEntryStates(
  state: FabMatchState,
  materializedPlayers: readonly { playerId: string; mat: MaterializedPlayer }[],
): void {
  for (const { playerId, mat } of materializedPlayers) {
    const player = state.players[playerId];
    if (!player) continue;
    if (mat.heroState && player.heroCardId) {
      setFabFixtureObjectSetup(state, player.heroCardId, mat.heroState);
    }
    for (const zone of Object.keys(mat.zones) as FabFixtureZoneKind[]) {
      const entries = mat.zones[zone];
      const instanceIds = state.containers.zonesByPlayerId[playerId]![zone];
      for (const [index, entry] of entries.entries()) {
        if (typeof entry !== "object" || !("card" in entry) || !entry.state) continue;
        const instanceId = instanceIds[index];
        if (!instanceId) {
          throw new Error(`fixture state entry is missing its ${zone} instance for ${playerId}`);
        }
        setFabFixtureObjectSetup(state, instanceId, entry.state);
      }
    }
  }
}

function applyFixtureSharedLibrary(state: FabMatchState): void {
  const shares = state.playerIds.some((playerId) => {
    const heroInstanceId = state.players[playerId]?.heroCardId;
    const heroCanonical = heroInstanceId ? state.objects[heroInstanceId]?.canonicalId : undefined;
    const def = heroCanonical ? state.cardDefinitions[heroCanonical] : undefined;
    return heroSharesLibrary(def);
  });
  if (!shares) {
    state.sharedLibraryHostId = null;
    return;
  }
  // Host = first seated player (stable for 1v1 fixtures).
  const hostId = state.playerIds[0]!;
  state.rngState = applySharedLibraryMerge(state, hostId, state.rngState);
}

function baseKeywordNames(def: FabCardDefinitionInput | undefined): string[] {
  if (!def) return [];
  return registerFabCardDefinition(def).base.keywords.map((keyword) => keyword.name);
}

function personalMoniker(names: readonly string[]): string | null {
  const name = names[0]?.trim();
  if (!name) return null;
  const comma = name.indexOf(",");
  if (comma > 0) return name.slice(0, comma).trim().toLocaleLowerCase("en-US");
  const first = name.split(/\s+/)[0];
  return first ? first.toLocaleLowerCase("en-US") : null;
}

function uniqueKeepPriority(def: {
  readonly base: { readonly typeBox: { readonly types: readonly string[] } };
}): number {
  if (def.base.typeBox.types.includes("Hero")) return 2;
  if (def.base.typeBox.types.includes("Demi-Hero")) return 1;
  return 0;
}

function enforceUniqueInArena(state: FabMatchState, playerId: string): void {
  const zones = state.containers.zonesByPlayerId[playerId]!;
  const members: {
    instanceId: string;
    zone: "arena" | "heroZone";
    moniker: string;
    unique: boolean;
    priority: number;
  }[] = [];
  for (const zone of ["arena", "heroZone"] as const) {
    for (const instanceId of zones[zone]) {
      const canonical = state.objects[instanceId]?.canonicalId ?? "";
      const def = state.cardDefinitions[canonical];
      if (!def) continue;
      const moniker = personalMoniker(def.base.names) ?? canonical;
      members.push({
        instanceId,
        zone,
        moniker,
        unique: baseKeywordNames(def).includes("unique"),
        priority: uniqueKeepPriority(def),
      });
    }
  }
  const groups = new Map<string, typeof members>();
  for (const member of members) {
    const list = groups.get(member.moniker) ?? [];
    list.push(member);
    groups.set(member.moniker, list);
  }
  for (const group of groups.values()) {
    if (!group.some((member) => member.unique) || group.length <= 1) continue;
    const keep = group.reduce((best, member) => (member.priority >= best.priority ? member : best));
    for (const extra of group) {
      if (extra.instanceId === keep.instanceId) continue;
      const idx = zones[extra.zone].indexOf(extra.instanceId);
      if (idx === -1) continue;
      zones[extra.zone].splice(idx, 1);
      zones.graveyard.push(extra.instanceId);
    }
  }
}

/** CR 8.3.26: pairs equipment is destroyed/rejected if partner is not equipped. */
function enforcePairsEquipment(state: FabMatchState, playerId: string): void {
  const equippedCanonicals = new Set<string>();
  for (const zone of ["head", "chest", "arms", "legs", "weapon1", "weapon2"] as const) {
    for (const id of state.containers.zonesByPlayerId[playerId]![zone]) {
      equippedCanonicals.add(state.objects[id]?.canonicalId ?? "");
    }
  }
  for (const zone of ["head", "chest", "arms", "legs"] as const) {
    for (const instanceId of state.containers.zonesByPlayerId[playerId]![zone].slice()) {
      const def = state.cardDefinitions[state.objects[instanceId]?.canonicalId ?? ""];
      if (!def) continue;
      const pairs = def.base.keywords.find((keyword) => keyword.name === "pairs") as
        | { name: string; cardName?: string }
        | undefined;
      if (!pairs?.cardName) continue;
      const partnerPresent =
        equippedCanonicals.has(pairs.cardName) ||
        [...equippedCanonicals].some((c) => c.includes(pairs.cardName!));
      if (!partnerPresent) {
        const idx = state.containers.zonesByPlayerId[playerId]![zone].indexOf(instanceId);
        if (idx !== -1) {
          state.containers.zonesByPlayerId[playerId]![zone].splice(idx, 1);
          state.containers.zonesByPlayerId[playerId]!.graveyard.push(instanceId);
        }
      }
    }
  }
}

function collectCanonicalIds(player: MaterializedPlayer): string[] {
  const ids: string[] = [];
  // Seated heroes are registered independently by createFabMatchInitialState and
  // placed directly in heroZone. Minting another physical copy here leaves
  // that duplicate outside every zone after fixture relocation.
  for (const zone of Object.values(player.zones)) {
    for (const entry of zone) ids.push(fabEntryCardId(entry));
  }
  // Macros are handled by createFabMatchInitialState via the `macros` parameter —
  // they are not part of the instance pool.
  return ids;
}

function relocatePlayer(
  state: FabMatchState,
  playerId: string,
  materialized: MaterializedPlayer,
): void {
  const player = state.players[playerId];
  if (!player) return;

  player.life = materialized.life;

  // The production initializer draws an opening hand before the fixture can
  // relocate named cards. Reconstruct the original shuffled pool so explicit
  // fixture zones remain authoritative, then redraw only when the fixture did
  // not provide a hand of its own.
  const pool: string[] = [
    ...state.containers.zonesByPlayerId[playerId]!.deck,
    ...state.containers.zonesByPlayerId[playerId]!.hand.slice().reverse(),
  ];
  state.containers.zonesByPlayerId[playerId]!.deck.length = 0;
  state.containers.zonesByPlayerId[playerId]!.hand.length = 0;

  const take = (canonicalId: string): string => {
    const index = pool.findIndex((id) => state.objects[id]?.canonicalId === canonicalId);
    if (index === -1) {
      throw new Error(
        `FabTestEngine fixture requested more "${canonicalId}" than were provided for ${playerId}.`,
      );
    }
    const [instanceId] = pool.splice(index, 1);
    return instanceId as string;
  };

  for (const zoneKind of Object.keys(materialized.zones) as FabFixtureZoneKind[]) {
    const target = state.containers.zonesByPlayerId[playerId]![zoneKind];
    for (const entry of materialized.zones[zoneKind]) {
      const instanceId = take(fabEntryCardId(entry));
      target.push(instanceId);
      const object = state.objects[instanceId];
      if (object) {
        state.objects[instanceId] = {
          ...object,
          visibility: zoneVisibility(zoneKind),
        };
      }
    }
  }
  // Arena fixtures that name a real token model a token already created by a
  // prior legal effect. Keep its token-only lifecycle (cease on leaving the
  // arena and contribute to destroyed-token turn history) rather than treating
  // the token definition as a deck card.
  for (const instanceId of state.containers.zonesByPlayerId[playerId]!.arena) {
    const object = state.objects[instanceId];
    const definition = object ? state.cardDefinitions[object.canonicalId] : undefined;
    if (
      !object ||
      !definition?.base.typeBox.types.includes("Token") ||
      object.objectKind === "created-token"
    )
      continue;
    state.objects[instanceId] = { ...object, objectKind: "created-token" };
  }
  // Fixtures relocate cards after production initialization. Preserve the
  // same CR 3.3 arsenal invariant the initializer applies to production
  // snapshots; later explicit fixture setup may intentionally turn one up.
  for (const instanceId of state.containers.zonesByPlayerId[playerId]!.arsenal) {
    setFabFixtureObjectSetup(state, instanceId, { faceDown: true });
  }
  if (player.heroCardId) {
    const heroInstanceIndex = pool.findIndex(
      (id) => state.objects[id]?.canonicalId === player.heroCardId,
    );
    if (heroInstanceIndex !== -1) pool.splice(heroInstanceIndex, 1);
  }

  state.containers.zonesByPlayerId[playerId]!.deck.push(...pool);

  if (materialized.drawOpeningHand) {
    for (let i = 0; i < player.intellect; i++) {
      const card = state.containers.zonesByPlayerId[playerId]!.deck.pop();
      if (card) state.containers.zonesByPlayerId[playerId]!.hand.push(card);
    }
  }
}

/** Re-export the empty-zones helper for harness consumers. */
export { createEmptyFabZones };
