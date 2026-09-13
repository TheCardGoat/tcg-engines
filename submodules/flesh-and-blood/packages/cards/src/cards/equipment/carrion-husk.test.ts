import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { carrionHusk } from "./carrion-husk.ts";

/**
 * Carrion Husk (MON187) — Shadow Chest d6, Blood Debt.
 * Printed: "If you defend with Carrion Husk, banish it when the combat chain
 * closes. At the start of your turn, if you have 13 or less {h}, banish
 * Carrion Husk. Blood Debt"
 */

describe("Carrion Husk (MON187) AAA", () => {
  it("happy: defending with the husk banishes it when the chain closes", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: viserai, chest: [carrionHusk], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    game.as(dash).playAttack(snatchRed);
    Viserai.defendWith(carrionHusk);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Viserai).toHaveLife(20);
    expectFabCard(Viserai, carrionHusk).toBeBanished();
  });

  it("boundary: without defending, the husk stays equipped", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: viserai, chest: [carrionHusk], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    game.as(dash).playAttack(snatchRed);
    Viserai.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Viserai).toHaveLife(16);
    expectFabCard(Viserai, carrionHusk).toBeIn("chest");
  });

  it("timing: at 13 or less life the husk banishes at your start phase, then Blood Debt ticks", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      { hero: viserai, chest: [carrionHusk], hand: [], life: 13, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: viserai },
    );
    const Viserai = game.as(viserai);

    game.as(viserai).endTurn();
    game.as(dash).endTurn();
    game.untilIdle({ ordering: "listed" });

    // Start of Viserai's turn with 13 {h}: printed self-banish.
    expectFabCard(Viserai, carrionHusk).toBeBanished();

    // Blood Debt on the banished husk drains 1 at the end phase.
    game.as(viserai).endTurn();
    expectFabPlayer(Viserai).toHaveLife(12);
  });
});
