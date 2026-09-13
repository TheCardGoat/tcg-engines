// @vitest-environment jsdom
import { HeadlessMantineProvider } from "@mantine/core";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { FleshAndBloodSimulatorProviders } from "../App";
import { FabPresentationCatalogProvider } from "../FabPresentationCatalog";
import { FabPresentationTestProvider } from "../presentation-test-provider";
import { FleshAndBloodPracticePage } from "../Practice.page";
import { installBrowserShims } from "../../../testing/browser-shims";

describe("FAB Courage visual scenario", () => {
  beforeEach(() => {
    installBrowserShims();
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });
  });

  afterEach(cleanup);

  it("shows both Courage creations in player-visible match history", async () => {
    render(
      <HeadlessMantineProvider>
        <FabPresentationCatalogProvider>
          <FabPresentationTestProvider>
            <MemoryRouter
              initialEntries={["/flesh-and-blood/simulator/tests/courage-consumption-and-logs"]}
            >
              <FleshAndBloodSimulatorProviders>
                <Routes>
                  <Route
                    path="/flesh-and-blood/simulator/tests/:fixtureId"
                    element={<FleshAndBloodPracticePage />}
                  />
                </Routes>
              </FleshAndBloodSimulatorProviders>
            </MemoryRouter>
          </FabPresentationTestProvider>
        </FabPresentationCatalogProvider>
      </HeadlessMantineProvider>,
    );

    await waitFor(() => {
      const history = screen.getByRole("region", { name: "Match history" }).textContent ?? "";
      expect(history.match(/You created Courage/g)).toHaveLength(2);
    });

    expect(screen.getByRole("region", { name: "Match history" }).textContent).toContain(
      "You attacked Practice bot with Head Jab",
    );
    expect(screen.getByLabelText("Head Jab · 5 power · undefended")).not.toBeNull();
    expect(screen.getByLabelText("Your permanents, 2 cards").textContent).not.toContain("Courage");
  });
});
