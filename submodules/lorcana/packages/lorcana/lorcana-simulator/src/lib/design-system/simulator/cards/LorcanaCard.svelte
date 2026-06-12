<script lang="ts">
  import EyeIcon from "@lucide/svelte/icons/eye";
  import XIcon from "@lucide/svelte/icons/x";
  import type { LorcanaCardSnapshot } from "$lib/lorcana-simulator";
  import * as Popover from "$lib/design-system/primitives/popover/index.js";
  import CardBack from "@/design-system/simulator/cards/CardBack.svelte";
  import CardFace from "@/design-system/simulator/cards/CardFace.svelte";
  import CardHoverCardContent from "@/design-system/simulator/cards/CardHoverCardContent.svelte";
  import CardQuickMenuContent from "@/design-system/simulator/cards/CardQuickMenuContent.svelte";
  import { m } from "$lib/i18n/messages.js";
  import {
    CARD_IMAGE_ASPECT_RATIOS,
    CARD_IMAGE_DIMENSIONS,
    type ImageFormat,
  } from "@/design-system/simulator/cards/card-image-format.js";
  import { cardHoverCardRegistry } from "@/design-system/simulator/cards/card-hover-card-registry.svelte.js";
  import {
    maybeUseSimulatorCardContext,
    type SimulatorCardContextValue,
  } from "@/features/simulator/context/simulator-card-context.svelte.js";
  import { SimulatorLayoutModeObserver } from "@/features/simulator/model/layout-mode.svelte.js";
  import {
    maybeUseLorcanaSidebarPresenter,
    type LorcanaSidebarPresenter,
  } from "@/features/simulator/context/game-context.svelte.js";
  import {
    useCardInteractionContext,
    type CardInteractionMeta,
  } from "@/features/simulator/context/card-interaction-context.svelte.js";

  // Size scale factors (based on full card 734x1024)
  // These scale the actual dimensions to the desired display size
  type CardSize =
    | "micro"
    | "tiny"
    | "small"
    | "small-plus"
    | "medium"
    | "large"
    | "x-large";
  const SIZE_SCALES: Record<CardSize, number> = {
    micro: 1 / 12,
    tiny: 1 / 8,
    small: 1 / 6,
    "small-plus": 1 / 4,
    medium: 1 / 2,
    large: 1,
    "x-large": 5 / 4,
  };

  interface LorcanaCardProps {
    // Card data
    card?: LorcanaCardSnapshot;
    ownerId?: string | null;

    // Display mode - if true, shows card back (for masked/face-down cards)
    isMasked?: boolean;

    // Size variant
    size?: CardSize;

    // Use CSS variables from parent container for sizing (--zone-card-width/height)
    useContainerSize?: boolean;

    // Image format (for card face with images)
    imageFormat?: ImageFormat;

    // Visual states
    isSelected?: boolean;
    isExerted?: boolean;
    isGhost?: boolean;
    isDraggable?: boolean;
    isPlayable?: boolean;
    isValidTarget?: boolean;
    isInvalidTarget?: boolean;
    isBanishedPreview?: boolean;
    isQuesting?: boolean;
    isDrying?: boolean;
    tagCollapseMode?: "none" | "hover-stack";
    /** Suppress the card's internal stat pills. Use when the host
     * renders stats externally (e.g. play-zone bands). */
    hideStatBadges?: boolean;
    /** Override the automatic "hide supplemental badges on mobile" rule.
     * When set, this value wins. Use to hide the card's internal tag
     * strip when the host renders tags externally. */
    hideSupplementalBadges?: boolean;

    // Card properties (can be derived from card or overridden)
    damage?: number;

    // Unified interaction metadata for global context dispatch
    interactionMeta?: CardInteractionMeta;
    onSelect?: (card: LorcanaCardSnapshot, event: MouseEvent) => boolean | void;

    // Hover card configuration
    showHoverCard?: boolean;
    hoverShowActions?: boolean;
    hoverAvailableInk?: number;
    clickOpensHover?: boolean;
    onDragStart?: (event: DragEvent) => void;
  }

  let {
    card,
    ownerId,
    isMasked = false,
    size = "medium",
    useContainerSize = false,
    imageFormat = "full",
    isSelected = false,
    isExerted = false,
    isGhost = false,
    isDraggable: _isDraggable = false,
    isPlayable = false,
    isValidTarget = false,
    isInvalidTarget = false,
    isBanishedPreview = false,
    isQuesting = false,
    isDrying = false,
    tagCollapseMode = "none",
    hideStatBadges = false,
    hideSupplementalBadges: hideSupplementalBadgesProp,
    damage: propDamage,
    interactionMeta,
    onSelect,
    showHoverCard = true,
    hoverShowActions = false,
    hoverAvailableInk = 0,
    clickOpensHover = true,
    onDragStart: _onDragStart,
  }: LorcanaCardProps = $props();

  // Derived values from card if available
  const damage = $derived(propDamage ?? card?.damage ?? 0);
  const isDryingState = $derived(isDrying || card?.isDrying || false);
  const isExertedState = $derived(
    isExerted || card?.readyState === "exerted" || false,
  );
  const cardInteraction = useCardInteractionContext();
  const simulatorCardContextFallback: Pick<
    SimulatorCardContextValue,
    | "inspectedCard"
    | "canSelectCard"
    | "openCardInspect"
    | "closeCardInspect"
    | "openGlobalPreview"
  > = {
    inspectedCard: null,
    canSelectCard: () => false,
    openCardInspect: () => {},
    closeCardInspect: () => {},
    openGlobalPreview: () => {},
  };
  const simulatorCardContext =
    maybeUseSimulatorCardContext() ?? simulatorCardContextFallback;
  const layout = new SimulatorLayoutModeObserver();
  const sidebarFallback: Pick<
    LorcanaSidebarPresenter,
    | "actionSelectionSession"
    | "cardPreviewMode"
    | "cardInfoMode"
    | "getActionSessionCardReason"
    | "getCardActionViews"
    | "handleCardActionClick"
    | "handleCardInfoModeChange"
    | "resolutionSelectionSession"
  > = {
    actionSelectionSession: null,
    cardPreviewMode: "immediate",
    cardInfoMode: "detailed",
    getActionSessionCardReason: () => null,
    getCardActionViews: () => [],
    handleCardActionClick: () => false,
    handleCardInfoModeChange: () => {},
    resolutionSelectionSession: null,
  };
  const sidebar = maybeUseLorcanaSidebarPresenter() ?? sidebarFallback;
  const instanceKey = Symbol();
  let hoverCardOpen = $state(false);
  let mobileCardAnchor = $state<HTMLElement | null>(null);
  const resolvedInteractionMeta = $derived<CardInteractionMeta | undefined>(
    card
      ? {
          cardId: card.cardId,
          ownerSide: card.ownerSide,
          zoneId: card.zoneId,
          ...interactionMeta,
          ...(!showHoverCard
            ? {
                suppressInspectOnSelect:
                  interactionMeta?.suppressInspectOnSelect ?? true,
              }
            : {}),
        }
      : interactionMeta,
  );
  const shouldUseTouchInspect = $derived(layout.current === "mobile");
  const isTouchInspectCard = $derived.by(
    () =>
      Boolean(card) &&
      simulatorCardContext.inspectedCard?.cardId === card?.cardId,
  );
  const isChallengeTargetSelectionActive = $derived(
    sidebar.actionSelectionSession?.categoryId === "challenge" &&
      sidebar.actionSelectionSession.phase === "choose-target",
  );
  const shouldRenderHoverCard = $derived(
    showHoverCard &&
      !isChallengeTargetSelectionActive &&
      (!shouldUseTouchInspect || isTouchInspectCard),
  );
  const hoverContextMessage = $derived(
    shouldRenderHoverCard && isTouchInspectCard && card
      ? sidebar.getActionSessionCardReason(card.cardId)
      : null,
  );
  const hoverActions = $derived(
    shouldRenderHoverCard && isTouchInspectCard && hoverShowActions && card
      ? sidebar.getCardActionViews(card)
      : [],
  );
  const shouldRenderPopover = $derived(
    showHoverCard && hoverCardOpen && !isChallengeTargetSelectionActive,
  );
  const isPreviewOpen = $derived(isTouchInspectCard);
  const hideSupplementalBadges = $derived(
    hideSupplementalBadgesProp ?? layout.current === "mobile",
  );


  // Calculate actual display dimensions based on image format and size
  const { width, height } = $derived(CARD_IMAGE_DIMENSIONS[imageFormat]);
  const scale = $derived(SIZE_SCALES[size]);
  const displayWidth = $derived(Math.round(width * scale));
  const displayHeight = $derived(Math.round(height * scale));

  function handlePointerEnter(event: MouseEvent): void {
    if (!card) {
      return;
    }

    cardInteraction?.handleHover({
      card,
      event,
      meta: resolvedInteractionMeta,
    });
  }

  function handlePointerLeave(): void {
    cardInteraction?.handleLeave({
      card,
      meta: resolvedInteractionMeta,
    });
  }

  function handleSelect(event: MouseEvent): void {
    if (!card) {
      return;
    }

    if (
      showHoverCard &&
      clickOpensHover &&
      !sidebar.actionSelectionSession &&
      !sidebar.resolutionSelectionSession &&
      !simulatorCardContext.canSelectCard(card, resolvedInteractionMeta)
    ) {
      event.stopPropagation();
      simulatorCardContext.openCardInspect({ card, meta: resolvedInteractionMeta });
      return;
    }

    if (onSelect?.(card, event) === true) {
      return;
    }

    cardInteraction?.handleSelect({
      card,
      event,
      meta: resolvedInteractionMeta,
    });
  }

  function handleCardFacePointerEnter(
    event: CustomEvent<{ event: MouseEvent }>,
  ): void {
    handlePointerEnter(event.detail.event);
  }

  function handleCardFacePointerLeave(): void {
    handlePointerLeave();
  }

  function handleCardFaceSelect(
    event: CustomEvent<{ event: MouseEvent }>,
  ): void {
    handleSelect(event.detail.event);
  }

  function handleCardFaceContextMenu(
    event: CustomEvent<{ event: MouseEvent }>,
  ): void {
    if (!card) return;
    cardInteraction?.handleContextMenu?.({
      card,
      event: event.detail.event,
      meta: resolvedInteractionMeta,
    });
  }

  function handleHoverCardClose(): void {
    simulatorCardContext.closeCardInspect();
    hoverCardOpen = false;
  }

  function handlePopoverOpenChange(open: boolean): void {
    if (!open && isTouchInspectCard) {
      simulatorCardContext.closeCardInspect();
    }
  }

  function handleOpenPreview(): void {
    if (!card) {
      return;
    }

    simulatorCardContext.openGlobalPreview(card);
  }

  $effect(() => {
    if (!shouldRenderHoverCard || !card) {
      hoverCardOpen = false;
    }
  });

  $effect(() => {
    if (!card) {
      return;
    }

    if (isTouchInspectCard) {
      hoverCardOpen = true;
      return;
    }

    if (hoverCardOpen) {
      hoverCardOpen = false;
    }
  });

  $effect(() => {
    if (!card || !hoverCardOpen) {
      return;
    }

    cardHoverCardRegistry.open(instanceKey);
  });

  $effect(() => {
    if (!card || !hoverCardOpen) {
      return;
    }

    if (cardHoverCardRegistry.activeKey !== instanceKey) {
      hoverCardOpen = false;
    }
  });

  $effect(() => {
    if (!card || hoverCardOpen) {
      return;
    }

    cardHoverCardRegistry.close(instanceKey);
  });
</script>

{#if isMasked}
  <CardBack
    ownerId={ownerId ?? card?.ownerId}
    {displayWidth}
    {displayHeight}
    {useContainerSize}
    {imageFormat}
    {isGhost}
    {isPlayable}
    isExerted={isExertedState}
    aspectRatio={CARD_IMAGE_ASPECT_RATIOS[imageFormat]}
  />
{:else if card}
  <Popover.Root bind:open={() => hoverCardOpen, handlePopoverOpenChange}>
    <div bind:this={mobileCardAnchor}>
      <CardFace
        {card}
        {displayWidth}
        {displayHeight}
        {useContainerSize}
        {size}
        {imageFormat}
        {isSelected}
        isExerted={isExertedState}
        {isGhost}
        {isPlayable}
        {isValidTarget}
        {isInvalidTarget}
        {isBanishedPreview}
        {isQuesting}
        isDrying={isDryingState}
        {damage}
        {tagCollapseMode}
        {hideSupplementalBadges}
        {hideStatBadges}
        aspectRatio={CARD_IMAGE_ASPECT_RATIOS[imageFormat]}
        on:pointerenter={handleCardFacePointerEnter}
        on:pointerleave={handleCardFacePointerLeave}
        on:select={handleCardFaceSelect}
        on:contextmenu={handleCardFaceContextMenu}
      />
    </div>
    {#if shouldRenderPopover}
      <Popover.Content
        customAnchor={mobileCardAnchor}
        align="start"
        sideOffset={8}
        collisionPadding={12}
        sticky="always"
        updatePositionStrategy="always"
        trapFocus={false}
        class="z-[70] overflow-visible border-0 bg-transparent p-0"
        style="--hover-card-max-height: calc(var(--bits-popover-content-available-height) - 1rem); width: min(22rem, calc(var(--bits-popover-content-available-width) - 1rem)); max-width: calc(var(--bits-popover-content-available-width) - 1rem); max-height: var(--hover-card-max-height);"
        onEscapeKeydown={() => simulatorCardContext.closeCardInspect()}
        onInteractOutside={() => simulatorCardContext.closeCardInspect()}
      >
        <div class="max-h-[var(--hover-card-max-height)] overflow-visible p-[3px]">
          {#if sidebar.cardInfoMode === "quick"}
            <CardQuickMenuContent
              {card}
              actions={hoverShowActions ? hoverActions : []}
              contextMessage={hoverContextMessage}
              onAction={(action) => {
                const wasHandled = sidebar.handleCardActionClick(action, {
                  skipConfirmation: true,
                });
                if (wasHandled) {
                  simulatorCardContext.closeCardInspect();
                }
              }}
              onSwitchToDetailed={() => sidebar.handleCardInfoModeChange("detailed")}
            >
              {#snippet headerActions()}
                <button
                  type="button"
                  class="flex size-7 items-center justify-center rounded-full border border-white/15 bg-slate-900/80 text-slate-100 transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                  onclick={handleOpenPreview}
                  aria-label={`Open full preview for ${card.label}`}
                  title="Open preview"
                >
                  <EyeIcon class="size-3.5" />
                </button>
                <button
                  type="button"
                  class="flex size-7 items-center justify-center rounded-full border border-white/15 bg-slate-900/80 text-slate-100 transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                  onclick={() => simulatorCardContext.closeCardInspect()}
                  aria-label={`Close ${card.label} details`}
                  title="Close"
                >
                  <XIcon class="size-3.5" />
                </button>
              {/snippet}
            </CardQuickMenuContent>
          {:else}
            <CardHoverCardContent
              {card}
              actions={hoverShowActions ? hoverActions : []}
              contextMessage={hoverContextMessage}
              onAction={(action) => {
                const wasHandled = sidebar.handleCardActionClick(action, {
                  skipConfirmation: true,
                });
                if (wasHandled) {
                  simulatorCardContext.closeCardInspect();
                }
              }}
            >
              {#snippet headerActions()}
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="flex size-8 items-center justify-center rounded-full border border-white/15 bg-slate-950/90 text-slate-100 shadow-lg transition-colors hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                    onclick={handleOpenPreview}
                    aria-label={`Open full preview for ${card.label}`}
                    title="Open preview"
                  >
                    <EyeIcon class="size-4" />
                  </button>
                  <button
                    type="button"
                    class="flex size-8 items-center justify-center rounded-full border border-white/15 bg-slate-950/90 text-slate-100 shadow-lg transition-colors hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                    onclick={() => simulatorCardContext.closeCardInspect()}
                    aria-label={`Close ${card.label} details`}
                    title="Close"
                  >
                    <XIcon class="size-4" />
                  </button>
                </div>
              {/snippet}
              {#snippet footerActions()}
                <button
                  type="button"
                  class="flex w-full items-center justify-center gap-1 text-xs text-slate-300 transition-colors hover:text-white"
                  onclick={() => sidebar.handleCardInfoModeChange("quick")}
                  data-testid="card-hover-switch-quick"
                >
                  {m["cardInfo.switchToQuick"]({})}
                </button>
              {/snippet}
            </CardHoverCardContent>
          {/if}
        </div>
      </Popover.Content>
    {/if}
  </Popover.Root>
{/if}
