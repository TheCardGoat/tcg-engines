import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { boltDependableFriend } from "./018-bolt-dependable-friend";

describe("Bolt - Dependable Friend", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(boltDependableFriend, "Support")).toBe(true);
  });
});
