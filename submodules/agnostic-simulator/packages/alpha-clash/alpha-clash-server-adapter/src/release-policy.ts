import { getCard, officialCardImageUrl } from "@tcg/alpha-clash-cards";
import { validateDeck } from "@tcg/alpha-clash-engine";
import type { DeckCard } from "@tcg/shared/game-adapter";
import {
  ALPHA_CLASH_META_DECKS,
  containsUnparsed,
  resolveAlphaClashLabDeck,
} from "./practice-decks";
import reviewed from "./release-card-audits.json" with { type: "json" };

// A rulebook revision requires a fresh audit, even when definitions are unchanged.
const approvedAudits = reviewed.rulesVersion === "8.0" ? reviewed.cards : [];

export interface AlphaClashCardAudit {
  readonly cardId: string;
  readonly reviewedDefinition: unknown;
  readonly regressions: readonly string[];
}
export interface AlphaClashReleaseDeck {
  readonly id: string;
  readonly contenderId: string;
  readonly deckIds: readonly string[];
  readonly issues: readonly string[];
}

// Compare the complete reviewed definition, so any catalog or behavior change
// invalidates its approval. Object key order does not affect the comparison.
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object")
    return `{${Object.entries(value)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`)
      .join(",")}}`;
  return JSON.stringify(value) ?? "null";
}

/** Structural completeness is necessary, but never sufficient for release approval. */
export function alphaClashCardReleaseIssue(
  cardId: string,
  audits: readonly AlphaClashCardAudit[] = approvedAudits,
): string | undefined {
  let card;
  try {
    card = getCard(cardId);
  } catch {
    return `Unknown card: ${cardId}.`;
  }
  if (containsUnparsed(card)) return `${card.name} has unimplemented effects.`;
  const audit = audits.find((entry) => entry.cardId === card.id);
  if (!audit || !audit.regressions.length)
    return `${card.name} has not passed the release behavior audit.`;
  if (canonical(audit.reviewedDefinition) !== canonical(card))
    return `${card.name} changed since its release behavior audit.`;
  if (!officialCardImageUrl(card.id))
    return `${card.name} has no published simulator artwork mapping.`;
  return undefined;
}

/** Lists remain available to developer lab tooling even while release admission is closed. */
export function alphaClashReleaseDecks(
  audits: readonly AlphaClashCardAudit[] = approvedAudits,
): readonly AlphaClashReleaseDeck[] {
  return ALPHA_CLASH_META_DECKS.map((deck) => {
    try {
      const resolved = resolveAlphaClashLabDeck(deck.id);
      const issues = [...new Set([resolved.contenderId, ...resolved.deckIds])].flatMap((id) => {
        const issue = alphaClashCardReleaseIssue(id, audits);
        return issue ? [issue] : [];
      });
      const construction = validateDeck(resolved);
      if (construction) issues.push(construction);
      return { id: deck.id, ...resolved, issues };
    } catch (error) {
      return {
        id: deck.id,
        contenderId: "",
        deckIds: [],
        issues: [error instanceof Error ? error.message : "Deck resolution failed."],
      };
    }
  });
}

function counts(ids: readonly string[]): string {
  const result = new Map<string, number>();
  for (const id of ids) result.set(id, (result.get(id) ?? 0) + 1);
  return canonical([...result].sort(([a], [b]) => a.localeCompare(b)));
}

/** Every public creation path uses this gate; format ids cannot bypass it. */
export function alphaClashReleaseDeckIssue(
  entries: readonly DeckCard[],
  decks: readonly AlphaClashReleaseDeck[] = alphaClashReleaseDecks(),
): string | undefined {
  const contenders: string[] = [];
  const main: string[] = [];
  let total = 0;
  for (const entry of entries) {
    if (
      !Number.isSafeInteger(entry.quantity) ||
      entry.quantity < 1 ||
      (total += entry.quantity) > 61
    )
      return "Release decks require positive whole card quantities and at most 61 cards including the Contender.";
    if (entry.sectionId && entry.sectionId !== "main" && entry.sectionId !== "contender")
      return "The curated practice release supports a Contender and main deck only.";
    let card;
    try {
      card = getCard(entry.cardId);
    } catch {
      return `Unknown card: ${entry.cardId}.`;
    }
    if (entry.sectionId === "contender" && card.cardType !== "contender")
      return "The Contender section must contain a Contender.";
    if (entry.sectionId === "main" && card.cardType === "contender")
      return "A Contender cannot be in the main deck.";
    const destination = card.cardType === "contender" ? contenders : main;
    for (let i = 0; i < entry.quantity; i++) destination.push(card.id);
  }
  const match =
    contenders.length === 1
      ? decks.find(
          (deck) => deck.contenderId === contenders[0] && counts(deck.deckIds) === counts(main),
        )
      : undefined;
  if (!match) return "This release supports only the exact audited curated practice decks.";
  if (match.issues.length)
    return `Curated deck ${match.id} is not approved for release: ${match.issues.join(" ")}`;
  return undefined;
}
