import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { iagoStompinMad } from "./043-iago-stompin-mad";

describe("Iago - Stompin' Mad", () => {
  it("should have Challenger 5 ability", () => {
    expect(hasKeyword(iagoStompinMad, "Challenger")).toBe(true);
  });
});
