import { describe, expect, it } from "vitest";
import type { FabMatchRuntime } from "@tcg/flesh-and-blood-engine/runtime";
import { advanceFabClock, createFabClock, fabRemainingMs } from "./clock.ts";
import { FleshAndBloodServerEngine } from "./server-engine.ts";

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
  it("evaluates timeout drop after grace and never offers skip", () => {
    const now = 1_000;
    const clock = createFabClock(
      {
        mode: "dynamic",
        initialReserveMs: 180_000,
        extras: { graceMs: 15_000 },
      },
      ["attacker", "defender"],
      "attacker",
      now,
    )!;
    clock.clockState.attacker.reserveMsRemaining = 0;
    const engine = new FleshAndBloodServerEngine({} as FabMatchRuntime, clock);
    expect(
      engine.evaluateOpponentTimeout({
        requesterPlayerId: "defender",
        opponentPlayerId: "attacker",
        nowMs: now + 14_999,
      }),
    ).toMatchObject({
      skip: { allowed: false, reason: "skip_unsupported" },
      drop: { allowed: false, reason: "timeout_grace_pending" },
    });
    expect(
      engine.evaluateOpponentTimeout({
        requesterPlayerId: "defender",
        opponentPlayerId: "attacker",
        nowMs: now + 15_000,
      }).drop.allowed,
    ).toBe(true);
  });

  it("keeps untimed games clockless and rejects invalid reserves", () => {
    expect(createFabClock({ mode: "none" }, ["a", "b"], "a", 0)).toBeUndefined();
    expect(() =>
      createFabClock({ mode: "dynamic", initialReserveMs: -1 }, ["a", "b"], "a", 0),
    ).toThrow();
  });
});
