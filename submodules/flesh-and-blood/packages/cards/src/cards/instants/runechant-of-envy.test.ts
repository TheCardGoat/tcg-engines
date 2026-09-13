import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { cleansingLightYellow } from "../actions/cleansing-light.ts";
import { runechantOfEnvyYellow } from "./runechant-of-envy.ts";

/**
 * Runechant of Envy Yellow (IAR152) — Runeblade Instant Aura.
 *
 * Printed: This counts as a Runechant. When an attack usurps this, gain
 * 1{h}.
 * When this is destroyed, create a Runechant token.
 */

describe("Runechant of Envy (IAR152) AAA", () => {
  it("happy: destroyed by a yellow aura-destroy, a fresh Runechant is created", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        arena: [runechantOfEnvyYellow],
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
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: runechantOfEnvyYellow.canonicalId });

    expectFabCard(Vynnset, runechantOfEnvyYellow).toBeIn("graveyard");
    // The destroy trigger seats a fresh Runechant token in the arena.
    expect(Vynnset.zone("arena").filter((id) => id === "token:runechant").length).toBe(before + 1);
  });
});
