import type { CardsMaps } from "./types.js";

export interface SectionBucketEntry {
  readonly instanceId: string;
  readonly definitionId: string;
  readonly sectionId: string;
}

export interface UnresolvedInstance {
  readonly instanceId: string;
  /**
   * The definition id from `cardsMaps.cardInstances`, when available. Absent
   * when the owner list references an instance id that is missing from
   * `cardInstances` (corrupt cardsMaps) — the `instanceId` is then the only
   * identifier available for diagnostics.
   */
  readonly definitionId?: string;
}

export interface GroupInstancesBySectionOptions {
  /**
   * Section assigned to instances that carry no section tag (legacy cardsMaps
   * paths). Omit to make untagged instances unresolved instead of guessed,
   * which is the fail-closed default.
   */
  readonly fallbackSection?: string;
  /**
   * When set, instances whose section is not in this set are treated as
   * unresolved instead of bucketed. Lets an adapter reject foreign section ids
   * without interpreting them.
   */
  readonly knownSections?: ReadonlySet<string>;
}

export interface SectionBuckets {
  readonly bySection: ReadonlyMap<string, SectionBucketEntry[]>;
  readonly unresolved: readonly UnresolvedInstance[];
}

/**
 * Group a flat per-owner instance list into named deck sections.
 *
 * Section membership comes from {@link CardsMaps.instanceSections} (populated
 * by the deck builder through the adapter) rather than from catalog card-type
 * lookup. This keeps the deck builder as the single source of truth for deck
 * topology and removes the need for game engines to re-derive sections.
 *
 * The helper is fail-closed: instances with no resolvable section land in
 * `unresolved` instead of being silently routed to a default bucket, so a
 * missing or foreign section surfaces as a rejected match setup rather than
 * silent zone corruption.
 */
export function groupInstancesBySection(
  ownerInstanceIds: readonly string[],
  cardsMaps: CardsMaps,
  options: GroupInstancesBySectionOptions = {},
): SectionBuckets {
  const { fallbackSection, knownSections } = options;
  const bySection = new Map<string, SectionBucketEntry[]>();
  const unresolved: UnresolvedInstance[] = [];

  for (const instanceId of ownerInstanceIds) {
    const definitionId = cardsMaps.cardInstances[instanceId];
    if (!definitionId) {
      // An owner list referencing an instance missing from cardInstances is a
      // corrupt cardsMaps. Surface it as unresolved instead of silently
      // dropping the card (which would shrink the deck without any signal).
      unresolved.push({ instanceId });
      continue;
    }
    const sectionId = cardsMaps.instanceSections?.[instanceId] ?? fallbackSection;
    if (!sectionId || (knownSections && !knownSections.has(sectionId))) {
      unresolved.push({ instanceId, definitionId });
      continue;
    }
    const entry: SectionBucketEntry = { instanceId, definitionId, sectionId };
    const bucket = bySection.get(sectionId);
    if (bucket) bucket.push(entry);
    else bySection.set(sectionId, [entry]);
  }

  return { bySection, unresolved };
}
