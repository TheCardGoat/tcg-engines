export type PendingEffectsViewMode = "compact" | "normal";

export const DEFAULT_PENDING_EFFECTS_VIEW_MODE: PendingEffectsViewMode = "normal";
export const PENDING_EFFECTS_VIEW_MODE_STORAGE_KEY = "lorcana.simulator.pendingEffectsViewMode";

interface StorageReader {
  getItem(key: string): string | null;
}

interface StorageWriter {
  setItem(key: string, value: string): void;
}

export function readPendingEffectsViewModePreference(
  storage: StorageReader | undefined,
): PendingEffectsViewMode {
  if (!storage) {
    return DEFAULT_PENDING_EFFECTS_VIEW_MODE;
  }

  try {
    const storedViewMode = storage.getItem(PENDING_EFFECTS_VIEW_MODE_STORAGE_KEY);
    return storedViewMode === "compact" || storedViewMode === "normal"
      ? storedViewMode
      : DEFAULT_PENDING_EFFECTS_VIEW_MODE;
  } catch {
    return DEFAULT_PENDING_EFFECTS_VIEW_MODE;
  }
}

export function persistPendingEffectsViewModePreference(
  storage: StorageWriter | undefined,
  viewMode: PendingEffectsViewMode,
): void {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(PENDING_EFFECTS_VIEW_MODE_STORAGE_KEY, viewMode);
  } catch {
    // Ignore storage failures so the panel remains usable in restricted browsers.
  }
}
