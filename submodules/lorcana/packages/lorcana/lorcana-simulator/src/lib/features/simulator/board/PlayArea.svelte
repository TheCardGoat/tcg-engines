<script lang="ts">
    import type {LorcanaCardSnapshot, LorcanaZoneId} from "@/features/simulator/model/contracts.js";
  import CardGrid from "./CardGrid.svelte";
    import DropIndicator from "@/design-system/simulator/display/DropIndicator.svelte";
    import ZoneLabel from "@/design-system/simulator/display/ZoneLabel.svelte";

  type DropState = "none" | "preview" | "valid" | "invalid";

  interface PlayAreaProps {
    cards: LorcanaCardSnapshot[];
    zoneId: LorcanaZoneId;
    playerSide: "playerOne" | "playerTwo";
    isMasked?: boolean;
    isOpponent?: boolean;
    selectedCardId?: string | null;
    playableCardIds?: string[];
    validTargetCardIds?: string[];
    invalidTargetCardIds?: string[];
    challengeMode?: boolean;
    dropState?: DropState;
    label?: string;
    showZoneCounters?: boolean;
    onCardDragStart?: (cardId: string, event: DragEvent) => void;
    onDropZoneEnter?: () => void;
    onDropZoneLeave?: () => void;
  }

  let {
    cards,
    zoneId,
    playerSide,
    isMasked = false,
    isOpponent = false,
    selectedCardId = null,
    playableCardIds = [],
    validTargetCardIds = [],
    invalidTargetCardIds = [],
    challengeMode = false,
    dropState = "none",
    label = "",
    showZoneCounters = false,
    onCardDragStart,
    onDropZoneEnter,
    onDropZoneLeave,
  }: PlayAreaProps = $props();
</script>

<div
  class="play-area"
  class:play-area--opponent={isOpponent}
  class:play-area--drop-preview={dropState === "preview"}
  class:play-area--drop-valid={dropState === "valid"}
  class:play-area--drop-invalid={dropState === "invalid"}
  class:play-area--challenge-mode={challengeMode && isOpponent}
  role="region"
  aria-label="{label} for {playerSide}"
  onmouseenter={onDropZoneEnter}
  onmouseleave={onDropZoneLeave}
>
  {#if label}
    <ZoneLabel {label} count={showZoneCounters ? cards.length : undefined} />
  {/if}

  {#if challengeMode && isOpponent}
    <div class="challenge-banner">Select a target</div>
  {/if}

  <div class="play-area-content">
    <CardGrid
      {cards}
      {isMasked}
      {isOpponent}
      {selectedCardId}
      {playableCardIds}
      {validTargetCardIds}
      {invalidTargetCardIds}
      {challengeMode}
      onCardDragStart={onCardDragStart}
    />
  </div>

  {#if dropState === "valid" || dropState === "invalid"}
    <DropIndicator state={dropState} />
  {/if}
</div>

<style>
  .play-area {
    --zone-bg: rgba(15, 30, 50, 0.4);
    --zone-border: rgba(100, 150, 200, 0.15);

    position: relative;
    min-height: 120px;
    background: var(--zone-bg);
    border: 2px dashed var(--zone-border);
    border-radius: 12px;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    transition: all 200ms ease;
    flex: 1;
  }

  .play-area--opponent {
    --zone-bg: rgba(50, 20, 20, 0.25);
    --zone-border: rgba(200, 100, 100, 0.15);
  }

  .play-area--drop-valid {
    background: rgba(56, 189, 139, 0.12);
    border-color: rgba(56, 189, 139, 0.6);
    border-style: solid;
  }

  .play-area--drop-preview {
    background: rgba(59, 130, 246, 0.08);
    border-color: rgba(96, 165, 250, 0.42);
    border-style: solid;
  }

  .play-area--drop-invalid {
    background: rgba(248, 113, 113, 0.12);
    border-color: rgba(248, 113, 113, 0.65);
    border-style: solid;
  }

  .play-area--challenge-mode {
    box-shadow: inset 0 0 0 1px rgba(250, 204, 21, 0.28);
  }

  .challenge-banner {
    text-align: center;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #fef08a;
    background: rgba(180, 83, 9, 0.28);
    border: 1px solid rgba(217, 119, 6, 0.45);
    border-radius: 999px;
    padding: 0.2rem 0.5rem;
    margin: 0 auto;
  }

  .play-area-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
  }
</style>
