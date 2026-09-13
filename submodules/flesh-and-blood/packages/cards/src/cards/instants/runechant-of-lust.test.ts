import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { cleansingLightYellow } from "../actions/cleansing-light.ts";
import { sinspeakerGloombladeRed } from "../actions/sinspeaker-gloomblade.ts";
import { runechantOfLustYellow as runechantOfLust } from "./runechant-of-lust.ts";

/**
 * Runechant of Lust (IAR154) — Runeblade Instant Aura.
 *
 * Printed: This counts as a Runechant. When an attack usurps this, create a
 * Runechant token. When this is destroyed, create a Runechant token.
 */

describe("Runechant of Lust (IAR154) AAA", () => {
  it("happy: usurping this creates a Runechant in addition to the destroy mint", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [sinspeakerGloombladeRed],
        arena: [runechantOfLust],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: chane },
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(sinspeakerGloombladeRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Chane, runechantOfLust).toBeIn("graveyard");
    expectFabPlayer(Chane).toHaveTokenCount("runechant", 2);
  });

  it("boundary: destroying this without usurp mints only the destroy token", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        arena: [runechantOfLust],
        hand: [cleansingLightYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(cleansingLightYellow);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: runechantOfLust.canonicalId,
    });

    expectFabCard(Vynnset, runechantOfLust).toBeIn("graveyard");
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 1);
  });

  it("boundary: usurp destroys an opponent's Runechant when it is the only one", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [sinspeakerGloombladeRed], actionPoints: 1, deck: 6 },
      { hero: dash, arena: [runechantOfLust], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: chane },
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.playAttack(sinspeakerGloombladeRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, runechantOfLust).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveTokenCount("runechant", 2);
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
