/**
 * OMN097 Constella Waves — Lightning Wizard Arms d0.
 *
 * Printed:
 *   Instant - {t} your hero, destroy this: Amp 1
 *
 * CR 8.5.47: Amp is a continuous effect. To amp N, the next time an event the
 * player controls would deal arcane damage this turn, instead it deals that
 * much arcane damage plus N.
 *
 * Happy: activate constella-waves (tap hero + destroy) → Amp 1 registered →
 *   play Zap (3 arcane) → 3 + 1 = 4 arcane damage to opponent.
 * Boundary: out-of-combat tap-hero already tapped → illegal; 0-cost OK.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { constellaWaves } from "../../../../../../cards/src/cards/equipment/constella-waves.ts";
import { zapRed } from "../../../../../../cards/src/cards/actions/zap.ts";

const LIFE = 40;

describe("constella-waves (OMN097)", () => {
  it("core: Instant tap-hero+destroy → Amp 1; next Zap deals 3+1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [constellaWaves],
        hand: [zapRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    expect(Bravo.zone("arms")).toContain(constellaWaves.canonicalId);

    // Activate constella-waves Instant: tap hero + destroy → Amp 1.
    Bravo.activate(constellaWaves);

    // Arms destroyed → GY.
    expect(Bravo.zone("arms")).not.toContain(constellaWaves.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(constellaWaves.canonicalId);

    // Resolve the Instant stack (it's a one-shot asset gain).
    for (let s = 0; s < 16; s += 1) {
      const d = game.getState().decision;
      if (d && game.answerForcedDecision()) continue;
      if (game.getState().rulesStack.length > 0) {
        game.passBoth();
        continue;
      }
      break;
    }

    // Play Zap (0-cost arcane 3 to target hero) — Amp 1 adds +1 = 4 arcane.
    Bravo.play(zapRed, { target: Opponent.id });
    // Resolve the Zap stack + target.
    for (let s = 0; s < 20; s += 1) {
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

    // 3 + Amp 1 = 4 arcane damage.
    expect(Opponent.life()).toBe(LIFE - 4);
  });

  it("boundary: already tapped hero → illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        heroState: { tapped: true },
        arms: [constellaWaves],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // Activate should fail — hero already tapped.
    expect(() => Bravo.activate(constellaWaves)).toThrow();
    expect(Bravo.zone("arms")).toContain(constellaWaves.canonicalId);
  });
});
