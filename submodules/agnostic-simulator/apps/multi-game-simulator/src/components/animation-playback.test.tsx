// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { createSimulatorAnimationScope } from "@tcg/simulator-ui";
import type { AnimationPlanV2 } from "@tcg/protocol";

const Scope = createSimulatorAnimationScope<number>();
const motionGlobal = globalThis as typeof globalThis & {
  __TCG_TEST_DISABLE_SIMULATOR_MOTION__?: boolean;
};
let original: boolean | undefined;
const plan: AnimationPlanV2 = {
  id: "missing-node",
  version: 2,
  steps: [
    {
      id: "move",
      type: "entityTransfer",
      entity: { kind: "entity", id: "missing" },
      from: { kind: "zone", id: "hand" },
      to: { kind: "zone", id: "field" },
      sourceFace: "hidden",
      destinationFace: "public",
      durationMs: 800,
    },
  ],
};
const settled = vi.fn();
const cancelAudio = vi.fn();
const scheduleAudio = vi.fn();
function Controls() {
  const actions = Scope.useActions();
  const state = Scope.useState();
  const status = Scope.useStatus();
  const next = () => {
    const version = (state.authoritativeVersion ?? 0) + 1;
    actions.enqueue({ version, state: version, plan, correlationId: `update-${version}` });
  };
  return (
    <>
      <output data-testid="board">{state.presentationState}</output>
      <button onClick={next}>Receive update</button>
      <button
        onClick={() => {
          for (let index = 1; index <= 3; index++) {
            const version = (state.authoritativeVersion ?? 0) + index;
            actions.enqueue({ version, state: version, plan, correlationId: `update-${version}` });
          }
        }}
      >
        Receive batch
      </button>
      <button
        onClick={() =>
          actions.refreshFromProjection({ state: 99, version: state.authoritativeVersion! })
        }
      >
        Refresh projection
      </button>
      <button onClick={() => actions.skipActive("user-skip")}>Skip</button>
      <button disabled={status.isAnimating}>Game action</button>
      <button onClick={() => actions.replaceFromSync({ version: 20, state: 20 })}>Seek</button>
    </>
  );
}
function Harness({
  live = false,
  speed = "normal",
}: {
  live?: boolean;
  speed?: "off" | "normal" | "slow";
}) {
  return (
    <Scope.Root
      sessionKey="test"
      initialState={0}
      initialVersion={0}
      projection={{ getEntity: () => null, getZone: () => null }}
      entityRenderer={() => null}
      viewerSeatId="p1"
      animationSpeed={speed}
      liveCatchUp={live}
      onTransitionSettled={settled}
      onCancelAudio={cancelAudio}
      onScheduleAudio={scheduleAudio}
    >
      <Controls />
    </Scope.Root>
  );
}
async function tick(ms: number) {
  await act(() => vi.advanceTimersByTimeAsync(ms));
}
beforeEach(() => {
  original = motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__;
  motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = false;
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.clearAllMocks();
  motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = original;
});

describe("shared animation timeline through rendered controls", () => {
  it("releases gameplay on schedule even when a transfer has no DOM endpoints", async () => {
    render(<Harness />);
    fireEvent.click(screen.getByText("Receive update"));
    expect(screen.getByText("Game action").hasAttribute("disabled")).toBe(true);
    await tick(500);
    expect(screen.getByText("Game action").hasAttribute("disabled")).toBe(true);
    await tick(600);
    expect(screen.getByText("Game action").hasAttribute("disabled")).toBe(false);
    expect(screen.getByTestId("board").textContent).toBe("1");
    expect(settled).toHaveBeenCalledTimes(1);
  });
  it("cancels old completion and sound when seeking to a new snapshot", async () => {
    render(<Harness />);
    fireEvent.click(screen.getByText("Receive update"));
    await tick(100);
    fireEvent.click(screen.getByText("Seek"));
    await tick(2000);
    expect(screen.getByTestId("board").textContent).toBe("20");
    expect(screen.getByText("Game action").hasAttribute("disabled")).toBe(false);
    expect(settled).toHaveBeenCalledTimes(1);
    expect(cancelAudio).toHaveBeenCalled();
  });
  it("bounds live backlog while keeping local playback ordered", async () => {
    const { unmount } = render(<Harness live />);
    for (let i = 0; i < 6; i++) fireEvent.click(screen.getByText("Receive update"));
    expect(screen.getByTestId("board").textContent).toBe("6");
    expect(screen.getByText("Game action").hasAttribute("disabled")).toBe(false);
    unmount();
    render(<Harness />);
    for (let i = 0; i < 6; i++) fireEvent.click(screen.getByText("Receive update"));
    expect(screen.getByText("Game action").hasAttribute("disabled")).toBe(true);
    await tick(1500);
    expect(screen.getByTestId("board").textContent).not.toBe("6");
    await tick(6000);
    expect(screen.getByTestId("board").textContent).toBe("6");
    expect(screen.getByText("Game action").hasAttribute("disabled")).toBe(false);
  });
  it("settles immediately when motion is turned off", async () => {
    const { rerender } = render(<Harness />);
    fireEvent.click(screen.getByText("Receive update"));
    await tick(100);
    rerender(<Harness speed="off" />);
    expect(screen.getByText("Game action").hasAttribute("disabled")).toBe(false);
    await tick(2000);
    expect(settled).toHaveBeenCalledTimes(1);
  });
  it("settles live playback on tab return and invalidated geometry on resize", async () => {
    render(<Harness live />);
    fireEvent.click(screen.getByText("Receive update"));
    await tick(100);
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    fireEvent(document, new Event("visibilitychange"));
    expect(screen.getByText("Game action").hasAttribute("disabled")).toBe(false);
    fireEvent.click(screen.getByText("Receive update"));
    await tick(100);
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: originalWidth + 100 });
    fireEvent(window, new Event("resize"));
    await tick(200);
    Object.defineProperty(window, "innerWidth", { configurable: true, value: originalWidth });
    expect(screen.getByText("Game action").hasAttribute("disabled")).toBe(false);
    expect(screen.getByTestId("board").textContent).toBe("2");
  });
  it.each(["off", "reduced"] as const)(
    "settles every batched correlation with motion %s",
    async (mode) => {
      if (mode === "reduced") motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = true;
      render(<Harness speed={mode === "off" ? "off" : "normal"} />);
      fireEvent.click(screen.getByText("Receive batch"));
      expect(screen.getByTestId("board").textContent).toBe("3");
      expect(screen.getByText("Game action").hasAttribute("disabled")).toBe(false);
      expect(settled.mock.calls.map(([event]) => [event.correlationId, event.outcome])).toEqual([
        ["update-1", "completed"],
        ["update-2", "completed"],
        ["update-3", "completed"],
      ]);
      await tick(3000);
      expect(settled).toHaveBeenCalledTimes(3);
    },
  );
  it("notifies all pending correlations on sync without playing the queued updates", async () => {
    render(<Harness />);
    fireEvent.click(screen.getByText("Receive batch"));
    await tick(100);
    fireEvent.click(screen.getByText("Seek"));
    expect(screen.getByTestId("board").textContent).toBe("20");
    expect(settled.mock.calls.map(([event]) => [event.correlationId, event.outcome])).toEqual([
      ["update-1", "skipped"],
      ["update-2", "skipped"],
      ["update-3", "skipped"],
    ]);
    await tick(3000);
    expect(settled).toHaveBeenCalledTimes(3);
    expect(scheduleAudio).toHaveBeenCalledTimes(1);
  });
  it("skips only the active update and continues the queue", async () => {
    render(<Harness />);
    fireEvent.click(screen.getByText("Receive batch"));
    await tick(100);
    fireEvent.click(screen.getByText("Skip"));
    expect(settled).toHaveBeenCalledTimes(1);
    expect(settled.mock.calls[0]![0]).toMatchObject({
      correlationId: "update-1",
      outcome: "skipped",
    });
    await tick(2500);
    expect(screen.getByTestId("board").textContent).toBe("3");
    expect(settled).toHaveBeenCalledTimes(3);
  });
  it("keeps the original deadline and audio schedule across projection refreshes", async () => {
    render(<Harness />);
    fireEvent.click(screen.getByText("Receive update"));
    await tick(400);
    fireEvent.click(screen.getByText("Refresh projection"));
    await tick(300);
    fireEvent.click(screen.getByText("Refresh projection"));
    await tick(200);
    // This refresh happens during the layout phase.
    fireEvent.click(screen.getByText("Refresh projection"));
    await tick(200);
    expect(screen.getByText("Game action").hasAttribute("disabled")).toBe(false);
    expect(screen.getByTestId("board").textContent).toBe("99");
    expect(scheduleAudio).toHaveBeenCalledTimes(1);
    expect(settled).toHaveBeenCalledTimes(1);
  });
  it("ignores duplicate and transient mobile viewport resize events", async () => {
    render(<Harness />);
    fireEvent.click(screen.getByText("Receive update"));
    await tick(100);
    fireEvent(window, new Event("resize"));
    await tick(200);
    expect(settled).not.toHaveBeenCalled();
    const originalHeight = window.innerHeight;
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: originalHeight - 60,
    });
    fireEvent(window, new Event("resize"));
    await tick(50);
    Object.defineProperty(window, "innerHeight", { configurable: true, value: originalHeight });
    fireEvent(window, new Event("resize"));
    await tick(200);
    expect(settled).not.toHaveBeenCalled();
    expect(screen.getByText("Game action").hasAttribute("disabled")).toBe(true);
    await tick(600);
    expect(settled).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ outcome: "completed" }),
    );
  });
});
