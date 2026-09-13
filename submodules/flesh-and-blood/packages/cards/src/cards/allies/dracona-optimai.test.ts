import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { stormOfSandikai } from "../weapons/storm-of-sandikai.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { draconaOptimai } from "./dracona-optimai.ts";

describe("Dracona Optimai (UPR006) AAA", () => {
  it("happy: attacking a hero reveals reds and deals twice that many arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [draconaOptimai],
        actionPoints: 1,
        deckTop: [snatchRed, snatchRed, nimblismBlue],
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.activate(draconaOptimai);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(10);
    expectFabCard(Blaze, draconaOptimai).toBeIn("arena");
  });

  it("boundary: without Storm of Sandikai, Dracona has no Attack activation", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        arena: [draconaOptimai],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.expectActivationRejected(draconaOptimai);
    expectFabCard(Blaze, draconaOptimai).toBeIn("arena");
  });

  it("timing: revealing no reds deals 0 extra arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [draconaOptimai],
        actionPoints: 1,
        deckTop: [nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.activate(draconaOptimai);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });
});
