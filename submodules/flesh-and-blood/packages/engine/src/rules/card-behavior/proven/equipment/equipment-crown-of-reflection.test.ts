/**
 * EVR137 Crown of Reflection — Illusionist Head d0 Arcane Barrier 1.
 *
 * Printed:
 *   Instant - Destroy Crown of Reflection: Destroy target Illusionist aura
 *   you control. If you do, you may put an Illusionist aura card from your
 *   hand into the arena with cost less than or equal the aura destroyed this
 *   way. Activate only during your action phase.
 *   Arcane Barrier 1
 *
 * Reasoning:
 * 1. Cost filter used count destroyed-this-way (cardinality) instead of the
 *    destroyed aura's cost — fixed to reference binding property cost.
 * 2. Optional put must be destroy.then (if you do), not a free sibling.
 * 3. during-your-action-phase needs facts.phase + turn player (wired).
 * 4. Spectral Shield (Illusionist Token Aura, cost 0) is a legal destroy target;
 *    hand aura cost 0 may enter; higher-cost hand aura must not.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { crownOfReflection } from "../../../../../../cards/src/cards/equipment/crown-of-reflection.ts";
import { spectralShield } from "../../../../../../cards/src/cards/tokens/spectral-shield.ts";
import { stardustSpikeRed } from "../../../../../../cards/src/cards/instants/stardust-spike.ts";
import { auricShardsRed } from "../../../../../../cards/src/cards/instants/auric-shards.ts";

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: {
    acceptOptional?: boolean;
    preferCanonicalId?: string;
  } = {},
): void {
  for (let safety = 0; safety < 60; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: opts.acceptOptional ?? false },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick =
        (opts.preferCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === opts.preferCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
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
    if (game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("crown-of-reflection (EVR137)", () => {
  it("core mechanic: destroy-self + destroy Illus. aura → optional put cost≤ aura from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [crownOfReflection],
        // Spectral Shield: Illusionist Token Aura (cost 0).
        arena: [spectralShield],
        // Cost 0 aura legal after destroying cost-0 shield.
        hand: [stardustSpikeRed],
        deck: 6,
        life: 20,
      },
      { hero: bravo, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    expect(game.getState().phase).toBe("action");
    expect(Dash.zone("arena")).toContain(spectralShield.canonicalId);
    expect(Dash.zone("hand")).toContain(stardustSpikeRed.canonicalId);

    Dash.activate(crownOfReflection);
    // Destroy spectral shield, accept put stardust spike.
    drain(game, {
      acceptOptional: true,
      preferCanonicalId: spectralShield.canonicalId,
    });
    // Second entity-target may be the hand aura after optional accept.
    drain(game, {
      acceptOptional: true,
      preferCanonicalId: stardustSpikeRed.canonicalId,
    });

    expect(Dash.zone("head")).not.toContain(crownOfReflection.canonicalId);
    expect(Dash.zone("graveyard")).toContain(crownOfReflection.canonicalId);
    // Spectral Shield token is destroyed (may leave the game rather than sit in GY).
    expect(Dash.zone("arena")).not.toContain(spectralShield.canonicalId);
    expect(Dash.zone("arena")).toContain(stardustSpikeRed.canonicalId);
    expect(Dash.zone("hand")).not.toContain(stardustSpikeRed.canonicalId);
  });

  it("boundaries: decline put-from-hand — only crown + aura destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [crownOfReflection],
        arena: [spectralShield],
        hand: [stardustSpikeRed],
        deck: 6,
        life: 20,
      },
      { hero: bravo, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    Dash.activate(crownOfReflection);
    drain(game, {
      acceptOptional: false,
      preferCanonicalId: spectralShield.canonicalId,
    });

    expect(Dash.zone("graveyard")).toContain(crownOfReflection.canonicalId);
    expect(Dash.zone("arena")).not.toContain(spectralShield.canonicalId);
    expect(Dash.zone("hand")).toContain(stardustSpikeRed.canonicalId);
    expect(Dash.zone("arena")).not.toContain(stardustSpikeRed.canonicalId);
  });

  it("boundaries: cost 1 hand aura is illegal when destroyed aura is cost 0", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [crownOfReflection],
        arena: [spectralShield],
        // auric-shards cost 1 > destroyed cost 0.
        hand: [auricShardsRed],
        deck: 6,
        life: 20,
      },
      { hero: bravo, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    Dash.activate(crownOfReflection);
    // Destroy shield; if optional opens, accept and ensure no legal hand pick.
    drain(game, {
      acceptOptional: true,
      preferCanonicalId: spectralShield.canonicalId,
    });
    // After optional accept, entity-target for hand should have no cost-1 aura.
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const hasAuric = decision.candidates.some(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === auricShardsRed.canonicalId,
      );
      expect(hasAuric).toBe(false);
      // Decline / empty answer.
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [] },
        },
      });
    }
    drain(game, { acceptOptional: false });

    expect(Dash.zone("hand")).toContain(auricShardsRed.canonicalId);
    expect(Dash.zone("arena")).not.toContain(auricShardsRed.canonicalId);
  });

  it("boundaries: no Illusionist aura — destroy-self still pays; put-from-hand does not fire", () => {
    // At-resolution destroy target is not a quote-time legality gate: the crown
    // can be destroyed as cost even with no aura. Optional put requires "if you do"
    // on the aura destroy, so the hand aura must stay in hand.
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [crownOfReflection],
        hand: [stardustSpikeRed],
        deck: 6,
        life: 20,
      },
      { hero: bravo, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    Dash.activate(crownOfReflection);
    drain(game, { acceptOptional: true });
    expect(Dash.zone("head")).not.toContain(crownOfReflection.canonicalId);
    expect(Dash.zone("hand")).toContain(stardustSpikeRed.canonicalId);
    expect(Dash.zone("arena")).not.toContain(stardustSpikeRed.canonicalId);
  });

  it("model guard: destroy outputBinding it + then optional put cost≤ reference", () => {
    const a1 = crownOfReflection.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.condition).toMatchObject({
      type: "has-status",
      status: "during-your-action-phase",
    });
    expect(a1.effect).toMatchObject({
      type: "if-you-do",
      effect: {
        type: "destroy",
        outputBinding: "it",
        target: {
          selector: "object",
          player: "controller",
          zones: ["permanent"],
          filter: { typeBox: { supertypes: ["Illusionist"], subtypes: ["Aura"] } },
          count: 1,
        },
      },
      then: {
        type: "optional",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            zones: ["hand"],
            filter: {
              typeBox: {
                supertypes: ["Illusionist"],
                subtypes: ["Aura"],
              },
              cost: {
                op: "lte",
                value: { type: "reference", binding: "it", property: "cost" },
              },
            },
          },
          to: { zone: "permanent" },
        },
      },
    });
  });

  it("catalog: Arcane Barrier 1", () => {
    expect(crownOfReflection.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "arcane-barrier", value: 1 })]),
    );
    expect(crownOfReflection.base.numeric.defense).toBe(0);
  });
});
