import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { healingPotionBlue } from "./healing-potion.ts";
import { smashingGoodTimeRed } from "./smashing-good-time.ts";

describe("Smashing Good Time (EVR170) AAA", () => {
  it("happy: the next attack action card hit may destroy an item they control with cost 2 or less", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [smashingGoodTimeRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], arena: [healingPotionBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(smashingGoodTimeRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.playAttack(snatchRed);
    game.closeCombat({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(game.as(bravo), healingPotionBlue).toBeIn("graveyard");
  });

  it("timing: played from arsenal, the next attack action gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        arsenal: [smashingGoodTimeRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.play(smashingGoodTimeRed, { from: "arsenal" });
    game.helpers.resolveUntilIdle();
    Dash.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: played from hand, the next attack action stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [smashingGoodTimeRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.play(smashingGoodTimeRed);
    game.helpers.resolveUntilIdle();
    Dash.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
  });
});
