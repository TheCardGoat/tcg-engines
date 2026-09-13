import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { invokeSurayaYellow } from "./invoke-suraya.ts";

/**
 * Invoke Ouvia (UPR014) — Draconic Illusionist Instant.
 *
 * Printed: Legendary\nTransform target ash you control into Ouvia. Go again
 */

const source = fabToken("spectral-shield");

describe("Invoke Ouvia (UPR014) AAA", () => {
  it("happy: transforms the shield into Suraya and refunds an action point (go again)", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [invokeSurayaYellow],
        arena: [source],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Seat = game.as(prism);

    Seat.play(invokeSurayaYellow);
    game.passBoth();

    expect(Seat.zone("arena")).toContain(invokeSurayaYellow.canonicalId);
    expect(Seat.zone("arena")).not.toContain("token:spectral-shield");
    expectFabPlayer(Seat).toHaveAP(2);
  });

  it("boundary: with no spectral-shield under your control the Invoke cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [invokeSurayaYellow],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Seat = game.as(prism);

    expect(() => Seat.play(invokeSurayaYellow)).toThrow();
    expectFabCard(Seat, invokeSurayaYellow).toBeIn("hand");
  });

  it("timing: the transformed shield never reaches a public zone", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [invokeSurayaYellow],
        arena: [source],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Seat = game.as(prism);

    Seat.play(invokeSurayaYellow);
    game.passBoth();
    game.helpers.untilIdle();

    expect(Seat.zone("graveyard")).not.toContain("token:spectral-shield");
    expect(Seat.zone("banished")).not.toContain("token:spectral-shield");
    expect(Seat.zone("arena")).toHaveLength(1); // only the flipped Suraya
  });
});
