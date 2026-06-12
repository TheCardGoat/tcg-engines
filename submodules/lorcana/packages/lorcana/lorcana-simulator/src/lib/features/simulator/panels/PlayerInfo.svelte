<script lang="ts">
import type { ClockSnapshot } from "@tcg/lorcana-engine";
import type {
	LorcanaPlayerSide,
	LorcanaTableSeat,
} from "@/features/simulator/model/contracts.js";
import { m } from "$lib/i18n/messages.js";
import { useLorcanaBoardPresenter } from "@/features/simulator/context/game-context.svelte.js";
import LoreBadge from "@/design-system/simulator/display/LoreBadge.svelte";
import SimulatorSupportReminder from "@/features/simulator/support/SimulatorSupportReminder.svelte";
import { resolvePatronTierConfig } from "@/features/simulator/model/player-tier.js";
import {
	Settings,
	Bug,
	Flag,
	Trash2,
	Layers,
	Hand,
	PaintBucket,
	EyeOff,
	Smartphone,
	Star,
	Gem,
	Sparkles,
	ShieldCheck,
} from "@lucide/svelte";
import type { Snippet } from "svelte";
import PlayerTimer from "./PlayerTimer.svelte";

interface PlayerInfoProps {
	name: string;
	seat?: LorcanaTableSeat;
	side: LorcanaPlayerSide;
	lore: number;
	deckCount: number;
	handCount: number;
	discardCount: number;
	inkwellCount: number;
	availableInk?: number | null;
	isActive?: boolean;
	isOpponent?: boolean;
	hasOwnedView?: boolean;
	showSettings?: boolean;
	onSettingsClick?: () => void;
	showSupport?: boolean;
	onSupportClick?: () => void;
	showReport?: boolean;
	onReportClick?: () => void;
	supportReminderText?: string | null;
	supportReminderOpen?: boolean;
	onDismissSupportReminder?: () => void;
	/** Timer state for this player. Omit if untimed. */
	timer?: ClockSnapshot;
	/** Whether this player's clock is the local player's (enables low-time tick sound). */
	isOwnClock?: boolean;
	/** Whether the player is currently AFK (idle or tab hidden). */
	isAfk?: boolean;
	/** Whether the player joined on a mobile device. */
	isMobile?: boolean;
	/** Player's MMR at match start, when available. */
	mmr?: number;
	/** Player's subscription tier (e.g. "tier2", "tier3", "tier4"). */
	subscriptionTier?: string;
	children?: Snippet;
}

let {
	name,
	seat = "bottom",
	side,
	lore,
	deckCount,
	handCount,
	discardCount,
	inkwellCount,
	availableInk = null,
	isActive = false,
	isOpponent = false,
	hasOwnedView = true,
	showSettings = false,
	onSettingsClick,
	showSupport = false,
	onSupportClick,
	showReport = false,
	onReportClick,
	supportReminderText = null,
	supportReminderOpen = $bindable(false),
	onDismissSupportReminder,
	timer,
	isOwnClock = false,
	isAfk = false,
	isMobile = false,
	mmr,
	subscriptionTier,
	children,
}: PlayerInfoProps = $props();

const unknownInkLabel = $derived(m["sim.player.stats.inkUnknown"]({}));
const board = (() => {
	try {
		return useLorcanaBoardPresenter();
	} catch {
		return null;
	}
})();
const boardSummary = $derived(board?.getPlayerSummary(side) ?? null);
const inkwellCards = $derived(board?.getZoneCards(side, "inkwell") ?? []);
const displayLore = $derived(boardSummary?.lore ?? lore);
const displayDeckCount = $derived(boardSummary?.deckCount ?? deckCount);
const displayHandCount = $derived(boardSummary?.handCount ?? handCount);
const displayDiscardCount = $derived(
	boardSummary?.discardCount ?? discardCount,
);
const summaryInkwellCount = $derived(
	boardSummary?.inkwellCount ?? inkwellCount,
);
const summaryAvailableInk = $derived(
	boardSummary?.availableInk ?? availableInk,
);
const effectSourceCards = $derived.by(() => {
	const sourceIds = boardSummary?.effectSourceCardIds ?? [];
	const cardSnapshotsById = board?.cardSnapshotsById;
	return sourceIds
		.map((sourceId) => cardSnapshotsById?.[sourceId] ?? null)
		.filter((card): card is NonNullable<typeof card> => card !== null);
});
const playerActiveEffects = $derived(boardSummary?.activeEffects ?? []);
const playerEffectAriaLabel = $derived(
  playerActiveEffects.length > 0
    ? `Active player effects: ${playerActiveEffects.map((effect) => effect.label).join(", ")}`
    : "",
);
const hasFallbackEffectLabel = $derived(
  effectSourceCards.length === 0 && playerActiveEffects.length > 0,
);
const fallbackEffectLabel = $derived(playerActiveEffects[0]?.label ?? "");
const hiddenFallbackEffectCount = $derived(Math.max(0, playerActiveEffects.length - 1));
const visibleEffectSourceCards = $derived(effectSourceCards.slice(0, 3));
const hiddenEffectSourceCount = $derived(
	Math.max(0, effectSourceCards.length - visibleEffectSourceCards.length),
);
const hasRevealedInkwellCards = $derived(inkwellCards.length > 0);
const displayInkwellCount = $derived(
	Math.max(summaryInkwellCount, inkwellCards.length),
);
const displayTotalInk = $derived(
	hasRevealedInkwellCards ? inkwellCards.length : displayInkwellCount,
);
const displayAvailableInk = $derived.by<number | null>(() => {
	if (!hasRevealedInkwellCards) {
		return summaryAvailableInk;
	}

	return inkwellCards.reduce(
		(count, card) => count + (card.readyState === "exerted" ? 0 : 1),
		0,
	);
});
const inkSummary = $derived.by(() => {
	if (displayAvailableInk === null && displayInkwellCount > 0) {
		return `${unknownInkLabel}/${displayInkwellCount}`;
	}

	return `${displayAvailableInk ?? 0}/${displayTotalInk}`;
});
const sideColors = {
	playerOne: "#7cc4ff",
	playerTwo: "#ea0000",
};

const patronConfig = $derived(resolvePatronTierConfig(subscriptionTier));
const mmrDisplay = $derived(Number.isFinite(mmr) ? `#${Math.round(mmr!)}` : null);
const activityStatusLabel = $derived.by(() => {
	if (!isActive) return null;
	if (!hasOwnedView) return m["sim.priority.label.generic"]({});
	return isOpponent
		? m["sim.priority.label.opponent"]({})
		: m["sim.priority.label.yours"]({});
});

function getSideLabel(side: LorcanaPlayerSide): string {
	return side === "playerOne"
		? m["sim.player.side.playerOne"]({})
		: m["sim.player.side.playerTwo"]({});
}

function handleSettingsClick() {
	onSettingsClick?.();
}

function handleSupportClick() {
	onSupportClick?.();
}
</script>

<div
  class="player-info"
  class:player-info--active={isActive}
  class:player-info--opponent={isOpponent}
  data-testid={`player-panel-${seat}`}
  data-player-seat={seat}
  style:--side-color={sideColors[side]}
>
  <div class="player-header">
    <div class="lore-status">
      <LoreBadge value={displayLore} max={20} size="small" variant={isOpponent ? "losing" : "default"} />
      <span
              class="status-indicator"
              class:status-indicator--active={isActive && !isAfk}
              class:status-indicator--afk={isAfk}
              title={isAfk ? m["sim.player.afk.title"]({}) : isActive ? m["sim.player.active.title"]({}) : undefined}
              aria-hidden="true"
      ></span>
    </div>
    <div class="player-identity">
      <div class="player-details">
        {#if patronConfig}
          <span
                  class="player-patron-pill"
                  style:--patron-color={patronConfig.color}
                  style:--patron-glow={patronConfig.glow}
                  style:--patron-border={patronConfig.borderColor}
                  title={patronConfig.name()}
          >
            {#if patronConfig.icon === "sparkles"}
              <Sparkles size={8} />
            {:else if patronConfig.icon === "gem"}
              <Gem size={8} />
            {:else if patronConfig.icon === "shield"}
              <ShieldCheck size={8} />
            {:else}
              <Star size={8} />
            {/if}
          </span>
        {/if}
        <span class="player-name">{name}</span>
        {#if isMobile}
          <Smartphone size={10} class="shrink-0 opacity-60" />
        {/if}
        {#if mmrDisplay}
          <span class="player-mmr-pill">{mmrDisplay}</span>
        {/if}

        {#if activityStatusLabel}
          <span
            class="player-status-pill"
            class:player-status-pill--priority={isActive && !isAfk}
            role="status"
          >
            {activityStatusLabel}
          </span>
        {/if}

        {#if isAfk}
          <span class="player-afk-pill" role="status" aria-label={m["sim.player.afk.awayAria"]({})}>
            <EyeOff size={9} />
            {m["sim.player.afk.title"]({})}
          </span>
        {/if}
        {#if timer}
          <PlayerTimer snapshot={timer} {isOwnClock} />
        {/if}
      </div>
    </div>

  </div>

  <div class="player-stats">
    <div class="stat-group">
      <div class="stat-item" aria-label={m["sim.player.stats.deckAria"]({ count: displayDeckCount })}>
        <span class="stat-value">{displayDeckCount}</span>
        <span class="stat-icon"><Layers /></span>
      </div>
      <div class="stat-item" aria-label={m["sim.player.stats.handAria"]({ count: displayHandCount })}>
        <span class="stat-value">{displayHandCount}</span>
        <span class="stat-icon"><Hand /></span>
      </div>
      <div class="stat-item" aria-label={m["sim.player.stats.discardAria"]({ count: displayDiscardCount })}>
        <span class="stat-value">{displayDiscardCount}</span>
        <span class="stat-icon"><Trash2 /></span>
      </div>
      <div class="stat-item" aria-label={m["sim.player.stats.inkAria"]({ available: displayAvailableInk ?? unknownInkLabel, total: displayInkwellCount })}>
        <span class="stat-value">{inkSummary}</span>
        <span class="stat-icon"><PaintBucket /></span>
      </div>
    </div>
    {#if showSettings || showSupport || showReport}
      <div class="player-quick-actions">
        {#if showReport}
          <button
            type="button"
            class="settings-trigger settings-trigger--report"
            aria-label={m["sim.player.report.openAria"]({})}
            title={m["sim.player.report.openAria"]({})}
            onclick={onReportClick}
          >
            <Flag />
          </button>
        {/if}
        {#if showSupport}
          {#if supportReminderText}
            <SimulatorSupportReminder
              text={supportReminderText}
              bind:open={supportReminderOpen}
              side="left"
              align="start"
              onOpen={handleSupportClick}
              onDismiss={onDismissSupportReminder}
            >
              {#snippet child({ props })}
                <button
                  type="button"
                  class="settings-trigger"
                  aria-label={m["sim.player.support.openAria"]({})}
                  title={m["sim.player.support.openAria"]({})}
                  onclick={handleSupportClick}
                  {...props}
                >
                  <Bug />
                </button>
              {/snippet}
            </SimulatorSupportReminder>
          {:else}
            <button
              type="button"
              class="settings-trigger"
              aria-label={m["sim.player.support.openAria"]({})}
              title={m["sim.player.support.openAria"]({})}
              onclick={handleSupportClick}
            >
              <Bug />
            </button>
          {/if}
        {/if}
        {#if showSettings}
          <button
            type="button"
            class="settings-trigger"
            aria-label={m["sim.player.settings.openAria"]({})}
            title={m["sim.player.settings.openAria"]({})}
            onclick={handleSettingsClick}
          >
            <Settings/>
          </button>
        {/if}
      </div>
    {/if}
  </div>

  {#if children}
    {@render children()}
  {/if}
</div>

<style>
  .player-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    gap: 0.18rem;
    padding: 0.2rem 0.2rem;
    border-left: 2px solid transparent;
    transition: border-color 200ms ease;
  }

  .player-info--active {
    border-left-color: var(--side-color, #7cc4ff);
  }

  .player-info--opponent {
    opacity: 0.9;
  }

  .player-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.45rem;
  }

  .player-identity {
    display: flex;
    align-items: center;
    min-width: 0;
    flex: 1;
  }

  .player-details {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.22rem 0.38rem;
    min-width: 0;
  }

  .player-name {
    font-size: 0.8rem;
    font-weight: 700;
    color: #f8fafc;
    line-height: 1.1;
    letter-spacing: -0.005em;
  }

  .player-side {
    display: inline-flex;
    align-items: center;
    min-height: 1rem;
    padding: 0 0.32rem;
    border-radius: 999px;
    background: rgba(20, 40, 64, 0.72);
    border: 1px solid rgba(109, 149, 195, 0.18);
    font-size: clamp(0.58rem, 1.55vw, 0.64rem);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #9db1c8;
    line-height: 1;
    white-space: nowrap;
  }

  .player-mmr-pill {
    display: inline-flex;
    align-items: center;
    height: 1rem;
    padding: 0 0.32rem;
    border-radius: 999px;
    background: rgba(20, 40, 64, 0.72);
    border: 1px solid rgba(109, 149, 195, 0.22);
    font-size: clamp(0.56rem, 1.5vw, 0.62rem);
    font-weight: 600;
    color: rgba(148, 163, 184, 0.85);
    line-height: 1;
    white-space: nowrap;
    letter-spacing: 0.03em;
  }

  .player-status-pill {
    display: inline-flex;
    align-items: center;
    min-height: 1rem;
    padding: 0 0.34rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.3);
    background: rgba(20, 40, 64, 0.72);
    color: rgba(203, 213, 225, 0.92);
    font-size: clamp(0.56rem, 1.5vw, 0.62rem);
    font-weight: 800;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }

  .player-status-pill--priority {
    border-color: rgba(250, 204, 21, 0.58);
    background: linear-gradient(180deg, rgba(120, 53, 15, 0.68), rgba(69, 26, 3, 0.62));
    color: #fef3c7;
  }

  .player-patron-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid var(--patron-border);
    color: var(--patron-color);
    flex-shrink: 0;
    box-shadow:
      0 0 4px var(--patron-glow),
      0 0 8px var(--patron-glow),
      inset 0 0 4px rgba(255, 255, 255, 0.06);
    filter: drop-shadow(0 0 3px var(--patron-glow));
    transition: box-shadow 200ms ease, filter 200ms ease;
  }

  .player-patron-pill:hover {
    box-shadow:
      0 0 6px var(--patron-glow),
      0 0 14px var(--patron-glow),
      inset 0 0 4px rgba(255, 255, 255, 0.08);
    filter: drop-shadow(0 0 5px var(--patron-glow));
  }

  .player-patron-pill :global(svg) {
    flex-shrink: 0;
  }

  .player-afk-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.18rem;
    height: 1rem;
    padding: 0 0.3rem;
    border-radius: 999px;
    background: rgba(217, 119, 6, 0.18);
    border: 1px solid rgba(217, 119, 6, 0.35);
    font-size: clamp(0.58rem, 1.55vw, 0.64rem);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #fbbf24;
    line-height: 1;
    white-space: nowrap;
    animation: afk-pill-in 0.3s ease-out both;
  }

  .player-afk-pill :global(svg) {
    flex-shrink: 0;
  }

  @keyframes afk-pill-in {
    from {
      opacity: 0;
      transform: scale(0.85);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .player-stats {
    display: flex;
    align-items: center;
    min-width: 0;
    gap: 0.4rem;
    overflow: hidden;
  }

  .lore-status {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.16rem;
    flex-shrink: 0;
  }


  .player-effect-card {
    position: relative;
    width: 1.15rem;
    height: 1.35rem;
    margin-left: calc(var(--effect-card-offset) * -0.35rem);
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35));
  }

  .player-effect-card :global(.lorcana-card) {
    border-radius: 0.18rem;
    overflow: hidden;
  }

  .player-effect-overflow {
    margin-left: 0.2rem;
    padding: 0.1rem 0.26rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.34);
    background: rgba(15, 23, 42, 0.88);
    color: #cbd5e1;
    font-size: clamp(0.64rem, 1.7vw, 0.7rem);
    font-weight: 700;
    line-height: 1;
  }

  .player-effect-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.22rem;
    margin-left: 0.28rem;
    max-width: 6.8rem;
    padding: 0.14rem 0.36rem;
    border-radius: 999px;
    border: 1px solid rgba(125, 211, 252, 0.3);
    background: rgba(3, 105, 161, 0.22);
    color: #e0f2fe;
    font-size: clamp(0.62rem, 1.7vw, 0.68rem);
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .player-effect-pill__count {
    color: rgba(191, 219, 254, 0.92);
  }

  .status-indicator {
    position: absolute;
    right: -1px;
    bottom: 1px;
    width: 0.7rem;
    height: 0.7rem;
    background: rgba(71, 85, 105, 0.95);
    border-radius: 50%;
    border: 2px solid rgba(12, 22, 36, 0.95);
    box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.18);
    transition:
      background-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  .status-indicator--active {
    background: #10b981;
    box-shadow:
      0 0 0 1px rgba(16, 185, 129, 0.22),
      0 0 12px rgba(16, 185, 129, 0.35);
    animation: pulse 2s ease-in-out infinite;
  }

  .status-indicator--afk {
    background: #d97706;
    box-shadow:
      0 0 0 1px rgba(217, 119, 6, 0.22),
      0 0 10px rgba(217, 119, 6, 0.3);
    animation: pulse 2.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.78;
      transform: scale(0.9);
    }
  }

  .stat-group {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    align-items: center;
    flex: 1;
    min-width: 0;
    gap: 0.2rem;
  }

  .stat-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.22rem;
    line-height: 1;
    min-width: 0;
    padding: 0.08rem 0;
  }

  .stat-item + .stat-item {
    border-left: 1px solid rgba(148, 163, 184, 0.1);
  }

  .stat-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 0.72rem;
    height: 0.72rem;
    opacity: 0.6;
    flex-shrink: 0;
  }

  .stat-icon :global(svg) {
    width: 100%;
    height: 100%;
    stroke-width: 2;
  }

  .stat-value {
    font-size: 0.74rem;
    font-weight: 700;
    color: #e2e8f0;
    line-height: 1;
    white-space: nowrap;
  }

  :global(.lore-badge.badge--small) {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
  }

  :global(.lore-badge.badge--small .badge-label) {
    display: none;
  }

  .settings-trigger {
    width: 1.65rem;
    height: 1.65rem;
    padding: 0.3rem;
    border-radius: 0.45rem;
    border: 1px solid rgba(125, 211, 252, 0.7);
    background:
      linear-gradient(180deg, rgba(125, 211, 252, 0.18), rgba(125, 211, 252, 0.04)),
      rgba(21, 48, 77, 0.95);
    color: #f0f9ff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.08) inset,
      0 0 0 1px rgba(125, 211, 252, 0.1),
      0 1px 3px rgba(0, 0, 0, 0.4);
    transition:
      background 140ms ease,
      border-color 140ms ease,
      color 140ms ease,
      transform 140ms ease,
      box-shadow 140ms ease;
  }

  .settings-trigger :global(svg) {
    width: 100%;
    height: 100%;
    stroke-width: 2.2;
  }

  .settings-trigger:hover,
  .settings-trigger:focus-visible {
    background:
      linear-gradient(180deg, rgba(125, 211, 252, 0.32), rgba(125, 211, 252, 0.1)),
      rgba(34, 74, 117, 0.98);
    border-color: rgba(186, 230, 253, 0.95);
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.14) inset,
      0 0 0 2px rgba(125, 211, 252, 0.22),
      0 4px 10px rgba(0, 0, 0, 0.5);
    outline: none;
  }

  .settings-trigger:active {
    transform: translateY(0);
    box-shadow:
      0 1px 0 rgba(0, 0, 0, 0.25) inset,
      0 1px 2px rgba(0, 0, 0, 0.4);
  }

  .settings-trigger--report {
    border-color: rgba(248, 113, 113, 0.7);
    background:
      linear-gradient(180deg, rgba(248, 113, 113, 0.22), rgba(248, 113, 113, 0.05)),
      rgba(48, 14, 22, 0.95);
    color: #fecaca;
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.08) inset,
      0 0 0 1px rgba(248, 113, 113, 0.12),
      0 1px 3px rgba(0, 0, 0, 0.4);
  }

  .settings-trigger--report:hover,
  .settings-trigger--report:focus-visible {
    background:
      linear-gradient(180deg, rgba(248, 113, 113, 0.4), rgba(248, 113, 113, 0.1)),
      rgba(127, 29, 29, 0.95);
    border-color: rgba(254, 202, 202, 0.95);
    color: #fee2e2;
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.14) inset,
      0 0 0 2px rgba(248, 113, 113, 0.28),
      0 4px 10px rgba(0, 0, 0, 0.5);
  }

  .player-quick-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.32rem;
    flex-shrink: 0;
    margin-left: auto;
    padding-left: 0.3rem;
    border-left: 1px solid rgba(148, 163, 184, 0.18);
  }

</style>
