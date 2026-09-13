import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { standTallYellow } from "./stand-tall.ts";

/**
 * Stand Tall (MPW037) — Warrior Block, 3{d}.
 *
 * Printed: "While this is defending, whenever the attacking hero plays or
 * activates a reaction this chain link, this gets +2{d}."
 *
 * The reaction-triggered +2{d} leg cannot be driven through public moves
 * (recorded as gap trigger/stand-tall-reaction-play-boost-never-declares);
 * this suite proves the printed 3{d} defense through play.
 */

describe("Stand Tall (MPW037) AAA", () => {
  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [standTallYellow], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    Dash.defendWith(standTallYellow);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 4 power vs 3{d} — 1 damage.
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Dash, standTallYellow).toBeIn("graveyard");
  });
});
