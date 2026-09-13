import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { bravo } from "../heroes/bravo.ts";
import { carrionHusk } from "../equipment/carrion-husk.ts";
import { nimblismBlue } from "./nimblism.ts";
import { hmsKrakenYellow } from "./hms-kraken.ts";

/**
 * HMS Kraken (SEA135) — Pirate Attack, 6{p}.
 * Printed: When this hits a hero, destroy an item they control.
 * High Tide — If there are 2 or more blue cards in your pitch zone, this gets
 * +1{p} and overpower.
 */

describe("HMS Kraken (SEA135) AAA", () => {
  it("happy: a hit destroys an item they control", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hmsKrakenYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 1 } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(hmsKrakenYellow);
    game.closeCombat({ ordering: "listed", entityTargets: "minimum" });

    expectFabCard(Dash, hyperDriverRed).toBeIn("graveyard");
  });

  it("boundary: without High Tide this does not have overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hmsKrakenYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 1 } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(hmsKrakenYellow);
    expectCombat(game).notToHaveKeyword("overpower");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: a miss leaves their item", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hmsKrakenYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        chest: [carrionHusk],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 1 } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(hmsKrakenYellow);
    Dash.defendWith([carrionHusk]);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, hyperDriverRed).toBeIn("arena");
  });

  it("timing: two blues in pitch give High Tide +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hmsKrakenYellow],
        pitch: [nimblismBlue, nimblismBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 1 } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(hmsKrakenYellow);
    expectCombat(game).toHaveAttackPower(7);
  });
});
