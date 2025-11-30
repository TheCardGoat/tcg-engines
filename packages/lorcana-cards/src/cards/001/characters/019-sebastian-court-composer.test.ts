import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { sebastianCourtComposer } from "./019-sebastian-court-composer";

describe("Sebastian - Court Composer", () => {
  it("should have Singer 4 ability", () => {
    expect(hasKeyword(sebastianCourtComposer, "Singer")).toBe(true);
  });
});
