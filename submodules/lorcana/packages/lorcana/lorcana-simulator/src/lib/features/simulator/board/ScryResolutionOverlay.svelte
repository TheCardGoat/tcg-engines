<script lang="ts">
  import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
  import CircleHelpIcon from '@lucide/svelte/icons/circle-help';
  import EyeIcon from '@lucide/svelte/icons/eye';
  import GripIcon from '@lucide/svelte/icons/grip';
  import Maximize2Icon from '@lucide/svelte/icons/maximize-2';
  import MinusIcon from '@lucide/svelte/icons/minus';
  import {
    createDragDropMonitor,
    createDraggable,
    createDroppable,
  } from '@dnd-kit/svelte';
  import { onMount, tick } from 'svelte';

  import { m } from '$lib/i18n/messages.js';
  import * as Tooltip from '$lib/design-system/primitives/tooltip/index.js';
  import LorcanaCard from '@/design-system/simulator/cards/LorcanaCard.svelte';
  import { CARD_IMAGE_ASPECT_RATIOS } from '@/design-system/simulator/cards/card-image-format.js';
  import { useSimulatorCardContext } from '@/features/simulator/context/simulator-card-context.svelte.js';
  import type {
    LorcanaCardSnapshot,
    LorcanaPlayerSide,
  } from '@/features/simulator/model/contracts.js';
  import { SimulatorLayoutModeObserver } from '@/features/simulator/model/layout-mode.svelte.js';
  import { getScryZoneLabel } from '@/features/simulator/model/scry-destinations.js';
  import type {
    PlayerInteractionView,
    PromptScryDestination,
    PromptScryRevealedCard,
  } from '@tcg/lorcana-interaction';
  import {
    countHiddenScrollableItems,
    getScrollableItemStep,
  } from './item-zone-mobile.js';
  import {
    buildScryCardDropId,
    buildScryDragId,
    buildScryZoneDropId,
    canAssignScryCardToDestination,
    findScryCardDestinationId,
    findScryDestination,
    getScryDesiredOrder,
    getScryDestinationCountLabel,
    getScryRemainderDestination,
    getScryTapDestination,
    mapReversedBeforeCardId,
    parseScryDragId,
    parseScryDropTarget,
  } from './scry-overlay.js';

  interface ScryResolutionOverlayProps {
    view: PlayerInteractionView;
    cardSnapshotsById?: Record<string, LorcanaCardSnapshot>;
    viewerSide?: LorcanaPlayerSide | null;
    /**
     * When a Bodyguard character is assigned to a `play` destination, the
     * chooser must opt into / decline the keyword's "may enter exerted"
     * mode before confirming. Presenter exposes the current value (or
     * `null` for not-yet-chosen); `null` here means no Bodyguard
     * assignment is staged and the toggle is hidden.
     */
    bodyguardEntryMode?: { selected: boolean | null } | null;
    onAssignCard?: (cardId: string, destinationId: string) => boolean;
    onReorderCard?: (
      destinationId: string,
      cardId: string,
      direction: 'up' | 'down',
    ) => boolean;
    onSelectBodyguardEntryMode?: (enterPlayExerted: boolean) => boolean;
    onConfirm?: () => boolean;
    onDismiss?: () => void;
  }

  let {
    view,
    cardSnapshotsById = {},
    viewerSide: _viewerSide = null,
    bodyguardEntryMode = null,
    onAssignCard,
    onReorderCard,
    onSelectBodyguardEntryMode,
    onConfirm,
    onDismiss,
  }: ScryResolutionOverlayProps = $props();
  // viewerSide accepted for parity with other overlays; the scry overlay
  // surfaces the chooser's pending arrangement which is already viewer-correct.

  const simulatorCardContext = useSimulatorCardContext();
  const layout = new SimulatorLayoutModeObserver();

  const SCRY_OVERLAY_PADDING = 8;

  let overlayElement: HTMLElement | null = null;
  let overlayPosition = $state({
    x: SCRY_OVERLAY_PADDING,
    y: SCRY_OVERLAY_PADDING,
  });
  let isMinimized = $state(false);
  let isDraggingOverlay = $state(false);
  let rowContainerElements = $state<Record<string, HTMLDivElement | null>>({});
  let hiddenCardsByZone = $state<
    Record<string, { left: number; right: number }>
  >({});

  let dragPointerId: number | null = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  /** While dragging a scry card, used to highlight legal destination rows. */
  let activeScryDragCardId = $state<string | null>(null);

  function handleOverlayPointerUp(event: PointerEvent): void {
    stopOverlayDrag(event.pointerId);
  }

  function handleOverlayPointerCancel(event: PointerEvent): void {
    stopOverlayDrag(event.pointerId);
  }

  const MISSING_PROVIDER_ERROR =
    'getDragDropManager was called outside of a DragDropProvider';
  const SCRY_CARD_IMAGE_FORMAT = 'art_only';
  const SCRY_CARD_ASPECT_RATIO =
    CARD_IMAGE_ASPECT_RATIOS[SCRY_CARD_IMAGE_FORMAT];
  const isMobileLayout = $derived(layout.current !== 'desktop');
  const activePrompt = $derived(view.activePrompt);
  const scryDestinations = $derived<readonly PromptScryDestination[]>(
    activePrompt?.scryDestinations ?? [],
  );
  const scryRevealed = $derived<readonly PromptScryRevealedCard[]>(
    activePrompt?.scryRevealed ?? [],
  );
  const sourceCardId = $derived<string | null>(
    activePrompt ? (activePrompt.sourceCardId as unknown as string) : null,
  );
  const sourceCard = $derived(
    sourceCardId ? (cardSnapshotsById[sourceCardId] ?? null) : null,
  );
  const overlayTitle = $derived(
    sourceCard?.label ?? m['sim.actions.scry.revealedCards']({}),
  );
  const scryHeaderSubtitle = $derived<string | null>(
    m['sim.actions.scry.revealedStripHint']({}),
  );
  const scryOverlayAriaLabel = $derived(
    [overlayTitle, scryHeaderSubtitle].filter(Boolean).join('. '),
  );
  const remainderDestination = $derived(
    getScryRemainderDestination(scryDestinations),
  );
  const unassignedRevealedCardIds = $derived<readonly string[]>(
    scryRevealed
      .filter((entry) => entry.currentDestinationId === null)
      .map((entry) => String(entry.cardId)),
  );
  /**
   * When a remainder destination exists, unassigned revealed cards are
   * surfaced inside that destination row (matching the engine's submit
   * semantics — "everything unplaced lands here"). The bottom revealed
   * strip is then redundant and is hidden. Without a remainder destination
   * the strip remains the only source-of-truth for the reveal pool.
   */
  const revealedScryEntries = $derived(
    remainderDestination ? [] : scryRevealed,
  );
  const canConfirm = $derived(view.submission.canSubmit);
  const helpMessage = $derived(m['sim.actions.scry.dragHint']({}));
  const isScryCardDragActive = $derived(activeScryDragCardId !== null);

  function isMissingProviderError(error: unknown): boolean {
    return (
      error instanceof Error && error.message.includes(MISSING_PROVIDER_ERROR)
    );
  }

  function noopAttach(): void {}

  function clampOverlayPosition(
    x: number,
    y: number,
  ): { x: number; y: number } {
    if (!overlayElement) {
      return { x, y };
    }

    const parent = overlayElement.offsetParent;
    if (!(parent instanceof HTMLElement)) {
      return { x, y };
    }

    const maxX = Math.max(
      SCRY_OVERLAY_PADDING,
      parent.clientWidth - overlayElement.offsetWidth - SCRY_OVERLAY_PADDING,
    );
    const maxY = Math.max(
      SCRY_OVERLAY_PADDING,
      parent.clientHeight - overlayElement.offsetHeight - SCRY_OVERLAY_PADDING,
    );

    return {
      x: Math.min(Math.max(SCRY_OVERLAY_PADDING, x), maxX),
      y: Math.min(Math.max(SCRY_OVERLAY_PADDING, y), maxY),
    };
  }

  async function centerOverlay(): Promise<void> {
    await tick();

    if (!overlayElement) {
      return;
    }

    const parent = overlayElement.offsetParent;
    if (!(parent instanceof HTMLElement)) {
      return;
    }

    const centeredX = (parent.clientWidth - overlayElement.offsetWidth) / 2;
    const centeredY = (parent.clientHeight - overlayElement.offsetHeight) / 2;
    overlayPosition = clampOverlayPosition(centeredX, centeredY);
  }

  function handleWindowResize(): void {
    overlayPosition = clampOverlayPosition(
      overlayPosition.x,
      overlayPosition.y,
    );
  }

  function handleOverlayPointerMove(event: PointerEvent): void {
    if (!isDraggingOverlay || dragPointerId !== event.pointerId) {
      return;
    }

    overlayPosition = clampOverlayPosition(
      event.clientX - dragOffsetX,
      event.clientY - dragOffsetY,
    );
  }

  function stopOverlayDrag(pointerId?: number): void {
    if (!isDraggingOverlay) {
      return;
    }

    if (pointerId !== undefined && dragPointerId !== pointerId) {
      return;
    }

    isDraggingOverlay = false;
    dragPointerId = null;
  }

  function handleOverlayPointerDown(event: PointerEvent): void {
    if (!overlayElement) {
      return;
    }

    const overlayRect = overlayElement.getBoundingClientRect();
    dragPointerId = event.pointerId;
    dragOffsetX = event.clientX - overlayRect.left;
    dragOffsetY = event.clientY - overlayRect.top;
    isDraggingOverlay = true;
    event.preventDefault();
  }

  function toggleMinimized(): void {
    isMinimized = !isMinimized;
    tick().then(() => {
      handleWindowResize();
    });
  }

  function createSafeDraggable(id: string, disabled: boolean) {
    try {
      return createDraggable({ id, disabled });
    } catch (error) {
      if (isMissingProviderError(error)) {
        return {
          draggable: null,
          isDragging: false,
          isDropping: false,
          isDragSource: false,
          attach: noopAttach,
          attachHandle: noopAttach,
        };
      }

      throw error;
    }
  }

  function createSafeDroppable(id: string, disabled: boolean) {
    try {
      return createDroppable({ id, disabled });
    } catch (error) {
      if (isMissingProviderError(error)) {
        return {
          droppable: null,
          isDropTarget: false,
          attach: noopAttach,
        };
      }

      throw error;
    }
  }

  /**
   * Non-ordering rows (e.g. inkwell): do not register per-card droppables — disabled nested
   * droppables can prevent @dnd-kit from resolving drops to the parent `scry-zone:` row.
   */
  function createScryCardSlotDroppable(
    destinationId: string,
    cardId: string,
    orderingEnabled: boolean,
  ) {
    if (!orderingEnabled) {
      return {
        droppable: null,
        isDropTarget: false,
        attach: noopAttach,
      };
    }

    return createSafeDroppable(
      buildScryCardDropId(destinationId, cardId),
      false,
    );
  }

  function getEntryCard(
    cardId: string | undefined,
  ): LorcanaCardSnapshot | null {
    return cardId ? (cardSnapshotsById[cardId] ?? null) : null;
  }

  function handleCardPreviewEnter(card: LorcanaCardSnapshot | null): void {
    if (!card?.isMasked) {
      simulatorCardContext.setExternalPreviewCard(card);
    }
  }

  function handleCardPreviewLeave(card: LorcanaCardSnapshot | null): void {
    if (
      card &&
      !card.isMasked &&
      simulatorCardContext.previewCard?.cardId === card.cardId
    ) {
      simulatorCardContext.setExternalPreviewCard(null);
    }
  }

  function handleOpenGlobalPreview(card: LorcanaCardSnapshot | null): void {
    if (!card?.isMasked) {
      simulatorCardContext.openGlobalPreview(card);
    }
  }

  function setRowContainer(
    destinationId: string,
    node: HTMLDivElement | null,
  ): void {
    rowContainerElements[destinationId] = node;
  }

  function attachRowContainer(destinationId: string) {
    return (node: HTMLElement) => {
      if (node instanceof HTMLDivElement) {
        setRowContainer(destinationId, node);
      }

      return () => {
        setRowContainer(destinationId, null);
      };
    };
  }

  function getRowCardElements(destinationId: string): HTMLElement[] {
    const container = rowContainerElements[destinationId];
    if (!container) {
      return [];
    }

    return Array.from(container.querySelectorAll<HTMLElement>('.scry-card'));
  }

  function updateHiddenCardsForDestination(destinationId: string): void {
    const container = rowContainerElements[destinationId];
    if (!container || !isMobileLayout) {
      hiddenCardsByZone[destinationId] = { left: 0, right: 0 };
      return;
    }

    hiddenCardsByZone[destinationId] = countHiddenScrollableItems({
      viewportLeft: container.scrollLeft,
      viewportWidth: container.clientWidth,
      elements: getRowCardElements(destinationId).map((cardEl) => ({
        offsetLeft: cardEl.offsetLeft,
        offsetWidth: cardEl.offsetWidth,
      })),
    });
  }

  function scrollRow(destinationId: string, direction: 'left' | 'right'): void {
    const container = rowContainerElements[destinationId];
    if (!container) {
      return;
    }

    const step = getScrollableItemStep({
      viewportWidth: container.clientWidth,
      elements: getRowCardElements(destinationId).map((cardEl) => ({
        offsetLeft: cardEl.offsetLeft,
        offsetWidth: cardEl.offsetWidth,
      })),
    });
    if (step <= 0) {
      return;
    }

    container.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  }

  function moveCardToIndex(
    destinationId: string,
    cardId: string,
    targetIndex: number,
    currentIndex: number,
  ): void {
    if (!onReorderCard || currentIndex === targetIndex) {
      return;
    }

    const direction: 'up' | 'down' = currentIndex > targetIndex ? 'up' : 'down';
    const steps = Math.abs(targetIndex - currentIndex);

    for (let index = 0; index < steps; index += 1) {
      const success = onReorderCard(destinationId, cardId, direction);
      if (!success) {
        break;
      }
    }
  }

  function handleCardTap(cardId: string): void {
    const nextDestinationId = getScryTapDestination(
      scryDestinations,
      scryRevealed,
      cardId,
    );
    if (nextDestinationId) {
      onAssignCard?.(cardId, nextDestinationId);
    }
  }

  function handleScryCardKeydown(
    cardId: string | undefined,
    event: KeyboardEvent,
  ): void {
    if (!cardId) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardTap(cardId);
    }
  }

  function canMoveCard(
    cardIndex: number,
    cardCount: number,
    direction: 'up' | 'down',
  ): boolean {
    if (direction === 'up') {
      return cardIndex > 0;
    }

    return cardIndex < cardCount - 1;
  }

  function handleLocalDragEnd(
    sourceId: string | null,
    targetId: string | null,
  ): void {
    const draggedCardId = parseScryDragId(sourceId);
    const dropTarget = parseScryDropTarget(targetId);
    if (!draggedCardId || !dropTarget) {
      return;
    }

    const sourceDestinationId = findScryCardDestinationId(
      scryRevealed,
      draggedCardId,
    );
    const targetDestination = findScryDestination(
      scryDestinations,
      dropTarget.destinationId,
    );
    if (!targetDestination) {
      return;
    }

    if (sourceDestinationId !== targetDestination.id) {
      if (
        !canAssignScryCardToDestination(
          scryDestinations,
          scryRevealed,
          draggedCardId,
          targetDestination.id,
        )
      ) {
        // Target is at max capacity. Try to make room by evicting the
        // currently-assigned card(s) back to the remainder destination so a
        // drag becomes a "replace" instead of a silent reject.
        const remainder = getScryRemainderDestination(scryDestinations);
        if (!remainder || remainder.id === targetDestination.id) {
          return;
        }

        const max = targetDestination.max ?? Infinity;
        const evictCount = Math.max(
          0,
          targetDestination.currentCardIds.length - max + 1,
        );
        const evictees = targetDestination.currentCardIds
          .map((cardId) => String(cardId))
          .filter((cardId) => cardId !== draggedCardId)
          .slice(-evictCount);

        for (const evictedCardId of evictees) {
          onAssignCard?.(evictedCardId, remainder.id);
        }
      }

      const assigned =
        onAssignCard?.(draggedCardId, targetDestination.id) ?? false;
      if (!assigned || !targetDestination.orderingEnabled) {
        return;
      }

      const actualBeforeCardId = mapReversedBeforeCardId(
        targetDestination,
        dropTarget.beforeCardId,
      );
      const desiredOrder = getScryDesiredOrder(
        targetDestination,
        draggedCardId,
        actualBeforeCardId,
      );
      if (!desiredOrder) {
        return;
      }

      const targetIndex = desiredOrder.indexOf(draggedCardId);
      // After the assignment dispatch, the dragged card is appended to the
      // destination, so its post-assignment index is the new last position.
      const currentIndex = targetDestination.currentCardIds.length;
      if (targetIndex >= 0) {
        moveCardToIndex(
          targetDestination.id,
          draggedCardId,
          targetIndex,
          currentIndex,
        );
      }
      return;
    }

    if (!targetDestination.orderingEnabled) {
      return;
    }

    const actualBeforeCardId = mapReversedBeforeCardId(
      targetDestination,
      dropTarget.beforeCardId,
    );
    const desiredOrder = getScryDesiredOrder(
      targetDestination,
      draggedCardId,
      actualBeforeCardId,
    );
    const currentIndex = targetDestination.currentCardIds.findIndex(
      (cardId) => String(cardId) === draggedCardId,
    );
    const targetIndex = desiredOrder?.indexOf(draggedCardId) ?? -1;
    if (!desiredOrder || currentIndex < 0 || targetIndex < 0) {
      return;
    }

    moveCardToIndex(
      targetDestination.id,
      draggedCardId,
      targetIndex,
      currentIndex,
    );
  }

  try {
    createDragDropMonitor({
      onDragStart(event) {
        const rawId = event.operation.source
          ? String(event.operation.source.id)
          : null;
        activeScryDragCardId = parseScryDragId(rawId);
      },
      onDragEnd(event) {
        activeScryDragCardId = null;

        if (event.canceled) {
          return;
        }

        handleLocalDragEnd(
          event.operation.source ? String(event.operation.source.id) : null,
          event.operation.target ? String(event.operation.target.id) : null,
        );
      },
    });
  } catch (error) {
    if (!isMissingProviderError(error)) {
      throw error;
    }
  }

  onMount(() => {
    void centerOverlay();

    window.addEventListener('pointermove', handleOverlayPointerMove);
    window.addEventListener('pointerup', handleOverlayPointerUp);
    window.addEventListener('pointercancel', handleOverlayPointerCancel);
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('pointermove', handleOverlayPointerMove);
      window.removeEventListener('pointerup', handleOverlayPointerUp);
      window.removeEventListener('pointercancel', handleOverlayPointerCancel);
      window.removeEventListener('resize', handleWindowResize);
    };
  });

  $effect(() => {
    void activePrompt?.requestId;
    isMinimized = false;
    void centerOverlay();
  });

  $effect(() => {
    void scryDestinations;
    void isMobileLayout;

    const cleanups: Array<() => void> = [];

    for (const destination of scryDestinations) {
      const destId = destination.id;
      const container = rowContainerElements[destId];
      if (!container) {
        hiddenCardsByZone[destId] = { left: 0, right: 0 };
        continue;
      }

      const update = () => updateHiddenCardsForDestination(destId);
      const resizeObserver =
        typeof ResizeObserver === 'undefined'
          ? null
          : new ResizeObserver(update);
      const cardElements = Array.from(
        container.querySelectorAll<HTMLElement>('.scry-card'),
      );

      update();
      container.addEventListener('scroll', update, { passive: true });
      resizeObserver?.observe(container);

      for (const cardEl of cardElements) {
        resizeObserver?.observe(cardEl);
      }

      cleanups.push(() => {
        container.removeEventListener('scroll', update);
        resizeObserver?.disconnect();
      });
    }

    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  });
</script>

<section
  class="scry-overlay"
  class:scry-overlay--dragging={isDraggingOverlay}
  class:scry-overlay--scry-card-drag={isScryCardDragActive}
  class:scry-overlay--minimized={isMinimized}
  aria-label={scryOverlayAriaLabel}
  data-testid="scry-resolution-overlay"
  bind:this={overlayElement}
  style={`--scry-card-aspect-ratio: ${SCRY_CARD_ASPECT_RATIO}; left: ${overlayPosition.x}px; top: ${overlayPosition.y}px;`}
>
  <header class="scry-overlay__header">
    <div class="scry-overlay__header-main">
      <div class="scry-overlay__header-copy">
        {#if sourceCard}
          <div class="scry-overlay__source">
            <button
              type="button"
              class="scry-overlay__source-card"
              aria-label={`Preview ${sourceCard.label}`}
              onpointerenter={() => handleCardPreviewEnter(sourceCard)}
              onpointerleave={() => handleCardPreviewLeave(sourceCard)}
              onclick={() => handleOpenGlobalPreview(sourceCard)}
            >
              <LorcanaCard
                card={sourceCard}
                isMasked={sourceCard.isMasked}
                useContainerSize
                imageFormat={SCRY_CARD_IMAGE_FORMAT}
                showHoverCard={false}
              />
            </button>

            {#if isMobileLayout}
              <button
                type="button"
                class="scry-overlay__source-preview"
                aria-label={`Open ${sourceCard.label} preview`}
                onclick={() => handleOpenGlobalPreview(sourceCard)}
              >
                <EyeIcon class="size-4" />
              </button>
            {/if}
          </div>
        {/if}

        <div class="scry-overlay__header-text">
          <div class="scry-overlay__title-line">
            <div class="scry-overlay__title-block">
              <h2 class="scry-overlay__title">{overlayTitle}</h2>
              {#if scryHeaderSubtitle && !isMinimized}
                <p class="scry-overlay__subtitle">{scryHeaderSubtitle}</p>
              {/if}
            </div>
          </div>
        </div>
      </div>

      <div class="scry-overlay__controls">
        {#if !isMinimized}
          <Tooltip.Root>
            <Tooltip.Trigger>
              {#snippet child({ props })}
                <button
                  type="button"
                  {...props}
                  class="scry-overlay__help"
                  aria-label="Show scry instructions"
                >
                  <CircleHelpIcon class="size-4" />
                </button>
              {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content
              side="top"
              sideOffset={6}
              class="z-[99] rounded-md border border-white/10 bg-slate-950/95 px-2 py-1 text-[0.65rem] text-slate-200 shadow-lg"
            >
              {helpMessage}
            </Tooltip.Content>
          </Tooltip.Root>
        {/if}
        <button
          type="button"
          class="scry-overlay__control"
          aria-label={isMinimized
            ? 'Expand scry resolution'
            : 'Minimize scry resolution'}
          aria-pressed={isMinimized}
          onclick={toggleMinimized}
        >
          {#if isMinimized}
            <Maximize2Icon class="size-4" />
          {:else}
            <MinusIcon class="size-4" />
          {/if}
        </button>

        <button
          type="button"
          class="scry-overlay__control scry-overlay__control--drag"
          aria-label="Drag scry resolution"
          onpointerdown={handleOverlayPointerDown}
        >
          <GripIcon class="size-4" />
        </button>
      </div>
    </div>
  </header>

  {#if !isMinimized}
    <div class="scry-overlay__card">
      <div class="scry-overlay__body">
        {#each scryDestinations as destination (destination.id)}
          {@const rowDroppable = createSafeDroppable(
            buildScryZoneDropId(destination.id),
            false,
          )}
          {@const isRemainderRow = destination.remainder}
          {@const assignedDisplayCards = (destination.orderingEnabled
            ? destination.currentCardIds.toReversed()
            : destination.currentCardIds
          ).map((cardId) => String(cardId))}
          {@const unassignedDisplayCards = isRemainderRow
            ? unassignedRevealedCardIds.filter(
                (cardId) => !assignedDisplayCards.includes(cardId),
              )
            : []}
          {@const displayCards = [
            ...assignedDisplayCards,
            ...unassignedDisplayCards,
          ]}
          {@const canDropDraggedHere =
            activeScryDragCardId !== null &&
            canAssignScryCardToDestination(
              scryDestinations,
              scryRevealed,
              activeScryDragCardId,
              destination.id,
            )}

          <section
            class="scry-row"
            class:scry-row--remainder={isRemainderRow}
            class:scry-row--drop-target={rowDroppable.isDropTarget &&
              (activeScryDragCardId === null || canDropDraggedHere)}
            class:scry-row--drag-valid={canDropDraggedHere}
            class:scry-row--drag-muted={activeScryDragCardId !== null &&
              !canDropDraggedHere}
            class:scry-row--mobile-scroll={isMobileLayout}
            data-testid={`scry-destination-${destination.id}`}
            {@attach rowDroppable.attach}
          >
            <header class="scry-row__header">
              <div class="scry-row__copy">
                <div class="scry-row__title-line">
                  <div class="scry-row__title-main">
                    <h3>
                      {destination.label ?? getScryZoneLabel(destination.zone)}
                    </h3>
                  </div>
                  {#if isRemainderRow}
                    <Tooltip.Root>
                      <Tooltip.Trigger>
                        {#snippet child({ props })}
                          <button
                            type="button"
                            {...props}
                            class="scry-overlay__help scry-overlay__help--row"
                            aria-label="Show remainder destination details"
                          >
                            <CircleHelpIcon class="size-3.5" />
                          </button>
                        {/snippet}
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="bottom"
                        sideOffset={6}
                        class="rounded-md border border-white/10 bg-slate-950/95 px-2 py-1 text-[0.65rem] text-slate-200 shadow-lg"
                      >
                        Unchosen legal cards land here automatically until you
                        move them.
                      </Tooltip.Content>
                    </Tooltip.Root>
                  {/if}
                </div>
                {#if !isRemainderRow && remainderDestination}
                  <p class="scry-row__hint">
                    Tap a card here to send it back to {remainderDestination.label ??
                      getScryZoneLabel(remainderDestination.zone)}.
                  </p>
                {/if}
              </div>

              <div class="scry-row__stats">
                <span class="scry-row__count"
                  >{getScryDestinationCountLabel(destination)}</span
                >
              </div>
            </header>

            {#if destination.orderingEnabled && destination.currentCardIds.length >= 2}
              <div class="scry-row__order-label">
                {destination.zone === 'deck-bottom'
                  ? '← Drawn last'
                  : '← Drawn first'}
              </div>
            {/if}

            <div class="scry-row__cards-shell">
              {#if isMobileLayout}
                <button
                  type="button"
                  class="mobile-scry-scroll-button mobile-scry-scroll-button--left"
                  aria-label={`Scroll ${destination.label ?? getScryZoneLabel(destination.zone)} left`}
                  disabled={(hiddenCardsByZone[destination.id]?.left ?? 0) ===
                    0}
                  onclick={() => {
                    scrollRow(destination.id, 'left');
                  }}
                >
                  <ChevronLeftIcon class="size-4" />
                </button>
              {/if}

              <div
                class="scry-row__cards"
                class:scry-row__cards--empty={displayCards.length === 0}
                data-testid={`scry-row-cards-${destination.id}`}
                {@attach attachRowContainer(destination.id)}
              >
                {#if displayCards.length === 0}
                  <div class="scry-row__placeholder">
                    <span class="scry-row__placeholder-title"
                      >{m['prompt.scry.drop-card-here']({})}</span
                    >
                    <span class="scry-row__placeholder-detail">
                      {destination.orderingEnabled
                        ? m['prompt.scry.cards-reorderable']({})
                        : m['prompt.scry.cards-grouped']({})}
                    </span>
                  </div>
                {/if}

                {#each displayCards as cardId, cardIndex (cardId)}
                  {@const revealedCard = scryRevealed.find(
                    (rc) => String(rc.cardId) === cardId,
                  )}
                  {@const card = getEntryCard(cardId)}
                  {@const fallbackLabel = revealedCard?.label ?? cardId}
                  {@const isEligibleForChoice =
                    revealedCard !== undefined &&
                    revealedCard.eligibleDestinationIds.some((id) => {
                      const target = findScryDestination(scryDestinations, id);
                      return target !== null && !target.remainder;
                    })}
                  {@const cardDroppable = createScryCardSlotDroppable(
                    destination.id,
                    cardId,
                    destination.orderingEnabled,
                  )}
                  {@const draggable = createSafeDraggable(
                    buildScryDragId(cardId),
                    false,
                  )}

                  <div
                    class="scry-card-slot"
                    class:scry-card-slot--mobile-controls={destination.orderingEnabled}
                  >
                    {#if destination.orderingEnabled}
                      <div class="scry-card-slot__controls">
                        <button
                          type="button"
                          class="scry-card-shift-button"
                          aria-label={`Move ${fallbackLabel} left`}
                          data-testid={`reorder-${destination.id}-${cardId}-left`}
                          disabled={!canMoveCard(
                            cardIndex,
                            displayCards.length,
                            'up',
                          )}
                          onclick={(event) => {
                            event.stopPropagation();
                            onReorderCard?.(destination.id, cardId, 'down');
                          }}
                        >
                          <ChevronLeftIcon class="size-3.5" />
                        </button>
                        <button
                          type="button"
                          class="scry-card-shift-button"
                          aria-label={`Move ${fallbackLabel} right`}
                          data-testid={`reorder-${destination.id}-${cardId}-right`}
                          disabled={!canMoveCard(
                            cardIndex,
                            displayCards.length,
                            'down',
                          )}
                          onclick={(event) => {
                            event.stopPropagation();
                            onReorderCard?.(destination.id, cardId, 'up');
                          }}
                        >
                          <ChevronRightIcon class="size-3.5" />
                        </button>
                      </div>
                    {/if}

                    <div
                      role="button"
                      tabindex="0"
                      class="scry-card"
                      class:scry-card--remainder={isRemainderRow}
                      class:scry-card--eligible={isRemainderRow &&
                        isEligibleForChoice}
                      class:scry-card--ineligible={isRemainderRow &&
                        !isEligibleForChoice}
                      class:scry-card--drop-target={cardDroppable.isDropTarget &&
                        (activeScryDragCardId === null || canDropDraggedHere)}
                      data-testid={`destination-card-${destination.id}-${cardId}`}
                      onclick={() => handleCardTap(cardId)}
                      onkeydown={(e) => handleScryCardKeydown(cardId, e)}
                      {@attach cardDroppable.attach}
                      {@attach draggable.attach}
                    >
                      {#if card}
                        <div class="scry-card__art">
                          <LorcanaCard
                            {card}
                            isMasked={card.isMasked}
                            useContainerSize
                            imageFormat={SCRY_CARD_IMAGE_FORMAT}
                            showHoverCard={false}
                          />
                        </div>
                      {:else}
                        <div class="scry-card__fallback">
                          <p class="scry-card__title">{fallbackLabel}</p>
                        </div>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>

              {#if isMobileLayout}
                <button
                  type="button"
                  class="mobile-scry-scroll-button mobile-scry-scroll-button--right"
                  aria-label={`Scroll ${destination.label ?? getScryZoneLabel(destination.zone)} right`}
                  disabled={(hiddenCardsByZone[destination.id]?.right ?? 0) ===
                    0}
                  onclick={() => {
                    scrollRow(destination.id, 'right');
                  }}
                >
                  <ChevronRightIcon class="size-4" />
                </button>
              {/if}
            </div>

            {#if destination.orderingEnabled && destination.currentCardIds.length >= 2}
              <div class="scry-row__order-label">
                {destination.zone === 'deck-bottom'
                  ? 'Drawn first →'
                  : 'Drawn last →'}
              </div>
            {/if}
          </section>
        {/each}
        {#if revealedScryEntries.length > 0}
          <section
            class="scry-row scry-row--unassigned scry-row--revealed"
            class:scry-row--mobile-scroll={isMobileLayout}
            data-testid="scry-revealed-pool"
          >
            <header class="scry-row__header">
              <div class="scry-row__copy">
                <div class="scry-row__title-line">
                  <div class="scry-row__title-main">
                    <h3>{m['sim.actions.scry.revealedCards']({})}</h3>
                    <span class="scry-row__detail"
                      >{m['sim.actions.scry.revealedStripHint']({})}</span
                    >
                  </div>
                </div>
              </div>
              <div class="scry-row__stats">
                <span class="scry-row__count">{revealedScryEntries.length}</span
                >
              </div>
            </header>

            <div class="scry-row__cards-shell">
              <div class="scry-row__cards" data-testid="scry-revealed-cards">
                {#each revealedScryEntries as entry (entry.cardId)}
                  {@const cardId = String(entry.cardId)}
                  {@const card = getEntryCard(cardId)}
                  {@const assignedElsewhere = entry.currentDestinationId !== null}
                  {@const draggable = createSafeDraggable(
                    buildScryDragId(cardId),
                    false,
                  )}

                  <div class="scry-card-slot">
                    <div
                      role="button"
                      tabindex="0"
                      class="scry-card scry-card--unassigned"
                      class:scry-card--assigned-in-strip={assignedElsewhere}
                      data-testid={`revealed-scry-card-${cardId}`}
                      onclick={() => handleCardTap(cardId)}
                      onkeydown={(e) => handleScryCardKeydown(cardId, e)}
                      {@attach draggable.attach}
                    >
                      {#if card}
                        <div class="scry-card__art">
                          <LorcanaCard
                            {card}
                            isMasked={card.isMasked}
                            useContainerSize
                            imageFormat={SCRY_CARD_IMAGE_FORMAT}
                            showHoverCard={false}
                          />
                        </div>
                      {:else}
                        <div class="scry-card__fallback">
                          <p class="scry-card__title">{entry.label}</p>
                        </div>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </section>
        {/if}
      </div>

      {#if bodyguardEntryMode}
        <section
          class="scry-overlay__bodyguard"
          data-testid="scry-bodyguard-entry-mode"
        >
          <p class="scry-overlay__bodyguard-label">
            Bodyguard — may enter play exerted?
          </p>
          <div class="scry-overlay__bodyguard-actions">
            <button
              type="button"
              class="scry-overlay__bodyguard-button"
              class:scry-overlay__bodyguard-button--active={bodyguardEntryMode.selected === true}
              data-testid="scry-bodyguard-enter-exerted-yes"
              onclick={() => onSelectBodyguardEntryMode?.(true)}
            >
              Yes, enter exerted
            </button>
            <button
              type="button"
              class="scry-overlay__bodyguard-button"
              class:scry-overlay__bodyguard-button--active={bodyguardEntryMode.selected === false}
              data-testid="scry-bodyguard-enter-exerted-no"
              onclick={() => onSelectBodyguardEntryMode?.(false)}
            >
              No, enter ready
            </button>
          </div>
        </section>
      {/if}

      <footer class="scry-overlay__footer">
        <button
          type="button"
          class="scry-footer-button scry-footer-button--ghost"
          onclick={onDismiss}
        >
          {m['sim.actions.cancel']({})}
        </button>
        <button
          type="button"
          class="scry-footer-button scry-footer-button--primary"
          disabled={!canConfirm ||
            (bodyguardEntryMode !== null && bodyguardEntryMode.selected === null)}
          data-testid="scry-confirm-button"
          onclick={onConfirm}
        >
          {m['sim.actions.confirm']({})}
        </button>
      </footer>
    </div>
  {/if}
</section>

<style>
  .scry-overlay {
    position: absolute;
    width: min(34rem, calc(100% - 1.5rem));
    max-height: min(68vh, 38rem);
    z-index: 80;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    min-height: 0;
    padding: clamp(0.8rem, 2vw, 1rem);
    overflow: hidden;
    border: 1px solid rgba(175, 202, 167, 0.28);
    border-radius: 1.35rem;
    background: linear-gradient(
        145deg,
        rgba(12, 25, 28, 0.96),
        rgba(22, 44, 48, 0.98)
      ),
      rgba(8, 15, 17, 0.96);
    box-shadow: 0 24px 60px rgba(2, 6, 23, 0.42);
    color: #edf7ef;
    backdrop-filter: blur(10px);
  }

  .scry-overlay--dragging {
    box-shadow: 0 28px 80px rgba(2, 6, 23, 0.5);
  }

  .scry-overlay--minimized {
    width: min(21rem, calc(100% - 1rem));
    gap: 0;
  }

  .scry-overlay__header {
    flex: 0 0 auto;
    display: grid;
    gap: 0.25rem;
    min-width: 0;
  }

  /* Scroll region + footer: flex column so the footer stays inside the panel and the body scrolls. */
  .scry-overlay__card {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 0;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
  }

  .scry-overlay__header-main {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.75rem;
    align-items: start;
  }

  .scry-overlay__header-copy,
  .scry-overlay__controls {
    display: flex;
  }

  .scry-overlay__header-copy {
    min-width: 0;
    flex: 1 1 auto;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .scry-overlay__source {
    display: flex;
    align-items: flex-end;
    gap: 0.45rem;
    flex: 0 0 auto;
  }

  .scry-overlay__source-card {
    --scry-source-width: 3.25rem;
    --zone-card-width: var(--scry-source-width);
    --zone-card-height: calc(
      var(--scry-source-width) / var(--scry-card-aspect-ratio)
    );
    width: var(--scry-source-width);
    height: var(--zone-card-height);
    padding: 0;
    border: 1px solid rgba(190, 225, 195, 0.2);
    border-radius: 0.8rem;
    overflow: hidden;
    background: rgba(6, 12, 14, 0.45);
    cursor: pointer;
  }

  .scry-overlay__source-preview {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    margin-bottom: 0.2rem;
    border: 1px solid rgba(190, 225, 195, 0.18);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    color: inherit;
    cursor: pointer;
  }

  .scry-overlay__header-text {
    display: grid;
    gap: 0.25rem;
  }

  .scry-overlay__controls {
    gap: 0.45rem;
    align-items: flex-start;
  }

  .scry-overlay__title-line,
  .scry-row__title-line {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  .scry-overlay__title-line {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .scry-overlay__title-block {
    display: grid;
    gap: 0.2rem;
    min-width: 0;
    flex: 1 1 auto;
  }

  .scry-overlay__subtitle {
    margin: 0;
    max-height: 5.25rem;
    overflow-y: auto;
    padding-right: 0.15rem;
    font-size: 0.78rem;
    line-height: 1.38;
    font-weight: 500;
    color: rgba(225, 240, 228, 0.78);
  }

  .scry-row__title-line {
    justify-content: space-between;
    gap: 0.5rem;
  }

  .scry-row__title-main {
    display: flex;
    flex: 1 1 auto;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.45rem;
    min-width: 0;
  }

  .scry-overlay__control {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.3rem;
    height: 2.3rem;
    border: 1px solid rgba(190, 225, 195, 0.18);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    color: inherit;
    cursor: pointer;
  }

  .scry-overlay__help {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.7rem;
    height: 1.7rem;
    padding: 0;
    border: 1px solid rgba(190, 225, 195, 0.18);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    color: rgba(225, 240, 228, 0.82);
    cursor: help;
  }

  .scry-overlay__help--row {
    width: 1.45rem;
    height: 1.45rem;
  }

  .scry-overlay__control--drag {
    cursor: grab;
    touch-action: none;
  }

  .scry-overlay__control--drag:active {
    cursor: grabbing;
  }

  .scry-overlay__eyebrow {
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(194, 227, 198, 0.72);
  }

  .scry-overlay__title {
    margin: 0;
    font-size: clamp(1rem, 2.4vw, 1.25rem);
    font-weight: 700;
  }

  .scry-overlay__message {
    margin: 0;
    font-size: 0.84rem;
    line-height: 1.45;
    color: rgba(225, 240, 228, 0.8);
  }

  .scry-overlay__body {
    display: grid;
    flex: 1 1 auto;
    gap: 0.75rem;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0.65rem 0.7rem 0.5rem;
    padding-right: 0.35rem;
  }

  .scry-row {
    display: grid;
    gap: 0.7rem;
    padding: 0.8rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.045);
    border: 1px solid rgba(194, 227, 198, 0.12);
    transition:
      border-color 120ms ease-out,
      background-color 120ms ease-out,
      transform 120ms ease-out;
  }

  .scry-row--remainder {
    background: linear-gradient(
      180deg,
      rgba(95, 132, 100, 0.16),
      rgba(255, 255, 255, 0.035)
    );
  }

  .scry-row--drop-target {
    border-color: rgba(164, 222, 175, 0.58);
    background: rgba(122, 173, 131, 0.14);
  }

  .scry-row--drag-valid {
    border-color: rgba(164, 222, 175, 0.78);
    background: rgba(122, 173, 131, 0.18);
    box-shadow: 0 0 0 2px rgba(122, 173, 131, 0.28);
  }

  .scry-overlay--scry-card-drag .scry-row--drag-muted {
    opacity: 0.48;
    filter: saturate(0.65);
  }

  .scry-row--drag-valid.scry-row--drop-target {
    border-color: rgba(164, 222, 175, 0.82);
    background: rgba(122, 173, 131, 0.22);
  }

  .scry-row__header,
  .scry-row__copy {
    display: grid;
    gap: 0.2rem;
  }

  .scry-row__header {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.7rem;
    align-items: start;
  }

  .scry-row__title-line h3,
  .scry-card__title {
    margin: 0;
    font-weight: 700;
  }

  .scry-row__detail,
  .scry-row__hint,
  .scry-card__detail {
    margin: 0;
    font-size: 0.78rem;
    line-height: 1.4;
    color: rgba(225, 240, 228, 0.76);
  }

  .scry-row__badge,
  .scry-row__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 1.65rem;
    padding: 0.12rem 0.6rem;
    border-radius: 999px;
    background: rgba(201, 240, 208, 0.12);
    color: rgba(233, 248, 236, 0.92);
    font-size: 0.76rem;
    font-weight: 700;
  }

  .scry-row__cards {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    align-items: flex-start;
    min-height: 5.5rem;
  }

  .scry-row__cards--empty {
    min-height: 0;
    align-items: center;
  }

  .scry-row__cards--empty .scry-row__placeholder {
    min-height: 4rem;
    padding: 0.55rem 0.7rem;
  }

  .scry-row__cards-shell {
    position: relative;
  }

  .mobile-scry-scroll-button {
    position: absolute;
    top: 50%;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.7rem;
    height: 4rem;
    border: 1px solid rgba(147, 197, 253, 0.38);
    border-radius: 999px;
    background: linear-gradient(
        180deg,
        rgba(18, 32, 57, 0.98),
        rgba(8, 18, 31, 0.96)
      ),
      rgba(7, 18, 31, 0.96);
    box-shadow:
      0 10px 24px rgba(7, 18, 31, 0.42),
      0 0 0 1px rgba(191, 219, 254, 0.12) inset;
    color: rgba(241, 245, 249, 0.99);
    transform: translateY(-50%);
    cursor: pointer;
  }

  .mobile-scry-scroll-button:disabled {
    opacity: 0;
    pointer-events: none;
  }

  .mobile-scry-scroll-button--left {
    left: -1rem;
  }

  .mobile-scry-scroll-button--right {
    right: -1rem;
  }

  .scry-row__placeholder {
    display: grid;
    align-content: center;
    gap: 0.3rem;
    width: min(100%, 10.2rem);
    min-height: 6rem;
    padding: 0.85rem;
    border: 1px dashed rgba(201, 240, 208, 0.28);
    border-radius: 0.95rem;
    background: rgba(255, 255, 255, 0.028);
    color: rgba(233, 248, 236, 0.82);
    text-align: left;
  }

  .scry-row__placeholder-title {
    font-size: 0.84rem;
    font-weight: 700;
  }

  .scry-row__placeholder-detail {
    font-size: 0.74rem;
    line-height: 1.4;
    color: rgba(225, 240, 228, 0.72);
  }

  .scry-card {
    --scry-card-width: clamp(5.625rem, 22vw, 6.5rem);
    --scry-card-height: calc(
      var(--scry-card-width) / var(--scry-card-aspect-ratio)
    );
    --zone-card-width: var(--scry-card-width);
    --zone-card-height: var(--scry-card-height);
    position: relative;
    display: block;
    width: var(--scry-card-width);
    height: var(--scry-card-height);
    padding: 0;
    border: 1px solid rgba(190, 225, 195, 0.14);
    border-radius: 1rem;
    background: rgba(6, 12, 14, 0.3);
    color: inherit;
    text-align: left;
    cursor: pointer;
    transition:
      transform 120ms ease-out,
      border-color 120ms ease-out,
      background-color 120ms ease-out;
    overflow: visible;
  }

  .scry-card-slot {
    display: grid;
    gap: 0.35rem;
    justify-items: center;
    flex: 0 0 auto;
  }

  .scry-card-slot--mobile-controls {
    gap: 0.4rem;
  }

  .scry-card-slot__controls {
    display: flex;
    gap: 0.35rem;
  }

  .scry-card-shift-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: 1px solid rgba(190, 225, 195, 0.18);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    color: inherit;
    cursor: pointer;
  }

  .scry-card-shift-button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .scry-row__order-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: rgba(225, 240, 228, 0.45);
    user-select: none;
  }

  .scry-card:hover {
    transform: translateY(-2px);
    border-color: rgba(201, 240, 208, 0.34);
    background: rgba(255, 255, 255, 0.06);
  }

  .scry-card--remainder {
    background: rgba(56, 88, 62, 0.26);
  }

  /* Cards in the remainder zone get eligibility hints so the chooser can
     tell at a glance which ones a non-remainder destination will accept. */
  .scry-card--eligible {
    border-color: rgba(255, 215, 130, 0.7);
    box-shadow:
      0 0 0 2px rgba(255, 215, 130, 0.32),
      0 8px 22px rgba(255, 215, 130, 0.18);
  }

  .scry-card--eligible:hover {
    border-color: rgba(255, 222, 150, 0.9);
    box-shadow:
      0 0 0 2px rgba(255, 222, 150, 0.45),
      0 12px 28px rgba(255, 215, 130, 0.28);
  }

  .scry-card--ineligible {
    opacity: 0.55;
    filter: saturate(0.6);
  }

  .scry-row--unassigned {
    border-style: dashed;
    border-color: rgba(194, 227, 198, 0.22);
    background: rgba(255, 255, 255, 0.025);
  }

  .scry-card--unassigned {
    border-color: rgba(190, 225, 195, 0.28);
    background: rgba(255, 255, 255, 0.04);
  }

  .scry-card--assigned-in-strip {
    opacity: 0.92;
    border-color: rgba(190, 225, 195, 0.2);
  }

  .scry-card--drop-target {
    border-color: rgba(164, 222, 175, 0.62);
    background: rgba(122, 173, 131, 0.16);
  }

  .scry-card__art {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: inherit;
  }

  .scry-card__fallback {
    display: grid;
    gap: 0.3rem;
    width: 100%;
    height: 100%;
    padding: 0.7rem;
  }

  .scry-overlay__bodyguard {
    display: grid;
    gap: 0.4rem;
    padding: 0.6rem 0.75rem;
    border-top: 1px solid rgba(194, 227, 198, 0.14);
    background: rgba(8, 22, 36, 0.55);
  }

  .scry-overlay__bodyguard-label {
    margin: 0;
    color: #cbe8d2;
    font-size: 0.85rem;
    font-weight: 700;
  }

  .scry-overlay__bodyguard-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .scry-overlay__bodyguard-button {
    min-height: 2.25rem;
    padding: 0.4rem 0.85rem;
    border: 1px solid rgba(190, 225, 195, 0.22);
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.7);
    color: #e2e8f0;
    font: inherit;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
  }

  .scry-overlay__bodyguard-button--active {
    border-color: rgba(125, 211, 252, 0.85);
    background: linear-gradient(180deg, rgba(14, 116, 144, 0.85), rgba(8, 47, 73, 0.92));
    color: #f0f9ff;
  }

  .scry-overlay__footer {
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.55rem;
    padding: 0.65rem 0.75rem calc(0.65rem + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid rgba(194, 227, 198, 0.14);
  }

  .scry-footer-button {
    min-height: 2.5rem;
    padding: 0.65rem 0.95rem;
    border: 1px solid rgba(190, 225, 195, 0.22);
    border-radius: 999px;
    color: #f3fdf5;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .scry-footer-button:hover {
    background: rgba(201, 240, 208, 0.14);
  }

  .scry-footer-button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .scry-footer-button--primary {
    background: linear-gradient(
      180deg,
      rgba(125, 180, 111, 0.96),
      rgba(71, 118, 65, 0.96)
    );
  }

  .scry-footer-button--ghost {
    background: transparent;
  }

  @media (max-width: 699px) {
    .scry-overlay {
      width: min(25rem, calc(100% - 2rem));
      max-height: min(52vh, 30rem);
      gap: 0.65rem;
      padding: 0.75rem;
      border-radius: 1rem;
    }

    .scry-overlay--minimized {
      width: min(18rem, calc(100% - 2rem));
    }

    .scry-overlay__header-main {
      gap: 0.5rem;
    }

    .scry-overlay__header-copy {
      gap: 0.55rem;
    }

    .scry-overlay__source-card {
      --scry-source-width: 2.6rem;
    }

    .scry-overlay__title {
      font-size: 1rem;
    }

    .scry-overlay__message {
      font-size: 0.78rem;
    }

    .scry-overlay__body {
      gap: 0.6rem;
      padding: 0.55rem 0.6rem 0.45rem;
      padding-right: 0.3rem;
    }

    .scry-row {
      gap: 0.55rem;
      padding: 0.65rem;
      border-radius: 0.9rem;
    }

    .scry-row__detail,
    .scry-row__hint,
    .scry-card__detail {
      font-size: 0.72rem;
    }

    .scry-row__cards {
      flex-wrap: nowrap;
      justify-content: flex-start;
      gap: 0.5rem;
      min-height: 4.2rem;
      overflow-x: auto;
      overflow-y: hidden;
      padding-inline: 1.5rem;
      scroll-behavior: smooth;
      scrollbar-width: none;
      /* Horizontal scroll lives on the row; cards use none so vertical drags reach other rows. */
      touch-action: pan-x pinch-zoom;
    }

    .scry-row__cards--empty {
      min-height: 0;
      padding-inline: 0.25rem;
    }

    .scry-row__cards::-webkit-scrollbar {
      display: none;
    }

    .scry-card {
      --scry-card-width: min(21vw, 4.85rem);
      touch-action: none;
    }

    .scry-card-slot__controls {
      gap: 0.25rem;
    }

    .scry-card-shift-button {
      width: 1.9rem;
      height: 1.9rem;
      background: rgba(12, 25, 28, 0.92);
      box-shadow: 0 6px 16px rgba(2, 6, 23, 0.22);
    }

    .mobile-scry-scroll-button {
      width: 2.45rem;
      height: 3.8rem;
    }

    .mobile-scry-scroll-button--left {
      left: -0.55rem;
    }

    .mobile-scry-scroll-button--right {
      right: -0.55rem;
    }

    .scry-overlay__footer {
      gap: 0.45rem;
      padding: 0.55rem 0.65rem calc(0.55rem + env(safe-area-inset-bottom, 0px));
    }

    .scry-footer-button {
      min-height: 2.25rem;
      padding: 0.55rem 0.8rem;
    }
  }
</style>
