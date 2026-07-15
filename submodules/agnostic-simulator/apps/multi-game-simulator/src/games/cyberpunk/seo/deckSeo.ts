import { createCardCatalog } from "@tcg/cyberpunk-cards";
import { PRACTICE_DECK_FIXTURES } from "../engine";
import deckIndex from "./deck-index.json";
import { SITE_NAME, SOCIAL_IMAGE_URL, absoluteUrl } from "./site";

export interface PublicDeckIndexEntry {
  id: string;
  label: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface DeckCardSummary {
  id: string;
  name: string;
  slug: string;
  type: "legend" | "unit" | "gear" | "program";
  count: number;
}

export interface DeckSeoProfile {
  id: string;
  label: string;
  description: string;
  canonicalUrl: string;
  title: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  legends: DeckCardSummary[];
  mainDeck: DeckCardSummary[];
  mainDeckSize: number;
  uniqueMainDeckCards: number;
}

export const publicDeckIndex = deckIndex satisfies PublicDeckIndexEntry[];

const catalog = createCardCatalog();

function cardSummary(cardId: string, count: number): DeckCardSummary {
  const card = catalog.get(cardId);
  if (!card) {
    throw new Error(`Public deck references unknown card id: ${cardId}`);
  }

  return {
    id: card.id,
    name: card.displayName,
    slug: card.slug,
    type: card.type,
    count,
  };
}

function summarizeMainDeck(cardIds: readonly string[]): DeckCardSummary[] {
  const counts = new Map<string, number>();
  for (const cardId of cardIds) {
    counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([cardId, count]) => cardSummary(cardId, count))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getDeckSeoProfile(deckId: string): DeckSeoProfile | undefined {
  const fixture = PRACTICE_DECK_FIXTURES.find((deck) => deck.id === deckId);
  const indexEntry = publicDeckIndex.find((deck) => deck.id === deckId);
  if (!fixture || !indexEntry) {
    return undefined;
  }

  const legends = fixture.deck.legends.map((cardId) => cardSummary(cardId, 1));
  const mainDeck = summarizeMainDeck(fixture.deck.mainDeck);
  const legendNames = legends.map((legend) => legend.name).join(", ");
  const canonicalUrl = absoluteUrl(`/decks/${fixture.id}/`);

  return {
    id: fixture.id,
    label: fixture.label,
    description: fixture.description,
    canonicalUrl,
    title: `${fixture.label} Cyberpunk TCG Decklist | ${SITE_NAME}`,
    metaDescription: `${fixture.description} Cyberpunk TCG decklist with ${fixture.deck.mainDeck.length} cards, Legends ${legendNames}, card choices, and an online deck builder practice flow.`,
    createdAt: indexEntry.createdAt,
    updatedAt: indexEntry.updatedAt,
    tags: indexEntry.tags,
    legends,
    mainDeck,
    mainDeckSize: fixture.deck.mainDeck.length,
    uniqueMainDeckCards: mainDeck.length,
  };
}

export function getPublicDeckSeoProfiles(): DeckSeoProfile[] {
  return publicDeckIndex
    .map((entry) => getDeckSeoProfile(entry.id))
    .filter((profile): profile is DeckSeoProfile => Boolean(profile));
}

export function deckJsonLd(profile: DeckSeoProfile) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${profile.label} Cyberpunk TCG deck`,
    description: profile.metaDescription,
    url: profile.canonicalUrl,
    image: SOCIAL_IMAGE_URL,
    dateCreated: profile.createdAt,
    dateModified: profile.updatedAt,
    keywords: ["Cyberpunk TCG", "deck list", ...profile.tags].join(", "),
    about: profile.legends.map((legend) => legend.name),
    hasPart: profile.mainDeck.map((card) => ({
      "@type": "CreativeWork",
      name: card.name,
      position: card.count,
    })),
  };
}
