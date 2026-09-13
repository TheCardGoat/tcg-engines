// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { MobileTopHud } from "./MobileTopHud.tsx";

afterEach(cleanup);

describe("MobileTopHud", () => {
  it("shows turn and priority as separate text states", () => {
    render(
      <MobileTopHud
        matchInfo={{ format: "constructed", turn: 3, phase: "main", mode: "hot-seat" }}
        controlState={{ kind: "interactive", turnOwner: "self", priorityHolder: "opponent" }}
        onOpenLog={vi.fn()}
        opponentName="Rival"
        opponentClock="2:30"
        opponentShields={4}
      />,
    );

    expect(screen.getByText(/your turn/i)).not.toBeNull();
    expect(screen.getByText(/rival priority/i)).not.toBeNull();
    expect(screen.getByText("Rival")).not.toBeNull();
    expect(screen.getByText("2:30")).not.toBeNull();
    expect(screen.getByLabelText("Opponent shields: 4")).not.toBeNull();
    const logButton = screen.getByRole("button", { name: /match activity/i });
    expect(logButton.className).toContain("h-11");
    expect(logButton.closest('[data-side="opponent"]')?.className).toContain("gd-dark-surface");
    expect(logButton.getAttribute("style")).toContain("--color-hud-accent-hot");
  });

  it("describes setup decisions without claiming a turn has started", () => {
    render(
      <MobileTopHud
        matchInfo={{ format: "setup", turn: 1, phase: "choose-first-player", mode: "hot-seat" }}
        controlState={{ kind: "interactive", turnOwner: "self", priorityHolder: "self" }}
        onOpenLog={vi.fn()}
        opponentName="Opponent"
      />,
    );

    expect(screen.getByText("Setup")).not.toBeNull();
    expect(screen.getByText("Your decision")).not.toBeNull();
    expect(screen.queryByText("Your turn")).toBeNull();
    expect(screen.queryByText("Your priority")).toBeNull();
  });

  it("does not repeat the player name when the turn owner also has priority", () => {
    render(
      <MobileTopHud
        matchInfo={{ format: "constructed", turn: 1, phase: "main", mode: "hot-seat" }}
        controlState={{ kind: "interactive", turnOwner: "opponent", priorityHolder: "opponent" }}
        onOpenLog={vi.fn()}
        opponentName="Rival"
      />,
    );

    expect(screen.getByText("Rival turn · Priority")).not.toBeNull();
    expect(screen.queryByText("Rival priority")).toBeNull();
  });
});
