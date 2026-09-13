import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { clarityPotionBlue } from "./clarity-potion.ts";

describe("Clarity Potion (EVR182) AAA", () => {
  it("happy: Instant destroy this starts Opt 2 and the potion leaves the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [clarityPotionBlue],
        hand: [],
        actionPoints: 1,
        deck: [nimblismBlue, snatchRed],
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(clarityPotionBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dash, clarityPotionBlue).toBeIn("graveyard");
    expect(Dash.zone("deck")).toHaveLength(2);
  });

  it("boundary: the Instant cannot activate from hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [clarityPotionBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(clarityPotionBlue);
    expectFabCard(Dash, clarityPotionBlue).toBeIn("hand");
  });

  it("timing: Instant activation does not spend an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [clarityPotionBlue],
        hand: [],
        actionPoints: 1,
        deck: [nimblismBlue, snatchRed],
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(clarityPotionBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveAP(1);
  });
});
