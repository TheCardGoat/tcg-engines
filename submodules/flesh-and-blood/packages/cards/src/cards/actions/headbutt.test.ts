import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";
import { nimblismBlue } from "./nimblism.ts";
import { headbuttBlue } from "./headbutt.ts";

describe("Headbutt (MPG016) AAA", () => {
  it("happy: your head and no defending head gives +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [ironrotHelm],
        hand: [headbuttBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(headbuttBlue);
    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("boundary: a defending head keeps this at printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [ironrotHelm],
        hand: [headbuttBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, head: [ironrotHelm], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(headbuttBlue);
    expectCombat(game).toHaveAttackPower(6);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("timing: non-head equipment cannot defend; crush -1{d} destroys a 0{d} head", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [ironrotHelm],
        hand: [headbuttBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        head: [ironrotHelm],
        chest: [ironrotPlate],
        hand: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(headbuttBlue);
    game.advanceCombatTo("defend");
    expect(() => Dash.defendWith(ironrotPlate)).toThrow(/prevents this card from defending/);
    Dash.defendWith(ironrotHelm);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dash, ironrotPlate).toBeIn("chest");
    expectFabCard(Dash, ironrotHelm).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(14);
  });
});
