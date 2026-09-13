import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { cheersBlue } from "./cheers.ts";
import { empoweringRuckusYellow } from "./empowering-ruckus.ts";

/**
 * Empowering Ruckus (SUP039) — Revered Action - Attack, cost 3, 6{p}, 3{d}.
 *
 * Printed: "If you've been cheered this turn, this gets +1{p}."
 *
 * `been-cheered-this-turn` is handled (crowdCheered turn fact). Cheers! is
 * the cheer vehicle — it does not latch +{p} onto the next attack.
 */

describe("Empowering Ruckus (SUP039) AAA", () => {
  it("happy: after a same-turn cheer, this attacks at 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [cheersBlue, empoweringRuckusYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(cheersBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Tuffnut.playAttack(empoweringRuckusYellow);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(7);
    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 1);
  });

  it("boundary: without a cheer this turn, this stays at printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [empoweringRuckusYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.playAttack(empoweringRuckusYellow);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: tuffnut, hand: [empoweringRuckusYellow], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Tuffnut.defendWith([empoweringRuckusYellow]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Tuffnut).toHaveLife(19);
    expectFabCard(Tuffnut, empoweringRuckusYellow).toBeIn("graveyard");
  });
});
