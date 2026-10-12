import type { SimulatorEntity } from "@tcg/simulator-contract";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
import { grandArchiveCombatAnimation } from "./grand-archive-combat-animation";
import { grandArchivePhysicalCards } from "./grand-archive-physical-cards";

export interface GrandArchiveDamageImpact {
  readonly sourceId?: string;
  readonly targetId: string;
  readonly amount: number;
}
function markedDamage(entity: SimulatorEntity): number {
  const counter = entity.decorations?.find((entry) => entry.id === "ga:counter:damage");
  return counter?.content.kind === "text" ? Number(counter.content.text) || 0 : 0;
}
/** Confirmed combat amounts retain their native source. Other damage uses a local impact only. */
export function grandArchiveDamageImpacts(
  before: GrandArchiveHarnessFixture,
  after: GrandArchiveHarnessFixture,
): GrandArchiveDamageImpact[] {
  if (after.table.status.stateVersion <= before.table.status.stateVersion) return [];
  const displayIds = new Map([
    ...grandArchivePhysicalCards({ entities: before.entities, zones: before.table.zones })
      .displayEntityIds,
    ...grandArchivePhysicalCards({ entities: after.entities, zones: after.table.zones })
      .displayEntityIds,
  ]);
  const display = (id: string) => displayIds.get(id) ?? id;
  const result: GrandArchiveDamageImpact[] = [];
  const combat = after.combatView;
  const resolved = grandArchiveCombatAnimation(before, after)?.steps.some(
    (step) => step.type === "combat",
  );
  if (resolved && combat?.damage.kind === "dealt") {
    for (const entry of combat.damage.amounts) {
      if (entry.amount > 0)
        result.push({
          sourceId: display(entry.sourceId),
          targetId: display(entry.recipientId),
          amount: entry.amount,
        });
    }
  }
  const covered = new Set(result.map((entry) => entry.targetId));
  for (const entity of after.entities) {
    if (entity.face !== "public" || covered.has(display(entity.id))) continue;
    const previous = before.entities.find(
      (entry) => entry.id === entity.id && entry.face === "public",
    );
    if (
      !previous ||
      previous.dataAttributes?.["data-incarnation"] !== entity.dataAttributes?.["data-incarnation"]
    )
      continue;
    const amount = markedDamage(entity) - markedDamage(previous);
    if (amount > 0) {
      result.push({ targetId: display(entity.id), amount });
      covered.add(display(entity.id));
    }
  }
  return result;
}
