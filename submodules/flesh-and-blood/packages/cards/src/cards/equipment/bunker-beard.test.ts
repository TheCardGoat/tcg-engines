import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { bunkerBeard } from "./bunker-beard.ts";

describe("Bunker Beard (HNT220) AAA", () => {
  it("happy: destroy this to add an arsenal action as a defending card", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        head: [bunkerBeard],
        arsenal: [nimblismBlue],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    game.toReaction("defender");
    Dash.activate(bunkerBeard);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, bunkerBeard).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("boundary: declining the optional leaves the arsenal action", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        head: [bunkerBeard],
        arsenal: [nimblismBlue],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    game.toReaction("defender");
    Dash.activate(bunkerBeard);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, bunkerBeard).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: the Defense Reaction is illegal outside the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [bunkerBeard],
        arsenal: [nimblismBlue],
        hand: [],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).expectActivationRejected(bunkerBeard);
    expectFabCard(game.as(dash), bunkerBeard).toBeIn("head");
  });
});
