import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { ticktockEverpresentPursuer } from "./050-tick-tock-ever-present-pursuer";

describe("Tick-Tock - Ever-Present Pursuer", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(ticktockEverpresentPursuer)).toBe(true);
  });
});
