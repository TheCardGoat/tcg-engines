import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { dawnbladeResplendent } from "../weapons/dawnblade-resplendent.ts";
import { onAKnifeEdgeYellow } from "./on-a-knife-edge.ts";

/**
 * On a Knife Edge Yellow (DVR019) — Generic Action.
 *
 * Printed:
 *   Go again
 *   Your next sword attack this turn gains go again.
 *
 * AAA trio:
 * - Happy: play (cost 0, go again), then Dawnblade attack → has go again.
 * - Boundary: 0 action points → cannot play.
 * - Timing: go again grant applies to next sword subtype attack.
 */

describe("On a Knife Edge Yellow (DVR019) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: play then Dawnblade attack gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [onAKnifeEdgeYellow],
        weapon1: [dawnbladeResplendent],
        resourcePoints: 1, // 0 for play + 1 for activation
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Dori = game.as(dorinthea);

    // Play costs 0 resources; go again preserves action point.
    Dori.must.play(onAKnifeEdgeYellow);
    expectFabCard(Dori, onAKnifeEdgeYellow).toBeIn("graveyard");

    // Activate Dawnblade — the appliesTo.next buff should apply.
    Dori.must.activate(dawnbladeResplendent);

    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: 0 action points — cannot play", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [onAKnifeEdgeYellow],
        weapon1: [dawnbladeResplendent],
        resourcePoints: 1,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Dori = game.as(dorinthea);

    expect(() => Dori.must.play(onAKnifeEdgeYellow)).toThrow();
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: go again grant targets sword subtype attacks", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [onAKnifeEdgeYellow],
        weapon1: [dawnbladeResplendent],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Dori = game.as(dorinthea);

    Dori.must.play(onAKnifeEdgeYellow);
    Dori.must.activate(dawnbladeResplendent);

    // Dawnblade Resplendent has Sword subtype → buff applies.
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");

    // Resolve combat — Dorinthea's "first Dawnblade go again" trigger fires;
    // decline the optional additional attack.
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
  });
});
