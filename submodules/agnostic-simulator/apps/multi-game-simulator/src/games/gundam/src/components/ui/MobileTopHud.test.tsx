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
        isSelfTurn
        isSelfPriority={false}
        onOpenLog={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Turn: You")).not.toBeNull();
    expect(screen.getByLabelText("Priority: Opponent")).not.toBeNull();
    const logButton = screen.getByRole("button", { name: /comms log/i });
    expect(logButton.className).toContain("h-11");
    expect(logButton.closest("header")?.className).toContain("gd-dark-surface");
    expect(logButton.getAttribute("style")).toContain("--color-hud-accent-hot");
  });
});
