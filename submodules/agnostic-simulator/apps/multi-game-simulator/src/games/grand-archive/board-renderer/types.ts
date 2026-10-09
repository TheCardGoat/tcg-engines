import type { GrandArchiveComposition, GrandArchiveTheme } from "./composition";
/** Display-only zones. The adapter maps engine-native ids before rendering. */
export type GrandArchiveBoardZone =
  | "field"
  | "hand"
  | "memory"
  | "material-deck"
  | "main-deck"
  | "graveyard"
  | "banished"
  | "effects-stack"
  | "intent";

export interface GrandArchiveBoardCard {
  readonly id: string;
  readonly incarnation?: number;
  readonly owner: "self" | "opponent";
  readonly zone: GrandArchiveBoardZone;
  /** Supply a face URL only when this viewer is authorized to see it. */
  readonly faceUrl?: string;
  readonly aspectRatio?: number;
  readonly faceDown: boolean;
  readonly rested?: boolean;
  readonly attachedTo?: string;
  readonly role?: "champion";
  readonly label?: string;
}

/** A viewer projection, never an engine or match-state input. */
export interface GrandArchiveBoardProjection {
  readonly cards: readonly GrandArchiveBoardCard[];
  readonly candidateCardIds?: readonly string[];
  readonly selectedCardId?: string;
  readonly feedbackCardIds?: readonly string[];
  readonly feedbackKey?: string;
  readonly targetLinks?: readonly {
    readonly sourceCardId: string;
    readonly targetCardId: string;
  }[];
  /** Change on reconnect, replay seek, or accepted undo to snap to the snapshot. */
  readonly resetKey?: string;
}

export interface GrandArchiveBoardAssets {
  readonly theme: GrandArchiveTheme;
  readonly cardBackUrl: string;
}

export interface GrandArchiveBoardEvents {
  readonly onCardPick?: (cardId: string) => void;
  readonly onCardHover?: (cardId?: string) => void;
  readonly onBackgroundPick?: () => void;
}

export interface GrandArchiveCardScreenPosition {
  /** Percentages relative to the canvas element, synchronized with camera fit. */
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export interface GrandArchiveAssetStatus {
  readonly loading: number;
  readonly failed: readonly string[];
}

export interface GrandArchiveBoardMetrics {
  /** Interval between active animation frames; idle demand frames are excluded. */
  readonly frameMs: number;
  readonly drawCalls: number;
  readonly geometries: number;
  readonly textures: number;
}

export interface GrandArchiveBoardProps {
  readonly projection: GrandArchiveBoardProjection;
  readonly assets: GrandArchiveBoardAssets;
  readonly events?: GrandArchiveBoardEvents;
  readonly reducedMotion?: boolean;
  readonly assetRetryKey?: number;
  readonly onAssetStatus?: (status: GrandArchiveAssetStatus) => void;
  readonly onLayout?: (positions: ReadonlyMap<string, GrandArchiveCardScreenPosition>) => void;
  readonly onComposition?: (composition: GrandArchiveComposition) => void;
  readonly onMetrics?: (metrics: GrandArchiveBoardMetrics) => void;
}
