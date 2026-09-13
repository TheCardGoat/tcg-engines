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
import { canopyShelterBlue } from "./canopy-shelter.ts";

describe("Canopy Shelter (TER027) AAA", () => {
  it("happy: defending with this creates a Might token for the defending hero", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: bravo, hand: [canopyShelterBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(canopyShelterBlue);
    game.passBoth();

    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 0);
    expectFabCard(Bravo, canopyShelterBlue).toBeIn("combatChain");
  });

  it("boundary: this does not create a Might token when it does not defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: bravo, hand: [canopyShelterBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith();
    game.passBoth();

    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
    expectFabCard(Bravo, canopyShelterBlue).toBeIn("hand");
  });

  it("timing: Might is created on defend, before chain close", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: bravo, hand: [canopyShelterBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(canopyShelterBlue);
    game.passBoth();

    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
    expectFabCard(Bravo, canopyShelterBlue).toBeIn("combatChain");

    game.closeCombat();
    expectFabCard(Bravo, canopyShelterBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
  });
});
