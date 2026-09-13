import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { ravenousRabbleRed } from "./ravenous-rabble.ts";
import { nimblismBlue } from "./nimblism.ts";
import { oathOfLoyaltyRed } from "./oath-of-loyalty.ts";

describe("Oath of Loyalty (HNT149) AAA", () => {
  it("happy: legal as the first action of the turn", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [oathOfLoyaltyRed], actionPoints: 1 },
      { hero: dash, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    game.as(fai).play(oathOfLoyaltyRed, { target: game.as(dash).id });
    expect(game.combat()?.step).toBe("layer");
  });

  it("boundary: illegal after another action this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [ravenousRabbleRed, oathOfLoyaltyRed],
        deck: [nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    Fai.play(ravenousRabbleRed, { target: game.as(dash).id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });
    expect(() => Fai.play(oathOfLoyaltyRed, { target: game.as(dash).id })).toThrow(
      /play condition is not satisfied/,
    );
  });
});
