import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailAfterpartyAtLizzieS } from "@tcg/cyberpunk-cards";

describe("Afterparty at Lizzie's", () => {
  it("adjusts a Gig by up to 1 and draws 1 when you control 2+ Gigs with distinct values", () => {
    const ability = welcomeToNightCityRetailAfterpartyAtLizzieS.abilities[0]!;
    expect(ability.kind).toBe("triggered");
    expect(ability.trigger).toMatchObject({ trigger: "play" });

    expect(ability.effects.map((effect) => effect.effect)).toEqual(["adjustGig", "draw"]);

    expect(ability.effects[0]).toMatchObject({
      effect: "adjustGig",
      maxAmount: 1,
      direction: "either",
      chooseUpTo: true,
    });

    // Card text: "If you control 2 or more Gigs with different values, draw 1."
    const draw = ability.effects[1]!;
    expect(draw).toMatchObject({ effect: "draw", player: "friendly", amount: 1 });
    expect(draw.conditions).toEqual([
      { condition: "hasDistinctGigValues", controller: "friendly", minCount: 2 },
    ]);
  });
});
