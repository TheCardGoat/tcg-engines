import { describe, expect, it } from "bun:test";
import { createCardId } from "../types";
import type { Modifier } from "./modifiers";

describe("Modifier System", () => {
  describe("Modifier Type", () => {
    it("should define stat modifier with all required fields", () => {
      const modifier: Modifier = {
        duration: "permanent",
        id: "mod-1",
        property: "power",
        source: createCardId("card-1"),
        type: "stat",
        value: 2,
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
        duration: "permanent",
        id: "mod-1",
        property: "power",
        source: createCardId("card-1"),
        type: "stat",
        value: 3,
      };

      expect(modifier.type).toBe("stat");
      expect(typeof modifier.value).toBe("number");
    });

    it("should support ability modifier type", () => {
      const modifier: Modifier = {
        duration: "until-end-of-turn",
        id: "mod-2",
        property: "flying",
        source: createCardId("card-1"),
        type: "ability",
        value: true,
      };

      expect(modifier.type).toBe("ability");
      expect(typeof modifier.value).toBe("boolean");
    });

    it("should support type modifier type", () => {
      const modifier: Modifier = {
        duration: "permanent",
        id: "mod-3",
        property: "creature-type",
        source: createCardId("card-1"),
        type: "type",
        value: "zombie",
      };

      expect(modifier.type).toBe("type");
      expect(typeof modifier.value).toBe("string");
    });

    it("should support keyword modifier type", () => {
      const modifier: Modifier = {
        duration: "until-end-of-turn",
        id: "mod-4",
        property: "haste",
        source: createCardId("card-1"),
        type: "keyword",
        value: true,
      };

      expect(modifier.type).toBe("keyword");
    });

    it("should support permanent duration", () => {
      const modifier: Modifier = {
        duration: "permanent",
        id: "mod-1",
        property: "power",
        source: createCardId("card-1"),
        type: "stat",
        value: 1,
      };

      expect(modifier.duration).toBe("permanent");
    });

    it("should support until-end-of-turn duration", () => {
      const modifier: Modifier = {
        duration: "until-end-of-turn",
        id: "mod-2",
        property: "power",
        source: createCardId("card-1"),
        type: "stat",
        value: 2,
      };

      expect(modifier.duration).toBe("until-end-of-turn");
    });

    it("should support while-condition duration", () => {
      const modifier: Modifier = {
        duration: "while-condition",
        id: "mod-3",
        property: "power",
        source: createCardId("card-1"),
        type: "stat",
        value: 3,
      };

      expect(modifier.duration).toBe("while-condition");
    });

    it("should support optional condition function", () => {
      const modifier: Modifier = {
        condition: () => true,
        duration: "while-condition",
        id: "mod-1",
        property: "power",
        source: createCardId("card-1"),
        type: "stat",
        value: 2,
      };

      expect(modifier.condition).toBeDefined();
      expect(typeof modifier.condition).toBe("function");
      expect(modifier.condition?.({} as never)).toBe(true);
    });

    it("should support optional layer for complex interactions", () => {
      const modifier: Modifier = {
        duration: "permanent",
        id: "mod-1",
        layer: 7,
        property: "power",
        source: createCardId("card-1"),
        type: "stat",
        value: 2,
      };

      expect(modifier.layer).toBe(7);
    });

    it("should work without optional fields", () => {
      const modifier: Modifier = {
        duration: "permanent",
        id: "mod-1",
        property: "power",
        source: createCardId("card-1"),
        type: "stat",
        value: 2,
      };

      expect(modifier.condition).toBeUndefined();
      expect(modifier.layer).toBeUndefined();
    });
  });

  describe("Modifier Values", () => {
    it("should support number values", () => {
      const modifier: Modifier = {
        duration: "permanent",
        id: "mod-1",
        property: "power",
        source: createCardId("card-1"),
        type: "stat",
        value: 5,
      };

      expect(typeof modifier.value).toBe("number");
      expect(modifier.value).toBe(5);
    });

    it("should support negative number values", () => {
      const modifier: Modifier = {
        duration: "permanent",
        id: "mod-2",
        property: "power",
        source: createCardId("card-1"),
        type: "stat",
        value: -2,
      };

      expect(modifier.value).toBe(-2);
    });

    it("should support string values", () => {
      const modifier: Modifier = {
        duration: "permanent",
        id: "mod-3",
        property: "creature-type",
        source: createCardId("card-1"),
        type: "type",
        value: "dragon",
      };

      expect(typeof modifier.value).toBe("string");
      expect(modifier.value).toBe("dragon");
    });

    it("should support boolean values", () => {
      const modifier: Modifier = {
        duration: "permanent",
        id: "mod-4",
        property: "flying",
        source: createCardId("card-1"),
        type: "ability",
        value: true,
      };

      expect(typeof modifier.value).toBe("boolean");
      expect(modifier.value).toBe(true);
    });
  });

  describe("Modifier Source Tracking", () => {
    it("should track source card", () => {
      const sourceCard = createCardId("source-1");
      const modifier: Modifier = {
        duration: "permanent",
        id: "mod-1",
        property: "power",
        source: sourceCard,
        type: "stat",
        value: 2,
      };

      expect(modifier.source).toBe(sourceCard);
    });

    it("should enforce CardId type for source", () => {
      const sourceCard = createCardId("source-1");
      const modifier: Modifier = {
        duration: "permanent",
        id: "mod-1",
        property: "power",
        source: sourceCard,
        type: "stat",
        value: 2,
      };

      const _typeCheck: typeof sourceCard = modifier.source;
      expect(modifier.source).toBe(sourceCard);
    });
  });

  describe("Modifier Condition", () => {
    it("should accept condition function that returns boolean", () => {
      const modifier: Modifier = {
        condition: (state) => state !== null,
        duration: "while-condition",
        id: "mod-1",
        property: "power",
        source: createCardId("card-1"),
        type: "stat",
        value: 2,
      };

      expect(modifier.condition).toBeDefined();
      expect(modifier.condition?.({} as never)).toBe(true);
    });

    it("should support complex condition logic", () => {
      interface GameState {
        cardTapped: boolean;
      }
      const modifier: Modifier<GameState> = {
        condition: (state) => state.cardTapped === true,
        duration: "while-condition",
        id: "mod-1",
        property: "power",
        source: createCardId("card-1"),
        type: "stat",
        value: 2,
      };

      expect(modifier.condition?.({ cardTapped: true })).toBe(true);
      expect(modifier.condition?.({ cardTapped: false })).toBe(false);
    });
  });
});
