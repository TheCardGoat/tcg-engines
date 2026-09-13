import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "./bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { chumFriendlyFirstMateYellow } from "../actions/chum-friendly-first-mate.ts";
import { bastionOfDuty } from "../equipment/bastion-of-duty.ts";
import { chivalryBlue } from "../blocks/chivalry.ts";
import { brevantCivicProtector } from "./brevant-civic-protector.ts";

// a1 "You may have any number of Chivalry in your deck" is deckbuilding-only
// (out of scope per plan §0.2); a2 is proven below via the CR 8.3.31 protect
// path (attack a non-hero entity, defend it with a protect card).
describe("Brevant, Civic Protector (TCC027) AAA", () => {
  it("happy: protecting an attacked ally creates a Might token", () => {
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
    const _eqId = Brevant.findCardInZone("weapon2", bastionOfDuty);

    Bravo.attackWith(snatchRed, { target: allyId });
    Brevant.defendWith(bastionOfDuty);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Brevant).toHaveTokenCount("might", 1);
  });

  it("boundary: defending your own hero is not protecting — no Might token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: brevantCivicProtector,
        weapon2: [bastionOfDuty],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Brevant = game.as(brevantCivicProtector);
    const _eqId = Brevant.findCardInZone("weapon2", bastionOfDuty);

    Bravo.attackWith(snatchRed);
    Brevant.defendWith(bastionOfDuty);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Brevant).toHaveTokenCount("might", 0);
  });

  it("timing: protecting with Chivalry from hand also creates the Might token (printed synergy)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: brevantCivicProtector,
        arena: [chumFriendlyFirstMateYellow],
        hand: [chivalryBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Brevant = game.as(brevantCivicProtector);
    const allyId = Brevant.findCardInZone("arena", chumFriendlyFirstMateYellow);

    Bravo.attackWith(snatchRed, { target: allyId });
    Brevant.defendWith(chivalryBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Brevant).toHaveTokenCount("might", 1);
    expect(Brevant.zone("hand")).not.toContain(chivalryBlue.canonicalId);
  });
});
