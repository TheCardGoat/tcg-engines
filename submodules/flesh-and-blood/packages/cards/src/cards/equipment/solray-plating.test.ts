import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { snatchRed } from "../actions/snatch.ts";
import { solrayPlating } from "./solray-plating.ts";

describe("Solray Plating (PEN180) AAA", () => {
  it("happy: banishing the soul card prevents 1 of the bolt's 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [],
        chest: [solrayPlating],
        soul: [snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);
    Dash.target(snatchRed);
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, snatchRed).toBeBanished();
  });

  it("boundary: with an empty soul the bolt lands for the full 5", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [],
        chest: [solrayPlating],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, solrayPlating).toBeIn("chest");
  });
});
