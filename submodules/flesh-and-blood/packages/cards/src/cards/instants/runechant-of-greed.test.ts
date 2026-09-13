import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { cleansingLightYellow } from "../actions/cleansing-light.ts";
import { runicReavingRed } from "../actions/runic-reaving.ts";
import { runechant } from "../tokens/runechant.ts";
import { runechantOfGreedYellow } from "./runechant-of-greed.ts";

/**
 * Runechant of Greed Yellow (IAR145) — Runeblade Instant Aura.
 *
 * Printed: This counts as a Runechant. When an attack usurps this,
 * draw a card.
 * When this is destroyed, create a Runechant token.
 */

describe("Runechant of Greed (IAR145) AAA", () => {
  it("happy: destroyed by a yellow aura-destroy, a fresh Runechant is created", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        arena: [runechantOfGreedYellow],
        hand: [cleansingLightYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    const before = Vynnset.zone("arena").filter((id) => id.startsWith("token:")).length;
    Vynnset.play(cleansingLightYellow);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: runechantOfGreedYellow.canonicalId });

    expectFabCard(Vynnset, runechantOfGreedYellow).toBeIn("graveyard");
    // The destroy trigger seats a fresh Runechant token in the arena.
    expect(Vynnset.zone("arena").filter((id) => id === "token:runechant").length).toBe(before + 1);
  });
  for (const chooseGreed of [true, false]) {
    it(`draws only when Greed itself is usurped: ${chooseGreed}`, () => {
      const game = FabTestEngine.start(
        {
          hero: vynnset,
          hand: [runicReavingRed],
          arena: [runechantOfGreedYellow, runechant],
          deck: 6,
        },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const player = game.as(vynnset);
      const chosen = player.cardIn("arena", chooseGreed ? runechantOfGreedYellow : runechant);
      game.playInstance(
        player.id,
        player.cardIn("hand", runicReavingRed).instanceId,
        {},
        "explicit",
      );
      player.targetRequired(chosen);
      game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
      expect(player.zone("hand")).toHaveLength(chooseGreed ? 1 : 0);
      expectFabCard(player, runechantOfGreedYellow).toBeIn("graveyard");
    });
  }
});
