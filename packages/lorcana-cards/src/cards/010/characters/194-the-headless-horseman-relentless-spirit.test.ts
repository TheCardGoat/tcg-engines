import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { theHeadlessHorsemanRelentlessSpirit } from "./194-the-headless-horseman-relentless-spirit";

describe("The Headless Horseman - Relentless Spirit", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(theHeadlessHorsemanRelentlessSpirit)).toBe(true);
  });
});
