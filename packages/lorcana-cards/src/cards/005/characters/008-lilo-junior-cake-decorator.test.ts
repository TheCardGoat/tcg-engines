import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { liloJuniorCakeDecorator } from "./008-lilo-junior-cake-decorator";

describe("Lilo - Junior Cake Decorator", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(liloJuniorCakeDecorator, "Support")).toBe(true);
  });
});
