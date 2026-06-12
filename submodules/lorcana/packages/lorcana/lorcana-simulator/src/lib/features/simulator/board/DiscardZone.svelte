<script lang="ts">
  import { m } from "$lib/i18n/messages.js";
  import { cn } from "$lib/utils.js";
  import * as HoverCard from "$lib/design-system/primitives/hover-card/index.js";
  import type {LorcanaPlayerSide, LorcanaTableSeat} from "@/features/simulator/model/contracts.js";
  import {createCardAnchorId, createZoneAnchorId} from "@/features/simulator/animations/board-move-animations.js";
  import {useLorcanaBoardPresenter} from "@/features/simulator/context/game-context.svelte.js";
  import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
  import {ZONE_IMAGE_FORMATS} from "@/design-system/simulator/cards/card-image-format.js";
  import ZoneCounter from "@/design-system/simulator/display/ZoneCounter.svelte";
  import { Trash2 } from "lucide-svelte";

  interface DiscardZoneProps {
    isOpponent: boolean;
    playerSide: LorcanaPlayerSide;
    seat: LorcanaTableSeat;
    onClick?: () => void;
  }

  let { isOpponent, playerSide, seat, onClick }: DiscardZoneProps = $props();

  const board = useLorcanaBoardPresenter();
  const inFlightCardIds = $derived(board.inFlightCardIds);
  const cards = $derived(board.getZoneCards(playerSide, "discard").filter((card) => !inFlightCardIds.has(card.cardId)));
  const isMasked = $derived(board.isZoneMasked(playerSide, "discard"));
  const showZoneCounters = $derived(board.showZoneCounters);
  const topCard = $derived(cards.length > 0 ? cards[cards.length - 1] : null);
  const recentCards = $derived(cards.slice(-5).toReversed());
</script>

<HoverCard.Root openDelay={300}>
<HoverCard.Trigger class="discard-zone-trigger w-full">
<button
  type="button"
  class={cn(
    "discard-zone",
    "flex h-full w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-lg p-2 transition-all duration-150",
    "border-2",
    "cursor-pointer",
    isOpponent ? "bg-zone-opponent-bg border-zone-opponent-border" : "bg-zone-bg border-zone-border",
    !topCard && "bg-zone-bg/40 border-zone-border/50",
    topCard && "hover:-translate-y-0.5 hover:shadow-lg",
  )}
  style="width: 100%; height: 100%; min-width: var(--zone-card-width, 50px); min-height: var(--zone-card-height, 70px);"
  data-player-seat={seat}
  data-zone-id="discard"
  data-board-anchor-id={createZoneAnchorId(playerSide, "discard")}
  aria-label={m["sim.discard.aria"]({ count: cards.length })}
  onclick={onClick}
>
  {#if topCard}
    {#if showZoneCounters}
      <ZoneCounter
        count={cards.length || 0}
        corner={seat === "bottom" ? "bottom-right" : "top-right"}
        ariaLabel={`${cards.length || 0} cards in discard`}
      />
    {/if}
    {#if !showZoneCounters && cards.length > 0}
      <span class="discard-inline-count">{cards.length}</span>
    {/if}
    <div class="discard-stack-wrapper">
      {#if cards.length > 2}
        <div class="discard-stack-card discard-stack-card--back2"></div>
      {/if}
      {#if cards.length > 1}
        <div class="discard-stack-card discard-stack-card--back1"></div>
      {/if}
      <div
        class="discard-stack-card discard-stack-card--top"
        data-card-id={topCard.cardId}
        data-player-seat={seat}
        data-player-id={topCard.ownerId}
        data-zone-id={topCard.zoneId}
        data-board-anchor-id={createCardAnchorId(playerSide, "discard", topCard.cardId)}
      >
        <LorcanaCard
          card={topCard}
          useContainerSize
          imageFormat={ZONE_IMAGE_FORMATS.discard}
          isMasked={isMasked}
        />
      </div>
    </div>


  {:else}
    <div
      class={cn(
        "flex h-full w-full items-center justify-center rounded-[inherit] border border-dashed",
        "bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.12),_transparent_68%)]",
        isOpponent
          ? "border-sky-300/20 text-sky-100/45"
          : "border-sky-400/30 text-sky-200/55",
      )}
    >
      <Trash2 />
    </div>
  {/if}

</button>
</HoverCard.Trigger>
{#if recentCards.length > 0}
  <HoverCard.Content side="top" sideOffset={8} class="w-auto p-0 border-slate-700/80 bg-slate-900/95 backdrop-blur-sm">
    <button type="button" class="block cursor-pointer border-0 bg-transparent p-0 text-left" onclick={onClick}>
      <div class="flex gap-1.5 p-2" style="--zone-card-width: 80px; --zone-card-height: 112px;">
        {#each recentCards as card (card.cardId)}
          <div style="width: 80px; height: 112px;">
            <LorcanaCard card={card} useContainerSize showHoverCard={false} />
          </div>
        {/each}
      </div>
      {#if cards.length > 5}
        <div class="text-xs text-slate-400 text-center pb-1.5">
          +{cards.length - 5} more — click to see all
        </div>
      {/if}
    </button>
  </HoverCard.Content>
{/if}
</HoverCard.Root>

<style>
  .discard-zone-trigger {
    display: flex;
    width: 100%;
    height: 100%;
  }

  .discard-zone {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .discard-stack-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .discard-stack-card {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }

  .discard-stack-card--back2 {
    transform: translate(-4px, -4px) rotate(-3deg);
    background: rgba(15, 25, 45, 0.7);
    border: 1px solid rgba(100, 150, 200, 0.2);
  }

  .discard-stack-card--back1 {
    transform: translate(-2px, -2px) rotate(-1.5deg);
    background: rgba(15, 25, 45, 0.8);
    border: 1px solid rgba(100, 150, 200, 0.25);
  }

  .discard-stack-card--top {
    position: relative;
    transform: none;
  }

  .discard-zone:focus-visible {
    outline: 2px solid rgba(125, 211, 252, 0.8);
    outline-offset: 2px;
  }

  .discard-hint {
    position: absolute;
    bottom: 0.2rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.56rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0;
    transition: opacity 180ms ease;
    color: rgba(226, 232, 240, 0.9);
    pointer-events: none;
  }

  /* Inline discard count (counters OFF, hover only) */
  .discard-inline-count {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    color: #e2e8f0;
    background: rgba(15, 23, 42, 0.88);
    border: 1px solid rgba(148, 163, 184, 0.3);
    border-radius: 999px;
    padding: 0 6px;
    pointer-events: none;
    z-index: 5;
    line-height: 1;
    user-select: none;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 150ms ease;
  }

  .discard-zone:hover .discard-inline-count {
    opacity: 1;
  }

  .discard-count {
    position: absolute;
    top: -0.25rem;
    right: -0.25rem;
    background: rgba(8, 145, 178, 0.95);
    color: #ecfeff;
    border: 1px solid rgba(125, 211, 252, 0.75);
    border-radius: 999px;
    width: 1.2rem;
    height: 1.2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.58rem;
    font-weight: 700;
    box-shadow: 0 0 0 1px rgba(8, 47, 73, 0.7);
  }
</style>
