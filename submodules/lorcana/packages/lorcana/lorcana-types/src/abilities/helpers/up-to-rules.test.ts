import { describe, expect, it } from "bun:test";
import {
  getUpToRule,
  listUpToRuleEffectTypes,
  supportsUpTo,
  type UpToCapContext,
} from "./up-to-rules";

const damageMap = (byId: Record<string, number>): UpToCapContext => ({
  getCardDamage: (cardId) => byId[cardId] ?? 0,
});

describe("up-to rule registry", () => {
  it("reports the default registered effect types", () => {
    expect(listUpToRuleEffectTypes()).toEqual(["remove-damage", "move-damage"]);
    expect(supportsUpTo("remove-damage")).toBe(true);
    expect(supportsUpTo("move-damage")).toBe(true);
    expect(supportsUpTo("deal-damage")).toBe(false);
  });

  it("rejects prototype-inherited keys like toString and constructor", () => {
    expect(supportsUpTo("toString")).toBe(false);
    expect(supportsUpTo("constructor")).toBe(false);
    expect(supportsUpTo("__proto__")).toBe(false);
    expect(getUpToRule("toString")).toBeUndefined();
    expect(getUpToRule("constructor")).toBeUndefined();
  });

  describe("remove-damage", () => {
    const rule = getUpToRule("remove-damage")!;

    it("clamps the slider max to the chosen target's damage", () => {
      expect(
        rule.getSelectionMax({
          baseAmount: 5,
          selectedCardTargets: ["card-1"],
          ctx: damageMap({ "card-1": 2 }),
        }),
      ).toBe(2);
    });

    it("returns the base amount when 0 or >1 card targets are selected", () => {
      expect(
        rule.getSelectionMax({
          baseAmount: 3,
          selectedCardTargets: [],
          ctx: damageMap({}),
        }),
      ).toBe(3);

      expect(
        rule.getSelectionMax({
          baseAmount: 3,
          selectedCardTargets: ["card-1", "card-2"],
          ctx: damageMap({ "card-1": 1, "card-2": 2 }),
        }),
      ).toBe(3);
    });
  });

  describe("move-damage", () => {
    const rule = getUpToRule("move-damage")!;

    it("clamps the slider max to the source card's damage", () => {
      expect(
        rule.getSelectionMax({
          baseAmount: 5,
          selectedCardTargets: ["source", "destination"],
          ctx: damageMap({ source: 1, destination: 0 }),
        }),
      ).toBe(1);
    });

    it("returns the base amount when no source has been picked yet", () => {
      expect(
        rule.getSelectionMax({
          baseAmount: 3,
          selectedCardTargets: [],
          ctx: damageMap({}),
        }),
      ).toBe(3);
    });
  });
});
