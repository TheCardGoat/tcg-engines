import { describe, expect, it } from "bun:test";
import { resolveSimulatorInkDropPayment } from "./derived-state.js";

describe("resolveSimulatorInkDropPayment (Hyperia City)", () => {
  it("returns 0 when disarmed or with no held drops", () => {
    expect(resolveSimulatorInkDropPayment({ armed: false, heldDrops: 3 })).toBe(0);
    expect(resolveSimulatorInkDropPayment({ armed: true, heldDrops: 0 })).toBe(0);
  });

  it("armed mode claims every held drop; the engine clamps to the effective cost", () => {
    expect(resolveSimulatorInkDropPayment({ armed: true, heldDrops: 3 })).toBe(3);
    expect(resolveSimulatorInkDropPayment({ armed: true, heldDrops: 1 })).toBe(1);
  });
});
