/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:discard
 * Representative card: packages/cards/src/cards/equipment/hide-tanner.ts
 * Canonical id: 7MNrGmWN7jTtR99LrWNm7
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
import { FabTestEngine, expectFabCard } from "../../../../index.ts";
import { hideTanner } from "../../../../../../cards/src/cards/equipment/hide-tanner.ts";
import { primevalBellowRed } from "../../../../../../cards/src/cards/actions/primeval-bellow.ts";
import { blues, bravo, dash, writhingBeastHulkRed } from "../../../fixtures.ts";

describe("trigger: discard", () => {
  it("AAA: a random discard of a 6+ power card offers Hide Tanner's destroy for 2 Might (CR 6.6.4)", () => {
    // Savage Beatdown is not legal until a 6+ power card was already discarded.
    // Primeval Bellow provides the same legal random-discard event without a
    // circular play condition.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [hideTanner],
        hand: [primevalBellowRed, writhingBeastHulkRed],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Act: the only random-discard candidate has 6+ power.
    Bravo.play(primevalBellowRed);
    game.passBoth(); // resolve the declared triggered layer (CR 6.6.6).
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

    // Assert: Hide Tanner is destroyed and two Might tokens exist.
    expectFabCard(Bravo, hideTanner).toBeIn("graveyard");
    expect(Bravo.zone("arena").filter((id) => /might/i.test(String(id))).length).toBe(2);
  });

  it("AAA boundary: discarding a card under 6 power does not fire Hide Tanner", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [hideTanner],
        hand: [primevalBellowRed, ...blues(2)],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // With the fixed "fab-test" seed the random discard lands on a blue
    // pitch card (power 0), below the 6-power threshold.
    Bravo.play(primevalBellowRed);
    game.passBoth(); // the card layer advances; no triggered layer exists.

    expect(game.getState().decision).toBeNull();
    game.helpers.resolveRestOfCombat();

    // No trigger: the equipment stays seated and no Might tokens appear.
    expectFabCard(Bravo, hideTanner).toBeIn("arms");
    expect(Bravo.zone("arena").some((id) => /might/i.test(String(id)))).toBe(false);
  });
});
