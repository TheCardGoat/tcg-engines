// @vitest-environment jsdom
import { cleanup, fireEvent, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderFabSimulatorScenario } from "../testing/render-fab-simulator";

afterEach(() => {
  cleanup();
  window.sessionStorage.removeItem("fab-practice:active-match:v1");
});

describe("Viserai traverse history previews", () => {
  it("drives both traverses and previews both hero faces from their history lines", async () => {
    const session = renderFabSimulatorScenario({ scenarioId: "viserai-traverse-threshold" });
    await session.pom.waitForReady();
    await session.pom.as("player-1").play("Read the Runes");

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /^Viserai, Usurper, leader, player-1/ }),
      ).toBeDefined(),
    );
    await session.pom.passBoth();
    const useEffect = await screen.findByRole("button", { name: "Use effect" });
    fireEvent.click(useEffect);
    await waitFor(() =>
      expect(
        screen.getByRole("button", {
          name: /^Viserai, Between Worlds, leader, player-1/,
        }),
      ).toBeDefined(),
    );

    const historyTab = screen.getByRole("tab", { name: "History" });
    if (historyTab.getAttribute("aria-selected") !== "true") {
      fireEvent.click(historyTab);
    }

    const history = await screen.findByRole("region", { name: "Match history" });
    const betweenWorlds = (
      await waitFor(() =>
        within(history).getAllByRole("button", { name: "Preview Viserai, Between Worlds" }),
      )
    )[0]!;
    const usurper = within(history).getAllByRole("button", {
      name: "Preview Viserai, Usurper",
    })[0]!;

    expect(history.textContent).toContain(
      "Viserai, Between Worlds transformed into Viserai, Usurper",
    );
    expect(history.textContent).toContain(
      "Viserai, Usurper transformed into Viserai, Between Worlds",
    );

    fireEvent.mouseEnter(betweenWorlds);
    await waitFor(() => {
      const preview = screen.getByTestId("fab-card-preview");
      expect(preview.getAttribute("data-visible")).toBe("true");
      expect(preview.textContent).toContain("Viserai, Between Worlds");
    });

    fireEvent.mouseLeave(betweenWorlds);
    fireEvent.mouseEnter(usurper);
    await waitFor(() => {
      const preview = screen.getByTestId("fab-card-preview");
      expect(preview.getAttribute("data-visible")).toBe("true");
      expect(preview.textContent).toContain("Viserai, Usurper");
    });
  }, 30_000);
});
