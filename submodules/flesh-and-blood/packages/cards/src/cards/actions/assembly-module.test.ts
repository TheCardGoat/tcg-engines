import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { nimblismBlue } from "./nimblism.ts";
import { assemblyModuleBlue } from "./assembly-module.ts";

describe("Assembly Module (PEN067) AAA", () => {
  it("happy: tap to search a Hyper Driver into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: assemblyModuleBlue, state: { steamCounters: 1 } }],
        deckTop: [nimblismBlue, hyperDriverRed],
        actionPoints: 1,
        hand: [],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.activate(assemblyModuleBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: hyperDriverRed.canonicalId });

    expectFabCard(Teklo, hyperDriverRed).toBeIn("arena");
    expectFabCard(Teklo, assemblyModuleBlue).toBeIn("arena");
  });

  it("boundary: an empty deck search does not create a Hyper Driver", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: assemblyModuleBlue, state: { steamCounters: 1 } }],
        deck: [nimblismBlue],
        actionPoints: 1,
        hand: [],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.activate(assemblyModuleBlue);
    game.untilIdle();

    expect(Teklo.zone("arena")).not.toContain(hyperDriverRed.canonicalId);
  });

  it("timing: start of your turn you may keep this by removing steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: assemblyModuleBlue, state: { steamCounters: 1 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, assemblyModuleBlue).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, assemblyModuleBlue).toBeIn("arena");
  });
});
