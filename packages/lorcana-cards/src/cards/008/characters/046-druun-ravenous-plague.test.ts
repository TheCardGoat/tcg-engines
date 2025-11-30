import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { druunRavenousPlague } from "./046-druun-ravenous-plague";

describe("Druun - Ravenous Plague", () => {
  it("should have Challenger 4 ability", () => {
    expect(hasKeyword(druunRavenousPlague, "Challenger")).toBe(true);
  });
});
