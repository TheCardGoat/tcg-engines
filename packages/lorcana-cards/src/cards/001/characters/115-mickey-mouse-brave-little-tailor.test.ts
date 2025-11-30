import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { mickeyMouseBraveLittleTailor } from "./115-mickey-mouse-brave-little-tailor";

describe("Mickey Mouse - Brave Little Tailor", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(mickeyMouseBraveLittleTailor)).toBe(true);
  });
});
