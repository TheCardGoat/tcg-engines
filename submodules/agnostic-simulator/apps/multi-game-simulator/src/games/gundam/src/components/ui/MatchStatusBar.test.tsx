// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { MatchStatusBar } from "./MatchStatusBar.tsx";

afterEach(cleanup);

describe("MatchStatusBar", () => {
  it("states turn, phase, and priority without relying on color", () => {
    render(
      <MatchStatusBar
        matchInfo={{ format: "turncycle", turn: 3, phase: "main-phase", mode: "hot-seat" }}
        isSelfTurn
        isSelfPriority={false}
      />,
    );

    const status = screen.getByRole("region", { name: /match status/i });
    expect(status.textContent).toContain("Your turn");
    expect(status.textContent).toContain("Turn 3");
    expect(status.textContent).toContain("MAIN");
    expect(status.textContent).toContain("Opponent has priority");
  });

  it("drops its outer margins and borders when embedded in the action rail", () => {
    render(
      <MatchStatusBar
        matchInfo={{ format: "turncycle", turn: 1, phase: "main-phase", mode: "hot-seat" }}
        isSelfTurn
        isSelfPriority
        embedded
      />,
    );

    const status = screen.getByRole("region", { name: /match status/i });
    expect(status.className).toContain("h-full");
    expect(status.className).not.toContain("mx-3");
  });
});
