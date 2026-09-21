// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";

import { UserConfigProvider } from "../../engine";
import { SimulatorSettingsProvider } from "../../../../simulator/settings";
import { SIMULATOR_ANIMATION_SPEED_STORAGE_KEY } from "../../../../simulator/settings/simulator-settings";
import { UserConfigButton } from "./UserConfigDialog";

describe("UserConfigButton", () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  test("updates the field card size setting", () => {
    render(
      <SimulatorSettingsProvider>
        <UserConfigProvider>
          <UserConfigButton />
        </UserConfigProvider>
      </SimulatorSettingsProvider>,
    );

    fireEvent.click(screen.getByLabelText("Open simulator settings"));

    expect(screen.getByRole("dialog", { name: "Settings" })).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: "Game" }));
    expect(screen.getByLabelText("Compact")).toBeTruthy();
    expect(screen.getByLabelText("Standard")).toBeTruthy();
    expect(screen.getByLabelText("Large")).toBeTruthy();

    fireEvent.click(screen.getByLabelText("Large"));

    expect(JSON.parse(window.localStorage.getItem("cyberpunk:userConfig") ?? "{}")).toMatchObject({
      fieldCardSize: "large",
    });
  });

  test("exposes the shared animation speed setting for Cyberpunk", () => {
    render(
      <SimulatorSettingsProvider>
        <UserConfigProvider>
          <UserConfigButton />
        </UserConfigProvider>
      </SimulatorSettingsProvider>,
    );

    fireEvent.click(screen.getByLabelText("Open simulator settings"));

    const animationSpeed = screen.getByLabelText("Animation speed") as HTMLSelectElement;
    expect(animationSpeed.value).toBe("normal");

    fireEvent.change(animationSpeed, { target: { value: "fast" } });

    expect(animationSpeed.value).toBe("fast");
    expect(window.localStorage.getItem(SIMULATOR_ANIMATION_SPEED_STORAGE_KEY)).toBe("fast");

    fireEvent.click(screen.getByRole("tab", { name: "Game" }));
    expect(screen.queryByText("Animation Pacing")).toBeNull();
  });
});
