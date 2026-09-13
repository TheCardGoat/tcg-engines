import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { olympia } from "../heroes/olympia.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { upTheAnteBlue } from "./up-the-ante.ts";

/**
 * Up the Ante Blue (HVY103) — Olympia Warrior Attack Reaction.
 *
 * Printed: Choose X+1, where X is the number of times the attack has
 * wagered. Modes wager Agility / Gold / Vigor, or +Y{p} equal to times
 * wagered.
 */

describe("Up the Ante (HVY103) AAA", () => {
  it("happy: choosing Agility at 0 wagers, a hit wins that Agility", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        hand: [snatchRed, upTheAnteBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    Olympia.playAttack(snatchRed);
    game.toReaction();
    Olympia.must.playReaction(upTheAnteBlue, { modeIndexes: [0] });
    game.passBoth();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Olympia).toHaveTokenCount("agility", 1);
  });

  it("boundary: the +Y mode at 0 wagers does not raise {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        hand: [snatchRed, upTheAnteBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    Olympia.playAttack(snatchRed);
    game.toReaction();
    Olympia.must.playReaction(upTheAnteBlue, { modeIndexes: [3] });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: still defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: olympia,
        hand: [upTheAnteBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Olympia = game.as(olympia);

    Dash.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Olympia.defendWith(upTheAnteBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Olympia, upTheAnteBlue).toBeIn("graveyard");
    expectFabPlayer(Olympia).toHaveLife(19);
  });
});
