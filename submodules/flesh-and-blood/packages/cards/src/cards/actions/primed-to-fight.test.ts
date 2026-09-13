import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { primedToFightRed } from "./primed-to-fight.ts";

/**
 * Primed to Fight (HVY058) — Guardian Action - Attack, cost 5, 9{p}, 3{d}.
 *
 * Printed: "If you've controlled a Vigor token this turn, this costs {r} less
 * to play. If you've controlled a Might token this turn, this gets +1{p}."
 */

describe("Primed to Fight (HVY058) AAA", () => {
  it("happy: Vigor/Might that left play this turn still reduce cost and grant +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [primedToFightRed, nimblismBlue],
        arena: [fabToken("vigor"), fabToken("might")],
        resourcePoints: 0,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.endTurn();
    game.untilIdle({ ordering: "listed" });
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);

    Bravo.must.pitch(nimblismBlue).playAttack(primedToFightRed);
    game.advanceCombatTo("defend");
    // Printed 9, Primed's Might-this-turn +1, and Might's start-of-turn next-attack +1.
    expectCombat(game).toHaveAttackPower(11);
  });

  it("boundary: without those tokens, cost 5 stays and this is printed 9{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [primedToFightRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabUnplayable(() => Bravo.play(primedToFightRed));
    expectFabCard(Bravo, primedToFightRed).toBeIn("hand");
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [primedToFightRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([primedToFightRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
    expectFabCard(Bravo, primedToFightRed).toBeIn("graveyard");
  });
});
