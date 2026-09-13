import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prismAwakenerOfSol } from "../heroes/prism-awakener-of-sol.ts";
import { shimmeringSpecterRed } from "./shimmering-specter.ts";

describe("Shimmering Specter (PEN133) AAA", () => {
  it("happy: leaving the arena while attacking creates a Spectral Shield", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        hand: [shimmeringSpecterRed],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.playAttack(shimmeringSpecterRed);
    game.closeCombat();
    game.untilIdle();

    expectFabCard(Prism, shimmeringSpecterRed).toBeIn("graveyard");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 1);
  });

  it("boundary: the defending hero does not receive Spectral Shield", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        hand: [shimmeringSpecterRed],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(prismAwakenerOfSol).playAttack(shimmeringSpecterRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("spectral-shield", 0);
  });

  it("timing: Spectral Shield is not created before the attack leaves the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        hand: [shimmeringSpecterRed],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.playAttack(shimmeringSpecterRed, { stopAt: "defend" });

    expectFabCard(Prism, shimmeringSpecterRed).toBeIn("combatChain");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
  });
});
