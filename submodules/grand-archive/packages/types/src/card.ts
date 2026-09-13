import type {
  GrandArchiveCardType,
  GrandArchiveClass,
  GrandArchiveElement,
  GrandArchiveSpeed,
} from "./index.ts";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveUnparsedAbility,
} from "./abilities/ability.ts";

export type {
  GrandArchiveAbilityDefinition,
  GrandArchiveUnparsedAbility,
} from "./abilities/ability.ts";

/** A readonly tuple with at least one value. */
export type GrandArchiveNonEmptyArray<Value> = readonly [Value, ...Value[]];

/** Unique and Regalia are supertypes, not card types (Supertypes, rules 1–2). */
export type GrandArchiveSupertype = Extract<GrandArchiveCardType, "UNIQUE" | "REGALIA">;

/**
 * Token is an object classification rather than a card type. The remaining
 * values are the rules-facing types that can be printed on a typeline.
 */
export type GrandArchiveRulesType = Exclude<GrandArchiveCardType, "UNIQUE" | "REGALIA" | "TOKEN">;

/** Rules types permitted for a physical card rather than an aid card. */
export type GrandArchivePlayableCardType = Exclude<GrandArchiveRulesType, "MASTERY" | "STATUS">;

/** Existing token definitions instantiate object-based card types. */
export type GrandArchiveTokenObjectType = Extract<
  GrandArchiveRulesType,
  "ALLY" | "DOMAIN" | "ITEM" | "PHANTASIA" | "WEAPON"
>;

/** Stable identity for one printed face of a physical card. */
export type GrandArchiveFaceId = `${string}:face:${"default" | "flip"}`;

/**
 * A printed numeric cost. `none`, zero, and X are deliberately distinct:
 * the rules assign each different behavior (Parts of a Card — Cost, rules 1,
 * 8–10; Playing Cards — Costs and Memory, rule 3).
 */
export type GrandArchivePrintedCost =
  | { readonly kind: "none" }
  | {
      readonly kind: "memory" | "reserve";
      readonly amount: number | { readonly kind: "variable"; readonly symbol: "X" };
    };

/** Numeric characteristics printed on a face; a missing stat is not zero. */
export interface GrandArchivePrintedStats {
  readonly level?: number;
  readonly power?: number;
  readonly life?: number;
  readonly durability?: number;
}

/**
 * Normalized printed typeline. Classes remain independently queryable even
 * though class names are also class subtypes in the printed typeline.
 */
export interface GrandArchiveTypeLine<Type extends GrandArchiveRulesType = GrandArchiveRulesType> {
  readonly supertypes: readonly GrandArchiveSupertype[];
  readonly types: GrandArchiveNonEmptyArray<Type>;
  readonly classes: GrandArchiveNonEmptyArray<GrandArchiveClass>;
  readonly subtypes: readonly string[];
}

/**
 * A physical printing can represent something that is not a rules "card".
 * Tokens are object proxies, while mastery and status cards only track player
 * functions (Tokens, rule 1; Mastery, rule 3; Statuses, rules 1–2).
 */
export type GrandArchiveDefinitionKind =
  | "card"
  | "token-representation"
  | "mastery-representation"
  | "status-representation";

/** Stable format restriction printed on a physical card rather than mutable tournament legality. */
export type GrandArchivePrintedFormatRestriction = {
  readonly kind: "pantheon-only";
  readonly source: "printed-border-tag";
};

export type GrandArchiveTypeForDefinition<Kind extends GrandArchiveDefinitionKind> =
  Kind extends "card"
    ? GrandArchivePlayableCardType
    : Kind extends "token-representation"
      ? GrandArchiveTokenObjectType
      : Kind extends "mastery-representation"
        ? "MASTERY"
        : "STATUS";

export type GrandArchiveElementsForDefinition<Kind extends GrandArchiveDefinitionKind> =
  Kind extends "mastery-representation"
    ? readonly GrandArchiveElement[]
    : GrandArchiveNonEmptyArray<GrandArchiveElement>;

/**
 * Immutable characteristics of one printed face. Mutable object properties
 * such as controller, counters, damage, facing, and awake/rested orientation
 * belong to an engine card instance, never to this definition.
 *
 * All rules cards have a name, cost, type, class, and element (Parts of a Card,
 * rule 1). The normalizer must emit Norm when no element is printed on a card
 * (Element, rule 1). Mastery aids are the explicit exception because they
 * represent non-card player functions and may have no element.
 */
export interface GrandArchiveCardFace<
  Ability extends GrandArchiveAbilityDefinition = GrandArchiveUnparsedAbility,
  Kind extends GrandArchiveDefinitionKind = "card",
> {
  readonly id: GrandArchiveFaceId;
  /** Official Index identity for this face (distinct from the physical card on flip faces). */
  readonly catalogId: string;
  readonly name: string;
  /** Explicit champion lineage name; consumers must not recover it by splitting display text. */
  readonly lineageName?: string;
  readonly cost: GrandArchivePrintedCost;
  readonly typeLine: GrandArchiveTypeLine<GrandArchiveTypeForDefinition<Kind>>;
  readonly elements: GrandArchiveElementsForDefinition<Kind>;
  readonly speed?: GrandArchiveSpeed;
  readonly stats: GrandArchivePrintedStats;
  /**
   * Plain official Index textbox text. It is retained for audit and display;
   * reminder text may remain until a parser separates it from functional text.
   */
  readonly rulesText: string;
  /** Paragraph-separated abilities; each paragraph is independently addressable. */
  readonly abilities: readonly Ability[];
}

export interface GrandArchiveSingleFacedLayout<
  Ability extends GrandArchiveAbilityDefinition = GrandArchiveUnparsedAbility,
  Kind extends GrandArchiveDefinitionKind = "card",
> {
  readonly kind: "single-faced";
  readonly face: GrandArchiveCardFace<Ability, Kind>;
}

/**
 * Grand Archive's default/flip double-faced layout. Outside the field only
 * the default face has characteristics; transforming does not create a new
 * object (Double-Faced Cards, rules 2–4 and 9).
 */
export interface GrandArchiveDoubleFacedLayout<
  Ability extends GrandArchiveAbilityDefinition = GrandArchiveUnparsedAbility,
  Kind extends GrandArchiveDefinitionKind = "card",
> {
  readonly kind: "double-faced";
  readonly defaultFace: GrandArchiveCardFace<Ability, Kind>;
  readonly flipFace: GrandArchiveCardFace<Ability, Kind>;
}

export type GrandArchiveCardLayout<
  Ability extends GrandArchiveAbilityDefinition = GrandArchiveUnparsedAbility,
  Kind extends GrandArchiveDefinitionKind = "card",
> = GrandArchiveSingleFacedLayout<Ability, Kind> | GrandArchiveDoubleFacedLayout<Ability, Kind>;

/**
 * Engine-facing immutable definition of one Grand Archive rules identity.
 *
 * This intentionally does not extend the Index catalog record: printings,
 * mutable tournament legality, HTML, flavor, and upstream references are catalog/display data,
 * while this shape contains only stable identity and printed characteristics.
 * A future engine can supply a closed executable ability union through the
 * `Ability` parameter. Until then the default accepts only explicitly
 * unparsed abilities, preventing rules text from masquerading as behavior.
 */
export interface GrandArchiveCard<
  Ability extends GrandArchiveAbilityDefinition = GrandArchiveUnparsedAbility,
  Kind extends GrandArchiveDefinitionKind = "card",
> {
  readonly canonicalId: string;
  readonly slug: string;
  readonly definitionKind: Kind;
  /** Format restriction represented by the rules-significant Pantheon border tag. */
  readonly formatRestriction?: GrandArchivePrintedFormatRestriction;
  readonly layout: GrandArchiveCardLayout<Ability, Kind>;
}

/** Any physical card or official aid represented by the generated card package. */
export type GrandArchiveAnyCard<
  Ability extends GrandArchiveAbilityDefinition = GrandArchiveUnparsedAbility,
> = GrandArchiveCard<Ability, GrandArchiveDefinitionKind>;
