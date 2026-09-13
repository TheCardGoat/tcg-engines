import type {
  FabFaceId,
  FabKeyword,
  FabNumericProperty,
  FleshAndBloodAbility,
} from "./abilities/index.ts";

/** CR 2.11.6a class supertype vocabulary. */
export const FAB_CLASS_SUPERTYPES = [
  "Adjudicator",
  "Assassin",
  "Bard",
  "Brute",
  "Guardian",
  "Illusionist",
  "Mechanologist",
  "Merchant",
  "Necromancer",
  "Ninja",
  "Pirate",
  "Ranger",
  "Runeblade",
  "Shapeshifter",
  "Thief",
  "Warrior",
  "Wizard",
] as const;

/** CR 2.11.6b talent supertype vocabulary. */
export const FAB_TALENT_SUPERTYPES = [
  "Chaos",
  "Draconic",
  "Earth",
  "Elemental",
  "Ice",
  "Light",
  "Lightning",
  "Mystic",
  "Revered",
  "Reviled",
  "Royal",
  "Shadow",
] as const;

/** CR 2.15.6a type vocabulary. */
export const FAB_TYPES = [
  "Action",
  "Attack Reaction",
  "Block",
  "Companion",
  "Defense Reaction",
  "Demi-Hero",
  "Equipment",
  /** Out-of-scope SMP event objects retained as printed type vocabulary only. */
  "Event",
  "Hero",
  "Instant",
  "Macro",
  "Mentor",
  /** Legacy invocation checklist object retained by the production catalog. */
  "Placeholder Card",
  "Resource",
  "Token",
  "Weapon",
] as const;

/**
 * CR 2.10.6 plus normalized catalog subtypes not yet present in the bundled
 * rules snapshot. New catalog values must be audited before this list changes.
 */
export const FAB_SUBTYPES = [
  "1H",
  "2H",
  "Affliction",
  "Ally",
  "Angel",
  "Arms",
  "Arrow",
  "Ash",
  "Attack",
  "Aura",
  "Axe",
  "Base",
  "Book",
  /** Catalog shorthand seen on filters ("Reaction") covering attack/defense reactions. */
  "Reaction",
  "Bow",
  "Brush",
  "Cannon",
  "Chest",
  "Chi",
  "Claw",
  "Club",
  "Cog",
  "Construct",
  "Dagger",
  "Demon",
  "Disease",
  "Dragon",
  "Evo",
  "Fiddle",
  "Figment",
  "Flail",
  "Gem",
  "Gun",
  "Hammer",
  "Head",
  "Invocation",
  "Item",
  "Landmark",
  "Legs",
  "Log",
  "Lute",
  "Mercenary",
  "Off-Hand",
  "Orb",
  "Pistol",
  "Pit-Fighter",
  "Polearm",
  "Quiver",
  "Rock",
  "Scepter",
  "Scroll",
  "Scythe",
  "Shuriken",
  "Song",
  "Staff",
  "Sword",
  "Trap",
  "Wrench",
  "Young",
  "Zombie",
] as const;

/** Current normalized catalog metatypes (CR 2.6). */
export const FAB_METATYPES = [
  "Arakni",
  "High Seas",
  "Omens of the Third Age",
  "Puffin",
  "Rosetta",
  "Scurv",
  /**
   * Cross-set identity shared by all token objects. Also a FAB_TYPES entry —
   * type-box uniqueness allows this dual use for metatype filters.
   */
  "Token",
] as const;

/** Current normalized catalog trait vocabulary (CR 2.13). */
export const FAB_TRAITS = [
  "Agent of Chaos",
  "Frankie Specialization",
  /** LSS Ruu'di promo: PSA-slabbed cards graded Gem Mint 10. */
  "Gem Mint 10",
  "Go again",
  /** LSS Ruu'di promo: deck may only include PSA-graded cardboard. */
  "PSA Graded",
  "Revered",
  "Rhinar Specialization",
] as const;

export type FabClassSupertype = (typeof FAB_CLASS_SUPERTYPES)[number];
export type FabTalentSupertype = (typeof FAB_TALENT_SUPERTYPES)[number];
export type FabSupertype = FabClassSupertype | FabTalentSupertype;
export type FabType = (typeof FAB_TYPES)[number];
export type FabSubtype = (typeof FAB_SUBTYPES)[number];
export type FabMetatype = (typeof FAB_METATYPES)[number];
export type FabTrait = (typeof FAB_TRAITS)[number];
export type FabColor = "red" | "yellow" | "blue" | "purple";
/** Every normalized token that may appear in a printed FAB type box. */
export type FabTypeBoxToken = FabMetatype | FabSupertype | FabType | FabSubtype | "Generic";
/** One printed supertype group. The empty group represents Generic. */
export type FabSupertypeSet = readonly FabSupertype[];
/**
 * The printed supertype groups of a type box. A hybrid has multiple groups;
 * an ordinary type box has exactly one. CR 1.1.3b and 2.14.1b use these
 * groups, rather than flattened `supertypes`, for card-pool legality.
 */
export type FabSupertypeSets = readonly [FabSupertypeSet, ...FabSupertypeSet[]];

/**
 * Public, non-executable identity data used by rules that name a card. A
 * split card contributes both names on one identity; decision construction
 * presents those names individually (CR 8.5.21 and 9.2.2b).
 */
export interface FabPublicCardIdentity {
  readonly canonicalId: string;
  readonly names: readonly string[];
  /** Public catalog classification used by restricted name-card effects. */
  readonly isHero?: boolean;
  /** Whether this hero is a legal identity in the Living Legend format. */
  readonly legalInLivingLegend?: boolean;
}

/** Exact type-box categories required by CR 2.14.1. */
export interface FabTypeBox {
  readonly metatypes: readonly FabMetatype[];
  /** Preserves the slash-delimited grouping from the printed type box. */
  readonly supertypeSets?: FabSupertypeSets;
  readonly supertypes: readonly FabSupertype[];
  readonly types: readonly FabType[];
  readonly subtypes: readonly FabSubtype[];
}

/** At least one value is required for every active-face property. */
export type FabNonEmptyReadonlyArray<Value> = readonly [Value, ...Value[]];

/**
 * Serializable printed/base properties. Numeric-property absence is a missing
 * key, never an implicit zero (CR 1.8.7 and 2.0.3).
 */
export interface FabBaseObjectProperties {
  /** CR 9.2: split cards have every active face name, never one joined display string. */
  readonly names: readonly string[];
  /** The printed faces whose properties currently exist for this object. */
  readonly activeFaceIds: FabNonEmptyReadonlyArray<FabFaceId>;
  readonly color: FabColor | null;
  /** Each active printed typebox remains independently addressable. */
  readonly typeBoxes: FabNonEmptyReadonlyArray<FabTypeBox>;
  /** Union of the active typeboxes for ordinary has-type/supertype/subtype predicates. */
  readonly typeBox: FabTypeBox;
  readonly traits: readonly FabTrait[];
  /** Each active printed textbox remains independently addressable. */
  readonly textBoxIds: readonly string[];
  readonly numeric: Readonly<Partial<Record<FabNumericProperty, number>>>;
  readonly keywords: readonly FabKeyword[];
  readonly abilities: readonly FleshAndBloodAbility[];
}
