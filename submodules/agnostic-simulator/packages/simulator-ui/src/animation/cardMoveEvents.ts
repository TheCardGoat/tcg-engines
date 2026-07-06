import type { AnimationPlanV1, SimulatorAudioCueId } from "@tcg/protocol";

export interface CardMoveAnimationRecord {
  readonly id: string;
  readonly cardId: string;
  readonly ownerId: string;
  readonly fromZoneId?: string;
  readonly toZoneId: string;
  readonly reason?: string;
  readonly audioCue?: SimulatorAudioCueId;
  readonly delayMs?: number;
  readonly durationMs?: number;
}

export function cardMoveRecordsToAnimationPlans(
  records: readonly CardMoveAnimationRecord[],
): AnimationPlanV1[] {
  return records.map((record): AnimationPlanV1 => {
    const to = {
      kind: "zone" as const,
      id: record.toZoneId,
      ownerId: record.ownerId,
    };
    const from = record.fromZoneId
      ? {
          kind: "zone" as const,
          id: record.fromZoneId,
          ownerId: record.ownerId,
        }
      : undefined;
    return {
      id: record.id,
      version: 1,
      anchors: [],
      steps: [
        from
          ? {
              id: `${record.id}:move`,
              type: "moveEntity",
              entity: { kind: "entity", id: record.cardId },
              from,
              to,
              audioCue: record.audioCue,
              delayMs: record.delayMs,
              durationMs: record.durationMs,
            }
          : {
              id: `${record.id}:enter`,
              type: "enterEntity",
              entity: { kind: "entity", id: record.cardId },
              to,
              audioCue: record.audioCue,
              delayMs: record.delayMs,
              durationMs: record.durationMs,
            },
      ],
    };
  });
}
