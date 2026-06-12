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
export type TargetingState = "candidate" | "invalid";

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
  readonly keywords?: readonly KeywordEffectEntry[];
  readonly grantedKeywords?: readonly string[];
  readonly traits?: readonly string[];
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

export interface PromptAction {
  readonly label: ReactNode;
  readonly onClick: () => void;
  readonly kind?: "default" | "primary" | "danger";
  readonly disabled?: boolean;
  readonly testId?: string;
}

export interface AttackParticipant {
  readonly id: string;
  readonly name: string;
}

export interface AttackAttacker extends AttackParticipant {
  readonly strength: number;
}

export interface AttackTarget extends AttackParticipant {
  readonly willpower: number;
  /** True for the synthetic "direct attack" target anchored to the
   *  opponent's plate column rather than a board card. Drives the
   *  overlay to render a "DIRECT" badge instead of a defender HP comparison. */
  readonly isDirect?: boolean;
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
  readonly name: string;
  readonly clock?: string | number;
  readonly timer?: ClockSnapshot;
  readonly isOwnClock?: boolean;
  readonly colors?: readonly CardColor[];
  readonly deck?: number;
  readonly discard?: number;
  readonly shields?: number;
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

export interface PendingEffectSource {
  readonly name: string;
  readonly cost?: number;
  readonly color?: CardColor;
}

export type PendingEffectKind =
  | "yes-no"
  | "select-hand"
  | "select-play"
  | "select-any"
  | "scry"
  | "deck-look"
  | "choose-one"
  | "confirm";

/**
 * One button in a `choose-one` modal prompt — used by `ResolveBar` when
 * `kind === "choose-one"` (e.g. ST04-012 Striker Pack: "deploy 1 [Sword
 * Strike] or 1 [Launcher Strike]"). Container builds one entry per
 * option from `PendingChooseOnePrompt.options` and wires `onClick` to
 * submit the matching `chooseOneAnswers`.
 */
export interface PendingEffectChoiceOption {
  readonly index: number;
  readonly label: string;
  readonly onClick: () => void;
  readonly previewCard?: GameCardData;
}

export interface PendingEffect {
  readonly id: string;
  readonly source: PendingEffectSource;
  readonly title: string;
  readonly kind: PendingEffectKind;
  readonly acceptLabel?: string;
  readonly declineLabel?: string;
  readonly confirmDisabled?: boolean;
  readonly description?: string;
  readonly code?: string;
  readonly handLimit?: number;
  readonly revealed?: readonly GameCardData[];
  readonly deckLook?: DeckLookEffect;
  /** Present when `kind === "choose-one"`. */
  readonly chooseOptions?: readonly PendingEffectChoiceOption[];
}

export interface ScryConfirmResult {
  readonly toHand: readonly GameCardData[];
  readonly toBottom: readonly GameCardData[];
}

export interface DeckLookEffect {
  readonly directiveIndex: number;
  readonly returnMode: "topAndBottom" | "chooseTop" | "topOrTrash";
  readonly remainingDestination?: "bottom" | "trash";
  readonly tutorDestination: "hand" | "battleArea";
  readonly revealed: readonly GameCardData[];
  readonly legalTutorIds: readonly string[];
  readonly acceptOptionalDirectiveIndex?: number;
}

export interface DeckLookConfirmResult {
  readonly directiveIndex: number;
  readonly tutorCardId?: string;
  readonly toTop: readonly GameCardData[];
  readonly toBottom: readonly GameCardData[];
  readonly toTrash: readonly GameCardData[];
}

export type StyleOverrides = CSSProperties;
