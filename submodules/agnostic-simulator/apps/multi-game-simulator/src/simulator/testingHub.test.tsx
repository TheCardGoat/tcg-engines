// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { TESTER_HUB_GAMES, TesterHubPage, loadTesterHub } from "./testingHub";

afterEach(cleanup);

describe("tester hubs", () => {
  it("keeps only real capabilities and routes for every registered simulator", async () => {
    for (const game of TESTER_HUB_GAMES) {
      const descriptor = await loadTesterHub(game);
      expect(descriptor.sections.flatMap((section) => section.capabilities)).not.toHaveLength(0);
      expect(descriptor.fixtures).not.toHaveLength(0);
      expect(new Set(descriptor.fixtureGroups.map((group) => group.id)).size).toBe(
        descriptor.fixtureGroups.length,
      );
      for (const fixture of descriptor.fixtures) {
        expect(fixture.href).toMatch(
          new RegExp(`^/(?:${game.replace("-", "\\-")})/|^/riftbound/matchmaking$`),
        );
        expect(descriptor.fixtureGroups.some((group) => group.id === fixture.groupId)).toBe(true);
      }
      for (const capability of descriptor.sections.flatMap((section) => section.capabilities)) {
        expect(capability.href).toMatch(
          new RegExp(`^/(?:${game.replace("-", "\\-")})/|^/riftbound/matchmaking$`),
        );
        expect(capability.title).not.toMatch(/unavailable|coming soon/i);
      }
    }
  });

  it("loads the Cyberpunk hub without evaluating FAB engine scenarios", async () => {
    const descriptor = await loadTesterHub("cyberpunk");
    expect(descriptor.title).toBe("Cyberpunk tester hub");
    expect(descriptor.fixtures.length).toBeGreaterThan(0);
  });

  it("documents Naruto handoffs without fabricating a launcher", async () => {
    render(<TesterHubPage game="naruto" />);

    expect(
      await screen.findByRole("heading", { name: "Naruto Preview tester hub" }),
    ).not.toBeNull();
    expect(screen.getByTestId("tester-hub-naruto-practice").getAttribute("href")).toBe(
      "/naruto/simulator/practice",
    );
    expect(screen.getByTestId("tester-hub-fixture-opening").getAttribute("href")).toBe(
      "/naruto/simulator/tests/opening",
    );
    expect(screen.getByRole("combobox", { name: "Filter fixtures by group" })).not.toBeNull();
    expect(screen.getByTestId("tester-hub-naruto-state").getAttribute("href")).toContain(
      "state=:encoded-state",
    );
    expect(screen.getByText("Requires: state query parameter")).not.toBeNull();
    expect(screen.getByTestId("tester-hub-naruto-match").getAttribute("href")).toBe(
      "/naruto/simulator/matches/:matchId",
    );
  });

  it("lists the Riftbound private-room flow", async () => {
    render(<TesterHubPage game="riftbound" />);

    expect(await screen.findByRole("heading", { name: "Riftbound tester hub" })).not.toBeNull();
    expect(screen.getByTestId("tester-hub-riftbound-rooms").getAttribute("href")).toBe(
      "/riftbound/matchmaking",
    );
  });

  it("filters direct Naruto fixture links by group", async () => {
    render(<TesterHubPage game="naruto" />);

    const groupFilter = await screen.findByRole("combobox", { name: "Filter fixtures by group" });
    fireEvent.change(groupFilter, { target: { value: "layout" } });

    expect(screen.getByTestId("tester-hub-fixture-mobile-portrait")).not.toBeNull();
    expect(screen.queryByTestId("tester-hub-fixture-opening")).toBeNull();
    expect(screen.getByText("2 shown")).not.toBeNull();
  });
});
