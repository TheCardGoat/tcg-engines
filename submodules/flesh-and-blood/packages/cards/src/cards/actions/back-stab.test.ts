import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { fang } from "../heroes/fang.ts";
import { sinkBelowRed } from "../defense-reactions/sink-below.ts";
import { backStabRed } from "./back-stab.ts";

/**
 * Back Stab Red (OUT015) — Assassin Attack Action. Stealth.
 *
 * Printed: Defense reaction cards can't be played this chain link.
 */

describe("Back Stab (OUT015) AAA", () => {
  it("happy: the stealth hit lands and the defense reaction is barred", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [backStabRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [sinkBelowRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Bravo = game.as(bravo);

    Fang.playAttack(backStabRed);
    game.advanceCombatTo("reaction");
    Fang.pass();

    // Printed: DRs can't be played this chain link — the play rejects.
    expect(() => Bravo.play(sinkBelowRed)).toThrow(/reject|can't|cannot/i);
    expectFabCard(Bravo, sinkBelowRed).toBeIn("hand");

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(17); // 20 - 3
  });
});
