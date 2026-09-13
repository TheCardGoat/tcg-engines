/**
 * ARR003 Echo Casque — Brute Head d1 battleworn.
 *
 * Printed:
 *   Whenever you beat chest, you may {r} and destroy this. If you do, draw a
 *   card. Battleworn
 *
 * Model (after fix):
 *   static trigger on beat-chest (controller)
 *   optional → pay 1 resource → then sequence destroy self + draw 1
 *
 * Reasoning:
 * 1. Prior model sequenced pay+destroy as peers with outer then:draw. Empty
 *    pay (0 RP) would still destroy and draw. Nested pay.then is correct.
 * 2. Beat chest is paid as play additional cost (discard 6+ power); emits
 *    beat-chest event that arms this trigger.
 * 3. Decline optional leaves casque equipped and hand size unchanged.
 * 4. Accept with 1 RP: casque destroyed, draw 1, RP spent.
 * 5. Accept with 0 RP: pay produces no events → destroy/draw do not stage.
 * 6. Battleworn not re-proven here (covered by keyword suite / skullcap).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { hitTrainer } from "../../../test-trainers.ts";
import { bravo, dash, regurgitatingSlogRed } from "../../../fixtures.ts";
import { echoCasque } from "../../../../../../cards/src/cards/equipment/echo-casque.ts";

const beatAtk = hitTrainer({
  slug: "echo-casque-beat-atk",
  keywords: [{ name: "beat-chest" }],
  power: 4,
  cost: 0,
});

/** Answer optional (casque pay/destroy) and drain stack/combat. */
function drain(game: ReturnType<typeof FabTestEngine.start>, acceptOptional: boolean | null): void {
  for (let safety = 0; safety < 50; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      if (acceptOptional === null) {
        throw new Error("unexpected boolean decision when no optional expected");
      }
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: acceptOptional },
        },
      });
      continue;
    }
    if (decision?.kind === "payment") {
      // Should not need pitch when RP is pre-seeded; auto-fail if it appears.
      throw new Error("unexpected payment decision during echo-casque resolve");
    }
    if (decision) {
      // ordering / entity — answer conservatively
      if (decision.kind === "ordering") {
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
      break;
    }
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("echo-casque (ARR003)", () => {
  it("core mechanic: beat chest → pay {r} + destroy casque → draw 1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [echoCasque],
        hand: [beatAtk, regurgitatingSlogRed],
        deck: [
          regurgitatingSlogRed,
          regurgitatingSlogRed,
          regurgitatingSlogRed,
          regurgitatingSlogRed,
        ],
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const handBefore = Bravo.zone("hand").length;
    const deckBefore = Bravo.zone("deck").length;
    const slogId = Bravo.findCardInZone("hand", regurgitatingSlogRed);

    Bravo.play(beatAtk, {
      target: game.as(dash).id,
      beatChest: true,
      beatChestInstanceId: slogId,
    });
    drain(game, true);

    expect(Bravo.zone("head")).not.toContain(echoCasque.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(echoCasque.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);
    // Beat-chest discarded slog; destroy casque to GY; draw 1 from deck.
    // Net hand: started with beat+slog, played beat, discarded slog, drew 1 → 1 card.
    expect(Bravo.zone("hand").length).toBe(1);
    expect(Bravo.zone("deck").length).toBe(deckBefore - 1);
    const pay = game.committedEvents().find((event) => event.name === "pay-resources");
    const destroy = game
      .committedEvents()
      .find(
        (event) => event.name === "destroy" && event.source?.canonicalId === echoCasque.canonicalId,
      );
    expect(pay).toBeDefined();
    expect(destroy).toBeDefined();
    // The payment transaction settles alone; pay.then is proposed only from
    // the committed receipt, never speculatively in the payment batch.
    expect(destroy?.batchId).not.toBe(pay?.batchId);
    expect(game.committedEvents().indexOf(destroy!)).toBeGreaterThan(
      game.committedEvents().indexOf(pay!),
    );
    void handBefore;
  });

  it("boundaries: decline optional → casque stays, no draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [echoCasque],
        hand: [beatAtk, regurgitatingSlogRed],
        deck: [regurgitatingSlogRed, regurgitatingSlogRed, regurgitatingSlogRed],
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;
    const slogId = Bravo.findCardInZone("hand", regurgitatingSlogRed);

    Bravo.play(beatAtk, {
      target: game.as(dash).id,
      beatChest: true,
      beatChestInstanceId: slogId,
    });
    drain(game, false);

    expect(Bravo.zone("head")).toContain(echoCasque.canonicalId);
    expect(Bravo.resourcePoints()).toBe(1);
    expect(Bravo.zone("deck").length).toBe(deckBefore);
  });

  it("boundaries: accept with 0 RP → pay fails closed (no destroy, no draw)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [echoCasque],
        hand: [beatAtk, regurgitatingSlogRed],
        deck: [regurgitatingSlogRed, regurgitatingSlogRed, regurgitatingSlogRed],
        actionPoints: 1,
        resourcePoints: 0,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;
    const slogId = Bravo.findCardInZone("hand", regurgitatingSlogRed);

    Bravo.play(beatAtk, {
      target: game.as(dash).id,
      beatChest: true,
      beatChestInstanceId: slogId,
    });
    drain(game, true);

    expect(Bravo.zone("head")).toContain(echoCasque.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(echoCasque.canonicalId);
    expect(Bravo.zone("deck").length).toBe(deckBefore);
  });

  it("boundaries: play beat-chest attack without beating chest → casque does not trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [echoCasque],
        hand: [beatAtk, regurgitatingSlogRed],
        deck: [regurgitatingSlogRed, regurgitatingSlogRed, regurgitatingSlogRed],
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.play(beatAtk, { target: game.as(dash).id });
    // No beat-chest → no optional from casque.
    drain(game, null);

    expect(Bravo.zone("head")).toContain(echoCasque.canonicalId);
    expect(Bravo.resourcePoints()).toBe(1);
    expect(Bravo.zone("hand")).toContain(regurgitatingSlogRed.canonicalId);
  });
});
