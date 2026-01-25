import { describe, expect, it } from "bun:test";
import type { CardRegistry } from "@tcg/core";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";
import { createDefaultCardMeta } from "../../types/game-state";
import {
  createTargetFiltersPredicate,
  matchesLorcanaFilter,
  sortFilters,
} from "../filter-resolver";
import type { LorcanaFilter } from "../lorcana-target-dsl";

// Mock Registry
const mockRegistry: CardRegistry<LorcanaCardDefinition> = {
  getCard: (id: string) => {
    return MOCK_DEFINITIONS[id];
  },
  getAllCards: () => Object.values(MOCK_DEFINITIONS),
  hasCard: (id: string) => !!MOCK_DEFINITIONS[id],
  queryCards: () => [],
  getCardCount: () => 0,
};

const MOCK_DEFINITIONS: Record<string, LorcanaCardDefinition> = {
  "char-1": {
    id: "char-1",
    name: "Mickey Mouse",
    set: "set1",
    cardType: "character",
    cost: 3,
    inkable: true,
    inkType: ["ruby"],
    strength: 3,
    willpower: 3,
    lore: 1,
    abilities: [
      { type: "keyword", keyword: "Evasive", id: "k1", text: "Evasive" },
    ],
  },
  "char-2": {
    id: "char-2",
    name: "Donald Duck",
    set: "set1",
    cardType: "character",
    cost: 5,
    inkable: false,
    inkType: ["sapphire"],
    strength: 5,
    willpower: 6,
    lore: 2,
    classifications: ["Hero"],
  },
  "loc-1": {
    id: "loc-1",
    name: "The Library",
    set: "set1",
    cardType: "location",
    cost: 2,
    inkable: true,
    inkType: ["amethyst"],
    moveCost: 1,
    lore: 1,
  },
};

const mockState: any = {}; // Simple mock state

describe("Filter Resolver", () => {
  describe("Ranking", () => {
    it("should sort filters by rank", () => {
      const filters: LorcanaFilter[] = [
        { type: "cost", comparison: "eq", value: 3 },
        { type: "ready" },
        { type: "has-keyword", keyword: "Evasive" },
      ];

      const sorted = sortFilters(filters);
      expect(sorted[0].type).toBe("ready"); // Cheap
      expect(sorted[1].type).toBe("has-keyword"); // Property
      expect(sorted[2].type).toBe("cost"); // Numeric
    });
  });

  describe("Matching", () => {
    const char1Instance = {
      definitionId: "char-1",
      ...createDefaultCardMeta(),
      state: "ready",
      damage: 0,
    } as any;

    const char1Exerted = {
      definitionId: "char-1",
      ...createDefaultCardMeta(),
      state: "exerted",
      damage: 2,
    } as any;

    it("should match state filters", () => {
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { type: "ready" },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
      expect(
        matchesLorcanaFilter(
          char1Exerted,
          { type: "ready" },
          mockState,
          mockRegistry,
        ),
      ).toBe(false);

      expect(
        matchesLorcanaFilter(
          char1Exerted,
          { type: "exerted" },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);

      expect(
        matchesLorcanaFilter(
          char1Exerted,
          { type: "damaged" },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { type: "damaged" },
          mockState,
          mockRegistry,
        ),
      ).toBe(false);

      expect(
        matchesLorcanaFilter(
          char1Instance,
          { type: "undamaged" },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
    });

    it("should match property filters", () => {
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { type: "has-keyword", keyword: "Evasive" },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { type: "has-keyword", keyword: "Rush" },
          mockState,
          mockRegistry,
        ),
      ).toBe(false);

      const char2Instance = {
        definitionId: "char-2",
        ...createDefaultCardMeta(),
      } as any;
      expect(
        matchesLorcanaFilter(
          char2Instance,
          { type: "has-classification", classification: "Hero" },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { type: "has-classification", classification: "Hero" },
          mockState,
          mockRegistry,
        ),
      ).toBe(false);

      expect(
        matchesLorcanaFilter(
          char1Instance,
          { type: "name", equals: "Mickey Mouse" },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { type: "name", contains: "Mickey" },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
    });

    it("should match numeric filters", () => {
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { type: "strength", comparison: "eq", value: 3 },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { type: "strength", comparison: "gt", value: 2 },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { type: "strength", comparison: "lt", value: 4 },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);

      expect(
        matchesLorcanaFilter(
          char1Instance,
          { type: "cost", comparison: "lte", value: 3 },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
    });

    it("should match composite filters", () => {
      const filter: LorcanaFilter = {
        type: "and",
        filters: [
          { type: "ready" },
          { type: "strength", comparison: "eq", value: 3 },
        ],
      };
      expect(
        matchesLorcanaFilter(char1Instance, filter, mockState, mockRegistry),
      ).toBe(true);

      const orFilter: LorcanaFilter = {
        type: "or",
        filters: [
          { type: "exerted" }, // false
          { type: "strength", comparison: "eq", value: 3 }, // true
        ],
      };
      expect(
        matchesLorcanaFilter(char1Instance, orFilter, mockState, mockRegistry),
      ).toBe(true);
    });
  });

  describe("Predicate Creation", () => {
    it("should create working predicate", () => {
      const predicate = createTargetFiltersPredicate(
        [{ type: "ready" }, { type: "cost", comparison: "eq", value: 3 }],
        mockState,
        mockRegistry,
      );

      const char1Instance = {
        definitionId: "char-1",
        ...createDefaultCardMeta(),
        state: "ready",
      } as any;

      const char1Exerted = {
        definitionId: "char-1",
        ...createDefaultCardMeta(),
        state: "exerted",
      } as any;

      expect(predicate(char1Instance)).toBe(true);
      expect(predicate(char1Exerted)).toBe(false);
    });
  });
});
