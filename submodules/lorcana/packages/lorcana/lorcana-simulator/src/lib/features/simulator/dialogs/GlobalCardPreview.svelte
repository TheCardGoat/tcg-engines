<script lang="ts">
  import ExpandIcon from "@lucide/svelte/icons/expand";
  import XIcon from "@lucide/svelte/icons/x";
  import * as Dialog from "$lib/design-system/primitives/dialog/index.js";
  import { IsTouchInteraction } from "$lib/hooks/is-touch-interaction.svelte.js";
  import { m } from "$lib/i18n/messages.js";
  import CardImage from "$lib/design-system/simulator/cards/CardImage.svelte";
  import { useSimulatorCardContext } from "@/features/simulator/context/simulator-card-context.svelte.js";

  const PREVIEW_WIDTH = 280;
  const PREVIEW_HEIGHT = 390;
  const LOCATION_ROTATION_OVERFLOW_X = (PREVIEW_HEIGHT - PREVIEW_WIDTH) / 2;
  const EDGE_PADDING = 0;

  const simulatorCardContext = useSimulatorCardContext();
  const isTouchInteraction = new IsTouchInteraction();
  const position = $derived(simulatorCardContext.previewPosition);

  let isDragging = $state(false);
  let dragStartOffset = $state({ x: 0, y: 0 });
  let previewRef: HTMLElement | null = $state(null);
  let dismissedPreviewCardId = $state<string | null>(null);
  let mobileExpanded = $state(false);

  function handlePreviewPointerDown(event: PointerEvent) {
    if (isTouchInteraction.current) return;
    if (!previewRef) return;

    isDragging = true;
    dragStartOffset = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };

    previewRef.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent) {
    if (isTouchInteraction.current) {
      return;
    }

    if (!isDragging) {
      return;
    }

    const newPosition = {
      x: event.clientX - dragStartOffset.x,
      y: event.clientY - dragStartOffset.y,
    };

    simulatorCardContext.setPreviewPosition(constrainToScreen(newPosition));
  }

  function handlePointerUp(event: PointerEvent) {
    if (isTouchInteraction.current) {
      return;
    }

    if (!previewRef) {
      return;
    }

    isDragging = false;
    previewRef.releasePointerCapture(event.pointerId);
  }

  function constrainToScreen(pos: { x: number; y: number }): { x: number; y: number } {
    if (typeof window === "undefined" || !previewRef) return pos;
    const rotationOverflowX = shouldRotatePreview ? LOCATION_ROTATION_OVERFLOW_X : 0;
    const minX = EDGE_PADDING + rotationOverflowX;

    const maxX = Math.max(
      minX,
      window.innerWidth - previewRef.offsetWidth - EDGE_PADDING - rotationOverflowX,
    );
    const maxY = Math.max(
      EDGE_PADDING,
      window.innerHeight - previewRef.offsetHeight - EDGE_PADDING,
    );

    return {
      x: Math.max(minX, Math.min(pos.x, maxX)),
      y: Math.max(EDGE_PADDING, Math.min(pos.y, maxY)),
    };
  }

  const isVisible = $derived(
    simulatorCardContext.previewCard !== null &&
      !simulatorCardContext.previewCard.isMasked &&
      simulatorCardContext.previewCard.cardId !== dismissedPreviewCardId,
  );
  const previewCard = $derived(simulatorCardContext.previewCard);
  const shouldRotatePreview = $derived(previewCard?.cardType === "location");
  const isTouchPreview = $derived(isTouchInteraction.current);
  const isMobilePreviewDialog = $derived(isTouchPreview && mobileExpanded);

  function handleMobilePreviewDialogOpenChange(open: boolean): void {
    if (!open) {
      mobileExpanded = false;
    }
  }

  function handleClosePreview(): void {
    dismissedPreviewCardId = simulatorCardContext.previewCard?.cardId ?? null;
    mobileExpanded = false;
    simulatorCardContext.closeGlobalPreview();
  }

  function handleExpandPreview(): void {
    mobileExpanded = true;
  }

  $effect(() => {
    const previewCardId = simulatorCardContext.previewCard?.cardId ?? null;
    if (previewCardId === null || previewCardId !== dismissedPreviewCardId) {
      dismissedPreviewCardId = null;
    }

    if (previewCardId === null) {
      mobileExpanded = false;
    }
  });

  $effect(() => {
    if (!isVisible) return;
    const constrained = constrainToScreen(position);
    if (constrained.x !== position.x || constrained.y !== position.y) {
      simulatorCardContext.setPreviewPosition(constrained);
    }
  });

  $effect(() => {
    if (!isVisible || isMobilePreviewDialog) {
      return;
    }

    const handleDocumentPointerDown = (event: PointerEvent) => {
      if (!simulatorCardContext.isGlobalPreviewOpen || !previewRef) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (previewRef.contains(target)) {
        return;
      }

      simulatorCardContext.closeGlobalPreview();
    };

    document.addEventListener("pointerdown", handleDocumentPointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", handleDocumentPointerDown, true);
    };
  });

</script>

{#if isVisible}
  {#if isMobilePreviewDialog}
    <Dialog.Root
      open={mobileExpanded}
      onOpenChange={handleMobilePreviewDialogOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay class="global-card-preview-mobile-overlay" />
        <Dialog.Content
          bind:ref={previewRef}
          class="global-card-preview global-card-preview--mobile z-[99999] w-auto max-w-[92vw] border-0 bg-transparent p-0 shadow-none"
          aria-label="Card preview panel"
          showCloseButton={false}
        >
          <Dialog.Close class="preview-close" aria-label={m["sim.preview.closeAria"]({})}>
            <XIcon class="size-4" />
          </Dialog.Close>

          <div class="preview-content" class:preview-content--rotated={shouldRotatePreview}>
            {#if previewCard?.set && previewCard?.cardNumber}
              <CardImage
                set={previewCard.set}
                number={previewCard.cardNumber}
                crop="full"
                alt={previewCard.label ?? "Card preview"}
                class="w-full h-full object-cover rounded-lg"
              />
            {/if}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  {:else}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      bind:this={previewRef}
      class="global-card-preview"
      class:global-card-preview--touch={isTouchPreview}
      class:dragging={isDragging}
      style:left={isTouchPreview ? undefined : `${position.x}px`}
      style:top={isTouchPreview ? undefined : `${position.y}px`}
      onpointermove={handlePointerMove}
      onpointerup={handlePointerUp}
      onpointercancel={handlePointerUp}
      role="dialog"
      aria-label="Card preview panel"
      tabindex="-1"
    >
      {#if !isTouchPreview}
        <button
          type="button"
          class="drag-handle"
          onpointerdown={handlePreviewPointerDown}
          aria-label="Drag card preview"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <circle cx="3" cy="3" r="1" />
            <circle cx="9" cy="3" r="1" />
            <circle cx="3" cy="9" r="1" />
            <circle cx="9" cy="9" r="1" />
            <circle cx="6" cy="6" r="1" />
          </svg>
        </button>
      {/if}

      {#if isTouchPreview}
        <button
          type="button"
          class="preview-expand"
          onclick={handleExpandPreview}
          aria-label="Expand card preview"
        >
          <ExpandIcon class="size-4" />
        </button>
      {/if}

      <button
        type="button"
        class="preview-close preview-close--desktop"
        onclick={handleClosePreview}
        aria-label={m["sim.preview.closeAria"]({})}
      >
        <XIcon class="size-4" />
      </button>

      <div class="preview-content" class:preview-content--rotated={shouldRotatePreview}>
        {#if previewCard?.set && previewCard?.cardNumber}
          <CardImage
            set={previewCard.set}
            number={previewCard.cardNumber}
            crop="full"
            alt={previewCard.label ?? "Card preview"}
            class="w-full h-full object-cover rounded-lg"
          />
        {/if}
      </div>
    </div>
  {/if}
{/if}

<style>
  .global-card-preview {
    --zone-card-width: 280px;
    --zone-card-height: 390px;
    position: fixed;
    width: fit-content;
    background: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    z-index: 99999;
    overflow: visible;
    pointer-events: auto;
    cursor: grab;
    touch-action: none;
  }

  .global-card-preview--touch {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: default;
    touch-action: auto;
  }

  .global-card-preview.dragging {
    cursor: grabbing;
  }

  .preview-content {
    padding: 0;
    display: flex;
    width: var(--zone-card-width);
  }

  .preview-content--rotated {
    transform: rotate(90deg);
  }

  .drag-handle {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 999px;
    background: rgba(10, 18, 32, 0.8);
    color: rgba(226, 232, 240, 0.9);
    cursor: grab;
    z-index: 1;
  }

  .preview-expand {
    position: absolute;
    top: 0.375rem;
    right: 2.625rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.28);
    background: rgba(15, 23, 42, 0.94);
    color: rgba(241, 245, 249, 0.98);
    box-shadow: 0 18px 45px rgba(2, 6, 23, 0.45);
    z-index: 1;
  }

  .preview-expand:hover {
    background: rgba(30, 41, 59, 0.98);
  }

  .drag-handle:hover {
    background: rgba(15, 24, 42, 0.92);
    color: rgba(248, 250, 252, 1);
  }

  :global(.global-card-preview-mobile-overlay) {
    z-index: 99998;
    background: rgba(2, 6, 23, 0.78);
    backdrop-filter: blur(8px);
  }

  :global(.global-card-preview--mobile) {
    --zone-card-width: min(82vw, 320px);
    --zone-card-height: calc(var(--zone-card-width) * 1.395);
    cursor: default;
  }

  :global(.global-card-preview--mobile .preview-content) {
    width: var(--zone-card-width);
    max-width: 100%;
  }

  :global(.preview-close) {
    position: absolute;
    top: 0.375rem;
    right: 0.375rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.28);
    background: rgba(15, 23, 42, 0.94);
    color: rgba(241, 245, 249, 0.98);
    box-shadow: 0 18px 45px rgba(2, 6, 23, 0.45);
  }

  :global(.preview-close:hover) {
    background: rgba(30, 41, 59, 0.98);
  }

  .preview-close--desktop {
    top: 0.375rem;
    right: 0.375rem;
    z-index: 1;
  }

  .global-card-preview.dragging .drag-handle {
    cursor: grabbing;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .global-card-preview {
      transition: none;
    }
  }
</style>
