import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";
import { brutalAssaultYellow } from "./brutal-assault.ts";
import { rallyTheRearguardRed } from "./rally-the-rearguard.ts";

describe("Rally the Rearguard family AAA", () => {
  it("happy: while defending, discard a card to give this +3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [rallyTheRearguardRed, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(brutalAssaultYellow);
    expectCombat(game).toHaveAttackPower(5);
    Bravo.defendWith(rallyTheRearguardRed);
    game.toReaction("defender");
    Bravo.activate(rallyTheRearguardRed);
    game.passBoth();
    expectFabCard(Bravo, rallyTheRearguardRed).toHaveDefense(5);
    expectFabCard(Bravo, nimblismBlue).toBeIn("graveyard");
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("boundary: cannot activate from hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [rallyTheRearguardRed, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(rallyTheRearguardRed);
    expectFabCard(Bravo, rallyTheRearguardRed).toBeIn("hand");
  });

  it("timing: once per turn — a second activation is rejected", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [woundingBlowBlue], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [rallyTheRearguardRed, nimblismBlue, snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(woundingBlowBlue);
    Bravo.defendWith(rallyTheRearguardRed);
    game.toReaction("defender");
    Bravo.activate(rallyTheRearguardRed);
    Bravo.target(nimblismBlue);
    game.passBoth();
    Bravo.expectActivationRejected(rallyTheRearguardRed);
    expectFabCard(Bravo, rallyTheRearguardRed).toHaveDefense(5);
  });
});
