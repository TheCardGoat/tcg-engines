// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import {
  EMPTY_SIMULATOR_ROUTE_CONTEXT,
  SimulatorRouteContextProvider,
} from "../../simulator/providers/route-context";
import { GrandArchiveSimulatorProviders } from "./App";
import { GrandArchiveFixturesPage } from "./Fixtures.page";
import { GrandArchiveHomePage } from "./Home.page";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";

afterEach(cleanup);

function renderRoute(path: string, element: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <SimulatorRouteContextProvider
        value={{ ...EMPTY_SIMULATOR_ROUTE_CONTEXT, gameSlug: "grand-archive" }}
      >
        {element}
      </SimulatorRouteContextProvider>
    </MemoryRouter>,
  );
}

describe("Grand Archive simulator navigation", () => {
  it("plays material cards and skips through Pass in the resettable material-hand fixture", () => {
    renderRoute(
      "/grand-archive/simulator/tests/materialization-hand",
      <GrandArchiveSimulatorProviders>
        <Routes>
          <Route
            path="/grand-archive/simulator/tests/:fixtureId"
            element={<GrandArchiveFixturesPage />}
          />
        </Routes>
      </GrandArchiveSimulatorProviders>,
    );
    const material = screen.getByRole("region", { name: /Your material deck/ });
    fireEvent.click(within(material).getByRole("button", { name: /Life Essence Amulet/ }));
    expect(screen.queryByRole("region", { name: /Your material deck/ })).toBeNull();
    expect(screen.getByRole("region", { name: /Your hand/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Life Essence Amulet, layer 1/ })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Reset materialization" }));
    expect(screen.getByRole("region", { name: /Your material deck/ })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Skip materialization" })).toHaveLength(2);
    fireEvent.click(
      within(screen.getByRole("group", { name: "Hand actions" })).getByRole("button", {
        name: "Skip materialization",
      }),
    );
    expect(screen.queryByRole("region", { name: /Your material deck/ })).toBeNull();
    expect(screen.getByRole("region", { name: /Your hand/ })).toBeTruthy();
  });

  it("offers practice and fixture entry points from the simulator hub", () => {
    renderRoute("/grand-archive/simulator", <GrandArchiveHomePage />);

    expect(screen.getByTestId("grand-archive-simulator-hub")).toBeTruthy();
    expect(screen.getByTestId("ga-home-practice").getAttribute("href")).toBe(
      "/grand-archive/simulator/play/practice",
    );
    expect(screen.getByTestId("ga-home-fixtures").getAttribute("href")).toBe(
      "/grand-archive/simulator/tests",
    );
  });

  it("filters the fixture catalog and opens the routed engine state", () => {
    renderRoute(
      "/grand-archive/simulator/tests",
      <GrandArchiveSimulatorProviders>
        <Routes>
          <Route path="/grand-archive/simulator/tests" element={<GrandArchiveFixturesPage />} />
          <Route
            path="/grand-archive/simulator/tests/:fixtureId"
            element={<GrandArchiveFixturesPage />}
          />
        </Routes>
      </GrandArchiveSimulatorProviders>,
    );

    fireEvent.change(screen.getByTestId("ga-fixture-search"), {
      target: { value: "recollection" },
    });
    expect(screen.getByTestId("ga-fixture-count").textContent).toContain(
      `Showing 1 of ${GRAND_ARCHIVE_VISUAL_FIXTURES.length}`,
    );

    fireEvent.click(
      within(screen.getByTestId("grand-archive-fixture-index")).getByRole("link", {
        name: /Decision/,
      }),
    );
    const tabletop = screen.getByTestId("grand-archive-tabletop");
    expect(tabletop).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: "Lab" }));
    const session = screen.getByRole("region", { name: "Session" });
    expect(within(session).getByText("Decision")).toBeTruthy();
    expect(within(session).getByText("Decision · choose-recollection")).toBeTruthy();
  });
});
