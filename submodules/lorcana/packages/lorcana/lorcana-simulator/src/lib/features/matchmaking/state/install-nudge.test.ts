import { describe, expect, it } from "bun:test";

import {
  INSTALL_NUDGE_DISMISSED_AT_KEY,
  INSTALL_NUDGE_HIDE_DURATION_MS,
  MatchmakingInstallNudgeState,
  type BeforeInstallPromptChoiceResult,
  type BeforeInstallPromptEvent,
  hasInstallNudgeCooldown,
  readInstallNudgeDismissedAt,
  resolveInstallNudgeVariant,
} from "./install-nudge.svelte.js";
import type { ImmersiveCapabilities } from "@/features/immersive/immersive-capabilities.js";

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

function createCapabilities(overrides?: Partial<ImmersiveCapabilities>): ImmersiveCapabilities {
  return {
    fullscreenSupported: false,
    standardFullscreenSupported: false,
    safariFullscreenSupported: false,
    isIos: false,
    isIosSafari: false,
    isStandalone: false,
    orientationLockSupported: false,
    orientationPolicy: "portrait-only",
    ...overrides,
  };
}

function createDeferredPromptEvent(
  outcome: BeforeInstallPromptChoiceResult["outcome"],
): BeforeInstallPromptEvent {
  return {
    prompt: async () => {},
    preventDefault: () => {},
    userChoice: Promise.resolve({
      outcome,
      platform: "web",
    }),
  } as BeforeInstallPromptEvent;
}

describe("matchmaking install nudge", () => {
  it("returns null when no dismissal timestamp exists", () => {
    expect(readInstallNudgeDismissedAt(new MemoryStorage())).toBeNull();
  });

  it("clears malformed dismissal timestamps", () => {
    const storage = new MemoryStorage();
    storage.setItem(INSTALL_NUDGE_DISMISSED_AT_KEY, "yesterday");

    expect(readInstallNudgeDismissedAt(storage)).toBeNull();
    expect(storage.getItem(INSTALL_NUDGE_DISMISSED_AT_KEY)).toBeNull();
  });

  it("keeps the nudge hidden while the cooldown is active", () => {
    const storage = new MemoryStorage();
    const now = 1_000_000;
    storage.setItem(INSTALL_NUDGE_DISMISSED_AT_KEY, String(now - 60_000));

    expect(hasInstallNudgeCooldown(storage, now)).toBe(true);
  });

  it("allows the nudge to return after one week", () => {
    const storage = new MemoryStorage();
    const now = 2_000_000;
    storage.setItem(
      INSTALL_NUDGE_DISMISSED_AT_KEY,
      String(now - INSTALL_NUDGE_HIDE_DURATION_MS - 1),
    );

    expect(hasInstallNudgeCooldown(storage, now)).toBe(false);
  });

  it("resolves to hidden when the app is already installed", () => {
    expect(
      resolveInstallNudgeVariant(
        createCapabilities({ isStandalone: true }),
        true,
        new MemoryStorage(),
      ),
    ).toBe("hidden");
  });

  it("resolves to native when a deferred prompt is available", () => {
    expect(resolveInstallNudgeVariant(createCapabilities(), true, new MemoryStorage())).toBe(
      "native",
    );
  });

  it("resolves to iOS Safari helper when not installed", () => {
    expect(
      resolveInstallNudgeVariant(
        createCapabilities({ isIosSafari: true }),
        false,
        new MemoryStorage(),
      ),
    ).toBe("ios-safari");
  });

  it("shows nothing on unsupported browsers without a deferred prompt", () => {
    const state = new MatchmakingInstallNudgeState({
      storage: new MemoryStorage(),
      readCapabilities: () => createCapabilities(),
    });

    state.hydrate();

    expect(state.shouldShow).toBe(false);
    expect(state.variant).toBe("hidden");
  });

  it("shows the native prompt once captured", () => {
    const state = new MatchmakingInstallNudgeState({
      storage: new MemoryStorage(),
      readCapabilities: () => createCapabilities(),
    });

    state.capturePrompt(createDeferredPromptEvent("accepted"));

    expect(state.shouldShow).toBe(true);
    expect(state.canPromptInstall).toBe(true);
    expect(state.variant).toBe("native");
  });

  it("persists a weekly dismissal when the native prompt is rejected", async () => {
    const storage = new MemoryStorage();
    const now = 3_000_000;
    const state = new MatchmakingInstallNudgeState({
      storage,
      readCapabilities: () => createCapabilities(),
    });

    state.capturePrompt(createDeferredPromptEvent("dismissed"));
    await state.promptInstall(now);

    expect(storage.getItem(INSTALL_NUDGE_DISMISSED_AT_KEY)).toBe(String(now));
    expect(state.shouldShow).toBe(false);
  });

  it("hides without storing a cooldown when the native prompt is accepted", async () => {
    const storage = new MemoryStorage();
    const state = new MatchmakingInstallNudgeState({
      storage,
      readCapabilities: () => createCapabilities(),
    });

    state.capturePrompt(createDeferredPromptEvent("accepted"));
    await state.promptInstall(4_000_000);

    expect(storage.getItem(INSTALL_NUDGE_DISMISSED_AT_KEY)).toBeNull();
    expect(state.shouldShow).toBe(false);
  });

  it("writes the cooldown when the helper is dismissed", () => {
    const storage = new MemoryStorage();
    const now = 5_000_000;
    const state = new MatchmakingInstallNudgeState({
      storage,
      readCapabilities: () => createCapabilities({ isIosSafari: true }),
    });

    state.hydrate(now);
    state.dismissForAWeek(now);

    expect(storage.getItem(INSTALL_NUDGE_DISMISSED_AT_KEY)).toBe(String(now));
    expect(state.shouldShow).toBe(false);
  });

  it("hides when installation completes outside the prompt button", () => {
    const state = new MatchmakingInstallNudgeState({
      storage: new MemoryStorage(),
      readCapabilities: () => createCapabilities(),
    });

    state.capturePrompt(createDeferredPromptEvent("accepted"));
    state.handleAppInstalled();

    expect(state.shouldShow).toBe(false);
    expect(state.variant).toBe("hidden");
  });
});
