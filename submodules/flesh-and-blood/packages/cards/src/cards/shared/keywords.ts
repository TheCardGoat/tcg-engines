/**
 * Shared keyword definitions for authored card modules.
 *
 * Card files import these instead of inlining keyword objects, so identical
 * AST fragments exist once. Add a const/factory when a new keyword is authored.
 */

import type { FabAmount, FabKeyword, FabSupertype } from "@tcg/flesh-and-blood-types/authoring";

// -- simple keywords ---------------------------------------------------------

export const goAgain: FabKeyword = { name: "go-again" };
export const dominate: FabKeyword = { name: "dominate" };
export const overpower: FabKeyword = { name: "overpower" };
export const battleworn: FabKeyword = { name: "battleworn" };
export const bladeBreak: FabKeyword = { name: "blade-break" };
export const temper: FabKeyword = { name: "temper" };
export const guardwell: FabKeyword = { name: "guardwell" };
export const bloodDebt: FabKeyword = { name: "blood-debt" };
export const phantasm: FabKeyword = { name: "phantasm" };
export const mirage: FabKeyword = { name: "mirage" };
export const spectra: FabKeyword = { name: "spectra" };
export const ephemeral: FabKeyword = { name: "ephemeral" };
export const wateryGrave: FabKeyword = { name: "watery-grave" };
export const suspense: FabKeyword = { name: "suspense" };
export const crank: FabKeyword = { name: "crank" };
export const stealth: FabKeyword = { name: "stealth" };
export const universal: FabKeyword = { name: "universal" };
export const cloaked: FabKeyword = { name: "cloaked" };
export const protect: FabKeyword = { name: "protect" };
export const ambush: FabKeyword = { name: "ambush" };
export const modular: FabKeyword = { name: "modular" };
export const perched: FabKeyword = { name: "perched" };
export const runeGate: FabKeyword = { name: "rune-gate" };
export const scrap: FabKeyword = { name: "scrap" };
export const beatChest: FabKeyword = { name: "beat-chest" };
export const boost: FabKeyword = { name: "boost" };
export const meld: FabKeyword = { name: "meld" };
export const fragment: FabKeyword = { name: "fragment" };
export const legendary: FabKeyword = { name: "legendary" };
export const unlimited: FabKeyword = { name: "unlimited" };
export const usurp: FabKeyword = { name: "usurp" };
export const decay: FabKeyword = { name: "decay" };
export const incarnate: FabKeyword = { name: "incarnate" };
export const traverse: FabKeyword = { name: "traverse" };
export const unique: FabKeyword = { name: "unique" };
/** CR 8.4.1 Combo label surface for "card with combo" filters. */
export const combo: FabKeyword = { name: "combo" };
export const crush: FabKeyword = { name: "crush" };
export const reprise: FabKeyword = { name: "reprise" };
export const surge: FabKeyword = { name: "surge" };
export const rupture: FabKeyword = { name: "rupture" };
export const highTide: FabKeyword = { name: "high-tide" };
export const lightningFlow: FabKeyword = { name: "lightning-flow" };
export const earthBond: FabKeyword = { name: "earth-bond" };
export const iceBond: FabKeyword = { name: "ice-bond" };
export const lightningBond: FabKeyword = { name: "lightning-bond" };
/** CR 8.5.23 Reload — the engine synthesizes the reload effect from the keyword. */
export const reload: FabKeyword = { name: "reload" };

// -- parameterized keyword factories ------------------------------------------

export const arcaneBarrier = (value: FabAmount): FabKeyword => ({ name: "arcane-barrier", value });
export const spellvoid = (value: FabAmount): FabKeyword => ({ name: "spellvoid", value });
export const arcaneShelter = (value: FabAmount): FabKeyword => ({ name: "arcane-shelter", value });
export const ward = (value: FabAmount): FabKeyword => ({ name: "ward", value });
export const shadowResist = (value: FabAmount): FabKeyword => ({ name: "shadow-resist", value });
export const quell = (value: FabAmount): FabKeyword => ({ name: "quell", value });
export const piercing = (value: FabAmount): FabKeyword => ({ name: "piercing", value });
export const heave = (value: FabAmount): FabKeyword => ({ name: "heave", value });
export const opt = (value: FabAmount): FabKeyword => ({ name: "opt", value });

export const specialization = (hero: string): FabKeyword => ({ name: "specialization", hero });
export const fusion = (
  supertypeOrSupertypes: FabSupertype | readonly FabSupertype[],
  mode: "and" | "and-or" = "and",
): FabKeyword => ({
  name: "fusion",
  supertypes:
    typeof supertypeOrSupertypes === "string" ? [supertypeOrSupertypes] : supertypeOrSupertypes,
  mode,
});
export const essence = (supertypes: readonly FabSupertype[]): FabKeyword => ({
  name: "essence",
  supertypes,
});
