import { MantineProvider } from "@mantine/core";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { ActionAttentionReminder } from "./ActionAttentionReminder";

const playSound = vi.fn();
vi.mock("@tcg/simulator-presentation/audio/sound-service", () => ({
  playActionAttentionSound: (valid: () => boolean) => playSound(valid),
}));

function show(key = "decision-1") {
  return render(
    <MantineProvider>
      <ActionAttentionReminder
        decision={{ key, label: "Your priority" }}
        onShowAction={() => undefined}
      />
    </MantineProvider>,
  );
}

describe("ActionAttentionReminder", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ["Date", "setTimeout", "clearTimeout", "setInterval", "clearInterval"],
    });
    window.localStorage.clear();
    playSound.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("waits one minute before showing a reminder and stops when the decision ends", () => {
    const view = show();
    expect(screen.queryByTestId("action-attention-reminder")).toBeNull();
    expect(screen.queryByText("The game is waiting for you.")).toBeNull();
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText("The game is waiting for you.")).toBeTruthy();
    expect(playSound).toHaveBeenCalledTimes(1);
    view.rerender(
      <MantineProvider>
        <ActionAttentionReminder decision={null} />
      </MantineProvider>,
    );
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.queryByTestId("action-attention-reminder")).toBeNull();
    expect(playSound).toHaveBeenCalledTimes(1);
  });

  it("lets the player dismiss the current decision and re-arms for a new one", () => {
    const view = show();
    act(() => vi.advanceTimersByTime(60_000));
    fireEvent.click(screen.getByRole("button", { name: "Dismiss reminder for this decision" }));
    expect(screen.queryByTestId("action-attention-reminder")).toBeNull();
    act(() => vi.advanceTimersByTime(61_000));
    expect(playSound).toHaveBeenCalledTimes(1);
    view.rerender(
      <MantineProvider>
        <ActionAttentionReminder decision={{ key: "decision-2", label: "Your decision" }} />
      </MantineProvider>,
    );
    expect(screen.queryByTestId("action-attention-reminder")).toBeNull();
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText("Your decision")).toBeTruthy();
  });

  it("repeats the sound every seven seconds while the nudge stays visible", () => {
    show();
    act(() => vi.advanceTimersByTime(60_000));
    expect(playSound).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(6_999));
    expect(playSound).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(1));
    expect(playSound).toHaveBeenCalledTimes(2);
    act(() => vi.advanceTimersByTime(7_000));
    expect(playSound).toHaveBeenCalledTimes(3);
    act(() => vi.advanceTimersByTime(21_000));
    expect(playSound).toHaveBeenCalledTimes(6);
  });

  it("starts a fresh delay after the player makes a move and priority stays with them", () => {
    const view = show("state-1");
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByTestId("action-attention-reminder")).toBeTruthy();
    view.rerender(
      <MantineProvider>
        <ActionAttentionReminder decision={{ key: "state-2", label: "Your priority" }} />
      </MantineProvider>,
    );
    expect(screen.queryByTestId("action-attention-reminder")).toBeNull();
    act(() => vi.advanceTimersByTime(59_000));
    expect(screen.queryByTestId("action-attention-reminder")).toBeNull();
    expect(playSound).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.getByTestId("action-attention-reminder")).toBeTruthy();
    expect(playSound).toHaveBeenCalledTimes(2);
  });

  it("respects the player sound preference", () => {
    show();
    act(() => vi.advanceTimersByTime(60_000));
    fireEvent.click(screen.getByRole("checkbox", { name: "Reminder sound" }));
    playSound.mockClear();
    act(() => vi.advanceTimersByTime(30_000));
    expect(playSound).not.toHaveBeenCalled();
  });

  it("restarts the inactivity delay when the player interacts", () => {
    show();
    act(() => vi.advanceTimersByTime(55_000));
    fireEvent.pointerDown(document.body);
    act(() => vi.advanceTimersByTime(59_000));
    expect(screen.queryByText("The game is waiting for you.")).toBeNull();
    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.getByText("The game is waiting for you.")).toBeTruthy();
  });

  it("alerts a hidden tab without replacing the live match title", () => {
    const originalTitle = document.title;
    const visibility = vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    const view = show();
    expect(document.title).toBe(originalTitle);
    expect(playSound).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(60_000));
    expect(playSound).toHaveBeenCalledTimes(1);

    view.rerender(
      <MantineProvider>
        <ActionAttentionReminder decision={null} />
      </MantineProvider>,
    );
    expect(document.title).toBe(originalTitle);
    visibility.mockRestore();
  });

  it("takes the player to the marked action surface", () => {
    const target = document.createElement("div");
    target.dataset.actionAttentionTarget = "";
    target.scrollIntoView = vi.fn();
    target.focus = vi.fn();
    document.body.append(target);
    render(
      <MantineProvider>
        <ActionAttentionReminder decision={{ key: "decision-1", label: "Your priority" }} />
      </MantineProvider>,
    );
    act(() => vi.advanceTimersByTime(60_000));
    fireEvent.click(screen.getByRole("button", { name: "Show action" }));
    expect(target.scrollIntoView).toHaveBeenCalled();
    expect(target.focus).toHaveBeenCalled();
    target.remove();
  });

  it("sends the thinking message and stops reminders for this decision", () => {
    const onThinking = vi.fn();
    render(
      <MantineProvider>
        <ActionAttentionReminder
          decision={{ key: "decision-1", label: "Your priority" }}
          onThinking={onThinking}
        />
      </MantineProvider>,
    );
    act(() => vi.advanceTimersByTime(60_000));
    fireEvent.click(screen.getByRole("button", { name: "I’m thinking" }));
    expect(onThinking).toHaveBeenCalledOnce();
    expect(screen.queryByTestId("action-attention-reminder")).toBeNull();
    const soundsWhenDismissed = playSound.mock.calls.length;
    act(() => vi.advanceTimersByTime(160_000));
    expect(playSound).toHaveBeenCalledTimes(soundsWhenDismissed);
  });
});
