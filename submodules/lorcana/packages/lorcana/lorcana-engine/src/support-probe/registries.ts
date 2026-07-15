import { CONDITION_VARIANT_TYPES } from "../rules/condition-evaluator";
import { TARGET_VARIANT_TYPES, TARGET_ENUM_ALIASES } from "../targeting/variants";
import { ACTION_EFFECT_RESOLVER_TYPES } from "../runtime-moves/resolution/action-effects/composed-effect-resolver";
import type { ProbeAbilityType, ProbeRegistries } from "./types";

const ABILITY_TYPES: readonly ProbeAbilityType[] = [
  "keyword",
  "triggered",
  "activated",
  "static",
  "action",
  "replacement",
] as const;

/**
 * Trigger events recognized by the runtime. Sourced from the
 * `TriggerEvent` union in `@tcg/lorcana-types/abilities/trigger-types`.
 *
 * This list is duplicated from the type definition because the union is a
 * type-only export. If a new event is added there, mirror it here. The
 * registry consistency test verifies the probe surfaces every supported
 * variant.
 */
const TRIGGER_EVENTS: readonly string[] = [
  "play",
  "banish",
  "leave-play",
  "quest",
  "challenge",
  "challenged",
  "challenged-and-banished",
  "damage",
  "exert",
  "ready",
  "move",
  "sing",
  "be-chosen",
  "banish-in-challenge",
  "deal-damage",
  "draw",
  "discard",
  "ink",
  "gain-lore",
  "lose-lore",
  "start-turn",
  "end-turn",
  "remove-damage",
  "return-to-hand",
  "start-of-turn",
  "end-of-turn",
  "put-into-inkwell",
  "add-to-inkwell",
  "put-card-under",
  "support",
  "inkwell",
  "boost",
  "leave-discard",
];

/**
 * Trigger subject enums (the `on` field of a trigger). Sourced from
 * `TriggerSubjectEnum` in `@tcg/lorcana-types/abilities/trigger-types`.
 */
const TRIGGER_SUBJECTS: readonly string[] = [
  "SELF",
  "YOUR_CHARACTERS",
  "YOUR_OTHER_CHARACTERS",
  "OPPONENT_CHARACTERS",
  "OPPOSING_CHARACTERS",
  "OTHER_CHARACTERS",
  "ANY_CHARACTER",
  "YOUR_ITEMS",
  "YOUR_OTHER_ITEMS",
  "ANY_ITEM",
  "YOUR_LOCATIONS",
  "YOUR_ACTIONS",
  "YOUR_SONGS",
  "YOU",
  "OPPONENT",
  "ANY_PLAYER",
  "FLOODBORN_CHARACTERS",
  "SELF_OR_SEVEN_DWARFS_CHARACTERS",
  "CINDERELLA_CHARACTERS",
  "YOUR_CHARACTERS_COST_4_OR_MORE",
  "SONGS",
  "YOUR_BROOM_CHARACTERS",
  "YOUR_MUSKETEER_CHARACTERS",
  "YOUR_BODYGUARD_CHARACTERS",
  "CONTROLLER",
  "CHARACTERS_HERE",
  "YOUR_OTHER_STEEL_CHARACTERS",
  "YOUR_OTHER_SAPPHIRE_CHARACTERS",
  "CHARACTERS_AT_LOCATION",
  "CHARACTERS_MOVED_HERE",
  "OPPONENTS_CARDS",
  "YOUR_PIRATE_CHARACTERS",
  "CHARACTER_HERE",
  "SONG",
  "YOUR_CHARACTERS_OR_LOCATIONS",
  "YOUR_OTHER_AMETHYST_CHARACTERS",
  "YOUR_CHARACTERS_OR_LOCATIONS_WITH_CARD_UNDER",
];

/**
 * Frozen snapshot of every registry the probe queries. Importing this once
 * avoids repeated per-call lookups and gives the probe a single point of
 * versioning.
 */
export const PROBE_REGISTRIES: ProbeRegistries = Object.freeze({
  abilityTypes: ABILITY_TYPES,
  effectTypes: ACTION_EFFECT_RESOLVER_TYPES,
  conditionTypes: CONDITION_VARIANT_TYPES,
  targetSelectors: TARGET_VARIANT_TYPES,
  targetEnumAliases: TARGET_ENUM_ALIASES,
  triggerEvents: TRIGGER_EVENTS,
  triggerSubjects: TRIGGER_SUBJECTS,
});

export const PROBE_VERSION = "v1";
