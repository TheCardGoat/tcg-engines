import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { buccaneerSBounty } from "./buccaneer-s-bounty.ts";

describe("Buccaneer's Bounty (SEA127) AAA", () => {
  it("happy: Action destroy this to gain 1 resource and refund AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [buccaneerSBounty],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(buccaneerSBounty);
    game.untilIdle();

    expectFabCard(Bravo, buccaneerSBounty).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveResourceCount(1);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: with 0 action points the Action is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [buccaneerSBounty],
        hand: [],
        actionPoints: 0,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(buccaneerSBounty);
    expectFabCard(Bravo, buccaneerSBounty).toBeIn("chest");
  });
});
