/**
 * ELE115 Crown of Seeds — Earth Head d0.
 *
 * Printed:
 *   Once per Turn Instant - {r}, put a face down card from your arsenal on the
 *   bottom of your deck: Draw a card and prevent the next 1 damage that would
 *   be dealt to your hero this turn.
 *
 * Model:
 *   OPT Instant mixed {r} + move-to-deck arsenal bottom face-down filter
 *   → sequence draw 1 + prevention fixed 1 this-turn
 *
 * Reasoning:
 * 1. move-to-deck from arsenal is already wired (Mask of Malicious Manifestations).
 * 2. filter hasStatus face-down must only accept face-down arsenal (face-up
 *    arsenal alone is not a legal cost).
 * 3. Prevention 1 vs combat damage after Instant arms.
 * 4. OPT: second activate same turn illegal.
 * 5. 0 RP / empty arsenal / no face-down → illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { crownOfSeeds } from "../../../../../../cards/src/cards/equipment/crown-of-seeds.ts";

const SNATCH = 4;

function drain(game: ReturnType<typeof FabTestEngine.start>, pickCanonicalId?: string): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
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
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("crown-of-seeds (ELE115)", () => {
  it("core mechanic: {r} + face-down arsenal bottom → draw + prevent 1 combat damage", () => {
    // Dash attacks; Bravo Instant-activates Crown on defend priority with
    // face-down arsenal, then takes combat (no block).
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        head: [crownOfSeeds],
        arsenal: [{ card: nimblismBlue, state: { faceDown: true } }],
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
        resourcePoints: 1,
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const arsenalId = Bravo.findCardInZone("arsenal", nimblismBlue);
    expect(game.objectState(arsenalId)?.faceDown).toBe(true);

    const handBefore = Bravo.handCount();
    const deckBefore = Bravo.zone("deck").length;

    game.as(dash).attackWith(snatchRed);
    // Defend-step Instant.
    Bravo.defendWith([]);
    game.as(dash).pass();
    Bravo.activate(crownOfSeeds);
    drain(game, nimblismBlue.canonicalId);

    // Paid: arsenal card on deck bottom, RP spent.
    expect(Bravo.zone("arsenal")).not.toContain(nimblismBlue.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);
    // Drew 1.
    expect(Bravo.handCount()).toBe(handBefore + 1);
    expect(Bravo.zone("deck").length).toBe(deckBefore); // put bottom + draw net 0? put adds, draw removes → same if both happened from deck... put bottom increases deck then draw decreases. Started deck N, put +1 → N+1, draw -1 → N.
    // Crown stays (no destroy cost).
    expect(Bravo.zone("head")).toContain(crownOfSeeds.canonicalId);

    game.helpers.resolveRestOfCombat();
    // snatch 4 − prevent 1 = 3 → life 17.
    expect(Bravo.life()).toBe(20 - (SNATCH - 1));
  });

  it("boundaries: face-up arsenal alone cannot pay the face-down cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [crownOfSeeds],
        arsenal: [nimblismBlue],
        hand: [],
        deck: 4,
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.setObjectFaceDown(game.as(bravo).findCardInZone("arsenal", nimblismBlue), false);
    // No face-down arsenal → activate should fail at quote/declare.
    expect(() => game.as(bravo).activate(crownOfSeeds)).toThrow();
  });

  it("boundaries: 0 RP illegal; OPT second activate same turn illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [crownOfSeeds],
        arsenal: [{ card: nimblismBlue, state: { faceDown: true } }],
        hand: [],
        deck: 6,
        resourcePoints: 0,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => game.as(bravo).activate(crownOfSeeds)).toThrow();

    // Seed RP and activate once, then OPT blocks second.
    const game2 = FabTestEngine.start(
      {
        hero: bravo,
        head: [crownOfSeeds],
        arsenal: [
          { card: nimblismBlue, state: { faceDown: true } },
          { card: snatchRed, state: { faceDown: true } },
        ],
        hand: [],
        deck: 6,
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game2.as(bravo);

    Bravo.activate(crownOfSeeds);
    drain(game2, nimblismBlue.canonicalId);
    expect(Bravo.resourcePoints()).toBe(1);

    // Second Instant same turn — OPT.
    expect(() => Bravo.activate(crownOfSeeds)).toThrow();
  });
});
