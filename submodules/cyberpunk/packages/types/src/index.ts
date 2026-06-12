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

export type CardType = "legend" | "unit" | "gear" | "program";

export type RawCardType = "Legend" | "Unit" | "Gear" | "Program";

export type CardColor = "blue" | "green" | "red" | "yellow";

export type RawCardColor = "Blue" | "Green" | "Red" | "Yellow";

export type TimingTrigger = "play" | "attack" | "flip" | "call";

export type RawTimingTrigger = "Play" | "Attack" | "Flip" | "Call";

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
  | "Aldecado"
  | "Arasaka"
  | "Braindance"
  | "Corpo"
  | "Cyberware"
  | "Doll"
  | "Drone"
  | "Extreme"
  | "Ganger"
  | "Implant"
  | "Maelstrom"
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
  | "Tech"
  | "Tyger Claws"
  | "Valentino"
  | "Vehicle"
  | "Voodoo Boys"
  | "Weapon"
  | "Zetatech";

export type CardClassification = KnownCardClassification;

export const KNOWN_SET_CODES = [
  "alpha",
  "promo",
  "spoiler",
  "boxtoppersretail",
  "boxtoppersbeta",
  "embracingpowerbetastarterdeck",
  "embracingpowerretailstarterdeck",
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

export type CardRarity = string;

export interface CardIdentity {
  id: string;
  externalId: string;
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

export interface CardPrinting {
  id: string;
  collectorNumber: string;
  imageUrl: string;
  sourceImageUrl: string;
  set: CardSet;
  rarity: CardRarity | null;
  finish: PrintFinish;
  artist: string;
}

export interface CardCatalogMetadata extends CardIdentity, CardText {
  color: CardColor;
  classifications: CardClassification[];
  set: CardSet;
  printNumber: string;
  printings: CardPrinting[];
  selectedPrintingId?: string | null;
  artist: string;
  imageUrl: string;
  sourceImageUrl: string;
  rarity: CardRarity | null;
  legality: CardLegality;
  hasSellTag: boolean;
}

export interface CardDefinitionBase extends CardCatalogMetadata {
  type: CardType;
  ram: number;
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
  ram: number;
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
  | "canAttackOnPlayedTurnAgainstUnits"
  | "adrenaline"
  | "quick";

export interface PerCountValue {
  type: "perCount";
  multiplier: number;
  target: TargetDSL;
}

export interface MaxGigValue {
  type: "maxGigValue";
  controller: RelativePlayer;
}

export type NumericValue = number | PerCountValue | MaxGigValue;

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
  minPower?: number;
  maxPower?: number;
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
  minValue?: number;
  maxValue?: number;
  selection?: TargetSelectionDSL;
}

export type TargetDSL =
  | SelfTargetDSL
  | HostTargetDSL
  | BoundTargetDSL
  | ContextTargetDSL
  | CardTargetDSL
  | GigTargetDSL;

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

export interface PlayedThisTurnCondition {
  condition: "playedThisTurn";
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

export type Condition =
  | StreetCredCondition
  | StreetCredComparisonCondition
  | CardStateCondition
  | TurnCondition
  | OvertimeCondition
  | TargetValueCondition
  | AttackingCondition
  | PlayedThisTurnCondition
  | HasGigAtMaxValueCondition
  | HasGigPairCondition
  | HasDistinctGigValuesCondition
  | HasMinGigCondition
  | HasEquippedUnitsOrLegendsCondition
  | MatchingGigCondition
  | FightKindCondition
  | CostMatchesGigCondition;

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
  amount: number;
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

export type SearchDeckSelect =
  | { kind: "upTo"; max: number }
  | { kind: "exact"; amount: number }
  | { kind: "all" };

export interface SearchDeckEffect extends EffectBase {
  effect: "searchDeck";
  player: RelativePlayer;
  lookCount: number;
  target: CardTargetDSL;
  select: SearchDeckSelect;
  reveal: boolean;
  destination: "hand" | "trash";
  remainder: {
    zone: "deckBottom" | "trash";
    order?: "random";
  };
}

export interface DiscardFromHandEffect extends EffectBase {
  effect: "discardFromHand";
  player: RelativePlayer;
  amount: number;
  target?: CardTargetDSL;
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
}

export interface IfYouDoEffect extends EffectBase {
  effect: "ifYouDo";
  doEffect: Effect;
  ifEffects: Effect[];
  elseEffects?: Effect[];
}

export interface DelayedEffect extends EffectBase {
  effect: "delayed";
  timing: "endOfTurn";
  effects: Effect[];
}

export interface DefeatAtEndOfTurnIfAttacksEffect extends EffectBase {
  effect: "defeatAtEndOfTurnIfAttacks";
  target: TargetDSL;
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
  | SearchDeckEffect
  | DiscardFromHandEffect
  | MoveCardEffect
  | PlayCardEffect
  | AttachCardEffect
  | RemoveFromGameEffect
  | StealGigEffect
  | TrashFromDeckEffect
  | IfYouDoEffect
  | DelayedEffect
  | DefeatAtEndOfTurnIfAttacksEffect
  | MultiplyPowerEffect
  | CopyGigValueEffect
  | ForEachFriendlyGigPairEffect
  | CallLegendEffect
  | GrantCostModifierEffect;

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
  target: CardTargetDSL;
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

export type StructuredCardDefinition = CardDefinition & StructuredCardData;

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

export type WelcomeToNightCityRetailCardDefinition = StructuredCardDefinition & {
  set: CardSet & {
    code: "welcometonightcityretail";
  };
};

export interface StructuredCardDefinitionBySetCode {
  alpha: AlphaCardDefinition;
  spoiler: SpoilerCardDefinition;
  promo: PromoCardDefinition;
  boxtoppersretail: BoxToppersRetailCardDefinition;
  theheistretailstarterdeck: TheHeistRetailStarterDeckCardDefinition;
  welcometonightcityretail: WelcomeToNightCityRetailCardDefinition;
}

export type StructuredSetCode = keyof StructuredCardDefinitionBySetCode;
