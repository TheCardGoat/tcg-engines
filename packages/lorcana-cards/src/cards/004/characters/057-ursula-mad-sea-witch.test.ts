import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { ursulaMadSeaWitch } from "./057-ursula-mad-sea-witch";

describe("Ursula - Mad Sea Witch", () => {
  it("should have Challenger 2 ability", () => {
    expect(hasKeyword(ursulaMadSeaWitch, "Challenger")).toBe(true);
  });
});
