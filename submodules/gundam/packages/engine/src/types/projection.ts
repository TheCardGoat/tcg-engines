import type { Card } from "@tcg/gundam-types";
import type { PlayerId } from "./branded.ts";
import type { BaseCardMeta } from "./base-card.ts";
import type { CtxStatus } from "./match-state.ts";
import type { ClockSnapshot } from "../runtime/clock-view.ts";

export interface ViewRoleContext {
  role: "player" | "spectator" | "judge";
  playerId?: PlayerId;
}

export interface FilteredMatchView<G extends object = object> {
  G: G;
  stateID: number;
  status: CtxStatus;
  zones: FilteredZoneView;
  players: FilteredPlayerView[];
  availableMoves: string[];
  myPlayerId?: PlayerId;
  timerView: ProjectedTimerView;
}

export interface ProjectedTimerView {
  serverTimestamp: number;
  players?: Record<string, ClockSnapshot>;
}

export interface FilteredZoneView {
  /** For each zone, what the viewer can see */
  zones: Record<string, FilteredZoneData>;
}

export interface FilteredZoneData {
  count: number;
  cards: FilteredCardView[];
  /** For ordered zones, the order is preserved. For private zones, cards may be hidden */
  topCardId?: string;
}

export interface FilteredCardView {
  instanceId: string;
  /**
   * Card definition, or `null` when the card is face-down/hidden from this
   * viewer (e.g. opponent hand, deck). The engine is the source of truth:
   * UI clients must not resolve definitions through a side channel when
   * this field is `null`. Render as a card-back instead.
   */
  definition: Card | null;
  definitionId: string | null;
  meta: BaseCardMeta | null;
  ownerId: string;
  controllerId: string;
  faceDown: boolean;
  zoneId: string;
}

export interface FilteredPlayerView {
  playerId: PlayerId;
  /** Game-specific public player data */
  publicData: Record<string, unknown>;
}
