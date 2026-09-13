import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rawMeat } from "./raw-meat.ts";

/**
 * Raw Meat (HVY011) — Brute Chest d0, Temper.
 * Printed: "If you control an Agility token, this gets +1{d}.
 *           If you control a Might token, this gets +1{d}.
 *           Temper"
 */

describe("Raw Meat (HVY011) AAA", () => {
  it("happy: with an Agility and a Might token the meat defends for 2", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: rhinar,
        life: 20,
        chest: [rawMeat],
        arena: [fabToken("agility"), fabToken("might")],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Rhinar = game.as(rhinar);

    Fai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Rhinar.defendWith(rawMeat);
    expectFabCard(Rhinar, rawMeat).toHaveDefense(2); // 0 base + 1 Agility + 1 Might
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Rhinar).toHaveLife(18); // 20 - (4 - 2)
  });

  it("boundary: with no tokens the meat keeps its printed 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: rhinar, life: 20, chest: [rawMeat], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Rhinar = game.as(rhinar);

    Fai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Rhinar.defendWith(rawMeat);
    expectFabCard(Rhinar, rawMeat).toHaveDefense(0);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Rhinar).toHaveLife(16); // 20 - 4
  });

  it("timing: a single Might token gives +1{d}, and Temper then destroys the 0{d} meat", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: rhinar,
        life: 20,
        chest: [rawMeat],
        arena: [fabToken("might")],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Rhinar = game.as(rhinar);

    Fai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Rhinar.defendWith(rawMeat);
    expectFabCard(Rhinar, rawMeat).toHaveDefense(1); // 0 base + 1 Might
    game.helpers.resolveRestOfCombat();

    // Temper: after defending, the meat's defence is 1 - 1 = 0 → destroyed.
    expectFabCard(Rhinar, rawMeat).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveLife(17); // 20 - (4 - 1)
  });
});
