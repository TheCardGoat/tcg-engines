/**
 * ARA003 Mask of Malicious Manifestations — Assassin/Ranger Head d1 bladeBreak.
 *
 * Printed:
 *   Action - {r}, put a card from your hand or arsenal on the bottom of your
 *   deck, destroy this: Reveal cards from the top of your deck until you reveal
 *   an attack action card. Put it into your hand, then shuffle. Go again
 *   Blade Break
 *
 * Model:
 *   mixed cost: 1 resource + move-to-deck (hand-and-arsenal, bottom, count 1)
 *   + destroy-self; layerKeywords goAgain; sequence reveal first AAC from top
 *   → move to hand → shuffle
 *
 * Reasoning:
 * 1. move-to-deck activation cost was DSL-only (parse returned null) — wired
 *    like discardTargets: declare hand/arsenal card → pay as move-zone bottom.
 * 2. Reveal count was star (all AACs); rebinding would leave the last AAC as
 *    "it". Fixed to count 1 = first AAC from top (put-to-hand core).
 * 3. Multi-reset activation costs (put-bottom + destroy-self) must reserve
 *    sequential destinationRef incarnations or the journal fails atomically.
 * 4. Go again refunds the Action AP after resolve.
 * 5. Boundaries: illegal without payables for {r} (0 RP + empty pitchable hand)
 *    or without a hand-or-arsenal card to put bottom.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, tomeOfFyendalYellow } from "../../../fixtures.ts";
import { maskOfMaliciousManifestations } from "../../../../../../cards/src/cards/equipment/mask-of-malicious-manifestations.ts";

/** Answer cost-target (put bottom) and drain activation stack. Prefer nimblism. */
function resolveMaskActivate(
  game: ReturnType<typeof FabTestEngine.start>,
  bottomCard: { canonicalId: string },
): void {
  for (let safety = 0; safety < 40; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const pick =
        decision.candidates.find(
          (c) => game.getState().objects[c.instanceId]?.canonicalId === bottomCard.canonicalId,
        ) ?? decision.candidates[0];
      if (!pick) throw new Error("no cost-target candidate for put-on-deck");
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
    if (game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("mask-of-malicious-manifestations (ARA003)", () => {
  it("core mechanic: pay {r} + hand-to-bottom + destroy → first AAC from deck to hand + go again", () => {
    // Deck top (last) = non-AAC, then AAC below so first AAC from top is snatch.
    // top = last index: [filler, filler, snatch] means top is snatch.
    // Put non-AAC on top so we prove "find first AAC" still works: top = tome, then snatch.
    // reverse walk for top: deck array bottom-first → top last.
    // deck: [snatchRed, nimblismBlue, tomeOfFyendalYellow] → top is tome (non-AAC),
    // then nimblism, then snatch. First AAC from top is nimblism if Attack, else snatch.
    // nimblism is Non-attack Action. snatch is AAC.
    // Order top-first: tome (non-attack), nimblism (non-attack? Action only), snatch AAC
    // Wait - nimblism is Action Non-attack typically (buff). snatch is Attack.
    // Deck bottom→top: [snatchRed, tomeOfFyendalYellow, nimblismBlue] → top nimblism
    // Walk top: nimblism skip if no Attack, tome skip, snatch match.
    // Bottom-first storage: [snatch, tome, nimblism] top=nimblism.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [maskOfMaliciousManifestations],
        hand: [nimblismBlue], // put bottom as cost
        // bottom … top: snatch is deeper, non-AACs above it
        deck: [snatchRed, tomeOfFyendalYellow, tomeOfFyendalYellow],
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("head")).toContain(maskOfMaliciousManifestations.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(snatchRed.canonicalId);

    Bravo.activate(maskOfMaliciousManifestations);
    resolveMaskActivate(game, nimblismBlue);

    // Destroyed as cost.
    expect(Bravo.zone("head")).not.toContain(maskOfMaliciousManifestations.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(maskOfMaliciousManifestations.canonicalId);
    // Cost card on bottom of deck (or still in deck after shuffle).
    expect(Bravo.zone("hand")).not.toContain(nimblismBlue.canonicalId);
    // First AAC from top → hand.
    expect(Bravo.zone("hand")).toContain(snatchRed.canonicalId);
    // Go again refunds Action AP.
    expect(Bravo.actionPoints()).toBe(1);
    // Paid 1 RP.
    expect(Bravo.resourcePoints()).toBe(0);
  });

  it("core path: arsenal card may pay the put-on-bottom cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [maskOfMaliciousManifestations],
        hand: [],
        arsenal: [nimblismBlue],
        deck: [snatchRed, tomeOfFyendalYellow, tomeOfFyendalYellow],
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.activate(maskOfMaliciousManifestations);
    resolveMaskActivate(game, nimblismBlue);
    expect(Bravo.zone("arsenal")).not.toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("hand")).toContain(snatchRed.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(maskOfMaliciousManifestations.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundaries: activate illegal with 0 resources and no pitchable hand", () => {
    // Put-bottom card lives in arsenal so it cannot be pitched for {r}. Empty
    // hand + 0 RP → maximumResources < 1 and quote denies at activate.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [maskOfMaliciousManifestations],
        hand: [],
        arsenal: [nimblismBlue],
        deck: [snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => game.as(bravo).activate(maskOfMaliciousManifestations)).toThrow();
    expect(game.as(bravo).zone("head")).toContain(maskOfMaliciousManifestations.canonicalId);
  });

  it("boundaries: activate illegal with empty hand and empty arsenal (no put-bottom card)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [maskOfMaliciousManifestations],
        hand: [],
        arsenal: [],
        deck: [snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => game.as(bravo).activate(maskOfMaliciousManifestations)).toThrow();
    expect(game.as(bravo).zone("head")).toContain(maskOfMaliciousManifestations.canonicalId);
  });
});
