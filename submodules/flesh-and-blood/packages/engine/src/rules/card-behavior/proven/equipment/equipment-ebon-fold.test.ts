/**
 * CHN004 Ebon Fold — Shadow Head d0 spellvoid 2.
 *
 * Printed:
 *   Instant - {r}, destroy this: Banish a card from your hand. If it's a
 *   Shadow card, draw a card. Spellvoid 2
 *
 * Model:
 *   Instant mixed {r}+destroy-self → banish hand (bind it) → if Shadow draw
 *
 * Reasoning:
 * 1. Same architecture as Halo of Illumination but banished (not soul) and
 *    Shadow talent filter.
 * 2. Shadow is a talent supertype on type-line types:["Shadow",…].
 * 3. Spellvoid 2 not required for Instant ability AAA.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue } from "../../../fixtures.ts";
import { ebonFold } from "../../../../../../cards/src/cards/equipment/ebon-fold.ts";
import { seepingShadowsYellow } from "../../../../../../cards/src/cards/actions/seeping-shadows.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>, preferCanonicalId?: string): void {
  for (let safety = 0; safety < 40; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const pick =
        (preferCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === preferCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
      if (!pick) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [pick.instanceId] },
        },
      });
      continue;
    }
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
    if (decision?.kind === "payment") {
      const cand = decision.candidates[0];
      if (!cand) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: [cand.instanceId] },
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

describe("ebon-fold (CHN004)", () => {
  it("core mechanic: Instant {r}+destroy → banish Shadow hand → draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [ebonFold],
        hand: [seepingShadowsYellow],
        resourcePoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;
    const handBefore = Bravo.zone("hand").length;

    Bravo.activate(ebonFold);
    drain(game, seepingShadowsYellow.canonicalId);

    expect(Bravo.zone("head")).not.toContain(ebonFold.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(ebonFold.canonicalId);
    expect(Bravo.zone("banished")).toContain(seepingShadowsYellow.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(seepingShadowsYellow.canonicalId);
    expect(Bravo.zone("deck").length).toBe(deckBefore - 1);
    expect(Bravo.zone("hand").length).toBe(handBefore); // -1 banish +1 draw
  });

  it("boundaries: non-Shadow banished does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [ebonFold],
        hand: [nimblismBlue],
        resourcePoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;

    Bravo.activate(ebonFold);
    drain(game, nimblismBlue.canonicalId);

    expect(Bravo.zone("banished")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("deck").length).toBe(deckBefore);
  });

  it("boundaries: 0 RP and no pitch fodder cannot pay Instant cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [ebonFold],
        hand: [],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(() => Bravo.activate(ebonFold)).toThrow();
    expect(Bravo.zone("head")).toContain(ebonFold.canonicalId);
  });
});
