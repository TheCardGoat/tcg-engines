import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { snatchRed } from "./snatch.ts";
import { stingingSpriteRed } from "./stinging-sprite.ts";

/**
 * Stinging Sprite (OMN056) — Lightning Runeblade Attack, cost 0, 3{p}.
 *
 * Printed: When this attacks or defends, deal 1 arcane damage to target hero.
 */

describe("Stinging Sprite (OMN056) AAA", () => {
  it("happy: deals 1 arcane on attack plus 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [stingingSpriteRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(stingingSpriteRed, { stopAt: "on-attack" });
    Viserai.target(Dash);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: combat damage is still printed 3{p} after the ping", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [stingingSpriteRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(stingingSpriteRed, { stopAt: "on-attack" });
    Viserai.target(game.as(dash));
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: defending with this also deals 1 arcane before combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: viserai,
        hand: [stingingSpriteRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);

    Dash.playAttack(snatchRed, { stopAt: "defend" });
    Viserai.defendWith(stingingSpriteRed);
    Viserai.target(Dash);
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(19);
    expectCombat(game).toBeOpen();
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Viserai).toHaveLife(18);
  });
});
