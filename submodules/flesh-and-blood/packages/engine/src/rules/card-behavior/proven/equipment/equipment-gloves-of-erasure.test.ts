/**
 * PEN109 Gloves of Erasure — Wizard Arms d0 Blade Break.
 * Printed: When this leaves the arena, destroy target aura token.
 * Blade Break
 * Happy: defend → bladeBreak leaves arena → trigger fires → destroy target aura.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";
import { glovesOfErasure } from "../../../../../../cards/src/cards/equipment/gloves-of-erasure.ts";

const LIFE = 20;
const SNATCH = 4;

describe("gloves-of-erasure (PEN109)", () => {
  it("core: bladeBreak leave-arena → destroy target aura token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, arms: [glovesOfErasure], arena: [fabToken("runechant")], deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);

    // Runechant aura is in play.
    expect(Dash.zone("arena")).toContain("token:runechant");

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(glovesOfErasure);
    // Resolve combat — bladeBreak destroys gloves → leave-arena trigger fires.
    game.helpers.resolveRestOfCombat();

    // Gloves left arena (bladeBreak to GY).
    expect(Dash.zone("arms")).not.toContain(glovesOfErasure.canonicalId);
    expect(Dash.zone("graveyard")).toContain(glovesOfErasure.canonicalId);

    // The leave-arena trigger destroys the target aura (Runechant).
    // Auto-answer the entity-target decision (pick the Runechant).
    for (let s = 0; s < 16; s += 1) {
      const d = game.getState().decision;
      if (d?.kind === "entity-target") {
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: { kind: "entity-target", instanceIds: [d.candidates[0]!.instanceId] },
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

    expect(Dash.zone("arena")).not.toContain("token:runechant");
  });

  it("boundary: no aura to target → still leaves; full damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, arms: [glovesOfErasure], deck: 6 },
      { autoPassPriority: false },
    );

    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(glovesOfErasure);
    game.helpers.resolveRestOfCombat();

    // d0 bladeBreak — full 4 damage (no defense).
    expect(game.as(dash).life()).toBe(LIFE - SNATCH);
    expect(game.as(dash).zone("arms")).not.toContain(glovesOfErasure.canonicalId);
  });
});
