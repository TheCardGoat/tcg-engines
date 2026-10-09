import { describe, expect, test } from "vite-plus/test";
import {
  LEGACY_CYBERPUNK_USER_CONFIG_STORAGE_KEY,
  SIMULATOR_ANIMATION_SPEED_STORAGE_KEY,
  SIMULATOR_CARD_INTERACTION_MODE_STORAGE_KEY,
  SIMULATOR_SOUND_PACK_STORAGE_KEY,
  SIMULATOR_SOUND_VOLUME_STORAGE_KEY,
  clampSoundVolume,
  normalizeSimulatorSettings,
  normalizeSoundPack,
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
    expect(normalizeSimulatorSettings(null)).toEqual({
      soundVolume: 75,
      soundPack: "original",
      cardInteractionMode: "detailed",
      animationSpeed: "normal",
    });
    expect(
      normalizeSimulatorSettings({
        soundVolume: 150,
        soundPack: "signal",
        cardInteractionMode: "quick",
        animationSpeed: "slow",
      }),
    ).toEqual({
      soundVolume: 100,
      soundPack: "signal",
      cardInteractionMode: "quick",
      animationSpeed: "slow",
    });
  });

  test("normalizes sound packs against the shipped pack list", () => {
    expect(normalizeSoundPack("kinetic")).toBe("kinetic");
    expect(normalizeSoundPack("not-a-pack")).toBe("original");
    expect(normalizeSoundPack(undefined, "tabletop")).toBe("tabletop");
  });

  test("reads and writes local simulator preferences", () => {
    const storage = new MemoryStorage();
    writeLocalSimulatorSettings(storage, {
      soundVolume: 24,
      soundPack: "signal",
      cardInteractionMode: "quick",
      animationSpeed: "slow",
    });

    expect(storage.getItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY)).toBe("24");
    expect(storage.getItem(SIMULATOR_SOUND_PACK_STORAGE_KEY)).toBe("signal");
    expect(storage.getItem(SIMULATOR_CARD_INTERACTION_MODE_STORAGE_KEY)).toBe("quick");
    expect(storage.getItem(SIMULATOR_ANIMATION_SPEED_STORAGE_KEY)).toBe("slow");
    expect(readLocalSimulatorSettings(storage)).toEqual({
      soundVolume: 24,
      soundPack: "signal",
      cardInteractionMode: "quick",
      animationSpeed: "slow",
    });
  });

  test("falls back to the default sound pack for unknown stored values", () => {
    const storage = new MemoryStorage();
    storage.setItem(SIMULATOR_SOUND_PACK_STORAGE_KEY, "loud");
    expect(readLocalSimulatorSettings(storage).soundPack).toBe("original");
  });

  test("migrates legacy Cyberpunk sound volume", () => {
    const storage = new MemoryStorage();
    storage.setItem(LEGACY_CYBERPUNK_USER_CONFIG_STORAGE_KEY, JSON.stringify({ soundVolume: 150 }));

    expect(readLocalSimulatorSettings(storage)).toEqual({
      soundVolume: 100,
      soundPack: "original",
      cardInteractionMode: "detailed",
      animationSpeed: "normal",
    });
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
