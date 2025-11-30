import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { ryderFleetfootedInfiltrator } from "./056-ryder-fleet-footed-infiltrator";

describe("Ryder - Fleet-Footed Infiltrator", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(ryderFleetfootedInfiltrator)).toBe(true);
  });
});
