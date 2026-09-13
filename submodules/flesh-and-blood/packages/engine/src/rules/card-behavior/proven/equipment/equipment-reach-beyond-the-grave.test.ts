/**
 * PEN154 Reach Beyond the Grave — Necromancer Arms d1.
 *
 * Printed a1: Action — Destroy this: Return an ally card from your graveyard
 * to your hand, then discard a card. Go again.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { limpitHopALongYellow } from "../../../../../../cards/src/cards/actions/limpit-hop-a-long.ts";
import { reachBeyondTheGrave } from "../../../../../../cards/src/cards/equipment/reach-beyond-the-grave.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const nonAlly = decision.candidates.find(
        (candidate) =>
          game.getState().objects[candidate.instanceId]?.canonicalId !==
          limpitHopALongYellow.canonicalId,
      );
      const pick = nonAlly ?? decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) throw new Error("missing required decision target");
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
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
    if (decision) break;
    const priority = game.getState().priority?.holderPlayerId;
    // CR 1.11.4a: only pass while the stack is non-empty. Passing with an
    // empty stack (and no open combat) can complete a full pass cycle and end
    // the action phase, whose end-phase draw would corrupt hand/deck
    // assertions.
    if (priority && game.getState().rulesStack.length > 0) {
      game.exec({ move: "pass", actorId: priority, payload: {} });
      continue;
    }
    if (game.getState().rulesStack.length === 0) return;
    game.passBoth();
  }
}

describe("reach-beyond-the-grave (PEN154)", () => {
  it("returns a real Ally, discards a card, destroys itself, and grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [reachBeyondTheGrave],
        graveyard: [limpitHopALongYellow],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const actionPointsBefore = game.getState().players[Bravo.id]!.actionPoints;

    Bravo.activate(reachBeyondTheGrave);
    drain(game);

    expect(Bravo.zone("arms")).not.toContain(reachBeyondTheGrave.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(reachBeyondTheGrave.canonicalId);
    expect(Bravo.zone("hand")).toContain(limpitHopALongYellow.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(snatchRed.canonicalId);
    expect(game.getState().players[Bravo.id]!.actionPoints).toBe(actionPointsBefore);
  });

  it("boundary: a graveyard without an Ally cannot return a card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [reachBeyondTheGrave],
        graveyard: [nimblismBlue],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );

    const Bravo = game.as(bravo);
    Bravo.activate(reachBeyondTheGrave);
    drain(game);

    expect(Bravo.zone("hand")).toEqual([]);
    expect(Bravo.zone("arms")).not.toContain(reachBeyondTheGrave.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(reachBeyondTheGrave.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(nimblismBlue.canonicalId);
  });
});
