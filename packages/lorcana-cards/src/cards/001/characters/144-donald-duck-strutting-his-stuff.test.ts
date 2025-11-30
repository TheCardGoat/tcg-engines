import { describe, expect, it } from "bun:test";
import { hasWard } from "@tcg/lorcana";
import { donaldDuckStruttingHisStuff } from "./144-donald-duck-strutting-his-stuff";

describe("Donald Duck - Strutting His Stuff", () => {
  it("should have Ward ability", () => {
    expect(hasWard(donaldDuckStruttingHisStuff)).toBe(true);
  });
});
