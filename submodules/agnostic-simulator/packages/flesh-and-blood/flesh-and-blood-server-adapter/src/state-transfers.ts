import type { FabMatchRuntime } from "@tcg/flesh-and-blood-engine/runtime";
import type {
  AnimationPlanV2,
  AnimationStepV2,
  AnimationZoneRef,
  EntityTransferStepV2,
} from "@tcg/protocol";
import { fabAnimationZoneRef } from "./animation-refs";

export type FabZoneLocations = ReadonlyMap<string, AnimationZoneRef>;

export type FabCombatStep = NonNullable<ReturnType<FabMatchRuntime["getState"]>["combat"]>["step"];

export interface FabAnnouncementState {
  readonly activePlayerId: string | null;
  readonly turnNumber: number;
  readonly combatStep: FabCombatStep | null;
}

export type FabAnnouncementTransition =
  | {
      readonly kind: "turn";
      readonly fromPlayerId: string;
      readonly toPlayerId: string;
      readonly turnNumber: number;
    }
  | {
      readonly kind: "combat-step";
      readonly fromStep: FabCombatStep | null;
      readonly toStep: FabCombatStep;
    };

const TRANSFER_DURATION_MS = 440;
const TURN_CHANGE_DURATION_MS = 1_600;
const COMBAT_STEP_CHANGE_DURATION_MS = 4_000;

/**
 * Choose one player-facing announcement for a committed snapshot change.
 * A turn handoff wins over combat cleanup; otherwise the settled combat step
 * wins, so auto-passed intermediate steps never queue stale announcements.
 */
export function fabLatestAnnouncementTransition(
  from: FabAnnouncementState,
  to: FabAnnouncementState,
): FabAnnouncementTransition | undefined {
  if (
    to.turnNumber > from.turnNumber &&
    from.activePlayerId !== null &&
    to.activePlayerId !== null
  ) {
    return {
      kind: "turn",
      fromPlayerId: from.activePlayerId,
      toPlayerId: to.activePlayerId,
      turnNumber: to.turnNumber,
    };
  }
  if (to.combatStep !== null && from.combatStep !== to.combatStep) {
    return { kind: "combat-step", fromStep: from.combatStep, toStep: to.combatStep };
  }
  return undefined;
}

/** Capture locations before mutation, without retaining mutable engine state. */
export function captureFabZoneLocations(
  state: ReturnType<FabMatchRuntime["getState"]>,
): FabZoneLocations {
  const locations = new Map<string, AnimationZoneRef>();
  for (const [playerId, zones] of Object.entries(state.containers.zonesByPlayerId)) {
    for (const [zone, ids] of Object.entries(zones)) {
      const ref = fabAnimationZoneRef(playerId, zone);
      if (!ref) continue;
      for (const id of ids) locations.set(id, ref);
    }
  }
  return locations;
}

/**
 * Location hints for hidden-zone changes whose net counts are ambiguous to a
 * viewer, plus the one latest announcement selected from the settled state.
 * The browser owns timing and rendered endpoints.
 */
export function fabHiddenZoneTransfers(
  from: FabZoneLocations,
  to: FabZoneLocations,
  id: string,
  announcement?: FabAnnouncementTransition,
): AnimationPlanV2 | null {
  const steps: EntityTransferStepV2[] = [];
  for (const [entityId, source] of from) {
    const destination = to.get(entityId);
    if (!destination || source.id === destination.id) continue;
    if (![source, destination].some((zone) => /:(deck|hand|arsenal|banished|soul)$/.test(zone.id)))
      continue;
    steps.push({
      id: `${id}:location:${steps.length}`,
      type: "entityTransfer",
      entity: { kind: "entity", id: entityId },
      from: source,
      to: destination,
      sourceFace: "hidden",
      destinationFace: "hidden",
      ...(source.id.endsWith(":deck") && destination.id.endsWith(":hand")
        ? { audioCue: "card.draw" as const }
        : {}),
    });
  }
  const groupedSteps = collapseDrawsByPlayer(steps);
  return groupedSteps.length || announcement
    ? {
        id: `${id}:locations`,
        version: 2,
        steps: [
          ...groupedSteps,
          ...(announcement
            ? [
                announcement.kind === "turn"
                  ? {
                      id: `${id}:turn`,
                      type: "phaseChange" as const,
                      from: announcement.fromPlayerId,
                      to: announcement.toPlayerId,
                      variant: "turn" as const,
                      player: { kind: "player" as const, id: announcement.toPlayerId },
                      turnNumber: announcement.turnNumber,
                      startAtMs: groupedSteps.length ? TRANSFER_DURATION_MS : 0,
                      durationMs: TURN_CHANGE_DURATION_MS,
                      audioCue: "turn.change" as const,
                    }
                  : {
                      id: `${id}:combat-step`,
                      type: "phaseChange" as const,
                      from: announcement.fromStep
                        ? `${announcement.fromStep}-step`
                        : "action-phase",
                      to: `${announcement.toStep}-step`,
                      variant: "phase" as const,
                      startAtMs: groupedSteps.length ? TRANSFER_DURATION_MS : 0,
                      durationMs: COMBAT_STEP_CHANGE_DURATION_MS,
                      audioCue: "phase.change" as const,
                    },
              ]
            : []),
        ],
      }
    : null;
}

function collapseDrawsByPlayer(steps: readonly EntityTransferStepV2[]): EntityTransferStepV2[] {
  const grouped: EntityTransferStepV2[] = [];
  const drawIndexByRoute = new Map<string, number>();
  for (const step of steps) {
    if (
      step.from?.kind !== "zone" ||
      step.to?.kind !== "zone" ||
      !step.from.id.endsWith(":deck") ||
      !step.to.id.endsWith(":hand")
    ) {
      grouped.push(step);
      continue;
    }
    const route = `${step.from.id}->${step.to.id}`;
    const existingIndex = drawIndexByRoute.get(route);
    if (existingIndex === undefined) {
      drawIndexByRoute.set(route, grouped.length);
      grouped.push({ ...step, quantity: 1 });
      continue;
    }
    const existing = grouped[existingIndex];
    if (!existing) continue;
    grouped[existingIndex] = { ...existing, quantity: (existing.quantity ?? 1) + 1 };
  }
  return grouped;
}

/** Do not disclose physical identity when neither endpoint is known to a viewer. */
export function redactFabTransferLocations(
  plan: AnimationPlanV2 | null,
  visibleIds: ReadonlySet<string>,
): AnimationPlanV2 | null {
  if (!plan) return null;
  const steps: AnimationStepV2[] = [];
  for (const step of plan.steps) {
    if (step.type === "phaseChange") {
      steps.push(step);
      continue;
    }
    if (step.type !== "entityTransfer") continue;
    steps.push({
      ...step,
      entity: {
        kind: "entity",
        id: visibleIds.has(step.entity.id) ? step.entity.id : `fab-hidden:${step.id}`,
      },
    });
  }
  return {
    ...plan,
    steps,
  };
}
