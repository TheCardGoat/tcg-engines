<script lang="ts">
    import type {LorcanaCardSnapshot, LorcanaPlayerSide, LorcanaZoneId} from "@/features/simulator/model/contracts.js";
    import HandFan from "./HandFan.svelte";
    import PlayArea from "./PlayArea.svelte";
    import ZoneGroup from "./ZoneGroup.svelte";

  type DropState = "none" | "valid" | "invalid";

  interface PlayerBoardProps {
    playerSide: LorcanaPlayerSide;
    ownerId?: string | null;
    handCards: LorcanaCardSnapshot[];
    handCount?: number;
    playCards: LorcanaCardSnapshot[];
    inkwellCards: LorcanaCardSnapshot[];
    inkwellCount?: number;
    discardCards: LorcanaCardSnapshot[];
    deckCount: number;
    isOpponent?: boolean;
    isHandMasked?: boolean;
    isPlayMasked?: boolean;
    selectedCardId?: string | null;
    playableCardIds?: string[];
    validTargetCardIds?: string[];
    invalidTargetCardIds?: string[];
    challengeMode?: boolean;
    playAreaDropState?: DropState;
    inkwellDropState?: DropState;
    onCardDragStart?: (cardId: string, event: DragEvent) => void;
    showZoneCounters?: boolean;
    onDeckClick?: () => void;
    onDiscardClick?: () => void;
    onPlayAreaEnter?: () => void;
    onPlayAreaLeave?: () => void;
    onInkwellEnter?: () => void;
    onInkwellLeave?: () => void;
  }

  let {
    playerSide,
    ownerId = null,
    handCards,
    handCount = handCards.length,
    playCards,
    inkwellCards,
    inkwellCount = inkwellCards.length,
    discardCards,
    deckCount,
    isOpponent = false,
    isHandMasked = false,
    isPlayMasked = false,
    selectedCardId = null,
    playableCardIds = [],
    validTargetCardIds = [],
    invalidTargetCardIds = [],
    challengeMode = false,
    playAreaDropState = "none",
    inkwellDropState = "none",
    showZoneCounters = false,
    onCardDragStart,
    onDeckClick,
    onDiscardClick,
    onPlayAreaEnter,
    onPlayAreaLeave,
    onInkwellEnter,
    onInkwellLeave,
  }: PlayerBoardProps = $props();
</script>

<div class="player-board" class:player-board--opponent={isOpponent}>
  <div class="hand-overlay">
    <HandFan
      cards={handCards}
      totalCards={handCount}
      isMasked={isHandMasked}
      isOpponent={isOpponent}
      {ownerId}
      {selectedCardId}
      {playableCardIds}
      onCardDragStart={onCardDragStart}
    />
  </div>

  <div class="board-content">
    <ZoneGroup
      {deckCount}
      {discardCards}
      {inkwellCards}
      {inkwellCount}
      {ownerId}
      {isOpponent}
      {showZoneCounters}
      isMasked={isHandMasked}
      onDeckClick={onDeckClick}
      onDiscardClick={onDiscardClick}
    />

    <PlayArea
      cards={playCards}
      zoneId="play"
      {playerSide}
      isMasked={isPlayMasked}
      {isOpponent}
      {selectedCardId}
      {playableCardIds}
      {validTargetCardIds}
      {invalidTargetCardIds}
      {challengeMode}
      dropState={playAreaDropState}
      onCardDragStart={onCardDragStart}
      onDropZoneEnter={onPlayAreaEnter}
      onDropZoneLeave={onPlayAreaLeave}
    />
  </div>
</div>

<style>
  .player-board {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .player-board--opponent {
    flex-direction: column-reverse;
  }

  .hand-overlay {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    pointer-events: none;
    z-index: 20;
  }

  .player-board:not(.player-board--opponent) .hand-overlay {
    bottom: -2rem;
  }

  .player-board--opponent .hand-overlay {
    top: -5.5rem;
  }

  .hand-overlay :global(.hand-fan) {
    pointer-events: auto;
  }

  .board-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 3rem 0.5rem 0.5rem;
    min-height: 0;
  }

  .player-board--opponent .board-content {
    padding: 0.5rem 0.5rem 3rem;
  }

  @media (max-width: 900px) {
    .hand-overlay {
      display: none;
    }

    .board-content,
    .player-board--opponent .board-content {
      padding: 0.5rem;
    }
  }
</style>
