import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { riptide } from "../heroes/riptide.ts";
import { takeTheBaitRed } from "../actions/take-the-bait.ts";
import { anothos } from "../weapons/anothos.ts";
import { bait } from "./bait.ts";

/**
 * Bait (FAB393) — Ranger Token - Aura, created under an opponent's control
 * by Take the Bait (SUP258).
 * Printed: "You can't play or activate cards you own. Action - Destroy this
 * when the chain link resolves: Attack. Once per Turn Attack Reaction - 0:
 * This gets +1{p} and go again."
 */
describe("Bait (FAB393) AAA", () => {
  it("creation: an opponent can activate the Bait that Riptide created", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        life: 19,
        hand: [takeTheBaitRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptide);
    const Dash = game.as(dash);
    Riptide.play(takeTheBaitRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveTokenCount("bait", 1);
    const createdBait = Dash.cardIn("arena", "token:bait");
    Riptide.endTurn();
    Dash.activateAttack(createdBait);
    game.toReaction("attacker");
    Dash.activate(createdBait, { abilityId: `${bait.canonicalId}:empowerAndGrantGoAgain` });
    game.closeCombat();
    game.untilIdle();
    expectFabPlayer(Riptide).toHaveLife(18);
    expectFabPlayer(Dash).toHaveTokenCount("bait", 0).toHaveAP(1);
  });

  it("ownership: a hero who owns Bait cannot activate it even under their own control", () => {
    // Arrange ownership after the creator has regained control of their token.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [bait],
        hand: [],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    expect(Bravo.expectActivationRejected(bait, `${bait.canonicalId}:attack`).errorCode).toBe(
      "restricted_by_rule",
    );
    expectFabPlayer(Bravo).toHaveTokenCount("bait", 1).toHaveAP(1);
    expectCombat(game).toBeClosed();
  });

  it("happy: the Bait controller cannot play their own cards while it is in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: bait, state: { owner: "opponent" } }],
        hand: [brutalAssaultBlue],
        resourcePoints: 4,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabUnplayable(() => Dash.play(brutalAssaultBlue), /rules effect restricts/);
    expectFabCard(Dash, bait).toBeIn("arena");
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("hand");
  });

  it("happy: the opposing hero can still play while Bait is under the other hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        arena: [{ card: bait, state: { owner: "opponent" } }],
        hand: [brutalAssaultBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("bait", 1);
  });

  it("happy: the Bait controller can still attack with Bait", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: bait, state: { owner: "opponent" } }],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activateAttack(bait);
    expectCombat(game).toHaveAttackPower(0);
    game.closeCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(20);
    expectFabPlayer(Dash).toHaveAP(0);
    expectFabPlayer(Dash).toHaveTokenCount("bait", 0);
  });

  it("happy: its attack reaction gives the Bait attack +1{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: bait, state: { owner: "opponent" } }],
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activateAttack(bait);
    game.toReaction("attacker");
    Dash.activate(bait, { abilityId: `${bait.canonicalId}:empowerAndGrantGoAgain` });
    Dash.pass();
    game.as(bravo).pass();

    expectCombat(game).toHaveAttackPower(1);
    expect(
      Dash.expectActivationRejected(bait, `${bait.canonicalId}:empowerAndGrantGoAgain`).errorCode,
    ).toBe("activation_limit");
    game.closeCombat();
    game.untilIdle();
    expectFabPlayer(Dash).toHaveTokenCount("bait", 0);
    expectFabPlayer(Dash).toHaveAP(1);
    expectFabPlayer(game.as(bravo)).toHaveLife(19);

    // Go again and removal of Bait's restriction permit a fresh attack.
    Dash.playAttack(brutalAssaultBlue);
    game.closeCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(15);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
  });

  it("boundary: a blocked Bait still destroys and unlocks an owned weapon activation", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [{ card: bait, state: { owner: "opponent" } }],
        weapon1: [anothos],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [snatchRed],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    expect(Bravo.expectActivationRejected(anothos).errorCode).toBe("restricted_by_rule");
    expectFabPlayer(Bravo).toHaveResourceCount(3).toHaveAP(1);
    Bravo.activateAttack(bait);
    Dash.defendWith(snatchRed);
    game.toReaction("attacker");
    Bravo.activate(bait, { abilityId: `${bait.canonicalId}:empowerAndGrantGoAgain` });
    Bravo.pass();
    Dash.pass();
    expectCombat(game).toHaveAttackPower(1);
    expectFabPlayer(Bravo).toHaveTokenCount("bait", 1);
    game.closeCombat();
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveTokenCount("bait", 0).toHaveAP(1);
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
    Bravo.activateAttack(anothos);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: without Bait in the arena the same play goes through", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
    );
    const Dash = game.as(dash);

    Dash.playAttack(brutalAssaultBlue);
    game.as(bravo).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
    expectFabPlayer(game.as(bravo)).toHaveLife(16);
  });
});
