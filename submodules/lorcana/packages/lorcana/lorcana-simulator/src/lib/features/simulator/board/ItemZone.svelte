<script lang="ts">
import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
import type {
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

let itemContainerEl = $state<HTMLDivElement | null>(null);
let hiddenItemsToLeft = $state(0);
let hiddenItemsToRight = $state(0);
const showMobileItemControls = $derived(
	layoutMode === "mobile" && items.length > 0,
);

function getScrollableItemCards(): HTMLElement[] {
	if (!itemContainerEl) {
		return [];
	}

	return Array.from(
		itemContainerEl.querySelectorAll<HTMLElement>(".item-card"),
	);
}

function updateHiddenItems(): void {
	if (layoutMode !== "mobile" || !itemContainerEl) {
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

$effect(() => {
	if (layoutMode !== "mobile" || !itemContainerEl) {
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
	data-layout-mode={layoutMode}
	data-player-seat={seat}
	data-player-side={playerSide}
>
  {#if showZoneCounters}
  <div class="item-counter">
    <span class="item-counter-value">{items.length}</span>
  </div>
  {/if}

  <div class="item-zone-cards">
    <div class="item-cards" bind:this={itemContainerEl}>
      {#each items as card (card.cardId)}
        {@const actionState = sidebar.getActionSessionCardState(card.cardId)}
        <div class="item-card">
          <LorcanaCard
            {card}
            useContainerSize
            imageFormat="art_only"
            hoverShowActions
            isMasked={false}
            isSelected={
              actionState.isSelected ||
              simulatorCardContext.previewCard?.cardId === card.cardId
            }
            isPlayable={actionState.isSelectable}
            isValidTarget={actionState.isSelectable}
            isInvalidTarget={actionState.isInvalidTarget}
            isExerted={card.readyState === "exerted"}
            damage={card.damage ?? 0}
          />
        </div>
      {/each}
    </div>
  </div>

  {#if showMobileItemControls && hiddenItemsToLeft > 0}
    <button
      type="button"
      class="mobile-item-scroll-button mobile-item-scroll-button--left"
      aria-label="Scroll items left"
      data-testid={`item-scroll-left-${playerSide}`}
      onclick={() => {
        scrollItems("left");
      }}
    >
      <ChevronLeftIcon class="size-4" />
    </button>
  {/if}

  {#if showMobileItemControls && hiddenItemsToRight > 0}
    <button
      type="button"
      class="mobile-item-scroll-button mobile-item-scroll-button--right"
      aria-label="Scroll items right"
      data-testid={`item-scroll-right-${playerSide}`}
      onclick={() => {
        scrollItems("right");
      }}
    >
      <ChevronRightIcon class="size-4" />
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
    padding: var(--item-container-padding);
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
    justify-content: flex-end;
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
    flex-wrap: wrap;
    flex-direction: row;
    flex: 1 1 auto;
    min-width: 100%;
    min-height: var(--item-card-height);
    align-items: center;
    justify-content: flex-end;
    gap: var(--item-grid-gap);
    width: max-content;
    height: auto;
    padding: 6px 0 0;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(243, 210, 129, 0.55) rgba(0, 0, 0, 0.18);
  }

  .item-card {
    flex: 0 0 auto;
    width: var(--zone-card-width);
    height: var(--zone-card-height);
    transition: filter 150ms ease;
    overflow: visible;
    border-radius: 0.55rem;
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
      padding-inline: 0.1rem;
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
      scroll-snap-type: x proximity;
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
