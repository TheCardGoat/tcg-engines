import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { healingPotionBlue } from "./healing-potion.ts";

describe("Healing Potion (EVR183) AAA", () => {
  it("happy: Action destroy this gains 2{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [healingPotionBlue],
        hand: [],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(healingPotionBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(22);
    expectFabCard(Dash, healingPotionBlue).toBeIn("graveyard");
  });

  it("boundary: 0 action points cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [healingPotionBlue],
        hand: [],
        actionPoints: 0,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(healingPotionBlue);
    expectFabCard(Dash, healingPotionBlue).toBeIn("arena");
  });

  it("timing: go again refunds the Action AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [healingPotionBlue],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(healingPotionBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveAP(1);
  });
});
