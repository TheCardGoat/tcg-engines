import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { cloakOfDarkness } from "./cloak-of-darkness.ts";

/**
 * Cloak of Darkness (DTD166) — Shadow Equipment Chest.
 *
 * Printed: If your hero would be dealt damage, you may banish this to prevent
 * 2 of that damage. Blood Debt
 */

describe("Cloak of Darkness (DTD166) AAA", () => {
  it("happy: you may banish this from chest to prevent 2 of the damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { hero: viserai, chest: [cloakOfDarkness], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    game.as(dash).playAttack(snatchRed);
    Viserai.defendWith();
    game.closeCombat({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Viserai).toHaveLife(18);
    expectFabCard(Viserai, cloakOfDarkness).toBeBanished();
  });

  it("boundary: declining the banish lets the full damage through and this stays equipped", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { hero: viserai, chest: [cloakOfDarkness], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    game.as(dash).playAttack(snatchRed);
    Viserai.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Viserai).toHaveLife(16);
    expectFabCard(Viserai, cloakOfDarkness).toBeIn("chest");
  });

  it("timing: Blood Debt drains 1 life at the end phase while this is banished", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [],
        banished: [cloakOfDarkness],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(viserai).endTurn();
    expectFabPlayer(game.as(viserai)).toHaveLife(19);
  });
});
