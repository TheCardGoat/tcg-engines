// @vitest-environment jsdom

import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";

import { useAiAnimationWaitCircuitBreaker } from "./useAiAnimationWaitCircuitBreaker";

function CircuitBreakerProbe({ pending, enabled = true }: { pending: boolean; enabled?: boolean }) {
  const expired = useAiAnimationWaitCircuitBreaker(pending, enabled);
  return <output data-testid="animation-wait-expired">{expired ? "true" : "false"}</output>;
}

describe("useAiAnimationWaitCircuitBreaker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("expires after twelve seconds and remains open while animations stay pending", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = render(<CircuitBreakerProbe pending />);

    act(() => {
      vi.advanceTimersByTime(11_999);
    });
    expect(screen.getByTestId("animation-wait-expired").textContent).toBe("false");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId("animation-wait-expired").textContent).toBe("true");
    expect(warn).toHaveBeenCalledTimes(1);

    view.rerender(<CircuitBreakerProbe pending />);
    act(() => {
      vi.advanceTimersByTime(12_000);
    });
    expect(screen.getByTestId("animation-wait-expired").textContent).toBe("true");
    expect(warn).toHaveBeenCalledTimes(1);
  });

  test("resets only after the animation queue becomes idle", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = render(<CircuitBreakerProbe pending />);

    act(() => {
      vi.advanceTimersByTime(12_000);
    });
    expect(screen.getByTestId("animation-wait-expired").textContent).toBe("true");

    view.rerender(<CircuitBreakerProbe pending={false} />);
    expect(screen.getByTestId("animation-wait-expired").textContent).toBe("false");

    view.rerender(<CircuitBreakerProbe pending />);
    act(() => {
      vi.advanceTimersByTime(11_999);
    });
    expect(screen.getByTestId("animation-wait-expired").textContent).toBe("false");
  });

  test("cancels the timeout when unmounted", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = render(<CircuitBreakerProbe pending />);

    view.unmount();
    act(() => {
      vi.advanceTimersByTime(12_000);
    });

    expect(warn).not.toHaveBeenCalled();
  });

  test("does not run while animation-aware AI waiting is disabled", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = render(<CircuitBreakerProbe pending enabled={false} />);

    act(() => {
      vi.advanceTimersByTime(12_000);
    });
    expect(screen.getByTestId("animation-wait-expired").textContent).toBe("false");
    expect(warn).not.toHaveBeenCalled();

    view.rerender(<CircuitBreakerProbe pending />);
    act(() => {
      vi.advanceTimersByTime(11_999);
    });
    expect(screen.getByTestId("animation-wait-expired").textContent).toBe("false");
  });
});
