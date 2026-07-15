import {
  detectImmersiveCapabilities,
  type ImmersiveCapabilities,
} from "@/features/immersive/immersive-capabilities.js";

export const INSTALL_NUDGE_DISMISSED_AT_KEY = "lorcana.simulator.installNudge.dismissedAt";
export const INSTALL_NUDGE_HIDE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export type InstallNudgeVariant = "hidden" | "native" | "ios-safari";
export type InstallPromptOutcome = "accepted" | "dismissed";

export interface BeforeInstallPromptChoiceResult {
  outcome: InstallPromptOutcome;
  platform: string;
}

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<BeforeInstallPromptChoiceResult>;
}

interface MatchmakingInstallNudgeStateOptions {
  storage?: Storage | undefined;
  candidateWindow?: Window | undefined;
  readCapabilities?: () => ImmersiveCapabilities;
}

export function readInstallNudgeDismissedAt(
  storage: Storage | undefined = globalThis.localStorage,
): number | null {
  const dismissedAtRaw = storage?.getItem(INSTALL_NUDGE_DISMISSED_AT_KEY);

  if (!dismissedAtRaw) {
    return null;
  }

  const dismissedAt = Number.parseInt(dismissedAtRaw, 10);
  if (Number.isNaN(dismissedAt)) {
    storage?.removeItem(INSTALL_NUDGE_DISMISSED_AT_KEY);
    return null;
  }

  return dismissedAt;
}

export function hasInstallNudgeCooldown(
  storage: Storage | undefined = globalThis.localStorage,
  now: number = Date.now(),
): boolean {
  const dismissedAt = readInstallNudgeDismissedAt(storage);
  if (dismissedAt === null) {
    return false;
  }

  return now - dismissedAt < INSTALL_NUDGE_HIDE_DURATION_MS;
}

export function isBeforeInstallPromptEvent(event: Event): event is BeforeInstallPromptEvent {
  const candidate = event as Event & Partial<BeforeInstallPromptEvent>;
  return (
    typeof candidate.preventDefault === "function" &&
    typeof candidate.prompt === "function" &&
    typeof candidate.userChoice?.then === "function"
  );
}

export function resolveInstallNudgeVariant(
  capabilities: ImmersiveCapabilities,
  hasDeferredPrompt: boolean,
  storage: Storage | undefined = globalThis.localStorage,
  now: number = Date.now(),
): InstallNudgeVariant {
  if (capabilities.isStandalone || hasInstallNudgeCooldown(storage, now)) {
    return "hidden";
  }

  if (capabilities.isIosSafari) {
    return "ios-safari";
  }

  return hasDeferredPrompt ? "native" : "hidden";
}

export class MatchmakingInstallNudgeState {
  variant = $state<InstallNudgeVariant>("hidden");
  installing = $state(false);

  readonly #storage: Storage | undefined;
  readonly #candidateWindow: Window | undefined;
  readonly #readCapabilities: () => ImmersiveCapabilities;

  #deferredPrompt: BeforeInstallPromptEvent | null = null;

  #beforeInstallPromptListener = (event: Event) => {
    if (!isBeforeInstallPromptEvent(event)) {
      return;
    }

    event.preventDefault();
    this.capturePrompt(event);
  };

  #appInstalledListener = () => {
    this.handleAppInstalled();
  };

  constructor({
    storage = globalThis.localStorage,
    candidateWindow = globalThis.window,
    readCapabilities = () => detectImmersiveCapabilities(),
  }: MatchmakingInstallNudgeStateOptions = {}) {
    this.#storage = storage;
    this.#candidateWindow = candidateWindow;
    this.#readCapabilities = readCapabilities;
  }

  get shouldShow(): boolean {
    return this.variant !== "hidden";
  }

  get canPromptInstall(): boolean {
    return this.variant === "native" && this.#deferredPrompt !== null;
  }

  hydrate(now: number = Date.now()): void {
    this.#sync(now);
  }

  attach(): () => void {
    this.hydrate();

    if (!this.#candidateWindow) {
      return () => {};
    }

    this.#candidateWindow.addEventListener(
      "beforeinstallprompt",
      this.#beforeInstallPromptListener as EventListener,
    );
    this.#candidateWindow.addEventListener("appinstalled", this.#appInstalledListener);

    return () => {
      this.#candidateWindow?.removeEventListener(
        "beforeinstallprompt",
        this.#beforeInstallPromptListener as EventListener,
      );
      this.#candidateWindow?.removeEventListener("appinstalled", this.#appInstalledListener);
    };
  }

  capturePrompt(event: BeforeInstallPromptEvent): void {
    this.#deferredPrompt = event;
    this.#sync();
  }

  dismissForAWeek(now: number = Date.now()): void {
    this.#storage?.setItem(INSTALL_NUDGE_DISMISSED_AT_KEY, String(now));
    this.#sync(now);
  }

  async promptInstall(now: number = Date.now()): Promise<BeforeInstallPromptChoiceResult | null> {
    if (!this.#deferredPrompt) {
      return null;
    }

    this.installing = true;

    try {
      const promptEvent = this.#deferredPrompt;
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;

      this.#deferredPrompt = null;

      if (choice.outcome === "dismissed") {
        this.dismissForAWeek(now);
      } else {
        this.#sync(now);
      }

      return choice;
    } catch {
      this.#deferredPrompt = null;
      this.dismissForAWeek(now);
      return null;
    } finally {
      this.installing = false;
    }
  }

  handleAppInstalled(): void {
    this.#deferredPrompt = null;
    this.variant = "hidden";
  }

  #sync(now: number = Date.now()): void {
    this.variant = resolveInstallNudgeVariant(
      this.#readCapabilities(),
      this.#deferredPrompt !== null,
      this.#storage,
      now,
    );
  }
}
