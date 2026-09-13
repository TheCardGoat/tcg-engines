import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "./snatch.ts";
import { alphaRampageRed } from "./alpha-rampage.ts";
import { bloodrushBellowYellow } from "./bloodrush-bellow.ts";
import { beastModeRed } from "./beast-mode.ts";

/**
 * Beast Mode (RVD009) — Brute Action - Attack, cost 3, 6{p}, 3{d}.
 *
 * Printed: "If you've intimidated this turn, this gets +2{p}."
 *
 * Same trapdoor as HVY018/019 (`intimidated-this-turn`). Trade In (UPR214)
 * discarding a 6+{p} card fires Rhinar's intimidate. Pin the throw in both
 * directions; keep the 3{d} block fragment.
 */

describe("Beast Mode (RVD009) AAA", () => {
  it("happy: after a same-turn 6+{p} intimidate, this gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bloodrushBellowYellow, alphaRampageRed],
        resourcePoints: 4,
        actionPoints: 2,
        deckTop: [beastModeRed, snatchRed],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(bloodrushBellowYellow);
    game.helpers.resolveUntilIdle();
    Rhinar.attackWith(beastModeRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(10);
  });

  it("boundary: without intimidating this turn, this stays printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [beastModeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(beastModeRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: rhinar, hand: [beastModeRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Rhinar = game.as(rhinar);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Rhinar.defendWith([beastModeRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Rhinar).toHaveLife(19);
    expectFabCard(Rhinar, beastModeRed).toBeIn("graveyard");
  });
});
