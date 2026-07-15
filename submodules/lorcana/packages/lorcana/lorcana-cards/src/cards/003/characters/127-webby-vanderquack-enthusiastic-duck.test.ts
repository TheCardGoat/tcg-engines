import { describe, expect, it } from "bun:test";
import { webbyVanderquackEnthusiasticDuck } from "./127-webby-vanderquack-enthusiastic-duck";

describe("Webby Vanderquack - Enthusiastic Duck", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(webbyVanderquackEnthusiasticDuck.vanilla).toBe(true);
    expect(webbyVanderquackEnthusiasticDuck.abilities).toBeUndefined();
  });
});
