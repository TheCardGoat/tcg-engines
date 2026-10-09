// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { SimulatorAuthContextProvider } from "../../../../simulator/providers/auth-context";
import type { SimulatorAuthContextValue } from "../../../../simulator/providers";
import { SimulatorSettingsProvider } from "../../../../simulator/settings/SimulatorSettingsProvider";
import {
  SIMULATOR_SOUND_VOLUME_STORAGE_KEY,
  type SimulatorSettings,
} from "../../../../simulator/settings/simulator-settings";
import { BackgroundMusicProvider } from "../../audio/BackgroundMusic";
import { MUSIC_STORAGE_KEY, type MusicBackend, type MusicClip } from "../../audio/background-music";
import { SoundMuteShortcut } from "./SoundMuteShortcut";

const VOLUME_BEFORE_MUTE_KEY = "tcg:cyberpunk:sfx-volume-before-mute:v1";

function musicBackend(): MusicBackend {
  return {
    now: 0,
    unlock: vi.fn(async () => {}),
    load: vi.fn(async (): Promise<MusicClip> => ({
      duration: 10,
      start: () => ({ fadeIn: vi.fn(), fadeOutAndStop: vi.fn() }),
    })),
    setVolume: vi.fn(),
    dispose: vi.fn(),
  };
}

function auth(userId: string | null): SimulatorAuthContextValue {
  return {
    auth: null,
    userId,
    displayName: userId,
    isAuthenticated: userId !== null,
    subscriptionTier: null,
    isPremium: false,
  };
}

function renderShortcut(initialVolume: number | null) {
  const initialSettings: SimulatorSettings | null =
    initialVolume === null
      ? null
      : {
          soundVolume: initialVolume,
          soundPack: "original",
          cardInteractionMode: "detailed",
          animationSpeed: "normal",
        };
  return render(
    <SimulatorAuthContextProvider value={auth(null)}>
      <SimulatorSettingsProvider initialSettings={initialSettings}>
        <BackgroundMusicProvider backendFactory={musicBackend}>
          <SoundMuteShortcut />
        </BackgroundMusicProvider>
      </SimulatorSettingsProvider>
    </SimulatorAuthContextProvider>,
  );
}

function musicStorage(): { volume: number; muted: boolean } {
  return JSON.parse(localStorage.getItem(MUSIC_STORAGE_KEY) ?? "{}");
}

describe("SoundMuteShortcut", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response("{}", { status: 200 }))),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  test("mutes SFX volume and background music, then restores the previous volume", () => {
    renderShortcut(40);
    const button = screen.getByRole("button", { name: "Mute sounds" });
    expect(button.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(button);

    expect(screen.getByRole("button", { name: "Unmute sounds" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
    expect(localStorage.getItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY)).toBe("0");
    expect(musicStorage().muted).toBe(true);
    expect(localStorage.getItem(VOLUME_BEFORE_MUTE_KEY)).toBe("40");

    fireEvent.click(screen.getByRole("button", { name: "Unmute sounds" }));

    expect(screen.getByRole("button", { name: "Mute sounds" })).toBeTruthy();
    expect(localStorage.getItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY)).toBe("40");
    expect(musicStorage().muted).toBe(false);
    expect(localStorage.getItem(VOLUME_BEFORE_MUTE_KEY)).toBeNull();
  });

  test("without a stored volume, unmute restores the default volume", () => {
    renderShortcut(65);
    fireEvent.click(screen.getByRole("button", { name: "Mute sounds" }));
    expect(localStorage.getItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY)).toBe("0");

    // The restore key is gone (e.g. blocked storage or a parallel edit):
    // unmute still lands on the default volume instead of staying silent.
    localStorage.removeItem(VOLUME_BEFORE_MUTE_KEY);
    fireEvent.click(screen.getByRole("button", { name: "Unmute sounds" }));

    expect(localStorage.getItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY)).toBe("75");
    expect(musicStorage().muted).toBe(false);
  });

  test("reports muted while music plays muted even with SFX up, and unmute leaves SFX alone", () => {
    // The player muted music in the settings sheet; SFX is untouched.
    localStorage.setItem(
      MUSIC_STORAGE_KEY,
      JSON.stringify({ volume: 10, muted: true, trackId: "neon-cut-deal" }),
    );
    renderShortcut(50);

    // Audio is still playing (music), so the button must not read "Mute sounds"
    // while SFX is up.
    const button = screen.getByRole("button", { name: "Unmute sounds" });
    expect(button.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(button);

    // Music unmutes; the SFX volume the player chose is not clobbered (the
    // settings provider only persists on a volume change, so "storage still
    // empty" pins that no SFX write happened).
    expect(musicStorage().muted).toBe(false);
    expect(localStorage.getItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY)).toBeNull();
    expect(screen.getByRole("button", { name: "Mute sounds" })).toBeTruthy();
  });
});
