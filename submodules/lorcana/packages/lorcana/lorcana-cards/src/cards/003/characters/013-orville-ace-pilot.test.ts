import { describe, expect, it } from "bun:test";
import { orvilleAcePilot } from "./013-orville-ace-pilot";

describe("Orville - Ace Pilot", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(orvilleAcePilot.vanilla).toBe(true);
    expect(orvilleAcePilot.abilities).toBeUndefined();
  });
});
