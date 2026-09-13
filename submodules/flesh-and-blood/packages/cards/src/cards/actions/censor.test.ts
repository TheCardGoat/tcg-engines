import { describe, expect, it } from "vitest";
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
import { woundingBlowBlue } from "./wounding-blow.ts";
import { censorRed } from "./censor.ts";

describe("Censor (DTD226) AAA", () => {
  it("happy: hit names a card the opposing hero cannot play", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [censorRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [woundingBlowBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(censorRed);
    expectCombat(game).toHaveAttackPower(5);
    for (let step = 0; step < 24; step += 1) {
      const wait = game.waitState();
      if (wait.kind === "decision") {
        Bravo.choose("Wounding Blow");
        break;
      }
      if (wait.kind === "defense-declaration") {
        game.as(dash).defendWith();
        continue;
      }
      if (wait.kind === "priority") {
        game.pass(wait.playerId);
        continue;
      }
      break;
    }
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(15);
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Bravo.id,
      cardName: "Wounding Blow",
    });
    Bravo.endTurn();
    game.untilIdle();
    expect(() => Dash.playAttack(woundingBlowBlue)).toThrow();
    expectFabCard(Dash, woundingBlowBlue).toBeIn("hand");
  });

  it("boundary: a miss does not name a card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [censorRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, woundingBlowBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(censorRed);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    Bravo.endTurn();
    game.untilIdle();
    Dash.playAttack(woundingBlowBlue);
    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: the named-card lock lasts until the end of their next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [censorRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [woundingBlowBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(censorRed);
    for (let step = 0; step < 24; step += 1) {
      const wait = game.waitState();
      if (wait.kind === "decision") {
        Bravo.choose("Wounding Blow");
        break;
      }
      if (wait.kind === "defense-declaration") {
        Dash.defendWith();
        continue;
      }
      if (wait.kind === "priority") {
        game.pass(wait.playerId);
        continue;
      }
      break;
    }
    game.untilIdle();
    Bravo.endTurn();
    game.untilIdle();
    expect(() => Dash.playAttack(woundingBlowBlue)).toThrow();
    Dash.endTurn();
    game.untilIdle();
    Bravo.endTurn();
    game.untilIdle();
    Dash.playAttack(woundingBlowBlue);
    expectCombat(game).toHaveAttackPower(2);
  });
});
