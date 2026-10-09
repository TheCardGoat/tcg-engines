import { getGrandArchiveCard } from "@tcg/grand-archive-cards";
import { grandArchiveCardPresentation } from "@tcg/grand-archive-server-adapter";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

export type GrandArchivePhysicalCard =
  | { readonly kind: "authoritative"; readonly entity: SimulatorEntity; readonly hostId?: string }
  | { readonly kind: "inspection-only"; readonly entity: SimulatorEntity; readonly hostId: string };

export interface GrandArchivePhysicalCardProjection {
  readonly cards: readonly GrandArchivePhysicalCard[];
  /** Bottom-to-top physical display order; the top is always the field object. */
  readonly stacks: readonly { readonly hostId: string; readonly layerIds: readonly string[] }[];
  /** Authoritative identities represented by another physical mesh. */
  readonly displayEntityIds: ReadonlyMap<string, string>;
  /** Native current-level cards whose face is already represented by the field object. */
  readonly suppressedEntityIds: ReadonlySet<string>;
}

function hostId(entity: SimulatorEntity): string | undefined {
  const value = entity.dataAttributes?.["data-host-id"];
  return typeof value === "string" ? value : undefined;
}

function lineagePosition(entity: SimulatorEntity): number {
  const value = entity.dataAttributes?.["data-lineage-position"];
  return typeof value === "number" ? value : -1;
}

/**
 * Reconstruct physical presentation from the existing viewer projection only.
 * Champion / Leveling Up 1,6–7: the field object has the current champion face;
 * the original base face and earlier physical cards form its lower lineage.
 * This does not replace authoritative identities, candidates, or zone counts.
 */
export function grandArchivePhysicalCards({
  entities,
  zones,
}: {
  readonly entities: readonly SimulatorEntity[];
  readonly zones: readonly SimulatorZone[];
}): GrandArchivePhysicalCardProjection {
  const byId = new Map(entities.map((entity) => [entity.id, entity]));
  const lineageIds = zones
    .filter((zone) => zone.id.endsWith(":inner-lineage"))
    .flatMap((zone) => zone.entityIds);
  const fieldIds = zones
    .filter((zone) => zone.id.endsWith(":field"))
    .flatMap((zone) => zone.entityIds);
  const suppressedEntityIds = new Set<string>();
  const displayEntityIds = new Map<string, string>();
  const bases: GrandArchivePhysicalCard[] = [];
  const stacks: { hostId: string; layerIds: readonly string[] }[] = [];

  for (const fieldId of fieldIds) {
    const host = byId.get(fieldId);
    if (!host) continue;
    const lineage = lineageIds
      .flatMap((id) => {
        const entity = byId.get(id);
        return entity && hostId(entity) === host.id ? [entity] : [];
      })
      .sort((left, right) => lineagePosition(left) - lineagePosition(right));
    if (lineage.length === 0) continue;
    // Hidden records never authorize a catalog lookup or current-face correlation.
    const publicHost = host.face === "public";
    const currentDefinitionId = publicHost
      ? host.dataAttributes?.["data-definition-id"]
      : undefined;
    const current =
      typeof currentDefinitionId === "string"
        ? lineage.findLast(
            (entity) =>
              entity.face === "public" &&
              entity.kind === "leader" &&
              entity.dataAttributes?.["data-definition-id"] === currentDefinitionId,
          )
        : undefined;
    if (current) {
      suppressedEntityIds.add(current.id);
      displayEntityIds.set(current.id, host.id);
    }
    const lowerCards = lineage.filter((entity) => entity.id !== current?.id);
    const definitionId = publicHost ? host.dataAttributes?.["data-base-definition-id"] : undefined;
    const hasPublicChampionLevel = lineage.some(
      (entity) => entity.face === "public" && entity.kind === "leader",
    );
    const base =
      typeof definitionId === "string" && hasPublicChampionLevel
        ? getGrandArchiveCard(definitionId)
        : undefined;
    if (base) {
      const entity = grandArchiveCardPresentation({
        id: `${host.id}:lineage-base`,
        title: base.name,
        subtitle: "Inner Lineage",
        ownerId: host.ownerId,
        kind: "card",
        face: "public",
        imageUrl: base.printings[0]?.imageUrl,
        imageAspectRatio: 5 / 7,
        states: [],
        stats: [],
        traits: [],
        dataAttributes: {
          "data-definition-id": base.canonicalId,
          "data-lineage-position": lineagePosition(host),
          "data-host-id": host.id,
        },
      });
      bases.push({ kind: "inspection-only", entity, hostId: host.id });
      lowerCards.push(entity);
    }
    lowerCards.sort((left, right) => lineagePosition(left) - lineagePosition(right));
    stacks.push({ hostId: host.id, layerIds: [...lowerCards.map((entity) => entity.id), host.id] });
  }

  return {
    cards: [
      ...entities
        .filter((entity) => !suppressedEntityIds.has(entity.id))
        .map((entity): GrandArchivePhysicalCard => ({
          kind: "authoritative",
          entity,
          ...(hostId(entity) ? { hostId: hostId(entity) } : {}),
        })),
      ...bases,
    ],
    stacks,
    suppressedEntityIds,
    displayEntityIds,
  };
}
