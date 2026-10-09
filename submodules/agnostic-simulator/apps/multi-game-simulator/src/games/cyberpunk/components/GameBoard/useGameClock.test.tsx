// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { GameClockProvider, useGameClock } from "./useGameClock";

vi.mock("../../engine", () => ({
  PLAYER_SIDE_TO_ID: { player: "player", opponent: "opponent" },
  useEngine: () => ({ prioritySide: "player", matchState: { G: { gameEnded: false }, ctx: {} } }),
}));

function ClockView() {
  const clock = useGameClock();
  return <output aria-label="Your clock">{clock.player.time}</output>;
}
function SwitchableBoard() {
  const [version, setVersion] = useState("v1");
  return (
    <GameClockProvider>
      <button onClick={() => setVersion(version === "v1" ? "v2" : "v1")}>Switch view</button>
      <ClockView key={version} />
    </GameClockProvider>
  );
}
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

test("changing the board view keeps the running local match clock", () => {
  vi.useFakeTimers();
  render(<SwitchableBoard />);
  act(() => {
    vi.advanceTimersByTime(5000);
  });
  expect(screen.getByLabelText("Your clock").textContent).toBe("11:55");
  fireEvent.click(screen.getByRole("button", { name: "Switch view" }));
  expect(screen.getByLabelText("Your clock").textContent).toBe("11:55");
  act(() => {
    vi.advanceTimersByTime(2000);
  });
  fireEvent.click(screen.getByRole("button", { name: "Switch view" }));
  expect(screen.getByLabelText("Your clock").textContent).toBe("11:53");
});
