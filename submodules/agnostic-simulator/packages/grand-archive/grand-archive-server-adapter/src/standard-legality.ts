import { allGrandArchiveCards, getGrandArchiveCard } from "@tcg/grand-archive-cards";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";

/** Version the admission policy independently of executable match rules. */
export const grandArchiveStandardLegalityVersion = bytesToHex(
  sha256(
    new TextEncoder().encode(
      JSON.stringify(
        allGrandArchiveCards
          .map((card) => [
            card.canonicalId,
            card.name,
            card.types.includes("CHAMPION") || card.types.includes("REGALIA") ? 1 : 4,
            card.legality?.STANDARD?.limit ?? null,
          ])
          .sort(([a], [b]) => String(a).localeCompare(String(b))),
      ),
    ),
  ),
);

/** Tournament Rules: Sideboarding; combined registered sections share copy limits. */
export function assertGrandArchiveStandardLegality(
  entries: readonly { readonly definitionId: string; readonly count: number }[],
): void {
  const counts = new Map<string, { count: number; limit: number }>();
  for (const entry of entries) {
    const card = getGrandArchiveCard(entry.definitionId);
    if (!card) throw new Error(`Unknown Grand Archive card: ${entry.definitionId}`);
    if (!Number.isSafeInteger(entry.count) || entry.count < 1)
      throw new Error("Invalid card quantity");
    const ordinaryLimit = card.types.includes("CHAMPION") || card.types.includes("REGALIA") ? 1 : 4;
    const limit = Math.min(ordinaryLimit, card.legality?.STANDARD?.limit ?? ordinaryLimit);
    const prior = counts.get(card.name);
    counts.set(card.name, {
      count: (prior?.count ?? 0) + entry.count,
      limit: Math.min(prior?.limit ?? limit, limit),
    });
  }
  for (const [name, { count, limit }] of counts) {
    if (count > limit)
      throw new Error(
        `${name} is limited to ${limit} copies in Standard across main, material, and sideboard; received ${count}.`,
      );
  }
}
