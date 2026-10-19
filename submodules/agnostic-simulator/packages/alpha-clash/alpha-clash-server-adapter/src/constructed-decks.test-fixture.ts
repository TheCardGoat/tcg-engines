// Test-only constructed lists. These are not approved release presets.
import { officialCatalog, getCard } from "@tcg/alpha-clash-cards";
import type { DeckCard } from "@tcg/shared/game-adapter";
const ALPHA_CLASH_CONTENDER_SECTION_ID = "contender";
const ALPHA_CLASH_MAIN_SECTION_ID = "main";
const lookup = getCard;
/** Keep preset identifiers stable for existing practice links; use official Contenders. */
const PRACTICE_CONTENDERS: Readonly<Record<string, readonly string[]>> = {
  "starter-titan": ["ac-st-001"], // Magnate, Awakened
  "starter-warden": ["ac-ac1-096"], // Torque, the Diabolical
};

/**
 * Deterministic 50-card constructed decks assembled from the official
 * catalog: a named Contender plus up-to-4-copy playsets of color-matching
 * cards in catalog order (respecting the Clash Buff and Unrivaled limits).
 */
export function buildPracticeDeck(presetId: string): readonly DeckCard[] | undefined {
  const contenderIds = PRACTICE_CONTENDERS[presetId];
  const contender = contenderIds?.length === 1 ? lookup(contenderIds[0]) : undefined;
  if (!contender) return undefined;

  // Practice needs a renderable printing; some promo records have no artwork metadata.
  const pool = officialCatalog.filter(
    (card) =>
      Boolean(card.printings?.[0]?.productId) &&
      card.id !== contender.id &&
      card.cardType !== "contender" &&
      card.colors.some((color) => contender.colors.includes(color)),
  );
  const entries: DeckCard[] = [
    { cardId: contender.id, sectionId: ALPHA_CLASH_CONTENDER_SECTION_ID, quantity: 1 },
  ];
  let total = 0;
  let clashBuffs = 0;
  let unrivaled = 0;
  for (const card of pool) {
    if (total >= 50) break;
    let quantity = 4;
    const isBuff = card.cardType === "action" && card.subtype === "clash-buff";
    const isUnrivaled = card.cardType === "clash" && card.keywords?.includes("unrivaled") === true;
    if (isUnrivaled && unrivaled >= 1) continue;
    // Unrivaled is one copy per deck (rule 704.15).
    if (isUnrivaled) quantity = 1;
    if (isBuff && clashBuffs > 0) quantity = Math.min(quantity, 4 - clashBuffs);
    const remaining = 50 - total;
    quantity = Math.min(quantity, remaining);
    if (quantity <= 0) continue;
    entries.push({ cardId: card.id, sectionId: ALPHA_CLASH_MAIN_SECTION_ID, quantity });
    total += quantity;
    if (isBuff) clashBuffs += quantity;
    if (isUnrivaled) unrivaled += 1;
  }
  if (total !== 50) return undefined;
  return entries;
}
