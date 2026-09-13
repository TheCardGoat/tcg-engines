import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { plasmaPurifierRed } from "./plasma-purifier.ts";

describe("Plasma Purifier (CRU105) AAA", () => {
  it("happy: first Action puts a steam counter", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [plasmaPurifierRed, nimblismBlue],
        actionPoints: 2,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(plasmaPurifierRed);
    game.untilIdle();
    Dash.activate(plasmaPurifierRed, {
      abilityId:
        "rmdHP7ttKz7NqLwwwGGKg:actionResourceThereNoSteamCountersPlasmaPurifierPutSteamCounterGoAgain",
    });
    game.untilIdle();
    expectFabCard(Dash, plasmaPurifierRed).toBeIn("arena");
    expectFabCard(Dash, plasmaPurifierRed).toHaveCounters(1, "steam");
  });

  it("boundary: a second steam Action does not add another counter", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [plasmaPurifierRed, nimblismBlue, nimblismBlue],
        actionPoints: 3,
        resourcePoints: 4,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(plasmaPurifierRed);
    game.untilIdle();
    Dash.activate(plasmaPurifierRed, {
      abilityId:
        "rmdHP7ttKz7NqLwwwGGKg:actionResourceThereNoSteamCountersPlasmaPurifierPutSteamCounterGoAgain",
    });
    game.untilIdle();
    Dash.activate(plasmaPurifierRed, {
      abilityId:
        "rmdHP7ttKz7NqLwwwGGKg:actionResourceThereNoSteamCountersPlasmaPurifierPutSteamCounterGoAgain",
    });
    game.untilIdle();
    expectFabCard(Dash, plasmaPurifierRed).toHaveCounters(1, "steam");
  });
});
