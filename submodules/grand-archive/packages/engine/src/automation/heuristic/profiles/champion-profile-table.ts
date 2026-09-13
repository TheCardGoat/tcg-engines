import type { GrandArchiveBotStrategy } from "../../bot-strategies.ts";

export interface GrandArchiveChampionIdentity {
  /** Canonical identity of the current top card in the lineage. */
  readonly canonicalId: string;
  readonly name: string;
  /** Explicit lineage characteristic from card data, not a display-name heuristic. */
  readonly lineageName: string | null;
  readonly level: number | null;
}

export type GrandArchiveChampionMatcher = (champion: GrandArchiveChampionIdentity) => boolean;

export interface GrandArchiveChampionProfileBinding {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly strategy: GrandArchiveBotStrategy;
  readonly championMatch: GrandArchiveChampionMatcher;
}

export interface GrandArchiveChampionMatchSpec {
  readonly canonicalIds?: readonly string[];
  readonly names?: readonly string[];
  readonly lineageNames?: readonly string[];
}

function normalizedIdentity(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase("en-US");
}

/**
 * Creates an exact matcher from stable identity data. Display names and explicit
 * lineage names are normalized for case and Unicode only; substring matching is
 * intentionally unsupported.
 */
export function createGrandArchiveChampionMatcher(
  spec: GrandArchiveChampionMatchSpec,
): GrandArchiveChampionMatcher {
  const canonicalIds = new Set(spec.canonicalIds ?? []);
  const names = new Set((spec.names ?? []).map(normalizedIdentity));
  const lineageNames = new Set((spec.lineageNames ?? []).map(normalizedIdentity));
  if (canonicalIds.size + names.size + lineageNames.size === 0) {
    throw new Error("A Grand Archive champion matcher requires at least one exact identity.");
  }
  return (champion) =>
    canonicalIds.has(champion.canonicalId) ||
    names.has(normalizedIdentity(champion.name)) ||
    (champion.lineageName !== null && lineageNames.has(normalizedIdentity(champion.lineageName)));
}

/**
 * Ordered bindings are the single source of dispatch precedence. No champion-
 * specific policies exist yet; add one here together with its focused tests.
 */
export const GRAND_ARCHIVE_CHAMPION_PROFILE_BINDINGS: readonly GrandArchiveChampionProfileBinding[] =
  [];

export function resolveGrandArchiveChampionProfileBinding(
  champion: GrandArchiveChampionIdentity,
  bindings: readonly GrandArchiveChampionProfileBinding[] = GRAND_ARCHIVE_CHAMPION_PROFILE_BINDINGS,
): GrandArchiveChampionProfileBinding | undefined {
  return bindings.find((binding) => binding.championMatch(champion));
}
