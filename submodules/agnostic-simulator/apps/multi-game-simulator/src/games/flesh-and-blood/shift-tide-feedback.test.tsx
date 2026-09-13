// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, screen } from "@testing-library/react";
import { renderFabSimulatorScenario } from "./testing/render-fab-simulator";

afterEach(cleanup);
it("explains why Shift the Tide cannot be played from arsenal on a four-power Durendal", async () => {
  renderFabSimulatorScenario({ scenarioId: "shift-tide-arsenal-feedback" });
  await screen.findByTestId("fab-practice-page", {}, { timeout: 15000 });
  const card = screen.getByRole("button", { name: /^Shift the Tide of Battle, card,/i });
  fireEvent.click(card);
  expect((await screen.findByTestId("fab-practice-reversal-notice")).textContent).toContain(
    "no legal target",
  );
});
