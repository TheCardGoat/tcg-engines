/**
 * Keywords (CR 8.3). Stored verbatim; expanded by shared helpers.
 *
 * Target contract: docs/architecture/foundation-types.md
 */

import type { FabAmount } from "./amount.ts";
import type { FabSupertype } from "../base-object-properties.ts";

// ---------------------------------------------------------------------------
// Keywords (8.3) — stored verbatim; expanded by shared helpers
// ---------------------------------------------------------------------------

export type FabKeyword =
  | { name: "go-again" }
  | { name: "dominate" | "overpower" }
  | {
      name:
        | "arcane-barrier"
        | "spellvoid"
        | "arcane-shelter"
        | "ward"
        | "quell"
        | "piercing"
        | "amp"
        | "shadow-resist";
      value: FabAmount;
    }
  | {
      name:
        | "battleworn"
        | "blade-break"
        | "temper"
        | "guardwell"
        | "blood-debt"
        | "phantasm"
        | "mirage"
        | "spectra"
        | "ephemeral"
        | "watery-grave"
        | "suspense"
        | "crank"
        | "stealth"
        | "universal"
        | "cloaked"
        | "protect"
        | "ambush"
        | "modular"
        | "perched"
        | "rune-gate"
        | "scrap"
        | "beat-chest"
        | "boost"
        | "meld"
        | "fragment"
        | "usurp"
        | "decay"
        | "incarnate"
        | "traverse"
        | "unique"
        /** Sharpen keyword action printed as a card keyword (custom sets). */
        | "sharpen"
        /** Awaken keyword action printed as a card keyword (Super Slam). */
        | "awaken"
        /** Reload keyword printed on Azalea arrows (AAZ). */
        | "reload"
        /** Crush keyword on Guardian attacks (8.5.x; WTR-era printings). */
        | "crush"
        /**
         * Combo label keyword surface (CR 8.4.1): emitted when a card has a
         * Combo-labeled ability so filters for "card with combo" / hasKeyword
         * "combo" resolve without scanning ability text.
         */
        | "combo"
        | "reprise"
        | "surge"
        | "rupture"
        | "high-tide"
        | "lightning-flow"
        | "earth-bond"
        | "ice-bond"
        | "lightning-bond";
    }
  | { name: "fusion"; supertypes: readonly FabSupertype[]; mode: "and" | "and-or" }
  | { name: "heave" | "opt"; value: FabAmount }
  | { name: "legendary" | "unlimited" }
  | { name: "specialization"; hero: string }
  | { name: "essence"; supertypes: readonly FabSupertype[] }
  | { name: "pairs"; cardName: string }
  /** Label keyword stored at card level (e.g. "transform" on invoke cards). */
  | { name: "label-keyword"; label: FabLabel };

/**
 * Closed label-name vocabulary (CR 8.4 label keywords + set mechanics
 * emitted as ability labels). Built from every label authored in the card
 * corpus; a new printed label extends this union, never an open string.
 */
export type FabLabelName =
  | "attack"
  | "channel-earth"
  | "channel-ice"
  | "channel-lightning"
  | "charge"
  | "clash"
  | "combo"
  | "contract"
  | "crush"
  | "decompose"
  | "earth-bond"
  | "evo-upgrade"
  | "freeze"
  | "galvanize"
  | "go-fish"
  | "heavy"
  | "high-tide"
  | "ice-bond"
  | "intimidate"
  | "lightning-bond"
  | "lightning-flow"
  | "mark"
  | "material"
  | "negate"
  | "quickstrike"
  | "replacement"
  | "reprise"
  | "rupture"
  | "salvage"
  | "solflare"
  | "starfall"
  | "steal"
  | "surge"
  | "the-crowd-boos"
  | "the-crowd-cheers"
  | "tower"
  | "transcend"
  | "transform"
  | "unity"
  | "wager";

/** Label keyword attached to an ability (8.4). */
export interface FabLabel {
  name: FabLabelName;
  /** Parameters as printed: card names (combo), supertype (channel/bond/flow),
   * amount (surge N), adjective (go-fish), etc. */
  params?: Record<string, string | number | readonly string[]>;
}
