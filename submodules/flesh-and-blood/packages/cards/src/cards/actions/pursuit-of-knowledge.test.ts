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
import { pursuitOfKnowledgeBlue } from "./pursuit-of-knowledge.ts";

describe("Pursuit of Knowledge (ARC161) AAA", () => {
  it("happy: hit grants +1{i} until end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [pursuitOfKnowledgeBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expect(Bravo.intellect()).toBe(4);
    Bravo.playAttack(pursuitOfKnowledgeBlue);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expect(Bravo.intellect()).toBe(5);
    expectFabCard(Bravo, pursuitOfKnowledgeBlue).toBeIn("graveyard");
  });

  it("boundary: a miss does not raise intellect", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [pursuitOfKnowledgeBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(pursuitOfKnowledgeBlue);
    Dash.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Bravo.intellect()).toBe(4);
  });

  it("timing: the +1{i} expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [pursuitOfKnowledgeBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(pursuitOfKnowledgeBlue);
    game.closeCombat();
    expect(Bravo.intellect()).toBe(5);

    Bravo.endTurn();
    game.untilIdle();

    expect(Bravo.intellect()).toBe(4);
  });
});
