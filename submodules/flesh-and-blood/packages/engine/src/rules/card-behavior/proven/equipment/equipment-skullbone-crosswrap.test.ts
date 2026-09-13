/**
 * ARC041 Skullbone Crosswrap — Ranger Head d1.
 *
 * Printed a1: Once per Turn Action — Turn a face-down card in your arsenal
 * face up: Opt 1. Go again.
 *
 * CR 8.5.22: Opt looks at the top N cards, then returns them to the top or
 * bottom in the chosen order; with fewer cards it looks at all of them.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { skullboneCrosswrap } from "../../../../../../cards/src/cards/equipment/skullbone-crosswrap.ts";
import { spireSnipingRed as spireSniping } from "../../../../../../cards/src/cards/actions/spire-sniping.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 32; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick) throw new Error("expected a face-down arsenal target");
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
    if (decision?.kind === "partition") {
      const ids = decision.entries.map((entry) => entry.id);
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "partition", groups: { top: ids, bottom: [] } },
        },
      });
      continue;
    }
    if (decision) throw new Error(`unexpected decision ${decision.kind}`);
    if (game.getState().rulesStack.length === 0) return;
    game.passBoth();
  }
  throw new Error("Skullbone Crosswrap did not finish resolving");
}

describe("skullbone-crosswrap (ARC041)", () => {
  it("a1: turns the chosen face-down arsenal card face-up, Opts 1, and refunds its Action point", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [skullboneCrosswrap],
        arsenal: [{ card: nimblismBlue, state: { faceDown: true } }],
        hand: [],
        deck: [snatchRed],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const arsenalId = Bravo.findCardInZone("arsenal", nimblismBlue);

    Bravo.activate(skullboneCrosswrap);
    drain(game);

    expect(game.objectState(arsenalId)?.faceDown).toBe(false);
    expect(Bravo.zone("arsenal")).toContain(nimblismBlue.canonicalId);
    // Action activation spends 1 AP; printed go again returns it after Opt.
    expect(Bravo.actionPoints()).toBe(1);
    // Opt reorders but does not remove the sole deck card.
    expect(Bravo.zone("deck")).toEqual([snatchRed.canonicalId]);
  });

  it("boundaries: a face-up-only arsenal cannot pay a1, and once-per-turn blocks a second face-down card", () => {
    const faceUpOnly = FabTestEngine.start(
      {
        hero: bravo,
        head: [skullboneCrosswrap],
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        hand: [],
        deck: 4,
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    expect(() => faceUpOnly.as(bravo).activate(skullboneCrosswrap)).toThrow();

    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [skullboneCrosswrap],
        arsenal: [
          { card: nimblismBlue, state: { faceDown: true } },
          { card: snatchRed, state: { faceDown: true } },
        ],
        hand: [],
        deck: [snatchRed],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(skullboneCrosswrap);
    drain(game);
    expect(() => Bravo.activate(skullboneCrosswrap)).toThrow();
  });

  it("timing: Spire Sniping's face-up trigger resolves before Crosswrap's Opt", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [skullboneCrosswrap],
        arsenal: [{ card: spireSniping, state: { faceDown: true } }],
        hand: [],
        deckTop: [nimblismBlue, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // Turning the arrow face-up pays Crosswrap's activation cost. That event
    // creates Spire Sniping's triggered layer above the still-unresolved
    // Crosswrap layer (CR 5.2.2, 6.6.6).
    Bravo.activate(skullboneCrosswrap);

    const spireLook = game.advanceToDecision(Bravo, "partition");
    expect(spireLook.entries).toHaveLength(2);
    game.answerDecision(Bravo.id, {
      kind: "partition",
      groups: { top: spireLook.entries.map((entry) => entry.id) },
    });

    // Only after Spire's trigger resolves does Crosswrap resolve its own Opt 1.
    const crosswrapOpt = game.advanceToDecision(Bravo, "partition");
    expect(crosswrapOpt.entries).toHaveLength(1);
    game.answerDecision(Bravo.id, {
      kind: "partition",
      groups: { top: crosswrapOpt.entries.map((entry) => entry.id), bottom: [] },
    });
    game.helpers.untilIdle();

    expect(Bravo.zone("arsenal")).toContain(spireSniping.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);
  });
});
