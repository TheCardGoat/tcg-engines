<script lang="ts">
    import type {LorcanaCardSnapshot} from "@/features/simulator/model/contracts.js";
    import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
    import EmptyState from "@/design-system/simulator/display/EmptyState.svelte";

  interface CardGridProps {
    cards: LorcanaCardSnapshot[];
    isMasked?: boolean;
    isOpponent?: boolean;
    selectedCardId?: string | null;
    playableCardIds?: string[];
    invalidTargetCardIds?: string[];
    validTargetCardIds?: string[];
    challengeMode?: boolean;
    onCardDragStart?: (cardId: string, event: DragEvent) => void;
  }

  let {
    cards,
    isMasked = false,
    isOpponent = false,
    selectedCardId = null,
    playableCardIds = [],
    invalidTargetCardIds = [],
    validTargetCardIds = [],
    challengeMode = false,
    onCardDragStart,
  }: CardGridProps = $props();

  function isCardPlayable(card: LorcanaCardSnapshot): boolean {
    if (isOpponent || isMasked) return false;
    return playableCardIds.includes(card.cardId);
  }

  function isCardValidTarget(card: LorcanaCardSnapshot): boolean {
    return challengeMode && validTargetCardIds.includes(card.cardId);
  }

  function isCardInvalidTarget(card: LorcanaCardSnapshot): boolean {
    return challengeMode && invalidTargetCardIds.includes(card.cardId);
  }
</script>

<div class="card-grid">
  {#if cards.length === 0}
    <EmptyState label="Empty" />
  {:else}
    <div class="cards-container">
      {#each cards as card (card.cardId)}
        <div class="card-wrapper">
          <LorcanaCard
            {card}
            {isMasked}
            size="medium"
            imageFormat="art_only"
            isSelected={selectedCardId === card.cardId}
            isExerted={card.readyState === "exerted"}
            isDraggable={!isOpponent && !isMasked}
            isPlayable={isCardPlayable(card)}
            isValidTarget={isCardValidTarget(card)}
            isInvalidTarget={isCardInvalidTarget(card)}
            isQuesting={false}
            isDrying={card.isDrying ?? false}
            damage={card.damage ?? 0}
            onDragStart={(e) => onCardDragStart?.(card.cardId, e)}
          />
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .card-grid {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
  }

  .card-wrapper {
    transition: transform 150ms ease;
  }

  .card-wrapper:hover {
    transform: translateY(-4px);
    z-index: 10;
  }
</style>
