import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { hopeMerchantSHood } from "./hope-merchant-s-hood.ts";

describe("Hope Merchant's Hood (TEA004) AAA", () => {
  it("happy: destroy this, shuffle 2 from hand, then draw 2", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [hopeMerchantSHood],
        hand: [snatchRed, nimblismBlue],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 0,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(hopeMerchantSHood);
    game.advanceToDecision(Bravo, "entity-target");
    Bravo.chooseTargets(Bravo.cardIn("hand", snatchRed), Bravo.cardIn("hand", nimblismBlue));
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, hopeMerchantSHood).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveHandCount(2);
  });

  it("boundary: shuffling zero cards draws nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [hopeMerchantSHood],
        hand: [snatchRed, nimblismBlue],
        deck: [snatchRed, snatchRed, snatchRed],
        actionPoints: 0,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(hopeMerchantSHood);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, hopeMerchantSHood).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveHandCount(2);
    expectFabCard(Bravo, snatchRed).toBeIn("hand");
    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
  });

  it("timing: Instant activation spends no action point", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [hopeMerchantSHood],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(hopeMerchantSHood);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, hopeMerchantSHood).toBeIn("graveyard");
  });
});
