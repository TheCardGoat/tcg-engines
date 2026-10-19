export type {
  DamageStrike,
  CardDeparture as DefeatMove,
} from "@tcg/simulator-presentation/effects";
import type { AcWinReason } from "@tcg/alpha-clash-engine";
import type { ReactNode } from "react";

export type AcSeat = "player-one" | "player-two";

export interface AlphaClashResult {
  readonly winner: AcSeat;
  readonly reason: AcWinReason;
}

/**
 * Viewer-safe card line the live board renders. Mirrors the adapter's card
 * projection (hidden information is stripped server-side, rule 400.2); the
 * page parses the wire projection into this shape before it reaches the UI.
 */
export interface LiveBoardCard {
  readonly instanceId: string;
  readonly zone: string;
  readonly controller: string;
  readonly ready: boolean;
  readonly faceDown: boolean;
  readonly definitionId: string | null;
  /** Optional viewer-safe printed artwork, including cards without engine behavior. */
  readonly imageUrl?: string;
  readonly name: string | null;
  /** Native effective values, including current continuous modifiers. */
  readonly attack?: number;
  readonly defense?: number;
  readonly clashDamage: number;
  readonly phaseDamage: number;
  readonly counters?: Readonly<Record<string, number>>;
}

export interface LiveBoardPlayer {
  readonly name: string;
  readonly health: number;
  readonly maxHealth: number;
  readonly handSize: number;
  readonly deckSize: number;
}

/** The subset of the seated viewer projection the live board renders. */
export interface LiveBoardState {
  readonly cards: readonly LiveBoardCard[];
  readonly counterMoves?: readonly CounterMove[];
  readonly damageEvents?: readonly {
    readonly sequence: number;
    readonly targetId: string;
    readonly amount: number;
  }[];
  readonly players: Record<AcSeat, LiveBoardPlayer>;
  readonly activePlayer: AcSeat;
  /** Public native owner of the next decision, separate from turn/response priority. */
  readonly decisionSeat?: AcSeat;
  readonly turnNumber: number;
  readonly phaseName: string;
  /** Native terminal facts; absent until a validated complete phase arrives. */
  readonly result?: AlphaClashResult;
  readonly phaseStep?: string;
  /** Public native setup completion; never includes private replacement selections. */
  readonly openingHandsReady?: boolean;
  readonly openingState?: {
    readonly declarations: Readonly<Partial<Record<AcSeat, boolean>>>;
    readonly selectedCardIds: readonly string[] | null;
  };
  readonly portalOpen: boolean;
  readonly clash: {
    readonly attackerId: string;
    readonly targetId: string;
    readonly step: string;
  } | null;
  readonly standbyCount: number;
  /** Rule 114/409.5: who holds priority and who already passed the open
   *  Standby object; absent outside response windows. */
  readonly responseWindow?: {
    readonly openFor: AcSeat;
    readonly passedSeats: readonly AcSeat[];
  } | null;
}

/** Viewer-safe event from the native engine's public move log. */
export interface CounterMove {
  readonly sequence: number;
  readonly kind: string;
  readonly amount: number;
  readonly fromId: string;
  readonly toId: string;
}

export interface LiveBoardProps {
  board: LiveBoardState;
  viewerSeat: AcSeat;
  participantNames: { readonly p1?: string; readonly p2?: string };
  /** Cards the advertised actions may select; null when nothing is selectable. */
  selectableInstanceIds: ReadonlySet<string> | null;
  selectedInstanceIds: ReadonlySet<string>;
  onCardClick?: (instanceId: string) => void;
  /** Transient board motion (counter flights) started or drained. */
  onTransientBusyChange?: (busy: boolean) => void;
  /** The scene's card and zone anchor rects, reported whenever they move.
   * Page-level motions need them because seat flips remount the arena. */
  onSceneAnchors?: (anchors: {
    cards: readonly { id: string; left: number; top: number; width: number; height: number }[];
    zones: readonly { id: string; left: number; top: number; width: number; height: number }[];
  }) => void;
}

/** Presentation memory survives local seat switches; it never changes game state. */
export interface ResourceAudioState {
  readyResourceIds?: ReadonlySet<string>;
  lastAudibleVolume?: number;
  reducedMotion?: boolean;
}

export interface ArenaProps extends LiveBoardProps {
  resourceAudioState?: ResourceAudioState;
  controls?: ReactNode;
  utilities?: ReactNode;
}
