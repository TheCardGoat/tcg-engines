import { groupInstancesBySection, type CardsMaps } from "@tcg/shared/game-adapter";

interface GundamDeckCatalog {
  get(definitionId: string): { type?: string } | undefined;
}

/** Sections the Gundam engine routes to its main and resource decks. */
export const GUNDAM_MAIN_SECTION = "main";
export const GUNDAM_RESOURCE_SECTION = "resource";
const GUNDAM_KNOWN_SECTIONS: ReadonlySet<string> = new Set([
  GUNDAM_MAIN_SECTION,
  GUNDAM_RESOURCE_SECTION,
]);

export interface RejectedInstance {
  readonly definitionId: string;
  readonly reason: string;
}

export interface SplitDeckResult {
  deck: string[];
  resourceDeck: string[];
  /**
   * Instances that could not be routed to a section. Only populated by the
   * section-driven path; the legacy fallback preserves its prior fail-open
   * behavior for backward compatibility.
   */
  rejected?: readonly RejectedInstance[];
}

/**
 * Slot a flat sequence of definition IDs (the shared cardsMaps shape) into
 * Gundam's main-deck / resource-deck split.
 *
 * Prefers the deck builder's section tag ({@link CardsMaps.instanceSections})
 * so the engine does not classify cards by catalog type — the section the
 * player chose in the builder is the single source of truth. When a cardsMaps
 * carries no section tags at all (legacy snapshots, untagged practice routes),
 * it falls back to catalog `type` classification so those paths keep working.
 *
 * The section-driven path is fail-closed: instances whose section cannot be
 * resolved land in `rejected` instead of being silently routed to the main
 * deck, so a missing tag surfaces as a rejected match setup rather than silent
 * zone corruption.
 */
export function splitDeckForSetup(
  ownerInstanceIds: readonly string[],
  cardsMaps: CardsMaps,
  catalog: GundamDeckCatalog,
): SplitDeckResult {
  if (cardsMaps.instanceSections) {
    return splitBySection(ownerInstanceIds, cardsMaps);
  }
  return splitByLegacyType(ownerInstanceIds, cardsMaps, catalog);
}

function splitBySection(
  ownerInstanceIds: readonly string[],
  cardsMaps: CardsMaps,
): SplitDeckResult {
  const { bySection, unresolved } = groupInstancesBySection(ownerInstanceIds, cardsMaps, {
    knownSections: GUNDAM_KNOWN_SECTIONS,
  });
  return {
    deck: (bySection.get(GUNDAM_MAIN_SECTION) ?? []).map((entry) => entry.definitionId),
    resourceDeck: (bySection.get(GUNDAM_RESOURCE_SECTION) ?? []).map((entry) => entry.definitionId),
    rejected: unresolved.map((instance) => ({
      definitionId: instance.definitionId ?? instance.instanceId,
      reason: "no-section",
    })),
  };
}

/**
 * Transitional catalog-type classifier for cardsMaps that carry no section
 * tags. Kept so legacy snapshots and untagged practice routes keep working
 * until every caller threads `sectionId`. New match setup is expected to use
 * the section-driven path.
 */
function splitByLegacyType(
  ownerInstanceIds: readonly string[],
  cardsMaps: CardsMaps,
  catalog: GundamDeckCatalog,
): SplitDeckResult {
  const deck: string[] = [];
  const resourceDeck: string[] = [];
  for (const instanceId of ownerInstanceIds) {
    const definitionId = cardsMaps.cardInstances[instanceId];
    if (!definitionId) continue;
    const def = catalog.get(definitionId);
    if (def?.type === "resource") {
      resourceDeck.push(definitionId);
    } else {
      deck.push(definitionId);
    }
  }
  return { deck, resourceDeck };
}
