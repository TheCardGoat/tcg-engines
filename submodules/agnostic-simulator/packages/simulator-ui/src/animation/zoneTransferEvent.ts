import type { ZoneTransferAnimationStep } from "../components/ZoneTransferAnimator";
import type { SimulatorAnimationEvent, SimulatorZoneTransferEvent } from "./events";

const SPECTATOR_VIEWER_ID = "__spectator__";

export function toZoneTransferAnimationStep(
  event: SimulatorAnimationEvent,
): ZoneTransferAnimationStep | null {
  if (!isZoneTransferEvent(event)) {
    return null;
  }

  return {
    id: event.id,
    kind: event.primitive === "draw" ? "draw" : "move-zone",
    entity: event.entity,
    fromZone: event.fromZone,
    toZone: event.toZone,
    viewerSeatId: event.viewer.viewerSeatId ?? SPECTATOR_VIEWER_ID,
    delayMs: event.delayMs,
    durationMs: event.durationMs,
  };
}

export function isZoneTransferEvent(
  event: SimulatorAnimationEvent,
): event is SimulatorZoneTransferEvent {
  return event.primitive === "zoneTransfer" || event.primitive === "draw";
}
