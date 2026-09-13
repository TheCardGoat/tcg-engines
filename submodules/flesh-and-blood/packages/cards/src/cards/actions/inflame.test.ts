import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { inflameRed } from "./inflame.ts";

/**
 * Inflame (FAI011) — Draconic Action - Attack, cost 0, 1{p}/2{d}, go again.
 *
 * Printed: When you attack with Inflame, if you've played another red card
 * this turn, you may return a Phoenix Flame from your graveyard to your hand.
 */

describe("Inflame (FAI011) AAA", () => {
  it("happy: after another red this turn, may return Phoenix Flame from GY", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed, inflameRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(phoenixFlameRed);
    game.closeCombat();
    Fai.playAttack(inflameRed, { stopAt: "on-attack" });
    Fai.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat();

    expectFabCard(Fai, phoenixFlameRed).toBeIn("hand");
    expectFabCard(Fai, inflameRed).toBeIn("graveyard");
  });

  it("boundary: as the first red this turn, the return window does not open", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [inflameRed],
        graveyard: [phoenixFlameRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(inflameRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat();

    expectFabCard(Fai, phoenixFlameRed).toBeIn("graveyard");
  });

  it("timing: declining the return leaves Phoenix Flame in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed, inflameRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(phoenixFlameRed);
    game.closeCombat();
    Fai.playAttack(inflameRed, { stopAt: "on-attack" });
    Fai.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();

    expectFabCard(Fai, phoenixFlameRed).toBeIn("graveyard");
  });
});
