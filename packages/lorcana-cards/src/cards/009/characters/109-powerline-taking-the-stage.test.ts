import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { powerlineTakingTheStage } from "./109-powerline-taking-the-stage";

describe("Powerline - Taking the Stage", () => {
  it("should have Singer 4 ability", () => {
    expect(hasKeyword(powerlineTakingTheStage, "Singer")).toBe(true);
  });
});
