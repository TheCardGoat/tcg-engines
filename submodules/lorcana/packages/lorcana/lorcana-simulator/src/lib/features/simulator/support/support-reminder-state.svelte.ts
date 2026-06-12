export const SUPPORT_REMINDER_DISMISSED_AT_KEY = "lorcana.simulator.supportReminder.dismissedAt";
export const SUPPORT_REMINDER_LAST_SHOWN_AT_KEY = "lorcana.simulator.supportReminder.lastShownAt";
export const SUPPORT_REMINDER_LAST_VARIANT_KEY = "lorcana.simulator.supportReminder.lastVariant";
export const SUPPORT_REMINDER_HIDE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function readStoredNumber(
  key: string,
  storage: Storage | undefined = globalThis.localStorage,
): number | null {
  const rawValue = storage?.getItem(key);
  if (!rawValue) {
    return null;
  }

  const parsed = Number.parseInt(rawValue, 10);
  if (Number.isNaN(parsed)) {
    storage?.removeItem(key);
    return null;
  }

  return parsed;
}

export function readSupportReminderDismissedAt(
  storage: Storage | undefined = globalThis.localStorage,
): number | null {
  return readStoredNumber(SUPPORT_REMINDER_DISMISSED_AT_KEY, storage);
}

export function readSupportReminderLastShownAt(
  storage: Storage | undefined = globalThis.localStorage,
): number | null {
  return readStoredNumber(SUPPORT_REMINDER_LAST_SHOWN_AT_KEY, storage);
}

export function readSupportReminderLastVariantIndex(
  storage: Storage | undefined = globalThis.localStorage,
): number | null {
  return readStoredNumber(SUPPORT_REMINDER_LAST_VARIANT_KEY, storage);
}

export function hasSupportReminderCooldown(
  storage: Storage | undefined = globalThis.localStorage,
  now: number = Date.now(),
): boolean {
  const dismissedAt = readSupportReminderDismissedAt(storage);
  if (dismissedAt !== null && now - dismissedAt < SUPPORT_REMINDER_HIDE_DURATION_MS) {
    return true;
  }

  const lastShownAt = readSupportReminderLastShownAt(storage);
  if (lastShownAt !== null && now - lastShownAt < SUPPORT_REMINDER_HIDE_DURATION_MS) {
    return true;
  }

  return false;
}

export function pickSupportReminderVariantIndex(
  variantCount: number,
  lastVariantIndex: number | null,
  randomValue: number = Math.random(),
): number {
  if (variantCount <= 1) {
    return 0;
  }

  const normalizedRandom = Number.isFinite(randomValue)
    ? Math.min(Math.max(randomValue, 0), 0.999999)
    : 0;
  const nextIndex = Math.floor(normalizedRandom * variantCount);

  if (
    lastVariantIndex === null ||
    lastVariantIndex < 0 ||
    lastVariantIndex >= variantCount ||
    nextIndex !== lastVariantIndex
  ) {
    return nextIndex;
  }

  return (nextIndex + 1) % variantCount;
}

interface ResolveSupportReminderStateOptions {
  variantCount: number;
  storage?: Storage | undefined;
  random?: () => number;
  now?: number;
}

export function resolveSupportReminderState({
  variantCount,
  storage = globalThis.localStorage,
  random = Math.random,
  now = Date.now(),
}: ResolveSupportReminderStateOptions): {
  visible: boolean;
  variantIndex: number | null;
} {
  if (hasSupportReminderCooldown(storage, now)) {
    return {
      visible: false,
      variantIndex: null,
    };
  }

  const lastVariantIndex = readSupportReminderLastVariantIndex(storage);
  const nextVariantIndex = pickSupportReminderVariantIndex(
    variantCount,
    lastVariantIndex,
    random(),
  );

  storage?.setItem(SUPPORT_REMINDER_LAST_SHOWN_AT_KEY, String(now));
  storage?.setItem(SUPPORT_REMINDER_LAST_VARIANT_KEY, String(nextVariantIndex));

  return {
    visible: true,
    variantIndex: nextVariantIndex,
  };
}

export function dismissSupportReminderForAWeek(
  storage: Storage | undefined = globalThis.localStorage,
  now: number = Date.now(),
): void {
  storage?.setItem(SUPPORT_REMINDER_DISMISSED_AT_KEY, String(now));
}
