import { describe, expect, it } from "vite-plus/test";
import { DIE_MAX_VALUES, isDieType } from "./gig-rules.ts";

describe("Gig die type boundary", () => {
  it("accepts only defined die types, not inherited object property names", () => {
    for (const dieType of Object.keys(DIE_MAX_VALUES)) expect(isDieType(dieType)).toBe(true);
    expect(isDieType("toString")).toBe(false);
    expect(isDieType("constructor")).toBe(false);
  });
});
