// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, screen, waitFor, within } from "@testing-library/react";
import { renderFabSimulatorScenario } from "./testing/render-fab-simulator";

// Owns the F009 playtest regression: undoing after a declined Danse Macabre
// optional must roll the whole ally play back, not re-open the declined prompt.
afterEach(() => {
  cleanup();
  window.sessionStorage.removeItem("fab-practice:active-match:v1");
});

const undoButton = () => screen.getByTestId("fab-action-undo") as HTMLButtonElement;

describe("practice undo after declining Danse Macabre", () => {
  it("rolls the Magister play back to the pre-play state instead of looping the prompt", async () => {
    const { pom } = renderFabSimulatorScenario({ scenarioId: "undo-decline-danse-macabre" });
    await screen.findByTestId("fab-practice-page", {}, { timeout: 15_000 });
    await pom.waitForReady();
    const player = pom.as("player-1");
    expect(await player.actionPoints()).toBe(1);

    await player.play("Restless Magister");
    // The ally enters the permanent zone once the played layer resolves;
    // fixture priority automation passes the window on both seats.
    await waitFor(
      async () => expect(await player.zoneHas("permanent", "Restless Magister")).toBe(true),
      { timeout: 8_000 },
    );
    expect(await player.actionPoints()).toBe(0);

    const currentEffect = await screen.findByRole("region", { name: "Current effect" });
    fireEvent.click(within(currentEffect).getByRole("button", { name: "Decline" }));
    await waitFor(() =>
      expect(screen.queryByRole("region", { name: "Current effect" })).toBeNull(),
    );

    await waitFor(() => expect(undoButton().disabled).toBe(false));
    fireEvent.click(undoButton());

    await waitFor(
      async () =>
        expect((await player.hand()).some((label) => label.includes("Restless Magister"))).toBe(
          true,
        ),
      { timeout: 5_000 },
    );
    expect(await player.zoneHas("permanent", "Restless Magister")).toBe(false);
    expect(await player.actionPoints()).toBe(1);
    expect(undoButton().disabled).toBe(true);
    // The declined Danse Macabre optional must stay cleared instead of
    // re-opening, and the board must be actionable again.
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(screen.queryByRole("region", { name: "Current effect" })).toBeNull();
    expect(await pom.canPass()).toBe(true);
  }, 30_000);
});
