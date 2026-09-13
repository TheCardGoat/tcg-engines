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
import { anothos } from "../weapons/anothos.ts";
import { snagBlue } from "../instants/snag.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { agility } from "./agility.ts";

describe("Agility (HVY240) AAA", () => {
  it("happy: at the start of your turn this is destroyed and your next attack gets go again", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [agility],
        hand: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();
    expect(Bravo.zone("arena")).not.toContain(agility.canonicalId);

    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: an attack played before the start-of-turn trigger does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [agility],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("go-again");
    expectFabCard(Bravo, agility).toBeIn("arena");
  });

  it("timing: a non-attack play does not consume the next-attack go again", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [agility],
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
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("timing: a weapon attack also gets the next-attack go again", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [agility],
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
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("timing: Agility does not fire on the opponent's start of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [agility],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).endTurn();
    game.helpers.resolveUntilIdle();
    expectFabCard(game.as(bravo), agility).toBeIn("arena");
  });
});
