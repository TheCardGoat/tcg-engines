import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { aetherslingRed } from "./aethersling.ts";

describe("Aethersling (OMN134) AAA", () => {
  it("happy: deals 4 arcane and you may tap your hero", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [aetherslingRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(aetherslingRed, { target: Dash.id });
    game.passBoth();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Blaze, blazeFiremind).toBeTapped();
    expectFabCard(Blaze, aetherslingRed).toBeIn("graveyard");
  });

  it("timing: tapping your hero after this deals damage grants go again and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [aetherslingRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(aetherslingRed, { target: Dash.id });
    game.passBoth();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Blaze, blazeFiremind).toBeTapped();
    expectFabPlayer(Blaze).toHaveAP(1);
  });

  it("boundary: declining the tap deals 4 and does not refund the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [aetherslingRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(aetherslingRed, { target: Dash.id });
    game.passBoth();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Blaze, blazeFiremind).toBeReady();
    expectFabPlayer(Blaze).toHaveAP(0);
  });
});
