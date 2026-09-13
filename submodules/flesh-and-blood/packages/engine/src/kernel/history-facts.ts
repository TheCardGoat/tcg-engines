import type { FabActiveFaceState, FabObjectRecord } from "../game/objects.ts";

/** Closed token kinds that materialize bounded player-history flags. */
export type HistoryTokenKind =
  | "toughness"
  | "gold"
  | "runechant"
  | "fealty"
  | "seismic-surge"
  | "gate-to-i-arathael"
  | "vigor"
  | "might"
  | "crouching-tiger";

/** Physical Agility // Gold twin. Front is Agility; back is Gold. */
const AGILITY_GOLD_PHYSICAL_ID = "WqTTMjDgKKCp7Lnb7LH6d";
const AGILITY_GOLD_BACK_FACE_ID = `${AGILITY_GOLD_PHYSICAL_ID}:face:back`;

/**
 * Slug table for history-facing tokens. Twin-face Gold and Gate persist their
 * catalog ids at runtime; those ids live here as aliases, not at call sites.
 * The Agility // Gold physical id is not Gold by itself — only the back face is.
 */
const HISTORY_TOKEN_SLUGS = {
  toughness: "toughness",
  Cn8tK9KRm7d9KbcQk6Pqm: "toughness",
  gold: "gold",
  "8qdmprPg7kckn8ktMTKQh": "gold",
  runechant: "runechant",
  zfrHQjbPkpBmdQGrWcTMB: "runechant",
  fealty: "fealty",
  n9FtLHDg97rfrTNJDMBG6: "fealty",
  "seismic-surge": "seismic-surge",
  Rf8CHpzmhJNppCtDDKWDm: "seismic-surge",
  "gate-to-i-arathael": "gate-to-i-arathael",
  JtkWt6Kzpgz9qpPLPp8Ff: "gate-to-i-arathael",
  vigor: "vigor",
  DBhPCQqjnj6qqd9DtBB7W: "vigor",
  might: "might",
  "6gqTwGnmHjkCLDqKPWt8c": "might",
  "crouching-tiger": "crouching-tiger",
} as const satisfies Record<string, HistoryTokenKind>;

type HistoryTokenSlug = keyof typeof HISTORY_TOKEN_SLUGS;

export type HistoryTokenIdentity = {
  readonly objectKind?: FabObjectRecord["objectKind"] | null;
  readonly canonicalId?: string | null;
  readonly activeFace?: FabActiveFaceState | null;
};

function isHistoryTokenSlug(slug: string): slug is HistoryTokenSlug {
  return Object.hasOwn(HISTORY_TOKEN_SLUGS, slug);
}

function kindForSlug(slug: string): HistoryTokenKind | null {
  return isHistoryTokenSlug(slug) ? HISTORY_TOKEN_SLUGS[slug] : null;
}

/** Identify a history token from a persisted canonical id, including catalog aliases. */
export function historyTokenKindFromCanonicalId(
  canonicalId: string | null | undefined,
): HistoryTokenKind | null {
  if (!canonicalId) return null;
  const slug = canonicalId.startsWith("token:") ? canonicalId.slice("token:".length) : canonicalId;
  return kindForSlug(slug);
}

/** Classify from id plus active face. The Agility // Gold physical id is Gold only on the back. */
export function historyTokenKindFromIdentity(
  object: Pick<HistoryTokenIdentity, "canonicalId" | "activeFace"> | null | undefined,
): HistoryTokenKind | null {
  if (!object) return null;
  const fromId = historyTokenKindFromCanonicalId(object.canonicalId);
  if (fromId) return fromId;
  return agilityGoldBackKind(object.canonicalId, object.activeFace);
}

function agilityGoldBackKind(
  canonicalId: string | null | undefined,
  activeFace: FabActiveFaceState | null | undefined,
): HistoryTokenKind | null {
  if (!canonicalId || !activeFace || activeFace.kind !== "paired") return null;
  const physicalId = canonicalId.startsWith("token:")
    ? canonicalId.slice("token:".length)
    : canonicalId;
  if (physicalId !== AGILITY_GOLD_PHYSICAL_ID) return null;
  return activeFace.activeFaceIds.includes(AGILITY_GOLD_BACK_FACE_ID) ? "gold" : null;
}

/** Created-token path for history ledgers. Live scans use {@link historyTokenKindFromCanonicalId}. */
export function historyTokenKindOf(
  object: HistoryTokenIdentity | null | undefined,
): HistoryTokenKind | null {
  if (!object || object.objectKind !== "created-token") return null;
  return historyTokenKindFromIdentity(object);
}
