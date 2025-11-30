import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { inspectorTezukaResoluteOfficer } from "./177-inspector-tezuka-resolute-officer";

describe("Inspector Tezuka - Resolute Officer", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(inspectorTezukaResoluteOfficer)).toBe(true);
  });
});
