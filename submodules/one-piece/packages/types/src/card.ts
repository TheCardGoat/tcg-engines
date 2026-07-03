import type { BaseCardDefinition } from "@tcg/card-model";
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

/**
 * Base shape every One Piece card definition extends.
 *
 * Extends the cross-game {@link BaseCardDefinition} (RFC §7 / ADR-11) so One Piece
 * cards carry the unified identity vocabulary (`canonicalId`, `slug`, `name`,
 * `printings[]`, optional `externalIds`). The game-specific fields below are
 * additive on top of the base.
 *
 * Identity hierarchy: canonical (`canonicalId`) → art (`printing.artId`) →
 * printing (`printing.id`). Per ADR-9, One Piece is modeled MTG-style (real
 * canonical layer + real `printings[]`), not Pokémon-style. `canonicalId` is
 * seeded from `id` for now (ADR-9) until authoritative reprint data lands.
 */
interface BaseCardProperties extends BaseCardDefinition {
  /**
   * Authored/source id (RFC identity role #1), e.g. `OP01-013`. Today this also
   * seeds `canonicalId` (ADR-9); it is NOT the cross-game canonical key itself.
   */
  id: string;
  color: OPColor[];
  rarity: OPRarity;
  setId: string;
  /** Traits/subtypes — language-agnostic identifiers, translations handled separately */
  traits?: string[];
  attribute?: OPAttribute;
  /**
   * DERIVED view computed from `printings[]` (RFC §10 One Piece step 3). Retained
   * for back-compat read paths; `printings[]` is the source of truth for variant
   * identity. Do not author new variant identity here — add a `printings[]` entry.
   */
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
