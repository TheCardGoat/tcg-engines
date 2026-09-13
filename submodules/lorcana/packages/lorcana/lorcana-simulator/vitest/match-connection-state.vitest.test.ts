// @vitest-environment jsdom

import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { tick } from "svelte";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import MatchConnectionState from "../src/routes/matches/[matchId]/games/[gameId]/MatchConnectionState.svelte";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("MatchConnectionState", () => {
  test("explains a slow connection and offers a safe way back", async () => {
    vi.useFakeTimers();
    const onBack = vi.fn();
    const view = render(MatchConnectionState, {
      props: {
        onBack,
        onRetry: vi.fn(),
      },
    });

    expect(view.getByText("Preparing your practice match")).toBeTruthy();

    vi.advanceTimersByTime(6_000);
    await tick();

    expect(view.getByText("Still preparing your table")).toBeTruthy();
    await fireEvent.click(view.getByRole("button", { name: "Back to matchmaking" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test("turns a connection failure into retry and return actions", async () => {
    const onRetry = vi.fn();
    const onBack = vi.fn();
    const view = render(MatchConnectionState, {
      props: {
        error: true,
        onBack,
        onRetry,
      },
    });

    expect(view.getByText("We couldn’t connect to this match")).toBeTruthy();
    expect(view.getByText(/Your match was created/)).toBeTruthy();
    expect(view.queryByText("Timeout waiting to join game.")).toBeNull();

    await fireEvent.click(view.getByRole("button", { name: "Try again" }));
    await fireEvent.click(view.getByRole("button", { name: "Back to matchmaking" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
