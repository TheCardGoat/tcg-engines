import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { arakni } from "../heroes/arakni.ts";
import { huntToTheEndsOfRatheRed } from "./hunt-to-the-ends-of-rathe.ts";

/**
 * Hunt to the Ends of Rathe (CIN015) — Draconic Action Attack, 2{p}/2{d}.
 *
 * Printed: When this attacks Arakni, mark them.
 * If this is attacking a marked hero, this gets +2{p}.
 * Go again
 */

describe("Hunt to the Ends of Rathe (CIN015) AAA", () => {
  it("happy: attacking Arakni marks them and this gets +2{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [huntToTheEndsOfRatheRed], actionPoints: 1, deck: 6 },
      { hero: arakni, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(huntToTheEndsOfRatheRed);
    game.advanceUntil({ stopAt: "defend" });

    expectFabPlayer(game.as(arakni)).toBeMarked();
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(game.as(arakni)).toHaveLife(16);
    expectFabPlayer(game.as(bravo)).toHaveAP(1);
  });

  it("boundary: attacking a non-Arakni unmarked hero stays at 2{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [huntToTheEndsOfRatheRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(huntToTheEndsOfRatheRed);
    game.advanceUntil({ stopAt: "defend" });

    expectFabPlayer(game.as(dash)).notToBeMarked();
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("timing: attacking an already-marked non-Arakni still gets +2{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [huntToTheEndsOfRatheRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(huntToTheEndsOfRatheRed);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
