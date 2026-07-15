import { useStatus, useViewerId } from "./hooks.ts";
import type { ViewerId } from "./types.ts";

/**
 * Display labels for engine phase strings. Phase identifiers are emitted
 * as raw strings by `gundam/flow.ts` (`start-phase`, `draw-phase`, etc.);
 * this map is the UI-side translation. New phases added on the engine
 * side fall back to a humanized form rather than throwing — the ribbon
 * and HUD render *something* for unknown phases instead of going blank.
 */
const PHASE_LABELS: Readonly<Record<string, string>> = {
  "start-phase": "START",
  "draw-phase": "DRAW",
  "resource-phase": "RESOURCE",
  "main-phase": "MAIN",
  "battle-phase": "BATTLE",
  "end-phase": "END",
};

/**
 * Display labels for engine step strings. Steps are nested under phases
 * (e.g. `block-step` lives under `battle-phase`); the UI only ever needs
 * the step's own label since the phase ribbon shows the parent.
 */
const STEP_LABELS: Readonly<Record<string, string>> = {
  "active-step": "Active",
  "start-step": "Start",
  "attack-step": "Attack",
  "block-step": "Block",
  "action-step": "Action",
  "end-step": "End",
  "hand-step": "Discard",
  "cleanup-step": "Cleanup",
};

/**
 * Phases shown in the centerline ribbon, in turn order. Excludes
 * `battle-phase` because the ribbon represents the standard turn flow;
 * battle-phase is entered out-of-band via `enterBattle` and surfaces
 * through the unified action button rather than the ribbon.
 */
export const RIBBON_PHASES: readonly string[] = [
  "start-phase",
  "draw-phase",
  "resource-phase",
  "main-phase",
  "end-phase",
];

function humanize(raw: string | undefined): string {
  if (!raw) return "";
  return raw
    .split("-")
    .map((p) => (p.length === 0 ? p : p[0]!.toUpperCase() + p.slice(1)))
    .join(" ");
}

export function phaseLabel(phase: string | undefined): string {
  if (!phase) return "";
  return PHASE_LABELS[phase] ?? humanize(phase).toUpperCase();
}

export function stepLabel(step: string | undefined): string {
  if (!step) return "";
  return STEP_LABELS[step] ?? humanize(step);
}

export interface PhaseLabel {
  /** Raw phase string from the engine, or `undefined` outside a turn. */
  readonly raw: string | undefined;
  /** Display form, e.g. `MAIN`. Empty string when raw is undefined. */
  readonly label: string;
  /** Display form for the current step, e.g. `Action`. Empty when no step. */
  readonly stepLabel: string;
}

/**
 * Read the current phase + step and surface display-ready labels.
 * Single source of truth for any UI surface that wants to show "where
 * are we in the turn" — ribbon, HUD, sidebar, action button.
 */
export function usePhaseLabel(): PhaseLabel {
  const status = useStatus();
  return {
    raw: status.phase,
    label: phaseLabel(status.phase),
    stepLabel: stepLabel(status.step),
  };
}

/**
 * Who currently holds priority. Resolved against the viewer so the UI
 * can render "your priority" vs "opponent's priority" without each
 * call site re-comparing IDs.
 *
 * Returns `null` during setup / between turns when `activePlayer` is
 * unset — callers should treat that as "neither side acts now".
 */
export interface PriorityHolder {
  readonly playerId: string | undefined;
  readonly isViewer: boolean;
  readonly turnPlayerId: string | undefined;
  readonly viewerIsTurnPlayer: boolean;
}

export function usePriorityHolder(): PriorityHolder {
  const status = useStatus();
  const viewerId: ViewerId = useViewerId();
  const viewer = String(viewerId);
  const active = status.activePlayer ? String(status.activePlayer) : undefined;
  const turn = status.turnPlayer ? String(status.turnPlayer) : undefined;
  return {
    playerId: active,
    isViewer: active !== undefined && active === viewer,
    turnPlayerId: turn,
    viewerIsTurnPlayer: turn !== undefined && turn === viewer,
  };
}
