/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:search
 * Representative card: packages/cards/src/cards/actions/call-to-the-grave.ts
 * Canonical id: gDhFGHDrPKRwCP6qRF6zd
 *
 * Note: no catalog card currently listens to the search *event* as a triggered
 * ability. Coverage is the production search event path on a real card that
 * performs a search effect (CR 8.5.19), asserting player-visible resolution.
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
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { callToTheGraveBlue } from "../../../../../../cards/src/cards/actions/call-to-the-grave.ts";

describe("trigger: search", () => {
  it("AAA happy — Arrange: Call to the Grave with cards in deck; Act: play it and resolve search choices; Assert: search event is produced and the action resolves to GY", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [callToTheGraveBlue],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(callToTheGraveBlue);
    // Drive search target selection and stack priority to completion.
    for (let i = 0; i < 12; i += 1) {
      const state = game.getState();
      if (state.decision?.kind === "entity-target" && state.decision.candidates.length > 0) {
        game.exec({
          move: "answer-decision",
          actorId: state.decision.actorId,
          payload: { instanceIds: [state.decision.candidates[0]!.instanceId] },
        });
        continue;
      }
      if (state.rulesStack.length === 0 && !state.decision && !state.rulesProcess) break;
      try {
        game.passBoth();
      } catch {
        break;
      }
    }

    // Action resolved off the stack into the graveyard.
    expect(Bravo.zone("graveyard")).toContain(callToTheGraveBlue.canonicalId);
    // Production search event was committed (event-kernel proof for trigger:search).
    const searchEvents = game.committedEvents().filter((event) => event.name === "search");
    expect(searchEvents.length).toBeGreaterThanOrEqual(1);
  });

  it("AAA boundary — Arrange: may-fail search with empty deck; Act: play Call to the Grave; Assert: action still resolves to GY", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [callToTheGraveBlue],
        deck: 0,
        actionPoints: 1,
      },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(callToTheGraveBlue);
    game.passBoth();
    game.passBoth();

    expect(Bravo.zone("graveyard")).toContain(callToTheGraveBlue.canonicalId);
  });
});
