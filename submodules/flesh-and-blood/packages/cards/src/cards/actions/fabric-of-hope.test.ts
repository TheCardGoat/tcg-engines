import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { hopeMerchantSHood } from "../equipment/hope-merchant-s-hood.ts";
import { fabricOfHopeRed } from "./fabric-of-hope.ts";

describe("Fabric of Hope (LSS012) AAA", () => {
  it("happy: equips Hope Merchant's Hood from inventory and stays as a construct", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fabricOfHopeRed],
        inventory: [hopeMerchantSHood],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricOfHopeRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Dash, hopeMerchantSHood).toBeIn("head");
    expectFabCard(Dash, fabricOfHopeRed).toBeIn("arena");
  });

  it("boundary: with no Hope Merchant's Hood it is negated to the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [fabricOfHopeRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricOfHopeRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dash, fabricOfHopeRed).toBeIn("graveyard");
  });

  it("timing: playing the construct spends the Action AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fabricOfHopeRed],
        inventory: [hopeMerchantSHood],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricOfHopeRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
