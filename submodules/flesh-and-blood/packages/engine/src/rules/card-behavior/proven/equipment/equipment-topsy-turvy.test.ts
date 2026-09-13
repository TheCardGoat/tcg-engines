/**
 * PEN276 Topsy Turvy — Chaos Head d0 Arcane Barrier 1.
 *
 * Printed:
 *   Instant - Destroy this: Until end of turn, if one or more cards would be
 *   put on top of a deck, instead they're put on the bottom.
 *   Arcane Barrier 1
 *
 * Reasoning (hand-authored):
 * 1. Instant destroy-self registers a this-turn replacement (move-zone → deck
 *    position top rewritten to bottom).
 * 2. Engine gap: supportedCanonicalReplacement / applyReplacement had no
 *    deck-top→bottom rewrite; replacementExpiry lacked until-end-of-turn.
 * 3. Core: after Topsy, Memorial Ground (put GY AAC on top) lands on bottom.
 * 4. Boundary: without Topsy, same Instant puts on top; second activate illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { topsyTurvy } from "../../../../../../cards/src/cards/equipment/topsy-turvy.ts";
import { memorialGroundRed } from "../../../../../../cards/src/cards/instants/memorial-ground.ts";

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
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick =
        decision.candidates.find(
          (c) => game.getState().objects[c.instanceId]?.canonicalId === snatchRed.canonicalId,
        ) ?? decision.candidates[0];
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

describe("topsy-turvy (PEN276)", () => {
  it("core mechanic: Instant destroy → put-on-top becomes put-on-bottom", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [topsyTurvy],
        hand: [memorialGroundRed],
        graveyard: [snatchRed],
        // Known deck so top/bottom asserts are stable (index 0 = bottom).
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(topsyTurvy);
    drain(game);

    expect(Bravo.zone("head")).not.toContain(topsyTurvy.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(topsyTurvy.canonicalId);
    expect(game.getState().replacementEffects.length).toBeGreaterThanOrEqual(1);
    expect(game.committedEvents().some((e) => e.name === "register-replacement")).toBe(true);

    // Memorial Ground: put snatch from GY on top — replaced to bottom.
    Bravo.must.playInstant(memorialGroundRed);
    drain(game);

    expect(Bravo.zone("graveyard")).not.toContain(snatchRed.canonicalId);
    const deck = Bravo.zone("deck");
    // Engine deck: index 0 = bottom, end = top.
    expect(deck[0]).toBe(snatchRed.canonicalId);
    expect(deck[deck.length - 1]).not.toBe(snatchRed.canonicalId);
  });

  it("boundaries: without Topsy put stays on top; second activate illegal; model + AB1", () => {
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        hand: [memorialGroundRed],
        graveyard: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    bare.as(bravo).must.playInstant(memorialGroundRed);
    drain(bare);
    const deckBare = bare.as(bravo).zone("deck");
    expect(deckBare[deckBare.length - 1]).toBe(snatchRed.canonicalId);

    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [topsyTurvy],
        deck: 6,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).activate(topsyTurvy);
    drain(game);
    expect(() => game.as(bravo).activate(topsyTurvy)).toThrow();

    const a1 = topsyTurvy.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "replacement",
      replaces: {
        name: "move-zone",
        to: "deck",
        position: "top",
      },
      modification: {
        type: "move-card",
        to: { zone: "deck", position: "bottom" },
      },
      duration: "this-turn",
    });
    expect(
      topsyTurvy.base.keywords?.some(
        (k) => k.name === "arcane-barrier" && (k as { value?: number }).value === 1,
      ),
    ).toBe(true);
    expect(topsyTurvy.base.numeric.defense).toBe(0);
  });
});
