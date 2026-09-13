import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { unyieldingGrip } from "./unyielding-grip.ts";

describe("Unyielding Grip (PEN317) AAA", () => {
  it("happy: empty hand gives this +3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, arms: [unyieldingGrip], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, unyieldingGrip).toHaveDefense(3);
    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(unyieldingGrip);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(19);
    expectFabCard(Bravo, unyieldingGrip).toBeIn("graveyard");
  });

  it("boundary: a card in hand keeps printed d0", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [unyieldingGrip], hand: [nimblismBlue], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(bravo), unyieldingGrip).toHaveDefense(0);
    expectFabCard(game.as(bravo), unyieldingGrip).toHaveKeyword("blade-break");
  });
});
