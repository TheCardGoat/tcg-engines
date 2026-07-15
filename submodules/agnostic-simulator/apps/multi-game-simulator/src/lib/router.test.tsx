// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { SimulatorAudioProvider } from "../simulator/audio";
import { SimulatorAuthContextProvider } from "../simulator/providers/auth-context";
import type { SimulatorAuthContextValue } from "../simulator/providers";
import { SimulatorSettingsProvider, useSimulatorSettings } from "../simulator/settings";
import { initSimulatorSoundService } from "../simulator/audio/sound-service";
import { createSimulatorBrowserRouter, SimulatorRouterProvider } from "./router.tsx";

vi.mock("../simulator/audio/sound-service", () => ({
  disposeSimulatorSoundService: vi.fn(),
  initSimulatorSoundService: vi.fn(),
  playSimulatorSound: vi.fn(),
  setSimulatorSoundVolume: vi.fn(),
}));

describe("createSimulatorBrowserRouter", () => {
  it("normalizes the router basename", () => {
    const router = createSimulatorBrowserRouter(
      [{ path: "/", element: null }],
      "cyberpunk/simulator/",
    );

    expect(router.basename).toBe("/cyberpunk/simulator");

    router.dispose();
  });
});

describe("SimulatorRouterProvider", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/mounted/simulator");
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("bridges simulator settings into the nested router root", async () => {
    render(
      <SimulatorAuthContextProvider value={authContext()}>
        <SimulatorSettingsProvider initialSettings={{ soundVolume: 35 }}>
          <SimulatorAudioProvider>
            <OuterSettingsProbe />
            <SimulatorRouterProvider
              basename="/mounted/simulator"
              routes={[{ path: "/", element: <MountedSettingsProbe /> }]}
            />
          </SimulatorAudioProvider>
        </SimulatorSettingsProvider>
      </SimulatorAuthContextProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("mounted-volume").textContent).toBe("35");
    });
    expect(screen.getByTestId("outer-volume").textContent).toBe("35");

    fireEvent.click(screen.getByRole("button", { name: "set mounted volume" }));

    await waitFor(() => {
      expect(screen.getByTestId("mounted-volume").textContent).toBe("80");
    });
    expect(screen.getByTestId("outer-volume").textContent).toBe("80");
    expect(initSimulatorSoundService).toHaveBeenCalledTimes(1);
  });
});

function OuterSettingsProbe() {
  const {
    settings: { soundVolume },
  } = useSimulatorSettings();

  return <output data-testid="outer-volume">{soundVolume}</output>;
}

function MountedSettingsProbe() {
  const {
    settings: { soundVolume },
    setSoundVolume,
  } = useSimulatorSettings();

  return (
    <section>
      <output data-testid="mounted-volume">{soundVolume}</output>
      <button type="button" onClick={() => setSoundVolume(80)}>
        set mounted volume
      </button>
    </section>
  );
}

function authContext(): SimulatorAuthContextValue {
  return {
    auth: null,
    userId: "user-1",
    displayName: "Player",
    isAuthenticated: true,
    subscriptionTier: null,
    isPremium: false,
  };
}
