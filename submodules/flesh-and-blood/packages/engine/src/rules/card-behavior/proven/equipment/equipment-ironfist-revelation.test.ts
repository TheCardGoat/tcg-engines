import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { crushConfidenceBlue } from "../../../../../../cards/src/cards/actions/crush-confidence.ts";
import { ironfistRevelation } from "../../../../../../cards/src/cards/equipment/ironfist-revelation.ts";

function resolveCombat(game: ReturnType<typeof FabTestEngine.start>, accept: boolean): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick) throw new Error("expected a face-down Crush arsenal target");
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [pick.instanceId] },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
}

describe("ironfist-revelation (SUP168)", () => {
  it("AAA: defend, accept the optional flip, and add +1{p} to the Crush arsenal card", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arms: [ironfistRevelation],
        hand: [crushConfidenceBlue],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(dash);
    game.as(bravo).endTurn();
    Defender.endTurnWithArsenal(crushConfidenceBlue);
    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(ironfistRevelation);
    resolveCombat(game, true);

    const arsenalId = Defender.findCardInZone("arsenal", crushConfidenceBlue);
    expect(game.objectState(arsenalId)?.faceDown).toBe(false);
    expect(game.objectState(arsenalId)?.powerCounterTotal).toBe(1);
  });

  it("boundaries: declining keeps it face-down, and no Crush card offers no trigger", () => {
    const declined = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, arms: [ironfistRevelation], hand: [crushConfidenceBlue], deck: 6 },
      { autoPassPriority: false },
    );
    declined.as(bravo).endTurn();
    declined.as(dash).endTurnWithArsenal(crushConfidenceBlue);
    declined.as(bravo).attackWith(snatchRed);
    declined.as(dash).defendWith(ironfistRevelation);
    resolveCombat(declined, false);
    const declinedId = declined.as(dash).findCardInZone("arsenal", crushConfidenceBlue);
    expect(declined.objectState(declinedId)?.faceDown).toBe(true);
    expect(declined.objectState(declinedId)?.powerCounterTotal ?? 0).toBe(0);

    const noTarget = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, arms: [ironfistRevelation], deck: 6 },
      { autoPassPriority: false },
    );
    noTarget.as(bravo).attackWith(snatchRed);
    noTarget.as(dash).defendWith(ironfistRevelation);
    expect(noTarget.getState().decision).toBeNull();
  });
});
