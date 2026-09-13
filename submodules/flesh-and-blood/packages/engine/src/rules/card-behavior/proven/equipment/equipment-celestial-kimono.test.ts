/**
 * DYN213 Celestial Kimono — Illusionist Chest, Ward 1 (no defense).
 *
 * Printed:
 *   Once per turn, when Celestial Kimono or a non-token permanent you control
 *   with ward is destroyed, gain {r}.
 *   Ward 1
 *
 * Reasoning (hand-authored, sibling of DTD217 Diadem of Dreamstate):
 * 1. Prior model only filtered hasKeyword ward — no "you control" / non-token.
 * 2. Remodel: subjectController:controller + excludeMetatypes Token.
 * 3. Ward 1 vs combat (snatch) destroys kimono and prevents 1; trigger gains {r}.
 * 4. OPT limit 1/turn on ability; second destroy same turn not re-fired.
 * 5. Boundary: without kimono, full damage; model guards.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { celestialKimono } from "../../../../../../cards/src/cards/equipment/celestial-kimono.ts";

const SNATCH = 4;
const LIFE = 20;
const WARD = 1;

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
          answer: { kind: "boolean", value: true },
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
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((e) => e.id),
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

describe("celestial-kimono (DYN213)", () => {
  it("core mechanic: ward destroy → gain {r}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        chest: [celestialKimono],
        resourcePoints: 0,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Ward 1 destroys kimono to prevent 1 of combat damage.
    expect(Dash.zone("chest")).not.toContain(celestialKimono.canonicalId);
    expect(Dash.zone("graveyard")).toContain(celestialKimono.canonicalId);
    // Snatch 4 − ward 1 = 3 damage.
    expect(Dash.life()).toBe(LIFE - (SNATCH - WARD));
    // Once-per-turn destroy trigger: gain {r}.
    expect(Dash.resourcePoints()).toBe(1);
  });

  it("boundaries: no kimono → full damage, 0 RP; model trigger shape", () => {
    const bare = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, resourcePoints: 0, deck: 6 },
      { autoPassPriority: false },
    );
    bare.as(bravo).attackWith(snatchRed);
    drain(bare);
    bare.helpers.resolveRestOfCombat();
    expect(bare.as(dash).life()).toBe(LIFE - SNATCH);
    expect(bare.as(dash).resourcePoints()).toBe(0);

    const a1 = celestialKimono.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static") return;
    expect(a1.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "destroy",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "event-object",
          selector: "moved-object",
          relationship: {
            kind: "controller",
            player: "ability-controller",
          },
          filter: {
            hasKeyword: "ward",
            typeBox: {
              excludeMetatypes: ["Token"],
            },
          },
        },
      },
    });
    expect(a1.resolution?.effect).toMatchObject({
      type: "gain-resources",
      amount: 1,
    });
    expect(a1.limit).toMatchObject({ count: 1, per: "turn" });
    expect(
      celestialKimono.base.keywords?.some(
        (k) => k.name === "ward" && (k as { value?: number }).value === 1,
      ),
    ).toBe(true);
    expect(celestialKimono.base.numeric.defense).toBeUndefined();
  });
});
