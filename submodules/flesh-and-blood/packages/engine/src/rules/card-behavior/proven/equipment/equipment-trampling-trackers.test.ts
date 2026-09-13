/**
 * ARR006 Trampling Trackers — Brute Legs d2 temper.
 * Printed: Whenever you beat chest, you may destroy this. If you do, create
 * an Agility token.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { hitTrainer } from "../../../test-trainers.ts";
import { bravo, dash, regurgitatingSlogRed } from "../../../fixtures.ts";
import { tramplingTrackers } from "../../../../../../cards/src/cards/equipment/trampling-trackers.ts";

const beatAtk = hitTrainer({
  slug: "trampling-trackers-beat-atk",
  keywords: [{ name: "beat-chest" }],
  power: 4,
  cost: 0,
});

function drain(game: ReturnType<typeof FabTestEngine.start>, accept = true): void {
  for (let s = 0; s < 96; s += 1) {
    const d = game.getState().decision;
    if (d?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: d.actorId,
        payload: {
          decisionId: d.decisionId,
          stateVersion: d.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      continue;
    }
    if (d?.kind === "entity-target") {
      const pick = d.candidates[0];
      if (!pick && (d.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: d.actorId,
        payload: {
          decisionId: d.decisionId,
          stateVersion: d.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (d?.kind === "payment") {
      const pick = d.candidates[0];
      game.exec({
        move: "answer-decision",
        actorId: d.actorId,
        payload: {
          decisionId: d.decisionId,
          stateVersion: d.stateVersion,
          answer: { kind: "payment", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (d) break;
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

describe("trampling-trackers (ARR006)", () => {
  it("AAA: beat chest → destroy self → create Agility token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [tramplingTrackers],
        hand: [beatAtk, regurgitatingSlogRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const slogId = Bravo.findCardInZone("hand", regurgitatingSlogRed);

    Bravo.play(beatAtk, {
      target: game.as(dash).id,
      beatChest: true,
      beatChestInstanceId: slogId,
    });
    drain(game, true); // accept the optional destroy.

    // Trackers destroyed → GY; Agility token created.
    expect(Bravo.zone("legs")).not.toContain(tramplingTrackers.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(tramplingTrackers.canonicalId);
    expect(Bravo.zone("arena").some((id) => /agility/i.test(String(id)))).toBe(true);
  });

  it("boundary: decline → trackers stay, no Agility", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [tramplingTrackers],
        hand: [beatAtk, regurgitatingSlogRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const slogId = Bravo.findCardInZone("hand", regurgitatingSlogRed);

    Bravo.play(beatAtk, {
      target: game.as(dash).id,
      beatChest: true,
      beatChestInstanceId: slogId,
    });
    drain(game, false); // decline.

    expect(Bravo.zone("legs")).toContain(tramplingTrackers.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(tramplingTrackers.canonicalId);
    expect(Bravo.zone("arena").some((id) => /agility/i.test(String(id)))).toBe(false);
  });
});
