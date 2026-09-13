import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { dyedSilkSleeves } from "../../../../../../cards/src/cards/equipment/dyed-silk-sleeves.ts";
import { zephyrNeedle } from "../../../../../../cards/src/cards/weapons/zephyr-needle.ts";
import { risingKneeThrustBlue } from "../../../../../../cards/src/cards/actions/rising-knee-thrust.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 96; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const target = decision.candidates.find(
        (candidate) =>
          game.getState().objects[candidate.instanceId]?.canonicalId ===
          risingKneeThrustBlue.canonicalId,
      );
      if (!target) throw new Error("expected the Ninja attack as the legal target");
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [target.instanceId] },
        },
      });
      continue;
    }
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
}

function enterReaction(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 8; safety += 1) {
    if (game.combat()?.step === "reaction") return;
    game.passBoth();
  }
  expect(game.combat()?.step).toBe("reaction");
}

describe("dyed-silk-sleeves (PEN032)", () => {
  it("pays its off-chain Dagger cost to give a Ninja attack +1{p}, and stays when it hits", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [dyedSilkSleeves],
        weapon1: [zephyrNeedle],
        hand: [risingKneeThrustBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(risingKneeThrustBlue);
    enterReaction(game);
    Bravo.activate(dyedSilkSleeves);
    drain(game);

    expect(Dash.life()).toBe(18);
    expect(Bravo.zone("weapon1")).not.toContain(zephyrNeedle.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(zephyrNeedle.canonicalId);
    expect(Bravo.zone("arms")).toContain(dyedSilkSleeves.canonicalId);
  });

  it("destroys itself when the buffed attack misses, and cannot activate without an off-chain Dagger", () => {
    const miss = FabTestEngine.start(
      {
        hero: bravo,
        arms: [dyedSilkSleeves],
        weapon1: [zephyrNeedle],
        hand: [risingKneeThrustBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = miss.as(bravo);
    const Dash = miss.as(dash);

    Bravo.attackWith(risingKneeThrustBlue);
    Dash.defendWith(snatchRed);
    enterReaction(miss);
    Bravo.activate(dyedSilkSleeves);
    drain(miss);

    expect(Bravo.zone("graveyard")).toEqual(
      expect.arrayContaining([zephyrNeedle.canonicalId, dyedSilkSleeves.canonicalId]),
    );

    const noDagger = FabTestEngine.start(
      {
        hero: bravo,
        arms: [dyedSilkSleeves],
        hand: [risingKneeThrustBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    noDagger.as(bravo).attackWith(risingKneeThrustBlue);
    enterReaction(noDagger);
    expect(() => noDagger.as(bravo).activate(dyedSilkSleeves)).toThrow();
  });
});
