import type { LorcanaTargetReference } from "@tcg/lorcana-types";

/**
 * Authoritative list of target-variant discriminators that the runtime selects
 * on. Drives the per-variant test coverage enforcement in
 * `targeting/variants/__tests__/_coverage.test.ts`.
 *
 * The target system is heterogeneous — targets can be specified as a DSL
 * object (`{ selector, ..., reference? }`), an enum alias
 * (`"CHOSEN_CHARACTER"`, `"YOUR_CHARACTERS"`, ...), or a reference to a
 * previously resolved selection (`{ reference: "selected-first" }`). This
 * registry enumerates the *selector family* each test file is responsible for
 * exercising.
 *
 * See `packages/lorcana/lorcana-engine/AGENTS.md` → "How to add a target".
 */
export const TARGET_VARIANT_TYPES = [
  // Card DSL selectors (from `TargetDSL.selector`)
  "self",
  "chosen",
  "all",
  "each",
  "any",
  "random",
  // Player DSL selectors (from `PlayerTargetDSL.selector`) — "chosen" shared above
  "you",
  "opponent",
  "each-player",
  // Target references (from `LorcanaTargetReference`) — resolve to prior selections
  "source",
  "trigger-subject",
  "selected-first",
  "selected-all",
  "revealed-first",
  "revealed-all",
  "chosen-or-source",
  "singers",
] as const;

export type TargetVariantType = (typeof TARGET_VARIANT_TYPES)[number];

// Compile-time guard: every entry must be a valid selector or reference string.
type SelectorUnion =
  | "self"
  | "chosen"
  | "all"
  | "each"
  | "any"
  | "random"
  | "you"
  | "opponent"
  | "each-player";
const _TARGET_VARIANT_TYPE_CHECK: readonly (SelectorUnion | LorcanaTargetReference)[] =
  TARGET_VARIANT_TYPES;

/**
 * Supplementary list of legacy enum aliases (`"CHOSEN_CHARACTER"`,
 * `"ALL_OPPOSING_CHARACTERS"`, ...). These resolve to DSL forms through the
 * target-resolver's normalization layer and are covered by the selector tests
 * above plus dedicated normalization plumbing tests. Exposed here so a future
 * per-alias expansion (if desired) can iterate the full set.
 */
export const TARGET_ENUM_ALIASES: readonly string[] = [
  // Character enum aliases (resolve to DSL forms at runtime)
  "SELF",
  "THIS_CHARACTER",
  "CHOSEN_CHARACTER",
  "CHOSEN_OPPOSING_CHARACTER",
  "CHOSEN_CHARACTER_OF_YOURS",
  "ANOTHER_CHOSEN_CHARACTER",
  "ANOTHER_CHOSEN_CHARACTER_OF_YOURS",
  "ALL_CHARACTERS",
  "ALL_OPPOSING_CHARACTERS",
  "YOUR_CHARACTERS",
  "YOUR_OTHER_CHARACTERS",
  "EACH_CHARACTER",
  "EACH_OPPOSING_CHARACTER",
  "CHOSEN_DAMAGED_CHARACTER",
  "CHOSEN_OPPOSING_DAMAGED_CHARACTER",
  // Item enum aliases
  "CHOSEN_ITEM",
  "CHOSEN_OPPOSING_ITEM",
  "YOUR_ITEMS",
  "ALL_ITEMS",
  "ALL_OPPOSING_ITEMS",
  "THIS_ITEM",
  // Location enum aliases
  "CHOSEN_LOCATION",
  "CHOSEN_OPPOSING_LOCATION",
  "YOUR_LOCATIONS",
  "ALL_OPPOSING_LOCATIONS",
  "THIS_LOCATION",
  // Player enum aliases (mirrors `PlayerTarget` in @tcg/lorcana-types).
  // These are accepted by the target-resolver normalization layer and used
  // pervasively by effects with `target: "CONTROLLER"`, `target: "OPPONENTS"`, etc.
  "CONTROLLER",
  "OPPONENT",
  "OPPONENTS",
  "EACH_PLAYER",
  "EACH_OPPONENT",
  "CHOSEN_PLAYER",
  "CHOSEN_OPPONENT",
  "CARD_OWNER",
  "CURRENT_TURN",
  "ALL_PLAYERS",
  "CHARACTERS_HERE",
  "CHALLENGING_PLAYER",
  "TRIGGER_SOURCE_OWNER",
  "OPPOSING_CHARACTERS",
  "THAT_PLAYER",
  "CHALLENGER_OWNER",
  "THEIR_CHOSEN_CHARACTER",
];
