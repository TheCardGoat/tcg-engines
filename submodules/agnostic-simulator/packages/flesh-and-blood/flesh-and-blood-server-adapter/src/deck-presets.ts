import { getFleshAndBloodCard } from "@tcg/flesh-and-blood-cards/catalog";
import { fleshAndBloodDeckCardLibrary } from "@tcg/flesh-and-blood-cards/deck-library";
import { fleshAndBloodPreconstructedDecks } from "@tcg/flesh-and-blood-cards/preconstructed-decks";
import {
  FAB_DECK_CATALOG,
  parseFabDeckTextLine,
  resolveCatalogCardByName,
} from "@tcg/flesh-and-blood-engine/automation";
import {
  validateFabDeckConstruction,
  type FabPregameFormat,
  type FabValidationCard,
} from "@tcg/flesh-and-blood-engine/deck-validation";
import { createFabValidationCard } from "@tcg/flesh-and-blood-engine/deck-validation-card";
import { getFabCardCategory } from "@tcg/flesh-and-blood-types";
import type { DeckCard, GameAdapter } from "@tcg/shared/game-adapter";

const deckCardsByCanonicalId = new Map(
  fleshAndBloodDeckCardLibrary.map((card) => [card.canonicalId, card] as const),
);

/** Official preconstructed DTOs for onboarding, separate from tournament bot fixtures. */
export function listFleshAndBloodDeckPresets() {
  return fleshAndBloodPreconstructedDecks.flatMap((preset) => {
    if (preset.format === "Open" || preset.format === "Ultimate Pit Fight") return [];
    const hero = resolveCatalogCardByName(fleshAndBloodDeckCardLibrary, preset.hero.name);
    const cards = preset.cards.flatMap((entry) => {
      const pitch =
        entry.pitch === 1
          ? "red"
          : entry.pitch === 2
            ? "yellow"
            : entry.pitch === 3
              ? "blue"
              : undefined;
      const card = resolveCatalogCardByName(fleshAndBloodDeckCardLibrary, entry.name, pitch);
      return card
        ? [
            {
              cardIdentifier: card.canonicalId,
              name: entry.name,
              pitch: entry.pitch,
              quantity: entry.quantity,
              inventoryQuantity: entry.inventoryQuantity,
            },
          ]
        : [];
    });
    if (!hero || cards.length !== preset.cards.length) return [];
    const format = currentFormatForPreset(preset.format);
    if (!format || !isCurrentRegisteredDeck({ hero, cards, format })) return [];
    return [
      {
        id: preset.deckId,
        name: preset.name,
        format: preset.format,
        hero: { cardIdentifier: hero.canonicalId, name: preset.hero.name },
        sourceUrl: preset.sourceUrl,
        verification: preset.officialVerification.status,
        verificationNotes: [...preset.officialVerification.notes],
        cards,
      },
    ];
  });
}

function currentFormatForPreset(
  format:
    | "Blitz"
    | "Classic Constructed"
    | "Living Legend"
    | "Silver Age"
    | "Open"
    | "Ultimate Pit Fight",
): FabPregameFormat | null {
  switch (format) {
    case "Blitz":
      return "blitz";
    case "Classic Constructed":
      return "cc";
    case "Living Legend":
      return "ll";
    case "Silver Age":
      return "silverAge";
    case "Open":
    case "Ultimate Pit Fight":
      return null;
  }
}

function isCurrentRegisteredDeck({
  hero,
  cards,
  format,
}: {
  readonly hero: (typeof fleshAndBloodDeckCardLibrary)[number];
  readonly cards: readonly {
    readonly cardIdentifier: string;
    readonly quantity: number;
    readonly inventoryQuantity: number;
  }[];
  readonly format: FabPregameFormat;
}): boolean {
  const definitions: Record<string, FabValidationCard> = {};
  for (const card of [
    hero,
    ...cards.flatMap((entry) => {
      const resolved = deckCardsByCanonicalId.get(entry.cardIdentifier);
      return resolved ? [resolved] : [];
    }),
  ]) {
    definitions[card.canonicalId] = createFabValidationCard(
      card.runtime,
      getFleshAndBloodCard(card.canonicalId),
    );
  }
  return validateFabDeckConstruction({
    mode: "registered",
    format,
    heroId: hero.canonicalId,
    entries: cards.map((entry) => ({
      canonicalId: entry.cardIdentifier,
      quantity: entry.quantity + entry.inventoryQuantity,
    })),
    cards: definitions,
  }).valid;
}

export const fleshAndBloodPracticeDecks = {
  ids: FAB_DECK_CATALOG.map((preset) => preset.id),
  getDeck(id: string): DeckCard[] | undefined {
    const preset = FAB_DECK_CATALOG.find((candidate) => candidate.id === id);
    if (!preset) return undefined;
    const entries = new Map<string, DeckCard>();
    for (const line of preset.cards.split("\n")) {
      if (!line.trim() || line.trim().startsWith("#")) continue;
      const parsed = parseFabDeckTextLine(line);
      if (!parsed || !Number.isSafeInteger(parsed.count) || parsed.count <= 0) {
        throw new Error(`Invalid card line in FAB preset ${id}: ${line}`);
      }
      const card = resolveCatalogCardByName(
        fleshAndBloodDeckCardLibrary,
        parsed.name,
        parsed.pitch,
      );
      if (!card) throw new Error(`Unresolved card in FAB preset ${id}: ${line}`);
      const existing = entries.get(card.canonicalId);
      if (existing) existing.quantity += parsed.count;
      else
        entries.set(card.canonicalId, {
          cardId: card.canonicalId,
          canonicalId: card.canonicalId,
          sectionId: getFabCardCategory(card.runtime.base.typeBox) === "hero" ? "hero" : "cardPool",
          quantity: parsed.count,
        });
    }
    return [...entries.values()];
  },
} satisfies NonNullable<GameAdapter["practiceDecks"]>;
