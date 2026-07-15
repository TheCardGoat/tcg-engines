import {
  detectImmersiveCapabilities,
  type ImmersiveCapabilities,
} from "./immersive-capabilities.js";
import { isFullscreenActive, requestFullscreenSafe } from "./immersive-actions.js";
import {
  persistImmersiveSessionStarted,
  readImmersiveSessionStarted,
  setImmersiveDocumentChrome,
} from "./immersive-session.js";

export type ImmersiveMode = "standard" | "standalone" | "fullscreen";

export interface ImmersiveStartOutcome {
  started: boolean;
  enteredFullscreen: boolean;
  reason?: string;
}

type FullscreenDocumentEventMap = DocumentEventMap & {
  webkitfullscreenchange: Event;
};

export class ImmersiveExperienceState {
  capabilities = $state<ImmersiveCapabilities>(detectImmersiveCapabilities());
  isFullscreen = $state(false);
  hasStartedSession = $state(false);

  #fullscreenListener = () => {
    this.isFullscreen = isFullscreenActive();
    this.#syncDocumentChrome();
  };

  get isStandalone(): boolean {
    return this.capabilities.isStandalone;
  }

  get canRequestFullscreen(): boolean {
    return this.capabilities.fullscreenSupported && !this.capabilities.isIosSafari;
  }

  get immersiveMode(): ImmersiveMode {
    if (this.isFullscreen) {
      return "fullscreen";
    }

    if (this.isStandalone) {
      return "standalone";
    }

    return "standard";
  }

  hydrate(): void {
    this.capabilities = detectImmersiveCapabilities();
    this.isFullscreen = isFullscreenActive();
    this.hasStartedSession = readImmersiveSessionStarted();
    this.#syncDocumentChrome();
  }

  attach(): () => void {
    if (typeof document === "undefined") {
      return () => {};
    }

    this.hydrate();

    document.addEventListener("fullscreenchange", this.#fullscreenListener);
    document.addEventListener(
      "webkitfullscreenchange" as keyof FullscreenDocumentEventMap,
      this.#fullscreenListener as EventListener,
    );

    return () => {
      document.removeEventListener("fullscreenchange", this.#fullscreenListener);
      document.removeEventListener(
        "webkitfullscreenchange" as keyof FullscreenDocumentEventMap,
        this.#fullscreenListener as EventListener,
      );
    };
  }

  activateRouteChrome(): void {
    this.#syncDocumentChrome();
  }

  deactivateRouteChrome(): void {
    setImmersiveDocumentChrome(false);
  }

  async startExperience(target?: HTMLElement): Promise<ImmersiveStartOutcome> {
    this.hasStartedSession = true;
    persistImmersiveSessionStarted();
    this.capabilities = detectImmersiveCapabilities();

    if (this.isStandalone) {
      this.#syncDocumentChrome();
      return {
        started: true,
        enteredFullscreen: false,
      };
    }

    if (!this.canRequestFullscreen) {
      this.#syncDocumentChrome();
      return {
        started: true,
        enteredFullscreen: false,
      };
    }

    const result = await requestFullscreenSafe(target);
    this.isFullscreen = result.entered || isFullscreenActive();
    this.#syncDocumentChrome();

    return {
      started: true,
      enteredFullscreen: result.entered,
      reason: result.reason,
    };
  }

  startInBrowser(): ImmersiveStartOutcome {
    this.hasStartedSession = true;
    persistImmersiveSessionStarted();
    this.capabilities = detectImmersiveCapabilities();
    this.#syncDocumentChrome();

    return {
      started: true,
      enteredFullscreen: false,
    };
  }

  #syncDocumentChrome(): void {
    setImmersiveDocumentChrome(this.hasStartedSession || this.isStandalone || this.isFullscreen);
  }
}

export const immersiveExperience = new ImmersiveExperienceState();
