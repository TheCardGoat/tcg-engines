import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "../actions/snatch.ts";
import { askingForTroubleYellow } from "./asking-for-trouble.ts";

describe("Asking for Trouble (SUP140) AAA", () => {
  it("happy: defending with this creates Vigor under the attacking hero", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: rhinar, hand: [askingForTroubleYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Rhinar = game.as(rhinar);

    Dash.playAttack(snatchRed);
    Rhinar.defendWith(askingForTroubleYellow);
    game.passBoth();

    expectFabCard(Rhinar, askingForTroubleYellow).toBeIn("combatChain");
    expectFabPlayer(Dash).toHaveTokenCount("vigor", 1);
    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 0);
  });

  it("boundary: this does not create Vigor when it is not defending", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: rhinar, hand: [askingForTroubleYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    game.as(dash).playAttack(snatchRed);
    Rhinar.defendWith();
    game.passBoth();

    expectFabCard(Rhinar, askingForTroubleYellow).toBeIn("hand");
    expectFabPlayer(game.as(dash)).toHaveTokenCount("vigor", 0);
  });
});
