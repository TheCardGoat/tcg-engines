import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "./bravo.ts";
import { cintariSellsword } from "../tokens/cintari-sellsword.ts";
import { forgedForWarYellow } from "../actions/forged-for-war.ts";
import { snatchRed } from "../actions/snatch.ts";
import { scabskinLeathers } from "../equipment/scabskin-leathers.ts";
import { reyaTheUnyielding } from "./reya-the-unyielding.ts";

/**
 * Reya, the Unyielding (SMP005) — Guardian Hero - Pit-Fighter, 21hp.
 *
 * Printed: "Block cards you own and equipment you control with 1 or greater
 * {d} get protect.\nWhenever you protect another hero, create a Gold token."
 *
 * Rules: CR 8.3.31 protect — a defender carrying protect commits a protect
 * event when it defends for a target other than its controller's hero; the
 * event is observable end-to-end through the a2 Gold mint (proven by the
 * trigger-protect golden for printed protect; these tests prove the a1
 * grant-property leg — Forged for War has no printed protect).
 */

describe("Reya, the Unyielding (SMP005) AAA", () => {
  it("happy: a 3{d} hand card without printed protect still fires protect when defending an ally, minting Gold", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: reyaTheUnyielding,
        life: 21,
        arena: [cintariSellsword],
        hand: [forgedForWarYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Reya = game.as(reyaTheUnyielding);
    const allyId = Reya.findCardInZone("arena", cintariSellsword);

    // Bravo attacks the ally; Reya blocks with Forged for War (3{d}) — the
    // a1 grant-property leg is the only source of protect on that card.
    Bravo.attackWith(snatchRed, { target: allyId });
    Reya.defendWith(forgedForWarYellow);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Reya).toHaveTokenCount("gold", 1);
  });

  it("equipment leg: blocking with a 2{d} equipped chest fires protect on an ally defense", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: reyaTheUnyielding,
        life: 21,
        arena: [cintariSellsword],
        chest: [scabskinLeathers],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Reya = game.as(reyaTheUnyielding);
    const allyId = Reya.findCardInZone("arena", cintariSellsword);

    // The a1 grant reaches EQUIPMENT through the permanent zone family
    // ("equipment you control with 1 or greater {d}"): blocking the ally
    // attack with the equipped chest fires protect exactly like a hand card.
    Bravo.attackWith(snatchRed, { target: allyId });
    Reya.defendWith(scabskinLeathers);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Reya).toHaveTokenCount("gold", 1);
  });

  it("boundary: defending Reya's own hero with the granted card is normal defense — no protect, no Gold", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: reyaTheUnyielding,
        life: 21,
        hand: [forgedForWarYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Reya = game.as(reyaTheUnyielding);

    Bravo.attackWith(snatchRed);
    Reya.defendWith(forgedForWarYellow);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Reya).toHaveTokenCount("gold", 0);
    // 4{p} snatch reduced by the 3{d} block leaves 1 damage.
    expectFabPlayer(Reya).toHaveLife(20);
  });

  it("timing: the continuous grant re-fires for each ally defense — two attacks, two protects, two Gold", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      {
        hero: reyaTheUnyielding,
        life: 21,
        arena: [cintariSellsword, cintariSellsword],
        hand: [forgedForWarYellow, forgedForWarYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Reya = game.as(reyaTheUnyielding);
    const [allyA, allyB] = Reya.cardsIn("arena", cintariSellsword);

    Bravo.attackWith(snatchRed, { target: allyA.instanceId });
    Reya.defendWith(forgedForWarYellow);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Reya).toHaveTokenCount("gold", 1);

    Bravo.attackWith(snatchRed, { target: allyB.instanceId });
    Reya.defendWith(forgedForWarYellow);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Reya).toHaveTokenCount("gold", 2);
  });
});
