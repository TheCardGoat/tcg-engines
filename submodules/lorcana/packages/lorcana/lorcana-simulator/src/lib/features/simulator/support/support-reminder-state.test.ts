import { describe, expect, it } from "bun:test";

import {
  dismissSupportReminderForAWeek,
  hasSupportReminderCooldown,
  pickSupportReminderVariantIndex,
  readSupportReminderDismissedAt,
  readSupportReminderLastShownAt,
  readSupportReminderLastVariantIndex,
  resolveSupportReminderState,
  SUPPORT_REMINDER_DISMISSED_AT_KEY,
  SUPPORT_REMINDER_LAST_SHOWN_AT_KEY,
  SUPPORT_REMINDER_LAST_VARIANT_KEY,
} from "@/features/simulator/support/support-reminder-state.svelte.js";

function createStorageMock(): Storage {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    clear() {
      values.clear();
    },
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(values.keys())[index] ?? null;
    },
    removeItem(key: string) {
      values.delete(key);
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
  };
}

describe("support reminder state", () => {
  it("shows by default and persists shown metadata", () => {
    const storage = createStorageMock();
    const now = 123_456;
    const state = resolveSupportReminderState({
      storage,
      random: () => 0.4,
      variantCount: 12,
      now,
    });

    expect(state.visible).toBe(true);
    expect(state.variantIndex).toBe(4);
    expect(readSupportReminderLastShownAt(storage)).toBe(now);
    expect(readSupportReminderLastVariantIndex(storage)).toBe(4);
  });

  it("stays hidden during the weekly cooldown", () => {
    const storage = createStorageMock();
    const now = 1_000_000;
    storage.setItem(SUPPORT_REMINDER_DISMISSED_AT_KEY, String(now - 1_000));
    const state = resolveSupportReminderState({
      storage,
      random: () => 0.2,
      variantCount: 12,
      now,
    });

    expect(state.visible).toBe(false);
    expect(hasSupportReminderCooldown(storage, now)).toBe(true);
  });

  it("stays hidden for a week after it auto-opened", () => {
    const storage = createStorageMock();
    const now = 1_000_000;
    storage.setItem(SUPPORT_REMINDER_LAST_SHOWN_AT_KEY, String(now - 1_000));

    const state = resolveSupportReminderState({
      storage,
      random: () => 0.2,
      variantCount: 12,
      now,
    });

    expect(state.visible).toBe(false);
    expect(hasSupportReminderCooldown(storage, now)).toBe(true);
  });

  it("dismisses for a week", () => {
    const storage = createStorageMock();
    const now = 9_999;
    dismissSupportReminderForAWeek(storage, now + 5);

    expect(readSupportReminderDismissedAt(storage)).toBe(now + 5);
  });

  it("avoids repeating the same reminder variant when multiple options exist", () => {
    expect(pickSupportReminderVariantIndex(12, 4, 0.4)).toBe(5);
  });

  it("clears invalid stored values", () => {
    const storage = createStorageMock();
    storage.setItem(SUPPORT_REMINDER_DISMISSED_AT_KEY, "yesterday");
    storage.setItem(SUPPORT_REMINDER_LAST_SHOWN_AT_KEY, "sometime");
    storage.setItem(SUPPORT_REMINDER_LAST_VARIANT_KEY, "later");

    expect(readSupportReminderDismissedAt(storage)).toBeNull();
    expect(readSupportReminderLastShownAt(storage)).toBeNull();
    expect(readSupportReminderLastVariantIndex(storage)).toBeNull();
    expect(storage.getItem(SUPPORT_REMINDER_DISMISSED_AT_KEY)).toBeNull();
    expect(storage.getItem(SUPPORT_REMINDER_LAST_SHOWN_AT_KEY)).toBeNull();
    expect(storage.getItem(SUPPORT_REMINDER_LAST_VARIANT_KEY)).toBeNull();
  });
});
