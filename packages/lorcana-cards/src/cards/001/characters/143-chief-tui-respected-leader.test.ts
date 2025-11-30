import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { chiefTuiRespectedLeader } from "./143-chief-tui-respected-leader";

describe("Chief Tui - Respected Leader", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(chiefTuiRespectedLeader, "Support")).toBe(true);
  });
});
