import type { AnimationPlanV2, AnimationStepV2 } from "@tcg/protocol/animations";
import { grandArchivePhysicalCards } from "./grand-archive-physical-cards";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";

/** Presentation diffs of authorized engine projections, never predictions or log prose. */
export function grandArchiveCombatAnimation(
  before: GrandArchiveHarnessFixture,
  after: GrandArchiveHarnessFixture,
): AnimationPlanV2 | null {
  if (after.table.status.stateVersion <= before.table.status.stateVersion) return null;
  const combat = after.combatView;
  const previous = before.combatView;
  const steps: AnimationStepV2[] = [];
  const id = `ga:${after.table.status.stateVersion}`;
  const displays = grandArchivePhysicalCards({
    entities: after.entities,
    zones: after.table.zones,
  }).displayEntityIds;
  const display = (entityId: string) => displays.get(entityId) ?? entityId;
  for (const entity of after.entities) {
    const source = before.entities.find((card) => card.id === entity.id);
    if (!source) continue;
    const from = before.table.zones.find((zone) => zone.entityIds.includes(entity.id));
    const to = after.table.zones.find((zone) => zone.entityIds.includes(entity.id));
    const sourceFace =
      source.face === "public" && source.dataAttributes?.["data-facing"] !== "face-down"
        ? "public"
        : "hidden";
    const destinationFace =
      entity.face === "public" && entity.dataAttributes?.["data-facing"] !== "face-down"
        ? "public"
        : "hidden";
    if (from && to && from.id !== to.id && !displays.has(entity.id)) {
      steps.push({
        id: `${id}:move:${entity.id}`,
        type: "entityTransfer",
        entity: { kind: "entity", id: entity.id },
        from: { kind: "zone", id: from.id },
        to: { kind: "zone", id: to.id },
        sourceFace,
        destinationFace,
        startAtMs: 0,
        durationMs: 280,
      });
    }
    if (source.states.includes("rested") !== entity.states.includes("rested")) {
      const face =
        entity.face === "public" && entity.dataAttributes?.["data-facing"] !== "face-down"
          ? "public"
          : "hidden";
      steps.push({
        id: `${id}:rest:${entity.id}`,
        type: "entityStateChange",
        entity: { kind: "entity", id: entity.id },
        at: { kind: "entity", id: entity.id },
        change: "orientation",
        fromRotationDeg: source.states.includes("rested") ? 45 : 0,
        toRotationDeg: entity.states.includes("rested") ? 45 : 0,
        sourceFace: face,
        destinationFace: face,
        durationMs: 200,
        startAtMs: 0,
      });
    }
  }
  const damageResolved =
    combat?.damage.kind === "dealt" && previous?.active && previous.damage.kind !== "dealt";
  if (damageResolved && combat.damage.kind === "dealt") {
    // Same start time preserves simultaneous damage even when retaliation was ordered.
    for (const [index, amount] of combat.damage.amounts.entries()) {
      if (amount.amount <= 0) continue;
      steps.push({
        id: `${id}:combat:${index}`,
        type: "combat",
        source: { kind: "entity", id: display(amount.sourceId) },
        target: { kind: "entity", id: display(amount.recipientId) },
        reason: "resolved",
        attackKind: "fight",
        showText: false,
        startAtMs: 0,
        durationMs: 360,
      });
    }
    const recipients = new Map<string, number>();
    for (const amount of combat.damage.amounts)
      recipients.set(amount.recipientId, (recipients.get(amount.recipientId) ?? 0) + amount.amount);
    for (const [recipient, amount] of recipients) {
      if (amount > 0)
        steps.push({
          id: `${id}:damage:${recipient}`,
          type: "valueDelta",
          subject: { kind: "entity", id: display(recipient) },
          delta: -amount,
          label: "Combat damage",
          tone: "negative",
          startAtMs: 0,
          durationMs: 650,
        });
    }
  }
  return steps.length ? { id, version: 2, steps } : null;
}
