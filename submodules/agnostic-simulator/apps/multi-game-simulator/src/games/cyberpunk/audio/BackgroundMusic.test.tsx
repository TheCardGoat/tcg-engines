import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vite-plus/test";
import { SimulatorSettingsDialog } from "../../../simulator/participant-actions/SimulatorParticipantActions";
import { SimulatorSettingsProvider } from "../../../simulator/settings/SimulatorSettingsProvider";
import { BackgroundMusicControls, BackgroundMusicProvider } from "./BackgroundMusic";
import { MUSIC_STORAGE_KEY, type MusicBackend } from "./background-music";

afterEach(() => {
  cleanup();
  localStorage.clear();
});
it("lets a player select, skip, mute, adjust volume, and restore preferences", async () => {
  const voice = { fadeIn: vi.fn(), fadeOutAndStop: vi.fn() };
  const backend = {
    now: 0,
    unlock: vi.fn(async () => {}),
    load: vi.fn(async () => ({ duration: 32, start: () => voice })),
    setVolume: vi.fn(),
    dispose: vi.fn(),
  } satisfies MusicBackend;
  const mount = () =>
    render(
      <MantineProvider>
        <BackgroundMusicProvider backendFactory={() => backend}>
          <BackgroundMusicControls />
        </BackgroundMusicProvider>
      </MantineProvider>,
    );
  const view = mount();
  expect(
    screen.getByRole<HTMLInputElement>("slider", { name: "Background music volume" }).value,
  ).toBe("3");
  expect(backend.load).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText("Music options"));
  fireEvent.pointerDown(window);
  await screen.findByText("Playing: Neon Cut Deal");
  fireEvent.change(screen.getByLabelText("Music track"), { target: { value: "ghost-signal" } });
  await screen.findByText("Playing: Ghost Signal");
  fireEvent.click(screen.getByRole("switch", { name: "Mute background music" }));
  expect(backend.setVolume).toHaveBeenLastCalledWith(0);
  fireEvent.click(screen.getByRole("button", { name: "Next track" }));
  await waitFor(() =>
    expect(screen.getByLabelText<HTMLSelectElement>("Music track").value).toBe("rain-on-chrome"),
  );
  expect(screen.getByText("Background music muted.")).toBeTruthy();
  fireEvent.change(screen.getByRole("slider", { name: "Background music volume" }), {
    target: { value: "26" },
  });
  expect(
    screen.getByRole<HTMLInputElement>("slider", { name: "Background music volume" }).value,
  ).toBe("26");
  expect(JSON.parse(localStorage.getItem(MUSIC_STORAGE_KEY) ?? "{}")).toEqual({
    volume: 26,
    muted: true,
    trackId: "rain-on-chrome",
  });
  view.unmount();
  expect(backend.dispose).toHaveBeenCalledOnce();
  mount();
  expect(
    screen.getByRole<HTMLInputElement>("slider", { name: "Background music volume" }).value,
  ).toBe("26");
  expect(
    screen.getByRole<HTMLInputElement>("switch", { name: "Mute background music" }).checked,
  ).toBe(true);
  fireEvent.click(screen.getByRole("switch", { name: "Mute background music" }));
  expect(backend.setVolume).toHaveBeenLastCalledWith(0.26);
});

it("keeps effects and background volume independent in the same settings panel", async () => {
  const backend = {
    now: 0,
    unlock: vi.fn(async () => {}),
    load: vi.fn(async () => ({
      duration: 32,
      start: () => ({ fadeIn: vi.fn(), fadeOutAndStop: vi.fn() }),
    })),
    setVolume: vi.fn(),
    dispose: vi.fn(),
  } satisfies MusicBackend;
  const mount = () =>
    render(
      <MantineProvider>
        <SimulatorSettingsProvider>
          <BackgroundMusicProvider backendFactory={() => backend}>
            <SimulatorSettingsDialog
              gameConfiguration={{ audioSettings: <BackgroundMusicControls />, onSelect: vi.fn() }}
              accountSettingsHref="/settings"
              onClose={vi.fn()}
            />
          </BackgroundMusicProvider>
        </SimulatorSettingsProvider>
      </MantineProvider>,
    );
  const view = mount();
  const soundSettings = within(screen.getByRole("group", { name: "Sound" }));
  expect(soundSettings.getByRole("slider", { name: "Sound effects volume" })).toBeTruthy();
  expect(soundSettings.getByRole("slider", { name: "Background music volume" })).toBeTruthy();
  const effects = screen.getByRole<HTMLInputElement>("slider", { name: "Sound effects volume" });
  expect(effects.value).toBe("75");
  fireEvent.change(effects, { target: { value: "80" } });
  expect(
    screen.getByRole<HTMLInputElement>("slider", { name: "Background music volume" }).value,
  ).toBe("3");
  fireEvent.change(screen.getByRole("slider", { name: "Background music volume" }), {
    target: { value: "24" },
  });
  expect(
    screen.getByRole<HTMLInputElement>("slider", { name: "Background music volume" }).value,
  ).toBe("24");
  expect(effects.value).toBe("80");
  fireEvent.click(screen.getByRole("switch", { name: "Mute background music" }));
  expect(backend.setVolume).toHaveBeenLastCalledWith(0);
  expect(effects.value).toBe("80");
  view.unmount();
  mount();
  expect(screen.getByRole<HTMLInputElement>("slider", { name: "Sound effects volume" }).value).toBe(
    "80",
  );
  expect(
    screen.getByRole<HTMLInputElement>("slider", { name: "Background music volume" }).value,
  ).toBe("24");
  fireEvent.click(screen.getByRole("switch", { name: "Mute background music" }));
  expect(backend.setVolume).toHaveBeenLastCalledWith(0.24);
});
