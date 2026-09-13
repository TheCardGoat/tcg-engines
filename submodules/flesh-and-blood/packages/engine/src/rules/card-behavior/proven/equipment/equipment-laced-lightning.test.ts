/**
 * OMN144 Laced Lightning — Lightning Legs d0.
 * Printed: Instant - {r}{r}, destroy this: Prevent the next 1 damage that
 * would be dealt to you this turn. If you prevent damage this way, create an
 * Embodiment of Lightning token.
 * Mirrors proven OMN142 constella-tiara (prevent then create-token pattern).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { lacedLightning } from "../../../../../../cards/src/cards/equipment/laced-lightning.ts";

const LIFE = 20;
const SNATCH = 4;

describe("laced-lightning (OMN144)", () => {
  it("core: Instant 2{r}+destroy → prevent 1; create Embodiment of Lightning", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, legs: [lacedLightning], hand: [], resourcePoints: 2, deck: 6 },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    // Attack with Snatch.
    Attacker.attackWith(snatchRed);
    // At defend step, defender has priority — activate the Instant.
    Defender.defendWith([]);
    Attacker.pass();
    Defender.activate(lacedLightning);
    // Resolve the Instant layer + rest of combat.
    for (let s = 0; s < 20; s += 1) {
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
    if (game.combat()?.open) game.helpers.resolveRestOfCombat();

    // Legs destroyed → GY.
    expect(Defender.zone("legs")).not.toContain(lacedLightning.canonicalId);
    expect(Defender.zone("graveyard")).toContain(lacedLightning.canonicalId);
    // Snatch 4 − prevent 1 = 3 damage.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
    // Prevention fired → create Embodiment of Lightning.
    expect(Defender.zone("arena")).toContain("token:embodiment-of-lightning");
  });

  it("boundary: 1{r} insufficient → illegal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, legs: [lacedLightning], hand: [], resourcePoints: 1, deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).attackWith(snatchRed);
    expect(() => game.as(dash).activate(lacedLightning)).toThrow();
    expect(game.as(dash).zone("legs")).toContain(lacedLightning.canonicalId);
  });
});
