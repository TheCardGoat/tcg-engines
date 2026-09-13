/** MON219 Blasmophet the Soul Harvester — 6/6 Shadow Demon Ally with attack and chained trigger. */
import { describe, expect, it } from "vitest";
import { blasmophetTheSoulHarvester } from "../../../../cards/src/cards/tokens/blasmophet-the-soul-harvester.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Blasmophet the Soul Harvester token (MON219)", () => {
  it("AAA: activate attack ability commits an attack event with Blasmophet as source", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [blasmophetTheSoulHarvester],
        deck: 8,
        actionPoints: 1,
        resourcePoints: 0,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(blasmophetTheSoulHarvester);
    game.passBoth();

    const attacks = game.committedEvents().filter((e) => e.name === "attack");
    expect(attacks.length).toBeGreaterThanOrEqual(1);
    expect(attacks[0]!.source!.canonicalId).toBe(blasmophetTheSoulHarvester.canonicalId);
  });
});
