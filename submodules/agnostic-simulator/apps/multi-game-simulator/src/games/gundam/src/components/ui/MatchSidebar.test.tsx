// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { MatchSidebar } from "./MatchSidebar.tsx";

afterEach(cleanup);

describe("MatchSidebar", () => {
  it("keeps player telemetry around a visible battle log", () => {
    render(
      <MatchSidebar
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
        controlState={{ kind: "interactive", turnOwner: "self", priorityHolder: "self" }}
        log={[]}
        actions={{
          undo: <button type="button">Undo</button>,
          primary: <button type="button">Pass turn</button>,
          danger: <button type="button">Concede</button>,
        }}
      />,
    );

    const log = screen.getByRole("log", { name: /comms log/i });
    expect(log).not.toBeNull();
    expect(log.closest("aside")?.className).toContain("gd-command-surface");
    expect(log.closest("aside")?.className).toContain("gd-dark-surface");
    expect(screen.getByText(/match events will appear here/i)).not.toBeNull();
    expect(screen.getByText("PRIORITY")).not.toBeNull();

    const pilotResources = screen.getByLabelText("Your resources");
    expect(within(pilotResources).getByText("5")).not.toBeNull();
    expect(within(pilotResources).getByText("3/3")).not.toBeNull();
    expect(within(pilotResources).getByText("31")).not.toBeNull();
    expect(within(pilotResources).getByText("1")).not.toBeNull();
  });

  it("shows turn and priority on different players when action rights split", () => {
    render(
      <MatchSidebar
        players={[
          { name: "rival", shields: 4, deck: 30, discard: 2 },
          { name: "pilot", shields: 5, deck: 31, discard: 1 },
        ]}
        controlState={{ kind: "interactive", turnOwner: "opponent", priorityHolder: "self" }}
        log={[]}
        actions={{
          undo: <button type="button">Undo</button>,
          primary: <button type="button">Pass block</button>,
          danger: <button type="button">Concede</button>,
        }}
      />,
    );

    expect(screen.getByLabelText("Opponent match status").textContent).toContain("TURN");
    expect(screen.getByLabelText("Your match status").textContent).toContain("PRIORITY");
    expect(screen.getByLabelText("Your match status").textContent).not.toContain("WAITING");
  });
});
