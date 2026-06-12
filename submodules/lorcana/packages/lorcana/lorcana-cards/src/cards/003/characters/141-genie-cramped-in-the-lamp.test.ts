import { describe, expect, it } from "bun:test";
import { genieCrampedInTheLamp } from "./141-genie-cramped-in-the-lamp";

describe("Genie - Cramped in the Lamp", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(genieCrampedInTheLamp.vanilla).toBe(true);
    expect(genieCrampedInTheLamp.abilities).toBeUndefined();
  });
});
