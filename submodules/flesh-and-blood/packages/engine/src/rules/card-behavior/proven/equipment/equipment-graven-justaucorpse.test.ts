/**
 * AGB005 Graven Justaucorpse — Necromancer Chest d1 Battleworn.
 *
 * Printed:
 *   Instant - Destroy this: Discard a card. Gain {r} equal to its pitch value.
 *   Battleworn
 *
 * Reasoning (hand-authored):
 * 1. Instant destroy-self cost removes chest to GY.
 * 2. Discard hand at-resolution with outputBinding "it".
 * 3. gain-resources amount = reference binding "it" property pitch (LKI after
 *    discard) — blue pitch 3 → +3{r}, red pitch 1 → +1{r}.
 * 4. Empty hand → discard unresolved / activate illegal or no RP gain.
 * 5. Battleworn d1 defend contributes 1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { gravenJustaucorpse } from "../../../../../../cards/src/cards/equipment/graven-justaucorpse.ts";

const LIFE = 20;
const SNATCH = 4;

function drain(game: ReturnType<typeof FabTestEngine.start>, pickCanonicalId?: string): void {
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
      const pick =
        (pickCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === pickCanonicalId,
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

describe("graven-justaucorpse (AGB005)", () => {
  it("core mechanic: Instant destroy → discard blue (pitch 3) → gain 3{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [gravenJustaucorpse],
        hand: [nimblismBlue],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(gravenJustaucorpse);
    drain(game, nimblismBlue.canonicalId);

    expect(Bravo.zone("chest")).not.toContain(gravenJustaucorpse.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(gravenJustaucorpse.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(nimblismBlue.canonicalId);
    // Pitch 3 blue discarded → +3 resources.
    expect(Bravo.resourcePoints()).toBe(3);
    expect(Bravo.zone("graveyard")).toContain(nimblismBlue.canonicalId);
  });

  it("boundaries: discard red (pitch 1) → +1{r}; empty hand illegal; battleworn d1; model", () => {
    const red = FabTestEngine.start(
      {
        hero: bravo,
        chest: [gravenJustaucorpse],
        hand: [snatchRed],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    red.as(bravo).activate(gravenJustaucorpse);
    drain(red, snatchRed.canonicalId);
    expect(red.as(bravo).resourcePoints()).toBe(1);

    const empty = FabTestEngine.start(
      {
        hero: bravo,
        chest: [gravenJustaucorpse],
        hand: [],
        resourcePoints: 0,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    // Empty hand: Instant may still pay destroy-self; unresolved discard must
    // not mint free resources (RP stays 0).
    try {
      empty.as(bravo).activate(gravenJustaucorpse);
      drain(empty);
    } catch {
      // Rejected at legality or mid-resolution — still no free RP.
    }
    expect(empty.as(bravo).resourcePoints()).toBe(0);

    // Battleworn d1: defend contributes 1.
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
        chest: [gravenJustaucorpse],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bw.as(bravo).attackWith(snatchRed);
    bw.as(dash).defendWith(gravenJustaucorpse);
    drain(bw);
    bw.helpers.resolveRestOfCombat();
    drain(bw);
    expect(bw.as(dash).life()).toBe(LIFE - (SNATCH - 1));

    const a1 = gravenJustaucorpse.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "sequence",
      steps: [
        {
          type: "discard",
          target: { zones: ["hand"], count: 1 },
          outputBinding: "it",
        },
        {
          type: "gain-resources",
          amount: {
            type: "reference",
            binding: "it",
            property: "pitch",
          },
        },
      ],
    });
    expect(gravenJustaucorpse.base.numeric.defense).toBe(1);
    expect(gravenJustaucorpse.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "battleworn" })]),
    );
  });
});
