import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { brandWithCinderclawRed } from "./brand-with-cinderclaw.ts";
import { nimblismBlue } from "./nimblism.ts";
import { artOfTheDragonClawRed } from "./art-of-the-dragon-claw.ts";

/**
 * Art of the Dragon: Claw (HNT074) — Ninja Action - Attack, cost 1, 5{p}.
 *
 * Printed: When this attacks, if it is Draconic, it gets "When this hits a
 * hero, destroy all cards in their arsenal."
 */

describe("Art of the Dragon: Claw (HNT074) AAA", () => {
  it("happy: Draconic hit destroys the defending hero's arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, artOfTheDragonClawRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(brandWithCinderclawRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(artOfTheDragonClawRed);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("boundary: without Draconic a hit leaves arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [artOfTheDragonClawRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(artOfTheDragonClawRed);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("timing: the grant is on-attack; arsenal is still there at Defend", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, artOfTheDragonClawRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(brandWithCinderclawRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(artOfTheDragonClawRed);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toBeOpen();
    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
    game.closeCombat({ ordering: "listed" });
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
  });
});
