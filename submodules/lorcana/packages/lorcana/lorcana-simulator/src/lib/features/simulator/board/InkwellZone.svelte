<script lang="ts">
import type {
	LorcanaPlayerSide,
	LorcanaTableSeat,
} from "@/features/simulator/model/contracts.js";
import CardBack from "@/design-system/simulator/cards/CardBack.svelte";
import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
import {ZONE_IMAGE_FORMATS} from "@/design-system/simulator/cards/card-image-format.js";
import { getManualModeContext } from "@/features/manual-mode/manual-mode-context.svelte.js";
import InkwellReminder from "@/features/simulator/board/InkwellReminder.svelte";
import {
	createCardAnchorId,
	createInkwellEntryAnchorId,
	createZoneAnchorId,
} from "@/features/simulator/animations/board-move-animations.js";
import { useLorcanaBoardPresenter } from "@/features/simulator/context/game-context.svelte.js";
import {
	createOptionalDroppable,
	useLorcanaSimulatorDndContext,
} from "@/features/simulator/context/simulator-dnd-context.svelte.js";
import * as Tooltip from "$lib/design-system/primitives/tooltip/index.js";
import { m } from "$lib/i18n/messages.js";
import { getCdnFallbackUrl } from "$lib/config/public-url-config.js";
import { INK_DROP_COUNTER_URL } from "./ink-drop-assets.js";

const INK_DROP_IMG_FALLBACK = (e: Event) => {
  const img = e.currentTarget as HTMLImageElement;
  const fallback = getCdnFallbackUrl(img.src);
  if (fallback) img.src = fallback;
};

interface InkwellZoneProps {
	isOpponent: boolean;
	playerSide: LorcanaPlayerSide;
	seat: LorcanaTableSeat;
	onClick?: () => void;
	onCounterClick?: () => void;
}

let {
	isOpponent,
	playerSide,
	seat,
	onClick,
	onCounterClick,
}: InkwellZoneProps = $props();

const board = useLorcanaBoardPresenter();
const dnd = useLorcanaSimulatorDndContext();
const inFlightCardIds = $derived(board.inFlightCardIds);
const cards = $derived(board.getZoneCards(playerSide, "inkwell").filter((card) => !inFlightCardIds.has(card.cardId)));
const playerSummary = $derived(board.getPlayerSummary(playerSide));
const boardSnapshot = $derived(board.boardSnapshot);
const ownerId = $derived(board.getOwnerIdForSide(playerSide));
const totalCards = $derived(playerSummary?.inkwellCount ?? 0);
const availableInk = $derived(playerSummary?.availableInk ?? null);
const isMasked = $derived(board.isZoneMasked(playerSide, "inkwell"));
const droppable = createOptionalDroppable({
	zone: "inkwell",
	get player() {
		return playerSide;
	},
});

const MAX_VISIBLE_HIDDEN_CARDS = 12;
const effectiveTotal = $derived(Math.max(totalCards, cards.length));
const hasRevealedCards = $derived(cards.length > 0);
const visibleRevealedCards = $derived.by(() =>
	cards.slice(-MAX_VISIBLE_HIDDEN_CARDS).reverse(),
);
const hiddenPlaceholderCount = $derived(
	hasRevealedCards ? 0 : Math.min(effectiveTotal, MAX_VISIBLE_HIDDEN_CARDS),
);
const hiddenOverflowCount = $derived(
	Math.max(0, effectiveTotal - hiddenPlaceholderCount),
);
const hasVisibleOverflow = $derived(hiddenOverflowCount > 0);
const hasRevealedOverflow = $derived(cards.length > MAX_VISIBLE_HIDDEN_CARDS);
const totalInk = $derived(hasRevealedCards ? cards.length : effectiveTotal);
const readyInk = $derived.by<number | null>(() => {
	if (!hasRevealedCards) {
		return availableInk;
	}
	return cards.reduce(
		(count, card) => count + (card.readyState === "exerted" ? 0 : 1),
		0,
	);
});
const inkCounterLabel = $derived.by(() => {
	if (readyInk === null && effectiveTotal > 0) {
		return `?/${effectiveTotal}`;
	}
	return `${readyInk ?? 0}/${totalInk}`;
});
const inferredHiddenReadyCount = $derived.by(() => {
	if (hasRevealedCards || availableInk === null) {
		return 0;
	}

	return Math.max(0, Math.min(hiddenPlaceholderCount, availableInk));
});
const inferredHiddenExertedCount = $derived.by(() =>
	Math.max(0, hiddenPlaceholderCount - inferredHiddenReadyCount),
);
const showZoneCounters = $derived(board.showZoneCounters);
const inkDrops = $derived(playerSummary?.inkDrops ?? 0);
const inkDropPaymentArmed = $derived(board.inkDropPaymentArmed);
const inkDropCountText = $derived(
	inkDrops === 1
		? m["sim.inkDropsBadge.countOne"]({ count: inkDrops })
		: m["sim.inkDropsBadge.countMany"]({ count: inkDrops }),
);
const inkDropBadgeTitle = $derived(
	isOpponent
		? inkDropCountText
		: `${inkDropCountText} — ${
				inkDropPaymentArmed
					? m["sim.inkDropsBadge.instructionStop"]({})
					: m["sim.inkDropsBadge.instructionStart"]({})
			}`,
);
const manualMode = getManualModeContext();
const manualModeEnabled = $derived(manualMode?.enabled ?? false);
const dropState = $derived(dnd.getZoneDropState("inkwell", playerSide));
const showDropIndicator = $derived(
	dropState === "valid" || dropState === "invalid",
);
const showInkwellReminder = $derived.by(() => {
	if (!boardSnapshot || !ownerId || board.turnSide !== playerSide) {
		return false;
	}

	return boardSnapshot.players[ownerId]?.canAddCardToInkwell ?? false;
});

const ART_ONLY_ASPECT_RATIO = 734 / 602;

let inkwellCardsEl = $state<HTMLButtonElement | null>(null);

$effect(() => {
	cards.length;
	inkwellCardsEl?.scrollTo({ left: 0 });
});
</script>

<div
  class="inkwell-container"
    class:inkwell-container--opponent={isOpponent}
    class:inkwell-container--drop-target={dropState !== "none"}
    class:inkwell-container--drop-preview={dropState === "preview"}
    class:inkwell-container--drop-valid={dropState === "valid"}
    class:inkwell-container--drop-invalid={dropState === "invalid"}
    class:inkwell-container--empty={effectiveTotal === 0}
    data-player-seat={seat}
    data-player-side={playerSide}
    data-zone-id="inkwell"
  {@attach droppable.attach}
>
  <!-- Ink Counter Badge -->
  {#if showZoneCounters}
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <button
          type="button"
          {...props}
          class="ink-counter"
          onclick={(e) => { e.stopPropagation(); onCounterClick?.(); }}
        >
          <span class="ink-counter-value">{inkCounterLabel}</span>
        </button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content
      side="top"
      sideOffset={6}
      class="rounded-md border border-white/10 bg-slate-950/95 px-2 py-1 text-[0.65rem] text-slate-200 shadow-lg"
    >
      {m["sim.inkwell.tooltip"]({})}
    </Tooltip.Content>
  </Tooltip.Root>
  {/if}

  <!-- Inline ink label (when zone counters are OFF) -->
  {#if !showZoneCounters && effectiveTotal > 0}
    <span class="ink-inline-label" class:ink-inline-label--top={seat === "top"}>
      {inkCounterLabel}
    </span>
  {/if}

  <!-- Ink Cards Display -->
  {#if hasRevealedCards}
    <button
      type="button"
      class="inkwell-cards"
      bind:this={inkwellCardsEl}
      data-board-anchor-id={createZoneAnchorId(playerSide, "inkwell")}
      data-board-scroll-sync
      onclick={onClick}
    >
      <div
        class="inkwell-entry-anchor"
        data-board-anchor-id={createInkwellEntryAnchorId(playerSide)}
        aria-hidden="true"
      ></div>
      <!-- Revealed view from snapshot cards -->
      <div  class="ink-cards-revealed">
        {#if showInkwellReminder}
          <InkwellReminder {isOpponent} />
        {/if}
        {#each visibleRevealedCards as card (card.cardId)}
          <div
            class="ink-card"
            class:ink-card--exerted={card.readyState === "exerted"}
            data-card-id={card.cardId}
            data-player-seat={seat}
            data-player-id={card.ownerId}
            data-zone-id={card.zoneId}
            data-board-anchor-id={createCardAnchorId(playerSide, "inkwell", card.cardId)}
            role="presentation"
            onclick={(e) => {
              if (card.facePresentation === "faceUp" || manualModeEnabled) {
                e.stopPropagation();
              }
            }}
          >
            {#if card.facePresentation === "faceUp" || manualModeEnabled}
              <LorcanaCard
                {card}
                useContainerSize
                imageFormat={ZONE_IMAGE_FORMATS.inkwell}
                isMasked={isMasked}
                isExerted={card.readyState === "exerted"}
                hideStatBadges
                hideSupplementalBadges
              />
            {:else}
              <CardBack
                {ownerId}
                displayWidth={44}
                displayHeight={36}
                aspectRatio={ART_ONLY_ASPECT_RATIO}
                useContainerSize={true}
                imageFormat={ZONE_IMAGE_FORMATS.inkwell}
              />
            {/if}
          </div>
        {/each}
        {#if hasRevealedOverflow}
          <div class="more-ink">+{cards.length - MAX_VISIBLE_HIDDEN_CARDS}</div>
        {/if}
      </div>

      {#if showDropIndicator}
        <div class="drop-indicator">+</div>
      {/if}
    </button>
  {:else}
    <button
      type="button"
      class="inkwell-cards"
      bind:this={inkwellCardsEl}
      data-board-anchor-id={createZoneAnchorId(playerSide, "inkwell")}
      data-board-scroll-sync
      onclick={onClick}
    >
      <div
        class="inkwell-entry-anchor"
        data-board-anchor-id={createInkwellEntryAnchorId(playerSide)}
        aria-hidden="true"
      ></div>
      <!-- Normal view: show card backs in horizontal layout -->
      <div  class="ink-cards-stack">
        {#if showInkwellReminder}
          <InkwellReminder {isOpponent} />
        {/if}
        {#each Array.from({ length: hiddenPlaceholderCount }) as _, index (`ink-hidden-${index}`)}
          {@const isInferredExerted = index < inferredHiddenExertedCount}
          <div
            class="ink-card-back"
            class:ink-card-back--exerted={isInferredExerted}
            style:z-index={hiddenPlaceholderCount - index}
          >
            <CardBack
              {ownerId}
              displayWidth={44}
              displayHeight={36}
              aspectRatio={ART_ONLY_ASPECT_RATIO}
              useContainerSize={true}
              imageFormat={ZONE_IMAGE_FORMATS.inkwell}
              isExerted={isInferredExerted}
            />
          </div>
        {/each}
        {#if hasVisibleOverflow}
          <div class="ink-count-more">+{hiddenOverflowCount}</div>
        {/if}
      </div>

      {#if showDropIndicator}
        <div class="drop-indicator">+</div>
      {/if}
    </button>
  {/if}

  <!-- Hyperia City ink drops: official counter tokens trailing the inkwell cards; click toggles
       drop payment on your own inkwell. Manual mode turns the strip into +/− board-state
       correction instead. -->
  {#if inkDrops > 0 || manualModeEnabled}
    <div
      class="ink-drop-tokens"
      class:ink-drop-tokens--armed={inkDropPaymentArmed && !isOpponent && !manualModeEnabled}
      class:ink-drop-tokens--interactive={!isOpponent && !manualModeEnabled}
      data-ink-drop-tokens
      data-ink-drop-count={inkDrops}
      data-ink-drop-armed={inkDropPaymentArmed && !isOpponent && !manualModeEnabled}
      title={manualModeEnabled ? inkDropCountText : inkDropBadgeTitle}
      role={isOpponent || manualModeEnabled ? undefined : "button"}
      tabindex={isOpponent || manualModeEnabled ? undefined : 0}
      aria-hidden={isOpponent ? "true" : undefined}
      aria-pressed={isOpponent || manualModeEnabled ? undefined : inkDropPaymentArmed}
      onclick={(e) => {
        if (isOpponent || manualModeEnabled) {
          return;
        }
        e.stopPropagation();
        board.toggleInkDropPayment();
      }}
      onkeydown={(e) => {
        if (isOpponent || manualModeEnabled || (e.key !== "Enter" && e.key !== " ")) {
          return;
        }
        e.preventDefault();
        board.toggleInkDropPayment();
      }}
    >
      {#if manualModeEnabled}
        <button
          type="button"
          class="ink-drop-badge__btn"
          aria-label={`Decrease ink drops for ${playerSide}`}
          onclick={() => {
            if (ownerId) manualMode?.setInkDrops(ownerId, Math.max(0, inkDrops - 1));
          }}
          disabled={inkDrops <= 0}
        >−</button>
      {/if}
      <span class="ink-drop-token-stack">
        <img
          class="ink-drop-token"
          src={INK_DROP_COUNTER_URL}
          alt=""
          draggable="false"
          onerror={INK_DROP_IMG_FALLBACK}
        />
        <span class="ink-drop-token-count">{inkDrops}</span>
      </span>
      {#if manualModeEnabled}
        <button
          type="button"
          class="ink-drop-badge__btn"
          aria-label={`Increase ink drops for ${playerSide}`}
          onclick={() => {
            if (ownerId) manualMode?.setInkDrops(ownerId, inkDrops + 1);
          }}
        >+</button>
      {/if}
    </div>
    {#if showZoneCounters}
      <span class="ink-drop-badge" data-ink-drop-badge data-ink-drop-count={inkDrops}>
        <img
          class="ink-drop-badge__icon"
          src={INK_DROP_COUNTER_URL}
          alt=""
          draggable="false"
          onerror={INK_DROP_IMG_FALLBACK}
        />
        <span class="ink-drop-badge__count">{inkDrops}</span>
      </span>
    {/if}
  {/if}

</div>

<style>
  .inkwell-container {
    /* Color theme */
    --ink-bg: rgba(25, 20, 40, 0.7);
    --ink-border: rgba(130, 100, 180, 0.25);
    --ink-accent: rgba(180, 160, 220, 0.9);

    /* Card dimensions */
    --ink-card-width: var(--zone-card-width, 26px);
    --ink-card-height: var(--zone-card-height, 36px);
    --ink-card-gap: 4px;
    --ink-stack-height: var(--zone-card-height, 36px);
    --ink-stack-padding: 0px;

    /* Container dimensions */
    --ink-container-min-width: 70px;
    --ink-container-padding: 6px;

    /* Counter dimensions */
    --ink-counter-size: 28px;
    --ink-counter-offset: -6px;
    --ink-counter-translate-x: -50%;
    --ink-counter-translate-y: -50%;

    position: relative;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 6px;
    padding: var(--ink-container-padding);
    background: var(--ink-bg);
    border: 1px solid var(--ink-border);
    border-radius: 8px;
    min-width: var(--ink-container-min-width);
    width: 100%;
    height: 100%;
    min-height: 0;
  }

  .inkwell-container--opponent {
    --ink-bg: rgba(40, 20, 30, 0.6);
    --ink-border: rgba(180, 100, 120, 0.2);
    --ink-accent: rgba(220, 160, 160, 0.8);
  }

  .inkwell-container--empty {
    --ink-bg: rgba(20, 15, 30, 0.4);
    --ink-border: rgba(100, 80, 130, 0.15);
    --ink-accent: rgba(150, 130, 170, 0.5);
  }

  .inkwell-container--drop-target {
    --ink-border: rgba(180, 140, 230, 0.6);
    box-shadow:
      0 0 16px rgba(180, 140, 230, 0.18),
      inset 0 0 14px rgba(180, 140, 230, 0.08);
  }

  .inkwell-container--drop-preview {
    --ink-border: rgba(180, 140, 230, 0.72);
    background:
      linear-gradient(180deg, rgba(119, 62, 204, 0.18), rgba(62, 28, 105, 0.1)),
      rgba(22, 14, 39, 0.2);
    border-style: solid;
    box-shadow:
      0 0 18px rgba(180, 140, 230, 0.22),
      inset 0 0 16px rgba(180, 140, 230, 0.1);
  }

  .inkwell-container--drop-valid {
    --ink-border: rgba(56, 189, 139, 0.7);
    background:
      linear-gradient(180deg, rgba(34, 197, 94, 0.18), rgba(6, 95, 70, 0.1)),
      rgba(8, 26, 22, 0.22);
    box-shadow:
      0 0 20px rgba(56, 189, 139, 0.28),
      inset 0 0 20px rgba(56, 189, 139, 0.15);
    animation: drop-pulse 1s ease-in-out infinite;
  }

  .inkwell-container--drop-invalid {
    --ink-border: rgba(248, 113, 113, 0.7);
    background:
      linear-gradient(180deg, rgba(220, 38, 38, 0.18), rgba(127, 29, 29, 0.1)),
      rgba(33, 16, 22, 0.22);
    box-shadow:
      0 0 20px rgba(248, 113, 113, 0.28),
      inset 0 0 20px rgba(248, 113, 113, 0.15);
  }

  @keyframes drop-pulse {
    0%, 100% { border-color: rgba(180, 140, 230, 0.4); }
    50% { border-color: rgba(180, 140, 230, 0.8); }
  }

  /* Ink Counter Badge */
  .ink-counter {
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
    border: 1px solid rgba(100, 150, 200, 0.4);
    border-radius: 50%;
    width: var(--ink-counter-size);
    height: var(--ink-counter-size);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    z-index: 10;
    padding: 0;
    cursor: pointer;
    transform: translate(var(--ink-counter-translate-x), var(--ink-counter-translate-y));
    transition: transform 100ms ease, box-shadow 100ms ease;
  }

  .ink-counter:hover {
    transform: translate(var(--ink-counter-translate-x), var(--ink-counter-translate-y)) scale(1.1);
    box-shadow: 0 2px 12px rgba(100, 150, 200, 0.5);
  }

  .ink-counter-value {
    font-size: 0.7rem;
    font-weight: 800;
    color: #e2e8f0;
    font-variant-numeric: tabular-nums;
  }

  /* Hyperia City ink-drop badge (top-right counterpart of the ink counter) */
  .ink-drop-badge {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 2px 7px 2px 5px;
    background: linear-gradient(135deg, #0f3b3a 0%, #14524f 100%);
    border: 1px solid rgba(56, 189, 139, 0.45);
    border-radius: 999px;
    color: #d1fae5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    z-index: 10;
    cursor: pointer;
    line-height: 1;
    transition: transform 100ms ease, box-shadow 100ms ease, background 150ms ease;
  }

  .ink-drop-badge:hover {
    transform: translate(50%, -50%) scale(1.08);
    box-shadow: 0 2px 12px rgba(56, 189, 139, 0.5);
  }

  .ink-drop-badge__btn {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: rgba(6, 95, 70, 0.55);
    color: #d1fae5;
    font-size: 0.7rem;
    font-weight: 800;
    line-height: 1;
    cursor: pointer;
  }

  .ink-drop-badge__btn:hover:not(:disabled) {
    background: rgba(6, 95, 70, 0.9);
  }

  .ink-drop-badge__btn:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .ink-drop-badge__icon {
    width: 8px;
    height: 11px;
    fill: rgba(110, 231, 183, 0.95);
  }

  .ink-drop-badge__count {
    font-size: 0.68rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }

  /* Inline ink label (counters OFF fallback) */
  .ink-inline-label {
    position: absolute;
    top: -4px;
    left: -4px;
    font-size: 0.8rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    color: #e2e8f0;
    background: rgba(15, 23, 42, 0.88);
    border: 1px solid rgba(148, 163, 184, 0.3);
    border-radius: 6px;
    padding: 2px 6px;
    pointer-events: none;
    z-index: 10;
    line-height: 1;
    user-select: none;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }

  .ink-inline-label--top {
    top: auto;
    bottom: -4px;
  }

  /* Hyperia City ink-drop tokens (official counters trailing the inkwell cards) */
  .ink-drop-tokens {
    flex: 0 0 auto;
    align-self: flex-end;
    margin-bottom: 2px;
    display: flex;
    align-items: flex-end;
    pointer-events: none;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.55));
  }

  /* The local player's strip is the payment toggle: re-enable pointer events
     that the display-only base rule turns off, or the click/keyboard handler
     can never receive mouse or touch input. */
  .ink-drop-tokens--interactive {
    pointer-events: auto;
    cursor: pointer;
  }

  .ink-drop-token-stack {
    position: relative;
    display: flex;
    flex: 0 0 auto;
  }

  .ink-drop-token {
    width: 17px;
    height: 24px;
    object-fit: cover;
    border-radius: 2.5px;
    outline: 1px solid rgba(0, 0, 0, 0.55);
  }

  .ink-drop-token-count {
    position: absolute;
    top: -6px;
    right: -8px;
    font-size: 0.58rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    color: #d1fae5;
    background: rgba(15, 59, 58, 0.92);
    border: 1px solid rgba(56, 189, 139, 0.45);
    border-radius: 999px;
    padding: 2px 4px;
  }

  /* Ink-drop count badge (top-right counterpart of the ink counter) */
  .ink-drop-badge {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 2px 7px 2px 4px;
    background: linear-gradient(135deg, #0f3b3a 0%, #14524f 100%);
    border: 1px solid rgba(56, 189, 139, 0.45);
    border-radius: 999px;
    color: #d1fae5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    z-index: 12;
    line-height: 1;
    pointer-events: none;
  }

  .ink-drop-badge__icon {
    width: 12px;
    height: 17px;
    object-fit: cover;
    border-radius: 2px;
  }

  .ink-drop-badge__count {
    font-size: 0.68rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }

  /* Ink Cards Stack - Horizontal layout */
  .inkwell-cards {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    height: 100%;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    position: relative;
    overflow-x: auto;
    overflow-y: visible;
    scrollbar-width: thin;
    scrollbar-color: rgba(180, 160, 220, 0.55) rgba(0, 0, 0, 0.18);
  }

  .inkwell-entry-anchor {
    position: absolute;
    left: 0;
    top: 50%;
    width: var(--ink-card-width);
    height: var(--ink-card-height);
    pointer-events: none;
    opacity: 0;
    transform: translateY(-50%);
  }

  .inkwell-cards::-webkit-scrollbar {
    height: 8px;
  }

  .inkwell-cards::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.18);
    border-radius: 999px;
  }

  .inkwell-cards::-webkit-scrollbar-thumb {
    background: rgba(180, 160, 220, 0.5);
    border-radius: 999px;
  }

  .ink-cards-stack {
    display: flex;
    align-items: center;
    gap: var(--ink-card-gap);
    justify-content: flex-start;
    position: relative;
    width: max-content;
    min-width: max-content;
    height: 100%;
    min-height: var(--ink-stack-height);
    padding-left: var(--ink-stack-padding);
  }

  .ink-card-back {
    width: var(--ink-card-width);
    height: var(--ink-card-height);
    transition: all 150ms ease;
    filter: brightness(0.9);
    flex: 0 0 auto;
  }

  .ink-card-back:hover {
    transform: translateY(-3px);
    filter: brightness(1.1);
  }

  .ink-card-back--exerted {
    filter: brightness(0.72) grayscale(0.25);
    transform: rotate(20deg) scale(0.96);
  }

  .ink-count-more {
    position: absolute;
    right: -5px;
    bottom: 0;
    font-size: 0.6rem;
    font-weight: 700;
    color: rgba(180, 160, 220, 0.9);
    background: rgba(0, 0, 0, 0.6);
    padding: 2px 4px;
    border-radius: 4px;
  }

  /* Revealed Cards View */
  .ink-cards-revealed {
    display: flex;
    gap: var(--ink-card-gap);
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    width: max-content;
    min-width: max-content;
    min-height: 100%;
    height: 100%;
    padding: 0;
    overflow: visible;
  }

  .ink-card {
    transition: filter 150ms ease, transform 150ms ease;
    width: var(--zone-card-width, 28px);
    height: var(--zone-card-height, 40px);
    flex: 0 0 auto;
    display: flex;
    position: relative;
    overflow: visible;
  }

  .ink-card--exerted {
    filter: brightness(0.6) grayscale(0.4);
    transform: rotate(20deg) scale(0.96);
  }

  .more-ink {
    font-size: 0.6rem;
    font-weight: 700;
    color: rgba(180, 160, 220, 0.9);
    padding: 4px 6px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    align-self: center;
    margin-left: 0.25rem;
  }

  /* Drop Indicator */
  .drop-indicator {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    background: #a855f7;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(168, 85, 247, 0.5);
    animation: bounce 0.5s ease-in-out infinite alternate;
  }

  @keyframes bounce {
    from { transform: scale(1); }
    to { transform: scale(1.1); }
  }

  /* Responsive - override custom properties for smaller screens */
  @media (max-width: 900px) {
    .inkwell-container {
      --ink-container-min-width: 60px;
      --ink-container-padding: 4px;
      --ink-card-gap: 3px;
      --ink-counter-size: 24px;
      --ink-counter-offset: -4px;
    }

    .ink-counter-value {
      font-size: 0.6rem;
    }

    .ink-inline-label {
      font-size: 0.7rem;
      padding: 1px 5px;
    }

    .ink-drop-token {
      width: 14px;
      height: 20px;
    }

    .ink-drop-badge__icon {
      width: 10px;
      height: 14px;
    }
  }

  @media (max-width: 700px) {
    .inkwell-container {
      --ink-card-gap: 2px;
    }
  }
</style>
