/**
 * CR §8.5 (Effect Keywords) section-centric coverage ledger.
 *
 * The engine inventory (`keyword-effect-inventory.ts`) is engine-type-centric:
 * one row per `FabEffect.type` / `FabKeyword.name`. This table is CR-section-
 * centric: one row per CR 8.5.x keyword (all 58), mapping each to the inventory
 * id(s) that implement it, or explaining — via `status` + `notes` — why it is
 * partial / subsumed / deferred. This is where keywords that are NOT a distinct
 * `FabEffect` type (e.g. reroll, folded into replacement; transcend, a play
 * procedure) are accounted for honestly.
 *
 * Completeness (all 58 keywords present, exactly once) and id validity are
 * enforced by `keyword-effect-inventory.test.ts`.
 *
 * Citation: Flesh and Blood Comprehensive Rules §8.5 (rules.fabtcg.com/en/cr).
 */

export interface CrCoverageRow {
  /** CR section, e.g. "8.5.1". */
  readonly cr: string;
  /** Keyword name as printed in CR §8.5. */
  readonly keyword: string;
  readonly status:
    | "covered" // one or more tested inventory ids implement it
    | "partial" // some sub-rules implemented, or implemented for one shape only
    | "subsumed" // implemented inside another keyword's primitive (named in notes)
    | "deferred"; // classified gap, tracked
  /**
   * Inventory id(s) that implement this CR keyword. Required non-empty for
   * `covered`; optional for `partial`/`subsumed`/`deferred`. Every id, when
   * present, must exist in `KEYWORD_EFFECT_INVENTORY`.
   */
  readonly inventoryIds: readonly string[];
  readonly notes?: string;
}

export const CR_SECTION_8_5_COVERAGE: readonly CrCoverageRow[] = [
  {
    cr: "8.5.1",
    keyword: "Banish",
    status: "covered",
    inventoryIds: ["banish"],
    notes:
      "8.5.1c banish-until covered; 8.5.1a/b provenance asserted (banish EFFECT -> name:'banish'+reason:'banish'; move-card-to-banished -> name:'move-zone').",
  },
  {
    cr: "8.5.2",
    keyword: "Create (token)",
    status: "covered",
    inventoryIds: ["create-token", "create-extra", "choose-and-create-token"],
  },
  {
    cr: "8.5.3",
    keyword: "Deal (damage)",
    status: "covered",
    inventoryIds: ["deal-damage"],
    notes:
      "8.5.3c non-living gate; 8.5.3d lose-life != damage (distinct event); 8.5.3e damageType stamped distinctly (trigger-matcher gate; real-card consumers Conduit of Frostburn / Alluvion Constellas).",
  },
  { cr: "8.5.4", keyword: "Destroy", status: "covered", inventoryIds: ["destroy"] },
  { cr: "8.5.5", keyword: "Discard", status: "covered", inventoryIds: ["discard"] },
  { cr: "8.5.6", keyword: "Draw", status: "covered", inventoryIds: ["draw"] },
  {
    cr: "8.5.7",
    keyword: "Gain (asset)",
    status: "covered",
    inventoryIds: ["gain-life", "gain-action-points", "gain-resources", "gain-chi"],
  },
  { cr: "8.5.8", keyword: "Gets (numerical)", status: "covered", inventoryIds: ["modify-numeric"] },
  {
    cr: "8.5.9",
    keyword: "Gets/Is (non-numerical)",
    status: "covered",
    inventoryIds: ["grant-property"],
  },
  { cr: "8.5.10", keyword: "Intimidate", status: "covered", inventoryIds: ["intimidate"] },
  { cr: "8.5.11", keyword: "Look", status: "covered", inventoryIds: ["look"] },
  { cr: "8.5.12", keyword: "Lose (asset)", status: "covered", inventoryIds: ["lose-life"] },
  {
    cr: "8.5.13",
    keyword: "Loses (non-numerical)",
    status: "covered",
    inventoryIds: ["remove-property"],
  },
  { cr: "8.5.14", keyword: "Put (counter)", status: "covered", inventoryIds: ["add-counter"] },
  { cr: "8.5.15", keyword: "Put/Return (object)", status: "covered", inventoryIds: ["move-card"] },
  {
    cr: "8.5.16",
    keyword: "Remove (counter)",
    status: "covered",
    inventoryIds: ["remove-counters", "remove-all-counters"],
  },
  { cr: "8.5.17", keyword: "Reveal", status: "covered", inventoryIds: ["reveal"] },
  { cr: "8.5.18", keyword: "Roll", status: "covered", inventoryIds: ["roll"] },
  {
    cr: "8.5.19",
    keyword: "Search",
    status: "partial",
    inventoryIds: ["search"],
    notes:
      "Visibility-aware found-empty logic implemented (rules/public-zone.ts + cannotFail for 8.5.19b/c, may-fail for 8.5.19a, empty-zone for 8.5.19d). 8.5.19c/d have real red→green tests; 8.5.19a/b cannotFail branch is not directly exercisable via the auto-scan decision model (no false-green assertions on it). mayFail searches keep author-declared opt-in semantics.",
  },
  { cr: "8.5.20", keyword: "Shuffle", status: "covered", inventoryIds: ["shuffle"] },
  { cr: "8.5.21", keyword: "Name", status: "covered", inventoryIds: ["name-card"] },
  { cr: "8.5.22", keyword: "Opt", status: "covered", inventoryIds: ["opt"] },
  { cr: "8.5.23", keyword: "Reload", status: "covered", inventoryIds: ["reload"] },
  {
    cr: "8.5.24",
    keyword: "Turn",
    status: "covered",
    inventoryIds: ["turn-face-down", "turn-face-up"],
  },
  { cr: "8.5.25", keyword: "Become/Copy", status: "covered", inventoryIds: ["become", "copy"] },
  { cr: "8.5.26", keyword: "Negate", status: "covered", inventoryIds: ["negate"] },
  { cr: "8.5.27", keyword: "Repeat", status: "covered", inventoryIds: ["repeat"] },
  {
    cr: "8.5.28",
    keyword: "Reroll",
    status: "partial",
    inventoryIds: [],
    notes:
      "Folded into generic replacement; Gambler's Gloves rerolls the complete replacement-modified dice pool and composes with Ready to Roll.",
  },
  { cr: "8.5.29", keyword: "Charge", status: "covered", inventoryIds: ["charge"] },
  { cr: "8.5.30", keyword: "Distribute", status: "covered", inventoryIds: ["distribute-counters"] },
  { cr: "8.5.31", keyword: "Pay", status: "covered", inventoryIds: ["pay"] },
  { cr: "8.5.32", keyword: "Add (defend)", status: "covered", inventoryIds: ["add-defending"] },
  {
    cr: "8.5.33",
    keyword: "Ignore",
    status: "covered",
    inventoryIds: ["ignore"],
    notes:
      "Whole-event ignore (8.5.33a) + part-of-event via unlimited applicationScope (8.5.33b: ignore cancels ALL matching sibling events, not just the first). Count-limited subset (k of N) is the remaining refinement.",
  },
  { cr: "8.5.34", keyword: "Freeze", status: "covered", inventoryIds: ["freeze"] },
  {
    cr: "8.5.35",
    keyword: "Gain (control)",
    status: "covered",
    inventoryIds: ["gain-control", "give", "steal"],
    notes:
      "8.5.35a equip-on-control-change covered: equipment/weapon routed to new controller's seat; fail-if-occupied/restricted (graceful skip). Regular equip also enforces non-weapon seat occupancy (8.5.41c).",
  },
  { cr: "8.5.36", keyword: "Transform", status: "covered", inventoryIds: ["transform"] },
  { cr: "8.5.37", keyword: "Unfreeze", status: "covered", inventoryIds: ["unfreeze"] },
  { cr: "8.5.38", keyword: "Attack (with)", status: "covered", inventoryIds: ["attack-with"] },
  {
    cr: "8.5.39",
    keyword: "Contract",
    status: "covered",
    inventoryIds: ["contract-task", "contract-watch"],
  },
  { cr: "8.5.40", keyword: "Create (card)", status: "covered", inventoryIds: ["create-card"] },
  { cr: "8.5.41", keyword: "Equip", status: "covered", inventoryIds: ["equip"] },
  { cr: "8.5.42", keyword: "Move (counter)", status: "covered", inventoryIds: ["move-counter"] },
  { cr: "8.5.43", keyword: "Awaken", status: "covered", inventoryIds: ["awaken"] },
  { cr: "8.5.44", keyword: "Pitch", status: "covered", inventoryIds: ["pitch-card"] },
  {
    cr: "8.5.45",
    keyword: "Clash",
    status: "covered",
    inventoryIds: ["clash", "win-clash", "reclash", "swap-clash-reveals"],
  },
  { cr: "8.5.46", keyword: "Wager", status: "covered", inventoryIds: ["wager", "win-wager"] },
  { cr: "8.5.47", keyword: "Amp", status: "covered", inventoryIds: ["amp"] },
  {
    cr: "8.5.48",
    keyword: "Transcend",
    status: "covered",
    inventoryIds: ["transcend"],
    notes:
      "First-class FabEffect (type:transcend) emitting the transcend event; reducer flips back-face + move-to-hand + transcended flag. Label-driven play-procedure path retired; 12 ENG/MST cards migrated. Real-card AAA: ENG026 Homage + MST048 Twelve-Petal K-Ya.",
  },
  { cr: "8.5.49", keyword: "Exchange", status: "covered", inventoryIds: ["exchange"] },
  { cr: "8.5.50", keyword: "Mark", status: "covered", inventoryIds: ["mark"] },
  {
    cr: "8.5.51",
    keyword: "Retrieve",
    status: "partial",
    inventoryIds: ["retrieve"],
    notes:
      "CR 8.5.51 pay-to-equip effect added (composes pay + equip with 8.5.51a equippability gate); at-resolution auto-selection for the new type and GY->hand salvage label reconciliation deferred.",
  },
  {
    cr: "8.5.52",
    keyword: "Return to the Brood",
    status: "covered",
    inventoryIds: ["return-to-brood"],
  },
  {
    cr: "8.5.53",
    keyword: "Give",
    status: "covered",
    inventoryIds: ["give"],
    notes:
      "give type emits reason 'give' (8.5.53a); 8.5.53b equip-on-give covered (shared control-change primitive routes + fails if occupied).",
  },
  {
    cr: "8.5.54",
    keyword: "Steal",
    status: "covered",
    inventoryIds: ["steal"],
    notes:
      "steal type emits reason 'steal' (8.5.54a); 8.5.54b equip-on-steal covered (re-equip to thief's slot; graceful fail if occupied). Real-card AAA: Sticky Fingers (SEA124).",
  },
  { cr: "8.5.55", keyword: "Tap", status: "covered", inventoryIds: ["tap"] },
  { cr: "8.5.56", keyword: "Untap", status: "covered", inventoryIds: ["untap"] },
  {
    cr: "8.5.57",
    keyword: "Crowd Cheers/Boos",
    status: "covered",
    inventoryIds: ["crowd-cheers", "crowd-boos"],
  },
  { cr: "8.5.58", keyword: "Sharpen", status: "covered", inventoryIds: ["sharpen"] },
];
