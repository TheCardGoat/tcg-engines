/**
 * IAR163 Path of Repentance — Shadow Legs d0.
 * Printed: Instant - Destroy this: Turn a card with blood debt in your
 * banished zone face-down.
 * Mirrors proven IAR161 grille-of-repentance (same blood-debt face-down path).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { pathOfRepentance } from "../../../../../../cards/src/cards/equipment/path-of-repentance.ts";
import { hungeringDemigonYellow } from "../../../../../../cards/src/cards/actions/hungering-demigon.ts";

const LIFE = 20;

describe("path-of-repentance (IAR163)", () => {
  it("core: Instant destroy → turn blood-debt banished face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: LIFE,
        legs: [pathOfRepentance],
        banished: [hungeringDemigonYellow],
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("banished")).toContain(hungeringDemigonYellow.canonicalId);
    const debtId = Bravo.card(hungeringDemigonYellow);
    expect(game.getState().objects[debtId]?.markers.some((m) => m.kind === "face-down")).toBe(
      false,
    );

    Bravo.activate(pathOfRepentance);
    // Answer the on-stack target decision (pick the blood-debt card).
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

    // Legs destroyed → GY.
    expect(Bravo.zone("graveyard")).toContain(pathOfRepentance.canonicalId);
    expect(Bravo.zone("legs")).not.toContain(pathOfRepentance.canonicalId);
    // Blood-debt card is now face-down.
    expect(game.getState().objects[debtId]?.markers.some((m) => m.kind === "face-down")).toBe(true);
  });

  it("boundary: no blood-debt banished → illegal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, life: LIFE, legs: [pathOfRepentance], banished: [snatchRed], deck: 6 },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    // Snatch has no blood-debt → no legal target → activate throws.
    expect(() => game.as(bravo).activate(pathOfRepentance)).toThrow();
    expect(game.as(bravo).zone("legs")).toContain(pathOfRepentance.canonicalId);
  });
});
