/**
 * ROS163 Aether Bindings of the Third Age — Wizard Arms d1.
 *
 * Printed a1: "Instant - Destroy this: Until end of turn, whenever an aura
 * permanent you control with Sigil in its name leaves the arena, amp 1."
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, fabToken } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { aetherBindingsOfTheThirdAge } from "../../../../../../cards/src/cards/equipment/aether-bindings-of-the-third-age.ts";
import { shatterSorceryBlue } from "../../../../../../cards/src/cards/instants/shatter-sorcery.ts";
import { lightningFlow } from "../../../../../../cards/src/cards/tokens/lightning-flow.ts";

function totalAmp(game: FabTestEngine, playerId: string): number {
  return game
    .committedEvents()
    .filter((event) => event.name === "gain-assets" && event.data.playerId === playerId)
    .reduce((total, event) => total + (event.name === "gain-assets" ? event.data.amp : 0), 0);
}

function drain(game: FabTestEngine): void {
  for (let safety = 0; safety < 64; safety += 1) {
    if (game.answerForcedDecision()) continue;
    const decision = game.getState().decision;
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick) throw new Error("expected a target candidate");
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
    if (decision) throw new Error(`unexpected decision ${decision.kind}`);
    const priority = game.getState().priority?.holderPlayerId;
    if (priority && game.getState().rulesStack.length > 0) {
      game.exec({ move: "pass", actorId: priority, payload: {} });
      continue;
    }
    if (game.getState().rulesStack.length === 0) return;
  }
  throw new Error("Aether Bindings did not finish resolving");
}

describe("ROS163 Aether Bindings of the Third Age", () => {
  it("arms for the turn and amps once per controlled Sigil aura that leaves", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [aetherBindingsOfTheThirdAge],
        arena: [fabToken("sigil-of-fate")],
        hand: [shatterSorceryBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);

    game.as(dash).pass();
    Bravo.activate(aetherBindingsOfTheThirdAge);
    drain(game);
    expect(Bravo.zone("graveyard")).toContain(aetherBindingsOfTheThirdAge.canonicalId);
    expect(totalAmp(game, Bravo.id)).toBe(0);

    if (game.getState().priority?.holderPlayerId !== Bravo.id) game.as(dash).pass();
    const sigilId = Bravo.findCardInZone("arena", fabToken("sigil-of-fate"));
    Bravo.play(shatterSorceryBlue, {
      modeIds: ["KCRhRBTqwf9mRfjmGnQL6:chooseModes:destroyTargetAuraPermanentSigilName"],
      targetInstanceId: sigilId,
    });
    drain(game);

    expect(Bravo.zone("arena")).toHaveLength(0);
    expect(totalAmp(game, Bravo.id)).toBe(1);
  });

  it("does not amp for a non-Sigil aura or when no aura leaves", () => {
    const nonSigil = FabTestEngine.start(
      {
        hero: bravo,
        arms: [aetherBindingsOfTheThirdAge],
        arena: [lightningFlow],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, firstPlayer: dash },
    );
    nonSigil.as(dash).pass();
    nonSigil.as(bravo).activate(aetherBindingsOfTheThirdAge);
    drain(nonSigil);
    expect(totalAmp(nonSigil, nonSigil.as(bravo).id)).toBe(0);

    const noLeave = FabTestEngine.start(
      {
        hero: bravo,
        arms: [aetherBindingsOfTheThirdAge],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, firstPlayer: dash },
    );
    noLeave.as(dash).pass();
    noLeave.as(bravo).activate(aetherBindingsOfTheThirdAge);
    drain(noLeave);
    expect(totalAmp(noLeave, noLeave.as(bravo).id)).toBe(0);
  });
});
