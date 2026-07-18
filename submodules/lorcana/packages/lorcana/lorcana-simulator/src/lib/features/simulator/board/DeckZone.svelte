<script lang="ts">
  import XIcon from "@lucide/svelte/icons/x";
  import type { LorcanaPlayerSide, LorcanaTableSeat } from "@/features/simulator/model/contracts.js";
  import { cn } from "$lib/utils.js";
  import { DeckStack } from "@/design-system/simulator/cards/index.js";
  import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
  import { createZoneAnchorId } from "@/features/simulator/animations/board-move-animations.js";
  import { useLorcanaBoardPresenter } from "@/features/simulator/context/game-context.svelte.js";
  import {
    dismissDeckReveal,
    isDeckRevealDismissed,
    type DeckRevealDismissals,
  } from "@/features/simulator/board/deck-reveal-dismissal.js";
  import { getDeckRevealPresentation } from "@/features/simulator/board/deck-reveal-presentation.js";

  interface DeckZoneProps {
    isOpponent: boolean;
    playerSide: LorcanaPlayerSide;
    seat: LorcanaTableSeat;
  }

  let { isOpponent, playerSide, seat }: DeckZoneProps = $props();

  const board = useLorcanaBoardPresenter();
  const showZoneCounters = $derived(board.showZoneCounters);
  const count = $derived(board.getDeckCount(playerSide));
  const ownerId = $derived(board.getOwnerIdForSide(playerSide));
  const revealedDeckTopCard = $derived(board.getRevealedDeckTopCard(playerSide));
  const revealedDeckBottomCard = $derived(board.getRevealedDeckBottomCard(playerSide));
  let dismissedReveals = $state<DeckRevealDismissals>({});
  const showRevealedDeckTopCard = $derived(
    !!revealedDeckTopCard && !isDeckRevealDismissed(dismissedReveals, "top", revealedDeckTopCard.cardId),
  );
  const showRevealedDeckBottomCard = $derived(
    !!revealedDeckBottomCard && !isDeckRevealDismissed(dismissedReveals, "bottom", revealedDeckBottomCard.cardId),
  );
  const hasAnyReveal = $derived(showRevealedDeckTopCard || showRevealedDeckBottomCard);
  const topRevealPresentation = getDeckRevealPresentation("top");
  const bottomRevealPresentation = getDeckRevealPresentation("bottom");

  function dismissReveal(position: "top" | "bottom", cardId: string): void {
    dismissedReveals = dismissDeckReveal(dismissedReveals, position, cardId);
  }
</script>

<div
  class={cn(
    "relative flex flex-col items-center gap-1 p-2 rounded-lg cursor-default",
    "border-2",
    isOpponent ? "bg-zone-opponent-bg border-zone-opponent-border" : "bg-zone-bg border-zone-border",
  )}
  style="min-width: calc(var(--zone-card-width, 50px) + 1rem); min-height: calc(var(--zone-card-height, 70px) + 1rem);"
  data-player-seat={seat}
  data-zone-id="deck"
  data-board-anchor-id={createZoneAnchorId(playerSide, "deck")}
>
  <DeckStack {count} {ownerId} {seat} showCount={showZoneCounters} />
  {#if hasAnyReveal}
    <div class="deck-reveal-statuses">
      {#if showRevealedDeckTopCard && revealedDeckTopCard}
        <div class="deck-reveal-status deck-reveal-status--top">
          <div class="deck-reveal-status__thumbnail">
            <LorcanaCard card={revealedDeckTopCard} useContainerSize />
          </div>
          <span class="deck-reveal-status__copy">
            <strong>{topRevealPresentation.label}</strong>
            <span>{topRevealPresentation.description}</span>
          </span>
          <button
            type="button"
            class="deck-reveal-status__dismiss"
            aria-label={topRevealPresentation.dismissLabel}
            onclick={(event) => {
              event.stopPropagation();
              dismissReveal("top", revealedDeckTopCard.cardId);
            }}
          >
            <XIcon class="size-3.5" />
          </button>
        </div>
      {/if}
      {#if showRevealedDeckBottomCard && revealedDeckBottomCard}
        <div class="deck-reveal-status deck-reveal-status--bottom">
          <div class="deck-reveal-status__thumbnail">
            <LorcanaCard card={revealedDeckBottomCard} useContainerSize />
          </div>
          <span class="deck-reveal-status__copy">
            <strong>{bottomRevealPresentation.label}</strong>
            <span>{bottomRevealPresentation.description}</span>
          </span>
          <button
            type="button"
            class="deck-reveal-status__dismiss"
            aria-label={bottomRevealPresentation.dismissLabel}
            onclick={(event) => {
              event.stopPropagation();
              dismissReveal("bottom", revealedDeckBottomCard.cardId);
            }}
          >
            <XIcon class="size-3.5" />
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .deck-reveal-statuses {
    position: absolute;
    right: 0;
    bottom: calc(100% + 0.35rem);
    z-index: 20;
    display: grid;
    width: max-content;
    max-width: min(16rem, 45vw);
    gap: 0.3rem;
    pointer-events: auto;
  }

  .deck-reveal-status {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    min-width: 11.5rem;
    padding: 0.32rem;
    border: 1px solid rgba(191, 219, 254, 0.32);
    border-radius: 0.55rem;
    background: rgba(7, 18, 31, 0.96);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    animation: revealed-card-enter 180ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .deck-reveal-status--top { border-color: rgba(251, 191, 36, 0.58); }
  .deck-reveal-status--bottom { border-color: rgba(165, 180, 252, 0.58); }

  .deck-reveal-status__thumbnail {
    width: 2rem;
    height: 2.75rem;
    flex: 0 0 auto;
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.24);
  }

  .deck-reveal-status__copy {
    display: grid;
    min-width: 0;
    flex: 1 1 auto;
    gap: 0.12rem;
    color: rgba(226, 232, 240, 0.8);
    font-size: 0.62rem;
    line-height: 1.15;
  }

  .deck-reveal-status__copy strong {
    color: rgba(248, 250, 252, 0.98);
    font-size: 0.68rem;
  }

  .deck-reveal-status__dismiss {
    display: inline-grid;
    width: 1.5rem;
    height: 1.5rem;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid rgba(191, 219, 254, 0.28);
    border-radius: 0.35rem;
    background: rgba(15, 23, 42, 0.8);
    color: rgba(241, 245, 249, 0.92);
    cursor: pointer;
  }

  .deck-reveal-status__dismiss:hover,
  .deck-reveal-status__dismiss:focus-visible {
    border-color: rgba(226, 232, 240, 0.7);
    background: rgba(30, 41, 59, 0.95);
  }

  .deck-reveal-status__dismiss:focus-visible {
    outline: 2px solid rgba(191, 219, 254, 0.92);
    outline-offset: 2px;
  }

  @keyframes revealed-card-enter {
    from { opacity: 0; transform: translateY(6px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    .deck-reveal-status { animation: none; }
  }
</style>
