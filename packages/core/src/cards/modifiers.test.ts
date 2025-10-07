import { describe, expect, it } from "bun:test";
import { createCardId } from "../types";
import type { Modifier } from "./modifiers";

describe("Modifier System", () => {
  describe("Modifier Type", () => {
    it("should define stat modifier with all required fields", () => {
      const modifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "permanent",
        source: createCardId("card-1"),
      };

      expect(modifier.id).toBe("mod-1");
      expect(modifier.type).toBe("stat");
      expect(modifier.property).toBe("power");
      expect(modifier.value).toBe(2);
      expect(modifier.duration).toBe("permanent");
      expect(modifier.source).toBeDefined();
    });

    it("should support stat modifier type", () => {
      const modifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 3,
        duration: "permanent",
        source: createCardId("card-1"),
      };

      expect(modifier.type).toBe("stat");
      expect(typeof modifier.value).toBe("number");
    });

    it("should support ability modifier type", () => {
      const modifier: Modifier = {
        id: "mod-2",
        type: "ability",
        property: "flying",
        value: true,
        duration: "until-end-of-turn",
        source: createCardId("card-1"),
      };

      expect(modifier.type).toBe("ability");
      expect(typeof modifier.value).toBe("boolean");
    });

    it("should support type modifier type", () => {
      const modifier: Modifier = {
        id: "mod-3",
        type: "type",
        property: "creature-type",
        value: "zombie",
        duration: "permanent",
        source: createCardId("card-1"),
      };

      expect(modifier.type).toBe("type");
      expect(typeof modifier.value).toBe("string");
    });

    it("should support keyword modifier type", () => {
      const modifier: Modifier = {
        id: "mod-4",
        type: "keyword",
        property: "haste",
        value: true,
        duration: "until-end-of-turn",
        source: createCardId("card-1"),
      };

      expect(modifier.type).toBe("keyword");
    });

    it("should support permanent duration", () => {
      const modifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 1,
        duration: "permanent",
        source: createCardId("card-1"),
      };

      expect(modifier.duration).toBe("permanent");
    });

    it("should support until-end-of-turn duration", () => {
      const modifier: Modifier = {
        id: "mod-2",
        type: "stat",
        property: "power",
        value: 2,
        duration: "until-end-of-turn",
        source: createCardId("card-1"),
      };

      expect(modifier.duration).toBe("until-end-of-turn");
    });

    it("should support while-condition duration", () => {
      const modifier: Modifier = {
        id: "mod-3",
        type: "stat",
        property: "power",
        value: 3,
        duration: "while-condition",
        source: createCardId("card-1"),
      };

      expect(modifier.duration).toBe("while-condition");
    });

    it("should support optional condition function", () => {
      const modifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "while-condition",
        condition: () => true,
        source: createCardId("card-1"),
      };

      expect(modifier.condition).toBeDefined();
      expect(typeof modifier.condition).toBe("function");
      expect(modifier.condition?.({} as never)).toBe(true);
    });

    it("should support optional layer for complex interactions", () => {
      const modifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "permanent",
        source: createCardId("card-1"),
        layer: 7,
      };

      expect(modifier.layer).toBe(7);
    });

    it("should work without optional fields", () => {
      const modifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "permanent",
        source: createCardId("card-1"),
      };

      expect(modifier.condition).toBeUndefined();
      expect(modifier.layer).toBeUndefined();
    });
  });

  describe("Modifier Values", () => {
    it("should support number values", () => {
      const modifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 5,
        duration: "permanent",
        source: createCardId("card-1"),
      };

      expect(typeof modifier.value).toBe("number");
      expect(modifier.value).toBe(5);
    });

    it("should support negative number values", () => {
      const modifier: Modifier = {
        id: "mod-2",
        type: "stat",
        property: "power",
        value: -2,
        duration: "permanent",
        source: createCardId("card-1"),
      };

      expect(modifier.value).toBe(-2);
    });

    it("should support string values", () => {
      const modifier: Modifier = {
        id: "mod-3",
        type: "type",
        property: "creature-type",
        value: "dragon",
        duration: "permanent",
        source: createCardId("card-1"),
      };

      expect(typeof modifier.value).toBe("string");
      expect(modifier.value).toBe("dragon");
    });

    it("should support boolean values", () => {
      const modifier: Modifier = {
        id: "mod-4",
        type: "ability",
        property: "flying",
        value: true,
        duration: "permanent",
        source: createCardId("card-1"),
      };

      expect(typeof modifier.value).toBe("boolean");
      expect(modifier.value).toBe(true);
    });
  });

  describe("Modifier Source Tracking", () => {
    it("should track source card", () => {
      const sourceCard = createCardId("source-1");
      const modifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "permanent",
        source: sourceCard,
      };

      expect(modifier.source).toBe(sourceCard);
    });

    it("should enforce CardId type for source", () => {
      const sourceCard = createCardId("source-1");
      const modifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "permanent",
        source: sourceCard,
      };

      const _typeCheck: typeof sourceCard = modifier.source;
      expect(modifier.source).toBe(sourceCard);
    });
  });

  describe("Modifier Condition", () => {
    it("should accept condition function that returns boolean", () => {
      const modifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "while-condition",
        condition: (state) => {
          return state !== null;
        },
        source: createCardId("card-1"),
      };

      expect(modifier.condition).toBeDefined();
      expect(modifier.condition?.({} as never)).toBe(true);
    });

    it("should support complex condition logic", () => {
      type GameState = { cardTapped: boolean };
      const modifier: Modifier<GameState> = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "while-condition",
        condition: (state) => state.cardTapped === true,
        source: createCardId("card-1"),
      };

      expect(modifier.condition?.({ cardTapped: true })).toBe(true);
      expect(modifier.condition?.({ cardTapped: false })).toBe(false);
    });
  });
});
