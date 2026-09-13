import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { searingShotRed } from "./searing-shot.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { settleTheBillRed } from "./settle-the-bill.ts";

/**
 * Settle the Bill Red (OMN237) — Ranger Action. Go again.
 *
 * Printed: You may put an arrow from your hand face-up into your arsenal.
 * If you do, until end of turn, it gets +3{p} and "When this hits a hero,
 * destroy a card in their arsenal."
 */

describe("Settle the Bill (OMN237) AAA", () => {
  it("happy: the stocked arrow swings this turn at +3{p} and empties their arsenal on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [settleTheBillRed, searingShotRed],
        weapon1: [deathDealer],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(settleTheBillRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: searingShotRed.canonicalId,
    });

    // The arrow is face-up in the arsenal, carrying the buff until end of turn.
    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");
    expectFabCard(Azalea, searingShotRed).toBeFaceUp();

    Azalea.playFromArsenal(searingShotRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7); // 4 + 3
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });

    // 7 attack + Searing Shot's own "they lose 1{h}" rider; arsenal destroyed.
    expectFabPlayer(Dash).toHaveLife(12); // 20 - 7 - 1
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
    expect(Azalea.zone("arsenal")).toHaveLength(0);
  });

  it("boundary: declining leaves the arrow in hand and the arsenal empty", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [settleTheBillRed, searingShotRed],
        weapon1: [deathDealer],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(settleTheBillRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Azalea, searingShotRed).toBeIn("hand");
    expect(Azalea.zone("arsenal")).toHaveLength(0);
  });
});
