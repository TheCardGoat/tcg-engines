import { type ActionCard, type CharacterCard, type InkType } from "../types";
import type { ItemCard, LocationCard } from "@tcg/lorcana-types";
import { type CardCatalog, createRecordCardCatalog } from "#core";
import type { LorcanaCard } from "@tcg/lorcana-types";
import { createCardI18n } from "../card-i18n";

/** Printing element type derived from the native card shape (no extra dep). */
type MockPrinting = LorcanaCard["printings"][number];

/**
 * A representative single printing for mock cards, derived from the mock
 * canonical id / set / card number. Satisfies `BaseCardDefinition.printings`
 * (RFC ADR-11); `artId` is degenerate (`artId === id`) since mocks have no
 * alternate-art tier.
 */
function mockPrintings(id: string, set: string, cardNumber: number): MockPrinting[] {
  return [
    {
      id,
      artId: id,
      setCode: set,
      collectorNumber: String(cardNumber),
      rarity: "common",
      imageUrl: "",
    },
  ];
}

export type CreateMockCharacterParams = {
  id: string;
  name: string;
  version?: string;
  cost: number;
  strength?: number;
  willpower?: number;
  lore?: number;
  inkable?: boolean;
  classifications?: CharacterCard["classifications"];
  abilities?: CharacterCard["abilities"];
  inkType?: InkType[];
};

export type CreateMockItemParams = {
  id: string;
  name: string;
  cost: number;
  abilities?: ItemCard["abilities"];
};

export function createMockItem(params: CreateMockItemParams): ItemCard {
  return {
    id: params.id,
    canonicalId: `ci_${params.id}`,
    slug: `lorcana-ci_${params.id}`,
    printings: mockPrintings(params.id, "TST", 666),
    cardType: "item",
    name: params.name,
    cost: params.cost,
    inkType: ["amber"] as InkType[],
    inkable: true,
    set: "TST",
    rarity: "common",
    abilities: params.abilities ?? [],
    i18n: createCardI18n(params.name),
    cardNumber: 666,
  };
}

export type CreateMockSongParams = {
  id: string;
  name: string;
  cost: number;
  text: string;
  abilities?: ActionCard["abilities"];
};

export function createMockCharacter(params: CreateMockCharacterParams): CharacterCard {
  return {
    id: params.id,
    canonicalId: `ci_${params.id}`,
    slug: `lorcana-ci_${params.id}`,
    printings: mockPrintings(params.id, "TST", 666),
    cardType: "character",
    name: params.name,
    ...(params.version !== undefined ? { version: params.version } : {}),
    cost: params.cost,
    strength: params.strength ?? 2,
    willpower: params.willpower ?? 5,
    lore: params.lore ?? 1,
    classifications: params.classifications ?? ["Storyborn", "Hero"],
    inkType: (params.inkType ?? ["amber"]) as InkType[],
    inkable: params.inkable ?? true,
    set: "TST",
    rarity: "common",
    abilities: params.abilities ?? [],
    i18n: createCardI18n(params.name),
    cardNumber: 666,
  };
}

export function createMockSong(params: CreateMockSongParams): ActionCard {
  return {
    id: params.id,
    canonicalId: `ci_${params.id}`,
    slug: `lorcana-ci_${params.id}`,
    printings: mockPrintings(params.id, "TST", 666),
    cardType: "action",
    actionSubtype: "song",
    name: params.name,
    cost: params.cost,
    inkType: ["amber"] as InkType[],
    inkable: true,
    set: "TST",
    rarity: "common",
    text: params.text,
    abilities: params.abilities ?? [],
    i18n: createCardI18n(params.name, {
      en: {
        name: params.name,
        text: params.text,
      },
    }),
    cardNumber: 666,
  };
}

export type CreateMockLocationParams = {
  id: string;
  name: string;
  cost: number;
  moveCost?: number;
  willpower?: number;
  lore?: number;
  abilities?: LocationCard["abilities"];
};

export function createMockLocation(params: CreateMockLocationParams): LocationCard {
  return {
    id: params.id,
    canonicalId: `ci_${params.id}`,
    slug: `lorcana-ci_${params.id}`,
    printings: mockPrintings(params.id, "TST", 667),
    cardType: "location",
    name: params.name,
    cost: params.cost,
    moveCost: params.moveCost ?? 1,
    willpower: params.willpower ?? 4,
    lore: params.lore ?? 1,
    inkType: ["amber"] as InkType[],
    inkable: true,
    set: "TST",
    rarity: "common",
    abilities: params.abilities ?? [],
    i18n: createCardI18n(params.name),
    cardNumber: 667,
  };
}

export type CreateMockActionParams = {
  id: string;
  name: string;
  cost: number;
  text?: string;
  abilities?: ActionCard["abilities"];
};

export function createMockAction(params: CreateMockActionParams): ActionCard {
  return {
    id: params.id,
    canonicalId: `ci_${params.id}`,
    slug: `lorcana-ci_${params.id}`,
    printings: mockPrintings(params.id, "TST", 668),
    cardType: "action",
    name: params.name,
    cost: params.cost,
    inkType: ["amber"] as InkType[],
    inkable: true,
    set: "TST",
    rarity: "common",
    text: params.text ?? "",
    abilities: params.abilities ?? [],
    i18n: createCardI18n(params.name, {
      en: {
        name: params.name,
        text: params.text ?? "",
      },
    }),
    cardNumber: 668,
  };
}

// Create a minimal test card for testing
export function createTestCard(id: string, name: string): CharacterCard {
  return {
    id,
    canonicalId: `ci_${id}`,
    slug: `lorcana-ci_${id}`,
    printings: mockPrintings(id, "001", 666),
    name,
    fullName: name,
    version: "Test",
    cardType: "character",
    subtypes: ["Storyborn", "Hero"],
    classification: "Dreamborn",
    cost: 1,
    inkType: ["amber"] as InkType[],
    inkable: true,
    strength: 1,
    willpower: 1,
    lore: 1,
    set: "001",
    number: parseInt(id.replace(/\D/g, "").slice(-3) || "001", 10),
    rarity: "common",
    abilities: [],
    i18n: createCardI18n(name),
    cardNumber: 666,
  } as CharacterCard;
}

export function createTestCardCatalog(cards: Record<string, LorcanaCard>): CardCatalog {
  return createRecordCardCatalog("test:cards", cards);
}

// Helper to build cardsMaps from player decks
export function buildCardsMaps(
  playersInfo: Array<{
    player: { id: string };
    deck: Array<{ cardId: string; qty: number }>;
  }>,
): { cardInstances: Record<string, string>; owners: Record<string, string[]> } {
  const cardInstances: Record<string, string> = {};
  const owners: Record<string, string[]> = {};

  for (const { player, deck } of playersInfo) {
    owners[player.id] = [];
    for (const { cardId, qty } of deck) {
      for (let i = 0; i < qty; i++) {
        const instanceId = `${player.id}-${cardId}-${i}`;
        cardInstances[instanceId] = cardId;
        owners[player.id].push(instanceId);
      }
    }
  }

  return { cardInstances, owners };
}
