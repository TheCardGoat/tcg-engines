<script lang="ts">
import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
import type {
	LorcanaCardSnapshot,
	LorcanaPlayerSide,
	LorcanaTableSeat,
} from "@/features/simulator/model/contracts.js";
import type { SimulatorLayoutMode } from "@/features/simulator/model/layout-mode.svelte.js";
import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
import {
	useLorcanaBoardPresenter,
	useLorcanaSidebarPresenter,
} from "@/features/simulator/context/game-context.svelte.js";
import { useSimulatorCardContext } from "@/features/simulator/context/simulator-card-context.svelte.js";
import { m } from "$lib/i18n/messages.js";
import {
	countHiddenScrollableItems,
	getInitialHiddenItemsToRight,
	getScrollableItemStep,
} from "./item-zone-mobile.js";

interface ItemZoneProps {
	layoutMode?: SimulatorLayoutMode;
	isOpponent: boolean;
	playerSide: LorcanaPlayerSide;
	seat: LorcanaTableSeat;
}

let {
	layoutMode = "desktop",
	isOpponent,
	playerSide,
	seat,
}: ItemZoneProps = $props();

const board = useLorcanaBoardPresenter();
const showZoneCounters = $derived(board.showZoneCounters);
const sidebar = useLorcanaSidebarPresenter();
const simulatorCardContext = useSimulatorCardContext();
const items = $derived.by(() =>
	board
		.getZoneCards(playerSide, "play")
		.filter((card) => card.cardType === "item"),
);
const actionPlayableCardIds = $derived.by(() => {
	const playableIds = new Set<string>();
	for (const card of items) {
		if (sidebar.getCardActionHighlightState(card).playable) {
			playableIds.add(card.cardId);
		}
	}
	return playableIds;
});
const actionActivatableCardIds = $derived.by(() => {
	const activatableIds = new Set<string>();
	for (const card of items) {
		if (sidebar.getCardActionHighlightState(card).activatable) {
			activatableIds.add(card.cardId);
		}
	}
	return activatableIds;
});

let itemContainerEl = $state<HTMLDivElement | null>(null);
let hiddenItemsToLeft = $state(0);
let hiddenItemsToRight = $state(0);
const hasItemOverflow = $derived(hiddenItemsToLeft > 0 || hiddenItemsToRight > 0);
const showItemControls = $derived(items.length > 0 && hasItemOverflow);

function getScrollableItemCards(): HTMLElement[] {
	if (!itemContainerEl) {
		return [];
	}

	return Array.from(
		itemContainerEl.querySelectorAll<HTMLElement>(".item-card"),
	);
}

function updateHiddenItems(): void {
	if (!itemContainerEl) {
		hiddenItemsToLeft = 0;
		hiddenItemsToRight = 0;
		return;
	}

	const counts = countHiddenScrollableItems({
		viewportLeft: itemContainerEl.scrollLeft,
		viewportWidth: itemContainerEl.clientWidth,
		elements: getScrollableItemCards().map((cardEl) => ({
			offsetLeft: cardEl.offsetLeft,
			offsetWidth: cardEl.offsetWidth,
		})),
	});
	hiddenItemsToLeft = counts.left;
	hiddenItemsToRight = counts.right;
}

function scrollItems(direction: "left" | "right"): void {
	if (!itemContainerEl) {
		return;
	}

	const step = getScrollableItemStep({
		viewportWidth: itemContainerEl.clientWidth,
		elements: getScrollableItemCards().map((cardEl) => ({
			offsetLeft: cardEl.offsetLeft,
			offsetWidth: cardEl.offsetWidth,
		})),
	});
	if (step <= 0) {
		return;
	}

	itemContainerEl.scrollBy({
		left: direction === "left" ? -step : step,
		behavior: "smooth",
	});
}

function scrollItemIntoView(cardEl: HTMLElement): void {
	if (!itemContainerEl) {
		return;
	}

	const left = cardEl.offsetLeft;
	const right = left + cardEl.offsetWidth;
	const viewportLeft = itemContainerEl.scrollLeft;
	const viewportRight = viewportLeft + itemContainerEl.clientWidth;

	if (left < viewportLeft) {
		itemContainerEl.scrollTo({ left, behavior: "smooth" });
	} else if (right > viewportRight) {
		itemContainerEl.scrollTo({
			left: right - itemContainerEl.clientWidth,
			behavior: "smooth",
		});
	}
}

function handleDirectItemSelection(selectedCard: LorcanaCardSnapshot, event: MouseEvent): boolean {
	if (sidebar.actionSelectionSession || sidebar.resolutionSelectionSession) {
		return false;
	}

	const abilityAction = sidebar
		.getCardActionViews(selectedCard)
		.find((action) => action.categoryId === "activate-ability" && action.enabled);
	if (!abilityAction) {
		return false;
	}

	event.stopPropagation();
	return sidebar.handleCardActionClick(abilityAction);
}

$effect(() => {
	if (!itemContainerEl) {
		hiddenItemsToLeft = 0;
		hiddenItemsToRight = getInitialHiddenItemsToRight(layoutMode, items.length);
		return;
	}

	void items.length;

	const container = itemContainerEl;
	const resizeObserver =
		typeof ResizeObserver === "undefined"
			? null
			: new ResizeObserver(updateHiddenItems);
	const cardElements = Array.from(
		container.querySelectorAll<HTMLElement>(".item-card"),
	);

	updateHiddenItems();
	container.addEventListener("scroll", updateHiddenItems, { passive: true });
	resizeObserver?.observe(container);

	for (const cardEl of cardElements) {
		resizeObserver?.observe(cardEl);
	}

	return () => {
		container.removeEventListener("scroll", updateHiddenItems);
		resizeObserver?.disconnect();
	};
});
</script>

<div
	class="item-zone"
	class:item-zone--opponent={isOpponent}
	class:item-zone--scrollable={showItemControls}
	data-layout-mode={layoutMode}
	data-player-seat={seat}
	data-player-side={playerSide}
	data-action-playable-card-ids={[...actionPlayableCardIds].join(",")}
	data-action-activatable-card-ids={[...actionActivatableCardIds].join(",")}
>
  {#if showZoneCounters}
  <div class="item-counter">
    <span class="item-counter-value">{items.length}</span>
  </div>
  {/if}

  <div class="item-zone-cards">
    <div
      class="item-cards"
      bind:this={itemContainerEl}
      data-testid={`item-scroll-container-${playerSide}`}
    >
      {#each items as card (card.cardId)}
        {@const actionState = sidebar.getActionSessionCardState(card.cardId)}
        {@const isActionPlayable = actionPlayableCardIds.has(card.cardId)}
        {@const isActionActivatable = actionActivatableCardIds.has(card.cardId)}
        <div
          class="item-card"
          onfocusin={(event) => {
            scrollItemIntoView(event.currentTarget);
          }}
        >
          <LorcanaCard
            {card}
            onSelect={(selectedCard, event) => handleDirectItemSelection(selectedCard, event)}
            useContainerSize
            imageFormat="art_only"
            hoverShowActions
            interactionMeta={
              isActionActivatable
                ? { selectable: true, selectionMode: "single", suppressInspectOnSelect: true }
                : undefined
            }
            isMasked={false}
            isSelected={
              actionState.isSelected ||
              simulatorCardContext.previewCard?.cardId === card.cardId
            }
            isPlayable={actionState.isSelectable || isActionPlayable}
            isValidTarget={actionState.isSelectable}
            isInvalidTarget={actionState.isInvalidTarget}
            isExerted={card.readyState === "exerted"}
            damage={card.damage ?? 0}
          />
        </div>
      {/each}
    </div>
  </div>

  {#if showItemControls}
    <button
      type="button"
      class="mobile-item-scroll-button mobile-item-scroll-button--left"
      class:item-scroll-button--desktop={layoutMode !== "mobile"}
      aria-label={m["sim.itemZone.showEarlierAria"]({ count: hiddenItemsToLeft })}
      disabled={hiddenItemsToLeft === 0}
      data-testid={`item-scroll-left-${playerSide}`}
      onclick={() => {
        scrollItems("left");
      }}
    >
      <ChevronLeftIcon class="size-4" />
      {#if hiddenItemsToLeft > 0}
        <span class="item-scroll-button__count" aria-hidden="true">{hiddenItemsToLeft}</span>
      {/if}
    </button>
  {/if}

  {#if showItemControls}
    <button
      type="button"
      class="mobile-item-scroll-button mobile-item-scroll-button--right"
      class:item-scroll-button--desktop={layoutMode !== "mobile"}
      aria-label={m["sim.itemZone.showLaterAria"]({ count: hiddenItemsToRight })}
      disabled={hiddenItemsToRight === 0}
      data-testid={`item-scroll-right-${playerSide}`}
      onclick={() => {
        scrollItems("right");
      }}
    >
      <ChevronRightIcon class="size-4" />
      {#if hiddenItemsToRight > 0}
        <span class="item-scroll-button__count" aria-hidden="true">{hiddenItemsToRight}</span>
      {/if}
    </button>
  {/if}
</div>

<style>
  .item-zone {
    --item-bg: rgba(34, 28, 16, 0.72);
    --item-border: rgba(205, 164, 79, 0.28);
    --item-accent: rgba(243, 210, 129, 0.92);
    --item-container-padding: 6px;
    --item-counter-size: 28px;
    --item-counter-offset: 4px;
    --item-counter-translate-x: 50%;
    --item-counter-translate-y: -50%;
    --item-grid-gap: 0.22rem;
    --item-card-aspect: 1.21927;
    --item-card-height: var(--item-zone-card-height, calc(100cqh - (var(--item-container-padding) * 2)));
    --item-card-width: var(--item-zone-card-width, calc(var(--item-card-height) * var(--item-card-aspect)));
    --zone-card-height: var(--item-card-height);
    --zone-card-width: var(--item-card-width);

    container-type: size;

    position: relative;
    display: flex;
    align-items: stretch;
    box-sizing: border-box;
    padding: var(--item-zone-shell-padding, var(--item-container-padding));
    width: 100%;
    height: 100%;
    min-width: 70px;
    min-height: 0;
    background: linear-gradient(180deg, rgba(58, 44, 18, 0.78) 0%, rgba(28, 21, 10, 0.9) 100%);
    border: 1px solid var(--item-border);
    border-radius: 8px;
  }

  .item-zone--opponent {
    --item-bg: rgba(62, 28, 22, 0.72);
    --item-border: rgba(224, 141, 115, 0.24);
    --item-accent: rgba(249, 197, 170, 0.88);

    background: linear-gradient(180deg, rgba(74, 34, 27, 0.78) 0%, rgba(34, 16, 13, 0.9) 100%);
  }

  .item-zone--scrollable {
    --item-zone-shell-padding: var(--item-container-padding) 1.8rem;
  }

  .item-counter {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(var(--item-counter-translate-x), var(--item-counter-translate-y));
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--item-counter-size);
    height: var(--item-counter-size);
    border: 1px solid rgba(255, 234, 179, 0.3);
    border-radius: 999px;
    background: linear-gradient(135deg, rgba(107, 76, 18, 0.98) 0%, rgba(70, 50, 11, 0.98) 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    pointer-events: none;
  }

  .item-counter-value {
    color: #fff2d1;
    font-size: 0.7rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }

  .item-zone-cards {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    flex: 1 1 auto;
    min-height: 0;
    background: transparent;
    border: none;
    padding: 0;
    position: relative;
    overflow: hidden;
  }

  .item-cards {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    flex: 1 1 auto;
    min-width: 0;
    min-height: var(--item-card-height);
    align-items: center;
    justify-content: flex-start;
    gap: var(--item-grid-gap);
    width: 100%;
    height: auto;
    padding: 6px 0 0;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(243, 210, 129, 0.55) rgba(0, 0, 0, 0.18);
    scroll-padding-inline: 1.8rem;
    scroll-snap-type: x proximity;
  }

  .item-card {
    flex: 0 0 auto;
    width: var(--zone-card-width);
    height: var(--zone-card-height);
    transition: filter 150ms ease;
    overflow: visible;
    border-radius: 0.55rem;
    scroll-snap-align: start;
  }

  .item-card :global(a[data-slot="hover-card-trigger"]) {
    display: block;
    width: 100%;
    height: 100%;
  }

  .item-cards::-webkit-scrollbar {
    height: 8px;
  }

  .item-cards::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.18);
    border-radius: 999px;
  }

  .item-cards::-webkit-scrollbar-thumb {
    background: rgba(243, 210, 129, 0.55);
    border-radius: 999px;
  }

  .mobile-item-scroll-button {
    display: none;
  }

  .item-zone:not([data-layout-mode="mobile"]) .item-scroll-button--desktop {
    position: absolute;
    top: 50%;
    z-index: 12;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.6rem;
    height: 2.5rem;
    border: 1px solid rgba(243, 210, 129, 0.34);
    border-radius: 999px;
    background: rgba(23, 17, 8, 0.96);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.32);
    color: #fff1cf;
    transform: translateY(-50%);
    pointer-events: auto;
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, transform 150ms ease;
  }

  .item-zone:not([data-layout-mode="mobile"]) .item-scroll-button--desktop:hover:not(:disabled) {
    border-color: rgba(255, 230, 160, 0.78);
    background: rgba(64, 46, 12, 0.98);
  }

  .mobile-item-scroll-button:focus-visible {
    outline: 2px solid rgba(255, 230, 160, 0.96);
    outline-offset: 2px;
  }

  .item-zone:not([data-layout-mode="mobile"]) .mobile-item-scroll-button--left {
    left: 0.2rem;
  }

  .item-zone:not([data-layout-mode="mobile"]) .mobile-item-scroll-button--right {
    right: 0.2rem;
  }

  .item-scroll-button__count {
    position: absolute;
    right: -0.35rem;
    bottom: -0.25rem;
    display: grid;
    min-width: 1rem;
    height: 1rem;
    place-items: center;
    border: 1px solid rgba(255, 234, 179, 0.34);
    border-radius: 999px;
    background: rgba(73, 50, 12, 0.98);
    color: #fff6dd;
    font-size: 0.58rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }

  .mobile-item-scroll-button:disabled {
    opacity: 0.38;
    box-shadow: none;
  }

  @media (max-width: 900px) {
    .item-zone {
      --item-container-padding: 4px;
      --item-counter-size: 24px;
      --item-counter-offset: 3px;
      --item-grid-gap: 0.18rem;

      min-width: 60px;
    }

    .item-zone[data-layout-mode="mobile"] {
      --item-card-height: var(
        --item-zone-card-height,
        calc(100cqh - (var(--item-container-padding) * 2))
      );
      --item-card-width: var(
        --item-zone-card-width,
        calc(var(--item-card-height) * var(--item-card-aspect))
      );
      --item-zone-shell-padding: 0.1rem;
    }

    .item-zone[data-layout-mode="mobile"].item-zone--scrollable {
      --item-zone-shell-padding: 0.1rem 1.75rem;
    }

    .item-zone[data-layout-mode="mobile"] .item-zone-cards {
      overflow: visible;
      justify-content: flex-start;
    }

    .item-zone[data-layout-mode="mobile"] .item-cards {
      flex-direction: row;
      flex-wrap: nowrap;
      align-self: auto;
      align-items: flex-start;
      align-content: stretch;
      justify-content: flex-start;
      gap: 0.28rem;
      min-width: 0;
      min-height: var(--item-card-height);
      width: max-content;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-x: contain;
      padding: 6px 0.8rem 0;
      scrollbar-width: none;
    }

    .item-zone[data-layout-mode="mobile"] .item-cards::-webkit-scrollbar {
      display: none;
    }

    .item-zone[data-layout-mode="mobile"] .item-card {
      width: var(--zone-card-width);
      height: var(--zone-card-height);
      min-width: var(--zone-card-width);
      min-height: var(--zone-card-height);
      scroll-snap-align: center;
      touch-action: pan-x pinch-zoom;
    }

    .item-zone[data-layout-mode="mobile"] .mobile-item-scroll-button {
      position: absolute;
      top: 50%;
      z-index: 12;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.65rem;
      height: 2.8rem;
      border-radius: 999px;
      border: 1px solid rgba(243, 210, 129, 0.3);
      background:
        linear-gradient(180deg, rgba(55, 39, 13, 0.96), rgba(35, 24, 8, 0.94)),
        rgba(27, 20, 8, 0.92);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
      color: #fff1cf;
      transform: translateY(-50%);
      pointer-events: auto;
      touch-action: manipulation;
    }

    .item-zone[data-layout-mode="mobile"] .mobile-item-scroll-button--left {
      left: -0.05rem;
    }

    .item-zone[data-layout-mode="mobile"] .mobile-item-scroll-button--right {
      right: -0.05rem;
    }

    .item-counter {
      width: var(--item-counter-size);
      height: var(--item-counter-size);
    }

    .item-counter-value {
      font-size: 0.6rem;
    }
  }
</style>
