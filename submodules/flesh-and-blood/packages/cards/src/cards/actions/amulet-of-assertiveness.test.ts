import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { amuletOfAssertivenessYellow } from "./amulet-of-assertiveness.ts";

describe("Amulet of Assertiveness (EVR176) AAA", () => {
  it("happy: 4+ cards in hand, destroy this as an AR, hit banishes the top AAC", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [amuletOfAssertivenessYellow],
        hand: [snatchRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: [snatchRed],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.as(bravo).defendWith();
    game.advanceCombatTo("reaction");
    Dash.activate(amuletOfAssertivenessYellow);
    game.passBoth();
    expectFabCard(Dash, amuletOfAssertivenessYellow).toBeIn("graveyard");
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Dash.zone("banished")).toContain(snatchRed.canonicalId);
  });

  it("boundary: fewer than 4 cards in hand cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [amuletOfAssertivenessYellow],
        hand: [snatchRed, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.as(bravo).defendWith();
    game.advanceCombatTo("reaction");
    expect(Dash.expectActivationRejected(amuletOfAssertivenessYellow).errorCode).toBe(
      "activation_condition_failed",
    );
    expectFabCard(Dash, amuletOfAssertivenessYellow).toBeIn("arena");
  });

  it("timing: a miss does not banish the top card", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [amuletOfAssertivenessYellow],
        hand: [snatchRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: [snatchRed],
      },
      {
        hero: bravo,
        hand: [nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.as(bravo).defendWith(nimblismBlue, nimblismBlue);
    game.advanceCombatTo("reaction");
    Dash.activate(amuletOfAssertivenessYellow);
    game.closeCombat({ optionals: "decline" });

    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("banished")).not.toContain(snatchRed.canonicalId);
  });
});
