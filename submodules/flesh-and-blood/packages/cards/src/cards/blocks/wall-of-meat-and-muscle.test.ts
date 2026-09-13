import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { wallOfMeatAndMuscleRed } from "./wall-of-meat-and-muscle.ts";

/**
 * Wall of Meat and Muscle (HVY142) — Brute / Guardian Block, 3{d}.
 *
 * Printed: "When this defends, if you control a Might token, you may put an
 * attack action card from your graveyard on top of your deck."
 */

describe("Wall of Meat and Muscle (HVY142) AAA", () => {
  it("happy: with a Might token, an attack action from the graveyard goes on top of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [wallOfMeatAndMuscleRed],
        graveyard: [snatchRed],
        arena: [fabToken("might")],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(wallOfMeatAndMuscleRed);
    game.closeCombat({ optionals: "accept", ordering: "listed" });

    expectFabCard(Dash, Dash.cardIn("deck", snatchRed)).toBeIn("deck");
    expectFabPlayer(Dash).toHaveLife(19); // 4 vs 3{d}
  });

  it("boundary: without a Might token the optional does not open", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [wallOfMeatAndMuscleRed],
        graveyard: [snatchRed],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(wallOfMeatAndMuscleRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(19);
  });
});
