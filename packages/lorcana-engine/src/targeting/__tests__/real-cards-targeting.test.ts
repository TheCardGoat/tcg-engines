import { describe, expect, it } from "bun:test";
import type { CardId, CardInstance, CardRegistry, PlayerId, ZoneId } from "@tcg/core";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";
import type { LorcanaCardMeta, LorcanaGameState } from "../../types/game-state";
import { createTargetFiltersPredicate } from "../filter-resolver";
import type { LorcanaFilter } from "../lorcana-target-dsl";

// --- Mock Data Setup ---

const mockRegistry = {
  getCard: (id: string) => mockDefinitions[id],
} as unknown as CardRegistry<LorcanaCardDefinition>;

const mockDefinitions: Record<string, LorcanaCardDefinition> = {
  "char-hero": {
    cardType: "character",
    classifications: ["Hero", "Storyborn"],
    color: "ruby",
    cost: 2,
    id: "char-hero",
    inkable: true,
    lore: 1,
    name: "Aladdin",
    strength: 2,
    willpower: 2,
  } as any,
  "char-high-str": {
    cardType: "character",
    classifications: ["Hero", "Demigod"],
    color: "ruby",
    cost: 5,
    id: "char-high-str",
    inkable: true,
    lore: 2,
    name: "Maui",
    strength: 6,
    willpower: 5,
  } as any,
  "char-support": {
    abilities: [{ type: "keyword", keyword: "Support" }],
    cardType: "character",
    color: "sapphire",
    cost: 3,
    id: "char-support",
    inkable: true,
    lore: 1,
    name: "Alice",
    strength: 2,
    willpower: 2,
  } as any,
  "char-villain": {
    cardType: "character",
    classifications: ["Villain", "Sorcerer"],
    color: "amethyst",
    cost: 3,
    id: "char-villain",
    inkable: true,
    lore: 1,
    name: "Maleficent",
    strength: 2,
    willpower: 2,
  } as any,
  "item-basic": {
    cardType: "item",
    color: "emerald",
    cost: 1,
    id: "item-basic",
    inkable: true,
    name: "Dinglehopper",
  } as any,
  "loc-basic": {
    cardType: "location",
    color: "amethyst",
    cost: 2,
    id: "loc-basic",
    inkable: true,
    lore: 1,
    moveCost: 1,
    name: "Forbidden Mountain",
    willpower: 6,
  } as any,
};

const mockState: LorcanaGameState = {
  activePlayerId: "player1" as PlayerId,
  cards: {},
  playerIds: ["player1" as PlayerId, "player2" as PlayerId],
  turnNumber: 1, // Populated per test
} as any;

const makeCard = (
  id: string,
  defId: string,
  ownerId: string,
  updates: Partial<LorcanaCardMeta> = {},
): CardInstance<LorcanaCardMeta> => ({
  id: id as CardId,
  definitionId: defId,
  owner: ownerId as PlayerId,
  controller: ownerId as PlayerId,
  zone: "play" as ZoneId,
  tapped: false,
  flipped: false,
  revealed: true,
  phased: false,
  // Custom State Mixed In
  state: "ready",
  damage: 0,
  isDrying: false,
  ...updates,
});

// --- Tests ---

describe("Real Card Targeting Scenarios", () => {
  const p1Villain = makeCard("c1", "char-villain", "player1");
  const p2Hero = makeCard("c2", "char-hero", "player2");
  const p2DamagedHero = makeCard("c3", "char-hero", "player2", { damage: 2 });
  const p1ExertedVillain = makeCard("c4", "char-villain", "player1", {
    state: "exerted",
  });
  const p1HighStr = makeCard("c5", "char-high-str", "player1");
  const p1Item = makeCard("i1", "item-basic", "player1");
  const p2Location = makeCard("l1", "loc-basic", "player2");

  const cards = [p1Villain, p2Hero, p2DamagedHero, p1ExertedVillain, p1HighStr, p1Item, p2Location];

  // Helper to filter cards
  const filterCards = (filters: LorcanaFilter[]) => {
    const predicate = createTargetFiltersPredicate(filters, mockState, mockRegistry);
    return cards.filter(predicate);
  };

  it("should handle 'chosen Villain character'", () => {
    // "Banish chosen Villain character"
    const filters: LorcanaFilter[] = [
      { type: "card-type", value: "character" },
      { classification: "Villain", type: "has-classification" },
    ];

    const results = filterCards(filters);
    expect(results.map((c) => c.id)).toEqual(expect.arrayContaining(["c1", "c4"]));
    expect(results).not.toContain(p2Hero); // Not a Villain
  });

  it("should handle 'chosen damaged character'", () => {
    // "Banish chosen damaged character"
    const filters: LorcanaFilter[] = [
      { type: "card-type", value: "character" },
      { type: "damaged" },
    ];

    const results = filterCards(filters);
    expect(results.map((c) => c.id)).toContain("c3" as CardId); // P2DamagedHero
    expect(results).not.toContain(p1Villain); // Not damaged
  });

  it("should handle 'chosen item'", () => {
    // "Banish chosen item"
    const filters: LorcanaFilter[] = [{ type: "card-type", value: "item" }];
    const results = filterCards(filters);
    expect(results.map((c) => c.id)).toEqual(["i1"] as CardId[]);
  });

  it("should handle 'chosen location or item'", () => {
    // "Banish chosen location or item"
    const filters: LorcanaFilter[] = [
      {
        filters: [
          { type: "card-type", value: "location" },
          { type: "card-type", value: "item" },
        ],
        type: "or",
      },
    ];

    const results = filterCards(filters);
    expect(results.map((c) => c.id)).toEqual(expect.arrayContaining(["i1", "l1"]));
    expect(results).not.toContain(p1Villain);
  });

  it("should handle 'chosen character with cost 3 or more'", () => {
    // "characters with cost 3 or more"
    const filters: LorcanaFilter[] = [
      { type: "card-type", value: "character" },
      { comparison: "gte", type: "cost", value: 3 },
    ];

    const results = filterCards(filters);
    // P1Villain (cost 3), p1HighStr (cost 5)
    expect(results.map((c) => c.id)).toEqual(expect.arrayContaining(["c1", "c4", "c5"]));
    expect(results).not.toContain(p2Hero); // Cost 2
  });

  it("should handle 'chosen character with Strength 3 or less'", () => {
    // "chosen character with 3 strength or less"
    const filters: LorcanaFilter[] = [
      { type: "card-type", value: "character" },
      { comparison: "lte", type: "strength", value: 3 },
    ];

    const results = filterCards(filters);
    // P1Villain (2), p2Hero (2), p2DamagedHero (2)
    expect(results.map((c) => c.id)).toEqual(expect.arrayContaining(["c1", "c2", "c3", "c4"]));
    expect(results).not.toContain(p1HighStr); // Str 6
  });

  it("should handle 'chosen character named X'", () => {
    // "chosen character named Aladdin"
    const filters: LorcanaFilter[] = [
      { type: "card-type", value: "character" },
      { equals: "Aladdin", type: "name" },
    ];

    const results = filterCards(filters);
    expect(results.map((c) => c.id)).toEqual(expect.arrayContaining(["c2", "c3"]));
    expect(results).not.toContain(p1Villain);
  });

  it("should handle 'exerted chosen damaged character'", () => {
    // "Exert chosen damaged character" - targeting implies filter
    // Actually command exerts it, but filter selects it.
    // But maybe "chosen exerted character"?
    // Let's test "chosen exerted character"
    const filters: LorcanaFilter[] = [
      { type: "card-type", value: "character" },
      { type: "exerted" },
    ];
    const results = filterCards(filters);
    expect(results.map((c) => c.id)).toEqual(["c4"] as CardId[]);
  });

  it("should handle composite logic: 'Item OR (Character AND Villain)'", () => {
    // Complex arbitrary test
    const filters: LorcanaFilter[] = [
      {
        filters: [
          { type: "card-type", value: "item" },
          {
            filters: [
              { type: "card-type", value: "character" },
              { type: "has-classification", classification: "Villain" },
            ],
            type: "and",
          },
        ],
        type: "or",
      },
    ];

    const results = filterCards(filters);
    // Should define p1Item, p1Villain, p1ExertedVillain
    expect(results.map((c) => c.id)).toEqual(expect.arrayContaining(["i1", "c1", "c4"]));
    expect(results).not.toContain(p2Hero);
    expect(results).not.toContain(p2Location);
  });

  it("should handle 'chosen character with Support'", () => {
    // Mock a card with Support
    const p1Support = makeCard("c6", "char-support", "player1");
    // MockDefinitions["char-support"] is already defined in setup

    cards.push(p1Support);

    const filters: LorcanaFilter[] = [{ keyword: "Support", type: "has-keyword" }];

    const results = filterCards(filters);
    expect(results.map((c) => c.id)).toContain("c6" as CardId);
    expect(results).not.toContain(p1Villain);
  });
});
