/**
 * SEA081 Head Stone — Necromancer Head d1 Battleworn.
 *
 * Printed:
 *   Instant - Destroy this: Destroy the top card of your deck.
 *   Battleworn
 *
 * Reasoning (hand-authored):
 * 1. Instant destroy-self mills (destroys) deck top — top = last deck index.
 * 2. Seeded deck with hand:[] so opening draw does not pop the mill target.
 * 3. Empty deck: Instant still destroys self; no mill target (no-op / empty).
 * 4. Battleworn: defend d1, −1 counter, seat survives at d0.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { headStone } from "../../../../../../cards/src/cards/equipment/head-stone.ts";

const LIFE = 20;
const SNATCH = 4;
const HELM_D = 1;

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
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("head-stone (SEA081)", () => {
  it("core mechanic: Instant destroy-self → destroy top of deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [headStone],
        hand: [],
        // Top = last element (snatch).
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, snatchRed],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;
    expect(Bravo.zone("deck").at(-1)).toBe(snatchRed.canonicalId);

    Bravo.activate(headStone);
    drain(game);

    // Cost: Head Stone destroyed.
    expect(Bravo.zone("head")).not.toContain(headStone.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(headStone.canonicalId);
    // Effect: top of deck destroyed → GY.
    expect(Bravo.zone("graveyard")).toContain(snatchRed.canonicalId);
    expect(Bravo.zone("deck").length).toBe(deckBefore - 1);
    expect(Bravo.zone("deck")).not.toContain(snatchRed.canonicalId);
  });

  it("boundaries: empty deck still destroys self; battleworn d1; model Instant mill", () => {
    // Empty deck: self destroys; no mill target.
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        head: [headStone],
        hand: [],
        deck: [],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    empty.as(bravo).activate(headStone);
    drain(empty);
    expect(empty.as(bravo).zone("graveyard")).toContain(headStone.canonicalId);
    expect(empty.as(bravo).zone("head")).not.toContain(headStone.canonicalId);
    expect(empty.as(bravo).zone("deck").length).toBe(0);

    // Battleworn: defend keeps seat with −1 (d0 after).
    const bw = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [headStone],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bw.as(bravo).attackWith(snatchRed);
    bw.as(dash).defendWith(headStone);
    drain(bw);
    bw.helpers.resolveRestOfCombat();
    expect(bw.as(dash).zone("head")).toContain(headStone.canonicalId);
    expect(bw.as(dash).life()).toBe(LIFE - (SNATCH - HELM_D));

    const a1 = headStone.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "destroy",
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones: ["deck"],
        position: "top",
        count: 1,
      },
    });
    expect(headStone.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "battleworn" })]),
    );
  });
});
