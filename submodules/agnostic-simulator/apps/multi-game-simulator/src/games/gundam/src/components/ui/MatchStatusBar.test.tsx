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
        controlState={{ kind: "interactive", turnOwner: "self", priorityHolder: "opponent" }}
      />,
    );

    const status = screen.getByRole("region", { name: /match status/i });
    expect(status.textContent).toContain("Your turn");
    expect(status.textContent).toContain("Turn 3");
    expect(status.textContent).toContain("MAIN");
    expect(screen.getByLabelText("Opponent priority")).toBeTruthy();
    expect(screen.getByLabelText("Opponent priority").getAttribute("data-direction")).toBe(
      "opponent",
    );
  });

  it("drops its outer margins and borders when embedded in the action rail", () => {
    render(
      <MatchStatusBar
        matchInfo={{ format: "turncycle", turn: 1, phase: "main-phase", mode: "hot-seat" }}
        controlState={{ kind: "interactive", turnOwner: "self", priorityHolder: "self" }}
        embedded
      />,
    );

    const status = screen.getByRole("region", { name: /match status/i });
    expect(status.className).toContain("h-full");
    expect(status.className).not.toContain("mx-3");
  });

  it("keeps every match-state value explicit in the compact tablet layout", () => {
    render(
      <MatchStatusBar
        matchInfo={{ format: "turncycle", turn: 3, phase: "main-phase", mode: "hot-seat" }}
        controlState={{ kind: "interactive", turnOwner: "self", priorityHolder: "opponent" }}
        embedded
        compact
      />,
    );

    const status = screen.getByRole("region", { name: /match status/i });
    expect(status.textContent).toContain("YOU");
    expect(status.textContent).toContain("T3");
    expect(status.textContent).toContain("MAIN");
    expect(screen.getByLabelText("Your turn")).toBeTruthy();
    expect(screen.getByLabelText("Turn 3")).toBeTruthy();
    expect(screen.getByLabelText("Opponent priority")).toBeTruthy();
  });

  it("shows a neutral resolving beacon without implying an actionable player", () => {
    render(
      <MatchStatusBar
        matchInfo={{ format: "turncycle", turn: 3, phase: "battle-phase", mode: "hot-seat" }}
        controlState={{ kind: "resolving", turnOwner: "opponent" }}
      />,
    );

    const beacon = screen.getByLabelText("Resolving");
    expect(beacon.getAttribute("data-direction")).toBeNull();
    expect(beacon.getAttribute("data-priority-beacon")).toBe("resolving");
  });
});
