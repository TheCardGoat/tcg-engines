/**
 * PEN108 Robe of Resourcefulness — Wizard Chest d0 Blade Break.
 *
 * Printed:
 *   When this leaves the arena, gain {r}{r}.
 *   Blade Break
 *
 * Reasoning (case-by-case; chest twin of PEN107 leave-arena pattern):
 * 1. leave-arena static trigger when the equipment itself leaves (player path:
 *    defend with d0 + Blade Break → destroy → leave-arena).
 * 2. Effect: gain-resources 2 for controller.
 * 3. Without defending the robe, no leave → no free {r}{r}.
 * 4. Model already correct (leave-arena → gain 2; bladeBreak) — no remodel.
 *
 * Status: ✅ BB leave-arena → +2{r}; no-defend stays; model OK.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { robeOfResourcefulness } from "../../../../../../cards/src/cards/equipment/robe-of-resourcefulness.ts";

const LIFE = 20;
const SNATCH = 4;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    if (game.answerForcedDecision()) continue;
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
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
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    return;
  }
}

describe("robe-of-resourcefulness (PEN108)", () => {
  it("core mechanic: defend + bladeBreak leave-arena → gain {r}{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [robeOfResourcefulness],
        resourcePoints: 0,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(dash);

    expect(Defender.resourcePoints()).toBe(0);
    expect(Defender.zone("chest")).toContain(robeOfResourcefulness.canonicalId);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(robeOfResourcefulness);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Blade Break: d0 equipment to GY.
    expect(Defender.zone("chest")).not.toContain(robeOfResourcefulness.canonicalId);
    expect(Defender.zone("graveyard")).toContain(robeOfResourcefulness.canonicalId);
    // Full snatch (0 defense).
    expect(Defender.life()).toBe(LIFE - SNATCH);
    // leave-arena → +2{r}.
    expect(Defender.resourcePoints()).toBe(2);
    expect(game.committedEvents().some((e) => e.name === "gain-assets")).toBe(true);
  });

  it("boundaries: no defend → no leave, no free RP; model leave-arena + bladeBreak", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [robeOfResourcefulness],
        resourcePoints: 0,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    // Without defending the robe, no leave — no free resources.
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).zone("chest")).toContain(robeOfResourcefulness.canonicalId);
    expect(game.as(dash).resourcePoints()).toBe(0);
    expect(game.as(dash).life()).toBe(LIFE - SNATCH);

    const a1 = robeOfResourcefulness.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static") return;
    expect(a1.staticKind).toBe("triggered");
    expect(a1.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "leave-arena",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "source",
          selector: "moved-object",
        },
      },
    });
    expect(a1.resolution?.effect).toMatchObject({
      type: "gain-resources",
      amount: 2,
    });
    expect(robeOfResourcefulness.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(robeOfResourcefulness.base.numeric.defense).toBe(0);
  });
});
