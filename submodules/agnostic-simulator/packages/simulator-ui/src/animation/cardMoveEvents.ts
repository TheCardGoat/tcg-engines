import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import type { SimulatorAnimationEvent } from "./events";

export interface CardMoveAnimationRecord {
  readonly id: string;
  readonly cardId: string;
  readonly ownerId: string;
  readonly fromZoneId?: string;
  readonly toZoneId: string;
  readonly reason?: string;
  readonly delayMs?: number;
  readonly durationMs?: number;
}

export interface CardMoveAnimationContext {
  readonly viewerSeatId: string | null;
  readonly resolveEntity: (cardId: string) => SimulatorEntity | null | undefined;
  readonly zoneDescriptor: (zoneId: string, ownerId: string) => SimulatorZone | null | undefined;
}

export function cardMoveRecordsToSimulatorEvents(
  records: readonly CardMoveAnimationRecord[],
  context: CardMoveAnimationContext,
): SimulatorAnimationEvent[] {
  return records.flatMap((record) => cardMoveRecordToSimulatorEvent(record, context) ?? []);
}

export function cardMoveRecordToSimulatorEvent(
  record: CardMoveAnimationRecord,
  context: CardMoveAnimationContext,
): SimulatorAnimationEvent | null {
  const entity = context.resolveEntity(record.cardId);
  const toZone = context.zoneDescriptor(record.toZoneId, record.ownerId);
  if (!entity || !toZone) {
    return null;
  }

  const eventBase = {
    id: record.id,
    viewer: { viewerSeatId: context.viewerSeatId },
    delayMs: record.delayMs,
    durationMs: record.durationMs,
  };

  if (!record.fromZoneId) {
    return {
      ...eventBase,
      primitive: "zoneEnter",
      entity,
      toZone,
    };
  }

  const fromZone = context.zoneDescriptor(record.fromZoneId, record.ownerId);
  if (!fromZone) {
    return null;
  }

  return {
    ...eventBase,
    primitive: isDrawRecord(record) ? "draw" : "zoneTransfer",
    entity,
    fromZone,
    toZone,
  };
}

function isDrawRecord(record: CardMoveAnimationRecord): boolean {
  return record.reason === "draw" || (record.fromZoneId === "deck" && record.toZoneId === "hand");
}
