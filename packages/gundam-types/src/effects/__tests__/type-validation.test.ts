import { describe, expect, it } from "bun:test";
import type {
  DamageAction,
  DrawAction,
  Effect,
  EffectAction,
  EffectTiming,
  KeywordEffect,
  TargetingSpec,
} from "../index";

describe("Effect Type System - Type Validation", () => {
  describe("EffectAction Discriminated Union", () => {
    it("should create valid DrawAction", () => {
      const action: DrawAction = {
        count: 2,
        player: "self",
        type: "DRAW",
      };
      expect(action.type).toBe("DRAW");
      expect(action.count).toBe(2);
    });

    it("should create valid DamageAction", () => {
      const action: DamageAction = {
        amount: 3,
        damageType: "effect",
        target: "unit",
        type: "DAMAGE",
      };
      expect(action.type).toBe("DAMAGE");
      expect(action.amount).toBe(3);
    });

    it("should enforce discriminated union type narrowing", () => {
      const action: EffectAction = {
        amount: 5,
        damageType: "effect",
        target: "base",
        type: "DAMAGE",
      };

      if (action.type === "DAMAGE") {
        // TypeScript should know this is DamageAction
        expect(action.amount).toBe(5);
        expect(action.target).toBe("base");
      }
    });
  });

  describe("Effect Def Definition", () => {
    it("should create valid triggered effect", () => {
      const effect: Effect = {
        actions: [
          {
            count: 1,
            player: "self",
            type: "DRAW",
          },
        ],
        category: "triggered",
        id: "test-effect-1",
        text: "Draw 1 card when deployed",
        timing: { type: "DEPLOY" },
      };

      expect(effect.id).toBe("test-effect-1");
      expect(effect.category).toBe("triggered");
      expect(effect.actions).toHaveLength(1);
    });

    it("should create valid activated effect with targeting", () => {
      const targeting: TargetingSpec = {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [
          {
            owner: "opponent",
            properties: {
              cost: { max: 3 },
            },
            type: "unit",
          },
        ],
      };

      const effect: Effect = {
        actions: [
          {
            target: targeting,
            type: "DESTROY",
          },
        ],
        category: "activated",
        id: "test-effect-2",
        targeting,
        text: "Destroy target unit with cost 3 or less",
        timing: { type: "MAIN" },
      };

      expect(effect.targeting).toBeDefined();
      expect(effect.targeting?.count).toBe(1);
    });
  });

  describe("Effect Timing", () => {
    it("should create valid timing types", () => {
      const mainTiming: EffectTiming = { type: "MAIN" };
      const deployTiming: EffectTiming = { type: "DEPLOY" };
      const burstTiming: EffectTiming = { timing: "before", type: "BURST" };

      expect(mainTiming.type).toBe("MAIN");
      expect(deployTiming.type).toBe("DEPLOY");
      expect(burstTiming.type).toBe("BURST");
    });
  });

  describe("Keyword Effects", () => {
    it("should accept valid keyword values", () => {
      const keywords: KeywordEffect[] = ["Repair", "Breach", "Support", "FirstStrike"];

      expect(keywords).toHaveLength(4);
    });
  });

  describe("Type Serialization", () => {
    it("should serialize and deserialize Effect", () => {
      const effect: Effect = {
        actions: [
          {
            count: 2,
            player: "self",
            type: "DRAW",
          },
        ],
        category: "command",
        id: "serialize-test",
        text: "Draw 2 cards",
        timing: { type: "MAIN" },
      };

      const serialized = JSON.stringify(effect);
      const deserialized = JSON.parse(serialized) as Effect;

      expect(deserialized.id).toBe(effect.id);
      expect(deserialized.actions[0].type).toBe("DRAW");
    });
  });
});
