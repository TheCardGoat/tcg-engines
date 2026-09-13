/**
 * SUP214 Toby Jugs — Generic Legs d0 Blade Break.
 * Printed: When this defends, you may pay {r}. If you do, it gets +2{d} this turn.
 * Happy: defend + pay 1{r} → d0+2=2 blocks snatch for 2; bladeBreak GY.
 * Decline: d0 full damage.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { tobyJugs } from "../../../../../../cards/src/cards/equipment/toby-jugs.ts";

const SNATCH = 4;
const LIFE = 20;

describe("toby-jugs (SUP214)", () => {
  it("core: defend + pay {r} → +2{d} (d0→2 blocks 2); bladeBreak GY", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, legs: [tobyJugs], resourcePoints: 1, deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(tobyJugs);
    // Accept the optional pay {r} for +2{d}.
    for (let s = 0; s < 16; s += 1) {
      const d = game.getState().decision;
      if (d?.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: { kind: "boolean", value: true },
          },
        });
        continue;
      }
      if (d?.kind === "payment") {
        const pick = d.candidates[0];
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: { kind: "payment", instanceIds: pick ? [pick.instanceId] : [] },
          },
        });
        continue;
      }
      if (d && game.answerForcedDecision()) continue;
      if (d) break;
      if (game.getState().rulesStack.length > 0) {
        game.passBoth();
        continue;
      }
      break;
    }
    game.helpers.resolveRestOfCombat();
    // d0 +2{d} = 2 → snatch 4 − 2 = 2 damage.
    expect(Dash.life()).toBe(LIFE - (SNATCH - 2));
    // bladeBreak → GY.
    expect(Dash.zone("legs")).not.toContain(tobyJugs.canonicalId);
    expect(Dash.zone("graveyard")).toContain(tobyJugs.canonicalId);
  });

  it("boundary: decline → d0 full damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, legs: [tobyJugs], resourcePoints: 1, deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(tobyJugs);
    // Decline the optional pay.
    for (let s = 0; s < 16; s += 1) {
      const d = game.getState().decision;
      if (d?.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: { kind: "boolean", value: false },
          },
        });
        continue;
      }
      if (d && game.answerForcedDecision()) continue;
      if (d) break;
      if (game.getState().rulesStack.length > 0) {
        game.passBoth();
        continue;
      }
      break;
    }
    game.helpers.resolveRestOfCombat();
    // d0 → full 4 damage.
    expect(game.as(dash).life()).toBe(LIFE - SNATCH);
  });
});
