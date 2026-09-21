import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainRideshareAi,
  welcomeToNightCityRetailMantisBlades,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const delamain = welcomeToNightCityRetailDelamainRideshareAi;

describe("Delamain — Rideshare AI", () => {
  it("is an exact 3-cost 0-power blue AI Unit with RAM 3, no Sell Tag, and Draw 2 on Play", () => {
    expect(delamain).toMatchObject({
      canonicalId: "delamain-rideshare-ai",
      slug: "delamain-rideshare-ai",
      type: "unit",
      color: "blue",
      classifications: ["AI"],
      cost: 3,
      power: 0,
      ram: 3,
      hasSellTag: false,
      name: "Delamain",
      subname: "Rideshare AI",
      displayName: "Delamain: Rideshare AI",
      rulesText: "{Play} Draw 2.\n(Units with power 0 don't steal Gigs.)",
      printNumber: "111",
      timingTriggers: ["play"],
      reminderText: ["Units with power 0 don't steal Gigs."],
    });
    expect(delamain.abilities).toEqual([
      {
        kind: "triggered",
        text: "Play Draw 2.",
        trigger: { trigger: "play" },
        source: { selector: "self" },
        effects: [{ effect: "draw", player: "friendly", amount: 2 }],
      },
    ]);
  });

  it("draws 2 on Play", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [delamain],
      deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailCorpoSecurity],
      eddies: 3,
    });
    const handBefore = engine.getHandCount(P1);
    engine.playCard(delamain, { as: P1 });
    expect(engine.getHandCount(P1)).toBe(handBefore - 1 + 2);
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(delamain, "field", P1).meta.hasLag).toBe(true);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      delamain.id,
    );
  });

  it("draws as many as possible when fewer than 2 cards remain in the deck", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [delamain],
      eddies: 3,
    });
    engine.judgeStackDeck([welcomeToNightCityRetailCorpoSecurity], { replace: true, as: P1 });

    engine.playCard(delamain, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(1);
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(0);
    expect(engine.getCard(delamain, "field", P1)).toBeDefined();
  });

  it("does not steal Gigs on a successful direct attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: delamain, spent: false, hasLag: false }],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
    );

    engine.attackRival(delamain, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getGigDice(P1)).toHaveLength(0);
    expect(engine.getEvents("gigStolen")).toHaveLength(0);
  });

  it("steals normally once equipped Gear raises its power above 0", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: delamain,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMantisBlades],
          },
        ],
      },
      { gigArea: [{ dieType: "d6", faceValue: 3 }] },
    );

    engine.attackRival(delamain, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d6");
    expect(engine.getEvents("gigStolen")).toHaveLength(1);
  });
});
