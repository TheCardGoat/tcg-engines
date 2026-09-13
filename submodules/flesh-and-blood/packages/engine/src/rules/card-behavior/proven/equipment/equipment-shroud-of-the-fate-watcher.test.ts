/**
 * PEN107 Shroud of the Fate Watcher — Wizard Head d0 Blade Break.
 *
 * Printed:
 *   When this leaves the arena, create a Sigil of Fate token.
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. leave-arena trigger on source when equipment leaves (defend+bladeBreak
 *    is the player-reachable leave path for d0 BB head).
 * 2. Effect: create-token sigil-of-fate under controller (token registry has
 *    PEN120 Sigil of Fate).
 * 3. Blade Break: defend with d0 equipment destroys it to GY.
 * 4. Model: static leave-arena → create-token; bladeBreak keyword.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { shroudOfTheFateWatcher } from "../../../../../../cards/src/cards/equipment/shroud-of-the-fate-watcher.ts";
import { sigilOfFate } from "../../../../../../cards/src/cards/tokens/sigil-of-fate.ts";

const LIFE = 20;
const SNATCH = 4;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
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
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function hasSigilOfFate(game: ReturnType<typeof FabTestEngine.start>, playerId: string): boolean {
  const arena = game.getState().containers.zonesByPlayerId[playerId]!.arena ?? [];
  return arena.some((id) => {
    const canonical = game.getState().objects[id]?.canonicalId ?? "";
    return (
      canonical === sigilOfFate.canonicalId ||
      canonical === `token:sigil-of-fate` ||
      /sigil-of-fate|sigiloffate/i.test(canonical)
    );
  });
}

describe("shroud-of-the-fate-watcher (PEN107)", () => {
  it("core mechanic: defend + bladeBreak leave-arena → create Sigil of Fate", () => {
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
        head: [shroudOfTheFateWatcher],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    expect(Dash.zone("head")).toContain(shroudOfTheFateWatcher.canonicalId);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(shroudOfTheFateWatcher);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Blade Break: d0 equipment goes to GY on defend.
    expect(Dash.zone("head")).not.toContain(shroudOfTheFateWatcher.canonicalId);
    expect(Dash.zone("graveyard")).toContain(shroudOfTheFateWatcher.canonicalId);
    // Full snatch (0 defense).
    expect(Dash.life()).toBe(LIFE - SNATCH);
    // leave-arena creates Sigil of Fate under controller.
    expect(hasSigilOfFate(game, Dash.id)).toBe(true);
  });

  it("boundaries: remains seated until leave; model leave-arena + bladeBreak", () => {
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
        head: [shroudOfTheFateWatcher],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    // Without defending the shroud, no leave — no Sigil.
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).zone("head")).toContain(shroudOfTheFateWatcher.canonicalId);
    expect(hasSigilOfFate(game, game.as(dash).id)).toBe(false);

    const a1 = shroudOfTheFateWatcher.base.abilities?.[0];
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
      type: "create-token",
      token: "sigil-of-fate",
      controller: "controller",
    });
    expect(shroudOfTheFateWatcher.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(shroudOfTheFateWatcher.base.numeric.defense).toBe(0);
  });
});
