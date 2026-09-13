import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { crucibleOfAetherweave } from "./crucible-of-aetherweave.ts";

describe("Crucible of Aetherweave (ARC115) AAA", () => {
  it("happy: the next arcane-damage card this turn deals +1", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [crucibleOfAetherweave],
        hand: [volticBoltRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.activate(crucibleOfAetherweave);
    game.passBoth();
    Blaze.play(volticBoltRed, { target: game.as(dash).id });
    game.passBoth();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: without the staff, Voltic Bolt deals its printed 5", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [crucibleOfAetherweave],
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: game.as(dash).id });
    game.passBoth();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    Blaze.expectActivationRejected(crucibleOfAetherweave);
  });
});
