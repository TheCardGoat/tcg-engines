import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { stormOfSandikai } from "../weapons/storm-of-sandikai.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { themai } from "../allies/themai.ts";
import { yendurai } from "../allies/yendurai.ts";
import { snatchRed } from "./snatch.ts";
import { burnThemAllRed } from "./burn-them-all.ts";

/**
 * Burn Them All (UPR005) — Draconic Illusionist Action Aura, cost 0, go again.
 *
 * Printed: Once per turn, when a dragon you control attacks, it deals 1 arcane
 * damage to each opposing hero.
 */

describe("Burn Them All (UPR005) AAA", () => {
  it("happy: a dragon attack deals 1 arcane to the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [burnThemAllRed, yendurai],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.activate(yendurai);
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(19);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabCard(Blaze, burnThemAllRed).toBeIn("arena");
  });

  it("boundary: a non-dragon attack does not ping", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        arena: [burnThemAllRed],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.playAttack(snatchRed, { stopAt: "defend" });
    expectFabPlayer(Dash).toHaveLife(20);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: once per turn — a second dragon attack this turn does not ping again", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [burnThemAllRed, yendurai, themai],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.activate(yendurai);
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(19);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(16);

    Blaze.activate(themai);
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(16);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(13);
  });
});
