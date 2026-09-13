/**
 * MPG117 Sunkwater Scalers — Generic Legs d0 Blade Break.
 * Printed: When this defends, put a face-up card from your arsenal on the
 * bottom of your deck. If you do, draw a card and this gets +1{d} UEOT.
 * Mirrors proven MPG115 sunkwater-exoshell (Chest twin).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { sunkwaterScalers } from "../../../../../../cards/src/cards/equipment/sunkwater-scalers.ts";

const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let s = 0; s < 48; s += 1) {
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
      const pick = d.candidates[0];
      if (!pick && (d.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: d.actorId,
        payload: {
          decisionId: d.decisionId,
          stateVersion: d.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (d) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("sunkwater-scalers (MPG117)", () => {
  it("core: defend face-up arsenal bottom → draw + +1{d} + BB", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        legs: [sunkwaterScalers],
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    const handBefore = Defender.zone("hand").length;

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(sunkwaterScalers);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Arsenal → deck bottom.
    expect(Defender.zone("arsenal")).toHaveLength(0);
    // Drew 1 card (arsenal moved to deck bottom, then drew 1 from deck).
    expect(Defender.zone("hand").length).toBeGreaterThan(handBefore);
    // Legs BB → GY.
    expect(Defender.zone("legs")).not.toContain(sunkwaterScalers.canonicalId);
    expect(Defender.zone("graveyard")).toContain(sunkwaterScalers.canonicalId);
  });

  it("boundary: empty arsenal → no draw, no +1{d}; BB full dmg", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, legs: [sunkwaterScalers], deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(sunkwaterScalers);
    drain(game);
    game.helpers.resolveRestOfCombat();
    // d0 no arsenal → full 4 damage; BB GY.
    expect(game.as(dash).life()).toBe(LIFE - 4);
    expect(game.as(dash).zone("legs")).not.toContain(sunkwaterScalers.canonicalId);
  });
});
