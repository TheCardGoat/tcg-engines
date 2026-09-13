/**
 * IAR056 Appalling Bearers — Shadow Necromancer Arms d0.
 *
 * Printed:
 *   Instant - Discard a zombie, destroy this: Prevent the next 2 damage that
 *   would be dealt to you this turn.
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Instant mixed cost: discard hand Zombie + destroy-self.
 * 2. Registers this-turn prevent 2 on controller.
 * 3. Defend priority: activate → GY; snatch 4 − 2 = 2; zombie discarded.
 * 4. No Zombie in hand → illegal; remodel types:["Zombie"] (was subtypes).
 *
 * Status: ✅ Instant discard Zombie + destroy → prevent 2; illegal without.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { appallingBearers } from "../../../../../../cards/src/cards/equipment/appalling-bearers.ts";
import { corruptedCorpse } from "../../../../../../cards/src/cards/actions/corrupted-corpse.ts";

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
    if (decision?.kind === "entity-target") {
      const zombiePick =
        decision.candidates.find(
          (c) => game.getState().objects[c.instanceId]?.canonicalId === corruptedCorpse.canonicalId,
        ) ?? decision.candidates[0];
      if (!zombiePick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: zombiePick ? [zombiePick.instanceId] : [],
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

describe("appalling-bearers (IAR056)", () => {
  it("core mechanic: Instant discard Zombie + destroy → prevent 2 of combat damage", () => {
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
        arms: [appallingBearers],
        hand: [corruptedCorpse],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith([]);
    Attacker.pass();
    expect(game.getState().priority?.holderPlayerId).toBe(Defender.id);

    Defender.activate(appallingBearers);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Cost: zombie discarded, arms destroyed to GY.
    expect(Defender.zone("hand")).not.toContain(corruptedCorpse.canonicalId);
    expect(Defender.zone("graveyard")).toContain(corruptedCorpse.canonicalId);
    expect(Defender.zone("arms")).not.toContain(appallingBearers.canonicalId);
    expect(Defender.zone("graveyard")).toContain(appallingBearers.canonicalId);

    // Snatch 4 − prevent 2 = 2 damage.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
  });

  it("boundaries: no Zombie illegal; model mixed discard types Zombie + destroy-self prevent 2", () => {
    const noZombie = FabTestEngine.start(
      {
        hero: dash,
        arms: [appallingBearers],
        hand: [snatchRed],
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => noZombie.as(dash).activate(appallingBearers)).toThrow();

    const a1 = appallingBearers.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        {
          class: "effect",
          type: "discard",
          count: 1,
          filter: { typeBox: { subtypes: ["Zombie"] } },
        },
        { class: "effect", type: "destroy-self" },
      ],
    });
    expect(a1.effect).toMatchObject({
      type: "prevention",
      preventionKind: "fixed",
      amount: 2,
      shielded: { selector: "controller" },
      duration: "this-turn",
    });
    expect(appallingBearers.base.numeric.defense).toBe(0);
  });
});
