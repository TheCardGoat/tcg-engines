import { allFleshAndBloodCards, getFleshAndBloodCard } from "@tcg/flesh-and-blood-cards/catalog";
import { fabDefaultPrintingId } from "@tcg/flesh-and-blood-cards";
import type { GameMetadataAdapter } from "@tcg/shared/game-adapter";
import { sortMetadataFacets } from "@tcg/shared/game-adapter";
import { slugify } from "@tcg/shared/utils";

type CatalogCard = (typeof allFleshAndBloodCards)[number];

function isHero(card: CatalogCard): boolean {
  return card.typeText.split(/\s+/).includes("Hero");
}

function imageUrl(card: CatalogCard): string | null {
  const printingId = fabDefaultPrintingId(card) ?? card.printings[0]?.id;
  return card.printings.find((printing) => printing.id === printingId)?.imageUrl ?? null;
}

/** FAB CR 2.7.3: a hero's moniker is the most significant part of its name. */
function heroMoniker(name: string): string {
  return name.split(",", 1)[0]?.trim() || name.trim();
}

export const fleshAndBloodMetadataAdapter: GameMetadataAdapter = {
  projectionVersion: 2,
  capabilities: { colors: false, deckLists: true, archetypes: true },
  facets: [
    {
      type: "hero",
      label: "Hero",
      pluralLabel: "Heroes",
      kind: "identity",
      order: 10,
      ranking: { specialistSkill: true, mastery: true },
    },
  ],
  projectDeck(deck) {
    const heroes = deck
      .map((entry) => getFleshAndBloodCard(entry.cardId))
      .filter((card): card is CatalogCard => Boolean(card && isHero(card)))
      .sort((left, right) => left.canonicalId.localeCompare(right.canonicalId));
    const heroFacets = new Map<string, ReturnType<typeof sortMetadataFacets>[number]>();
    for (const hero of heroes) {
      const moniker = heroMoniker(hero.name);
      const key = slugify(moniker);
      if (!key || heroFacets.has(key)) continue;
      heroFacets.set(key, {
        type: "hero",
        key,
        label: moniker,
        colors: [],
        members: [
          { cardId: hero.canonicalId, label: hero.name, colors: [], imageUrl: imageUrl(hero) },
        ],
      });
    }
    return {
      schemaVersion: 1,
      projectionVersion: 2,
      game: "flesh-and-blood",
      cardCount: deck.reduce((sum, entry) => sum + Math.max(0, Math.floor(entry.quantity)), 0),
      colors: [],
      facets: sortMetadataFacets(heroFacets.values()),
    };
  },
  normalizeTemplate(deck) {
    return [...deck].sort((left, right) => left.cardId.localeCompare(right.cardId));
  },
  normalizeSynergy(deck) {
    return [...deck].sort((left, right) => left.cardId.localeCompare(right.cardId));
  },
};
