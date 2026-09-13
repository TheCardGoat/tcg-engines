/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: effect:gain-life
 * Representative card: packages/cards/src/cards/actions/healing-balm.ts
 * Canonical id: z6Ltnt69ChWMCDBTTdWkL
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, healingBalmYellow, nimblismBlue } from "../../../fixtures.ts";

describe("effect: gain-life", () => {
  it("Arrange/Act/Assert: Healing Balm (gain-life 2) raises controller life by 2 when played", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [healingBalmYellow, nimblismBlue], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const lifeBefore = Bravo.life();

    // Act: play Healing Balm — a non-attack Generic Action with cost 0.
    Bravo.play(healingBalmYellow);
    game.passBoth();

    // Assert: gain-life resolved — life increased by 2.
    expect(Bravo.life()).toBe(lifeBefore + 2);
  });

  it("AAA boundary: without gain-life effect, playing a card does not change life", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimblismBlue], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const lifeBefore = Bravo.life();

    Bravo.play(nimblismBlue);
    game.passBoth();

    // Nimblism has no gain-life — life unchanged.
    expect(Bravo.life()).toBe(lifeBefore);
  });
});
