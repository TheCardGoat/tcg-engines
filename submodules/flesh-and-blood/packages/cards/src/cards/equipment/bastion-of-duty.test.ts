import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { chumFriendlyFirstMateYellow } from "../actions/chum-friendly-first-mate.ts";
import { brevantCivicProtector } from "../heroes/brevant-civic-protector.ts";
import { bastionOfDuty } from "./bastion-of-duty.ts";

// Printed: "Protect / Temper" — Guardian Off-Hand equipment, 2{d}. Protect is
// exercised through the ally-attack playline (CR 8.3.31); Temper accumulates a
// -1{d} counter after each defend and destroys the card at 0{d}.
describe("Bastion of Duty (TCC029) AAA", () => {
  it("happy: defends an attacked ally (protect) and takes a Temper counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: brevantCivicProtector,
        weapon2: [bastionOfDuty],
        arena: [chumFriendlyFirstMateYellow],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Brevant = game.as(brevantCivicProtector);
    const allyId = Brevant.findCardInZone("arena", chumFriendlyFirstMateYellow);
    const eqId = Brevant.findCardInZone("weapon2", bastionOfDuty);

    Bravo.attackWith(snatchRed, { target: allyId });
    Brevant.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Brevant, bastionOfDuty).toHaveDefenseCounters(-1);
    expectFabCard(Brevant, bastionOfDuty).toBeIn("weapon2");
  });

  it("boundary: defends a hero attack with its printed 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: brevantCivicProtector, weapon2: [bastionOfDuty], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Brevant = game.as(brevantCivicProtector);
    const eqId = Brevant.findCardInZone("weapon2", bastionOfDuty);

    Bravo.attackWith(snatchRed); // 4{p} at the hero
    Brevant.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();

    // 4 - 2{d} = 2 damage.
    expectFabPlayer(Brevant).toHaveLife(18);
    expectFabCard(Brevant, bastionOfDuty).toHaveDefenseCounters(-1);
  });

  it("timing: the second Temper counter zeroes its defence and destroys it", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { hero: brevantCivicProtector, weapon2: [bastionOfDuty], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Brevant = game.as(brevantCivicProtector);
    const eqId = Brevant.findCardInZone("weapon2", bastionOfDuty);

    Bravo.attackWith(snatchRed);
    Brevant.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();
    expectFabCard(Brevant, bastionOfDuty).toHaveDefenseCounters(-1);

    Bravo.attackWith(snatchRed);
    Brevant.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Brevant, bastionOfDuty).toBeIn("graveyard");
    expect(Brevant.zone("weapon2")).not.toContain(bastionOfDuty.canonicalId);
  });
});
