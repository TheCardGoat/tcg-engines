<script lang="ts">
    import type {LorcanaCardSnapshot} from "@/features/simulator/model/contracts.js";
    import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";

  interface HandFanProps {
    cards: LorcanaCardSnapshot[];
    totalCards?: number;
    isMasked?: boolean;
    isOpponent?: boolean;
    ownerId?: string | null;
    selectedCardId?: string | null;
    playableCardIds?: string[];
    onCardDragStart?: (cardId: string, event: DragEvent) => void;
  }

  let {
    cards,
    totalCards,
    isMasked = false,
    isOpponent = false,
    ownerId = null,
    selectedCardId = null,
    playableCardIds = [],
    onCardDragStart,
  }: HandFanProps = $props();

  const MAX_VISIBLE_HIDDEN_CARDS = 10;
  const effectiveTotal = $derived(Math.max(totalCards ?? cards.length, cards.length));
  const hiddenPlaceholderCount = $derived(
    cards.length === 0 ? Math.min(effectiveTotal, MAX_VISIBLE_HIDDEN_CARDS) : 0,
  );
  const hiddenOverflowCount = $derived(Math.max(0, effectiveTotal - hiddenPlaceholderCount));

  // Calculate fan rotation for each card
  function getFanRotation(index: number, total: number): number {
    if (total <= 1) return 0;
    const maxSpread = isOpponent ? 15 : 10;
    const step = maxSpread / (total - 1);
    return -maxSpread / 2 + step * index;
  }

  function isPlayable(card: LorcanaCardSnapshot): boolean {
    if (isOpponent || isMasked) return false;
    return playableCardIds.includes(card.cardId);
  }

</script>

<div class="hand-fan" class:hand-fan--opponent={isOpponent}>
  <div class="hand-container">
    {#if cards.length > 0}
      {#each cards as card, index (card.cardId)}
        {@const rotation = getFanRotation(index, cards.length)}
        {@const playable = isPlayable(card)}
        <div
          class="hand-card"
          class:hand-card--playable={playable}
          style:--rotation="{rotation}deg"
        >
          <LorcanaCard
            {card}
            {isMasked}
            size={isOpponent ? "small" : "medium"}
            isSelected={selectedCardId === card.cardId}
            isDraggable={!isOpponent && !isMasked}
            isPlayable={playable}
            isExerted={card.readyState === "exerted"}
            isDrying={card.isDrying ?? false}
            damage={card.damage ?? 0}
            onDragStart={(e) => onCardDragStart?.(card.cardId, e)}
          />
        </div>
      {/each}
    {:else if hiddenPlaceholderCount > 0}
      {#each Array.from({ length: hiddenPlaceholderCount }) as _, index (`legacy-hidden-${index}`)}
        {@const rotation = getFanRotation(index, hiddenPlaceholderCount)}
        <div class="hand-card hand-card--placeholder" style:--rotation="{rotation}deg" aria-hidden="true">
          <LorcanaCard isMasked size={isOpponent ? "small" : "medium"} {ownerId} />
        </div>
      {/each}
      {#if hiddenOverflowCount > 0}
        <div class="hand-overflow-badge">+{hiddenOverflowCount}</div>
      {/if}
    {:else}
      <div class="empty-hand">
        <span>0 cards</span>
      </div>
    {/if}
  </div>

  <div class="hand-info">
    <span class="card-count">{effectiveTotal} cards</span>
  </div>
</div>

<style>
  .hand-fan {
    --hand-bg: rgba(15, 30, 50, 0.3);
    --hand-container-height: 140px;
    --hand-container-padding: 2rem;
    --hand-container-offset: -95px;
    --hand-card-overlap: -1.25rem;
    --hand-card-overlap-hover: 0.25rem;
    --hover-scale: 1.35;
    --neighbor-scale: 1.1;
    --hover-translate-y: -10px;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
    pointer-events: none;
  }

  .hand-container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: var(--hand-container-height);
    position: relative;
    padding: 0 var(--hand-container-padding);
    margin-bottom: var(--hand-container-offset);
    pointer-events: auto;
  }

  .hand-fan--opponent .hand-container {
    align-items: flex-start;
    margin-bottom: 0;
    margin-top: var(--hand-container-offset);
  }

  .hand-card {
    --rotation: 0deg;
    --base-scale: 1;

    flex-shrink: 0;
    transform-origin: bottom center;
    transform: rotate(var(--rotation)) scale(var(--base-scale));
    transition:
      transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
      margin 250ms ease-out,
      filter 200ms ease;
    margin: 0 var(--hand-card-overlap);
    position: relative;
    cursor: pointer;
    pointer-events: auto;
  }

  .hand-card--placeholder {
    cursor: default;
    pointer-events: none;
  }

  .hand-card--placeholder:hover {
    transform: rotate(var(--rotation)) scale(var(--base-scale));
    margin: 0 var(--hand-card-overlap);
    filter: none;
  }

  .hand-card:hover {
    transform: rotate(0deg) scale(var(--hover-scale)) translateY(var(--hover-translate-y));
    z-index: 100;
    margin: 0 var(--hand-card-overlap-hover);
    filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.5));
  }

  .hand-fan--opponent .hand-card:hover {
    transform: rotate(0deg) scale(var(--hover-scale)) translateY(calc(var(--hover-translate-y) * -1));
    filter: drop-shadow(0 -20px 30px rgba(0, 0, 0, 0.5));
  }

  .hand-fan:has(.hand-card:hover) .hand-card:not(:hover) {
    opacity: 0.85;
    filter: brightness(0.9);
  }

  .empty-hand {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    color: rgba(150, 180, 210, 0.5);
    font-size: 0.75rem;
  }

  .hand-overflow-badge {
    align-self: center;
    margin-left: 0.35rem;
    font-size: 0.68rem;
    font-weight: 700;
    color: rgba(220, 230, 244, 0.95);
    background: rgba(7, 18, 31, 0.84);
    border: 1px solid rgba(112, 153, 204, 0.42);
    border-radius: 999px;
    padding: 0.12rem 0.4rem;
    pointer-events: none;
  }

  .hand-info {
    pointer-events: auto;
  }

  .card-count {
    font-size: 0.65rem;
    color: rgba(150, 180, 210, 0.7);
    background: rgba(0, 0, 0, 0.4);
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    border: 1px solid rgba(100, 150, 200, 0.1);
  }

  @media (max-width: 1100px) {
    .hand-fan {
      --hand-card-overlap: -1rem;
      --hand-card-overlap-hover: 0.15rem;
      --hover-scale: 1.25;
      --hover-translate-y: -8px;
      --neighbor-scale: 1.05;
    }
  }

  @media (max-width: 900px) {
    .hand-fan {
      --hand-container-height: 110px;
      --hand-container-padding: 1rem;
      --hand-container-offset: -78px;
      --hand-card-overlap: -0.75rem;
      --hand-card-overlap-hover: 0.1rem;
      --hover-scale: 1.2;
      --hover-translate-y: -6px;
      --neighbor-scale: 1.03;
    }
  }

  @media (max-width: 600px) {
    .hand-fan {
      --hand-container-height: 95px;
      --hand-container-padding: 0.5rem;
      --hand-container-offset: -65px;
      --hand-card-overlap: -0.5rem;
      --hand-card-overlap-hover: 0;
      --hover-scale: 1.15;
      --hover-translate-y: -5px;
      --neighbor-scale: 1.02;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hand-card {
      transition: none;
    }
  }
</style>
