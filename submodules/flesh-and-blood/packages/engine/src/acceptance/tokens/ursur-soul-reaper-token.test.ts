/** MON220 Ursur the Soul Reaper — 6/6 Shadow Demon Ally with attack and conditional go again. */
import { describe, expect, it } from "vitest";
import { ursurTheSoulReaper } from "../../../../cards/src/cards/tokens/ursur-the-soul-reaper.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Ursur the Soul Reaper token (MON220)", () => {
  it("AAA: activate attack ability commits an attack event with Ursur as source", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [ursurTheSoulReaper], deck: 8, actionPoints: 1, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(ursurTheSoulReaper);
    game.passBoth();

    const attacks = game.committedEvents().filter((e) => e.name === "attack");
    expect(attacks.length).toBeGreaterThanOrEqual(1);
    expect(attacks[0]!.source!.canonicalId).toBe(ursurTheSoulReaper.canonicalId);
  });
});
