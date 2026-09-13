/**
 * AAA test for trigger:move-zone.
 * Representative card: Head Shot Red (ARC057) — Ranger Arrow Attack.
 * When put into arsenal face-up, gains +2{p} until end of turn.
 * Bull's Eye Bracers put an arrow face-up into arsenal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { azalea, dash, deathDealer, snatchRed } from "../../../fixtures.ts";
import { headShotRed } from "../../../../../../cards/src/cards/actions/head-shot.ts";
import { bullSEyeBracers } from "../../../../../../cards/src/cards/equipment/bull-s-eye-bracers.ts";

function resolveDecisions(game: FabTestEngine): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (!decision) {
      if (game.combat()?.open || game.getState().rulesStack.length > 0) {
        try {
          game.passBoth();
        } catch {
          return;
        }
        continue;
      }
      return;
    }
    if (decision.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
    if (decision.kind === "entity-target") {
      const pick = decision.candidates[0];
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (game.answerForcedDecision()) continue;
    return;
  }
}

describe("trigger: move-zone", () => {
  it("AAA: Head Shot put face-up into arsenal gains +2{p} and deals 7 (ARC057)", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arms: [bullSEyeBracers],
        hand: [headShotRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    // Destroy Bracers → optional put arrow face-up into arsenal → Head Shot +2{p}.
    Azalea.activate(bullSEyeBracers);
    resolveDecisions(game);
    expect(Azalea.zone("arsenal")).toContain(headShotRed.canonicalId);

    const arrowId = Azalea.findCardInZone("arsenal", headShotRed);
    Azalea.exec({
      move: "begin-play",
      payload: { instanceId: arrowId, target: Dash.id, from: "arsenal" },
    });
    resolveDecisions(game);

    // Base 4 + Bull's Eye Bracers 1 + Head Shot's face-up arsenal trigger 2.
    expect(Azalea.zone("arsenal")).not.toContain(headShotRed.canonicalId);
    expect(Dash.life()).toBe(13);
  });

  it("AAA boundary: non-arrow action from hand deals base power only", () => {
    const game = FabTestEngine.start(
      { hero: azalea, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(game.as(azalea).zone("arsenal")).toHaveLength(0);
    game.as(azalea).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16);
  });
});
