import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { potionOfStrengthBlue } from "./potion-of-strength.ts";
import { healingPotionBlue } from "./healing-potion.ts";
import { cashOutBlue } from "./cash-out.ts";

describe("Cash Out (EVR158) AAA", () => {
  it("happy: destroying one item creates one Silver and keeps go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [healingPotionBlue],
        hand: [cashOutBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.playInstance(Dash.id, Dash.findCardInZone("hand", cashOutBlue), {}, "explicit");
    Dash.accept();
    Dash.target(healingPotionBlue);
    game.untilIdle();

    expectFabCard(Dash, cashOutBlue).toBeIn("graveyard");
    expectFabCard(Dash, healingPotionBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveTokenCount("silver", 1);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: declining the optional cost creates no Silver", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [healingPotionBlue],
        hand: [cashOutBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.playInstance(Dash.id, Dash.findCardInZone("hand", cashOutBlue), {}, "explicit");
    Dash.decline();
    game.untilIdle();

    expectFabCard(Dash, cashOutBlue).toBeIn("graveyard");
    expectFabCard(Dash, healingPotionBlue).toBeIn("arena");
    expectFabPlayer(Dash).toHaveTokenCount("silver", 0);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("timing: destroying two items creates two Silvers", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [healingPotionBlue, potionOfStrengthBlue],
        hand: [cashOutBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.playInstance(Dash.id, Dash.findCardInZone("hand", cashOutBlue), {}, "explicit");
    Dash.accept();
    Dash.target(healingPotionBlue, potionOfStrengthBlue);
    game.untilIdle();

    expectFabCard(Dash, healingPotionBlue).toBeIn("graveyard");
    expectFabCard(Dash, potionOfStrengthBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveTokenCount("silver", 2);
    expectFabPlayer(Dash).toHaveAP(1);
  });
});
