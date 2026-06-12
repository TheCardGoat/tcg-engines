import { describe, expect, it } from "bun:test";
import { mickeyMouseArtfulRogue } from "../../../../lorcana-cards/src/cards/001/characters/088-mickey-mouse-artful-rogue";
import { getShiftRules } from "./play-card-rules";

describe("getShiftRules", () => {
  it("ignores unrelated non-keyword ability text when resolving bare Shift name targets", () => {
    expect(getShiftRules(mickeyMouseArtfulRogue)?.targetMode).toEqual({
      type: "name",
      name: "Mickey Mouse",
    });
  });
});
