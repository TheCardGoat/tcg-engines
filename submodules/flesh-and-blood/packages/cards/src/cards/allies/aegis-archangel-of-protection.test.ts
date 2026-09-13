import { describe, expect, it } from "vitest";
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
import { aegisArchangelOfProtection } from "./aegis-archangel-of-protection.ts";

/**
 * Aegis, Archangel of Protection (DTD007) — Light Angel Ally 4{p}/4{h}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack
 *   When Aegis attacks, you may banish a card from your hero's soul. If you do,
 *   create 2 Spectral Shield tokens.
 *   Ward 4
 */

describe("Aegis, Archangel of Protection (DTD007) AAA", () => {
  it("happy: soul banish creates 2 Spectral Shield tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [aegisArchangelOfProtection],
        soul: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(aegisArchangelOfProtection, {
      optionals: "accept",
      entityTargets: "minimum",
    });
    expectCombat(game).toHaveAttackPower(4);

    expectFabCard(Prism, nimblismBlue).toBeIn("banished");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 2);
  });

  it("boundary: declining soul banish creates no Spectral Shields", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [aegisArchangelOfProtection],
        soul: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(aegisArchangelOfProtection, { optionals: "decline" });

    expectFabCard(Prism, nimblismBlue).toBeIn("soul");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
  });

  it("timing: once-per-turn Attack cannot activate a second time this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [aegisArchangelOfProtection],
        soul: [nimblismBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(aegisArchangelOfProtection, { optionals: "decline" });
    game.closeCombat();

    expect(() => Prism.activateAttack(aegisArchangelOfProtection)).toThrow();
    expectFabCard(Prism, aegisArchangelOfProtection).toBeIn("arena");
  });
});
