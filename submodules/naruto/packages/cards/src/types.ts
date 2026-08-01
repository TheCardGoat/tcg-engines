/**
 * Card data model for the Naruto Card Game (Bandai, unreleased).
 *
 * Card text and artwork are (c) Bandai / Masashi Kishimoto. This package ships
 * data only (no images) for rules-engine purposes. Rules are provisional until
 * the official rulebook is published.
 */

export type CardType = "leader" | "character" | "ex_character" | "chakra" | "summon";

export type Color = "red" | "blue" | "green" | "";

export type Rarity = "L" | "SR" | "R" | "C" | "SB" | "";

export interface Skill {
  /** Timing/keyword labels, e.g. "Activate: Main", "On Summon", "Rush". */
  readonly labels: readonly string[];
  readonly text: string;
}

export interface Support {
  readonly name: string;
  readonly text: string;
  /** Raw timing text, e.g. "During Your Main", "Quick", "Support Activated". */
  readonly timing: string;
  readonly cost: number | null;
}

export interface CardDefinition {
  readonly id: string;
  readonly set: string;
  readonly number: string;
  readonly rarity: Rarity;
  readonly cardType: CardType;
  readonly color: Color;
  readonly nameEn: string;
  readonly nameFr: string;
  readonly nameJa: string;
  readonly damage: number | null;
  readonly power: number | null;
  readonly health: number | null;
  readonly life: number | null;
  readonly traits: readonly string[];
  readonly skills: readonly Skill[];
  readonly support: Support | null;
  readonly artist: string;
  readonly notForSale: boolean;
  /** Image path (not shipped); kept so consumers can resolve art themselves. */
  readonly image: string;
  readonly imageJa: string;
}
