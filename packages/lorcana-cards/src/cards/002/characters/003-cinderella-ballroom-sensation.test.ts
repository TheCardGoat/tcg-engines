import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { cinderellaBallroomSensation } from "./003-cinderella-ballroom-sensation";

describe("Cinderella - Ballroom Sensation", () => {
  it("should have Singer 3 ability", () => {
    expect(hasKeyword(cinderellaBallroomSensation, "Singer")).toBe(true);
  });
});
