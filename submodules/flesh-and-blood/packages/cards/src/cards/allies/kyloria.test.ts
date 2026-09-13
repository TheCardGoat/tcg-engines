import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { hyperDriverRed } from "../actions/hyper-driver.ts";
import { dash } from "../heroes/dash.ts";
import { stormOfSandikai } from "../weapons/storm-of-sandikai.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { kyloria } from "./kyloria.ts";

/**
 * Kyloria (UPR011) — Draconic Illusionist Dragon Ally, 4{p}/2{h}.
 *
 * Printed: Whenever Kyloria hits a hero, gain control of an item they
 * control. If you don't gain control of an item this way, draw a card.
 *
 * Dragon allies attack via Storm of Sandikai's granted Attack activation.
 */

describe("Kyloria (UPR011) AAA", () => {
  it("happy: hitting a hero steals an item they control", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [kyloria],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, arena: [hyperDriverRed], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.activate(kyloria);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Dash.defendWith();
    game.closeCombat({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Blaze, hyperDriverRed).toBeIn("arena");
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: with no item to steal, the hit draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [kyloria],
        hand: [],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.activate(kyloria);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Dash.defendWith();
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Blaze).toHaveHandCount(1);
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: a full block is not a hit, so no steal and no draw", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [kyloria],
        hand: [],
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: dash,
        hand: [nimblismBlue, snatchRed],
        arena: [hyperDriverRed],
        life: 20,
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.activate(kyloria);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Dash.defendWith([nimblismBlue, snatchRed]);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Dash, hyperDriverRed).toBeIn("arena");
    expectFabPlayer(Blaze).toHaveHandCount(0);
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
