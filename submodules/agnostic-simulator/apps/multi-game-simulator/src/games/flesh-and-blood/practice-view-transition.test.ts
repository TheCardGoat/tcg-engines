// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";

import {
  appendFabPracticeTelemetry,
  FAB_PRACTICE_TELEMETRY_LIMIT,
  transitionFabPracticeState,
} from "./Practice.page";

describe("transitionFabPracticeState fallback", () => {
  it("updates synchronously when View Transitions are unsupported", () => {
    const update = vi.fn();

    transitionFabPracticeState("setup-to-sideboard", update);

    expect(update).toHaveBeenCalledOnce();
  });

  it("updates synchronously when reduced motion is requested", () => {
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
    const update = vi.fn();

    transitionFabPracticeState("sideboard-to-match", update);

    expect(update).toHaveBeenCalledOnce();
    expect(document.startViewTransition).not.toHaveBeenCalled();
  });
});

describe("practice telemetry retention", () => {
  it("keeps a 200-command match complete instead of dropping its opening turns", () => {
    const history = Array.from({ length: 200 }, (_, index) => index + 1);

    expect(appendFabPracticeTelemetry(history, 201)).toEqual(
      Array.from({ length: 201 }, (_, index) => index + 1),
    );
  });

  it("retains the newest bounded session entries", () => {
    const history = Array.from({ length: FAB_PRACTICE_TELEMETRY_LIMIT }, (_, index) => index);
    const next = appendFabPracticeTelemetry(history, FAB_PRACTICE_TELEMETRY_LIMIT);

    expect(next).toHaveLength(FAB_PRACTICE_TELEMETRY_LIMIT);
    expect(next[0]).toBe(1);
    expect(next.at(-1)).toBe(FAB_PRACTICE_TELEMETRY_LIMIT);
  });
});
