<script lang="ts">
  import { locales } from "$lib/paraglide/runtime.js";
  import { m } from "$lib/i18n/messages.js";
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import HotkeyDisplay from "@/features/simulator/hotkeys/HotkeyDisplay.svelte";
  import type {
    AnimationSpeed,
    CardInfoMode,
    CardPreviewMode,
    HotkeyMode,
    PrimaryClickAction,
  } from "@/features/settings/player-settings-store.svelte.js";
  import SimulatorSupportActions from "@/features/simulator/support/SimulatorSupportActions.svelte";
  import PlaymatPicker from "./PlaymatPicker.svelte";
  import CardSleevePicker from "./CardSleevePicker.svelte";

  type SupportedLocale = (typeof locales)[number];
  type SettingsTab = "gameplay" | "playmats" | "sleeves";

  interface PlayerSettingsDialogProps {
    open?: boolean;
    selectedLocale: SupportedLocale;
    showRawLogRegistryJson?: boolean;
    hotkeyMode?: HotkeyMode;
    cardPreviewMode?: CardPreviewMode;
    cardInfoMode?: CardInfoMode;
    primaryClickAction?: PrimaryClickAction;
    animationSpeed?: AnimationSpeed;
    soundVolume?: number;
    onOpenHotkeys?: () => void;
    onLocaleSelection: (nextLocale: SupportedLocale) => void;
    onToggleRawLogRegistryJson?: (enabled: boolean) => void;
    onHotkeyModeChange?: (mode: HotkeyMode) => void;
    onCardPreviewModeChange?: (mode: CardPreviewMode) => void;
    onCardInfoModeChange?: (mode: CardInfoMode) => void;
    onPrimaryClickActionChange?: (action: PrimaryClickAction) => void;
    onAnimationSpeedChange?: (speed: AnimationSpeed) => void;
    onSoundVolumeChange?: (volume: number) => void;
    accessibleMobileControls?: boolean;
    onToggleAccessibleMobileControls?: (enabled: boolean) => void;
    showZoneCounters?: boolean;
    onToggleShowZoneCounters?: (enabled: boolean) => void;
    selectedCardBack?: string;
    selectedPlaymat?: string;
    onCardBackChange?: (id: string) => void;
    onPlaymatChange?: (id: string) => void;
    onOpenFeedback?: () => void;
    onOpenBugReport?: () => void;
  }

  let {
    open = $bindable(false),
    selectedLocale,
    showRawLogRegistryJson = false,
    hotkeyMode = "confirm-only",
    cardPreviewMode = "delayed",
    cardInfoMode = "detailed",
    primaryClickAction = "challenge",
    animationSpeed = "off",
    soundVolume = 50,
    onOpenHotkeys,
    onLocaleSelection,
    onToggleRawLogRegistryJson,
    onHotkeyModeChange,
    onCardPreviewModeChange,
    onCardInfoModeChange,
    onPrimaryClickActionChange,
    onAnimationSpeedChange,
    onSoundVolumeChange,
    accessibleMobileControls = false,
    onToggleAccessibleMobileControls,
    showZoneCounters = false,
    onToggleShowZoneCounters,
    selectedCardBack = "default",
    selectedPlaymat = "default",
    onCardBackChange,
    onPlaymatChange,
    onOpenFeedback,
    onOpenBugReport,
  }: PlayerSettingsDialogProps = $props();

  let activeTab = $state<SettingsTab>("gameplay");

  function getLocaleLabel(locale: SupportedLocale): string {
    return {
      en: m["sim.locale.name.en"]({}),
      es: m["sim.locale.name.es"]({}),
      de: m["sim.locale.name.de"]({}),
      it: m["sim.locale.name.it"]({}),
      "pt-br": m["sim.locale.name.pt-br"]({}),
    }[locale];
  }

  function handleLocaleSelection(event: Event): void {
    const selectElement = event.currentTarget;
    if (!(selectElement instanceof HTMLSelectElement)) {
      return;
    }

    const nextLocale = selectElement.value as SupportedLocale;
    if (!locales.includes(nextLocale)) {
      return;
    }

    onLocaleSelection(nextLocale);
  }

  function handleRawLogRegistryToggle(event: Event): void {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    onToggleRawLogRegistryJson?.(input.checked);
  }

  function handleHotkeyModeSelection(event: Event): void {
    const selectElement = event.currentTarget;
    if (!(selectElement instanceof HTMLSelectElement)) {
      return;
    }

    const nextMode = selectElement.value as HotkeyMode;
    if (nextMode === "off" || nextMode === "confirm-only" || nextMode === "on") {
      onHotkeyModeChange?.(nextMode);
    }
  }

  function handleCardPreviewModeSelection(event: Event): void {
    const selectElement = event.currentTarget;
    if (!(selectElement instanceof HTMLSelectElement)) {
      return;
    }

    const nextMode = selectElement.value as CardPreviewMode;
    if (nextMode === "disabled" || nextMode === "immediate" || nextMode === "delayed") {
      onCardPreviewModeChange?.(nextMode);
    }
  }

  function handleCardInfoModeSelection(event: Event): void {
    const selectElement = event.currentTarget;
    if (!(selectElement instanceof HTMLSelectElement)) {
      return;
    }

    const nextMode = selectElement.value as CardInfoMode;
    if (nextMode === "detailed" || nextMode === "quick") {
      onCardInfoModeChange?.(nextMode);
    }
  }

  function handlePrimaryClickActionSelection(event: Event): void {
    const select = event.currentTarget;
    if (!(select instanceof HTMLSelectElement)) return;
    const next = select.value as PrimaryClickAction;
    if (next === "challenge" || next === "quest" || next === "none") {
      onPrimaryClickActionChange?.(next);
    }
  }

  function handleAnimationSpeedSelection(event: Event): void {
    const select = event.currentTarget;
    if (!(select instanceof HTMLSelectElement)) return;
    const next = select.value as AnimationSpeed;
    if (next === "off" || next === "fast" || next === "normal" || next === "slow") {
      onAnimationSpeedChange?.(next);
    }
  }

  function handleSoundVolumeChange(event: Event): void {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement)) return;
    onSoundVolumeChange?.(Number(input.value));
  }

  function handleAccessibleMobileControlsToggle(event: Event): void {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    onToggleAccessibleMobileControls?.(input.checked);
  }

  function handleShowZoneCountersToggle(event: Event): void {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    onToggleShowZoneCounters?.(input.checked);
  }

  function handleOpenHotkeysClick(): void {
    onOpenHotkeys?.();
  }

</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="player-settings-overlay" />
    <Dialog.Content class="player-settings-dialog" showCloseButton={false}>
      <Dialog.Header class="shrink-0 gap-1">
        <Dialog.Title class="text-base font-semibold tracking-tight text-slate-100">
          {m["sim.settings.title"]({})}
        </Dialog.Title>
        <Dialog.Description class="text-sm text-slate-400">
          {m["sim.settings.description"]({})}
        </Dialog.Description>
      </Dialog.Header>

      <div class="player-settings-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          class="player-settings-tab"
          aria-selected={activeTab === "gameplay"}
          onclick={() => (activeTab = "gameplay")}
        >
          {m["sim.settings.tab.gameplay"]({})}
        </button>
        <button
          type="button"
          role="tab"
          class="player-settings-tab"
          aria-selected={activeTab === "playmats"}
          onclick={() => (activeTab = "playmats")}
        >
          {m["sim.settings.tab.playmats"]({})}
        </button>
        <button
          type="button"
          role="tab"
          class="player-settings-tab"
          aria-selected={activeTab === "sleeves"}
          onclick={() => (activeTab = "sleeves")}
        >
          {m["sim.settings.tab.sleeves"]({})}
        </button>
      </div>

      <div class="player-settings-scroll">
      {#if activeTab === "gameplay"}
      <div class="grid gap-4">
        <div class="grid gap-1.5">
          <label class="text-xs font-medium uppercase tracking-widest text-slate-400" for="player-language-select">
            {m["sim.settings.languageLabel"]({})}
          </label>
          <select
            id="player-language-select"
            class="player-settings-select"
            bind:value={selectedLocale}
            onchange={handleLocaleSelection}
          >
            {#each locales as locale}
              <option value={locale}>{getLocaleLabel(locale as SupportedLocale)}</option>
            {/each}
          </select>
        </div>

        <div class="grid gap-1.5">
          <label class="text-xs font-medium uppercase tracking-widest text-slate-400" for="player-hotkey-mode-select">
            {m["sim.settings.hotkeyModeLabel"]({})}
          </label>
          <select
            id="player-hotkey-mode-select"
            class="player-settings-select"
            value={hotkeyMode}
            onchange={handleHotkeyModeSelection}
          >
            <option value="off">{m["sim.settings.hotkeyMode.off"]({})}</option>
            <option value="confirm-only">{m["sim.settings.hotkeyMode.confirmOnly"]({})}</option>
            <option value="on">{m["sim.settings.hotkeyMode.on"]({})}</option>
          </select>
          <p class="player-settings-help">{m["sim.settings.hotkeyModeDescription"]({})}</p>
        </div>

        <div class="grid gap-1.5">
          <label class="text-xs font-medium uppercase tracking-widest text-slate-400" for="player-card-preview-mode-select">
            {m["sim.settings.cardPreviewModeLabel"]({})}
          </label>
          <select
            id="player-card-preview-mode-select"
            class="player-settings-select"
            value={cardPreviewMode}
            onchange={handleCardPreviewModeSelection}
          >
            <option value="disabled">{m["sim.settings.cardPreviewMode.disabled"]({})}</option>
            <option value="immediate">{m["sim.settings.cardPreviewMode.immediate"]({})}</option>
            <option value="delayed">{m["sim.settings.cardPreviewMode.delayed"]({})}</option>
          </select>
          <p class="player-settings-help">{m["sim.settings.cardPreviewModeDescription"]({})}</p>
        </div>

        <div class="grid gap-1.5">
          <label class="text-xs font-medium uppercase tracking-widest text-slate-400" for="player-card-info-mode-select">
            {m["sim.settings.cardInfoModeLabel"]({})}
          </label>
          <select
            id="player-card-info-mode-select"
            class="player-settings-select"
            value={cardInfoMode}
            onchange={handleCardInfoModeSelection}
          >
            <option value="detailed">{m["sim.settings.cardInfoMode.detailed"]({})}</option>
            <option value="quick">{m["sim.settings.cardInfoMode.quick"]({})}</option>
          </select>
          <p class="player-settings-help">{m["sim.settings.cardInfoModeDescription"]({})}</p>
        </div>

        <div class="grid gap-1.5">
          <label class="text-xs font-medium uppercase tracking-widest text-slate-400" for="player-primary-click-action-select">
            {m["sim.settings.primaryClickActionLabel"]({})}
          </label>
          <select
            id="player-primary-click-action-select"
            class="player-settings-select"
            value={primaryClickAction}
            onchange={handlePrimaryClickActionSelection}
          >
            <option value="challenge">{m["sim.settings.primaryClickAction.challenge"]({})}</option>
            <option value="quest">{m["sim.settings.primaryClickAction.quest"]({})}</option>
            <option value="none">{m["sim.settings.primaryClickAction.none"]({})}</option>
          </select>
          <p class="player-settings-help">{m["sim.settings.primaryClickActionDescription"]({})}</p>
        </div>

        <div class="grid gap-1.5">
          <label class="text-xs font-medium uppercase tracking-widest text-slate-400" for="player-animation-speed-select">
            {m["sim.settings.animationSpeedLabel"]({})}
          </label>
          <select
            id="player-animation-speed-select"
            class="player-settings-select"
            value={animationSpeed}
            onchange={handleAnimationSpeedSelection}
          >
            <option value="off">{m["sim.settings.animationSpeed.off"]({})}</option>
            <option value="fast">{m["sim.settings.animationSpeed.fast"]({})}</option>
            <option value="normal">{m["sim.settings.animationSpeed.normal"]({})}</option>
            <option value="slow">{m["sim.settings.animationSpeed.slow"]({})}</option>
          </select>
          <p class="player-settings-help">{m["sim.settings.animationSpeedDescription"]({})}</p>
        </div>

        <div class="grid gap-1.5">
          <label class="text-xs font-medium uppercase tracking-widest text-slate-400" for="player-sound-volume-slider">
            {m["sim.settings.soundVolumeLabel"]({})}
          </label>
          <div class="sound-volume-row">
            <input
              id="player-sound-volume-slider"
              type="range"
              min="0"
              max="100"
              step="1"
              value={soundVolume}
              oninput={handleSoundVolumeChange}
              class="sound-volume-slider"
            />
            <span class="sound-volume-value">{soundVolume}%</span>
          </div>
          <p class="player-settings-help">{m["sim.settings.soundVolumeDescription"]({})}</p>
        </div>

        <div class="grid gap-1.5">
          <label
            class="player-settings-checkbox-row"
            for="player-accessible-mobile-controls-toggle"
          >
            <input
              id="player-accessible-mobile-controls-toggle"
              type="checkbox"
              checked={accessibleMobileControls}
              onchange={handleAccessibleMobileControlsToggle}
            />
            <span>{m["sim.settings.accessibleMobileControlsLabel"]({})}</span>
          </label>
          <p class="player-settings-help">{m["sim.settings.accessibleMobileControlsDescription"]({})}</p>
        </div>

        <div class="grid gap-1.5">
          <label
            class="player-settings-checkbox-row"
            for="player-show-zone-counters-toggle"
          >
            <input
              id="player-show-zone-counters-toggle"
              type="checkbox"
              checked={showZoneCounters}
              onchange={handleShowZoneCountersToggle}
            />
            <span>{m["sim.settings.showZoneCountersLabel"]({})}</span>
          </label>
          <p class="player-settings-help">{m["sim.settings.showZoneCountersDescription"]({})}</p>
        </div>

        {#if import.meta.env.DEV}
          <div class="grid gap-1.5">
            <label class="player-settings-checkbox-row" for="player-raw-log-registry-toggle">
              <input
                id="player-raw-log-registry-toggle"
                type="checkbox"
                checked={showRawLogRegistryJson}
                onchange={handleRawLogRegistryToggle}
              />
              <span>{m["sim.settings.logRegistryRawLabel"]({})}</span>
            </label>
            <p class="player-settings-help">{m["sim.settings.logRegistryRawDescription"]({})}</p>
          </div>
        {/if}

        <div class="grid gap-1.5">
          <div class="player-settings-support-copy">
            <p class="player-settings-support-title">{m["sim.hotkeys.title"]({})}</p>
            <p class="player-settings-help">{m["sim.hotkeys.description"]({})}</p>
          </div>
          <button
            type="button"
            class="player-settings-hotkeys-button"
            onclick={handleOpenHotkeysClick}
          >
            <span>{m["sim.hotkeys.open"]({})}</span>
            <HotkeyDisplay hotkey="Mod+K" />
          </button>
        </div>

        <div class="grid gap-1.5">
          <div class="player-settings-support-copy">
            <p class="player-settings-support-title">{m["sim.support.title"]({})}</p>
            <p class="player-settings-help">{m["sim.support.description"]({})}</p>
          </div>
          <SimulatorSupportActions
            onOpenBugReport={onOpenBugReport}
            onOpenFeedback={onOpenFeedback}
          />
        </div>
      </div>
      {:else if activeTab === "playmats"}
        <PlaymatPicker
          {selectedPlaymat}
          onSelect={(id) => onPlaymatChange?.(id)}
        />
      {:else if activeTab === "sleeves"}
        <CardSleevePicker
          {selectedCardBack}
          onSelect={(id) => onCardBackChange?.(id)}
        />
      {/if}
      </div>

      <Dialog.Footer class="shrink-0">
        <Dialog.Close class="player-settings-close" aria-label={m["sim.settings.closeAria"]({})}>
          {m["sim.settings.close"]({})}
        </Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.player-settings-overlay) {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(2, 8, 18, 0.7);
    backdrop-filter: blur(3px);
  }

  :global(.player-settings-dialog) {
    display: flex !important;
    flex-direction: column;
    gap: 1rem;
    max-width: min(92vw, 560px) !important;
    max-height: min(92dvh, calc(100vh - 1.5rem));
    overflow: hidden;
    border-radius: 0.95rem;
    border: 1px solid rgba(108, 145, 192, 0.35) !important;
    background: rgba(9, 16, 28, 0.96) !important;
    box-shadow: 0 18px 48px rgba(2, 8, 18, 0.5);
    padding: 1.25rem;
    color: #e5edf7 !important;
  }

  :global(.player-settings-dialog .player-settings-scroll) {
    min-height: 0;
    flex: 1 1 0%;
    overflow-x: hidden;
    /* scroll: keep vertical scrollbar lane visible (where the engine supports it) */
    overflow-y: scroll;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
    padding-inline-end: 0.25rem;
    scrollbar-width: auto;
    scrollbar-color: rgba(147, 197, 253, 0.85) rgba(30, 41, 59, 0.95);
  }

  :global(.player-settings-dialog .player-settings-scroll)::-webkit-scrollbar {
    width: 14px;
  }

  :global(.player-settings-dialog .player-settings-scroll)::-webkit-scrollbar-track {
    border-radius: 0.5rem;
    background: rgba(30, 41, 59, 0.95);
    border: 1px solid rgba(108, 145, 192, 0.45);
  }

  :global(.player-settings-dialog .player-settings-scroll)::-webkit-scrollbar-thumb {
    border-radius: 0.45rem;
    background: rgba(125, 211, 252, 0.65);
    border: 3px solid rgba(30, 41, 59, 0.95);
    background-clip: padding-box;
  }

  :global(.player-settings-dialog .player-settings-scroll)::-webkit-scrollbar-thumb:hover {
    background: rgba(147, 197, 253, 0.85);
    border: 3px solid rgba(30, 41, 59, 0.95);
    background-clip: padding-box;
  }

  :global(.player-settings-select) {
    width: 100%;
    border-radius: 0.55rem;
    border: 1px solid rgba(108, 145, 192, 0.42);
    background: rgba(14, 25, 40, 0.92);
    color: #e5edf7;
    padding: 0.5rem 0.6rem;
    font-size: 0.92rem;
  }

  :global(.player-settings-select:focus-visible) {
    outline: 2px solid rgba(147, 197, 253, 0.5);
    outline-offset: 1px;
    border-color: rgba(147, 197, 253, 0.75);
  }

  :global(.player-settings-close) {
    border-radius: 0.5rem;
    border: 1px solid rgba(125, 211, 252, 0.5);
    background: rgba(21, 48, 77, 0.8);
    color: #dbeafe;
    padding: 0.4rem 0.8rem;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  :global(.player-settings-close:hover),
  :global(.player-settings-close:focus-visible) {
    background: rgba(34, 74, 117, 0.95);
    border-color: rgba(191, 219, 254, 0.82);
    outline: none;
  }

  :global(.player-settings-checkbox-row) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: #e5edf7;
  }

  :global(.player-settings-checkbox-row input) {
    margin: 0;
  }

  :global(.player-settings-help) {
    margin: 0;
    color: #9fb2c9;
    font-size: 0.75rem;
    line-height: 1.35;
  }

  .sound-volume-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .player-settings-hotkeys-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    width: 100%;
    border-radius: 0.7rem;
    border: 1px solid rgba(108, 145, 192, 0.35);
    background: rgba(14, 25, 40, 0.92);
    color: #e5edf7;
    padding: 0.7rem 0.8rem;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .player-settings-hotkeys-button:hover,
  .player-settings-hotkeys-button:focus-visible {
    background: rgba(18, 33, 53, 0.98);
    border-color: rgba(147, 197, 253, 0.62);
    outline: none;
  }

  .player-settings-support-copy {
    display: grid;
    gap: 0.18rem;
  }

  .player-settings-support-title {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #94a3b8;
  }

  .sound-volume-slider {
    flex: 1;
    accent-color: rgba(125, 211, 252, 0.8);
  }

  .sound-volume-value {
    min-width: 3ch;
    text-align: right;
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
    color: #e5edf7;
  }

  .player-settings-tabs {
    display: flex;
    gap: 0.25rem;
    border-bottom: 1px solid rgba(108, 145, 192, 0.25);
    padding-bottom: 0.5rem;
    flex-shrink: 0;
  }

  .player-settings-tab {
    flex: 1;
    padding: 0.4rem 0.5rem;
    border-radius: 0.4rem 0.4rem 0 0;
    border: none;
    background: transparent;
    color: #9fb2c9;
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease;
  }

  .player-settings-tab:hover {
    color: #e5edf7;
    background: rgba(14, 25, 40, 0.6);
  }

  .player-settings-tab[aria-selected="true"] {
    color: #e5edf7;
    background: rgba(21, 48, 77, 0.6);
    border-bottom: 2px solid rgba(125, 211, 252, 0.7);
  }
</style>
