import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { snatchRed } from "./snatch.ts";
import { cinderskinDevotionRed } from "./cinderskin-devotion.ts";

/**
 * Cinderskin Devotion, Red (FAI016) — Draconic chain-link go again.
 *
 * Printed: "If you control 2 or more Draconic chain links, this gets go again."
 */

describe("Cinderskin Devotion (FAI016) AAA", () => {
  it("happy: as the third Draconic link this gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed, phoenixFlameRed, cinderskinDevotionRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(cinderskinDevotionRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    // Two 0{p} Phoenix Flames, the second +1{p} at 2 Draconic links, then 4{p}.
    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Fai).toHaveAP(1);
  });

  it("boundary: as the first link there is no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [cinderskinDevotionRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(cinderskinDevotionRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveAP(0);
  });

  it("timing: a Generic last attack plus this one Draconic link is not enough", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, cinderskinDevotionRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.must.playAttack(snatchRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(cinderskinDevotionRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveAP(0);
  });
});
