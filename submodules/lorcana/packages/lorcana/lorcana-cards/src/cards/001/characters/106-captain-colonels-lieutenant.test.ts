import { describe, expect, it } from "bun:test";
import { captainColonelsLieutenant } from "./106-captain-colonels-lieutenant";

describe("Captain - Colonel's Lieutenant", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(captainColonelsLieutenant.vanilla).toBe(true);
    expect(captainColonelsLieutenant.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(captainColonelsLieutenant.cost).toBe(5);
    expect(captainColonelsLieutenant.strength).toBe(6);
    expect(captainColonelsLieutenant.willpower).toBe(5);
    expect(captainColonelsLieutenant.lore).toBe(1);
  });

  it("is inkable", () => {
    expect(captainColonelsLieutenant.inkable).toBe(true);
  });
});
