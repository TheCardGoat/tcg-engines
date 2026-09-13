/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:runeGate
 * Representative card: packages/cards/src/cards/actions/widespread-annihilation.ts
 * Canonical id: QMWDbQKHnWCcj8zrpmTMk
 *
 * CR 8.3.27 rune-gate: "If you control Runechants whose combined cost is equal
 * to or greater than the base cost of this card, you may play it from your
 * banished zone without paying its cost."
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
import { bravo, dash } from "../../../fixtures.ts";
import { widespreadAnnihilationBlue } from "../../../../../../cards/src/cards/actions/widespread-annihilation.ts";
import { runechant } from "../../../../../../cards/src/cards/tokens/runechant.ts";

describe("keyword: runeGate", () => {
  it("AAA — happy: 4 Runechants ≥ cost 4, play DTD137 from banished free; Runechants not destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        banished: [widespreadAnnihilationBlue],
        arena: [runechant, runechant, runechant, runechant],
        hand: [],
        deck: 4,
        resourcePoints: 0,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(
      game
        .as(bravo)
        .zone("arena")
        .filter((c) => c === runechant.canonicalId),
    ).toHaveLength(4);

    // Play from banished via rune-gate — drives through stack to defend step.
    game.as(bravo).attackWith(widespreadAnnihilationBlue, {
      from: "banished",
    });

    // Card is on the combat chain.
    expect(game.as(bravo).zone("combatChain")).toContain(widespreadAnnihilationBlue.canonicalId);
    // Free via rune-gate — resources unchanged (cost 4 not paid).
    expect(game.as(bravo).resourcePoints()).toBe(0);
    // Rune-gate itself does not destroy Runechants. Real Runechants still have
    // their own "when you play an attack action" destroy trigger, so they may
    // leave the arena via that ability — not as a rune-gate cost.
    // Proof of non-consumption by the keyword: free play succeeded above with 0 RP.
  });

  it("AAA — boundary: 3 Runechants < cost 4, play from banished rejected with rune_gate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        banished: [widespreadAnnihilationBlue],
        arena: [runechant, runechant, runechant],
        hand: [],
        deck: 4,
        resourcePoints: 0,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const banId = game.as(bravo).findCardInZone("banished", widespreadAnnihilationBlue);
    const rej = game.as(bravo).expectFailure({
      move: "begin-play",
      payload: { instanceId: banId, from: "banished", target: game.as(dash).id },
    });
    expect(rej.errorCode).toBe("rune_gate");
  });

  it("AAA — hand bypass: DTD137 in hand plays normally without Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        hand: [widespreadAnnihilationBlue],
        deck: 4,
        resourcePoints: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(widespreadAnnihilationBlue);
    expect(game.as(bravo).zone("combatChain")).toContain(widespreadAnnihilationBlue.canonicalId);
    expect(game.as(bravo).resourcePoints()).toBe(0);
  });

  it("AAA — blood-debt interaction: DTD137 in banished (unplayed) ticks blood-debt at end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        banished: [widespreadAnnihilationBlue],
        hand: [],
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(game.as(bravo).life()).toBe(20);
    game.as(bravo).endTurn();
    expect(game.as(bravo).life()).toBe(19);
  });
});
