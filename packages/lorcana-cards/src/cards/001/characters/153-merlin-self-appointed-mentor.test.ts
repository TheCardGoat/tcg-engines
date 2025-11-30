import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { merlinSelfappointedMentor } from "./153-merlin-self-appointed-mentor";

describe("Merlin - Self-Appointed Mentor", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(merlinSelfappointedMentor, "Support")).toBe(true);
  });
});
