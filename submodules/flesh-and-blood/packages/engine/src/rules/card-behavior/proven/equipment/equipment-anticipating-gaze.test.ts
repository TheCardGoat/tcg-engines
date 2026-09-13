/**
 * AHA003 Anticipating Gaze — Warrior Head d2 bladeBreak.
 *
 * Printed (i18n):
 *   When a sword attack you control hits, you may remove a +1{p} counter from
 *   the sword. If you do, destroy this and draw a card.
 *   Blade Break
 *
 * Model:
 *   static triggered on hit { subtypes: [Sword], actor: controller, binding: it }
 *   → optional remove-counters (+1p numeric, target binding it)
 *   → then sequence destroy self + draw 1
 *
 * Reasoning:
 * 1. Trigger subject is a Sword attack you control. Dawnblade is Sword 2H.
 * 2. Optional remove-counters is the "you may" principal. "If you do" requires
 *    the remove to actually succeed — no +1{p} counter means empty events and
 *    no destroy/draw (structural: numeric remove must not invent −1{p}).
 * 3. Decline leaves equipment seated and counter intact.
 * 4. Non-sword attacks must not fire the trigger.
 * 5. Blade Break is independent (defend path); core AAA is the hit optional.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, dawnblade, snatchRed } from "../../../fixtures.ts";
import { anticipatingGaze } from "../../../../../../cards/src/cards/equipment/anticipating-gaze.ts";

function weaponId(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
  card: { canonicalId: string },
): string {
  const state = game.getState();
  const _player = state.players[playerId]!;
  const id =
    state.containers.zonesByPlayerId[playerId]!.weapon1.find(
      (iid) => state.objects[iid]?.canonicalId === card.canonicalId,
    ) ??
    state.containers.zonesByPlayerId[playerId]!.weapon2.find(
      (iid) => state.objects[iid]?.canonicalId === card.canonicalId,
    );
  if (!id) throw new Error(`weapon ${card.canonicalId} not seated`);
  return id;
}

/**
 * Walk combat / stack, answering boolean optionals with `accept`.
 * Used so resolveRestOfCombat is never blocked on an unanswered optional.
 */
function resolveWithOptional(game: ReturnType<typeof FabTestEngine.start>, accept: boolean): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      continue;
    }
    if (decision) {
      // Unexpected prompt — stop so the test fails on a clear state.
      throw new Error(`unexpected decision kind: ${decision.kind}`);
    }
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

describe("anticipating-gaze (AHA003)", () => {
  it("core mechanic: sword hit → remove +1{p} → destroy head and draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [anticipatingGaze],
        weapon1: [{ card: dawnblade, state: { powerCounterTotal: 1 } }],
        hand: [],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 8,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const swordId = weaponId(game, Bravo.id, dawnblade);
    expect(game.objectState(swordId)?.powerCounterTotal).toBe(1);
    const handBefore = Bravo.handCount();

    Bravo.activate(dawnblade);
    resolveWithOptional(game, true);

    expect(game.objectState(swordId)?.powerCounterTotal ?? 0).toBe(0);
    expect(Bravo.zone("head")).not.toContain(anticipatingGaze.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(anticipatingGaze.canonicalId);
    expect(Bravo.handCount()).toBe(handBefore + 1);
    expect(Dash.life()).toBeLessThan(20);
  });

  it("boundaries: decline optional — sword keeps counter, head stays, no draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [anticipatingGaze],
        weapon1: [{ card: dawnblade, state: { powerCounterTotal: 1 } }],
        hand: [],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 8,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    const swordId = weaponId(game, Bravo.id, dawnblade);
    const handBefore = Bravo.handCount();

    Bravo.activate(dawnblade);
    resolveWithOptional(game, false);

    expect(game.objectState(swordId)?.powerCounterTotal).toBe(1);
    expect(Bravo.zone("head")).toContain(anticipatingGaze.canonicalId);
    expect(Bravo.handCount()).toBe(handBefore);
  });

  it("boundaries: non-sword attack hit does not destroy head or draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [anticipatingGaze],
        weapon1: [dawnblade],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 8,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("head")).toContain(anticipatingGaze.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(anticipatingGaze.canonicalId);
  });

  it("boundaries: sword hit with no +1{p} counter — accept cannot destroy head", () => {
    // Structural: remove-counters with no matching stack must produce 0 events
    // so optional.then (destroy + draw) does not stage.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [anticipatingGaze],
        weapon1: [dawnblade],
        hand: [],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 8,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const handBefore = Bravo.handCount();

    Bravo.activate(dawnblade);
    // Optional may still open (you may attempt); accepting without a counter
    // must not complete the "if you do" branch.
    resolveWithOptional(game, true);

    expect(Bravo.zone("head")).toContain(anticipatingGaze.canonicalId);
    expect(Bravo.handCount()).toBe(handBefore);
  });
});
