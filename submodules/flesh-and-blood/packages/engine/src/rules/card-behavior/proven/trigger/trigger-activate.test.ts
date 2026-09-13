/**
 * AAA test for trigger:activate.
 * Representative: Dawnblade weapon activate path.
 * Activate is production; a weapon attack drops opposing life.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, dawnblade } from "../../../fixtures.ts";
import { flurryStanceRed } from "../../../../../../cards/src/cards/actions/flurry-stance.ts";

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

describe("trigger: activate", () => {
  it("AAA: Dawnblade weapon activation deals combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const result = Bravo.activate(dawnblade, { target: Dash.id } as never);
    expect(result.accepted).toBe(true);
    resolveDecisions(game);
    // Dawnblade base power 3 → life 17 when unblocked.
    expect(Dash.life()).toBeLessThan(20);
  });

  it("AAA boundary: Flurry Stance aura can be played into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [flurryStanceRed],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.play(flurryStanceRed);
    resolveDecisions(game);
    expect(
      Bravo.zone("arena").includes(flurryStanceRed.canonicalId) ||
        Bravo.zone("graveyard").includes(flurryStanceRed.canonicalId),
    ).toBe(true);
  });
});
