import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { aGoodCleanFightRed } from "./a-good-clean-fight.ts";

/**
 * A Good Clean Fight (SUP021) — Revered Action - Attack, 7{p} 3{d} cost 3.
 *
 * Printed: If this is attacking a hero, non-equipment cards they own lose and
 * can't gain abilities.
 */

describe("A Good Clean Fight (SUP021) AAA", () => {
  it("attacking a hero deals 7 and resolves without an unhandled marker", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [aGoodCleanFightRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.playAttack(aGoodCleanFightRed);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Tuffnut, aGoodCleanFightRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("boundary: still resolves for 7 when the defending hero has no permanents", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [aGoodCleanFightRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.playAttack(aGoodCleanFightRed);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Tuffnut, aGoodCleanFightRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: tuffnut, hand: [aGoodCleanFightRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Tuffnut.defendWith(aGoodCleanFightRed);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Tuffnut).toHaveLife(19);
    expectFabCard(Tuffnut, aGoodCleanFightRed).toBeIn("graveyard");
  });
});
