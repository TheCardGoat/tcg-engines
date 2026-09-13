import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";

import { heavyIndustryGearShift } from "../../../../../../cards/src/cards/equipment/heavy-industry-gear-shift.ts";
import { hyperDriverBlue } from "../../../../../../cards/src/cards/actions/hyper-driver.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    if (game.answerForcedDecision()) continue;
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const need = decision.min ?? 1;
      const picks = decision.candidates.slice(0, need).map((candidate) => candidate.instanceId);
      if (picks.length < need) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: picks },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const priorityPlayerId = game.getState().priority?.holderPlayerId;
    if (!priorityPlayerId) return;
    game.exec({ move: "pass", actorId: priorityPlayerId, payload: {} });
  }
}

describe("heavy-industry-gear-shift (AIO006)", () => {
  it("core mechanic: destroy, banish top two, and regain one action point per Mechanologist", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [heavyIndustryGearShift],
        deck: [snatchRed, hyperDriverBlue, hyperDriverBlue],
        hand: [nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(heavyIndustryGearShift);
    drain(game);

    expect(Bravo.zone("legs")).not.toContain(heavyIndustryGearShift.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(heavyIndustryGearShift.canonicalId);
    expect(Bravo.zone("banished")).toEqual(
      expect.arrayContaining([hyperDriverBlue.canonicalId, hyperDriverBlue.canonicalId]),
    );
    expect(Bravo.actionPoints()).toBe(2);
  });

  it("boundary: non-Mechanologist cards do not refund action points", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [heavyIndustryGearShift],
        hand: [],
        deck: [nimblismBlue, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(heavyIndustryGearShift);
    drain(game);

    expect(Bravo.zone("banished")).toEqual(
      expect.arrayContaining([nimblismBlue.canonicalId, snatchRed.canonicalId]),
    );
    expect(Bravo.actionPoints()).toBe(0);
  });

  it("boundary: battleworn reduces defense on the first defend", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        deck: 6,
      },
      {
        hero: bravo,
        legs: [heavyIndustryGearShift],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(bravo);
    const legsId = Defender.findCardInZone("legs", heavyIndustryGearShift);

    game.as(dash).attackWith(snatchRed);
    Defender.defendWith(heavyIndustryGearShift);
    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(Defender.zone("legs")).toContain(heavyIndustryGearShift.canonicalId);
    expect(game.objectState(legsId)?.defenseCounterTotal).toBe(-1);
  });
});
