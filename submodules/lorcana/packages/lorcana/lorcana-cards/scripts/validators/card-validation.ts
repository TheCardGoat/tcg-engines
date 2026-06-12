/**
 * Card validation: duplicate IDs, canonicalId/name consistency.
 * All validators return string[] of errors (empty if valid); caller aggregates and throws once.
 */

import type { CanonicalCard, PipelineIdMapping } from "../types";

/**
 * Validate pipeline ID mapping: byShortId and byCanonicalKey are inverse, no duplicate short IDs.
 * Returns array of error messages (empty if valid).
 */
export function validatePipelineIdMapping(pipelineIdMapping: PipelineIdMapping): string[] {
  const errors: string[] = [];
  const { byShortId, byCanonicalKey } = pipelineIdMapping;

  for (const [shortId, canonicalKey] of Object.entries(byShortId)) {
    if (byCanonicalKey[canonicalKey] !== shortId) {
      errors.push(
        `Pipeline ID mapping inconsistent: byShortId['${shortId}'] = '${canonicalKey}' but byCanonicalKey['${canonicalKey}'] = '${byCanonicalKey[canonicalKey] ?? "<missing>"}'`,
      );
    }
  }
  for (const [canonicalKey, shortId] of Object.entries(byCanonicalKey)) {
    if (byShortId[shortId] !== canonicalKey) {
      errors.push(
        `Pipeline ID mapping inconsistent: byCanonicalKey['${canonicalKey}'] = '${shortId}' but byShortId['${shortId}'] = '${byShortId[shortId] ?? "<missing>"}'`,
      );
    }
  }

  return errors;
}

/**
 * Validate ID mapping (file format): no duplicate short IDs, bidirectional consistency.
 * Returns array of error messages (empty if valid).
 * @deprecated IdMapping is deprecated, use CardsAuxKv instead
 */
export function validateIdMapping(idMapping: {
  byShortId: Record<string, string>;
  byFullName: Record<string, string>;
}): string[] {
  const errors: string[] = [];
  const { byShortId, byFullName } = idMapping;

  // Unique short IDs: no two fullNames may map to the same short ID
  const shortIdToFullNames = new Map<string, string[]>();
  for (const [fullName, shortId] of Object.entries(byFullName)) {
    const list = shortIdToFullNames.get(shortId) ?? [];
    list.push(fullName);
    shortIdToFullNames.set(shortId, list);
  }
  for (const [shortId, fullNames] of shortIdToFullNames) {
    if (fullNames.length > 1) {
      errors.push(`Duplicate short ID '${shortId}' maps to fullNames: ${fullNames.join(", ")}`);
    }
  }

  // Bidirectional consistency: byShortId and byFullName must be inverse
  for (const [shortId, fullName] of Object.entries(byShortId)) {
    if (byFullName[fullName] !== shortId) {
      errors.push(
        `ID mapping inconsistent: byShortId['${shortId}'] = '${fullName}' but byFullName['${fullName}'] = '${byFullName[fullName] ?? "<missing>"}'`,
      );
    }
  }

  return errors;
}

const displayName = (card: CanonicalCard) =>
  card.version ? `${card.name} - ${card.version}` : card.name;

/** Full name (name + version) used for card identity; same as display name. */
const fullName = (card: CanonicalCard) => displayName(card);

const CANONICAL_ID_PREFIX = "ci_";

/**
 * Validate that every card has a canonicalId beginning with ci_, and that all cards
 * sharing the same canonicalId have the same full name when compared case-insensitively.
 * Returns array of error messages (empty if valid).
 */
export function validateCanonicalIdNames(canonicalCards: Record<string, CanonicalCard>): string[] {
  const errors: string[] = [];
  const byCanonicalId = new Map<string, Array<{ shortId: string; fullName: string }>>();

  for (const [shortId, card] of Object.entries(canonicalCards)) {
    const canonicalId = card.canonicalId;
    if (!canonicalId) {
      errors.push(
        `Card ${shortId} (${displayName(card)}) is missing canonicalId. Generation requires canonicalId on every card.`,
      );
      continue;
    }
    if (!canonicalId.startsWith(CANONICAL_ID_PREFIX)) {
      errors.push(
        `Card ${shortId} (${displayName(card)}) canonicalId must begin with "${CANONICAL_ID_PREFIX}", got: ${canonicalId}`,
      );
      continue;
    }
    const entry = { shortId, fullName: fullName(card) };
    if (!byCanonicalId.has(canonicalId)) {
      byCanonicalId.set(canonicalId, []);
    }
    byCanonicalId.get(canonicalId)!.push(entry);
  }

  for (const [canonicalId, cards] of byCanonicalId) {
    const fullNamesByLowerCase = new Map<string, string>();
    for (const c of cards) {
      const key = c.fullName.toLowerCase();
      if (!fullNamesByLowerCase.has(key)) {
        fullNamesByLowerCase.set(key, c.fullName);
      }
    }
    if (fullNamesByLowerCase.size > 1) {
      const distinctNames = [...fullNamesByLowerCase.values()].join(" | ");
      const detail = cards.map((c) => `${c.shortId}: "${c.fullName}"`).join("; ");
      errors.push(
        `Canonical ID ${canonicalId} has cards with different names: ${distinctNames}. Cards: ${detail}`,
      );
    }
  }

  return errors;
}

/**
 * Validate that every card has a non-empty canonicalId (canonicalId = shortId).
 * Returns array of error messages (empty if valid).
 */
export function validateFullNameCanonicalId(
  canonicalCards: Record<string, CanonicalCard>,
): string[] {
  const errors: string[] = [];
  for (const [id, card] of Object.entries(canonicalCards)) {
    if (!card.canonicalId?.trim()) {
      errors.push(
        `Card ${id} (${displayName(card)}) is missing canonicalId. Generation requires canonicalId on every card.`,
      );
    }
  }
  return errors;
}

/**
 * Validate that existing TypeScript card source files have IDs consistent with
 * the newly-generated canonical cards. Catches divergence when canonical-cards.json
 * is updated without regenerating the TypeScript files.
 *
 * @param existingCardFiles Map of printingId → shortId as read from the existing
 *   TypeScript source (e.g. from parsing `id: "xyz"` in each .ts card file).
 * @param generatedCanonicalCards The canonical cards just produced by this run.
 * Returns array of error messages (empty if valid).
 */
export function validateSourceIdsMatchCanonical(
  existingCardFiles: Record<string, string>,
  generatedCanonicalCards: Record<string, CanonicalCard>,
): string[] {
  const errors: string[] = [];
  for (const [printingId, sourceId] of Object.entries(existingCardFiles)) {
    const canonicalCard = generatedCanonicalCards[printingId];
    if (!canonicalCard) continue; // new card not yet in source — skip
    if (canonicalCard.id !== sourceId) {
      errors.push(
        `Source file for ${printingId} (${displayName(canonicalCard)}) has id "${sourceId}" but canonical-cards.json requires "${canonicalCard.id}". Re-run generate-cards.ts to sync.`,
      );
    }
  }
  return errors;
}

/**
 * Validate that every card has a unique id (no two cards share the same id).
 * Each printing must have a distinct id (e.g. set1-104 vs set1-211-enchanted).
 * Returns array of error messages (empty if valid).
 */
export function validateUniqueCardIds(canonicalCards: Record<string, CanonicalCard>): string[] {
  const errors: string[] = [];
  const seenIds = new Map<string, string[]>();
  for (const [recordKey, card] of Object.entries(canonicalCards)) {
    const id = card.id;
    const list = seenIds.get(id) ?? [];
    list.push(`${recordKey} (${displayName(card)})`);
    seenIds.set(id, list);
  }
  for (const [id, cards] of seenIds) {
    if (cards.length > 1) {
      errors.push(`Duplicate card id "${id}" used by ${cards.length} cards: ${cards.join("; ")}`);
    }
  }
  return errors;
}
