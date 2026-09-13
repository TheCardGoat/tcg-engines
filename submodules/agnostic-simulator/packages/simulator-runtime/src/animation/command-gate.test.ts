import { describe, expect, test, vi } from "vite-plus/test";

import {
  createSimulatorExternalCommandGate,
  simulatorExternalCommandGateFor,
} from "./command-gate";

describe("simulator external command gate", () => {
  test("notifies consumers only when the blocked state changes", () => {
    const gate = createSimulatorExternalCommandGate();
    const listener = vi.fn();
    gate.subscribe(listener);

    gate.setBlocked(true);
    gate.setBlocked(true);
    gate.setBlocked(false);

    expect(gate.isBlocked()).toBe(false);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  test("shares one gate for an external runtime without a game-owned registry", () => {
    const runtime = {};
    expect(simulatorExternalCommandGateFor(runtime)).toBe(simulatorExternalCommandGateFor(runtime));
    expect(simulatorExternalCommandGateFor({})).not.toBe(simulatorExternalCommandGateFor(runtime));
  });
});
