/**
 * FAI005 Heat Wave — Draconic Ninja Arms d0 Quell 1.
 *
 * Printed:
 *   Instant - Destroy Heat Wave: Phoenix Flames you control gain +1{p} until
 *   end of turn.
 *   Quell 1
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Instant destroy-self arms → GY.
 * 2. Prior zones permanent never saw PF Action-Attacks on the combat chain.
 *    Remodel combat-chain + moniker Phoenix Flame count star.
 * 3. Happy: attack with PF (p0), Instant → +1{p}, unblocked deal 1.
 * 4. Boundary: Instant with no PF on chain → still destroy, no damage buff path.
 * 5. Quell 1 keyword present.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { heatWave } from "../../../../../../cards/src/cards/equipment/heat-wave.ts";
import { phoenixFlameRed } from "../../../../../../cards/src/cards/actions/phoenix-flame.ts";

const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
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

describe("heat-wave (FAI005)", () => {
  it("core mechanic: Instant destroy → Phoenix Flame on chain +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [heatWave],
        hand: [phoenixFlameRed],
        actionPoints: 1,
        life: LIFE,
        deck: 6,
      },
      { hero: bravo, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Attacker = game.as(dash);
    const Defender = game.as(bravo);

    Attacker.attackWith(phoenixFlameRed);
    // Declare no defense, then both players pass Defend priority.
    Defender.defendWith([]);
    Attacker.pass();
    Defender.pass();
    // Instant in reaction while PF is the active attack.
    expect(game.getState().combat?.step).toMatch(/reaction|defend/);
    // Ensure attacker has priority for Instant.
    if (game.getState().priority?.holderPlayerId === Defender.id) Defender.pass();
    expect(game.getState().priority?.holderPlayerId).toBe(Attacker.id);
    Attacker.activate(heatWave);
    drain(game);

    // Arms destroyed as cost.
    expect(Attacker.zone("arms")).not.toContain(heatWave.canonicalId);
    expect(Attacker.zone("graveyard")).toContain(heatWave.canonicalId);
    // PF base p0 + Heat Wave +1 → 1 damage.
    expect(Defender.life()).toBe(LIFE - 1);
  });

  it("boundaries: no PF on chain still destroys; model combat-chain moniker; Quell 1", () => {
    const bare = FabTestEngine.start(
      {
        hero: dash,
        arms: [heatWave],
        hand: [],
        actionPoints: 1,
        life: LIFE,
        deck: 6,
      },
      { hero: bravo, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    bare.as(dash).activate(heatWave);
    drain(bare);
    expect(bare.as(dash).zone("graveyard")).toContain(heatWave.canonicalId);
    expect(bare.as(dash).zone("arms")).not.toContain(heatWave.canonicalId);
    // No combat damage path.
    expect(bare.as(bravo).life()).toBe(LIFE);

    const a1 = heatWave.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
      expect(a1.effect).toMatchObject({
        type: "modify-numeric",
        property: "power",
        amount: 1,
        duration: "this-turn",
        target: {
          zones: ["combat-chain"],
          filter: { moniker: "Phoenix Flame" },
        },
      });
    }
    expect(
      heatWave.base.keywords?.some(
        (k) => k.name === "quell" && (k as { value?: number }).value === 1,
      ),
    ).toBe(true);
    expect(heatWave.base.numeric.defense).toBe(0);
  });
});
