import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { stormOfSandikai } from "../weapons/storm-of-sandikai.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { azvolai } from "./azvolai.ts";

/**
 * Azvolai (UPR009) — Dragon Ally, 2{p}/3{h}.
 *
 * Printed: Whenever Azvolai attacks, you may have him deal 1 arcane damage
 * to up to any 2 targets.
 *
 * Dragon allies have no printed Attack. Storm of Sandikai grants
 * "Once per Turn Action - 0: Attack" to Dragon allies you control.
 */

describe("Azvolai (UPR009) AAA", () => {
  it("happy: attacking may deal 1 arcane to the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [azvolai],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.activate(azvolai);
    game.advanceUntil({ stopAt: "on-attack" });
    if (game.waitState().kind === "decision") {
      Blaze.target(Dash);
    }
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Blaze, azvolai).toBeIn("arena");
  });

  it("boundary: without Storm of Sandikai, Azvolai has no Attack activation", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        arena: [azvolai],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    expect(() => Blaze.activate(azvolai)).toThrow();
    expectFabCard(Blaze, azvolai).toBeIn("arena");
  });

  it("timing: declining the arcane leaves the defending hero at printed combat damage only", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [azvolai],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.activate(azvolai);
    game.advanceUntil({ stopAt: "on-attack" });
    if (game.waitState().kind === "decision") {
      Blaze.target();
    }
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });
});
