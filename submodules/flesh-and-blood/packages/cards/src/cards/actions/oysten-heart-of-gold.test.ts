import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { oystenHeartOfGoldYellow } from "./oysten-heart-of-gold.ts";

/**
 * Oysten, Heart of Gold (AGB017) — Pirate Necromancer Ally, 3{p}/1{h}.
 * Printed: Action - {t}: Attack. When this dies, create a Gold token. Watery Grave.
 */

describe("Oysten, Heart of Gold (AGB017) AAA", () => {
  it("happy: when this dies, create a Gold token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [oystenHeartOfGoldYellow],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const oysten = Dash.findCardInZone("arena", oystenHeartOfGoldYellow);

    game.as(bravo).attackWith(snatchRed, { target: oysten });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, oystenHeartOfGoldYellow).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveTokenCount("gold", 1);
  });

  it("boundary: attacking with this does not mint Gold while it lives", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [oystenHeartOfGoldYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(oystenHeartOfGoldYellow);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();

    expectFabCard(Bravo, oystenHeartOfGoldYellow).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveTokenCount("gold", 0);
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("timing: Watery Grave puts this in the graveyard, not banished", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [oystenHeartOfGoldYellow],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const oysten = Dash.findCardInZone("arena", oystenHeartOfGoldYellow);

    game.as(bravo).attackWith(snatchRed, { target: oysten });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, oystenHeartOfGoldYellow).toBeIn("graveyard");
  });
});
