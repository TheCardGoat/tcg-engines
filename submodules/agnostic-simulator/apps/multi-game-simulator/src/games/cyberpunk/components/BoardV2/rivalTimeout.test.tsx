// @vitest-environment jsdom
import { fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vite-plus/test";
import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../../testing/render-cyberpunk-simulator";
import {
  buildRivalTimeoutFixture,
  timeoutFixtureConnections,
} from "../../testing/rival-timeout-fixture";

test("V2 rival timer reopens minimized timeout options and keeps drop confirmation", async () => {
  ensureJsdomAnimationSupport();
  const onClaimRivalDrop = vi.fn();
  const view = renderCyberpunkSimulatorScenario({
    scenarioId: "retailCombatGigBench",
    ui: "v2",
    boardProps: {
      initialEngineBuilder: () => buildRivalTimeoutFixture("retailCombatGigBench"),
      playerConnections: timeoutFixtureConnections,
      onClaimRivalDrop,
    },
  });
  try {
    await view.findByText("Opponent time expired");
    fireEvent.click(view.getByRole("button", { name: "Minimize" }));
    expect(view.queryByText("Opponent time expired")).toBeNull();
    const timer = view.getByRole("button", { name: "Rival time expired - show options" });
    fireEvent.click(timer);
    expect(view.getByText("Opponent time expired")).toBeTruthy();

    fireEvent.click(view.getByRole("button", { name: "Drop Opponent" }));
    expect(onClaimRivalDrop).not.toHaveBeenCalled();
    fireEvent.click(view.getByRole("button", { name: "Minimize" }));
    timer.focus();
    await userEvent.keyboard("{Enter}");
    expect(view.getByRole("button", { name: "Drop Opponent" })).toBeTruthy();
    expect(view.queryByRole("button", { name: "Confirm Drop" })).toBeNull();
    fireEvent.click(view.getByRole("button", { name: "Drop Opponent" }));
    fireEvent.click(view.getByRole("button", { name: "Confirm Drop" }));
    await waitFor(() => expect(onClaimRivalDrop).toHaveBeenCalledTimes(1));
  } finally {
    view.unmount();
  }
});

test("V2 running rival timer has no timeout action", async () => {
  ensureJsdomAnimationSupport();
  const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailCombatGigBench", ui: "v2" });
  try {
    await view.findByTestId("phase-clock");
    expect(view.queryByRole("button", { name: "Rival time expired - show options" })).toBeNull();
  } finally {
    view.unmount();
  }
});
