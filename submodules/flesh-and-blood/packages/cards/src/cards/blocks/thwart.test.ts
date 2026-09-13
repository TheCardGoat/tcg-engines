import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { glistenRed } from "../instants/glisten.ts";
import { raydnDuskbane } from "../weapons/raydn-duskbane.ts";
import { thwartYellow } from "./thwart.ts";

describe("Thwart (MPW145) AAA", () => {
  it("happy: defending removes every +1 power counter from the attacking card", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [raydnDuskbane],
        hand: [glistenRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [thwartYellow], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.play(glistenRed);
    game.untilIdle({ entityTargets: "maximum" });
    expectFabCard(Boltyn, raydnDuskbane).toHavePower(4);

    Boltyn.activateAttack(raydnDuskbane);
    Dash.defendWith(thwartYellow);
    game.passBoth();

    expectFabCard(Boltyn, raydnDuskbane).toHavePower(0);
  });

  it("boundary: an attacking card without +1 power counters remains at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [raydnDuskbane],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [thwartYellow], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.activateAttack(raydnDuskbane);
    game.as(dash).defendWith(thwartYellow);
    game.passBoth();

    expectFabCard(Boltyn, raydnDuskbane).toHavePower(0);
  });
});
