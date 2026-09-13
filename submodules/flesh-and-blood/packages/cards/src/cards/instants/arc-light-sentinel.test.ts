import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { prismSculptorOfArcLight } from "../heroes/prism-sculptor-of-arc-light.ts";
import { arcLightSentinelYellow } from "./arc-light-sentinel.ts";

/**
 * Arc Light Sentinel (MON005) — Light Illusionist Instant Aura, Spectra.
 *
 * Printed: Opponents must choose this as the target of attacks if able.
 */

describe("Arc Light Sentinel (MON005) AAA", () => {
  it("happy: an opponent's attack must target this Spectra aura if able", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: prismSculptorOfArcLight,
        arena: [arcLightSentinelYellow],
        life: 40,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Prism = game.as(prismSculptorOfArcLight);
    const sentinelId = Prism.findCardInZone("arena", arcLightSentinelYellow);

    expect(() => Dash.playAttack(snatchRed)).toThrow(/illegal_attack_target|attack target/i);

    Dash.play(snatchRed, { target: sentinelId });
    game.passBoth();

    expectFabCard(Prism, arcLightSentinelYellow).toBeIn("graveyard");
    expectFabPlayer(Prism).toHaveLife(40);
  });

  it("boundary: without this in the arena the opposing hero is still a legal attack target", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: prismSculptorOfArcLight, life: 40, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Prism = game.as(prismSculptorOfArcLight);

    Dash.playAttack(snatchRed);
    Prism.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Prism).toHaveLife(36);
  });

  it("timing: after this is destroyed, a later attack can target the hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: prismSculptorOfArcLight,
        arena: [arcLightSentinelYellow],
        life: 40,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Prism = game.as(prismSculptorOfArcLight);
    const sentinelId = Prism.findCardInZone("arena", arcLightSentinelYellow);

    Dash.play(snatchRed, { target: sentinelId });
    game.passBoth();
    expectFabCard(Prism, arcLightSentinelYellow).toBeIn("graveyard");

    Dash.playAttack(snatchRed);
    Prism.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Prism).toHaveLife(36);
  });
});
