<script lang="ts">
import CrosshairIcon from "@lucide/svelte/icons/crosshair";
import GripIcon from "@lucide/svelte/icons/grip";
import { onMount, tick } from "svelte";
import { m } from "$lib/i18n/messages.js";
import CardTextWithSymbols from "@/design-system/simulator/cards/CardTextWithSymbols.svelte";
import CardImage from "@/design-system/simulator/cards/CardImage.svelte";
import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
import { maybeUseSimulatorCardContext } from "@/features/simulator/context/simulator-card-context.svelte.js";
import type {
	Interaction,
	InteractionSelectChoice,
	PlayerInteractionView,
} from "@tcg/lorcana-interaction";

interface ChoiceResolutionOverlayProps {
	/** Renderer-agnostic view derived from the engine's projected board. */
	view: PlayerInteractionView;
	/** Card that created the choice prompt. */
	sourceCard?: LorcanaCardSnapshot | null;
	/** Card already locked by an earlier step, if the choice is about a specific card. */
	targetCard?: LorcanaCardSnapshot | null;
	/** Index of the option currently highlighted in the UI session, or `null` if none picked yet. */
	selectedChoiceIndex: number | null;
	/** Called when the chooser picks an option. The renderer holds this in session state until confirm. */
	onSelectChoice?: (interaction: InteractionSelectChoice) => void;
	/** Called when the chooser confirms their pick. */
	onConfirm?: () => void;
	/** Called when the chooser dismisses the overlay (cancel / close). */
	onDismiss?: () => void;
}

let {
	view,
	sourceCard = null,
	targetCard = null,
	selectedChoiceIndex,
	onSelectChoice,
	onConfirm,
	onDismiss,
}: ChoiceResolutionOverlayProps = $props();

const simulatorCardContext = maybeUseSimulatorCardContext();

function handleOpenGlobalPreview(card: LorcanaCardSnapshot): void {
	simulatorCardContext?.openGlobalPreview(card);
}

function handleCardPreviewEnter(card: LorcanaCardSnapshot | null): void {
	if (!card?.isMasked) {
		simulatorCardContext?.setExternalPreviewCard(card);
	}
}

function handleCardPreviewLeave(card: LorcanaCardSnapshot | null): void {
	if (
		card &&
		!card.isMasked &&
		simulatorCardContext?.previewCard?.cardId === card.cardId
	) {
		simulatorCardContext?.setExternalPreviewCard(null);
	}
}

const choiceInteractions = $derived(
	view.interactions.filter(
		(interaction): interaction is InteractionSelectChoice =>
			interaction.kind === "select-choice",
	),
);
const canConfirm = $derived(selectedChoiceIndex !== null);
const targetCardText = $derived(targetCard?.text?.trim() ?? "");
const sourceAbilityTitle = $derived(
	sourceCard?.textEntries?.find((entry) => entry.title.trim())?.title.trim() ?? "",
);

const OVERLAY_PADDING = 8;

let overlayElement: HTMLElement | null = null;
let overlayPosition = $state({
	x: OVERLAY_PADDING,
	y: OVERLAY_PADDING,
});
let isDraggingOverlay = $state(false);

let dragPointerId: number | null = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function clampOverlayPosition(x: number, y: number): { x: number; y: number } {
	if (!overlayElement) {
		return { x, y };
	}

	const parent = overlayElement.offsetParent;
	if (!(parent instanceof HTMLElement)) {
		return { x, y };
	}

	const maxX = Math.max(
		OVERLAY_PADDING,
		parent.clientWidth - overlayElement.offsetWidth - OVERLAY_PADDING,
	);
	const maxY = Math.max(
		OVERLAY_PADDING,
		parent.clientHeight - overlayElement.offsetHeight - OVERLAY_PADDING,
	);

	return {
		x: Math.min(Math.max(OVERLAY_PADDING, x), maxX),
		y: Math.min(Math.max(OVERLAY_PADDING, y), maxY),
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
	overlayPosition = clampOverlayPosition(overlayPosition.x, overlayPosition.y);
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

function handleSelect(interaction: InteractionSelectChoice): void {
	if (!interaction.legal) return;
	onSelectChoice?.(interaction);
	onConfirm?.();
}

function handlePointerUp(e: PointerEvent): void {
	stopOverlayDrag(e.pointerId);
}

function handlePointerCancel(e: PointerEvent): void {
	stopOverlayDrag(e.pointerId);
}

onMount(() => {
	void centerOverlay();

	window.addEventListener("pointermove", handleOverlayPointerMove);
	window.addEventListener("pointerup", handlePointerUp);
	window.addEventListener("pointercancel", handlePointerCancel);
	window.addEventListener("resize", handleWindowResize);

	return () => {
		window.removeEventListener("pointermove", handleOverlayPointerMove);
		window.removeEventListener("pointerup", handlePointerUp);
		window.removeEventListener("pointercancel", handlePointerCancel);
		window.removeEventListener("resize", handleWindowResize);
	};
});
</script>

<section
  class="choice-overlay"
  class:choice-overlay--dragging={isDraggingOverlay}
  data-testid="choice-resolution-overlay"
  bind:this={overlayElement}
  style={`left: ${overlayPosition.x}px; top: ${overlayPosition.y}px;`}
>
  <header class="choice-overlay__header">
    <div class="choice-overlay__header-main">
      <div class="choice-overlay__header-text">
        <h2 class="choice-overlay__title">Choose outcome</h2>
        {#if sourceCard}
          <div class="choice-overlay__source">
            <button
              type="button"
              class="choice-overlay__source-art"
              aria-label={`Open ${sourceCard.label} preview`}
              onpointerenter={() => handleCardPreviewEnter(sourceCard)}
              onpointerleave={() => handleCardPreviewLeave(sourceCard)}
              onclick={() => handleOpenGlobalPreview(sourceCard)}
            >
              <CardImage
                set={sourceCard.set ?? ""}
                number={sourceCard.cardNumber ?? 0}
                crop="art_and_name"
                alt={sourceCard.label}
              />
            </button>
            <button
              type="button"
              class="choice-overlay__source-copy choice-overlay__text-preview"
              aria-label={`Open ${sourceCard.label} preview`}
              onpointerenter={() => handleCardPreviewEnter(sourceCard)}
              onpointerleave={() => handleCardPreviewLeave(sourceCard)}
              onclick={() => handleOpenGlobalPreview(sourceCard)}
            >
              <span class="choice-overlay__source-kicker">From</span>
              <span class="choice-overlay__source-label">{sourceCard.label}</span>
              {#if sourceAbilityTitle}
                <span class="choice-overlay__source-ability">{sourceAbilityTitle}</span>
              {/if}
            </button>
          </div>
        {/if}
      </div>

      <button
        type="button"
        class="choice-overlay__drag-handle"
        aria-label="Drag overlay"
        onpointerdown={handleOverlayPointerDown}
      >
        <GripIcon class="size-4" />
      </button>
    </div>
  </header>

  {#if targetCard}
    <div class="choice-overlay__target">
      <div
        class="choice-overlay__target-art"
        role="button"
        tabindex="0"
        aria-label={`Open ${targetCard.label} preview`}
        onpointerenter={() => handleCardPreviewEnter(targetCard)}
        onpointerleave={() => handleCardPreviewLeave(targetCard)}
        onclick={() => handleOpenGlobalPreview(targetCard!)}
        onkeydown={(e) => (e.key === "Enter" || e.key === " ") && handleOpenGlobalPreview(targetCard!)}
        title={targetCard.label}
      >
        <CardImage
          set={targetCard.set ?? ""}
          number={targetCard.cardNumber ?? 0}
          crop="art_and_name"
          alt={targetCard.label}
        />
      </div>
      <button
        type="button"
        class="choice-overlay__target-info choice-overlay__text-preview"
        aria-label={`Open ${targetCard.label} preview`}
        onpointerenter={() => handleCardPreviewEnter(targetCard)}
        onpointerleave={() => handleCardPreviewLeave(targetCard)}
        onclick={() => handleOpenGlobalPreview(targetCard)}
      >
        <span class="choice-overlay__target-icon">
          <CrosshairIcon size={14} />
        </span>
        <span class="choice-overlay__target-kicker">Selected</span>
        <span class="choice-overlay__target-label">{targetCard.label}</span>
      </button>
      {#if targetCardText}
        <button
          type="button"
          class="choice-overlay__target-text choice-overlay__text-preview"
          aria-label={`Open ${targetCard.label} preview`}
          onpointerenter={() => handleCardPreviewEnter(targetCard)}
          onpointerleave={() => handleCardPreviewLeave(targetCard)}
          onclick={() => handleOpenGlobalPreview(targetCard)}
        >
          <CardTextWithSymbols text={targetCardText} />
        </button>
      {/if}
    </div>
  {/if}

  <div class="choice-overlay__body">
    {#each choiceInteractions as interaction (interaction.index)}
      <button
        type="button"
        class="choice-option"
        class:choice-option--selected={selectedChoiceIndex === interaction.index}
        disabled={!interaction.legal}
        onclick={() => handleSelect(interaction)}
      >
        <CardTextWithSymbols text={interaction.label} />
      </button>
    {/each}
  </div>

  <footer class="choice-overlay__footer">
    <button
      type="button"
      class="choice-footer-button choice-footer-button--ghost"
      onclick={onDismiss}
    >
      {m["sim.actions.cancel"]({})}
    </button>
    <button
      type="button"
      class="choice-footer-button choice-footer-button--primary"
      disabled={!canConfirm}
      data-testid="choice-confirm-button"
      onclick={onConfirm}
    >
      {m["sim.actions.confirm"]({})}
    </button>
  </footer>
</section>

<style>
  .choice-overlay {
    position: absolute;
    width: min(22rem, calc(100% - 1.5rem));
    z-index: 80;
    display: grid;
    gap: 0.75rem;
    padding: clamp(0.8rem, 2vw, 1rem);
    border: 1px solid rgba(175, 202, 167, 0.28);
    border-radius: 1.35rem;
    background:
      linear-gradient(145deg, rgba(12, 25, 28, 0.96), rgba(22, 44, 48, 0.98)),
      rgba(8, 15, 17, 0.96);
    box-shadow: 0 24px 60px rgba(2, 6, 23, 0.42);
    color: #edf7ef;
    backdrop-filter: blur(10px);
  }

  .choice-overlay--dragging {
    box-shadow: 0 28px 80px rgba(2, 6, 23, 0.5);
  }

  .choice-overlay__header {
    display: grid;
    gap: 0.25rem;
  }

  .choice-overlay__header-main {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.75rem;
    align-items: start;
  }

  .choice-overlay__header-text {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    min-width: 0;
  }

  .choice-overlay__title {
    font-size: 0.9rem;
    font-weight: 700;
    line-height: 1.3;
    color: #edf7ef;
    margin: 0;
  }

  .choice-overlay__source {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.55rem;
    align-items: center;
    min-width: 0;
  }

  .choice-overlay__source-art {
    display: block;
    width: 2.65rem;
    border: 0;
    border-radius: 0.35rem;
    overflow: hidden;
    background: transparent;
    padding: 0;
    cursor: pointer;
    transition: box-shadow 0.12s ease;
  }

  .choice-overlay__source-art:hover,
  .choice-overlay__source-art:focus-visible {
    box-shadow: 0 0 0 2px rgba(125, 180, 111, 0.5);
    outline: none;
  }

  .choice-overlay__text-preview {
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
    padding: 0;
  }

  .choice-overlay__text-preview:focus-visible {
    outline: 2px solid rgba(125, 180, 111, 0.62);
    outline-offset: 3px;
  }

  .choice-overlay__source-copy {
    display: grid;
    gap: 0.1rem;
    min-width: 0;
  }

  .choice-overlay__source-kicker,
  .choice-overlay__target-kicker {
    color: rgba(193, 228, 197, 0.58);
    font-size: 0.66rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .choice-overlay__source-label,
  .choice-overlay__source-ability {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .choice-overlay__source-label {
    color: #edf7ef;
    font-size: 0.78rem;
    font-weight: 700;
  }

  .choice-overlay__source-copy:hover .choice-overlay__source-label,
  .choice-overlay__source-copy:focus-visible .choice-overlay__source-label,
  .choice-overlay__target-info:hover .choice-overlay__target-label,
  .choice-overlay__target-info:focus-visible .choice-overlay__target-label,
  .choice-overlay__target-text:hover,
  .choice-overlay__target-text:focus-visible {
    color: #f7fff8;
  }

  .choice-overlay__source-ability {
    color: rgba(193, 228, 197, 0.78);
    font-size: 0.72rem;
    font-weight: 650;
  }

  .choice-overlay__target {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.65rem;
    align-items: center;
    padding: 0.6rem;
    border: 1px solid rgba(190, 225, 195, 0.15);
    border-radius: 0.65rem;
    background: rgba(255, 255, 255, 0.03);
  }

  .choice-overlay__target-art {
    width: 3.2rem;
    border-radius: 0.35rem;
    overflow: hidden;
    cursor: pointer;
    flex-shrink: 0;
    transition: box-shadow 0.12s ease;
  }

  .choice-overlay__target-art:hover {
    box-shadow: 0 0 0 2px rgba(125, 180, 111, 0.5);
  }

  .choice-overlay__target-art:focus-visible {
    box-shadow: 0 0 0 2px rgba(125, 180, 111, 0.5);
    outline: none;
  }

  .choice-overlay__target-info {
    display: grid;
    grid-template-columns: auto auto minmax(0, 1fr);
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: rgba(193, 228, 197, 0.7);
    min-width: 0;
  }

  .choice-overlay__target-icon {
    flex-shrink: 0;
    opacity: 0.6;
  }

  .choice-overlay__target-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .choice-overlay__target-text {
    grid-column: 1 / -1;
    width: 100%;
    max-height: 5.75rem;
    overflow: auto;
    padding-top: 0.55rem;
    border-top: 1px solid rgba(190, 225, 195, 0.12);
    color: rgba(237, 247, 239, 0.82);
    font-size: 0.76rem;
    line-height: 1.35;
  }

  .choice-overlay__drag-handle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: 1px solid rgba(190, 225, 195, 0.18);
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.04);
    color: rgba(193, 228, 197, 0.6);
    cursor: grab;
    padding: 0;
    touch-action: none;
  }

  .choice-overlay__drag-handle:hover {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(193, 228, 197, 0.9);
  }

  .choice-overlay__drag-handle:active {
    cursor: grabbing;
  }

  .choice-overlay__body {
    display: grid;
    gap: 0.45rem;
  }

  .choice-option {
    display: block;
    width: 100%;
    padding: 0.7rem 0.95rem;
    border: 1px solid rgba(190, 225, 195, 0.18);
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.04);
    color: #edf7ef;
    font: inherit;
    font-size: 0.875rem;
    text-align: left;
    cursor: pointer;
    transition:
      background 0.12s ease,
      border-color 0.12s ease;
  }

  .choice-option:hover:not(:disabled) {
    background: rgba(190, 225, 195, 0.1);
    border-color: rgba(190, 225, 195, 0.3);
  }

  .choice-option--selected {
    background: rgba(125, 180, 111, 0.2);
    border-color: rgba(125, 180, 111, 0.5);
    color: #d6f0da;
  }

  .choice-option--selected:hover:not(:disabled) {
    background: rgba(125, 180, 111, 0.28);
  }

  .choice-option:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .choice-overlay__footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.55rem;
    padding-top: 0.1rem;
  }

  .choice-footer-button {
    min-height: 2.5rem;
    padding: 0.65rem 0.95rem;
    border: 1px solid rgba(190, 225, 195, 0.22);
    border-radius: 999px;
    color: #f3fdf5;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .choice-footer-button:hover {
    background: rgba(201, 240, 208, 0.14);
  }

  .choice-footer-button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .choice-footer-button--primary {
    background: linear-gradient(180deg, rgba(125, 180, 111, 0.96), rgba(71, 118, 65, 0.96));
  }

  .choice-footer-button--ghost {
    background: transparent;
  }

  @media (max-width: 699px) {
    .choice-overlay {
      width: min(18rem, calc(100% - 2rem));
      padding: 0.75rem;
      border-radius: 1rem;
    }
  }
</style>
