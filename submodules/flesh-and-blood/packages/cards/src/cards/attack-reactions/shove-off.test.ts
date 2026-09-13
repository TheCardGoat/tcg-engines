import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { bravo } from "../heroes/bravo.ts";
import { galaxxiBlack } from "../weapons/galaxxi-black.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { shoveOffBlue } from "./shove-off.ts";

/**
 * Shove Off Blue (MPW052) — Warrior Attack Reaction.
 *
 * Printed: Choose a non-equipment card defending a sword attack you
 * control. Return it to its owner's hand.
 */

describe("Shove Off (MPW052) AAA", () => {
  it("happy: the non-equipment defender of the sword swing returns to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [galaxxiBlack],
        hand: [shoveOffBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: kano, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Kano = game.as(kano);

    Bravo.activateAttack(galaxxiBlack);
    game.advanceUntil({ stopAt: "defend" });
    Kano.defendWith(nimblismBlue);
    game.toReaction("attacker");
    Bravo.play(shoveOffBlue);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: nimblismBlue.canonicalId,
    });
    game.helpers.resolveRestOfCombat();

    // The defending action card is bounced back to the defending hero's hand.
    expectFabCard(Kano, nimblismBlue).toBeIn("hand");
  });
});
