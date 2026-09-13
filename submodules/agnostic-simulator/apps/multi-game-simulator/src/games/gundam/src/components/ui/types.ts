import type { CSSProperties, ReactNode } from "react";
import type { ClockSnapshot } from "@tcg/gundam-engine";

export type CardColor = "blue" | "green" | "red" | "white" | "purple";

export type CardType = "unit" | "pilot" | "command" | "base" | "resource";

export type KeywordEffect =
  | "Repair"
  | "Breach"
  | "Support"
  | "Blocker"
  | "FirstStrike"
  | "HighManeuver"
  | "Suppression";

export interface KeywordEffectEntry {
  readonly keyword: KeywordEffect;
  readonly value?: number;
}

export interface ActiveEffectEntry {
  readonly sourceId: string;
  readonly sourceName?: string;
  readonly kind: string;
  readonly keyword?: string;
  readonly description: string;
  readonly duration?: string;
  readonly sourceLabel?: string;
  readonly sourceSet?: string;
  readonly sourceCardNumber?: string;
}

/**
 * Targeting feedback surface on `CardFace`. Also the literal value of
 * `data-card-type`'s sibling `data-targeting-state` attribute, so the
 * type doubles as a compile-time guard against typos in CSS selectors
 * or test queries.
 */
export type TargetingState = "candidate" | "link-candidate" | "invalid";

export interface GameCardData {
  readonly id?: string;
  readonly name: string;
  readonly subtitle?: string;
  readonly color?: CardColor;
  readonly cost?: number;
  readonly level?: number;
  readonly cardType?: CardType;
  readonly ap?: number | null;
  readonly hp?: number | null;
  readonly baseAp?: number | null;
  readonly baseHp?: number | null;
  readonly damage?: number;
  readonly effect?: string;
  /** One printed rules block per engine-owned effect, preserving source wording. */
  readonly effectBlocks?: readonly string[];
  /** Whether this card exposes an activated effect the player can deliberately use. */
  readonly hasActivatedAbility?: boolean;
  readonly keywords?: readonly KeywordEffectEntry[];
  readonly grantedKeywords?: readonly string[];
  readonly traits?: readonly string[];
  readonly battlefieldZones?: readonly ("space" | "earth")[];
  readonly set?: string;
  readonly cardNumber?: string;
  readonly linkRequirement?: string;
  readonly rarity?: string;
  readonly img?: string;
  readonly faceDown?: boolean;
  readonly exerted?: boolean;
  readonly selected?: boolean;
  readonly highlight?: boolean;
  readonly playable?: boolean;
  readonly activeEffects?: readonly ActiveEffectEntry[];
  readonly deployedThisTurn?: boolean;
  readonly zoneId?: string;
  readonly canAttackThisTurn?: boolean;
  readonly cantAttack?: boolean;
  readonly cantBlock?: boolean;
  readonly isLinkUnit?: boolean;
  /** When this unit has a paired pilot, the pilot's full card data is
   *  attached here so the play-zone slot can render it as a strip below
   *  the unit (matching the official Gundam UI). The pilot is removed
   *  from the standalone play array — it lives only here. */
  readonly pairedPilot?: GameCardData;
}

export interface DOMRectLike {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
}

export interface PlayerInfo {
  /** Stable engine/player id for state, zone, and timer lookups. */
  readonly id?: string;
  /** Player-facing name. Falls back to `id` when no profile name is available. */
  readonly name: string;
  readonly clock?: string | number;
  readonly timer?: ClockSnapshot;
  readonly isOwnClock?: boolean;
  readonly colors?: readonly CardColor[];
  readonly deck?: number;
  readonly resourceDeck?: number;
  readonly discard?: number;
  readonly shields?: number;
  readonly resourcesAvailable?: number;
  readonly resourcesTotal?: number;
}

export interface MatchInfo {
  readonly format: string;
  readonly turn: number;
  readonly phase: string;
  readonly mode: string;
}

export interface LogItem {
  readonly who: "YOU" | "OPPONENT";
  readonly items: readonly ReactNode[];
}

export interface LogTurn {
  readonly turn: number;
  readonly groups: readonly LogItem[];
}

export type StyleOverrides = CSSProperties;
