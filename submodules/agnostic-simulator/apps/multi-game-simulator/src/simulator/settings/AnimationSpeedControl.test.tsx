// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";

import { AnimationSpeedControl } from "./AnimationSpeedControl";
import { SimulatorSettingsProvider } from "./SimulatorSettingsProvider";
import { SIMULATOR_ANIMATION_SPEED_STORAGE_KEY } from "./simulator-settings";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("AnimationSpeedControl", () => {
  test("lets the player pick Lorcana-style animation speed buckets", () => {
    render(
      <SimulatorSettingsProvider>
        <AnimationSpeedControl />
      </SimulatorSettingsProvider>,
    );

    const control = screen.getByLabelText("Animation speed") as HTMLSelectElement;
    expect(control.value).toBe("normal");

    fireEvent.change(control, { target: { value: "slow" } });
    expect(control.value).toBe("slow");
    expect(window.localStorage.getItem(SIMULATOR_ANIMATION_SPEED_STORAGE_KEY)).toBe("slow");
  });
});
