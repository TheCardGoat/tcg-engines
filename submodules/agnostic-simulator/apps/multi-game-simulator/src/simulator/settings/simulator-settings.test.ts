import { describe, expect, test } from "vite-plus/test";
import {
  LEGACY_CYBERPUNK_USER_CONFIG_STORAGE_KEY,
  SIMULATOR_SOUND_VOLUME_STORAGE_KEY,
  clampSoundVolume,
  normalizeSimulatorSettings,
  readLocalSimulatorSettings,
  writeLocalSimulatorSettings,
} from "./simulator-settings";

describe("simulator settings", () => {
  test("clamps sound volume", () => {
    expect(clampSoundVolume(-1)).toBe(0);
    expect(clampSoundVolume(150)).toBe(100);
    expect(clampSoundVolume(42.6)).toBe(43);
    expect(clampSoundVolume("loud", 35)).toBe(35);
  });

  test("normalizes settings with defaults", () => {
    expect(normalizeSimulatorSettings(null)).toEqual({ soundVolume: 50 });
    expect(normalizeSimulatorSettings({ soundVolume: 150 })).toEqual({ soundVolume: 100 });
  });

  test("reads and writes local sound volume", () => {
    const storage = new MemoryStorage();
    writeLocalSimulatorSettings(storage, { soundVolume: 24 });

    expect(storage.getItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY)).toBe("24");
    expect(readLocalSimulatorSettings(storage)).toEqual({ soundVolume: 24 });
  });

  test("migrates legacy Cyberpunk sound volume", () => {
    const storage = new MemoryStorage();
    storage.setItem(LEGACY_CYBERPUNK_USER_CONFIG_STORAGE_KEY, JSON.stringify({ soundVolume: 150 }));

    expect(readLocalSimulatorSettings(storage)).toEqual({ soundVolume: 100 });
    expect(storage.getItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY)).toBe("100");
  });
});

class MemoryStorage implements Storage {
  readonly #values = new Map<string, string>();

  get length(): number {
    return this.#values.size;
  }

  clear(): void {
    this.#values.clear();
  }

  getItem(key: string): string | null {
    return this.#values.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.#values.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.#values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#values.set(key, value);
  }
}
