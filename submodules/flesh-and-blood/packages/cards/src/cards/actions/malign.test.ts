import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { fang } from "../heroes/fang.ts";
import { moonChakraRed } from "../instants/moon-chakra.ts";
import { malignRed } from "./malign.ts";

/**
 * Malign Red (ARA010) — Assassin Attack Action. Stealth.
 *
 * Printed: Damage that would be dealt by Malign can't be prevented.
 */

describe("Malign (ARA010) AAA", () => {
  it("happy: a shielded prevent-3 does not reduce Malign's damage", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [malignRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [moonChakraRed], resourcePoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Bravo = game.as(bravo);

    Fang.playAttack(malignRed);
    game.advanceCombatTo("reaction");
    Fang.pass();
    // Bravo shields 3 of the incoming hit — printed says it can't prevent.
    Bravo.play(moonChakraRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(17); // 20 - 3, unprevented
  });
});
