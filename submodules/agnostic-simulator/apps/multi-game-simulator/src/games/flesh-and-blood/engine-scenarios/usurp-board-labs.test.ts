import { describe, expect, it } from "vitest";
import { expectWait, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { USURP_BOARD_LAB_SCENARIOS } from "./usurp-board-labs";

describe("UST multi-card board labs", () => {
  it("registers the zombie-choice and gloomblade Usurp boards", () => {
    expect(Object.keys(USURP_BOARD_LAB_SCENARIOS)).toEqual([
      "usurp-zombie-choice-board",
      "usurp-gloomblade-usurp-board",
      "usurp-gloomblade-pitch-board",
    ]);
  });

  it("zombie board opens Acrid Stench's discard-zombie optional with similar Restless names in play", () => {
    const match = USURP_BOARD_LAB_SCENARIOS["usurp-zombie-choice-board"].boot();
    expect(match.seed).toBe("usurp-zombie-choice-board");
    const game = FabTestEngine.fromRuntime(match.runtime);
    expectWait(game).toHaveDecision("entity-target");
  });

  it("gloomblade board opens Usurp payment among similar Runechants", () => {
    const match = USURP_BOARD_LAB_SCENARIOS["usurp-gloomblade-usurp-board"].boot();
    expect(match.seed).toBe("usurp-gloomblade-usurp-board");
    const game = FabTestEngine.fromRuntime(match.runtime);
    expectWait(game).toHaveDecision("entity-target");
  });

  it("pitch board opens Shadowake's resource payment", () => {
    const match = USURP_BOARD_LAB_SCENARIOS["usurp-gloomblade-pitch-board"].boot();
    expect(match.seed).toBe("usurp-gloomblade-pitch-board");
    const game = FabTestEngine.fromRuntime(match.runtime);
    expectWait(game).toHaveDecision("payment");
  });
});
