<script lang="ts">
  import type {
    LorcanaCardSnapshot,
    LorcanaPlayerSide,
    LorcanaZoneId,
    LorcanaTableSeat,
  } from "@/features/simulator/model/contracts.js";
  import { createCardAnchorId } from "@/features/simulator/animations/board-move-animations.js";
  import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
  import { ZONE_IMAGE_FORMATS } from "@/design-system/simulator/cards/card-image-format.js";
  import HotkeyCardBadge from "@/features/simulator/hotkeys/HotkeyCardBadge.svelte";
  import { useLorcanaSidebarPresenter } from "@/features/simulator/context/game-context.svelte.js";
  import { useSimulatorCardContext } from "@/features/simulator/context/simulator-card-context.svelte.js";
  import { useLorcanaSimulatorDndContext } from "@/features/simulator/context/simulator-dnd-context.svelte.js";
  import {
    handlePlayZoneLocationEntryDirectSelection,
    isPlayZoneLocationEntryDirectSelectionMode,
    isPlayZoneLocationEntryResolutionSelectionMode,
  } from "./play-zone-location-entry-interactions.js";
  import PlayZoneCardBands from "./PlayZoneCardBands.svelte";
  import ManualDamageControls from "./ManualDamageControls.svelte";

  interface PlayZoneLocationClusterProps {
    location: LorcanaCardSnapshot;
    occupants: LorcanaCardSnapshot[];
    seat: LorcanaTableSeat;
    playerSide: LorcanaPlayerSide;
    zoneId: LorcanaZoneId;
    isMasked: boolean;
    hotkeyBindings?: Map<string, string>;
  }

  let {
    location,
    occupants,
    seat,
    playerSide,
    zoneId,
    isMasked,
    hotkeyBindings = new Map(),
  }: PlayZoneLocationClusterProps = $props();

  const sidebar = useLorcanaSidebarPresenter();
  const simulatorCardContext = useSimulatorCardContext();
  const dnd = useLorcanaSimulatorDndContext();
  const locationDropState = $derived(dnd.getLocationDropState(location.cardId));
  const isDirectSelectionMode = $derived(
    isPlayZoneLocationEntryDirectSelectionMode(sidebar.actionSelectionSession),
  );
  function isResolutionSelectionMode(cardId: string): boolean {
    return isPlayZoneLocationEntryResolutionSelectionMode(
      sidebar.resolutionSelectionSession,
      cardId,
    );
  }
  const locationActionState = $derived(sidebar.getActionSessionCardState(location.cardId));
  const occupantCountLabel = $derived(
    occupants.length === 1 ? "1 here" : `${occupants.length} here`,
  );
  const clusterLabel = $derived(
    occupants.length === 1
      ? `${location.label}, 1 character at this location`
      : `${location.label}, ${occupants.length} characters at this location`,
  );
  const occupantSlots = $derived(Math.max(1, occupants.length));

  function handleDirectCardSelection(selectedCard: LorcanaCardSnapshot, event: MouseEvent): boolean {
    if (isResolutionSelectionMode(selectedCard.cardId)) {
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
</script>

<section
  class="location-cluster"
  class:location-cluster--empty={occupants.length === 0}
  data-player-seat={seat}
  data-player-side={playerSide}
  data-player-id={location.ownerId}
  data-zone-id={location.zoneId}
  data-location-cluster-id={location.cardId}
  aria-label={clusterLabel}
  style={`--location-occupant-slots: ${occupantSlots};`}
>
  <div
    class="location-cluster__slot location-cluster__slot--anchor"
    data-card-id={location.cardId}
    data-player-seat={seat}
    data-player-side={playerSide}
    data-player-id={location.ownerId}
    data-zone-id={location.zoneId}
    data-location-cluster-id={location.cardId}
    data-location-cluster-role="location"
    data-board-anchor-id={createCardAnchorId(playerSide, zoneId, location.cardId)}
  >
    {#if hotkeyBindings.has(location.cardId)}
      <HotkeyCardBadge hotkey={hotkeyBindings.get(location.cardId)!} />
    {/if}
    <PlayZoneCardBands card={location} section="top" />
    <ManualDamageControls card={location} />
    <div class="location-cluster__location-shell">
      <div class="location-cluster__location-rotate">
        <LorcanaCard
          card={location}
          onSelect={(selectedCard, event) => handleDirectCardSelection(selectedCard, event)}
          useContainerSize
          imageFormat={ZONE_IMAGE_FORMATS.play}
          hoverShowActions
          hideStatBadges
          hideSupplementalBadges
          isSelected={
            locationActionState.isSelected ||
            simulatorCardContext.previewCard?.cardId === location.cardId
          }
          {isMasked}
          isPlayable={locationActionState.isSelectable}
          isValidTarget={locationActionState.isSelectable}
          isInvalidTarget={locationActionState.isInvalidTarget}
          isBanishedPreview={sidebar.getChallengePreviewCardState(location.cardId).wouldBeBanished}
          isDrying={location.isDrying ?? false}
          damage={location.damage ?? 0}
        />
      </div>
    </div>
    <PlayZoneCardBands card={location} section="bottom" />
  </div>

  <div
    class="location-cluster__rail"
    class:location-cluster__rail--drop-preview={locationDropState === "preview"}
    class:location-cluster__rail--drop-valid={locationDropState === "valid"}
    data-location-drop-target={location.cardId}
    data-player-side={playerSide}
  >
    <div class="location-cluster__rail-label" aria-hidden="true">
      <span class="location-cluster__rail-count">{occupantCountLabel}</span>
    </div>

    {#if occupants.length > 0}
      <div class="location-cluster__occupants">
        {#each occupants as occupant (occupant.cardId)}
          {@const actionState = sidebar.getActionSessionCardState(occupant.cardId)}
          <div
            class="location-cluster__slot location-cluster__slot--occupant"
            data-card-id={occupant.cardId}
            data-player-seat={seat}
            data-player-side={playerSide}
            data-player-id={occupant.ownerId}
            data-zone-id={occupant.zoneId}
            data-location-cluster-id={location.cardId}
            data-location-cluster-role="occupant"
            data-board-anchor-id={createCardAnchorId(playerSide, zoneId, occupant.cardId)}
          >
            {#if hotkeyBindings.has(occupant.cardId)}
              <HotkeyCardBadge hotkey={hotkeyBindings.get(occupant.cardId)!} />
            {/if}
            <PlayZoneCardBands card={occupant} section="top" />
            <ManualDamageControls card={occupant} />
            <div class="location-cluster__card-wrapper">
              <LorcanaCard
                card={occupant}
                onSelect={(selectedCard, event) => handleDirectCardSelection(selectedCard, event)}
                useContainerSize
                imageFormat={ZONE_IMAGE_FORMATS.play}
                hoverShowActions
                hideStatBadges
                hideSupplementalBadges
                isSelected={
                  actionState.isSelected ||
                  simulatorCardContext.previewCard?.cardId === occupant.cardId
                }
                {isMasked}
                isPlayable={actionState.isSelectable}
                isValidTarget={actionState.isSelectable}
                isInvalidTarget={actionState.isInvalidTarget}
                isBanishedPreview={sidebar.getChallengePreviewCardState(occupant.cardId).wouldBeBanished}
                isExerted={occupant.readyState === "exerted"}
                isDrying={occupant.isDrying ?? false}
                damage={occupant.damage ?? 0}
              />
            </div>
            <PlayZoneCardBands card={occupant} section="bottom" />
          </div>
        {/each}
      </div>
    {:else}
      <div class="location-cluster__empty-rail" aria-hidden="true"></div>
    {/if}
  </div>
</section>

<style>
  .location-cluster {
    --location-card-height: calc(var(--zone-card-width) / var(--card-aspect));
    --location-dock-border: rgba(178, 214, 139, 0.24);
    --location-dock-surface: rgba(29, 48, 31, 0.58);
    --location-dock-rail: rgba(15, 34, 50, 0.5);

    position: relative;
    isolation: isolate;
    display: grid;
    flex: 0 0 auto;
    grid-template-columns: var(--location-card-height) minmax(0, 1fr);
    align-items: center;
    gap: 0.42rem;
    justify-self: center;
    /* Cap cluster min-width at "location + one occupant" — extra occupants
       beyond that overlap inside the rail rather than pushing the cluster
       wider. width: max-content lets it grow naturally for low counts. */
    min-width: calc(
      var(--location-card-height)
      + var(--slot-width)
      + (var(--play-grid-gap) * 2)
      + 1.7rem
    );
    width: max-content;
    max-width: 100%;
    min-height: var(--slot-height);
    padding: 0.34rem 0.42rem;
    border: 1px solid var(--location-dock-border);
    border-radius: 0.85rem;
    background:
      linear-gradient(90deg, rgba(117, 151, 76, 0.22), transparent 34%),
      linear-gradient(180deg, var(--location-dock-surface), rgba(14, 24, 36, 0.44));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 10px 24px rgba(3, 9, 16, 0.22);
  }

  .location-cluster::before {
    content: "";
    position: absolute;
    top: 50%;
    left: calc(var(--location-card-height) + 0.32rem);
    right: 0.48rem;
    z-index: -1;
    height: 0.18rem;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(190, 224, 143, 0.5), rgba(125, 181, 220, 0.12));
    transform: translateY(-50%);
  }

  .location-cluster__slot {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: var(--slot-height);
    min-width: 0;
  }

  .location-cluster__slot--anchor {
    width: var(--location-card-height);
  }

  .location-cluster__slot--occupant {
    width: var(--slot-width);
    flex: 0 0 var(--slot-width);
    scroll-snap-align: start;
    transition: transform 140ms ease;
  }

  /* Fan / overlap. Each occupant after the first uses a margin-left clamped
     between the natural gap (no overlap when cards fit) and a max overlap
     that always leaves ~45% of every card visible — enough to recognise
     the character's face/silhouette, not just the right-edge stat badges.
     Once that floor is hit (roughly 6+ occupants on mobile), the rail
     overflows and the overflow-x: auto scroll fallback engages. */
  .location-cluster__slot--occupant + .location-cluster__slot--occupant {
    margin-left: clamp(
      calc(var(--slot-width) * -0.55),
      calc(
        ((100% - var(--slot-width)) / max(var(--location-occupant-slots) - 1, 1))
        - var(--slot-width)
      ),
      var(--play-grid-gap)
    );
  }

  /* Lift the active card above its neighbours so the player can read it
     even when fanned. focus-within covers keyboard / drag / tap-to-focus
     interactions on touch devices where :hover doesn't fire reliably. */
  .location-cluster__slot--occupant:hover,
  .location-cluster__slot--occupant:focus-within {
    z-index: 6;
    transform: translateY(-6px);
  }

  .location-cluster__location-shell {
    width: var(--location-card-height);
    height: var(--zone-card-width);
    position: relative;
    overflow: visible;
  }

  .location-cluster__location-rotate {
    --zone-card-height: var(--location-card-height);
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--zone-card-width);
    height: var(--location-card-height);
    transform: translate(-50%, -50%) rotate(90deg);
  }

  .location-cluster__rail {
    position: relative;
    display: flex;
    align-items: center;
    align-self: stretch;
    min-width: 0;
    border-radius: 0.65rem;
    background:
      linear-gradient(180deg, rgba(21, 40, 60, 0.54), var(--location-dock-rail));
    box-shadow: inset 0 0 0 1px rgba(126, 176, 214, 0.12);
  }

  .location-cluster__rail-label {
    position: absolute;
    top: 0.28rem;
    left: 0.32rem;
    z-index: 4;
    display: inline-flex;
    max-width: calc(100% - 0.64rem);
    align-items: center;
    gap: 0.28rem;
    border: 1px solid rgba(190, 224, 143, 0.24);
    border-radius: 999px;
    background: rgba(8, 17, 27, 0.76);
    padding: 0.14rem 0.34rem;
    color: rgba(236, 252, 203, 0.96);
    font-size: 0.58rem;
    font-weight: 800;
    line-height: 1;
    white-space: nowrap;
    pointer-events: none;
  }

  .location-cluster__rail-count {
    color: rgba(191, 219, 254, 0.96);
    font-variant-numeric: tabular-nums;
  }

  .location-cluster__occupants {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    min-width: 0;
    width: 100%;

    /* Vertical bleed: the band badges (damage, hotkey, status) extend past
       the card art on both edges, and hover lifts the active card by 6px.
       Top and bottom bands have independent heights in PlayZone.svelte
       (--play-band-height-top vs --play-band-height-bottom — bottom is
       larger to fit stat pills), so each side gets its own bleed.
       Without that, the bottom badges would clip when overflow-y: visible
       resolves to "auto" alongside overflow-x: auto. The negative margin /
       positive padding pair is the same trick .cards-scroll-area uses in
       PlayZone.svelte. */
    --rail-vertical-bleed-top: calc(var(--play-band-visible-top, 1.25rem) + 0.5rem);
    --rail-vertical-bleed-bottom: calc(var(--play-band-visible-bottom, 1.25rem) + 0.5rem);
    padding:
      var(--rail-vertical-bleed-top)
      0.42rem
      var(--rail-vertical-bleed-bottom);
    margin:
      calc(var(--rail-vertical-bleed-top) * -1) 0
      calc(var(--rail-vertical-bleed-bottom) * -1);

    /* Subtle right-edge fade so a fanned or overflowing rail reads as
       "more cards beyond this edge". Always on but barely visible when
       there's nothing to reveal. */
    -webkit-mask-image: linear-gradient(
      to right,
      black 0,
      black calc(100% - 14px),
      rgba(0, 0, 0, 0.55) 100%
    );
    mask-image: linear-gradient(
      to right,
      black 0,
      black calc(100% - 14px),
      rgba(0, 0, 0, 0.55) 100%
    );

    /* Scroll fallback engages once overlap hits its floor (~6+ occupants).
       scroll-padding-right keeps the next card peeking by ~40% of a slot
       so players see "there's more here" without an explicit scrollbar
       cue — the App Store / Apple Music carousel pattern. */
    overflow-x: auto;
    overflow-y: visible;
    scrollbar-width: thin;
    touch-action: pan-x;
    scroll-snap-type: x proximity;
    scroll-padding-right: calc(var(--slot-width) * 0.4);
  }

  .location-cluster__card-wrapper {
    position: relative;
    width: var(--card-art-width);
    height: var(--card-art-height);
    flex: 0 0 auto;
  }

  .location-cluster__empty-rail {
    width: 100%;
    height: calc(var(--slot-height) - 0.8rem);
    margin: 0.4rem;
    border: 1px dashed rgba(190, 224, 143, 0.18);
    border-radius: 0.55rem;
    background: rgba(9, 18, 28, 0.22);
    transition: border-color 120ms ease, background 120ms ease;
  }

  .location-cluster__rail--drop-preview {
    box-shadow:
      inset 0 0 0 1.5px rgba(74, 222, 128, 0.5),
      0 0 10px rgba(74, 222, 128, 0.12);
    transition: box-shadow 120ms ease;
  }

  .location-cluster__rail--drop-preview .location-cluster__empty-rail {
    border-color: rgba(74, 222, 128, 0.45);
    background: rgba(22, 101, 52, 0.18);
  }

  .location-cluster__rail--drop-valid {
    box-shadow:
      inset 0 0 0 2px rgba(74, 222, 128, 0.9),
      0 0 18px rgba(74, 222, 128, 0.35);
    transition: box-shadow 120ms ease;
  }

  .location-cluster__rail--drop-valid .location-cluster__empty-rail {
    border-color: rgba(74, 222, 128, 0.8);
    background: rgba(22, 101, 52, 0.32);
  }

  @media (max-width: 640px) {
    .location-cluster {
      flex-basis: 100%;
      justify-self: stretch;
      width: 100%;
      min-width: 0;
      gap: 0.34rem;
      padding: 0.3rem;
    }
  }
</style>
