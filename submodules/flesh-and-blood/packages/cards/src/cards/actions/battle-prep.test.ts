import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { battlePrepRed } from "./battle-prep.ts";
import { valiantThrustRed } from "./valiant-thrust.ts";

/**
 * Battle Prep (IAR233) — Generic Action, cost 0, Opt 2, go again.
 *
 * Printed: "Opt 2\nIf this was played from arsenal, your next attack this turn
 * gets +3{p}.\nGo again" (red)
 */

describe("Battle Prep (IAR233) AAA", () => {
  it("happy: played from arsenal it arms +3 on the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arsenal: [battlePrepRed],
        hand: [valiantThrustRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(battlePrepRed, { from: "arsenal", optBottom: 2 });
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(valiantThrustRed, { optionals: "decline" });

    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabCard(Bravo, battlePrepRed).toBeIn("graveyard");
  });

  it("boundary: played from hand the next attack keeps its printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [battlePrepRed, valiantThrustRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(battlePrepRed, { optBottom: 2 });
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(valiantThrustRed, { optionals: "decline" });

    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(16);
  });
});
