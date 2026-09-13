/**
 * DRO007 Silken Form — Draconic Illusionist Arms d0 Quell 1.
 *
 * Printed:
 *   Instant - Destroy Silken Form: Transform target ash you control into an
 *   Aether Ashwing.
 *   Quell 1
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Instant destroy-self cost; no AP.
 * 2. Target: controller permanent named Ash (token:ash in arena).
 * 3. Prior into "an-aether-ashwing" was English residue — remodel to slug
 *    "aether-ashwing" (token:aether-ashwing registry key).
 * 4. ENGINE gaps exposed: proposeTransform only handled self/controller (not
 *    object at-resolution); transform reduce only stamped test-state markers
 *    without swapping canonicalId for token transforms.
 * 5. Happy: seed ash in arena → activate → arms GY; ash becomes token:aether-ashwing.
 * 6. Boundary: no ash → activate illegal (or no transform target); Quell 1 present.
 */
import { describe, expect, it } from "vitest";
import { expectFabUnplayable, FabTestEngine, fabToken } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { silkenForm } from "../../../../../../cards/src/cards/equipment/silken-form.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    if (game.answerForcedDecision()) continue;
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

describe("silken-form (DRO007)", () => {
  it("core mechanic: Instant destroy → target Ash transforms into Aether Ashwing", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [silkenForm],
        arena: [fabToken("ash")],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("arms")).toContain(silkenForm.canonicalId);
    expect(Bravo.zone("arena")).toContain("token:ash");
    expect(Bravo.zone("arena")).not.toContain("token:aether-ashwing");

    const result = Bravo.activate(silkenForm);
    expect(result.accepted).toBe(true);
    drain(game);

    expect(Bravo.zone("graveyard")).toContain(silkenForm.canonicalId);
    expect(Bravo.zone("arms")).not.toContain(silkenForm.canonicalId);
    // Ash identity rewritten to Aether Ashwing; same arena seat.
    expect(Bravo.zone("arena")).toContain("token:aether-ashwing");
    expect(Bravo.zone("arena")).not.toContain("token:ash");

    const transform = game.committedEvents().find((e) => e.name === "transform") as
      | { data: { into: string } }
      | undefined;
    expect(transform).toBeDefined();
    expect(
      transform!.data.into === "aether-ashwing" || transform!.data.into === "an-aether-ashwing",
    ).toBe(true);
  });

  it("boundaries: opponent Ash is not targeted; model into slug + Quell 1", () => {
    const oppAsh = FabTestEngine.start(
      {
        hero: bravo,
        arms: [silkenForm],
        arena: [],
        deck: 6,
      },
      {
        hero: dash,
        arena: [fabToken("ash")],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    expectFabUnplayable(() => oppAsh.as(bravo).activate(silkenForm), /required activation target/i);
    expect(oppAsh.as(bravo).zone("arms")).toContain(silkenForm.canonicalId);
    expect(oppAsh.as(dash).zone("arena")).toContain("token:ash");
    expect(oppAsh.as(dash).zone("arena")).not.toContain("token:aether-ashwing");

    const a1 = silkenForm.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.cost).toMatchObject({ type: "destroy-self" });
      expect(a1.effect).toMatchObject({
        type: "transform",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["permanent"],
          filter: { name: "Ash" },
          count: 1,
        },
        into: "aether-ashwing",
      });
      // Guard against English article residue.
      expect(a1.effect).not.toMatchObject({ into: "an-aether-ashwing" });
    }
    expect(silkenForm.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "quell", value: 1 })]),
    );
  });
});
