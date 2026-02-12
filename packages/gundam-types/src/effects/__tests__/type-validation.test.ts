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
        type: "DRAW",
        count: 2,
        player: "self",
      };
      expect(action.type).toBe("DRAW");
      expect(action.count).toBe(2);
    });

    it("should create valid DamageAction", () => {
      const action: DamageAction = {
        type: "DAMAGE",
        amount: 3,
        target: "unit",
        damageType: "effect",
      };
      expect(action.type).toBe("DAMAGE");
      expect(action.amount).toBe(3);
    });

    it("should enforce discriminated union type narrowing", () => {
      const action: EffectAction = {
        type: "DAMAGE",
        amount: 5,
        target: "base",
        damageType: "effect",
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
        id: "test-effect-1",
        category: "triggered",
        timing: { type: "DEPLOY" },
        actions: [
          {
            type: "DRAW",
            count: 1,
            player: "self",
          },
        ],
        text: "Draw 1 card when deployed",
      };

      expect(effect.id).toBe("test-effect-1");
      expect(effect.category).toBe("triggered");
      expect(effect.actions).toHaveLength(1);
    });

    it("should create valid activated effect with targeting", () => {
      const targeting: TargetingSpec = {
        count: 1,
        validTargets: [
          {
            type: "unit",
            owner: "opponent",
            properties: {
              cost: { max: 3 },
            },
          },
        ],
        chooser: "controller",
        timing: "on_resolution",
      };

      const effect: Effect = {
        id: "test-effect-2",
        category: "activated",
        timing: { type: "MAIN" },
        actions: [
          {
            type: "DESTROY",
            target: targeting,
          },
        ],
        targeting,
        text: "Destroy target unit with cost 3 or less",
      };

      expect(effect.targeting).toBeDefined();
      expect(effect.targeting?.count).toBe(1);
    });
  });

  describe("Effect Timing", () => {
    it("should create valid timing types", () => {
      const mainTiming: EffectTiming = { type: "MAIN" };
      const deployTiming: EffectTiming = { type: "DEPLOY" };
      const burstTiming: EffectTiming = { type: "BURST", timing: "before" };

      expect(mainTiming.type).toBe("MAIN");
      expect(deployTiming.type).toBe("DEPLOY");
      expect(burstTiming.type).toBe("BURST");
    });
  });

  describe("Keyword Effects", () => {
    it("should accept valid keyword values", () => {
      const keywords: KeywordEffect[] = [
        "Repair",
        "Breach",
        "Support",
        "FirstStrike",
      ];

      expect(keywords).toHaveLength(4);
    });
  });

  describe("Type Serialization", () => {
    it("should serialize and deserialize Effect", () => {
      const effect: Effect = {
        id: "serialize-test",
        category: "command",
        timing: { type: "MAIN" },
        actions: [
          {
            type: "DRAW",
            count: 2,
            player: "self",
          },
        ],
        text: "Draw 2 cards",
      };

      const serialized = JSON.stringify(effect);
      const deserialized = JSON.parse(serialized) as Effect;

      expect(deserialized.id).toBe(effect.id);
      expect(deserialized.actions[0].type).toBe("DRAW");
    });
  });
});
