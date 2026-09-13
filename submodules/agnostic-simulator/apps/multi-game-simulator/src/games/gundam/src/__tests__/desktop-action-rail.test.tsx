// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { loadMainPhaseDemo } from "../game/fixtures/main-phase-demo.ts";
import { loadSetupDefault } from "../game/fixtures/setup-default.ts";
import { renderSimulator } from "../test/renderSimulator.tsx";

const originalWidth = window.innerWidth;
const originalHeight = window.innerHeight;
afterEach(() => {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: originalWidth });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: originalHeight });
  vi.restoreAllMocks();
});

describe("Desktop action rail", () => {
  it("retains Undo and keyboard Pass in a short fine-pointer desktop", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 480 });
    const user = userEvent.setup();
    renderSimulator(loadMainPhaseDemo);
    expect(screen.getByTestId("gundam-shared-simulator-shell").dataset.layout).toBe("desktop");
    const controls = screen.getByTestId("gundam-desktop-hand-controls");
    expect(within(controls).getByTestId("undo-button")).toBeTruthy();
    expect(screen.getAllByTestId("primary-action")).toHaveLength(1);
    await user.keyboard(" ");
    expect(screen.getByRole("dialog", { name: "Actions still available" })).toBeTruthy();
  });

  it("leaves short coarse-pointer controls in the mobile rail", () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 480 });
    const matchMedia = window.matchMedia;
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      ...matchMedia(query),
      matches: query === "(pointer: coarse)",
    }));
    renderSimulator(loadMainPhaseDemo);
    expect(screen.getByTestId("gundam-shared-simulator-shell").dataset.layout).toBe("mobile");
    expect(screen.queryByTestId("gundam-desktop-hand-controls")).toBeNull();
    expect(screen.getAllByTestId("undo-button")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "PASS TURN" })).toBeTruthy();
  });
  it("keeps Undo and Pass beside the hand and Concede in the sidebar", () => {
    const { container } = renderSimulator(loadSetupDefault);
    const actions = screen.getByRole("region", { name: "Match actions" });
    const handControls = screen.getByTestId("gundam-desktop-hand-controls");
    const undoAction = within(handControls).getByTestId("undo-button");
    const primaryAction = within(handControls).getByTestId("primary-action");
    const concedeAction = actions.querySelector("[title='Concede']");

    expect(container.querySelector("[data-testid='desktop-match-rail']")).toBeNull();
    expect(undoAction).not.toBeNull();
    expect(primaryAction).not.toBeNull();
    expect(concedeAction).not.toBeNull();
    expect(actions.querySelector("[data-testid='primary-action']")).toBeNull();
    expect(actions.querySelector("[aria-label='Match status']")).toBeNull();
  });

  it("opens the existing Pass confirmation from the hand controls", async () => {
    const user = userEvent.setup();
    renderSimulator(loadMainPhaseDemo);
    const handControls = screen.getByTestId("gundam-desktop-hand-controls");
    await user.click(within(handControls).getByRole("button", { name: "PASS TURN" }));
    expect(screen.getByRole("dialog", { name: "Actions still available" })).toBeTruthy();
  });
});
