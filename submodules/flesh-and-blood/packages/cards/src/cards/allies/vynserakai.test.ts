import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { stormOfSandikai } from "../weapons/storm-of-sandikai.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { vynserakai } from "./vynserakai.ts";

/**
 * Vynserakai (UPR016) — "Whenever Vynserakai hits a hero, he deals 3 arcane
 * damage to them."
 *
 * Dragon allies have no printed Attack ability. Storm of Sandikai grants
 * "Once per Turn Action - 0: Attack" to Dragon allies you control.
 */

describe("Vynserakai (UPR016) AAA", () => {
  it("happy: hitting a hero deals 6 physical then 3 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [vynserakai],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, life: 20, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.activate(vynserakai);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(11);
    expectFabCard(Blaze, vynserakai).toBeIn("arena");
  });

  it("boundary: without Storm of Sandikai, Vynserakai has no Attack activation", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        arena: [vynserakai],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.expectActivationRejected(vynserakai);
    expectFabCard(Blaze, vynserakai).toBeIn("arena");
  });

  it("timing: a fully blocked attack is not a hit, so the 3 arcane does not deal", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [vynserakai],
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: dash,
        life: 20,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.activate(vynserakai);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    game.as(dash).defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
