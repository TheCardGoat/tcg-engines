import type { GundamPendingMoveStep } from "@tcg/gundam-server-adapter";
import type { GundamMoveName, FilteredMatchView } from "@tcg/gundam-engine";

declare const __brand: unique symbol;

export type CardInstanceId = string & { readonly [__brand]: "CardInstanceId" };
export type ZoneId = string & { readonly [__brand]: "ZoneId" };
/**
 * Move-name alias re-pointed at the engine's literal-key union. The brand
 * is gone now that the engine exposes a narrow union; keeping the alias
 * means existing call sites (`asMoveName("passTurn")`, `MoveName` in
 * components) continue to work without churn, but the engine's move
 * registry is now the single source of truth — adding a move to
 * `gundamMoves` widens this union and any UI switch that doesn't handle
 * the new variant fails type-checking.
 */
export type MoveName = GundamMoveName;
export type ViewerId = string & { readonly [__brand]: "ViewerId" };

export const asCardInstanceId = (s: string): CardInstanceId => s as CardInstanceId;
export const asZoneId = (s: string): ZoneId => s as ZoneId;
export const asMoveName = (s: string): MoveName => s as MoveName;
export const asViewerId = (s: string): ViewerId => s as ViewerId;

export type PartialInput = Readonly<Record<string, unknown>>;

export type PendingState =
  | { readonly status: "idle" }
  | {
      readonly status: "collecting";
      readonly move: MoveName;
      readonly partialInput: PartialInput;
      readonly steps: readonly GundamPendingMoveStep[];
    };

export type SubmitOutcome =
  | { readonly ok: true; readonly stateId: number }
  | { readonly ok: false; readonly errorCode: string; readonly error: string };

export type BoardProjection = FilteredMatchView;

export type { GundamPendingMoveStep };
