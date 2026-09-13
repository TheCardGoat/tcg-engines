import { useGundamGame } from "./context.tsx";
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
  "damage-step": "Damage",
  "battle-end-step": "Battle End",
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

export type GundamPlayerSide = "self" | "opponent";

export type GundamControlState =
  | {
      readonly kind: "interactive";
      readonly turnOwner: GundamPlayerSide;
      readonly priorityHolder: GundamPlayerSide;
    }
  | {
      readonly kind: "resolving";
      readonly turnOwner: GundamPlayerSide;
    };

interface GundamControlStatus {
  readonly phase?: string;
  readonly step?: string;
  readonly activePlayer?: string;
  readonly turnPlayer?: string;
}

const PLAYER_DECISION_STEPS = new Set(["block-step", "action-step"]);

/**
 * Present turn ownership and the right to act as separate concepts.
 *
 * During battle steps that do not accept player decisions, `activePlayer`
 * remains useful engine context but must not be advertised as actionable
 * priority. The neutral resolving state prevents that false affordance.
 */
export function projectGundamControlState(
  status: GundamControlStatus,
  viewerId: string,
  hasPendingInteraction = false,
): GundamControlState {
  const viewer = String(viewerId);
  const activePlayer = status.activePlayer ? String(status.activePlayer) : viewer;
  const turnPlayer = status.turnPlayer ? String(status.turnPlayer) : activePlayer;
  const turnOwner: GundamPlayerSide = turnPlayer === viewer ? "self" : "opponent";
  const isAutomaticBattleStep =
    status.phase === "battle-phase" && !PLAYER_DECISION_STEPS.has(status.step ?? "");

  // A pending effect choice (for example an optional Burst after shield
  // damage) is player-actionable even in a normally automatic battle step.
  // Without it, `activePlayer` is engine context rather than priority.
  if ((isAutomaticBattleStep && !hasPendingInteraction) || !status.activePlayer) {
    return { kind: "resolving", turnOwner };
  }

  return {
    kind: "interactive",
    turnOwner,
    priorityHolder: activePlayer === viewer ? "self" : "opponent",
  };
}

export function useGundamControlState(): GundamControlState {
  const status = useStatus();
  const viewerId = useViewerId();
  const { adapter } = useGundamGame();
  return projectGundamControlState(status, String(viewerId), Boolean(adapter.pendingChoice()));
}

/**
 * Engine turns are 0-indexed (setup + first turn is turn 0); players read
 * the first turn as "Turn 1". Use for every player-facing "Turn N".
 */
export function displayTurn(turn: number): number {
  return Math.max(1, turn + 1);
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
