/**
 * OUT176 Seeker's Gilet — Generic Chest (no printed defense).
 *
 * Printed:
 *   Instant - {r}, destroy Seeker's Gilet: Prevent the next 1 damage that
 *   would be dealt to your hero this turn. Opt 1
 *
 * Reasoning (case-by-case; seeker-s-hood twin on Chest):
 * 1. Instant 1{r}+destroy-self arms prevent 1 + Opt 1 (partition deck top).
 * 2. Defend priority: activate → GY, opt reorders, then snatch 4−1 damage.
 * 3. Insufficient RP illegal.
 *
 * Status: ✅ Instant {r} destroy → prevent 1 + Opt 1; 0 RP illegal; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { seekerSGilet } from "../../../../../../cards/src/cards/equipment/seeker-s-gilet.ts";

const SNATCH = 4;
const LIFE = 20;

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
    if (decision?.kind === "partition") {
      const ids = decision.entries.map((e) => e.id);
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "partition",
            groups: { top: ids, bottom: [] },
          },
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("seeker-s-gilet (OUT176)", () => {
  it("core mechanic: Instant {r} destroy → prevent 1 + Opt 1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        life: LIFE,
        chest: [seekerSGilet],
        resourcePoints: 1,
        deck: [snatchRed, nimblismBlue, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith([]);
    Attacker.pass();
    Defender.activate(seekerSGilet);
    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(Defender.zone("graveyard")).toContain(seekerSGilet.canonicalId);
    expect(Defender.zone("chest")).not.toContain(seekerSGilet.canonicalId);
    expect(Defender.resourcePoints()).toBe(0);
    // Snatch 4, prevent 1 → 3 damage.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
  });

  it("boundaries: 0 RP illegal; model Instant destroy + prevent + opt", () => {
    const poor = FabTestEngine.start(
      {
        hero: bravo,
        hand: [],
        chest: [seekerSGilet],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => poor.as(bravo).activate(seekerSGilet)).toThrow();
    expect(poor.as(bravo).zone("chest")).toContain(seekerSGilet.canonicalId);

    const a1 = seekerSGilet.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { class: "asset", type: "resources", amount: 1 },
        { class: "effect", type: "destroy-self" },
      ],
    });
    expect(a1.effect).toMatchObject({
      type: "sequence",
      steps: [
        {
          type: "prevention",
          preventionKind: "fixed",
          amount: 1,
          duration: "this-turn",
        },
        { type: "opt", count: 1 },
      ],
    });
    expect(seekerSGilet.base.numeric.defense).toBeUndefined();
  });
});
