import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { commandAndConquerRed } from "../actions/command-and-conquer.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { testOfStrengthRed } from "../blocks/test-of-strength.ts";
import { unmovableRed } from "../defense-reactions/unmovable.ts";
import { snatchYellow } from "../actions/snatch.ts";
import { confidence } from "./confidence.ts";

describe("Confidence (APS031) AAA", () => {
  it("happy: after start-of-turn, the next attack action cannot be defended by more than 2 non-block cards", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimblismBlue, brutalAssaultBlue, snatchYellow],
        life: 20,
        deck: 6,
      },
      {
        hero: bravo,
        arena: [confidence],
        hand: [commandAndConquerRed, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();
    expect(Bravo.zone("arena")).not.toContain(confidence.canonicalId);

    Bravo.playAttack(commandAndConquerRed, { pitch: [nimblismBlue, nimblismBlue] });
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, brutalAssaultBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: more than 2 non-block defenders is illegal after Confidence", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimblismBlue, brutalAssaultBlue, snatchYellow, testOfStrengthRed],
        life: 20,
        deck: [snatchYellow],
      },
      {
        hero: bravo,
        arena: [confidence],
        hand: [commandAndConquerRed, nimblismBlue, nimblismBlue],
        deck: [brutalAssaultBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();
    game.as(bravo).playAttack(commandAndConquerRed, { pitch: [nimblismBlue, nimblismBlue] });
    game.advanceCombatTo("defend");
    expect(() => Dash.defendWith([nimblismBlue, brutalAssaultBlue, snatchYellow])).toThrow();
    Dash.defendWith([nimblismBlue, brutalAssaultBlue, testOfStrengthRed]);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: Confidence does not fire on the opponent's start of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [confidence],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).endTurn();
    game.helpers.resolveUntilIdle();
    expectFabCard(game.as(bravo), confidence).toBeIn("arena");
  });

  it("unsaturated cap: a defense reaction is playable during the capped link (CR 7.4.2c)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimblismBlue, unmovableRed],
        life: 20,
        resourcePoints: 3,
        deck: 6,
      },
      {
        hero: bravo,
        arena: [confidence],
        hand: [brutalAssaultBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();
    game.as(bravo).playAttack(brutalAssaultBlue, { pitch: [nimblismBlue, nimblismBlue] });
    game.advanceCombatTo("reaction");
    game.as(bravo).pass();

    // Zero defenders declared: the "no more than 2 non-block cards" cap is
    // unsaturated, and per CR 7.3.2b(C) the defense reaction CAN still become
    // a defending card — so CR 7.4.2c does not prevent playing it. The cap
    // counts the DR once it resolves; it never blanket-denies the play.
    expect(() => Dash.play(unmovableRed, { pitch: [nimblismBlue] })).not.toThrow();
    game.passBoth();
    expectFabCard(Dash, unmovableRed).toBeIn("combatChain");
    game.helpers.resolveRestOfCombat();
  });
});
