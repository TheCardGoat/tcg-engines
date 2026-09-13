// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { GrandArchiveGameSummary } from "./GrandArchiveGameSummary";

describe("Grand Archive game summary", () => {
  afterEach(cleanup);

  it("renders simultaneous winners as a draw", () => {
    render(
      <GrandArchiveGameSummary
        viewerId="p1"
        winnerIds={["p1", "p2"]}
        participantLabel={(playerId) => playerId}
        onInspectBoard={vi.fn()}
        onMainMenu={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Draw" })).toBeTruthy();
    expect(screen.getByText("No sole winner")).toBeTruthy();
  });
});
