import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBaseLegs } from "../equipment/teklo-base-legs.ts";
import { evoZipLineYellow } from "./evo-zip-line.ts";

/**
 * Evo Zip Line (EVO053) — Mechanologist Instant Evo Legs.
 *
 * Printed: If you have a base legs equipped, transform it into this, then
 * equip this. When this is equipped, up to 1 target attack gets go again.
 */

describe("Evo Zip Line (EVO053) AAA", () => {
  it("happy: transforming base legs equips this and the attack gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        legs: [tekloBaseLegs],
        hand: [snatchRed, evoZipLineYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(snatchRed);
    game.toReaction("attacker");
    Teklo.play(evoZipLineYellow);
    game.untilIdle({ entityTargets: "pause" });
    Teklo.target(snatchRed);

    expectFabCard(Teklo, evoZipLineYellow).toBeIn("legs");
    expect(Teklo.zone("legs")).not.toContain(tekloBaseLegs.canonicalId);
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat();
    expectFabPlayer(Teklo).toHaveAP(1);
  });

  it("boundary: without a base legs this does not enter the legs slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoZipLineYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoZipLineYellow);
    game.helpers.resolveUntilIdle();

    expect(Teklo.zone("legs")).not.toContain(evoZipLineYellow.canonicalId);
    expectFabCard(Teklo, evoZipLineYellow).toBeIn("graveyard");
  });

  it("timing: declining the up-to attack leaves the chain without go again", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        legs: [tekloBaseLegs],
        hand: [snatchRed, evoZipLineYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(snatchRed);
    game.toReaction("attacker");
    Teklo.play(evoZipLineYellow);
    game.passBoth();
    Teklo.target();

    expectFabCard(Teklo, evoZipLineYellow).toBeIn("legs");
    expectCombat(game).notToHaveKeyword("go-again");
  });
});
