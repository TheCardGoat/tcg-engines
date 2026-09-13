import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { laceWithBloodrotRed } from "./lace-with-bloodrot.ts";

/**
 * Lace with Bloodrot (OUT112) — Ranger Action, cost 0, go again.
 *
 * Printed: Your next arrow attack this turn gains +3{p} and "When this hits a
 * hero, create a Bloodrot Pox token under their control."
 */

describe("Lace with Bloodrot (OUT112) AAA", () => {
  it("happy: the next arrow gets +3{p} and a hit creates Bloodrot Pox under their control", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [laceWithBloodrotRed],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(laceWithBloodrotRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);
    expectFabCard(Azalea, laceWithBloodrotRed).toBeIn("graveyard");

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // Searing Shot 4 + 3, plus its printed lose 1{h} on hit.
    expectFabPlayer(Dash).toHaveLife(12);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 1);
  });

  it("boundary: a non-arrow attack played after Lace with Bloodrot gets no +3", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [laceWithBloodrotRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(laceWithBloodrotRed);
    game.helpers.resolveUntilIdle();

    Azalea.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 0);
  });

  it("timing: go again refunds the action point; the token is created only after the arrow hits", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [laceWithBloodrotRed],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(laceWithBloodrotRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 0);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(7);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 0);

    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 1);
  });
});
