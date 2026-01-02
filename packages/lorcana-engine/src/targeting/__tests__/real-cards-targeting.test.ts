import { describe, expect, it } from "bun:test";
import type {
  CardId,
  CardInstance,
  CardRegistry,
  PlayerId,
  ZoneId,
} from "@tcg/core";
import type { LorcanaCardDefinition } from "../../types/card-types";
import type { LorcanaCardMeta, LorcanaGameState } from "../../types/game-state";
import { createTargetFiltersPredicate } from "../filter-resolver";
import type { LorcanaFilter } from "../lorcana-target-dsl";

// --- Mock Data Setup ---

const mockRegistry = {
  getCard: (id: string) => mockDefinitions[id],
} as unknown as CardRegistry<LorcanaCardDefinition>;

const mockDefinitions: Record<string, LorcanaCardDefinition> = {
  "char-villain": {
    id: "char-villain",
    name: "Maleficent",
    cardType: "character",
    classifications: ["Villain", "Sorcerer"],
    cost: 3,
    strength: 2,
    willpower: 2,
    lore: 1,
    color: "amethyst",
    inkable: true,
  } as any,
  "char-hero": {
    id: "char-hero",
    name: "Aladdin",
    cardType: "character",
    classifications: ["Hero", "Storyborn"],
    cost: 2,
    strength: 2,
    willpower: 2,
    lore: 1,
    color: "ruby",
    inkable: true,
  } as any,
  "char-high-str": {
    id: "char-high-str",
    name: "Maui",
    cardType: "character",
    classifications: ["Hero", "Demigod"],
    cost: 5,
    strength: 6,
    willpower: 5,
    lore: 2,
    color: "ruby",
    inkable: true,
  } as any,
  "item-basic": {
    id: "item-basic",
    name: "Dinglehopper",
    cardType: "item",
    cost: 1,
    color: "emerald",
    inkable: true,
  } as any,
  "loc-basic": {
    id: "loc-basic",
    name: "Forbidden Mountain",
    cardType: "location",
    cost: 2,
    moveCost: 1,
    willpower: 6,
    lore: 1,
    color: "amethyst",
    inkable: true,
  } as any,
  "char-support": {
    id: "char-support",
    name: "Alice",
    cardType: "character",
    abilities: [{ type: "keyword", keyword: "Support" }],
    cost: 3,
    strength: 2,
    willpower: 2,
    lore: 1,
    color: "sapphire",
    inkable: true,
  } as any,
};

const mockState: LorcanaGameState = {
  playerIds: ["player1" as PlayerId, "player2" as PlayerId],
  turnNumber: 1,
  activePlayerId: "player1" as PlayerId,
  cards: {}, // Populated per test
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

  const cards = [
    p1Villain,
    p2Hero,
    p2DamagedHero,
    p1ExertedVillain,
    p1HighStr,
    p1Item,
    p2Location,
  ];

  // Helper to filter cards
  const filterCards = (filters: LorcanaFilter[]) => {
    const predicate = createTargetFiltersPredicate(
      filters,
      mockState,
      mockRegistry,
    );
    return cards.filter(predicate);
  };

  it("should handle 'chosen Villain character'", () => {
    // "Banish chosen Villain character"
    const filters: LorcanaFilter[] = [
      { type: "card-type", value: "character" },
      { type: "has-classification", classification: "Villain" },
    ];

    const results = filterCards(filters);
    expect(results.map((c) => c.id)).toEqual(
      expect.arrayContaining(["c1", "c4"]),
    );
    expect(results).not.toContain(p2Hero); // Not a Villain
  });

  it("should handle 'chosen damaged character'", () => {
    // "Banish chosen damaged character"
    const filters: LorcanaFilter[] = [
      { type: "card-type", value: "character" },
      { type: "damaged" },
    ];

    const results = filterCards(filters);
    expect(results.map((c) => c.id)).toContain("c3" as CardId); // p2DamagedHero
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
        type: "or",
        filters: [
          { type: "card-type", value: "location" },
          { type: "card-type", value: "item" },
        ],
      },
    ];

    const results = filterCards(filters);
    expect(results.map((c) => c.id)).toEqual(
      expect.arrayContaining(["i1", "l1"]),
    );
    expect(results).not.toContain(p1Villain);
  });

  it("should handle 'chosen character with cost 3 or more'", () => {
    // "characters with cost 3 or more"
    const filters: LorcanaFilter[] = [
      { type: "card-type", value: "character" },
      { type: "cost", comparison: "gte", value: 3 },
    ];

    const results = filterCards(filters);
    // p1Villain (cost 3), p1HighStr (cost 5)
    expect(results.map((c) => c.id)).toEqual(
      expect.arrayContaining(["c1", "c4", "c5"]),
    );
    expect(results).not.toContain(p2Hero); // Cost 2
  });

  it("should handle 'chosen character with Strength 3 or less'", () => {
    // "chosen character with 3 strength or less"
    const filters: LorcanaFilter[] = [
      { type: "card-type", value: "character" },
      { type: "strength", comparison: "lte", value: 3 },
    ];

    const results = filterCards(filters);
    // p1Villain (2), p2Hero (2), p2DamagedHero (2)
    expect(results.map((c) => c.id)).toEqual(
      expect.arrayContaining(["c1", "c2", "c3", "c4"]),
    );
    expect(results).not.toContain(p1HighStr); // Str 6
  });

  it("should handle 'chosen character named X'", () => {
    // "chosen character named Aladdin"
    const filters: LorcanaFilter[] = [
      { type: "card-type", value: "character" },
      { type: "name", equals: "Aladdin" },
    ];

    const results = filterCards(filters);
    expect(results.map((c) => c.id)).toEqual(
      expect.arrayContaining(["c2", "c3"]),
    );
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
        type: "or",
        filters: [
          { type: "card-type", value: "item" },
          {
            type: "and",
            filters: [
              { type: "card-type", value: "character" },
              { type: "has-classification", classification: "Villain" },
            ],
          },
        ],
      },
    ];

    const results = filterCards(filters);
    // Should define p1Item, p1Villain, p1ExertedVillain
    expect(results.map((c) => c.id)).toEqual(
      expect.arrayContaining(["i1", "c1", "c4"]),
    );
    expect(results).not.toContain(p2Hero);
    expect(results).not.toContain(p2Location);
  });

  it("should handle 'chosen character with Support'", () => {
    // Mock a card with Support
    const p1Support = makeCard("c6", "char-support", "player1");
    // mockDefinitions["char-support"] is already defined in setup

    cards.push(p1Support);

    const filters: LorcanaFilter[] = [
      { type: "has-keyword", keyword: "Support" },
    ];

    const results = filterCards(filters);
    expect(results.map((c) => c.id)).toContain("c6" as CardId);
    expect(results).not.toContain(p1Villain);
  });
});
