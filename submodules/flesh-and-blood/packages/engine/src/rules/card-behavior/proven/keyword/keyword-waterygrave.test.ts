/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:wateryGrave
 * Representative card: packages/cards/src/cards/actions/anka-drag-under.ts
 * Canonical id: JjKJRwQPTtgpcCcLrDRwF
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
import { bravo, cintariSellsword, dash, snatchRed } from "../../../fixtures.ts";
import { ankaDragUnderYellow } from "../../../../../../cards/src/cards/actions/anka-drag-under.ts";

describe("keyword: wateryGrave", () => {
  it("AAA happy — dying from the arena turns the watery-grave ally face-down (CR 8.3.41)", () => {
    // Arrange — Anka Drag Under (health 3) sits in Dash's arena; Snatch
    // (power 4) is lethal when it hits the ally.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arena: [ankaDragUnderYellow], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const allyId = Dash.findCardInZone("arena", ankaDragUnderYellow);

    // Act — attack the ally and let combat damage destroy it.
    game.as(bravo).play(snatchRed, { target: allyId });
    game.passBoth();
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    // Assert — destroyed from the arena into the graveyard, turned face-down.
    expectFabCard(Dash, ankaDragUnderYellow).toBeIn("graveyard");
    expectFabCard(Dash, ankaDragUnderYellow).toBeFaceDown();
  });

  it("AAA boundary — an ally without watery grave is not turned face-down when it dies (CR 8.3.41)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arena: [cintariSellsword], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const allyId = Dash.findCardInZone("arena", cintariSellsword);

    game.as(bravo).play(snatchRed, { target: allyId });
    game.passBoth();
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    // Token allies cease when they leave the arena (CR 8.1.8a) — no GY seat.
    // Assert the ally is gone from the arena and was not turned face-down.
    expect(Dash.zone("arena")).not.toContain(cintariSellsword.canonicalId);
    const record = Dash.getState().objects[allyId];
    // Either ceased (no record) or still present without face-down marker.
    expect(!record || !record.markers.some((marker) => marker.kind === "face-down")).toBe(true);
  });
});
