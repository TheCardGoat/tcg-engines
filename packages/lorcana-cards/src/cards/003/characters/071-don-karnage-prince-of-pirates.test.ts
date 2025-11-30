import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { donKarnagePrinceOfPirates } from "./071-don-karnage-prince-of-pirates";

describe("Don Karnage - Prince of Pirates", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(donKarnagePrinceOfPirates)).toBe(true);
  });
});
