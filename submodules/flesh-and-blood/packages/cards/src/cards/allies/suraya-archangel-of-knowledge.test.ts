import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prismAwakenerOfSol } from "../heroes/prism-awakener-of-sol.ts";
import { heraldOfProtectionRed } from "../actions/herald-of-protection.ts";
import { surayaArchangelOfKnowledge } from "./suraya-archangel-of-knowledge.ts";

/**
 * Suraya, Archangel of Knowledge (DYN212) — Light Illusionist Angel Ally.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack.
 *   Whenever Suraya attacks, you may banish a Light card from your hero's soul.
 *   If you do, Suraya deals 1 arcane damage to any target.
 *   Whenever Suraya deals damage, you gain that much {h}.
 */

describe("Suraya, Archangel of Knowledge (DYN212) AAA", () => {
  it("happy: attacking may banish a Light soul card to deal 1 arcane and gain 1 life", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [surayaArchangelOfKnowledge],
        soul: [heraldOfProtectionRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);
    const Dash = game.as(dash);

    Prism.activateAttack(surayaArchangelOfKnowledge, {
      stopAt: "on-attack",
      optionals: "throw",
      entityTargets: "pause",
    });
    Prism.targetRequired(Dash);
    game.advanceToDecision(Prism, "boolean");
    Prism.chooseBoolean(true);
    game.advanceUntil({ stopAt: "defend", optionals: "accept", entityTargets: "minimum" });

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Prism, heraldOfProtectionRed).toBeIn("banished");
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Prism).toHaveLife(21);
  });

  it("boundary: declining keeps the Light card in soul and deals no arcane damage", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [surayaArchangelOfKnowledge],
        soul: [heraldOfProtectionRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);
    const Dash = game.as(dash);

    Prism.activateAttack(surayaArchangelOfKnowledge, {
      stopAt: "on-attack",
      optionals: "throw",
      entityTargets: "pause",
    });
    Prism.targetRequired(Dash);
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Prism, heraldOfProtectionRed).toBeIn("soul");
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Prism).toHaveLife(20);
  });

  it("timing: the attack ability can be activated only once each turn", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [surayaArchangelOfKnowledge],
        soul: [heraldOfProtectionRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(surayaArchangelOfKnowledge, {
      stopAt: "on-attack",
      optionals: "throw",
      entityTargets: "pause",
    });
    Prism.targetRequired(game.as(dash));
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    game.closeCombat();

    Prism.expectActivationRejected(surayaArchangelOfKnowledge);
    expectFabCard(Prism, surayaArchangelOfKnowledge).toBeIn("arena");
  });
});
