import { describe, expect, it } from "vite-plus/test";

import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash, nimbleStrikeRed, nimblismBlue } from "./fixtures.ts";
import { reanchorFabBindingsThroughCommittedMoves } from "./binding-reanchor.ts";
import { snapshotObject } from "./snapshots.ts";

describe("committed move binding re-anchoring", () => {
  it("preserves original-zone LKI while following an exact destination action ref", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed, nimblismBlue], deck: 6, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const playerId = game.as(bravo).id;
    const pitchCardId = game.findCardInZone(playerId, "hand", nimblismBlue);
    const before = snapshotObject(game.getState(), pitchCardId, playerId, "hand");

    game.as(bravo).play(nimbleStrikeRed, { pitch: [nimblismBlue] });
    const pitch = game
      .committedEvents()
      .find((event) => event.name === "pitch" && event.data.object.instanceId === pitchCardId);
    if (!pitch || pitch.name !== "pitch") {
      throw new Error("Expected the public payment pitch receipt.");
    }

    const rebound = reanchorFabBindingsThroughCommittedMoves(game.getState(), { it: before }, [
      pitch,
    ]).it;
    expect(rebound).toMatchObject({
      instanceId: pitchCardId,
      ref: before.ref,
      zone: "hand",
      continuationRef: pitch.data.destinationRef,
    });
  });

  it("does not follow same-instance movement from a different incarnation", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed, nimblismBlue], deck: 6, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const playerId = game.as(bravo).id;
    const pitchCardId = game.findCardInZone(playerId, "hand", nimblismBlue);
    const before = snapshotObject(game.getState(), pitchCardId, playerId, "hand");
    const forged = {
      ...before,
      ref: { ...before.ref, incarnation: before.ref.incarnation + 100 },
    };

    game.as(bravo).play(nimbleStrikeRed, { pitch: [nimblismBlue] });
    const pitch = game
      .committedEvents()
      .find((event) => event.name === "pitch" && event.data.object.instanceId === pitchCardId);
    if (!pitch || pitch.name !== "pitch") {
      throw new Error("Expected the public payment pitch receipt.");
    }

    const rebound = reanchorFabBindingsThroughCommittedMoves(game.getState(), { it: forged }, [
      pitch,
    ]).it;
    expect(rebound).toEqual(forged);
  });
});
