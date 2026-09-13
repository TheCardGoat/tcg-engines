import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { carrionHusk } from "../equipment/carrion-husk.ts";
import { vynserakai } from "../allies/vynserakai.ts";
import { nimblismBlue } from "./nimblism.ts";
import { hmsBarracudaYellow } from "./hms-barracuda.ts";

/**
 * HMS Barracuda (SEA134) — Pirate Attack, 6{p}.
 * Printed: When this hits a hero, destroy an ally they control.
 * High Tide — If there are 2 or more blue cards in your pitch zone, this gets
 * +1{p} and overpower.
 */

describe("HMS Barracuda (SEA134) AAA", () => {
  it("happy: a hit destroys an ally they control", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hmsBarracudaYellow],
        pitch: [nimblismBlue, nimblismBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [vynserakai], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(hmsBarracudaYellow);
    expectCombat(game).toHaveAttackPower(7).toHaveKeyword("overpower");
    game.closeCombat({ ordering: "listed", entityTargets: "minimum" });

    expectFabCard(Dash, vynserakai).toBeIn("graveyard");
  });

  it("boundary: without High Tide this does not have overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hmsBarracudaYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [vynserakai], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(hmsBarracudaYellow);
    expectCombat(game).notToHaveKeyword("overpower");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: a miss leaves their ally", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hmsBarracudaYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        chest: [carrionHusk],
        arena: [vynserakai],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(hmsBarracudaYellow);
    Dash.defendWith([carrionHusk]);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, vynserakai).toBeIn("arena");
  });

  it("timing: two blues in pitch give High Tide +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hmsBarracudaYellow],
        pitch: [nimblismBlue, nimblismBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [vynserakai], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(hmsBarracudaYellow);
    expectCombat(game).toHaveAttackPower(7);
  });
});
