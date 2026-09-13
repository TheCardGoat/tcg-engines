import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromaiAshArtist } from "../heroes/dromai-ash-artist.ts";
import { invokeOuviaRed } from "./invoke-ouvia.ts";

/**
 * Invoke Ouvia (UPR014) — Draconic Illusionist Instant.
 *
 * Printed: Legendary\nTransform target ash you control into Ouvia. Go again
 */

const source = fabToken("ash");

describe("Invoke Ouvia (UPR014) AAA", () => {
  it("happy: transforms the token into Ouvia and refunds an action point (go again)", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        hand: [invokeOuviaRed],
        arena: [source],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Seat = game.as(dromaiAshArtist);

    Seat.play(invokeOuviaRed);
    game.passBoth();

    expect(Seat.zone("arena")).toContain(invokeOuviaRed.canonicalId);
    expect(Seat.zone("arena")).not.toContain("token:ash");
    // 2 - 1 (play) + 1 (go again) = 2.
    expectFabPlayer(Seat).toHaveAP(2);
  });

  it("boundary: with no ash under your control the Invoke cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        hand: [invokeOuviaRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Seat = game.as(dromaiAshArtist);

    expect(() => Seat.play(invokeOuviaRed)).toThrow();
    expectFabCard(Seat, invokeOuviaRed).toBeIn("hand");
  });

  it("timing: the transformed token never reaches a public zone", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        hand: [invokeOuviaRed],
        arena: [source],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Seat = game.as(dromaiAshArtist);

    Seat.play(invokeOuviaRed);
    game.passBoth();
    game.helpers.untilIdle();

    expect(Seat.zone("graveyard")).not.toContain("token:ash");
    expect(Seat.zone("banished")).not.toContain("token:ash");
    expect(Seat.zone("arena")).toHaveLength(1); // only the flipped Ouvia
  });
});
