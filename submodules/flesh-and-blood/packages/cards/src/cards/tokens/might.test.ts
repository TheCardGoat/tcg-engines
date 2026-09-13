import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { anothos } from "../weapons/anothos.ts";
import { snagBlue } from "../instants/snag.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { might } from "./might.ts";

describe("Might (TCC105) AAA", () => {
  it("happy: at the start of your turn this is destroyed and your next attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [might],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();
    expect(Bravo.zone("arena")).not.toContain(might.canonicalId);

    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: an attack played before the start-of-turn trigger stays at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [might],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(game.as(bravo), might).toBeIn("arena");
  });

  it("timing: a non-attack play does not consume the next-attack +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [might],
        hand: [snagBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();
    Bravo.play(snagBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: after start-of-turn a weapon attack also gets +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [might],
        weapon1: [anothos],
        hand: [nimblismBlue],
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();
    Bravo.activate(anothos);
    const decision = game.pendingDecision();
    if (decision?.kind !== "payment") throw new Error("expected payment for Anothos");
    game.exec({
      move: "answer-decision",
      actorId: decision.actorId,
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: {
          kind: "payment",
          instanceIds: [Bravo.cardsIn("hand", nimblismBlue)[0]!.instanceId],
        },
      },
    });
    if (game.combat()?.open) {
      expectCombat(game).toHaveAttackPower(5);
    } else {
      expect(game.as(dash).life()).toBe(15);
    }
  });
});
