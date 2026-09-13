import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { hardKnuckle } from "./hard-knuckle.ts";

describe("Hard Knuckle (TER006) AAA", () => {
  it("happy: playing an AAC may destroy this so the attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [hardKnuckle],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, ordering: "listed" });

    expectFabCard(Dash, hardKnuckle).toBeIn("graveyard");
    expectFabPlayer(game.as(bravo)).toHaveLife(35);
  });

  it("boundary: declining the optional keeps the arms and printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [hardKnuckle],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expectFabCard(Dash, hardKnuckle).toBeIn("arms");
    expectFabPlayer(game.as(bravo)).toHaveLife(36);
  });

  it("timing: playing a non-attack does not destroy Hard Knuckle", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [hardKnuckle],
        hand: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(nimblismBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, hardKnuckle).toBeIn("arms");
  });
});
