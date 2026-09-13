/**
 * Pick the next in-scope gap cluster for `/fab-close-gaps`.
 *
 * Families share a cluster when they share members, a specific (non-catch-all)
 * primitive path, a small family prefix, or a status-stem sibling. Catch-all
 * `has-status.ts` rows are not merged by path — that would one-shot the entire
 * status long tail as one handler table.
 */

export type GapKind = "engine-primitive" | "definition" | "out-of-scope" | "harness";
export type GapStatus = "open" | "pinned" | "resolved";

export interface GapMemberLike {
  readonly canonicalId?: string;
  readonly collectorNumber: string;
  readonly slug?: string;
}

export interface GapFamilyLike {
  readonly family: string;
  readonly kind: GapKind;
  readonly primitive: string | null;
  readonly status: GapStatus;
  readonly repro: string;
  readonly members: readonly GapMemberLike[];
}

export interface NextCluster {
  readonly families: readonly string[];
  readonly kindHint: GapKind | "mixed" | null;
  readonly members: readonly string[];
  readonly primitiveHint: string | null;
  readonly repros: readonly string[];
  readonly reason: string;
}

/** Prefixes small enough that every open family under them shares an owner. */
const PREFIX_MERGE = new Set(["instead", "binding", "wager", "amount", "targeting"]);

const CATCH_ALL_PRIMITIVES = new Set([
  "packages/engine/src/rules/evaluation/conditions/has-status.ts",
]);

export function familyPrefix(familyId: string): string {
  const slash = familyId.indexOf("/");
  return slash >= 0 ? familyId.slice(0, slash) : familyId;
}

/** Collapse `status/1-or-more-foo` and `status/2-or-more-foo` onto the same stem. */
export function statusStem(familyId: string): string | null {
  if (!familyId.startsWith("status/")) return null;
  let rest = familyId.slice("status/".length);
  const didnt = rest.startsWith("didnt-");
  if (didnt) rest = rest.slice("didnt-".length);
  const digits = leadingCountPrefix(rest);
  if (digits !== null) rest = rest.slice(digits.length);
  return rest;
}

function leadingCountPrefix(rest: string): string | null {
  const prefixes = [
    "1-or-more-",
    "2-or-more-",
    "3-or-more-",
    "4-or-more-",
    "5-or-more-",
    "6-or-more-",
  ];
  for (const p of prefixes) {
    if (rest.startsWith(p)) return p;
  }
  return null;
}

export function isInScope(family: GapFamilyLike): boolean {
  return family.status !== "resolved" && family.kind !== "out-of-scope";
}

function memberKeys(family: GapFamilyLike): Set<string> {
  const keys = new Set<string>();
  for (const m of family.members) {
    keys.add(m.collectorNumber.toLowerCase());
    if (m.canonicalId) keys.add(`id:${m.canonicalId}`);
    if (m.slug) keys.add(`slug:${m.slug.toLowerCase()}`);
  }
  return keys;
}

function sharesMember(a: Set<string>, b: GapFamilyLike): boolean {
  for (const k of memberKeys(b)) {
    if (a.has(k)) return true;
  }
  return false;
}

function shouldMerge(seed: GapFamilyLike, other: GapFamilyLike): boolean {
  if (seed.family === other.family) return true;
  if (sharesMember(memberKeys(seed), other)) return true;

  const prefix = familyPrefix(seed.family);
  if (PREFIX_MERGE.has(prefix) && familyPrefix(other.family) === prefix) return true;

  if (
    seed.primitive &&
    other.primitive &&
    seed.primitive === other.primitive &&
    !CATCH_ALL_PRIMITIVES.has(seed.primitive)
  ) {
    return true;
  }

  const seedStem = statusStem(seed.family);
  const otherStem = statusStem(other.family);
  return seedStem !== null && seedStem === otherStem;
}

function rank(a: GapFamilyLike, b: GapFamilyLike): number {
  const size = b.members.length - a.members.length;
  if (size !== 0) return size;
  return a.family.localeCompare(b.family);
}

function expand(seed: GapFamilyLike, open: readonly GapFamilyLike[]): GapFamilyLike[] {
  const group: GapFamilyLike[] = [seed];
  const used = new Set<string>([seed.family]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const candidate of open) {
      if (used.has(candidate.family)) continue;
      const merge = group.some((g) => shouldMerge(g, candidate));
      if (!merge) continue;
      group.push(candidate);
      used.add(candidate.family);
      changed = true;
    }
  }
  return group.sort((a, b) => a.family.localeCompare(b.family));
}

function toCluster(group: readonly GapFamilyLike[], reason: string): NextCluster {
  if (group.length === 0) {
    return {
      families: [],
      kindHint: null,
      members: [],
      primitiveHint: null,
      repros: [],
      reason,
    };
  }
  const kinds = new Set(group.map((g) => g.kind));
  const primitives = new Set(group.map((g) => g.primitive).filter((p): p is string => p !== null));
  const members = [
    ...new Set(group.flatMap((g) => g.members.map((m) => m.collectorNumber))),
  ].sort();
  const kindHint: NextCluster["kindHint"] = kinds.size === 1 ? ([...kinds][0] as GapKind) : "mixed";
  return {
    families: group.map((g) => g.family),
    kindHint,
    members,
    primitiveHint: primitives.size === 1 ? ([...primitives][0] as string) : null,
    repros: group.map((g) => g.repro),
    reason,
  };
}

export function selectNextCluster(
  families: readonly GapFamilyLike[],
  seedFamily?: string,
  exclude: readonly string[] = [],
): NextCluster {
  const excluded = new Set(exclude);
  const open = families.filter((f) => isInScope(f) && !excluded.has(f.family));
  if (seedFamily) {
    if (excluded.has(seedFamily)) {
      return toCluster([], `excluded ${seedFamily}`);
    }
    const seed = families.find((f) => f.family === seedFamily);
    if (!seed) {
      throw new Error(`No gap family "${seedFamily}".`);
    }
    if (!isInScope(seed)) {
      throw new Error(
        `Gap family "${seedFamily}" is ${seed.status === "resolved" ? "resolved" : seed.kind} and not in scope.`,
      );
    }
    return toCluster(expand(seed, open), `seeded from ${seedFamily}`);
  }
  if (open.length === 0) {
    return toCluster(
      [],
      excluded.size > 0
        ? "no remaining in-scope families after exclude"
        : "no open in-scope families",
    );
  }
  const ranked = open.slice().sort(rank);
  const seed = ranked[0]!;
  return toCluster(expand(seed, open), `densest in-scope family ${seed.family}`);
}
