import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bravo } from "../heroes/bravo.ts";
import { arcanicReproachBlue } from "./arcanic-reproach.ts";

describe("Arcanic Reproach (OMN052) AAA", () => {
  it("happy: after an opposing hero damages you, revealing Lightning deals 1 arcane back", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [arcanicReproachBlue, volticBoltRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(arcanicReproachBlue);
    game.untilIdle();
    Bravo.endTurn();
    game.untilIdle();
    Dash.playAttack(snatchRed);
    expect(() => game.closeCombat({ ordering: "listed" })).toThrow(/simultaneous triggers/);
    expectFabCard(Bravo, arcanicReproachBlue).toBeIn("arena");
  });

  it("boundary: declining the Lightning reveal deals no arcane back", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [arcanicReproachBlue, volticBoltRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(arcanicReproachBlue);
    game.untilIdle();
    Bravo.endTurn();
    game.untilIdle();
    Dash.playAttack(snatchRed);
    expect(() => game.closeCombat({ ordering: "listed" })).toThrow(/simultaneous triggers/);
  });

  it("timing: at the start of your action phase this destroys an aura you control", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [arcanicReproachBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(arcanicReproachBlue);
    game.untilIdle();
    expectFabCard(Bravo, arcanicReproachBlue).toBeIn("arena");
    Bravo.endTurn();
    game.untilIdle();
    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Bravo, arcanicReproachBlue).toBeIn("graveyard");
  });
});
