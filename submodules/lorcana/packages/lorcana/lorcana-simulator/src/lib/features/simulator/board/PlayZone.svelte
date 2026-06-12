<script lang="ts">
  import type {
    LorcanaCardSnapshot,
    LorcanaPlayerSide,
    LorcanaTableSeat,
    LorcanaZoneId,
  } from "@/features/simulator/model/contracts.js";
  import type { SimulatorLayoutMode } from "@/features/simulator/model/layout-mode.svelte.js";
  import { m } from "$lib/i18n/messages.js";
  import { EmptyState, DropIndicator } from "@/design-system/simulator/display/index.js";
  import ZoneCounter from "@/design-system/simulator/display/ZoneCounter.svelte";
  import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
  import {ZONE_IMAGE_FORMATS} from "@/design-system/simulator/cards/card-image-format.js";
  import HotkeyCardBadge from "@/features/simulator/hotkeys/HotkeyCardBadge.svelte";
  import {
    buildOrderedPlayZoneEntries,
    type OrderedPlayZoneEntry,
  } from "@/features/simulator/hotkeys/board-order.js";
  import PlayZoneLocationCluster from "./PlayZoneLocationCluster.svelte";
  import PlayZoneCardBands from "./PlayZoneCardBands.svelte";
  import ManualCorrectionMenu from "./ManualCorrectionMenu.svelte";
  import ManualDamageControls from "./ManualDamageControls.svelte";
  import {
    createCardAnchorId,
    createZoneAnchorId,
  } from "@/features/simulator/animations/board-move-animations.js";
  import {
    useLorcanaBoardPresenter,
    useLorcanaSidebarPresenter,
  } from "@/features/simulator/context/game-context.svelte.js";
  import { useSimulatorCardContext } from "@/features/simulator/context/simulator-card-context.svelte.js";
  import {
    handlePlayZoneLocationEntryDirectSelection,
    isPlayZoneLocationEntryDirectSelectionMode,
    isPlayZoneLocationEntryResolutionSelectionMode,
  } from "./play-zone-location-entry-interactions.js";
  import {
    createOptionalDroppable,
    createOptionalDraggable,
    useLorcanaSimulatorDndContext,
  } from "@/features/simulator/context/simulator-dnd-context.svelte.js";

  interface BoardZoneProps {
    layoutMode?: SimulatorLayoutMode;
    zoneId: LorcanaZoneId;
    playerSide: LorcanaPlayerSide;
    seat: LorcanaTableSeat;
    isOpponent: boolean;
    label: string;
    excludeCardTypes?: Array<NonNullable<LorcanaCardSnapshot["cardType"]>>;
    hotkeyBindings?: Map<string, string>;
  }

  let {
    layoutMode = "desktop",
    zoneId,
    playerSide,
    seat,
    isOpponent,
    label,
    excludeCardTypes = [],
    hotkeyBindings = new Map(),
  }: BoardZoneProps = $props();

  const board = useLorcanaBoardPresenter();
  const sidebar = useLorcanaSidebarPresenter();
  const simulatorCardContext = useSimulatorCardContext();
  const dnd = useLorcanaSimulatorDndContext();
  const inFlightCardIds = $derived(board.inFlightCardIds);
  const cards = $derived.by(() =>
    board
      .getZoneCards(playerSide, zoneId)
      .filter((card) => !card.cardType || !excludeCardTypes.includes(card.cardType))
      .filter((card) => !inFlightCardIds.has(card.cardId)),
  );
  const playEntries = $derived.by<OrderedPlayZoneEntry[]>(() =>
    buildOrderedPlayZoneEntries(cards, seat),
  );
  const isMasked = $derived(board.isZoneMasked(playerSide, zoneId));
  const challengeMode = $derived(
    sidebar.actionSelectionSession?.categoryId === "challenge" &&
      sidebar.actionSelectionSession.phase !== "choose-source" &&
      board.opponentSide === playerSide,
  );
  const dropState = $derived(dnd.getZoneDropState(zoneId, playerSide));
  const droppable = createOptionalDroppable({
    zone: "play",
    get player() {
      return playerSide;
    },
  });

  const isDirectSelectionMode = $derived(
    isPlayZoneLocationEntryDirectSelectionMode(sidebar.actionSelectionSession),
  );

  function handleDirectCardSelection(selectedCard: LorcanaCardSnapshot, event: MouseEvent): boolean {
    if (
      isPlayZoneLocationEntryResolutionSelectionMode(
        sidebar.resolutionSelectionSession,
        selectedCard.cardId,
      )
    ) {
      event.stopPropagation();
      sidebar.handleAvailableMovesSelectionCard(selectedCard.cardId);
      return true;
    }

    return handlePlayZoneLocationEntryDirectSelection({
      card: selectedCard,
      event,
      directSelectionMode: isDirectSelectionMode,
      onSelect: (nextCard) => sidebar.handleActionSessionCardSelection(nextCard),
    });
  }

  const showZoneCounters = $derived(board.showZoneCounters);
  // Sparse lane (few cards, lots of empty space) triggers a width multiplier
  // so lone cards grow to fill the zone.
  const isSparse = $derived(cards.length > 0 && cards.length <= 4);
  const zoneLabel = $derived(label || m["sim.zone.play"]({}));

  const playerLabel = $derived(
    playerSide === "playerOne"
      ? m["sim.player.side.playerOne"]({})
      : m["sim.player.side.playerTwo"]({}),
  );
</script>

<div
  class="board-zone"
  class:board-zone--opponent={isOpponent}
  class:board-zone--drop-preview={dropState === "preview"}
  class:board-zone--drop-valid={dropState === "valid"}
  class:board-zone--drop-invalid={dropState === "invalid"}
  class:board-zone--challenge-mode={challengeMode && isOpponent}
  class:board-zone--sparse={isSparse}
  data-layout-mode={layoutMode}
  data-player-seat={seat}
  data-player-side={playerSide}
  data-zone-id={zoneId}
  data-board-anchor-id={createZoneAnchorId(playerSide, zoneId)}
  role="region"
  aria-label={m["sim.playZone.aria"]({ label: zoneLabel, player: playerLabel })}
  {@attach droppable.attach}
>
  {#if showZoneCounters}
    <ZoneCounter
      count={cards.length}
      corner={seat === "bottom" ? "bottom-right" : "top-right"}
      ariaLabel={`${cards.length} cards in ${zoneLabel}`}
    />
  {/if}

  <div class="cards-container">
    <div class="cards-scroll-area" data-board-scroll-sync>
      {#if cards.length === 0}
        <EmptyState />
      {:else}
        <div class="cards-content">
          <div class="cards-grid">
            {#each playEntries as entry (entry.kind === "card" ? entry.card.cardId : entry.location.cardId)}
              {#if entry.kind === "locationCluster"}
                <PlayZoneLocationCluster
                  location={entry.location}
                  occupants={entry.occupants}
                  {seat}
                  {playerSide}
                  {zoneId}
                  {isMasked}
                  {hotkeyBindings}
                />
              {:else}
                {@const actionState = sidebar.getActionSessionCardState(entry.card.cardId)}
                {@const draggable = createOptionalDraggable({ card: entry.card })}
                {@const ownCharDropState = dnd.getOwnCharacterDropState(entry.card.cardId)}
                <div
                  class="card-slot"
                  class:card-slot--dragging={dnd.draggedCardId === entry.card.cardId}
                  class:card-slot--shift-target={ownCharDropState !== "none" && dnd.isShiftDragActive}
                  class:card-slot--shift-target-hovered={ownCharDropState === "valid" && dnd.isShiftDragActive}
                  class:card-slot--sing-target={ownCharDropState !== "none" && dnd.isSingDragActive}
                  class:card-slot--sing-target-hovered={ownCharDropState === "valid" && dnd.isSingDragActive}
                  data-card-id={entry.card.cardId}
                  data-player-seat={seat}
                  data-player-side={playerSide}
                  data-player-id={entry.card.ownerId}
                  data-zone-id={entry.card.zoneId}
                  data-board-anchor-id={createCardAnchorId(playerSide, zoneId, entry.card.cardId)}
                  {@attach draggable.attach}
                >
                  {#if ownCharDropState !== "none" && (dnd.isShiftDragActive || dnd.isSingDragActive)}
                    <div class="card-slot__drop-hint" aria-hidden="true">
                      {dnd.isShiftDragActive ? m["sim.dnd.shift.dropHint"]({}) : m["sim.dnd.sing.dropHint"]({})}
                    </div>
                  {/if}
                  {#if hotkeyBindings.has(entry.card.cardId)}
                    <HotkeyCardBadge hotkey={hotkeyBindings.get(entry.card.cardId)!} />
                  {/if}
                  <PlayZoneCardBands card={entry.card} section="top" />
                  <ManualDamageControls card={entry.card} />
                  <ManualCorrectionMenu card={entry.card}>
                    <div class="card-slot__card-wrapper">
                      <LorcanaCard
                        card={entry.card}
                        useContainerSize
                        imageFormat={ZONE_IMAGE_FORMATS.play}
                        hoverShowActions
                        hideStatBadges
                        hideSupplementalBadges
                        onSelect={(selectedCard, event) => handleDirectCardSelection(selectedCard, event)}
                        isSelected={
                          actionState.isSelected ||
                          simulatorCardContext.previewCard?.cardId === entry.card.cardId
                        }
                        isMasked={isMasked}
                        isPlayable={actionState.isSelectable}
                        isValidTarget={actionState.isSelectable}
                        isInvalidTarget={actionState.isInvalidTarget}
                        isBanishedPreview={sidebar.getChallengePreviewCardState(entry.card.cardId).wouldBeBanished}
                        isExerted={entry.card.readyState === "exerted"}
                        isDrying={entry.card.isDrying ?? false}
                        damage={entry.card.damage ?? 0}
                      />
                    </div>
                  </ManualCorrectionMenu>
                  <PlayZoneCardBands card={entry.card} section="bottom" />
                </div>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>

  {#if dropState === "valid" || dropState === "invalid"}
    <DropIndicator state={dropState} />
  {/if}
</div>

<style>
  .board-zone {
    --zone-bg: rgba(15, 30, 50, 0.4);
    --zone-border: rgba(100, 150, 200, 0.15);
    --card-aspect: 0.9582;
    --play-zone-padding: 0.5rem;
    --play-grid-gap: 0.5rem;
    --play-card-effect-bleed: 1rem;
    --play-scrollbar-size: 10px;
    --play-scrollbar-thumb: rgba(143, 211, 255, 0.65);
    --play-scrollbar-track: rgba(7, 18, 31, 0.36);
    --sparse-mult: 1;

    position: relative;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    background: var(--zone-bg);
    border: 2px dashed var(--zone-border);
    border-radius: 12px;
    padding: var(--play-zone-padding);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    transition: all 200ms ease;
    touch-action: pan-y;
  }

  .board-zone--opponent {
    --zone-bg: rgba(50, 20, 20, 0.25);
    --zone-border: rgba(200, 100, 100, 0.15);
  }

  .board-zone--drop-valid {
    background: rgba(56, 189, 139, 0.12);
    border-color: rgba(56, 189, 139, 0.6);
    border-style: solid;
  }

  .board-zone--drop-preview {
    background: rgba(59, 130, 246, 0.08);
    border-color: rgba(96, 165, 250, 0.42);
    border-style: solid;
  }

  .board-zone--drop-invalid {
    background: rgba(248, 113, 113, 0.12);
    border-color: rgba(248, 113, 113, 0.65);
    border-style: solid;
  }

  .board-zone--challenge-mode {
    box-shadow: inset 0 0 0 1px rgba(250, 204, 21, 0.28);
  }

  .cards-container {
    flex: 1;
    display: flex;
    align-items: stretch;
    justify-content: center;
    min-height: 0;
    min-width: 0;
    overflow: visible;
  }

  .cards-scroll-area {
    /* The scroll-area is the card-sizing authority. Its height is dictated
       purely by the flex parent (no feedback back into card size), so the
       zone can never push itself taller than its allocated lane space. */
    container-type: size;
    container-name: play-zone;

    flex: 1;
    min-height: 0;
    min-width: 0;
    margin: calc(var(--play-card-effect-bleed) * -1);
    padding: var(--play-card-effect-bleed);
    overflow-x: hidden;
    overflow-y: auto;
    touch-action: pan-y;
    scrollbar-gutter: stable;
    scrollbar-width: auto;
    scrollbar-color: var(--play-scrollbar-thumb) var(--play-scrollbar-track);

    /* Each grid cell (.card-slot) is laid out as [top band][card][bottom band].
       Bands have independent heights: status tags on top are small, stat
       pills on the bottom are larger for readability. Card art keeps its
       natural aspect; bands are fixed-height strips for external badges. */
    /* Bands reserve a fixed vertical allowance (max pill size). Pills
       inside scale proportionally with the resolved card-art width so
       they don't dwarf the art on narrow viewports. */
    --play-band-height-top: 2.5rem;
    --play-band-height-bottom: 2.5rem;
    /* Bands overlap into the card art by this fraction of their own height.
       1 = fully overlap (slot = card art height), 0 = no overlap (slot =
       card + full bands). 0.5 pulls each band halfway onto the card edge. */
    --play-band-overlap: 0.5;
    --play-band-visible-top: calc(var(--play-band-height-top) * (1 - var(--play-band-overlap)));
    --play-band-visible-bottom: calc(var(--play-band-height-bottom) * (1 - var(--play-band-overlap)));
    --play-card-target-height: calc(
      (
        100cqh
        - var(--play-card-effect-bleed) * 2
        - var(--play-band-visible-top)
        - var(--play-band-visible-bottom)
      ) * 0.6667
    );
    --card-art-height: min(
      var(--play-card-target-height),
      calc(
        100cqh
        - var(--play-card-effect-bleed) * 2
        - var(--play-grid-gap)
        - var(--play-band-visible-top)
        - var(--play-band-visible-bottom)
      ),
      calc(var(--sim-play-card-width, 220px) * var(--sparse-mult) / var(--card-aspect))
    );
    --card-art-width: calc(var(--card-art-height) * var(--card-aspect));
    --slot-height: calc(
      var(--card-art-height) + var(--play-band-visible-top) + var(--play-band-visible-bottom)
    );
    --slot-width: var(--card-art-width);

    /* Pills scale with the resolved card-art width. Declared after
       --card-art-width so there's no dependency cycle with the band
       heights above. */
    --play-pill-size: clamp(1.25rem, calc(var(--card-art-width) * 0.22), 2.5rem);
    --play-pill-text-size: calc(var(--play-pill-size) * 0.44);
    --play-pill-icon-size: calc(var(--play-pill-size) * 0.55);

    /* LorcanaCard reads these via useContainerSize. Scoped to the card
       wrapper inside the slot so it fills only the card-art region, not
       the whole slot (which includes the bands). */
    --zone-card-width: var(--card-art-width);
    --zone-card-height: var(--card-art-height);
  }

  .cards-scroll-area::-webkit-scrollbar {
    width: var(--play-scrollbar-size);
  }

  .cards-scroll-area::-webkit-scrollbar-track {
    background: var(--play-scrollbar-track);
    border-radius: 999px;
  }

  .cards-scroll-area::-webkit-scrollbar-thumb {
    background: var(--play-scrollbar-thumb);
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  .cards-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: start;
    align-items: center;
    gap: 0 var(--play-grid-gap);
    width: 100%;
    min-height: min-content;
    touch-action: pan-y;
  }

  /* Sparse state (1–4 cards): raise the width cap so cards grow to fill
     the lane instead of floating in empty space. The height clamp still
     applies, so cards won't overflow vertically. */
  .board-zone--sparse {
    --sparse-mult: 1.5;
  }

  .card-slot__card-wrapper {
    position: relative;
    width: var(--card-art-width);
    height: var(--card-art-height);
    flex: 0 0 auto;
  }

  .cards-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    min-height: 100%;
  }

  .board-zone[data-player-seat="top"] .cards-content {
    flex-direction: column-reverse;
    justify-content: flex-start;
  }

  .board-zone[data-player-seat="top"] .cards-grid {
    padding: 0.5rem 0.5rem 0;
  }

  .card-slot {
    position: relative;
    display: flex;
    flex: 0 0 var(--slot-width);
    flex-direction: column;
    align-items: center;
    width: var(--slot-width);
    height: var(--slot-height);
  }

  .card-slot--dragging {
    opacity: 0.4;
    pointer-events: none;
  }

  .card-slot__drop-hint {
    position: absolute;
    top: calc(var(--play-band-visible-top) + 0.3rem);
    left: 50%;
    transform: translateX(-50%);
    z-index: 8;
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 0.18rem 0.48rem;
    font-size: 0.56rem;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    white-space: nowrap;
    pointer-events: none;
    transition: opacity 120ms ease;
  }

  .card-slot--shift-target .card-slot__drop-hint {
    background: rgba(8, 17, 27, 0.82);
    border: 1px solid rgba(147, 197, 253, 0.55);
    color: rgba(191, 219, 254, 0.96);
  }

  .card-slot--shift-target-hovered .card-slot__drop-hint {
    background: rgba(29, 58, 105, 0.92);
    border-color: rgba(147, 197, 253, 0.9);
    box-shadow: 0 0 8px rgba(147, 197, 253, 0.35);
  }

  .card-slot--sing-target .card-slot__drop-hint {
    background: rgba(8, 17, 27, 0.82);
    border: 1px solid rgba(216, 180, 254, 0.55);
    color: rgba(233, 213, 255, 0.96);
  }

  .card-slot--sing-target-hovered .card-slot__drop-hint {
    background: rgba(59, 29, 105, 0.92);
    border-color: rgba(216, 180, 254, 0.9);
    box-shadow: 0 0 8px rgba(216, 180, 254, 0.35);
  }

  /* Desktop: wider gap when there's room. */
  @media (min-width: 1240px) {
    .cards-grid {
      gap: clamp(0.5rem, 1.25cqh, 0.85rem);
    }
  }

  /* Mobile: card size is driven by available width (4 columns). Overrides
     the height-driven formula inherited from .cards-scroll-area. */
  @media (max-width: 640px) {
    .board-zone {
      --play-grid-gap: 0.6rem;
      --play-scrollbar-size: 14px;
      --play-scrollbar-thumb: rgba(143, 211, 255, 0.85);
      --play-scrollbar-track: rgba(7, 18, 31, 0.52);
    }

    .cards-grid {
      padding: 0.35rem;
    }

    /* Mobile: same band layout as desktop, just driven by a width-based
       card-art size (3-column lane). Bands still overlap the card 50%. */
    .board-zone[data-layout-mode="mobile"] .cards-scroll-area {
      --card-art-width: min(
        clamp(96px, 30vw, 150px),
        calc(
          (100cqw - (var(--play-zone-padding) * 2) - (var(--play-grid-gap) * 2)) / 3
        )
      );
      --card-art-height: calc(var(--card-art-width) / var(--card-aspect));
    }

    .board-zone[data-layout-mode="mobile"] .cards-grid {
      gap: 0.5rem;
      padding: 0.35rem;
    }
  }
</style>
