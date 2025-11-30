import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { mrsBeakleyFormerShushAgent } from "./011-mrs-beakley-former-shush-agent";

describe("Mrs. Beakley - Former S.H.U.S.H. Agent", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(mrsBeakleyFormerShushAgent)).toBe(true);
  });
});
