import { getLocale, locales, setLocale } from "$lib/paraglide/runtime.js";

export type SupportedLocale = (typeof locales)[number];
export type CardPreviewMode = "disabled" | "immediate" | "delayed";
export type PrimaryClickAction = "challenge" | "quest" | "none";
export type AnimationSpeed = "off" | "fast" | "normal" | "slow";
export type HotkeyMode = "off" | "confirm-only" | "on";
export type CardInfoMode = "detailed" | "quick";

const PLAYER_LOCALE_STORAGE_KEY = "lorcana.simulator.playerLocale";
const HOTKEYS_ENABLED_STORAGE_KEY = "lorcana.simulator.hotkeysEnabled";
const CARD_PREVIEW_DELAY_STORAGE_KEY = "lorcana.simulator.cardPreviewDelay";
const PRIMARY_CLICK_ACTION_STORAGE_KEY = "lorcana.simulator.primaryClickAction";
const ANIMATION_SPEED_STORAGE_KEY = "lorcana.simulator.animationSpeed";
const SOUND_VOLUME_STORAGE_KEY = "lorcana.simulator.soundVolume";
const ACCESSIBLE_MOBILE_CONTROLS_STORAGE_KEY = "lorcana.simulator.accessibleMobileControls";
const SHOW_ZONE_COUNTERS_STORAGE_KEY = "lorcana.simulator.showZoneCounters";
const SELECTED_PLAYMAT_STORAGE_KEY = "lorcana.simulator.selectedPlaymat";
const SELECTED_CARD_BACK_STORAGE_KEY = "lorcana.simulator.selectedCardBack";
const CARD_INFO_MODE_STORAGE_KEY = "lorcana.simulator.cardInfoMode";

export const DEFAULT_PLAYER_SETTINGS = {
  hotkeyMode: "confirm-only" as HotkeyMode,
  cardPreviewMode: "immediate" as CardPreviewMode,
  primaryClickAction: "challenge" as PrimaryClickAction,
  animationSpeed: "off" as AnimationSpeed,
  soundVolume: 50,
  accessibleMobileControls: false,
  showZoneCounters: false,
  discordPresenceEnabled: true,
  selectedPlaymat: "default",
  selectedCardBack: "default",
  cardInfoMode: "detailed" as CardInfoMode,
} satisfies {
  hotkeyMode: HotkeyMode;
  cardPreviewMode: CardPreviewMode;
  primaryClickAction: PrimaryClickAction;
  animationSpeed: AnimationSpeed;
  soundVolume: number;
  accessibleMobileControls: boolean;
  showZoneCounters: boolean;
  discordPresenceEnabled: boolean;
  selectedPlaymat: string;
  selectedCardBack: string;
  cardInfoMode: CardInfoMode;
};

/** Shape of the gameplaySettings object returned by GET /v1/users/me/settings */
export interface ServerGameplaySettings {
  animationSpeed?: AnimationSpeed;
  hotkeyMode?: HotkeyMode;
  cardPreviewMode?: CardPreviewMode;
  primaryClickAction?: PrimaryClickAction;
  soundVolume?: number;
  accessibleMobileControls?: boolean;
  showZoneCounters?: boolean;
  discordPresenceEnabled?: boolean;
  selectedLocale?: string;
  cardInfoMode?: CardInfoMode;
}

export type SaveToServerFn = (settings: {
  gameplaySettings: Partial<ServerGameplaySettings>;
}) => void;

export type SaveVisualSettingsToServerFn = (settings: {
  visualSettings: { cardBack?: string; playmat?: string };
}) => void;

/**
 * Standalone, reactive player-settings store backed by localStorage.
 *
 * Usable both inside and outside a game context (matchmaking, lobby, etc.).
 * The in-game `LorcanaSidebarPresenter` can delegate to an instance of this
 * class and layer on game-specific side-effects (status messages, engine calls).
 *
 * When a `saveToServer` callback is provided, every setting change is also
 * persisted to the server (debounced). localStorage remains a write-through
 * cache for instant hydration.
 */
export class PlayerSettingsStore {
  selectedLocale = $state<SupportedLocale>(getLocale());
  skipActionConfirmation = $state(true);
  hotkeyMode = $state<HotkeyMode>(DEFAULT_PLAYER_SETTINGS.hotkeyMode);
  cardPreviewMode = $state<CardPreviewMode>(DEFAULT_PLAYER_SETTINGS.cardPreviewMode);
  primaryClickAction = $state<PrimaryClickAction>(DEFAULT_PLAYER_SETTINGS.primaryClickAction);
  animationSpeed = $state<AnimationSpeed>(DEFAULT_PLAYER_SETTINGS.animationSpeed);
  soundVolume = $state<number>(DEFAULT_PLAYER_SETTINGS.soundVolume);
  accessibleMobileControls = $state<boolean>(DEFAULT_PLAYER_SETTINGS.accessibleMobileControls);
  showZoneCounters = $state<boolean>(DEFAULT_PLAYER_SETTINGS.showZoneCounters);
  selectedPlaymat = $state(DEFAULT_PLAYER_SETTINGS.selectedPlaymat);
  selectedCardBack = $state(DEFAULT_PLAYER_SETTINGS.selectedCardBack);
  cardInfoMode = $state<CardInfoMode>(DEFAULT_PLAYER_SETTINGS.cardInfoMode);

  #saveToServer: SaveToServerFn | null = null;
  #saveVisualSettingsToServer: SaveVisualSettingsToServerFn | null = null;
  #debounceTimer: ReturnType<typeof setTimeout> | null = null;
  #pendingServerUpdate: Partial<ServerGameplaySettings> = {};

  /**
   * Provide an optional callback that PUTs gameplay settings to the server.
   * This is called in a debounced manner (500ms) after any setting change.
   */
  setSaveToServer(fn: SaveToServerFn): void {
    this.#saveToServer = fn;
  }

  setSaveVisualSettingsToServer(fn: SaveVisualSettingsToServerFn): void {
    this.#saveVisualSettingsToServer = fn;
  }

  /**
   * Hydrate from server-provided settings. Takes precedence over localStorage.
   * Call this with the `gameplaySettings` from GET /v1/users/me/settings.
   */
  initializeVisualSettingsFromServer(
    serverSettings: { cardBack?: string; playmat?: string } | undefined,
  ): void {
    if (!serverSettings) return;

    if (serverSettings.cardBack) {
      this.selectedCardBack = serverSettings.cardBack;
      localStorage.setItem(SELECTED_CARD_BACK_STORAGE_KEY, serverSettings.cardBack);
    }
    if (serverSettings.playmat) {
      this.selectedPlaymat = serverSettings.playmat;
      localStorage.setItem(SELECTED_PLAYMAT_STORAGE_KEY, serverSettings.playmat);
    }
  }

  initializeFromServer(serverSettings: ServerGameplaySettings | undefined): void {
    if (!serverSettings) return;

    if (serverSettings.animationSpeed) {
      this.animationSpeed = serverSettings.animationSpeed;
      localStorage.setItem(ANIMATION_SPEED_STORAGE_KEY, serverSettings.animationSpeed);
    }
    if (serverSettings.hotkeyMode) {
      this.hotkeyMode = serverSettings.hotkeyMode;
      localStorage.setItem(HOTKEYS_ENABLED_STORAGE_KEY, serverSettings.hotkeyMode);
    }
    if (serverSettings.cardPreviewMode) {
      this.cardPreviewMode = serverSettings.cardPreviewMode;
      localStorage.setItem(CARD_PREVIEW_DELAY_STORAGE_KEY, serverSettings.cardPreviewMode);
    }
    if (serverSettings.primaryClickAction) {
      this.primaryClickAction = serverSettings.primaryClickAction;
      localStorage.setItem(PRIMARY_CLICK_ACTION_STORAGE_KEY, serverSettings.primaryClickAction);
    }
    if (serverSettings.soundVolume !== undefined) {
      this.soundVolume = Math.max(0, Math.min(100, Math.round(serverSettings.soundVolume)));
      localStorage.setItem(SOUND_VOLUME_STORAGE_KEY, String(this.soundVolume));
    }
    if (serverSettings.accessibleMobileControls !== undefined) {
      this.accessibleMobileControls = serverSettings.accessibleMobileControls;
      localStorage.setItem(
        ACCESSIBLE_MOBILE_CONTROLS_STORAGE_KEY,
        serverSettings.accessibleMobileControls ? "true" : "false",
      );
    }
    if (serverSettings.showZoneCounters !== undefined) {
      this.showZoneCounters = serverSettings.showZoneCounters;
      localStorage.setItem(
        SHOW_ZONE_COUNTERS_STORAGE_KEY,
        serverSettings.showZoneCounters ? "true" : "false",
      );
    }
    if (serverSettings.cardInfoMode === "detailed" || serverSettings.cardInfoMode === "quick") {
      this.cardInfoMode = serverSettings.cardInfoMode;
      localStorage.setItem(CARD_INFO_MODE_STORAGE_KEY, serverSettings.cardInfoMode);
    }
    if (
      serverSettings.selectedLocale &&
      locales.includes(serverSettings.selectedLocale as SupportedLocale)
    ) {
      const nextLocale = serverSettings.selectedLocale as SupportedLocale;
      this.selectedLocale = nextLocale;
      localStorage.setItem(PLAYER_LOCALE_STORAGE_KEY, nextLocale);
      if (nextLocale !== getLocale()) {
        setLocale(nextLocale, { reload: false });
      }
    }
  }

  /** Hydrate every field from localStorage. Call once after construction. */
  initialize(): void {
    const storedHotkeysEnabled = localStorage.getItem(HOTKEYS_ENABLED_STORAGE_KEY);
    if (
      storedHotkeysEnabled === "off" ||
      storedHotkeysEnabled === "confirm-only" ||
      storedHotkeysEnabled === "on"
    ) {
      this.hotkeyMode = storedHotkeysEnabled;
    } else if (storedHotkeysEnabled === "true") {
      this.hotkeyMode = "on";
    } else if (storedHotkeysEnabled === "false") {
      this.hotkeyMode = "off";
    }

    const storedCardPreviewMode = localStorage.getItem(CARD_PREVIEW_DELAY_STORAGE_KEY);
    if (
      storedCardPreviewMode === "disabled" ||
      storedCardPreviewMode === "immediate" ||
      storedCardPreviewMode === "delayed"
    ) {
      this.cardPreviewMode = storedCardPreviewMode;
    }

    const storedPrimaryClickAction = localStorage.getItem(PRIMARY_CLICK_ACTION_STORAGE_KEY);
    if (
      storedPrimaryClickAction === "challenge" ||
      storedPrimaryClickAction === "quest" ||
      storedPrimaryClickAction === "none"
    ) {
      this.primaryClickAction = storedPrimaryClickAction;
    }

    const storedAnimationSpeed = localStorage.getItem(ANIMATION_SPEED_STORAGE_KEY);
    if (
      storedAnimationSpeed === "off" ||
      storedAnimationSpeed === "fast" ||
      storedAnimationSpeed === "normal" ||
      storedAnimationSpeed === "slow"
    ) {
      this.animationSpeed = storedAnimationSpeed;
    }

    const storedSoundVolume = localStorage.getItem(SOUND_VOLUME_STORAGE_KEY);
    if (storedSoundVolume !== null) {
      const parsed = Number(storedSoundVolume);
      if (!Number.isNaN(parsed)) {
        this.soundVolume = Math.max(0, Math.min(100, Math.round(parsed)));
      }
    }

    const storedAccessibleMobileControls = localStorage.getItem(
      ACCESSIBLE_MOBILE_CONTROLS_STORAGE_KEY,
    );
    if (storedAccessibleMobileControls === "true") {
      this.accessibleMobileControls = true;
    } else if (storedAccessibleMobileControls === "false") {
      this.accessibleMobileControls = false;
    }

    const storedShowZoneCounters = localStorage.getItem(SHOW_ZONE_COUNTERS_STORAGE_KEY);
    if (storedShowZoneCounters === "true") {
      this.showZoneCounters = true;
    } else if (storedShowZoneCounters === "false") {
      this.showZoneCounters = false;
    }

    const storedLocale = localStorage.getItem(PLAYER_LOCALE_STORAGE_KEY);
    if (storedLocale && locales.includes(storedLocale as SupportedLocale)) {
      const nextLocale = storedLocale as SupportedLocale;
      this.selectedLocale = nextLocale;
      if (nextLocale !== getLocale()) {
        setLocale(nextLocale, { reload: false });
      }
    } else {
      localStorage.setItem(PLAYER_LOCALE_STORAGE_KEY, this.selectedLocale);
    }

    const storedPlaymat = localStorage.getItem(SELECTED_PLAYMAT_STORAGE_KEY);
    if (storedPlaymat) {
      this.selectedPlaymat = storedPlaymat;
    }

    const storedCardBack = localStorage.getItem(SELECTED_CARD_BACK_STORAGE_KEY);
    if (storedCardBack) {
      this.selectedCardBack = storedCardBack;
    }

    const storedCardInfoMode = localStorage.getItem(CARD_INFO_MODE_STORAGE_KEY);
    if (storedCardInfoMode === "detailed" || storedCardInfoMode === "quick") {
      this.cardInfoMode = storedCardInfoMode;
    }
  }

  // ── Handlers ────────────────────────────────────────────────────────

  handleLocaleSelection = (nextLocale: SupportedLocale): void => {
    if (!locales.includes(nextLocale) || nextLocale === this.selectedLocale) {
      return;
    }
    this.selectedLocale = nextLocale;
    setLocale(nextLocale, { reload: false });
    localStorage.setItem(PLAYER_LOCALE_STORAGE_KEY, nextLocale);
    this.#scheduleSave({ selectedLocale: nextLocale });
  };

  handleHotkeyModeChange = (mode: HotkeyMode): void => {
    this.hotkeyMode = mode;
    localStorage.setItem(HOTKEYS_ENABLED_STORAGE_KEY, mode);
    this.#scheduleSave({ hotkeyMode: mode });
  };

  handleCardPreviewModeChange = (mode: CardPreviewMode): void => {
    this.cardPreviewMode = mode;
    localStorage.setItem(CARD_PREVIEW_DELAY_STORAGE_KEY, mode);
    this.#scheduleSave({ cardPreviewMode: mode });
  };

  handlePrimaryClickActionChange = (action: PrimaryClickAction): void => {
    this.primaryClickAction = action;
    localStorage.setItem(PRIMARY_CLICK_ACTION_STORAGE_KEY, action);
    this.#scheduleSave({ primaryClickAction: action });
  };

  handleAnimationSpeedChange = (speed: AnimationSpeed): void => {
    this.animationSpeed = speed;
    localStorage.setItem(ANIMATION_SPEED_STORAGE_KEY, speed);
    this.#scheduleSave({ animationSpeed: speed });
  };

  handleSoundVolumeChange = (volume: number): void => {
    if (!Number.isFinite(volume)) return;
    this.soundVolume = Math.max(0, Math.min(100, Math.round(volume)));
    localStorage.setItem(SOUND_VOLUME_STORAGE_KEY, String(this.soundVolume));
    this.#scheduleSave({ soundVolume: this.soundVolume });
  };

  handleAccessibleMobileControlsToggle = (enabled: boolean): void => {
    this.accessibleMobileControls = enabled;
    localStorage.setItem(ACCESSIBLE_MOBILE_CONTROLS_STORAGE_KEY, enabled ? "true" : "false");
    this.#scheduleSave({ accessibleMobileControls: enabled });
  };

  handleShowZoneCountersToggle = (enabled: boolean): void => {
    this.showZoneCounters = enabled;
    localStorage.setItem(SHOW_ZONE_COUNTERS_STORAGE_KEY, enabled ? "true" : "false");
    this.#scheduleSave({ showZoneCounters: enabled });
  };

  handlePlaymatChange = (id: string): void => {
    this.selectedPlaymat = id;
    localStorage.setItem(SELECTED_PLAYMAT_STORAGE_KEY, id);
    this.#saveVisualSettingsToServer?.({ visualSettings: { playmat: id } });
  };

  handleCardInfoModeChange = (mode: CardInfoMode): void => {
    this.cardInfoMode = mode;
    localStorage.setItem(CARD_INFO_MODE_STORAGE_KEY, mode);
    this.#scheduleSave({ cardInfoMode: mode });
  };

  handleCardBackChange = (id: string): void => {
    this.selectedCardBack = id;
    localStorage.setItem(SELECTED_CARD_BACK_STORAGE_KEY, id);
    this.#saveVisualSettingsToServer?.({ visualSettings: { cardBack: id } });
  };

  // ── Server sync (debounced) ─────────────────────────────────────────

  #scheduleSave(partial: Partial<ServerGameplaySettings>): void {
    if (!this.#saveToServer) return;

    Object.assign(this.#pendingServerUpdate, partial);

    if (this.#debounceTimer) clearTimeout(this.#debounceTimer);
    this.#debounceTimer = setTimeout(() => {
      const update = { ...this.#pendingServerUpdate };
      this.#pendingServerUpdate = {};
      this.#saveToServer?.({ gameplaySettings: update });
    }, 500);
  }
}
