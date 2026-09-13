import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { crossTheLineRed } from "../actions/cross-the-line.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { beaconOfVictoryYellow } from "./beacon-of-victory.ts";

/**
 * Beacon of Victory, Yellow (MON033) — Light Warrior Attack Reaction, cost 0, 3{d}.
 * Printed: "As an additional cost to play Beacon of Victory, banish X cards
 * from your hero's soul. X can't be 0.
 * Target attack gains +X{p}.
 * If you've charged this turn, search your deck for an action card with
 * cost X or less, reveal it, put it into your hand, then shuffle your deck."
 */

describe("Beacon of Victory (MON033) AAA", () => {
  it("happy: banishing 1 soul card gives the attack +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, beaconOfVictoryYellow],
        soul: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.must.playAttack(crossTheLineRed);
    game.advanceCombatTo("reaction");
    Boltyn.must.playReaction(beaconOfVictoryYellow);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(6);
    expect(Boltyn.zone("soul")).not.toContain(nimblismBlue.canonicalId);
    expect(Boltyn.zone("banished")).toContain(nimblismBlue.canonicalId);
    expectFabCard(Boltyn, beaconOfVictoryYellow).toBeIn("graveyard");
  });

  it("boundary: empty soul is unpayable (X can't be 0)", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, beaconOfVictoryYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.must.playAttack(crossTheLineRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Boltyn.must.playReaction(beaconOfVictoryYellow));
    expectFabCard(Boltyn, beaconOfVictoryYellow).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [beaconOfVictoryYellow],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Boltyn.defendWith([beaconOfVictoryYellow]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveLife(19);
    expectFabCard(Boltyn, beaconOfVictoryYellow).toBeIn("graveyard");
  });
});
