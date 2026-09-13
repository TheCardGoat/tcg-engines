/**
 * MST071 Skycrest Keikoi — Mystic Head Cloaked (no printed defense).
 *
 * Printed:
 *   Cloaked
 *   Instant - Destroy this: Prevent the next 1 damage that would be dealt to
 *   you this turn. Activate this ability only while this is face-down.
 *
 * Reasoning (hand-authored):
 * 1. Cloaked seats face-down; Instant destroy-self only while face-down.
 * 2. Arms fixed prevention 1 for controller this-turn.
 * 3. During defend priority, activate → destroy + prevent; snatch 4 − 1 = 3.
 * 4. Face-up (marker cleared) cannot activate — has-status face-down must
 *    read the source object's face-down marker (was unrecognised → always false).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { skycrestKeikoi } from "../../../../../../cards/src/cards/equipment/skycrest-keikoi.ts";

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

describe("skycrest-keikoi (MST071)", () => {
  it("core mechanic: cloaked face-down Instant destroy → prevent 1 on next damage", () => {
    // Arm prevention in the defend priority window (same turn as damage).
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
        head: [skycrestKeikoi],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);
    const headId = game.getState().containers.zonesByPlayerId[Defender.id]!.head[0]!;
    expect(game.objectState(headId)?.faceDown).toBe(true);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith([]);
    Attacker.pass();
    expect(game.getState().priority?.holderPlayerId).toBe(Defender.id);

    Defender.activate(skycrestKeikoi);
    drain(game);
    expect(Defender.zone("graveyard")).toContain(skycrestKeikoi.canonicalId);
    expect(Defender.zone("head")).not.toContain(skycrestKeikoi.canonicalId);

    // No block — take combat damage with prevention armed.
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Snatch 4, prevent 1 → 3 damage.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
  });

  it("boundaries: face-up cannot activate; model Instant destroy-self + face-down gate", () => {
    const faceUp = FabTestEngine.start(
      {
        hero: bravo,
        head: [{ card: skycrestKeikoi, state: { faceDown: false } }],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const id = faceUp.getState().containers.zonesByPlayerId[faceUp.as(bravo).id]!.head[0]!;
    expect(faceUp.objectState(id)?.faceDown).toBe(false);
    expect(() => faceUp.as(bravo).activate(skycrestKeikoi)).toThrow();

    const a1 = skycrestKeikoi.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.condition).toMatchObject({ type: "has-status", status: "face-down" });
    expect(a1.effect).toMatchObject({
      type: "prevention",
      preventionKind: "fixed",
      amount: 1,
      shielded: { selector: "controller" },
      duration: "this-turn",
    });
    expect(skycrestKeikoi.base.keywords?.some((k) => k.name === "cloaked")).toBe(true);
  });
});
