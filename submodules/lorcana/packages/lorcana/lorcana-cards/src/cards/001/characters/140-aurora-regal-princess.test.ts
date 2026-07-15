import { describe, expect, it } from "bun:test";
import { auroraRegalPrincess } from "./140-aurora-regal-princess";

describe("Aurora - Regal Princess", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(auroraRegalPrincess.vanilla).toBe(true);
    expect(auroraRegalPrincess.abilities).toBeUndefined();
  });
});
