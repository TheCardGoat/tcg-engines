// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vite-plus/test";

import { loadPilotPairDemo } from "../../game/fixtures/pilot-pair-demo.ts";
import { renderSimulator } from "../../test/renderSimulator.tsx";
import { supportTargetInstruction } from "./PromptContainer.tsx";

describe("PromptContainer pilot pairing copy", () => {
  it("names the Pilot and the required Unit target", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(any-hover: hover)",
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }));
    const user = userEvent.setup();
    renderSimulator(loadPilotPairDemo);

    const pilot = screen.getByText("Amuro Ray", { exact: true });
    await user.hover(pilot);
    expect(screen.queryByTestId("card-hover-preview")).not.toBeNull();

    await user.click(pilot);
    const pairAction = screen.queryByText("Pair Pilot", { exact: true });
    if (pairAction) fireEvent.click(pairAction.closest("button")!);

    expect(
      screen.getByText("Choose a Unit. Green LINK meets Amuro Ray's Link Condition.", {
        exact: true,
      }),
    ).toBeTruthy();
    expect(screen.queryByTestId("card-hover-preview")).toBeNull();
  });

  it("places an own-Unit target prompt below compact landscape cards", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 568 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 320 });
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }));
    const user = userEvent.setup();
    renderSimulator(loadPilotPairDemo);

    await user.click(screen.getByRole("button", { name: "Amuro Ray (cost 1)" }));
    const pairAction = screen.queryByText("Pair Pilot", { exact: true });
    if (pairAction) fireEvent.click(pairAction.closest("button")!);
    expect(
      screen.getByText("Choose a Unit. Green LINK meets Amuro Ray's Link Condition.", {
        exact: true,
      }),
    ).toBeTruthy();
    expect(screen.getByTestId("interaction-resolution-prompt").dataset.placement).toBe("top");
  });
});

describe("PromptContainer Support copy", () => {
  it("keeps the AP outcome in the target-selection instruction", () => {
    expect(supportTargetInstruction("<Support 2>")).toBe(
      "Choose another friendly Unit to get +2 AP this turn.",
    );
    expect(supportTargetInstruction("Draw 1.")).toBeUndefined();
  });
});
