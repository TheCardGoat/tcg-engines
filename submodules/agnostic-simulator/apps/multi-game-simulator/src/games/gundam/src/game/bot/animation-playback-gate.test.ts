import { describe, expect, it, vi } from "vite-plus/test";

import { createDevRuntime } from "../dev-runtime.ts";
import { animationPlaybackGateFor } from "./animation-playback-gate.ts";

describe("animation playback gate", () => {
  it("stays blocked until every overlapping plan completes", () => {
    const runtime = createDevRuntime().runtime;
    const gate = animationPlaybackGateFor(runtime);
    const listener = vi.fn();
    gate.subscribe(listener);

    gate.begin(["draw", "phase"]);
    gate.complete("draw");
    expect(gate.isBlocked()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);

    gate.complete("phase");
    expect(gate.isBlocked()).toBe(false);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
