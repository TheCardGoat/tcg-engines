// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { MemoryRouter, Route, Routes } from "react-router";
import { setSimulatorSoundVolume } from "@tcg/simulator-presentation/audio/sound-service";
import { useSimulatorSettings } from "../simulator/settings";
import OpeningPreviewRoute from "./opening-preview";

vi.mock("@tcg/simulator-presentation/audio/sound-service", () => ({
  disposeSimulatorSoundService: vi.fn(),
  initSimulatorSoundService: vi.fn(() => Promise.resolve()),
  playSimulatorSound: vi.fn(),
  setSimulatorSoundVolume: vi.fn(),
  setSimulatorSoundPack: vi.fn(() => Promise.resolve()),
}));
// Provider contract probe, not a card or native-fixture substitute.
vi.mock("../games/alpha-clash/pages/Practice.page", () => ({
  AlphaClashPracticePage: function SettingsProbe() {
    const { settings, setSoundVolume } = useSimulatorSettings();
    return (
      <>
        <output aria-label="Volume">{settings.soundVolume}</output>
        <button onClick={() => setSoundVolume(0)}>Mute</button>
        <button onClick={() => setSoundVolume(75)}>Sound on</button>
      </>
    );
  },
}));
afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.clearAllMocks();
});

test("native opening route owns working settings and application audio", async () => {
  window.localStorage.clear();
  render(
    <MemoryRouter initialEntries={["/alpha-clash/simulator/tests/opening-preview"]}>
      <Routes>
        <Route
          path="/:gameSlug/simulator/tests/opening-preview"
          element={<OpeningPreviewRoute />}
        />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByRole("button", { name: "Mute" });
  expect(screen.getByLabelText("Volume").textContent).toBe("75");
  fireEvent.click(screen.getByRole("button", { name: "Mute" }));
  await waitFor(() => expect(screen.getByLabelText("Volume").textContent).toBe("0"));
  expect(setSimulatorSoundVolume).toHaveBeenLastCalledWith(0);
  fireEvent.click(screen.getByRole("button", { name: "Sound on" }));
  await waitFor(() => expect(screen.getByLabelText("Volume").textContent).toBe("75"));
  expect(setSimulatorSoundVolume).toHaveBeenLastCalledWith(75);
});
