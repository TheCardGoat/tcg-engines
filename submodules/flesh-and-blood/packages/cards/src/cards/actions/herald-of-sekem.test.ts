import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { headShotYellow } from "../shared/test-recipients.ts";
import { heraldOfSekemRed } from "./herald-of-sekem.ts";

/**
 * Herald of Sekem (SEA260) — Light Illusionist Action - Attack, cost 2, 7{p}, phantasm.
 *
 * Printed: When this attacks, you may put a yellow card from your hand into
 * your soul. If you do, deal 2 arcane damage to any target.
 */

describe("Herald of Sekem (SEA260) AAA", () => {
  it("happy: putting a yellow card into soul deals 2 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfSekemRed, headShotYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfSekemRed, { stopAt: "on-attack" });
    Prism.targetRequired(Dash);
    game.advanceToDecision(Prism, "boolean");
    Prism.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();
    expectFabCard(Prism, headShotYellow).toBeIn("soul");
    expectFabPlayer(Dash).toHaveLife(11);
  });

  it("boundary: with no yellow card, no arcane ping", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfSekemRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfSekemRed, { stopAt: "on-attack" });
    Prism.targetRequired(Dash);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });

  it("timing: declining leaves the yellow card in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfSekemRed, headShotYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfSekemRed, { stopAt: "on-attack" });
    Prism.targetRequired(Dash);
    game.advanceToDecision(Prism, "boolean");
    Prism.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();
    expectFabCard(Prism, headShotYellow).toBeIn("hand");
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });
});
