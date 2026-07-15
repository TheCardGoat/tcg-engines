import { describe, expect, it } from "bun:test";
import type { Effect } from "@tcg/lorcana-types";
import { classifyEffectPolarity } from "./effect-polarity";

describe("classifyEffectPolarity", () => {
  it("returns neutral for undefined", () => {
    expect(classifyEffectPolarity(undefined).polarity).toBe("neutral");
  });

  describe("beneficial effects", () => {
    const beneficialTypes: Effect["type"][] = [
      "remove-damage",
      "ready",
      "gain-lore",
      "draw",
      "put-into-inkwell",
      "put-in-hand",
      "play-card",
      "cost-reduction",
      "enable-play-from-under",
      "prevent-damage",
      "additional-inkwell",
      "stat-floor",
      "move-to-location",
      "move-cost-reduction",
      "grant-abilities-while-here",
      "support",
    ];

    for (const type of beneficialTypes) {
      it(`${type} is beneficial`, () => {
        expect(classifyEffectPolarity({ type } as Effect).polarity).toBe("beneficial");
      });
    }
  });

  describe("harmful effects", () => {
    const harmfulTypes: Effect["type"][] = [
      "deal-damage",
      "put-damage",
      "banish",
      "exert",
      "discard",
      "mill",
      "lose-lore",
      "lose-keyword",
      "cost-increase",
      "shuffle-into-deck",
      "put-on-bottom",
      "return-to-hand",
      "redirect-damage",
      "reveal-hand",
      "return-random-from-inkwell",
    ];

    for (const type of harmfulTypes) {
      it(`${type} is harmful`, () => {
        expect(classifyEffectPolarity({ type } as Effect).polarity).toBe("harmful");
      });
    }
  });

  describe("neutral effects", () => {
    const neutralTypes: Effect["type"][] = [
      "select-target",
      "look-at-cards",
      "name-a-card",
      "reveal-top-card",
      "reveal-until-match",
      "put-on-top",
      "draw-until-hand-size",
      "scry",
      "search-deck",
      "count",
      "suppress-ability",
    ];

    for (const type of neutralTypes) {
      it(`${type} is neutral`, () => {
        expect(classifyEffectPolarity({ type } as Effect).polarity).toBe("neutral");
      });
    }
  });

  describe("modify-stat", () => {
    it("positive modifier is beneficial", () => {
      expect(classifyEffectPolarity({ type: "modify-stat", modifier: 2 } as Effect).polarity).toBe(
        "beneficial",
      );
    });

    it("negative modifier is harmful", () => {
      expect(classifyEffectPolarity({ type: "modify-stat", modifier: -2 } as Effect).polarity).toBe(
        "harmful",
      );
    });

    it("zero modifier is neutral", () => {
      expect(classifyEffectPolarity({ type: "modify-stat", modifier: 0 } as Effect).polarity).toBe(
        "neutral",
      );
    });

    it("positive value field is beneficial", () => {
      expect(classifyEffectPolarity({ type: "modify-stat", value: 3 } as Effect).polarity).toBe(
        "beneficial",
      );
    });
  });

  describe("gain-keyword", () => {
    it("Ward is beneficial", () => {
      expect(
        classifyEffectPolarity({ type: "gain-keyword", keyword: "Ward" } as Effect).polarity,
      ).toBe("beneficial");
    });

    it("Rush is beneficial", () => {
      expect(
        classifyEffectPolarity({ type: "gain-keyword", keyword: "Rush" } as Effect).polarity,
      ).toBe("beneficial");
    });

    it("Evasive is beneficial", () => {
      expect(
        classifyEffectPolarity({ type: "gain-keyword", keyword: "Evasive" } as Effect).polarity,
      ).toBe("beneficial");
    });

    it("Bodyguard is beneficial", () => {
      expect(
        classifyEffectPolarity({ type: "gain-keyword", keyword: "Bodyguard" } as Effect).polarity,
      ).toBe("beneficial");
    });

    it("Reckless is harmful", () => {
      expect(
        classifyEffectPolarity({ type: "gain-keyword", keyword: "Reckless" } as Effect).polarity,
      ).toBe("harmful");
    });

    it("gain-keywords delegates to gain-keyword logic", () => {
      expect(
        classifyEffectPolarity({
          type: "gain-keywords",
          keywords: [{ keyword: "Ward" }],
        } as unknown as Effect).polarity,
      ).toBe("beneficial");
    });
  });

  describe("grant-ability", () => {
    it("can-challenge-ready is beneficial", () => {
      expect(
        classifyEffectPolarity({
          type: "grant-ability",
          ability: "can-challenge-ready",
        } as Effect).polarity,
      ).toBe("beneficial");
    });

    it("lose-lore-when-questing is harmful", () => {
      expect(
        classifyEffectPolarity({
          type: "grant-ability",
          ability: "lose-lore-when-questing",
        } as Effect).polarity,
      ).toBe("harmful");
    });
  });

  describe("restriction", () => {
    it("is always harmful", () => {
      expect(
        classifyEffectPolarity({ type: "restriction", restriction: "cant-quest" } as Effect)
          .polarity,
      ).toBe("harmful");
    });
  });

  describe("control flow", () => {
    it("optional wraps child polarity", () => {
      expect(
        classifyEffectPolarity({
          type: "optional",
          effect: { type: "gain-lore", amount: 2 },
        } as Effect).polarity,
      ).toBe("beneficial");
    });

    it("sequence of same polarity returns that polarity", () => {
      expect(
        classifyEffectPolarity({
          type: "sequence",
          effects: [{ type: "remove-damage", amount: 1 }, { type: "ready" }],
        } as Effect).polarity,
      ).toBe("beneficial");
    });

    it("sequence of mixed polarity returns mixed", () => {
      expect(
        classifyEffectPolarity({
          type: "sequence",
          effects: [
            { type: "deal-damage", amount: 2 },
            { type: "gain-lore", amount: 1 },
          ],
        } as Effect).polarity,
      ).toBe("mixed");
    });

    it("choice with mixed options returns mixed", () => {
      expect(
        classifyEffectPolarity({
          type: "choice",
          options: [
            { type: "deal-damage", amount: 3 },
            { type: "gain-lore", amount: 2 },
          ],
        } as Effect).polarity,
      ).toBe("mixed");
    });

    it("conditional with different branches returns mixed", () => {
      expect(
        classifyEffectPolarity({
          type: "conditional",
          ifTrue: { type: "deal-damage", amount: 2 },
          ifFalse: { type: "gain-lore", amount: 1 },
        } as Effect).polarity,
      ).toBe("mixed");
    });

    it("conditional with same branches returns that polarity", () => {
      expect(
        classifyEffectPolarity({
          type: "conditional",
          ifTrue: { type: "deal-damage", amount: 2 },
          ifFalse: { type: "banish" },
        } as Effect).polarity,
      ).toBe("harmful");
    });

    it("for-each-opponent delegates to child", () => {
      expect(
        classifyEffectPolarity({
          type: "for-each-opponent",
          effect: { type: "deal-damage", amount: 1 },
        } as Effect).polarity,
      ).toBe("harmful");
    });

    it("for-each-player delegates to child", () => {
      expect(
        classifyEffectPolarity({
          type: "for-each-player",
          effect: { type: "draw", amount: 1 },
        } as Effect).polarity,
      ).toBe("beneficial");
    });

    it("repeat delegates to children", () => {
      expect(
        classifyEffectPolarity({
          type: "repeat",
          times: 2,
          effect: { type: "gain-lore", amount: 1 },
        } as Effect).polarity,
      ).toBe("beneficial");
    });
  });

  describe("nested effects", () => {
    it("sequence 3 levels deep propagates correctly", () => {
      expect(
        classifyEffectPolarity({
          type: "sequence",
          effects: [
            {
              type: "optional",
              effect: { type: "modify-stat", modifier: 2 },
            },
            { type: "gain-keyword", keyword: "Rush" },
          ],
        } as Effect).polarity,
      ).toBe("beneficial");
    });
  });
});
