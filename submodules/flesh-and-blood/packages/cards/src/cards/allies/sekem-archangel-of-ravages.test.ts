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
import { nimblismBlue } from "../actions/nimblism.ts";
import { sekemArchangelOfRavages } from "./sekem-archangel-of-ravages.ts";

/**
 * Sekem, Archangel of Ravages (DTD008) — Light Angel Ally 4{p}/4{h}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack
 *   When Sekem attacks, you may banish a card from your hero's soul. If you do,
 *   deal 2 arcane damage to any target.
 *   Ward 4
 */

describe("Sekem, Archangel of Ravages (DTD008) AAA", () => {
  it("happy: soul banish deals 2 arcane to the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [sekemArchangelOfRavages],
        soul: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);
    const Dash = game.as(dash);

    Prism.activateAttack(sekemArchangelOfRavages, { stopAt: "on-attack" });
    Prism.targetRequired(Dash);
    game.advanceToDecision(Prism, "boolean");
    Prism.accept();
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Prism, nimblismBlue).toBeIn("banished");
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("boundary: declining soul banish deals no arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [sekemArchangelOfRavages],
        soul: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);
    const Dash = game.as(dash);

    Prism.activateAttack(sekemArchangelOfRavages, {
      stopAt: "on-attack",
      optionals: "throw",
      entityTargets: "pause",
    });
    Prism.targetRequired(Dash);
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });

    expectFabCard(Prism, nimblismBlue).toBeIn("soul");
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: once-per-turn Attack cannot activate a second time this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [sekemArchangelOfRavages],
        soul: [nimblismBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(sekemArchangelOfRavages, {
      stopAt: "on-attack",
      optionals: "throw",
      entityTargets: "pause",
    });
    Prism.targetRequired(game.as(dash));
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    game.closeCombat();

    Prism.expectActivationRejected(sekemArchangelOfRavages);
    expectFabCard(Prism, sekemArchangelOfRavages).toBeIn("arena");
  });
});
