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
  getAllCards: () => Object.values(MOCK_DEFINITIONS),
  getCard: (id: string) => MOCK_DEFINITIONS[id],
  getCardCount: () => 0,
  hasCard: (id: string) => Boolean(MOCK_DEFINITIONS[id]),
  queryCards: () => [],
};

const MOCK_DEFINITIONS: Record<string, LorcanaCardDefinition> = {
  "char-1": {
    abilities: [{ id: "k1", keyword: "Evasive", text: "Evasive", type: "keyword" }],
    cardType: "character",
    cost: 3,
    id: "char-1",
    inkType: ["ruby"],
    inkable: true,
    lore: 1,
    name: "Mickey Mouse",
    set: "set1",
    strength: 3,
    willpower: 3,
  },
  "char-2": {
    cardType: "character",
    classifications: ["Hero"],
    cost: 5,
    id: "char-2",
    inkType: ["sapphire"],
    inkable: false,
    lore: 2,
    name: "Donald Duck",
    set: "set1",
    strength: 5,
    willpower: 6,
  },
  "loc-1": {
    cardType: "location",
    cost: 2,
    id: "loc-1",
    inkType: ["amethyst"],
    inkable: true,
    lore: 1,
    moveCost: 1,
    name: "The Library",
    set: "set1",
  },
};

const mockState: any = {}; // Simple mock state

describe("Filter Resolver", () => {
  describe("Ranking", () => {
    it("should sort filters by rank", () => {
      const filters: LorcanaFilter[] = [
        { comparison: "eq", type: "cost", value: 3 },
        { type: "ready" },
        { keyword: "Evasive", type: "has-keyword" },
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
      expect(matchesLorcanaFilter(char1Instance, { type: "ready" }, mockState, mockRegistry)).toBe(
        true,
      );
      expect(matchesLorcanaFilter(char1Exerted, { type: "ready" }, mockState, mockRegistry)).toBe(
        false,
      );

      expect(matchesLorcanaFilter(char1Exerted, { type: "exerted" }, mockState, mockRegistry)).toBe(
        true,
      );

      expect(matchesLorcanaFilter(char1Exerted, { type: "damaged" }, mockState, mockRegistry)).toBe(
        true,
      );
      expect(
        matchesLorcanaFilter(char1Instance, { type: "damaged" }, mockState, mockRegistry),
      ).toBe(false);

      expect(
        matchesLorcanaFilter(char1Instance, { type: "undamaged" }, mockState, mockRegistry),
      ).toBe(true);
    });

    it("should match property filters", () => {
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { keyword: "Evasive", type: "has-keyword" },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { keyword: "Rush", type: "has-keyword" },
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
          { classification: "Hero", type: "has-classification" },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { classification: "Hero", type: "has-classification" },
          mockState,
          mockRegistry,
        ),
      ).toBe(false);

      expect(
        matchesLorcanaFilter(
          char1Instance,
          { equals: "Mickey Mouse", type: "name" },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { contains: "Mickey", type: "name" },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
    });

    it("should match numeric filters", () => {
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { comparison: "eq", type: "strength", value: 3 },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { comparison: "gt", type: "strength", value: 2 },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
      expect(
        matchesLorcanaFilter(
          char1Instance,
          { comparison: "lt", type: "strength", value: 4 },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);

      expect(
        matchesLorcanaFilter(
          char1Instance,
          { comparison: "lte", type: "cost", value: 3 },
          mockState,
          mockRegistry,
        ),
      ).toBe(true);
    });

    it("should match composite filters", () => {
      const filter: LorcanaFilter = {
        filters: [{ type: "ready" }, { comparison: "eq", type: "strength", value: 3 }],
        type: "and",
      };
      expect(matchesLorcanaFilter(char1Instance, filter, mockState, mockRegistry)).toBe(true);

      const orFilter: LorcanaFilter = {
        filters: [
          { type: "exerted" }, // False
          { comparison: "eq", type: "strength", value: 3 }, // True
        ],
        type: "or",
      };
      expect(matchesLorcanaFilter(char1Instance, orFilter, mockState, mockRegistry)).toBe(true);
    });
  });

  describe("Predicate Creation", () => {
    it("should create working predicate", () => {
      const predicate = createTargetFiltersPredicate(
        [{ type: "ready" }, { comparison: "eq", type: "cost", value: 3 }],
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
