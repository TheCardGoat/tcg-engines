import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { platinumAmuletBlue } from "./platinum-amulet.ts";

describe("Platinum Amulet (SEA194) AAA", () => {
  it("happy: Instant destroy this; target defending card gets +1{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [platinumAmuletBlue],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    Dash.defendWith(nimblismBlue);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Dash.activate(platinumAmuletBlue);
    game.passBoth();

    expectFabCard(Dash, platinumAmuletBlue).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toHaveDefense(3);
  });

  it("boundary: without the buff a 2{d} Nimblism does not fully block Snatch", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("timing: Instant activation on the defender does not spend an action point", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [platinumAmuletBlue],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(nimblismBlue);
    game.advanceCombatTo("reaction");
    game.as(bravo).pass();
    expectFabPlayer(Dash).toHaveAP(0);
    Dash.activate(platinumAmuletBlue);
    game.passBoth();
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
