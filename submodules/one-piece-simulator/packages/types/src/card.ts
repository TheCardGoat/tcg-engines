import type { CardEffects } from "./effect/index.ts";
import type { OPCardI18n } from "./i18n.ts";

export type OPCardType = "leader" | "character" | "event" | "stage" | "don";

export type OPColor = "red" | "blue" | "green" | "purple" | "black" | "yellow";

export type OPAttribute = "strike" | "slash" | "ranged" | "wisdom" | "special";

export type OPRarity = "C" | "UC" | "R" | "SR" | "SEC" | "SP" | "L" | "DON" | "MR" | "TR" | "P";

export type ArtVariantType =
  | "parallel"
  | "alternate-art"
  | "spr"
  | "manga-rare"
  | "promo"
  | "other";

export interface ArtVariant {
  type: ArtVariantType;
  imageUrl?: string;
  imageId?: string;
}

interface BaseCardProperties {
  id: string;
  color: OPColor[];
  rarity: OPRarity;
  setId: string;
  /** Traits/subtypes — language-agnostic identifiers, translations handled separately */
  traits?: string[];
  attribute?: OPAttribute;
  artVariants?: ArtVariant[];
  /** Raw effect text — duplicated from i18n for LLM/human readability alongside structured effects */
  effect?: string;
  effects?: CardEffects;
  i18n: OPCardI18n;
}

export interface LeaderCard extends BaseCardProperties {
  cardType: "leader";
  power: number;
  life: number;
  counter?: number;
}

export interface CharacterCard extends BaseCardProperties {
  cardType: "character";
  cost: number;
  power?: number;
  counter?: number;
  trigger?: string;
}

export interface EventCard extends BaseCardProperties {
  cardType: "event";
  cost: number;
  trigger?: string;
}

export interface StageCard extends BaseCardProperties {
  cardType: "stage";
  cost: number;
  trigger?: string;
}

export interface DonCard extends BaseCardProperties {
  cardType: "don";
}

export type OPCard = LeaderCard | CharacterCard | EventCard | StageCard | DonCard;
