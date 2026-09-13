import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { sigilOfDeadwoodBlue } from "./sigil-of-deadwood.ts";
import { runicFellingsongRed } from "./runic-fellingsong.ts";

/**
 * Runic Fellingsong (PEN100) — Runeblade Action - Attack, cost 3, 7{p}.
 *
 * Printed: When this attacks, you may banish an aura from your graveyard.
 * If you do, deal 1 arcane damage to target hero.
 */

describe("Runic Fellingsong (PEN100) AAA", () => {
  it("happy: banishing a GY aura deals 1 arcane to the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [runicFellingsongRed],
        graveyard: [sigilOfDeadwoodBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(runicFellingsongRed, { stopAt: "on-attack" });
    Viserai.targetRequired(Dash);
    game.advanceToDecision(Viserai, "boolean");
    Viserai.accept();
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();
    expectFabCard(Viserai, sigilOfDeadwoodBlue).toBeBanished();
  });

  it("boundary: empty GY does not open the banish boolean", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [runicFellingsongRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(runicFellingsongRed, { stopAt: "on-attack" });
    Viserai.targetRequired(Dash);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });

  it("timing: declining the banish deals no arcane ping", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [runicFellingsongRed],
        graveyard: [sigilOfDeadwoodBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(runicFellingsongRed, { stopAt: "on-attack" });
    Viserai.targetRequired(Dash);
    game.advanceToDecision(Viserai, "boolean");
    Viserai.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();
    expectFabCard(Viserai, sigilOfDeadwoodBlue).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });
});
