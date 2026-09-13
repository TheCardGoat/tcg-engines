/**
 * ARK005 Danger Digits — Assassin/Ninja Arms d0.
 *
 * Printed:
 *   Attack Reaction - Destroy this: Target dagger you control that isn't on
 *   the active chain link deals 1 damage to the defending hero. If damage is
 *   dealt this way, the dagger has hit. Destroy the dagger.
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Prior model used English residue subtypes (You/Control/That/Isn't) on
 *    combat-chain — dead targets. Remodel: on-stack Dagger in weapon zone.
 * 2. ENGINE: deal-damage.source is the chosen dagger; binds it + stamps
 *    damage-dealt-this-way; set-status hit emits hit event; destroy binding.
 * 3. Happy: open AR window with Snatch; seat Zephyr Needle in weapon1; AR
 *    destroy digits → choose needle → defending hero −1 life; needle + digits
 *    in GY; hit event for needle.
 * 4. Boundary: no dagger → activation illegal (required targets unavailable).
 * 5. Boundary: out of reaction step illegal.
 * 6. d0 — no BW/BB.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { dangerDigits } from "../../../../../../cards/src/cards/equipment/danger-digits.ts";
import { zephyrNeedle } from "../../../../../../cards/src/cards/weapons/zephyr-needle.ts";

const LIFE = 40;
const SNATCH = 4;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 96; safety += 1) {
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
      const dagger = decision.candidates.find(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === zephyrNeedle.canonicalId,
      );
      const pick = dagger ?? decision.candidates[0];
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

describe("danger-digits (ARK005)", () => {
  it("core mechanic: AR destroy → off-chain dagger deals 1 → hit → destroy dagger", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [dangerDigits],
        weapon1: [zephyrNeedle],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    expect(Bravo.zone("weapon1")).toContain(zephyrNeedle.canonicalId);
    expect(Bravo.zone("arms")).toContain(dangerDigits.canonicalId);

    Bravo.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Opponent.defendWith([]);
    Bravo.pass();
    Opponent.pass();
    expect(game.combat()?.step).toBe("reaction");

    const lifeBefore = Opponent.life();
    Bravo.activate(dangerDigits);
    drain(game);

    // Digits destroyed as AR cost.
    expect(Bravo.zone("arms")).not.toContain(dangerDigits.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(dangerDigits.canonicalId);

    // Finish combat fully so AR layer + chain close settle.
    for (let safety = 0; safety < 64; safety += 1) {
      drain(game);
      if (!game.combat() && game.getState().rulesStack.length === 0) break;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio) {
        try {
          game.exec({ move: "pass", actorId: prio, payload: {} });
        } catch {
          break;
        }
      } else break;
    }

    // Off-chain dagger dealt 1 and was destroyed.
    const names = game.committedEvents().map((e) => e.name);
    expect(names).toContain("deal-damage");
    // Digits cost destroy + dagger destroy.
    expect(names.filter((n) => n === "destroy").length).toBeGreaterThanOrEqual(2);
    expect(Bravo.zone("weapon1")).not.toContain(zephyrNeedle.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(zephyrNeedle.canonicalId);

    // Dagger 1 + Snatch 4 (undefended).
    expect(Opponent.life()).toBe(lifeBefore - 1 - SNATCH);

    // Hit event for the dagger (has hit).
    expect(
      game
        .committedEvents()
        .some(
          (e) =>
            e.name === "hit" &&
            "object" in e.data &&
            (e.data as { object?: { canonicalId?: string } }).object?.canonicalId ===
              zephyrNeedle.canonicalId,
        ),
    ).toBe(true);
  });

  it("boundaries: no dagger illegal; out of AR illegal; model", () => {
    // No dagger seated: required on-stack source unavailable.
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        arms: [dangerDigits],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    empty.as(bravo).attackWith(snatchRed);
    empty.as(dash).defendWith([]);
    empty.as(bravo).pass();
    empty.as(dash).pass();
    expect(empty.combat()?.step).toBe("reaction");
    const reject = empty.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: empty.as(bravo).card(dangerDigits) },
    });
    expect(reject.accepted).toBe(false);
    expect(empty.as(bravo).zone("arms")).toContain(dangerDigits.canonicalId);

    // Out of combat illegal.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        arms: [dangerDigits],
        weapon1: [zephyrNeedle],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(dangerDigits)).toThrow();
    expect(bare.as(bravo).zone("arms")).toContain(dangerDigits.canonicalId);

    const a1 = dangerDigits.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("attack-reaction");
      expect(a1.cost).toMatchObject({ type: "destroy-self" });
      expect(a1.effect).toMatchObject({
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            amount: 1,
            target: { selector: "defending-hero" },
            source: {
              declared: "on-stack",
              zones: ["weapon"],
              filter: { typeBox: { subtypes: ["Dagger"] } },
              count: 1,
            },
          },
          {
            type: "conditional",
            condition: {
              type: "binding-numeric",
              binding: "damage-dealt-this-way",
              comparison: { op: "gt", value: 0 },
            },
            then: {
              type: "set-status",
              status: "hit",
              target: { selector: "binding", binding: "it" },
            },
          },
          {
            type: "destroy",
            target: { selector: "binding", binding: "it" },
          },
        ],
      });
    }
    expect(dangerDigits.base.numeric.defense).toBe(0);
  });
});
