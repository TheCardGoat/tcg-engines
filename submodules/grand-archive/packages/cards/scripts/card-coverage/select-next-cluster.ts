export type GrandArchiveGapKind = "engine-primitive" | "definition" | "harness" | "out-of-scope";
export type GrandArchiveGapStatus = "open" | "pinned" | "resolved";

export interface GrandArchiveGapMember {
  readonly canonicalId: string;
  readonly abilityIds: readonly string[];
}

export interface GrandArchiveGapFamily {
  readonly family: string;
  readonly kind: GrandArchiveGapKind;
  readonly primitive: string | null;
  readonly status: GrandArchiveGapStatus;
  readonly repro: string;
  readonly resolvedBy?: string | null;
  readonly members: readonly GrandArchiveGapMember[];
}

export interface GrandArchiveNextGapCluster {
  readonly families: readonly string[];
  readonly abilityIds: readonly string[];
  readonly canonicalIds: readonly string[];
  readonly primitive: string | null;
  readonly reason: string;
}

function inScope(family: GrandArchiveGapFamily): boolean {
  return family.status !== "resolved" && family.kind !== "out-of-scope";
}

function memberKeys(family: GrandArchiveGapFamily): Set<string> {
  return new Set(family.members.flatMap((member) => [member.canonicalId, ...member.abilityIds]));
}

function overlaps(left: GrandArchiveGapFamily, right: GrandArchiveGapFamily): boolean {
  const leftKeys = memberKeys(left);
  for (const key of memberKeys(right)) {
    if (leftKeys.has(key)) return true;
  }
  return Boolean(left.primitive && left.primitive === right.primitive);
}

function expand(
  seed: GrandArchiveGapFamily,
  families: readonly GrandArchiveGapFamily[],
): GrandArchiveGapFamily[] {
  const selected = [seed];
  const used = new Set([seed.family]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const candidate of families) {
      if (used.has(candidate.family) || !selected.some((item) => overlaps(item, candidate)))
        continue;
      selected.push(candidate);
      used.add(candidate.family);
      changed = true;
    }
  }
  return selected.sort((left, right) => left.family.localeCompare(right.family));
}

export function selectNextGrandArchiveGapCluster(
  families: readonly GrandArchiveGapFamily[],
  seedFamily?: string,
): GrandArchiveNextGapCluster {
  const open = families.filter(inScope);
  const seed = seedFamily
    ? families.find((family) => family.family === seedFamily)
    : open.slice().sort((left, right) => {
        const size = right.members.length - left.members.length;
        return size || left.family.localeCompare(right.family);
      })[0];
  if (!seed) {
    return {
      families: [],
      abilityIds: [],
      canonicalIds: [],
      primitive: null,
      reason: "no open gaps",
    };
  }
  if (!inScope(seed)) throw new Error(`Gap family ${seed.family} is not in scope.`);
  const cluster = expand(seed, open);
  const primitives = new Set(cluster.map((family) => family.primitive).filter(Boolean));
  return {
    families: cluster.map((family) => family.family),
    abilityIds: [
      ...new Set(
        cluster.flatMap((family) => family.members.flatMap((member) => member.abilityIds)),
      ),
    ].sort(),
    canonicalIds: [
      ...new Set(cluster.flatMap((family) => family.members.map((member) => member.canonicalId))),
    ].sort(),
    primitive: primitives.size === 1 ? ([...primitives][0] as string) : null,
    reason: seedFamily ? `seeded from ${seedFamily}` : `densest family ${seed.family}`,
  };
}
