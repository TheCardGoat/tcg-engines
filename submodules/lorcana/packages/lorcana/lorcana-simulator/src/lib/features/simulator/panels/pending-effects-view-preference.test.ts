import { describe, expect, it } from "bun:test";

import {
  DEFAULT_PENDING_EFFECTS_VIEW_MODE,
  PENDING_EFFECTS_VIEW_MODE_STORAGE_KEY,
  persistPendingEffectsViewModePreference,
  readPendingEffectsViewModePreference,
} from "@/features/simulator/panels/pending-effects-view-preference.js";

class MemoryStorage implements Storage {
  #entries = new Map<string, string>();

  get length(): number {
    return this.#entries.size;
  }

  clear(): void {
    this.#entries.clear();
  }

  getItem(key: string): string | null {
    return this.#entries.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.#entries.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.#entries.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#entries.set(key, value);
  }
}

describe("pending effects view preference", () => {
  it("defaults to full view when storage is unavailable", () => {
    expect(readPendingEffectsViewModePreference(undefined)).toBe(DEFAULT_PENDING_EFFECTS_VIEW_MODE);
  });

  it("defaults to full view when the stored value is invalid", () => {
    const storage = new MemoryStorage();
    storage.setItem(PENDING_EFFECTS_VIEW_MODE_STORAGE_KEY, "expanded");

    expect(readPendingEffectsViewModePreference(storage)).toBe(DEFAULT_PENDING_EFFECTS_VIEW_MODE);
  });

  it("hydrates a persisted full-view preference", () => {
    const storage = new MemoryStorage();
    storage.setItem(PENDING_EFFECTS_VIEW_MODE_STORAGE_KEY, "normal");

    expect(readPendingEffectsViewModePreference(storage)).toBe("normal");
  });

  it("persists the selected view mode", () => {
    const storage = new MemoryStorage();

    persistPendingEffectsViewModePreference(storage, "normal");

    expect(storage.getItem(PENDING_EFFECTS_VIEW_MODE_STORAGE_KEY)).toBe("normal");
  });
});
