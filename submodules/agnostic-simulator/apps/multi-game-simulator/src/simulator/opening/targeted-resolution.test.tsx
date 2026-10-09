import { StrictMode } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  TargetArrivalBarrier,
  useTargetArrivals,
  nextTargetedBeat,
  targetedHoldMs,
} from "@tcg/simulator-presentation/targeted-resolution";

describe("targeted resolution staging", () => {
  it("reveals targets before impact, then waits for target transitions", () => {
    expect(nextTargetedBeat("stack")).toBe("disclose");
    expect(nextTargetedBeat("standby")).toBe("disclose");
    expect(nextTargetedBeat("disclose")).toBe("resolve");
    expect(nextTargetedBeat("resolve")).toBe("outcome");
    expect(nextTargetedBeat("outcome")).toBe("targets");
    expect(targetedHoldMs("targets", false)).toBe(0);
    expect(targetedHoldMs("disclose", true)).toBe(80);
  });
  it("waits for every target and ignores duplicate and stale arrivals", () => {
    const barrier = new TargetArrivalBarrier("new", ["a", "b"]);
    expect(barrier.arrive("old", "a")).toBe(false);
    expect(barrier.arrive("new", "other")).toBe(false);
    expect(barrier.arrive("new", "a")).toBe(false);
    expect(barrier.arrive("new", "a")).toBe(false);
    expect(barrier.arrive("new", "b")).toBe(true);
    expect(barrier.arrive("new", "b")).toBe(false);
  });
  it("does not let a previous animation finish a new resolution", () => {
    const done = vi.fn();
    const { result, rerender } = renderHook(
      ({ run }) => useTargetArrivals(true, run, ["a", "b"], done),
      { initialProps: { run: 1 } },
    );
    const stale = result.current;
    act(() => result.current("a"));
    expect(done).not.toHaveBeenCalled();
    rerender({ run: 2 });
    act(() => {
      stale("b");
      result.current("b");
    });
    expect(done).not.toHaveBeenCalled();
    act(() => result.current("a"));
    expect(done).toHaveBeenCalledTimes(1);
  });
  it("completes an empty transition once under StrictMode", () => {
    const done = vi.fn();
    renderHook(() => useTargetArrivals(true, undefined, [], done), { wrapper: StrictMode });
    expect(done).toHaveBeenCalledTimes(1);
  });
});
