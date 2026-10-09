import type { ReactNode } from "react";

export type AcSeat = "player-one" | "player-two";

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
  readonly clashDamage: number;
  readonly phaseDamage: number;
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
  readonly players: Record<AcSeat, LiveBoardPlayer>;
  readonly activePlayer: AcSeat;
  readonly turnNumber: number;
  readonly phaseName: string;
  readonly portalOpen: boolean;
  readonly clash: {
    readonly attackerId: string;
    readonly targetId: string;
    readonly step: string;
  } | null;
  readonly standbyCount: number;
}

export interface LiveBoardProps {
  board: LiveBoardState;
  viewerSeat: AcSeat;
  participantNames: { readonly p1?: string; readonly p2?: string };
  /** Cards the advertised actions may select; null when nothing is selectable. */
  selectableInstanceIds: ReadonlySet<string> | null;
  selectedInstanceIds: ReadonlySet<string>;
  onCardClick?: (instanceId: string) => void;
}

export interface ArenaProps extends LiveBoardProps {
  controls?: ReactNode;
  utilities?: ReactNode;
}
