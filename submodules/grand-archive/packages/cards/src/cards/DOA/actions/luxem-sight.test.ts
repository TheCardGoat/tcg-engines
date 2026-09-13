import { describe } from "vitest";
import { proveDrawCardResolution } from "../../../testing/draw-card-resolution.ts";
import { luxemSight } from "./luxem-sight.ts";

/** @covers uwnHTLG3fL-a2 */
describe("Luxem Sight \u2014 uwnHTLG3fL-a2", () => {
  proveDrawCardResolution({ card: luxemSight });
});

import { memoryRevealFixture } from "../../../testing/memory-reveal-fixture.ts";
import { expect, it } from "vitest";
/** @covers uwnHTLG3fL-a1 */
for (const boundary of ["enabled", "class", "element", "hand", "opponent"] as const)
  it(`Luxem Sight recovery reveal boundary: ${boundary}`, () => {
    const { game, p, q, hero, foe, source, reveal } = memoryRevealFixture(
      luxemSight,
      false,
      boundary !== "element",
      boundary === "hand" ? "hand" : "memory",
    );
    expect(game.state.objects[hero.objectId]!.damage).toBe(4);
    reveal(boundary !== "opponent");
    expect(game.state.objects[hero.objectId]!.damage).toBe(
      boundary === "enabled" || boundary === "class" ? 1 : 4,
    );
    expect(game.state.objects[foe.objectId]!.damage).toBe(0);
    expect(game.state.objects[source.objectId]!.zone).toBe(boundary === "hand" ? "hand" : "memory");
  });
