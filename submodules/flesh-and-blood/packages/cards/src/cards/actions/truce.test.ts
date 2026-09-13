import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { truceBlue } from "./truce.ts";

describe("Truce (ROS219) AAA", () => {
  it("happy: at the chosen opponent's end phase, destroy this and each hero gains 3{h}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [truceBlue], resourcePoints: 2, actionPoints: 1, life: 20, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(truceBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, truceBlue).toBeIn("arena");
    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, truceBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(23);
    expectFabPlayer(Dash).toHaveLife(23);
  });

  it("boundary: if they attack you, this is destroyed and you draw instead of gaining 3{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [truceBlue],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: [snatchRed],
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(truceBlue);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    Dash.attackWith(snatchRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, truceBlue).toBeIn("graveyard");
    expectFabCard(Bravo, snatchRed).toBeIn("hand");
    expectFabPlayer(Bravo).toHaveLife(16);
  });

  it("timing: playing Truce is not combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [truceBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).play(truceBlue);
    game.helpers.resolveUntilIdle();
    expect(game.combat()).toBeNull();
  });
});
