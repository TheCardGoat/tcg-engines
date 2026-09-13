import { describe, expect, it } from "vitest";
import { advanceFabClock, createFabClock, fabRemainingMs } from "./clock.ts";

describe("hosted FAB clock", () => {
  it("charges only the current decision maker, applies bonuses up to the cap, and freezes a finished game", () => {
    const clock = createFabClock(
      {
        mode: "dynamic",
        initialReserveMs: 180_000,
        perActionBonusMs: 5_000,
        turnPassBonusMs: 60_000,
      },
      ["attacker", "defender"],
      "attacker",
      1_000,
    )!;
    const defending = advanceFabClock(clock, {
      actorId: "attacker",
      activeId: "defender",
      now: 11_000,
      actionBonus: true,
      turnEnded: false,
    });
    expect(fabRemainingMs(defending, "attacker", 31_000)).toBe(175_000);
    expect(fabRemainingMs(defending, "defender", 31_000)).toBe(160_000);
    const ended = advanceFabClock(defending, {
      actorId: "defender",
      activeId: undefined,
      now: 31_000,
      actionBonus: false,
      turnEnded: true,
    });
    expect(fabRemainingMs(ended, "defender", 99_000)).toBe(180_000);
    expect(fabRemainingMs(ended, "attacker", 99_000)).toBe(175_000);
  });
  it("keeps untimed games clockless and rejects invalid reserves", () => {
    expect(createFabClock({ mode: "none" }, ["a", "b"], "a", 0)).toBeUndefined();
    expect(() =>
      createFabClock({ mode: "dynamic", initialReserveMs: -1 }, ["a", "b"], "a", 0),
    ).toThrow();
  });
});
