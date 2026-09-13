import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { limpitHopALongYellow } from "../actions/limpit-hop-a-long.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { carrionCrown } from "./carrion-crown.ts";

/**
 * Carrion Crown (PEN152) — Necromancer Head blade break.
 *
 * Printed:
 *   Action - Discard an ally, destroy this: Draw a card. Go again
 */

describe("Carrion Crown (PEN152) AAA", () => {
  it("happy: discard an ally and destroy this to draw with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        head: [carrionCrown],
        hand: [limpitHopALongYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(carrionCrown);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Gravy, carrionCrown).toBeIn("graveyard");
    expectFabCard(Gravy, limpitHopALongYellow).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveHandCount(1);
    expectFabPlayer(Gravy).toHaveAP(1);
  });

  it("boundary: cannot activate without an ally to discard", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        head: [carrionCrown],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    expect(() => game.as(gravyBones).activate(carrionCrown)).toThrow();
    expectFabCard(game.as(gravyBones), carrionCrown).toBeIn("head");
  });

  it("timing: 0 action points cannot pay the Action activation", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        head: [carrionCrown],
        hand: [limpitHopALongYellow],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    expect(() => game.as(gravyBones).activate(carrionCrown)).toThrow();
    expectFabCard(game.as(gravyBones), carrionCrown).toBeIn("head");
  });
});
