<script lang="ts">
    import type {LorcanaPlayerSide, LorcanaTableSeat} from "@/features/simulator/model/contracts.js";
  import { cn } from "$lib/utils.js";
    import {DeckStack} from "@/design-system/simulator/cards/index.js";
  import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
    import {createZoneAnchorId} from "@/features/simulator/animations/board-move-animations.js";
    import {useLorcanaBoardPresenter} from "@/features/simulator/context/game-context.svelte.js";

  interface DeckZoneProps {
    isOpponent: boolean;
    playerSide: LorcanaPlayerSide;
    seat: LorcanaTableSeat;
    onClick?: () => void;
  }

  let { isOpponent, playerSide, seat, onClick }: DeckZoneProps = $props();

  const board = useLorcanaBoardPresenter();
  const showZoneCounters = $derived(board.showZoneCounters);
  const count = $derived(board.getDeckCount(playerSide));
  const ownerId = $derived(board.getOwnerIdForSide(playerSide));
  const revealedDeckTopCard = $derived(board.getRevealedDeckTopCard(playerSide));
  const revealedDeckBottomCard = $derived(board.getRevealedDeckBottomCard(playerSide));
  const hasAnyReveal = $derived(!!revealedDeckTopCard || !!revealedDeckBottomCard);
</script>

<button
  type="button"
  class={cn(
    "relative flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer transition-all duration-150",
    "border-2",
    isOpponent
      ? "bg-zone-opponent-bg border-zone-opponent-border"
      : "bg-zone-bg border-zone-border",
    "hover:-translate-y-0.5 hover:shadow-lg"
  )}
  style="min-width: calc(var(--zone-card-width, 50px) + 1rem); min-height: calc(var(--zone-card-height, 70px) + 1rem);"
  data-player-seat={seat}
  data-zone-id="deck"
  data-board-anchor-id={createZoneAnchorId(playerSide, "deck")}
  onclick={onClick}
>
  <DeckStack {count} {ownerId} {seat} showCount={showZoneCounters} />
  {#if hasAnyReveal}
    <div class="revealed-deck-cards">
      {#if revealedDeckTopCard}
        <div class="revealed-card revealed-card--top">
          <div class="revealed-card__frame revealed-card__frame--top">
            <LorcanaCard card={revealedDeckTopCard} useContainerSize />
          </div>
          <span class="revealed-card__label revealed-card__label--top">Top</span>
        </div>
      {/if}
      {#if revealedDeckBottomCard}
        <div class="revealed-card revealed-card--bottom">
          <div class="revealed-card__frame revealed-card__frame--bottom">
            <LorcanaCard card={revealedDeckBottomCard} useContainerSize />
          </div>
          <span class="revealed-card__label revealed-card__label--bottom">Bottom</span>
        </div>
      {/if}
    </div>
  {/if}
</button>

<style>
  .revealed-deck-cards {
    position: absolute;
    right: calc(100% + 0.4rem);
    top: 50%;
    transform: translateY(-50%);
    width: var(--zone-card-width, 50px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    z-index: 10;
    pointer-events: none;
  }

  .revealed-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    animation: revealed-card-enter 220ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .revealed-card__frame {
    width: var(--zone-card-width, 50px);
    height: var(--zone-card-height, 70px);
    border-radius: 4px;
    overflow: hidden;
  }

  .revealed-card__frame--top {
    box-shadow:
      0 0 0 2px rgba(251, 191, 36, 0.85),
      0 0 14px rgba(251, 191, 36, 0.4),
      0 4px 12px rgba(0, 0, 0, 0.5);
  }

  .revealed-card__frame--bottom {
    box-shadow:
      0 0 0 2px rgba(99, 102, 241, 0.85),
      0 0 14px rgba(99, 102, 241, 0.45),
      0 4px 12px rgba(0, 0, 0, 0.5);
  }

  .revealed-card__label {
    font-size: clamp(0.56rem, 1.45vw, 0.62rem);
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.1rem 0.35rem;
    border-radius: 999px;
    white-space: nowrap;
  }

  .revealed-card__label--top {
    color: rgba(251, 191, 36, 0.95);
    background: rgba(0, 0, 0, 0.75);
    border: 1px solid rgba(251, 191, 36, 0.45);
  }

  .revealed-card__label--bottom {
    color: rgba(165, 180, 252, 0.95);
    background: rgba(0, 0, 0, 0.75);
    border: 1px solid rgba(99, 102, 241, 0.45);
  }

  @keyframes revealed-card-enter {
    from {
      opacity: 0;
      transform: translateX(10px) scale(0.92);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .revealed-card {
      animation: none;
    }
  }
</style>
