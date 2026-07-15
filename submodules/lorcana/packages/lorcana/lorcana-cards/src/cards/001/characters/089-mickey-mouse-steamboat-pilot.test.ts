import { describe, expect, it } from "bun:test";
import { mickeyMouseSteamboatPilot } from "./089-mickey-mouse-steamboat-pilot";

describe("Mickey Mouse - Steamboat Pilot", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(mickeyMouseSteamboatPilot.vanilla).toBe(true);
    expect(mickeyMouseSteamboatPilot.abilities).toBeUndefined();
  });
});
