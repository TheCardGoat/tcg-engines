/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:turn-face-up
 * Representative card: packages/cards/src/cards/equipment/koi-blessed-kimono.ts
 * Canonical id: mccHtdK6wgfhL6g98CKMT
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match state with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "../../../../index.ts";
import { koiBlessedKimono } from "../../../../../../cards/src/cards/equipment/koi-blessed-kimono.ts";
import { innerChiBlue } from "../../../../../../cards/src/cards/resources/inner-chi.ts";
import { blues, bravo, dash } from "../../../fixtures.ts";

describe("trigger: turn-face-up", () => {
  it("AAA: flipping the cloaked Kimono at 1 life destroys it and tutors Inner Chi (CR 6.6.4)", () => {
    // Arrange: Kimono seated face-down (cloaked); controller at exactly 1 life;
    // an Inner Chi buried in the deck for the search step.
    const game = FabTestEngine.start(
      { hero: dash, deck: 6 },
      {
        hero: bravo,
        life: 1,
        // Start at intellect so the first-turn refill cannot consume the Inner
        // Chi that this scenario deliberately leaves buried for the search.
        hand: blues(4),
        chest: [koiBlessedKimono],
        deck: [...blues(6), innerChiBlue],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const kimonoId = Bravo.cardIn("chest", koiBlessedKimono).instanceId;
    expect(game.objectState(kimonoId)?.faceDown).toBe(true);

    // Act: opponent's turn ends; the start-of-turn flip choice surfaces once
    // the declared triggered layer reaches resolution (CR 6.6.6).
    game.as(dash).endTurn();
    game.passBoth();
    const choice = game.getState().decision;
    expect(choice?.kind).toBe("boolean");
    Bravo.exec({
      move: "answer-decision",
      payload: {
        decisionId: choice!.decisionId,
        stateVersion: choice!.stateVersion,
        answer: { kind: "boolean", value: true },
      },
    });

    // The flip declares its own triggered layer; resolving it reaches the
    // search step, which asks for the Inner Chi in the deck (CR 6.6.6).
    game.passBoth();
    const search = game.getState().decision;
    expect(search?.kind).toBe("entity-target");
    const innerChiId = Bravo.cardIn("deck", innerChiBlue).instanceId;
    Bravo.exec({
      move: "answer-decision",
      payload: {
        decisionId: search!.decisionId,
        stateVersion: search!.stateVersion,
        answer: { kind: "entity-target", instanceIds: [innerChiId] },
      },
    });
    game.passBoth();

    // Assert: turned face-up, then its own trigger destroyed it and searched.
    expectFabCard(Bravo, koiBlessedKimono).toBeIn("graveyard");
    expectFabCard(Bravo, innerChiBlue).toBeIn("hand");
    expectFabPlayer(Bravo).toHaveHandCount(5);
  });

  it("AAA boundary: above 1 life the Kimono stays cloaked and face-down", () => {
    const game = FabTestEngine.start(
      { hero: dash, deck: 6 },
      { hero: bravo, life: 2, chest: [koiBlessedKimono], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const kimonoId = Bravo.cardIn("chest", koiBlessedKimono).instanceId;

    game.as(dash).endTurn();
    game.passBoth();

    expect(game.getState().decision).toBeNull();
    expect(game.objectState(kimonoId)?.faceDown).toBe(true);
    expectFabCard(Bravo, koiBlessedKimono).toBeIn("chest");
  });
});
