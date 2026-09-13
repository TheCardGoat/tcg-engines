import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { rallyTheRearguardBlue } from "./rally-the-rearguard.ts";
import { amuletOfHavencallBlue } from "./amulet-of-havencall.ts";

describe("Amulet of Havencall (EVR178) AAA", () => {
  it("happy: empty-hand DR destroys this and adds Rally the Rearguard as a defending card", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [amuletOfHavencallBlue],
        hand: [],
        deck: [rallyTheRearguardBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith();
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Dash);
    Dash.activate(amuletOfHavencallBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dash, amuletOfHavencallBlue).toBeIn("graveyard");
    expect([
      ...Dash.zone("combatChain"),
      ...Dash.zone("graveyard"),
      ...Dash.zone("deck"),
    ]).toContain(rallyTheRearguardBlue.canonicalId);
  });

  it("boundary: cards in hand cannot activate the empty-hand gate", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [amuletOfHavencallBlue],
        hand: [nimblismBlue],
        deck: [rallyTheRearguardBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith();
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Dash);
    expect(Dash.expectActivationRejected(amuletOfHavencallBlue).errorCode).toBe(
      "activation_condition_failed",
    );
    expectFabCard(Dash, amuletOfHavencallBlue).toBeIn("arena");
  });

  it("timing: a hand-blocked attack does not tutor Rally when the amulet never activates", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [amuletOfHavencallBlue],
        hand: [nimblismBlue, nimblismBlue],
        deck: [rallyTheRearguardBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabCard(Dash, amuletOfHavencallBlue).toBeIn("arena");
    expect(Dash.zone("deck")).toContain(rallyTheRearguardBlue.canonicalId);
  });
});
