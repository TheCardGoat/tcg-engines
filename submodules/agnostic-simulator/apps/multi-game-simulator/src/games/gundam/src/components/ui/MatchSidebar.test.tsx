// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { MatchSidebar } from "./MatchSidebar.tsx";

afterEach(cleanup);

describe("MatchSidebar", () => {
  it("keeps player telemetry around a visible battle log", () => {
    render(
      <MatchSidebar
        matchInfo={{ format: "turncycle", turn: 2, phase: "main-phase", mode: "hot-seat" }}
        players={[
          {
            name: "rival",
            shields: 4,
            resourcesAvailable: 2,
            resourcesTotal: 3,
            deck: 30,
            discard: 2,
          },
          {
            name: "pilot",
            shields: 5,
            resourcesAvailable: 3,
            resourcesTotal: 3,
            deck: 31,
            discard: 1,
          },
        ]}
        currentTurn="self"
        priorityHolder="self"
        log={[]}
        onConcede={vi.fn()}
      />,
    );

    const log = screen.getByRole("log", { name: /comms log/i });
    expect(log).not.toBeNull();
    expect(log.closest("aside")?.className).toContain("gd-command-surface");
    expect(log.closest("aside")?.className).toContain("gd-dark-surface");
    expect(screen.getByText(/match events will appear here/i)).not.toBeNull();

    const pilotResources = screen.getByLabelText("pilot resources");
    expect(within(pilotResources).getByText("5")).not.toBeNull();
    expect(within(pilotResources).getByText("3/3")).not.toBeNull();
    expect(within(pilotResources).getByText("31")).not.toBeNull();
    expect(within(pilotResources).getByText("1")).not.toBeNull();
  });
});
