import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { snatchRed } from "../actions/snatch.ts";
import { markOfTheBlackWidowRed } from "../actions/mark-of-the-black-widow.ts";
import { cintariSellsword } from "../tokens/cintari-sellsword.ts";
import { dash } from "./dash.ts";
import { taipanisDracaiOfJudgement } from "./taipanis-dracai-of-judgement.ts";

/**
 * Taipanis, Dracai of Judgement (JDG001) — Draconic Adjudicator Hero.
 *
 * Printed: "The first time each turn another hero becomes the target of a
 * source that would deal lethal damage, you may discard a red card. If you
 * do, choose new targets for that source."
 *
 * Lethal is compare-amount pending-damage-to-hero vs hero-property life
 * (Amulet of Intervention). Choose-new-targets is CR 1.8.5f.
 */

describe("Taipanis, Dracai of Judgement (JDG001) AAA", () => {
  it("happy: when another hero is targeted lethally, Taipanis retargets to a legal ally", () => {
    const game = FabTestEngine.start(
      {
        hero: taipanisDracaiOfJudgement,
        hand: [snatchRed, markOfTheBlackWidowRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arena: [cintariSellsword],
        life: 3,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Taipanis = game.as(taipanisDracaiOfJudgement);
    const Dash = game.as(dash);

    Taipanis.playAttack(snatchRed, { stopAt: "on-attack" });
    Taipanis.accept();
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(3);
    expectFabCard(Taipanis, markOfTheBlackWidowRed).toBeIn("graveyard");
    expect(Dash.zone("arena")).not.toContain(cintariSellsword.canonicalId);
  });

  it("boundary: Taipanis cannot use the ability to protect itself", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: taipanisDracaiOfJudgement,
        hand: [snatchRed],
        life: 3,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Taipanis = game.as(taipanisDracaiOfJudgement);

    Dash.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Taipanis).toHaveLife(0);
    expectFabCard(Taipanis, snatchRed).toBeIn("hand");
  });

  it("timing: first time each turn — a second lethal attack is not retargeted", () => {
    const game = FabTestEngine.start(
      {
        hero: taipanisDracaiOfJudgement,
        hand: [snatchRed, snatchRed, markOfTheBlackWidowRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        arena: [cintariSellsword],
        life: 3,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Taipanis = game.as(taipanisDracaiOfJudgement);
    const Dash = game.as(dash);

    Taipanis.playAttack(snatchRed, { stopAt: "on-attack" });
    Taipanis.accept();
    Taipanis.targetRequired(markOfTheBlackWidowRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(3);

    Taipanis.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(0);
  });
});
