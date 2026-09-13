/**
 * PEN124 Silken Shawl — Illusionist Chest, Ward 1 (no printed defense).
 *
 * Printed:
 *   When this is destroyed, create a Vigor token.
 *   Ward 1
 *
 * Reasoning (case-by-case; chest twin of PEN123 silken-shroud):
 * 1. Ward 1 (CR 8.3.20): when controller would take damage, destroy this to
 *    prevent 1 — auto-applied from equipped chest seat.
 * 2. Ward's destroy is a destroy event → static "when this is destroyed"
 *    creates a Vigor under the controller.
 * 3. Boundary: no shawl → full damage, no Vigor.
 * 4. Model: destroy trigger + ward(1); no defense stat — already correct.
 *
 * Status: ✅ Ward 1 destroy → Vigor; no-shawl full damage; model OK.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { silkenShawl } from "../../../../../../cards/src/cards/equipment/silken-shawl.ts";
import { vigor } from "../../../../../../cards/src/cards/tokens/vigor.ts";

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

function hasVigor(game: ReturnType<typeof FabTestEngine.start>, playerId: string): boolean {
  const arena = game.getState().containers.zonesByPlayerId[playerId]!.arena ?? [];
  return arena.some((id) => {
    const canonical = game.getState().objects[id]?.canonicalId ?? "";
    return (
      canonical === vigor.canonicalId || canonical === "token:vigor" || /vigor/i.test(canonical)
    );
  });
}

describe("silken-shawl (PEN124)", () => {
  it("core mechanic: Ward 1 destroys shawl on damage → create Vigor", () => {
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
        chest: [silkenShawl],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    expect(Dash.zone("chest")).toContain(silkenShawl.canonicalId);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Snatch 4 − ward 1 = 3 damage.
    expect(Dash.life()).toBe(LIFE - (SNATCH - 1));
    // Ward destroys the equipment.
    expect(Dash.zone("chest")).not.toContain(silkenShawl.canonicalId);
    expect(Dash.zone("graveyard")).toContain(silkenShawl.canonicalId);
    // Destroy trigger creates Vigor.
    expect(hasVigor(game, Dash.id)).toBe(true);
  });

  it("boundaries: no shawl → full damage, no Vigor; model ward + destroy trigger", () => {
    const bare = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    bare.as(bravo).attackWith(snatchRed);
    bare.helpers.resolveRestOfCombat();
    expect(bare.as(dash).life()).toBe(LIFE - SNATCH);
    expect(hasVigor(bare, bare.as(dash).id)).toBe(false);

    const a1 = silkenShawl.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static") return;
    expect(a1.staticKind).toBe("triggered");
    expect(a1.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "destroy",
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
      type: "create-token",
      token: "vigor",
      controller: "controller",
    });
    expect(
      silkenShawl.base.keywords?.some(
        (k) => k.name === "ward" && (k as { value?: number }).value === 1,
      ),
    ).toBe(true);
    expect(silkenShawl.base.numeric.defense).toBeUndefined();
  });
});
