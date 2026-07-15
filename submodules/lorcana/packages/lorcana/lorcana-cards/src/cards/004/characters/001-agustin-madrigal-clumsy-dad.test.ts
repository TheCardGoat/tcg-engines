import { describe, expect, it } from "bun:test";
import { agustinMadrigalClumsyDad } from "./001-agustin-madrigal-clumsy-dad";

describe("Agustin Madrigal - Clumsy Dad", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(agustinMadrigalClumsyDad.vanilla).toBe(true);
    expect(agustinMadrigalClumsyDad.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(agustinMadrigalClumsyDad.cost).toBe(1);
    expect(agustinMadrigalClumsyDad.strength).toBe(2);
    expect(agustinMadrigalClumsyDad.willpower).toBe(2);
    expect(agustinMadrigalClumsyDad.lore).toBe(1);
  });

  it("is inkable", () => {
    expect(agustinMadrigalClumsyDad.inkable).toBe(true);
  });
});
