/**
 * AAA test for trigger:attack-target-declared.
 * Representative card: Truce Blue (ROS219) — Generic Aura.
 * When you or a card you control is targeted by an opponent attack, destroy
 * Truce and draw a card.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { truceBlue } from "../../../../../../cards/src/cards/actions/truce.ts";

function resolveDecisions(game: FabTestEngine): void {
  for (let safety = 0; safety < 40; safety += 1) {
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
    if (game.answerForcedDecision()) continue;
    return;
  }
}

describe("trigger: attack-target-declared", () => {
  it("AAA: opponent attack against Truce controller destroys Truce AND draws (ROS219)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        arena: [truceBlue],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const handBefore = Dash.zone("hand").length;
    expect(Dash.zone("arena")).toContain(truceBlue.canonicalId);

    Bravo.attackWith(snatchRed);
    resolveDecisions(game);

    // BOTH printed outcomes — not soft-OR.
    expect(Dash.zone("arena")).not.toContain(truceBlue.canonicalId);
    expect(Dash.zone("graveyard")).toContain(truceBlue.canonicalId);
    expect(Dash.zone("hand").length).toBe(handBefore + 1);
  });

  it("AAA boundary: attack without Truce does not create a Truce graveyard entry", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).zone("graveyard")).not.toContain(truceBlue.canonicalId);
  });
});
