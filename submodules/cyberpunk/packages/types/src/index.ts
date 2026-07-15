/**
 * Major version of the card DSL schema. Bump when card data is no longer
 * structurally compatible with engines that target the previous version.
 *
 * Bump-policy. A change is **breaking** (requires a bump) when it can cause an
 * engine on the previous version to misinterpret a card from the new version,
 * or vice versa. In practice that means:
 *  - Removing or renaming a member of `Effect`, `Condition`, `Cost`, or
 *    `AbilityTrigger` / `EventTrigger.event` unions.
 *  - Removing or renaming a member of `RuleModifier`, `CardKeyword`,
 *    `TimingTrigger`, `ContextKey`.
 *  - Changing the shape of an existing effect/condition/cost/trigger
 *    (e.g. renaming a required field).
 *  - Removing a top-level `CardDefinition` field.
 *  - Tightening an enum (removing a previously-accepted value).
 *
 * A change is **non-breaking** (no bump needed) when:
 *  - Adding a new member to a discriminated union (engines fall through;
 *    cards using it are simply unsupported on older engines).
 *  - Adding a new optional field.
 *  - Loosening a constraint.
 *
 * When you bump, also update `MIN_SUPPORTED_DSL_VERSION` if older bundles can
 * no longer be read at all, and document the breaking change in the project
 * changelog.
 */
export const DSL_VERSION = 1 as const;

/**
 * Minimum DSL version the current engine code can still load. Bumped only
 * when older bundles can no longer be interpreted at all (rare). Until that
 * happens, an engine on `DSL_VERSION = N` accepts bundles in
 * `[MIN_SUPPORTED_DSL_VERSION, N]`.
 */
export const MIN_SUPPORTED_DSL_VERSION = 1 as const;

/**
 * Throws a clear, structured error if a bundle's `dslVersion` is not
 * compatible with the current engine. Call at the boundary where a bundle is
 * loaded (e.g. when an external consumer imports `cardBundle`, when a
 * persisted match is rehydrated, or when an external tool ingests card data).
 */
export function assertCompatibleDsl(bundleVersion: number): void {
  if (
    !Number.isInteger(bundleVersion) ||
    bundleVersion < MIN_SUPPORTED_DSL_VERSION ||
    bundleVersion > DSL_VERSION
  ) {
    throw new Error(
      `Incompatible card DSL version: bundle is v${bundleVersion}, engine accepts v${MIN_SUPPORTED_DSL_VERSION}..v${DSL_VERSION}`,
    );
  }
}

// Keyword-ability factories — canonical builders for `kind: "keyword"`
// abilities so the parser and every card file import from one place.
export * from "./keyword-abilities.ts";

import type { BaseCardDefinition } from "@tcg/card-model";

export type CardType = "legend" | "unit" | "gear" | "program";

export type RawCardType = "Legend" | "Unit" | "Gear" | "Program";

export type CardColor = "blue" | "green" | "red" | "yellow";

export type RawCardColor = "Blue" | "Green" | "Red" | "Yellow";

/**
 * Die side-counts used by the Gig system. Duplicated locally (rather than
 * imported from the engine) so the types package stays engine-free and cards
 * can author `sides`-based Gig filters without a runtime dependency.
 */
export type DieType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20";

export type TimingTrigger = "play" | "attack" | "flip" | "call" | "defeated";

export type RawTimingTrigger = "Play" | "Attack" | "Flip" | "Call" | "Defeated";

/**
 * Subset of {@link RuleModifier} that names the card *keywords* — rules that
 * appear on cards as named abilities (e.g. "BLOCKER", "GO SOLO") rather than
 * as static effects. Authoring an `Ability` with `kind: "keyword"` requires
 * the `keyword` field to be one of these values; the engine then looks up
 * the corresponding rule in `getEffectiveRules`.
 *
 * Defined as `Extract` so `CardKeyword` and `RuleModifier` share a single
 * source of truth: removing or renaming `"blocker"`/`"goSolo"` in
 * `RuleModifier` makes `CardKeyword` shrink correspondingly, and TypeScript
 * flags every card that uses the dropped keyword.
 */
export type CardKeyword = Extract<RuleModifier, "blocker" | "goSolo" | "adrenaline" | "quick">;

export type RawCardKeyword = "Blocker" | "Go Solo" | "Adrenaline" | "Quick";

export type RawHighlightedLabel = RawTimingTrigger | RawCardKeyword | (string & {});

export type KnownCardClassification =
  | "6th Street"
  | "AI"
  | "Aldecado"
  | "Arasaka"
  | "Braindance"
  | "Corpo"
  | "Cyberware"
  | "Doll"
  | "Drone"
  | "Extreme"
  | "Fixer"
  | "Ganger"
  | "Implant"
  | "Maine's Crew"
  | "Maelstrom"
  | "Medtech"
  | "Merc"
  | "Militech"
  | "Mox"
  | "Mystic"
  | "NCPD"
  | "Netrunner"
  | "Nomad"
  | "Overclocking"
  | "Plan"
  | "Quickhack"
  | "Ripperdoc"
  | "Raffen Shiv"
  | "Rocker"
  | "Rockerboy"
  | "Samurai"
  | "Scavenger"
  | "Tech"
  | "Techie"
  | "Trauma Team"
  | "Tyger Claws"
  | "Valentino"
  | "Vehicle"
  | "Voodoo Boys"
  | "Weapon"
  | "Zetatech";

export type CardClassification = KnownCardClassification;

export const KNOWN_SET_CODES = [
  "alpha",
  "PRM01",
  "arasakademodeck",
  "promo",
  "spoiler",
  "boxtoppersretail",
  "boxtoppersbeta",
  "embracingpowerbetastarterdeck",
  "embracingpowerretailstarterdeck",
  "mercdemodeck",
  "theheistbetastarterdeck",
  "theheistretailstarterdeck",
  "welcometonightcitybeta",
  "welcometonightcityretail",
] as const;

export type KnownSetCode = (typeof KNOWN_SET_CODES)[number];

export type SetCode = KnownSetCode;

export type KnownCardLegality = "legal";

export type CardLegality = KnownCardLegality;

export type KnownPrintFinish = "foil" | "standard";

export type PrintFinish = KnownPrintFinish;

/**
 * Cyberpunk in-game rarities. Cards and printings authored from the official
 * data carry exactly these Title-Case values (or `null` when no rarity is
 * supplied). This is intentionally separate from {@link AltArtRarityCode},
 * which is the atelier pricing taxonomy — not a card rarity.
 */
export type CardRarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Secret"
  | "Iconic Secret"
  | "Nova Rare";

/**
 * Atelier pricing-code taxonomy used by the platform alt-art
 * acquisition/rental system. This is NOT a Cyberpunk card rarity — it is the
 * set of price-bucket keys shared across games so the platform can apply a
 * single pricing table. Defined locally in the game submodule because game
 * workspaces cannot depend on `@tcg/api-core`. The literal values are
 * intentionally identical to `platform/.../engagement.ts::AltArtRarityCode` so
 * the platform adapter accepts them via structural typing — do not rename or
 * reorder these without updating the platform schema.
 *
 * Cyberpunk card rarities (Common/Uncommon/Rare/Epic) are mapped into these
 * pricing codes by `@tcg/cyberpunk-cards/src/atelier.ts`.
 */
export type AltArtRarityCode =
  | "common"
  | "uncommon"
  | "rare"
  | "super_rare"
  | "legendary"
  | "epic"
  | "iconic"
  | "enchanted"
  | "promo"
  | "special";

export interface CardIdentity {
  /**
   * Authored / source id — a per-set UUID, NOT a canonical key. The same
   * gameplay card reprinted across spoiler/alpha/retail carries DIFFERENT `id`
   * values, so grouping or deduping by raw `id` over-counts reprints (RFC §3
   * "Cyberpunk id trap"). Source-only: never use this as a cross-set identity.
   * The canonical identity is `canonicalId` (the merged slug — see
   * `CardCatalogMetadata.canonicalId` / `getMergedCyberpunkCardsById`).
   */
  id: string;
  slug: string;
  name: string;
  subname?: string | null;
  displayName: string;
}

export interface CardText {
  rulesText?: string | null;
  flavorText?: string | null;
  description?: string | null;
  youtubeUrl?: string | null;
  sourceUrl?: string | null;
}

export interface CardSet {
  code: SetCode;
  name: string;
}

/**
 * A single physical printing of a Cyberpunk card.
 *
 * Satisfies the cross-game `Printing` contract (`@tcg/card-model`):
 *  - `artId` is platform-derived and 1:1 with `id` today (`artId = id`) —
 *    Cyberpunk does not reuse illustrations across sets yet (RFC §4, §7). Set
 *    by the merge layer, not authored per literal.
 *  - `rarity` is a game-native string. Cyberpunk printings may carry no rarity
 *    (represented as the empty string `""`), which the atelier prices as
 *    `"common"` via `cyberpunkRarityCode`.
 *  - `imageUrl` is the deterministic CDN URL for this printing, derived from
 *    `(setCode, collectorNumber)` (see `getCyberpunkPrintingImageUrl`).
 */
export interface CardPrinting {
  id: string;
  artId: string;
  collectorNumber: string;
  setCode: SetCode;
  rarity: string;
  imageUrl: string;
}

/**
 * Catalog metadata for a Cyberpunk card. Literally `extends BaseCardDefinition`
 * (RFC ADR-11) so the cross-game `GameCardPayload` union and platform features
 * can read the unified identity fields (`canonicalId`, `slug`, `name`,
 * `printings[]`, `externalIds?`) without per-game branching.
 */
export interface CardCatalogMetadata extends BaseCardDefinition, CardIdentity, CardText {
  /**
   * Canonical gameplay identity — the merged slug (one per gameplay card across
   * every reprint). Populated by the merge layer
   * (`getMergedCyberpunkCardsById` / `submodules/cyberpunk/packages/cards/src/merged.ts`),
   * NOT derived from raw `id`. The raw `id` is per-set and source-only (see
   * `CardIdentity.id`, RFC §3); `canonicalId == slug` post-merge. Uniqueness
   * anchor: `(gameSlug, canonicalId)`.
   *
   * (Redeclared here only to attach the Cyberpunk-specific doc; the field is
   * inherited from `BaseCardDefinition`.)
   */
  canonicalId: string;
  color: CardColor;
  classifications: CardClassification[];
  set: CardSet;
  printNumber: string;
  printings: CardPrinting[];
  selectedPrintingId?: string | null;
  artist: string;
  imageUrl: string;
  rarity: CardRarity | null;
  legality: CardLegality;
  hasSellTag: boolean;
}

export interface CardDefinitionBase extends CardCatalogMetadata {
  type: CardType;
  ram: number | null;
  timingTriggers: TimingTrigger[];
  keywords: CardKeyword[];
}

export interface LegendCardDefinition extends CardDefinitionBase {
  type: "legend";
  cost?: number | null;
  power?: number | null;
}

export interface UnitCardDefinition extends CardDefinitionBase {
  type: "unit";
  cost: number;
  power: number;
}

export interface GearCardDefinition extends CardDefinitionBase {
  type: "gear";
  cost: number;
  power: number;
}

export interface ProgramCardDefinition extends CardDefinitionBase {
  type: "program";
  cost: number;
  power: null;
}

export type CardDefinition =
  | LegendCardDefinition
  | UnitCardDefinition
  | GearCardDefinition
  | ProgramCardDefinition;

export interface RawCardSet {
  code: SetCode;
  name: string;
}

export interface RawCardPrinting {
  id: string;
  collector_number: string;
  image_url: string;
  source_image_url: string;
  set: RawCardSet;
  rarity?: CardRarity | null;
  finish: PrintFinish;
  artist: string;
}

export interface RawCardRecord {
  id: string;
  external_id: string;
  name: string;
  subname?: string | null;
  display_name: string;
  slug: string;
  rules_text?: string | null;
  flavor_text?: string | null;
  description?: string | null;
  youtube_url?: string | null;
  source_url?: string | null;
  set: RawCardSet;
  rarity: CardRarity | null;
  image_url: string;
  source_image_url: string;
  color: RawCardColor;
  card_type: RawCardType;
  is_eddiable: boolean;
  classifications: CardClassification[];
  keywords: RawHighlightedLabel[];
  cost?: number | null;
  power?: number | null;
  ram: number | null;
  artist: string;
  print_number: string;
  printings: RawCardPrinting[];
  selected_printing_id?: string | null;
  legality: CardLegality;
}

export type Comparison = "eq" | "gt" | "gte" | "lt" | "lte";

export type RelativePlayer = "friendly" | "rival" | "owner";

export type EventPlayer = RelativePlayer | "any";

export type CardZone = "field" | "hand" | "deck" | "trash" | "legendArea" | "gigArea" | "eddieArea";

export type CardState = "ready" | "spent";

export type CardFace = "faceUp" | "faceDown";

export type AbilityKind = "keyword" | "static" | "triggered";

export type AbilityDuration = "turn" | "continuous" | "permanent" | "untilSourceNextTurn";

export type AbilityLimit = "firstTimeEachTurn";

export type RuleModifier =
  | "blocker"
  | "goSolo"
  | "cantAttack"
  | "cantBeBlocked"
  | "mustAttack"
  | "requiresProgramPlayedThisTurn"
  | "canAttackOnPlayedTurnAgainstUnits"
  | "canAttackRivalOnPlayedTurn"
  | "adrenaline"
  | "quick"
  | "stealsOneFewerGig";

export interface PerCountValue {
  type: "perCount";
  multiplier: number;
  target: TargetDSL;
}

export interface MaxGigValue {
  type: "maxGigValue";
  controller: RelativePlayer;
}

export interface GigValue {
  type: "gigValue";
  target: TargetDSL;
}

export type NumericValue = number | PerCountValue | MaxGigValue | GigValue;

export interface SelfTargetDSL {
  selector: "self";
}

export interface HostTargetDSL {
  selector: "host";
}

export interface BoundTargetDSL {
  selector: "bound";
  id: string;
  index?: number;
  /**
   * Optional sub-filter on the captured binding. When present, the bound card
   * ids are narrowed to those whose card type matches (e.g. capture 3 trashed
   * cards, then keep only the Units). Purely opt-in — existing bound targets
   * without this field behave exactly as before.
   */
  cardTypes?: CardType[];
  /**
   * Offer the bound ids as a player choice (suspends into a `chooseTarget`
   * pending choice) instead of applying the effect to all of them. Lets a
   * card say "choose a Unit from among the just-trashed cards."
   */
  selection?: TargetSelectionDSL;
}

/**
 * Closed enum of context keys the engine publishes during event resolution.
 * Each key corresponds to a literal in `buildContextTargets` in
 * packages/engine/src/ability-executor.ts. When you add a new key on the
 * engine side, add the literal here too — TypeScript will then flag every
 * card that consumes it (and reject typos).
 */
export type ContextKey = "triggerCard" | "triggeredGigs" | "discardedCards";

export interface ContextTargetDSL {
  selector: "context";
  key: ContextKey;
  selection?: TargetSelectionDSL;
}

export interface TargetSelectionDSL {
  mode: "choose";
  min: number;
  max: number;
}

export interface CardTargetDSL {
  selector: "card";
  controller?: RelativePlayer;
  zones?: CardZone[];
  cardTypes?: CardType[];
  colors?: CardColor[];
  classifications?: CardClassification[];
  state?: CardState;
  face?: CardFace;
  minCost?: number;
  maxCost?: number;
  maxCostOf?: TargetDSL;
  minPower?: number;
  maxPower?: number;
  maxPowerOfGigValueOf?: TargetDSL;
  excludeSelf?: boolean;
  hasAttachedCards?: boolean;
  attachedTo?: TargetDSL;
  costEqualsGigValueOf?: TargetDSL;
  powerEqualsGigValueOf?: TargetDSL;
  /**
   * Restrict to cards whose effective power is strictly less than at least
   * one card resolved by the referenced target (e.g. "rival Unit with less
   * power than a friendly Unit").
   */
  powerLessThanAnyOf?: TargetDSL;
  selection?: TargetSelectionDSL;
}

export interface GigTargetDSL {
  selector: "gig";
  controller?: RelativePlayer;
  amount?: number | "all";
  sameValueAs?: TargetDSL;
  valueNotSharedBy?: TargetDSL;
  sameSidesAs?: TargetDSL;
  /**
   * Filter dice by their side-count (e.g. "a d6"). Omitting the field keeps
   * backwards-compatible behavior (no sides filter).
   */
  sides?: DieType | DieType[];
  minValue?: number;
  maxValue?: number;
  /**
   * Restrict to dice currently showing their die type's maximum face value.
   */
  atMax?: boolean;
  /**
   * Filter dice by the parity of their face value. Used by cards that count
   * "even" or "odd" Gig values (e.g. Jackie Welles — Ride or Die Choom).
   * Omitting the field keeps backwards-compatible behavior (no parity filter).
   */
  valueParity?: "even" | "odd";
  selection?: TargetSelectionDSL;
}

/**
 * Resolves to the attacking card in the current attack state (the Unit that
 * declared the direct attack or fight). Returns an empty array when no attack
 * is in progress. Optional `classifications` / `cardTypes` filters narrow the
 * resolved attacker (e.g. only AI/Drone/Vehicle attackers).
 */
export interface AttackerTargetDSL {
  selector: "attacker";
  cardTypes?: CardType[];
  classifications?: CardClassification[];
}

export type TargetDSL =
  | SelfTargetDSL
  | HostTargetDSL
  | BoundTargetDSL
  | ContextTargetDSL
  | CardTargetDSL
  | GigTargetDSL
  | AttackerTargetDSL;

export interface StreetCredCondition {
  condition: "streetCred";
  controller: RelativePlayer;
  comparison: Comparison;
  value: number;
}

/**
 * Compare one player's total Street Cred against another player's. Used by
 * cards that conditionally modify their effect based on Street Cred parity
 * (e.g. "if you have more Street Cred than a Rival").
 */
export interface StreetCredComparisonCondition {
  condition: "streetCredComparison";
  controller: RelativePlayer;
  comparison: Comparison;
  other: RelativePlayer;
}

export interface GigCountComparisonCondition {
  condition: "gigCountComparison";
  controller: RelativePlayer;
  comparison: Comparison;
  other: RelativePlayer;
}

export interface StreetCredDifferenceCondition {
  condition: "streetCredDifference";
  controller: RelativePlayer;
  comparison: Comparison;
  other: RelativePlayer;
  value: number;
}

export interface StreetCredParityCondition {
  condition: "streetCredParity";
  controller: RelativePlayer;
  parity: "even" | "odd";
}

export interface AllFriendlyLegendsFaceUpCondition {
  condition: "allFriendlyLegendsFaceUp";
}

export interface CardStateCondition {
  condition: "cardState";
  target: TargetDSL;
  state?: CardState;
  face?: CardFace;
}

export interface TurnCondition {
  condition: "turn";
  player: RelativePlayer;
}

export interface OvertimeCondition {
  condition: "overtime";
  active?: boolean;
}

export interface TargetValueCondition {
  condition: "targetValue";
  target: TargetDSL;
  property: "gigValue";
  comparison: Comparison;
  value: number | "min" | "max";
}

export interface AttackingCondition {
  condition: "attacking";
  target: TargetDSL;
}

export interface LagCondition {
  condition: "hasLag";
  target: TargetDSL;
}

export interface HasGigAtMaxValueCondition {
  condition: "hasGigAtMaxValue";
  controller: RelativePlayer;
}

export interface HasGigPairCondition {
  condition: "hasGigPair";
  controller: RelativePlayer;
}

export interface HasDistinctGigValuesCondition {
  condition: "hasDistinctGigValues";
  controller: RelativePlayer;
  minCount: number;
}

export interface HasMinGigCondition {
  condition: "hasMinGig";
  controller: RelativePlayer;
}

export interface HasEvenAndOddGigValuesCondition {
  condition: "hasEvenAndOddGigValues";
  controller: RelativePlayer;
}

export interface HasEquippedUnitsOrLegendsCondition {
  condition: "hasEquippedUnitsOrLegends";
  controller: RelativePlayer;
  minCount: number;
}

export interface MatchingGigCondition {
  condition: "matchingGig";
  controller: RelativePlayer;
  target: TargetDSL;
  property: "value" | "sides";
}

export interface FightKindCondition {
  condition: "fightKind";
  target: TargetDSL;
  kind: "fight" | "direct";
  opponent?: CardTargetDSL;
}

export interface CostMatchesGigCondition {
  condition: "costMatchesGig";
  target: TargetDSL;
  controller: RelativePlayer;
}

/**
 * Compare a card stat (effective power or printed cost) of a resolved target
 * against a literal number. Used by cards that condition on "this Unit has
 * power 5+" etc. Only the first resolved card is evaluated.
 */
export interface CardStatCondition {
  condition: "cardStat";
  target: TargetDSL;
  property: "power" | "cost";
  comparison: Comparison;
  value: number;
}

/**
 * True when any resolved target card's printed `name` matches `name` exactly.
 * Used by cards that condition on the host being a specific named character
 * (e.g. Dying Night — V's Pistol's "if this Unit is named V" clause). Matches
 * `defOf(card).name`, so legends that use `name: "V"` + `subname: "…"` match
 * while similarly-named cards like "Viktor Vektor" do not.
 */
export interface CardNameCondition {
  condition: "cardName";
  target: TargetDSL;
  name: string;
}

/**
 * True when the resolved target is non-empty. Used by cards that condition an
 * effect on the existence of a game object (e.g. "if the attacker is an AI,
 * Drone, or Vehicle, draw 1").
 */
export interface TargetExistsCondition {
  condition: "targetExists";
  target: TargetDSL;
}

export interface GigSidesCondition {
  condition: "gigSides";
  target: TargetDSL;
  sides: DieType | DieType[];
}

export type Condition =
  | StreetCredCondition
  | StreetCredComparisonCondition
  | GigCountComparisonCondition
  | StreetCredDifferenceCondition
  | StreetCredParityCondition
  | AllFriendlyLegendsFaceUpCondition
  | CardStateCondition
  | TurnCondition
  | OvertimeCondition
  | TargetValueCondition
  | AttackingCondition
  | LagCondition
  | HasGigAtMaxValueCondition
  | HasGigPairCondition
  | HasDistinctGigValuesCondition
  | HasMinGigCondition
  | HasEvenAndOddGigValuesCondition
  | HasEquippedUnitsOrLegendsCondition
  | MatchingGigCondition
  | FightKindCondition
  | CostMatchesGigCondition
  | CardStatCondition
  | CardNameCondition
  | TargetExistsCondition
  | GigSidesCondition;

export interface SpendCost {
  cost: "spend";
  target: TargetDSL;
}

export interface PayCardCost {
  cost: "payCardCost";
}

export interface PayEddiesCost {
  cost: "payEddies";
  amount: number;
}

export type Cost = SpendCost | PayCardCost | PayEddiesCost;

export interface EffectBase {
  conditions?: Condition[];
  optional?: boolean;
}

export interface DefeatEffect extends EffectBase {
  effect: "defeat";
  target: TargetDSL;
}

export interface SpendEffect extends EffectBase {
  effect: "spend";
  target: TargetDSL;
}

export interface ReturnToHandEffect extends EffectBase {
  effect: "returnToHand";
  target: TargetDSL;
  destinationOwner?: "owner";
}

export interface DrawEffect extends EffectBase {
  effect: "draw";
  player: RelativePlayer;
  /**
   * Number of cards to draw. Supports `PerCountValue` (e.g. "draw 1 for each
   * friendly Gig with an odd value") in addition to a plain literal. Plain
   * numbers remain the common case.
   */
  amount: number | PerCountValue;
}

export interface ModifyGigEffect extends EffectBase {
  effect: "modifyGig";
  target: TargetDSL;
  operation: "increase" | "decrease" | "set";
  value: number;
}

export interface AdjustGigEffect extends EffectBase {
  effect: "adjustGig";
  target: TargetDSL;
  maxAmount: number;
  direction: "increase" | "decrease" | "either";
  chooseUpTo?: boolean;
}

export interface ModifyPowerEffect extends EffectBase {
  effect: "modifyPower";
  target: TargetDSL;
  value: NumericValue;
  duration: AbilityDuration;
}

export interface MultiplyPowerEffect extends EffectBase {
  effect: "multiplyPower";
  target: TargetDSL;
  multiplier: number;
  duration: AbilityDuration;
}

export interface GrantRuleEffect extends EffectBase {
  effect: "grantRule";
  target: TargetDSL;
  rule: RuleModifier;
  // Engine handler does not support "permanent" — rule grants live as ActiveEffects.
  duration: Exclude<AbilityDuration, "permanent">;
}

export interface ReadyEffect extends EffectBase {
  effect: "ready";
  target: TargetDSL;
}

export interface ReadyEddiesEffect extends EffectBase {
  effect: "readyEddies";
  player: RelativePlayer;
  amount: number;
}

export interface LookAtEffect extends EffectBase {
  effect: "lookAt";
  target: TargetDSL;
  revealToOpponent: boolean;
}

export type ScryDestinationZone = "hand" | "trash" | "deckTop" | "deckBottom";

export type ScryCardOrdering = "original" | "random" | "playerChoice";

export interface ScryDestination {
  zone: ScryDestinationZone;
  min?: number;
  max?: number;
  target?: CardTargetDSL;
  reveal?: boolean;
  remainder?: boolean;
  order?: ScryCardOrdering;
}

export interface ScryEffect extends EffectBase {
  effect: "scry";
  player: RelativePlayer;
  amount: number;
  destinations: ScryDestination[];
}

export interface SearchDeckEffect extends EffectBase {
  effect: "searchDeck";
  player: RelativePlayer;
  lookCount: number;
  target: CardTargetDSL;
  select: { kind: "all" } | { kind: "upTo"; max: number };
  reveal: boolean;
  destination: ScryDestinationZone;
  remainder?: {
    zone: ScryDestinationZone;
    order?: ScryCardOrdering;
  };
}

export interface RivalRevealChoiceEffect extends EffectBase {
  effect: "rivalRevealChoice";
  player: RelativePlayer;
  lookCount: number;
  destinations: ["hand", "trash"];
  drawIfDestination?: {
    destination: "hand" | "trash";
    player: RelativePlayer;
    amount: number;
  };
}

export interface DiscardFromHandEffect extends EffectBase {
  effect: "discardFromHand";
  player: RelativePlayer;
  amount: number;
  target?: CardTargetDSL;
  logReason?: "costMatchedFriendlyGig";
}

export interface MoveCardEffect extends EffectBase {
  effect: "moveCard";
  target: TargetDSL;
  destination: "hand" | "trash" | "field" | "deckBottom";
  attachTo?: TargetDSL;
  free?: boolean;
}

export interface PlayCardEffect extends EffectBase {
  effect: "playCard";
  target: TargetDSL;
  free?: boolean;
  attachTo?: TargetDSL;
}

/**
 * Equip a Gear from a friendly zone (typically `hand`) onto a specific
 * target (resolved via {@link TargetDSL}, usually a binding). Distinct from
 * {@link PlayCardEffect} so card authors don't have to overload `playCard`
 * + `attachTo` to express "equip" — the type makes the equip semantic
 * explicit at the DSL surface and the runtime delegates to the same play
 * pipeline under the hood.
 *
 * The `target` should be a `CardTargetDSL` filtering for `cardTypes:
 * ["gear"]`. The `attachTo` is required (an equip without an attachment
 * target is meaningless).
 */
export interface AttachCardEffect extends EffectBase {
  effect: "attachCard";
  target: TargetDSL;
  attachTo: TargetDSL;
  free?: boolean;
}

export interface RemoveFromGameEffect extends EffectBase {
  effect: "removeFromGame";
  target: TargetDSL;
}

export interface StealGigEffect extends EffectBase {
  effect: "stealGig";
  target: TargetDSL;
}

export interface TrashFromDeckEffect extends EffectBase {
  effect: "trashFromDeck";
  player: RelativePlayer;
  amount: number;
  /**
   * Optional binding key that receives the ids of the cards trashed by this
   * effect. A later effect in the same ability can read them via
   * `{ selector: "bound", id: <outputBinding> }` (e.g. "Trash 3. Add a Unit
   * from among them to your hand."). Purely opt-in.
   */
  outputBinding?: string;
}

export interface SellFromDeckEffect extends EffectBase {
  effect: "sellFromDeck";
  player: RelativePlayer;
  amount: number;
}

export interface IfYouDoEffect extends EffectBase {
  effect: "ifYouDo";
  doEffect: Effect;
  ifEffects: Effect[];
  elseEffects?: Effect[];
}

export interface DelayedEffect extends EffectBase {
  effect: "delayed";
  timing: "endOfTurn" | "afterTriggerResolution";
  effects: Effect[];
}

export interface DefeatAtEndOfTurnIfAttacksEffect extends EffectBase {
  effect: "defeatAtEndOfTurnIfAttacks";
  target: TargetDSL;
}

export interface PreventNextRivalFightDefeatEffect extends EffectBase {
  effect: "preventNextRivalFightDefeat";
  duration: "turn";
}

/**
 * Set one Gig die's face value to the face value of another Gig. The
 * destination die's value is clamped to its own [1, max-sides] range.
 * Both `source` and `target` should resolve to a single Gig.
 */
export interface CopyGigValueEffect extends EffectBase {
  effect: "copyGigValue";
  source: TargetDSL;
  target: TargetDSL;
}

/**
 * Repeat the wrapped effects once for each friendly value-pair of Gigs the
 * controller currently has. A value-pair is a pair of Gigs with the same
 * face value; with three friendly dice, the count is 1 if any two match
 * and 3 if all three match.
 */
export interface ForEachFriendlyGigPairEffect extends EffectBase {
  effect: "forEachFriendlyGigPair";
  effects: Effect[];
}

export interface CallLegendEffect extends EffectBase {
  effect: "callLegend";
  player: RelativePlayer;
  target: TargetDSL;
  free?: boolean;
}

export interface GrantCostModifierEffect extends EffectBase {
  effect: "grantCostModifier";
  player: RelativePlayer;
  appliesTo: CardTargetDSL;
  modifier: CostModifier;
  duration: "turn" | "untilSourceNextTurn";
  uses?: number;
}

export interface RerollGigEffect extends EffectBase {
  effect: "rerollGig";
  target: TargetDSL;
}

export interface RevealTopCardTypeEffect extends EffectBase {
  effect: "revealTopCardType";
  player: RelativePlayer;
  cardTypes: CardType[];
}

export interface RevealTopCardAndModifyPowerByCostEffect extends EffectBase {
  effect: "revealTopCardAndModifyPowerByCost";
  player: RelativePlayer;
  target: TargetDSL;
  duration: "turn" | "continuous";
}

export type Effect =
  | DefeatEffect
  | SpendEffect
  | ReturnToHandEffect
  | DrawEffect
  | ModifyGigEffect
  | AdjustGigEffect
  | ModifyPowerEffect
  | GrantRuleEffect
  | ReadyEffect
  | ReadyEddiesEffect
  | LookAtEffect
  | ScryEffect
  | SearchDeckEffect
  | RivalRevealChoiceEffect
  | DiscardFromHandEffect
  | MoveCardEffect
  | PlayCardEffect
  | AttachCardEffect
  | RemoveFromGameEffect
  | StealGigEffect
  | TrashFromDeckEffect
  | SellFromDeckEffect
  | IfYouDoEffect
  | DelayedEffect
  | DefeatAtEndOfTurnIfAttacksEffect
  | PreventNextRivalFightDefeatEffect
  | MultiplyPowerEffect
  | CopyGigValueEffect
  | ForEachFriendlyGigPairEffect
  | CallLegendEffect
  | GrantCostModifierEffect
  | RerollGigEffect
  | RevealTopCardTypeEffect
  | RevealTopCardAndModifyPowerByCostEffect;

export interface PlayTrigger {
  trigger: "play";
}

export interface AttackTrigger {
  trigger: "attack";
}

export interface FlipTrigger {
  trigger: "flip";
}

export interface CallTrigger {
  trigger: "call";
}

export interface ActivatedTrigger {
  trigger: "activated";
}

export interface DefeatedTrigger {
  trigger: "defeated";
}

export interface CardPlayedEvent {
  event: "cardPlayed";
  player: RelativePlayer;
  target: CardTargetDSL;
}

export interface CardAttacksEvent {
  event: "cardAttacks";
  player: EventPlayer;
  target: CardTargetDSL;
}

export interface CardSpentEvent {
  event: "cardSpent";
  player: EventPlayer;
  target: TargetDSL;
}

export interface CardDefeatedEvent {
  event: "cardDefeated";
  player: EventPlayer;
  target: CardTargetDSL;
}

export interface BlockerActivatedEvent {
  event: "blockerActivated";
  player: EventPlayer;
  target: TargetDSL;
}

export interface TurnEndedEvent {
  event: "turnEnded";
  player: EventPlayer;
}

export interface GigStolenEvent {
  event: "gigStolen";
  player: RelativePlayer;
  target: GigTargetDSL;
  minAmount?: number;
  source?: TargetDSL;
}

export interface GigValueChangedEvent {
  event: "gigValueChanged";
  player: RelativePlayer;
  target: GigTargetDSL;
  direction?: "increase" | "decrease";
}

export interface GigRolledEvent {
  event: "gigRolled";
  player: RelativePlayer;
  target: GigTargetDSL;
  origin?: "gainGig" | "reroll";
}

/**
 * Outcome of a fight (unit-vs-unit attack) after combat resolves.
 * Used by FightResolvedEvent. The full engine `attackResolved` event also
 * carries `gigsStolen` / `blocked` for direct attacks; the DSL surface
 * exposes only the fight-resolution subset.
 */
export type FightResult = "attackerWins" | "defenderWins" | "mutual";

/**
 * Fires after a fight (unit-vs-unit attack) resolves, exposing the outcome.
 * Cards use this for "If this unit wins a fight, …" effects (e.g. Satori).
 *
 * `attackKind: "fight"` only — direct attacks, gig-steal-only resolutions,
 * and blocked attacks do not fire this event.
 */
export interface FightResolvedEvent {
  event: "fightResolved";
  /** Who controls the attacker. "any" matches both. */
  player: EventPlayer;
  /** Required filter on the fight outcome. */
  result: FightResult;
  /** Optional filter on the attacker. */
  attacker?: TargetDSL;
  /** Optional filter on the defender. */
  defender?: TargetDSL;
}

export interface EventTrigger {
  trigger: "event";
  event:
    | CardPlayedEvent
    | CardAttacksEvent
    | CardSpentEvent
    | CardDefeatedEvent
    | BlockerActivatedEvent
    | TurnEndedEvent
    | GigStolenEvent
    | GigRolledEvent
    | GigValueChangedEvent
    | FightResolvedEvent;
}

export type AbilityTrigger =
  | PlayTrigger
  | AttackTrigger
  | FlipTrigger
  | CallTrigger
  | ActivatedTrigger
  | DefeatedTrigger
  | EventTrigger;

export interface AbilityTargetBinding {
  id: string;
  target: TargetDSL;
}

export interface Ability {
  kind: AbilityKind;
  text: string;
  keyword?: CardKeyword;
  source?: TargetDSL;
  trigger?: AbilityTrigger;
  limits?: AbilityLimit[];
  bindings?: AbilityTargetBinding[];
  conditions?: Condition[];
  costs?: Cost[];
  effects: Effect[];
}

export interface AttachmentDefinition {
  text: string;
  target: CardTargetDSL;
}

/**
 * Reduce a card's effective play cost based on a count derived from game
 * state. The reduction is `reductionPerCount × |resolveTarget(target)|`,
 * clamped so the effective cost never drops below `min`.
 */
export interface CostReducerPerTargetCount {
  reducer: "perTargetCount";
  reductionPerCount: number;
  target: TargetDSL;
  min: number;
}

export type CostModifier = CostReducerPerTargetCount;

export interface StructuredCardData {
  abilities: Ability[];
  attachment?: AttachmentDefinition | null;
  reminderText: string[];
  /**
   * Optional cost modifier evaluated when the card is played from hand. The
   * engine consults the controller's state at play-time to compute the
   * effective cost; the static `cost` field stays at the printed value.
   */
  costModifier?: CostModifier | null;
}

export type StructuredCardDefinition = CardDefinition;

export interface LegendCardDefinition extends StructuredCardData {}
export interface UnitCardDefinition extends StructuredCardData {}
export interface GearCardDefinition extends StructuredCardData {}
export interface ProgramCardDefinition extends StructuredCardData {}

export type AlphaCardDefinition = StructuredCardDefinition & {
  set: CardSet & {
    code: "alpha";
  };
};

export type SpoilerCardDefinition = StructuredCardDefinition & {
  set: CardSet & {
    code: "spoiler";
  };
};

export type PromoCardDefinition = StructuredCardDefinition & {
  set: CardSet & {
    code: "promo";
  };
};

export type Prm01CardDefinition = StructuredCardDefinition & {
  set: CardSet & {
    code: "PRM01";
  };
};

export type BoxToppersRetailCardDefinition = StructuredCardDefinition & {
  set: CardSet & {
    code: "boxtoppersretail";
  };
};

export type TheHeistRetailStarterDeckCardDefinition = StructuredCardDefinition & {
  set: CardSet & {
    code: "theheistretailstarterdeck";
  };
};

export type EmbracingPowerRetailStarterDeckCardDefinition = StructuredCardDefinition & {
  set: CardSet & {
    code: "embracingpowerretailstarterdeck";
  };
};

export type WelcomeToNightCityRetailCardDefinition = StructuredCardDefinition & {
  set: CardSet & {
    code: "welcometonightcityretail";
  };
};

export interface StructuredCardDefinitionBySetCode {
  alpha: AlphaCardDefinition;
  spoiler: SpoilerCardDefinition;
  promo: PromoCardDefinition;
  PRM01: Prm01CardDefinition;
  boxtoppersretail: BoxToppersRetailCardDefinition;
  theheistretailstarterdeck: TheHeistRetailStarterDeckCardDefinition;
  embracingpowerretailstarterdeck: EmbracingPowerRetailStarterDeckCardDefinition;
  welcometonightcityretail: WelcomeToNightCityRetailCardDefinition;
}

export type StructuredSetCode = keyof StructuredCardDefinitionBySetCode;
