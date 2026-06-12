import { describe, expect, it } from "bun:test";
import { stitchAlienDancer } from "./023-stitch-alien-dancer";

describe("Stitch - Alien Dancer", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(stitchAlienDancer.vanilla).toBe(true);
    expect(stitchAlienDancer.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(stitchAlienDancer.cost).toBe(2);
    expect(stitchAlienDancer.strength).toBe(2);
    expect(stitchAlienDancer.willpower).toBe(3);
    expect(stitchAlienDancer.lore).toBe(1);
  });

  it("is inkable", () => {
    expect(stitchAlienDancer.inkable).toBe(true);
  });

  it("has correct classifications", () => {
    expect(stitchAlienDancer.classifications).toContain("Storyborn");
    expect(stitchAlienDancer.classifications).toContain("Hero");
    expect(stitchAlienDancer.classifications).toContain("Alien");
  });

  it("is amber ink", () => {
    expect(stitchAlienDancer.inkType).toContain("amber");
  });
});
