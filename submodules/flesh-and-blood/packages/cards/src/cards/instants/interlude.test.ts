import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { melodySingAlong } from "../heroes/melody-sing-along.ts";
import { interludeRed } from "./interlude.ts";

describe("Interlude AAA", () => {
  it("happy: preventing 3 to another hero creates a Copper token", () => {
    const game = FabTestEngine.start(
      {
        hero: melodySingAlong,
        hand: [interludeRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);
    const Dash = game.as(dash);

    Melody.play(interludeRed, { target: Dash });
    game.passBoth();

    Melody.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Melody).toHaveTokenCount("copper", 1);
    expectFabCard(Melody, interludeRed).toBeIn("graveyard");
  });

  it("boundary: preventing damage to yourself does not create Copper", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: melodySingAlong,
        hand: [interludeRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);

    game.as(dash).playAttack(snatchRed);
    game.toReaction("defender");
    Melody.play(interludeRed, { target: Melody });
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Melody).toHaveLife(19);
    expectFabPlayer(Melody).toHaveTokenCount("copper", 0);
  });

  it("timing: with no damage this turn, no Copper is created", () => {
    const game = FabTestEngine.start(
      {
        hero: melodySingAlong,
        hand: [interludeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);

    Melody.play(interludeRed, { target: game.as(dash) });
    game.helpers.resolveUntilIdle();

    expectFabCard(Melody, interludeRed).toBeIn("graveyard");
    expectFabPlayer(Melody).toHaveTokenCount("copper", 0);
  });
});
