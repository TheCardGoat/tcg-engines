/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:action-phase-start
 * Representative card: packages/cards/src/cards/actions/crumble-to-eternity.ts
 * Canonical id: mnKzqjmdQbtKgBLT6bFBj
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
import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard } from "../../../../index.ts";
import { crumbleToEternityBlue } from "../../../../../../cards/src/cards/actions/crumble-to-eternity.ts";
import { bravo, dash } from "../../../fixtures.ts";

describe("trigger: action-phase-start", () => {
  it("AAA timing: Crumble to Eternity survives its own action phase after entering (CR 6.6.4)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [crumbleToEternityBlue], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // The action phase already started this turn, so the aura stays seated.
    Bravo.play(crumbleToEternityBlue);
    game.passBoth(); // resolve the aura layer into the arena.
    expectFabCard(Bravo, crumbleToEternityBlue).toBeIn("arena");
  });

  it("AAA: the next action-phase start destroys Crumble to Eternity (CR 4.2, 6.6.4)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [crumbleToEternityBlue], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.play(crumbleToEternityBlue);
    game.passBoth(); // resolve the aura layer into the arena.
    expectFabCard(Bravo, crumbleToEternityBlue).toBeIn("arena");

    // The enter-arena triggered layer (optional -1{d} counter) still sits on
    // the stack; with no equipment in play it closes uneventfully (CR 6.6.6).
    game.passBoth();

    // Act: the card text says "At the beginning of YOUR action phase" — the
    // trigger fires on the controller's (Bravo's) next action-phase-start,
    // not the opponent's.  End Bravo's turn, pass through the opponent's
    // turn, then Bravo's next action phase begins (CR 6.6.6).
    Bravo.endTurn();
    game.passBoth(); // advance through end-of-turn → opponent's turn
    game.as(dash).endTurn();
    game.passBoth(); // resolve Bravo's start-of-turn → action-phase-start trigger

    expectFabCard(Bravo, crumbleToEternityBlue).toBeIn("graveyard");
  });
});
