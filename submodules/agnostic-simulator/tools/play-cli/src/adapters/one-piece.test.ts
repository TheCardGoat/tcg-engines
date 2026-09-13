import { describe, expect, it } from "vitest";

import { getPlayAdapter } from "../registry.ts";

describe("one-piece play adapter", () => {
  it("create → observe → autoStep produces legal observation", async () => {
    const adapter = await getPlayAdapter("one-piece");
    const session = await adapter.createSession({
      seed: "unit-observe",
      p1Strategy: "first-legal",
      p2Strategy: "first-legal",
      maxSteps: 50,
    });

    const before = session.observe();
    expect(before.game).toBe("one-piece");
    expect(before.gameEnded).toBe(false);
    expect(before.step).toBe(0);
    expect(before.state).toEqual(
      expect.objectContaining({
        status: expect.any(String),
        south: expect.objectContaining({ seat: "south" }),
        north: expect.objectContaining({ seat: "north" }),
      }),
    );
    expect(before.actions.length).toBeGreaterThan(0);

    const step = session.autoStep();
    expect(step.accepted).toBe(true);
    expect(step.observation.step).toBe(1);
    expect(step.observation.game).toBe("one-piece");
    // First test pays the cold import of @tcg/op-engine + card catalog (~60s+ on CI).
  }, 90_000);

  it("runToEnd completes a full first-legal match with a terminal outcome", async () => {
    const adapter = await getPlayAdapter("one-piece");
    const session = await adapter.createSession({
      seed: "unit-full-match-a",
      p1Strategy: "first-legal",
      p2Strategy: "first-legal",
      maxSteps: 1_000,
    });

    const result = session.runToEnd();
    expect(result.game).toBe("one-piece");
    expect(result.seed).toBe("unit-full-match-a");
    expect(result.actionCount).toBeGreaterThan(0);
    expect(result.step).toBeGreaterThan(0);
    expect(result.termination).toBeTruthy();
    expect(typeof result.termination).toBe("string");
    // Terminal: either a seat won or an explicit non-rules termination was recorded.
    if (result.termination === "rules-win") {
      expect(result.winner === "south" || result.winner === "north").toBe(true);
    }
    expect(session.hasEnded()).toBe(true);
    expect(session.result()).toEqual(result);
  }, 60_000);

  it("runs multiple seeds to terminal outcomes", async () => {
    const adapter = await getPlayAdapter("one-piece");
    // Two seeds keep CI under the package timeout budget while still
    // proving multi-seed terminal outcomes.
    const seeds = ["multi-1", "multi-2"];
    const results = [];
    for (const seed of seeds) {
      const session = await adapter.createSession({
        seed,
        p1Strategy: "first-legal",
        p2Strategy: "first-legal",
        maxSteps: 1_000,
      });
      results.push(session.runToEnd());
    }

    expect(results).toHaveLength(2);
    for (const result of results) {
      expect(result.game).toBe("one-piece");
      expect(result.actionCount).toBeGreaterThan(0);
      expect(result.termination).toBeTruthy();
    }
  }, 90_000);

  it("doctor succeeds for one-piece", async () => {
    const adapter = await getPlayAdapter("one-piece");
    const doctor = await adapter.doctor();
    expect(doctor.ok).toBe(true);
    expect(doctor.game).toBe("one-piece");
    expect(doctor.checks.length).toBeGreaterThan(0);
  }, 30_000);
});
