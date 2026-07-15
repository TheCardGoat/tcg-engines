<script lang="ts">
import MapPinnedIcon from "@lucide/svelte/icons/map-pinned";
import MoveDiagonalIcon from "@lucide/svelte/icons/move-diagonal";
import * as Dialog from "$lib/design-system/primitives/dialog";
import { m } from "$lib/i18n/messages.js";

import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
import {
  maybeUseSimulatorCardContext,
  type SimulatorCardContextValue,
} from "@/features/simulator/context/simulator-card-context.svelte.js";
import type {
  LorcanaCardSnapshot,
  LorcanaPlayerSide,
  ResolutionAmountSelectionState,
} from "@/features/simulator/model/contracts.js";
import ResolutionAmountControls from "@/features/simulator/panels/ResolutionAmountControls.svelte";
import type {
  InteractionSelectCard,
  PlayerInteractionView,
  PromptSlot,
} from "@tcg/lorcana-interaction";

interface ResolutionTargetOverlayProps {
  /** Renderer-agnostic view derived from the engine's projected board. */
  view: PlayerInteractionView;
  /** Card snapshot lookup, owned by the board presenter. */
  cardSnapshotsById: Record<string, LorcanaCardSnapshot>;
  /** The local viewer's side; used to split candidates into your/opponent groups. */
  viewerSide: LorcanaPlayerSide | null;
  /** Amount controls — kept as a separate prop until `view.copy` exposes amount metadata. */
  amountSelection?: ResolutionAmountSelectionState | null;
  onSelectCard?: (cardId: string) => void;
  onSelectSlot?: (slotIndex: number) => void;
  onAmountChange?: (value: number) => void;
  onConfirm?: () => void;
  onDismiss?: () => void;
}

let {
  view,
  cardSnapshotsById,
  viewerSide,
  amountSelection = null,
  onSelectCard,
  onSelectSlot,
  onAmountChange,
  onConfirm,
  onDismiss,
}: ResolutionTargetOverlayProps = $props();

const simulatorCardContextFallback: Pick<
  SimulatorCardContextValue,
  "previewCard" | "setExternalPreviewCard"
> = {
  previewCard: null,
  setExternalPreviewCard: () => {},
};
const simulatorCardContext =
  maybeUseSimulatorCardContext() ?? simulatorCardContextFallback;

function getCard(cardId: string | null | undefined): LorcanaCardSnapshot | null {
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

const activePrompt = $derived(view.activePrompt);
const slottedKind = $derived(activePrompt?.expectedSlottedKind ?? null);
const sourceCardId = $derived(activePrompt?.sourceCardId ?? null);
const resolvedSourceCard = $derived(
  sourceCardId ? (cardSnapshotsById[sourceCardId as unknown as string] ?? null) : null,
);

/** Slots the chooser can interact with. Auto-resolved slots are hidden. */
const visibleSlots = $derived<PromptSlot[]>(
  (activePrompt?.slots ?? []).filter((slot) => !slot.autoResolved),
);

const candidateInteractions = $derived(
  view.interactions.filter(
    (interaction): interaction is InteractionSelectCard => interaction.kind === "select-card",
  ),
);

type CandidateRenderItem = {
  interaction: InteractionSelectCard;
  card: LorcanaCardSnapshot;
  selected: boolean;
};

function buildCandidateItems(
  interactions: readonly InteractionSelectCard[],
): CandidateRenderItem[] {
  const slotTargets = new Set(
    (activePrompt?.slots ?? [])
      .map((slot) => slot.targetCardId)
      .filter((id): id is NonNullable<typeof id> => id !== null),
  );
  return interactions.flatMap((interaction) => {
    const card = getCard(interaction.cardId as unknown as string);
    if (!card) return [];
    return [
      {
        interaction,
        card,
        selected: slotTargets.has(interaction.cardId),
      },
    ];
  });
}

const candidateItems = $derived(buildCandidateItems(candidateInteractions));

const yourCandidates = $derived(
  candidateItems.filter(
    (item) => viewerSide !== null && item.card.ownerSide === viewerSide,
  ),
);
const opponentCandidates = $derived(
  candidateItems.filter(
    (item) => viewerSide !== null && item.card.ownerSide !== viewerSide,
  ),
);
const showGroupLabels = $derived(yourCandidates.length > 0 && opponentCandidates.length > 0);

/**
 * Resolve the slot's user-facing label by routing the engine-emitted
 * `labelKey` through Paraglide. The view's `PromptSlot.labelKey` is a
 * closed `PromptKey` literal union; the renderer is the only layer
 * that translates them.
 */
function slotLabel(slot: PromptSlot): string {
  switch (slot.labelKey) {
    case "prompt.slot.move-damage.from":
      return m["prompt.slot.move-damage.from"]({});
    case "prompt.slot.move-damage.to":
      return m["prompt.slot.move-damage.to"]({});
    case "prompt.slot.move-to-location.subject":
      return m["prompt.slot.move-to-location.subject"]({});
    case "prompt.slot.move-to-location.location":
      return m["prompt.slot.move-to-location.location"]({});
    case "prompt.slot.shift-and-choose.chosen":
      return m["prompt.slot.shift-and-choose.chosen"]({});
    case "prompt.slot.banish-and-play.banish":
      return m["prompt.slot.banish-and-play.banish"]({});
    case "prompt.slot.banish-and-play.play":
      return m["prompt.slot.banish-and-play.play"]({});
    default:
      // Fallback for label keys the renderer doesn't yet handle (e.g.
      // a new prompt kind added to the engine before the simulator
      // gets matching messages). Keeps the UI usable instead of
      // crashing.
      return "Choose target";
  }
}

function slotPlaceholder(slot: PromptSlot): string {
  const target = slot.targetCardId ? getCard(slot.targetCardId as unknown as string) : null;
  if (target?.cardType === "location") return m["prompt.target.slot.placeholder.location"]({});
  return m["prompt.target.slot.placeholder.character"]({});
}

function categoryLabel(): string {
  switch (slottedKind) {
    case "move-damage":
      return "Move damage";
    case "move-to-location":
      return "Move to location";
    case "shift-and-choose":
      return "Shift";
    case "banish-and-play":
      return "Banish and play";
    default:
      return "Choose targets";
  }
}

const overlayTitle = $derived(categoryLabel());
const overlayMessage = $derived(
  visibleSlots.length > 1 ? `Pick ${visibleSlots.length} targets` : "Choose your target",
);
const canConfirm = $derived(view.submission.canSubmit);
const overlayDataEffectType = $derived(slottedKind ?? undefined);
// Multi-character "Gathering Forces"-style move-to-location prompts use a
// dedicated multi-phase layout below; suppress the source-card art in the
// header to avoid layout collisions with the phase strip.
const isMultiCharMoveToLocation = $derived(
  slottedKind === "move-to-location" && visibleSlots.length > 1,
);

function handleOpenChange(open: boolean): void {
  if (!open) {
    onDismiss?.();
  }
}

function handleSelectInteraction(interaction: InteractionSelectCard): void {
  onSelectCard?.(interaction.cardId as unknown as string);
}

</script>

<Dialog.Root open onOpenChange={handleOpenChange}>
  <Dialog.Portal>
    <Dialog.Overlay class="bg-black/70" />
    <Dialog.Content
      class="target-overlay fixed left-1/2 top-1/2 z-50 h-[100dvh] max-h-[100dvh] w-[min(92vw,60rem)] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-[1.75rem] p-0"
      showCloseButton={false}
      data-testid="resolution-target-overlay"
      data-effect-type={overlayDataEffectType}
    >
      <Dialog.Header class="target-overlay__header">
        <div
          class="target-overlay__header-copy"
          class:target-overlay__header-copy--with-source={Boolean(resolvedSourceCard) && !isMultiCharMoveToLocation}
        >
          <div class="target-overlay__eyebrow">
            {#if slottedKind === "move-to-location"}
              <MapPinnedIcon class="size-4" />
            {:else}
              <MoveDiagonalIcon class="size-4" />
            {/if}
            <span>{categoryLabel()}</span>
          </div>
          <Dialog.Title class="target-overlay__title">{overlayTitle}</Dialog.Title>
          <Dialog.Description class="target-overlay__message">{overlayMessage}</Dialog.Description>
        </div>

        {#if resolvedSourceCard && !isMultiCharMoveToLocation}
          <div class="target-overlay__source">
            <LorcanaCard
              card={resolvedSourceCard}
              size="small"
              imageFormat="art_only"
              isMasked={resolvedSourceCard.isMasked}
              interactionMeta={{
                cardId: resolvedSourceCard.cardId,
                ownerSide: resolvedSourceCard.ownerSide,
                zoneId: resolvedSourceCard.zoneId,
                selectionGroup: "resolution-target-overlay-source",
                selectionMode: "none",
                selectable: false,
              }}
            />
          </div>
        {/if}
      </Dialog.Header>

      <div class="target-overlay__body">
        {#if visibleSlots.length > 0}
          <div class="target-overlay__slots">
            {#each visibleSlots as slot (slot.key)}
              {@const selectedCard = getCard(slot.targetCardId)}
              {@const isActive = activePrompt?.activeSlotIndex === slot.index}
              <section
                class="target-slot"
                class:target-slot--active={isActive}
                data-active={isActive ? "true" : "false"}
                data-testid={`resolution-target-slot:${slot.key}`}
              >
                <div class="target-slot__header">
                  <div>
                    <p class="target-slot__label">{slotLabel(slot)}</p>
                    <p class="target-slot__detail">
                      {#if slot.locked}
                        {m["prompt.target.slot.status.selected"]({})}
                      {:else}
                        {m["prompt.target.slot.status.pending"]({})}
                      {/if}
                    </p>
                  </div>

                  {#if slot.locked}
                    <div class="target-slot__header-actions">
                      <span class="target-slot__badge target-slot__badge--selected"
                        >{m["prompt.target.slot.status.selected"]({})}</span
                      >
                      <button
                        type="button"
                        class="target-slot__edit"
                        onclick={() => onSelectSlot?.(slot.index)}
                        data-testid={`resolution-target-slot-action:${slot.key}`}
                      >
                        {m["prompt.target.slot.action.edit"]({})}
                      </button>
                    </div>
                  {:else}
                    <button
                      type="button"
                      class="target-slot__edit"
                      onclick={() => onSelectSlot?.(slot.index)}
                      data-testid={`resolution-target-slot-action:${slot.key}`}
                    >
                      {m["prompt.target.slot.action.choose-now"]({})}
                    </button>
                  {/if}
                </div>

                {#if selectedCard}
                  <div
                    class="target-slot__card"
                    role="presentation"
                    onmouseenter={() => handleCardPreviewEnter(selectedCard)}
                    onmouseleave={() => handleCardPreviewLeave(selectedCard)}
                  >
                    <LorcanaCard
                      card={selectedCard}
                      size="small"
                      isSelected={isActive}
                      isMasked={selectedCard.isMasked}
                      interactionMeta={{
                        cardId: selectedCard.cardId,
                        ownerSide: selectedCard.ownerSide,
                        zoneId: selectedCard.zoneId,
                        selectionGroup: "resolution-target-overlay-slot",
                        selectionMode: "none",
                        selectable: false,
                      }}
                    />
                  </div>
                {:else}
                  <div class="target-slot__placeholder">
                    <span>{slotPlaceholder(slot)}</span>
                  </div>
                {/if}
              </section>
            {/each}
          </div>
        {/if}

        <section class="target-overlay__candidates">
          <div class="target-overlay__candidate-header">
            <h3>{m["prompt.target.candidates.heading"]({})}</h3>
            {#if visibleSlots.length > 1 && activePrompt?.activeSlotIndex !== null && activePrompt?.activeSlotIndex !== undefined}
              <span>
                Step {activePrompt.activeSlotIndex - (activePrompt.autoResolvedSlotCount ?? 0) + 1} of {visibleSlots.length}
              </span>
            {/if}
          </div>

          {#if candidateItems.length === 0 && visibleSlots.length === 0}
            <p class="target-overlay__empty">{m["prompt.target.empty-state"]({})}</p>
          {/if}

          {#each [{ label: m["prompt.target.candidates.your-characters"]({}), entries: yourCandidates }, { label: m["prompt.target.candidates.opponent-characters"]({}), entries: opponentCandidates }] as group (group.label)}
            {#if group.entries.length > 0}
              {#if showGroupLabels}
                <p class="target-overlay__group-label">{group.label}</p>
              {/if}
              <div class="target-overlay__candidate-grid">
                {#each group.entries as item (item.card.cardId)}
                  <button
                    type="button"
                    class="target-overlay__candidate-button"
                    class:target-overlay__candidate-button--selected={item.selected}
                    onclick={() => handleSelectInteraction(item.interaction)}
                    onmouseenter={() => handleCardPreviewEnter(item.card)}
                    onmouseleave={() => handleCardPreviewLeave(item.card)}
                    data-testid={`resolution-target-candidate:${item.card.cardId}`}
                  >
                    <LorcanaCard
                      card={item.card}
                      size="small"
                      isSelected={item.selected}
                      isValidTarget={!item.selected}
                      isMasked={item.card.isMasked}
                      interactionMeta={{
                        cardId: item.card.cardId,
                        ownerSide: item.card.ownerSide,
                        zoneId: item.card.zoneId,
                        selectionGroup: "resolution-target-overlay-candidates",
                        selectionMode: "none",
                        selectable: true,
                      }}
                    />
                    <span class="target-overlay__candidate-label">{item.card.label}</span>
                  </button>
                {/each}
              </div>
            {/if}
          {/each}
        </section>

        {#if amountSelection}
          <ResolutionAmountControls
            selection={amountSelection}
            onChange={(value) => {
              onAmountChange?.(value);
            }}
          />
        {/if}
      </div>

      <Dialog.Footer class="target-overlay__footer">
        <button
          type="button"
          class="target-overlay__button target-overlay__button--ghost"
          onclick={onDismiss}
        >
          Cancel
        </button>
        <button
          type="button"
          class="target-overlay__button target-overlay__button--primary"
          onclick={onConfirm}
          disabled={!canConfirm}
        >
          Confirm
        </button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.target-overlay) {
    display: flex;
    flex-direction: column;
    min-height: 0;
    border: 1px solid rgba(148, 163, 184, 0.22);
    background:
      linear-gradient(180deg, rgba(9, 14, 27, 0.96), rgba(6, 9, 19, 0.98));
    box-shadow: 0 24px 80px rgba(2, 6, 23, 0.45);
    backdrop-filter: blur(18px);
  }

  :global(.target-overlay__header) {
    display: flex;
    align-items: stretch;
    padding: 1rem 1rem 0.85rem;
    border-bottom: 1px solid rgba(71, 85, 105, 0.45);
    position: relative;
  }

  .target-overlay__header-copy {
    display: grid;
    gap: 0.4rem;
    min-width: 0;
  }

  .target-overlay__header-copy--with-source {
    padding-right: 8.25rem;
  }

  .target-overlay__eyebrow {
    display: inline-flex;
    gap: 0.45rem;
    align-items: center;
    color: rgba(191, 219, 254, 0.82);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  :global(.target-overlay__title) {
    margin: 0;
    color: #f8fafc;
    font-size: 1.15rem;
    font-weight: 800;
  }

  :global(.target-overlay__message) {
    margin: 0;
    color: rgba(191, 219, 254, 0.8);
    font-size: 0.94rem;
  }

  .target-overlay__source {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 1;
  }

  .target-overlay__body {
    min-height: 0;
    flex: 1;
    overflow-y: auto;
    display: grid;
    gap: 1rem;
    padding: 1rem;
  }

  .target-overlay__slots {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.9rem;
  }

  .target-slot {
    display: grid;
    gap: 0.75rem;
    padding: 0.9rem;
    border-radius: 1.25rem;
    border: 1px solid rgba(71, 85, 105, 0.6);
    background: rgba(15, 23, 42, 0.64);
    text-align: left;
  }

  .target-slot--active {
    border-color: rgba(125, 211, 252, 0.7);
    background: linear-gradient(180deg, rgba(8, 47, 73, 0.74), rgba(15, 23, 42, 0.86));
    box-shadow: inset 0 0 0 1px rgba(186, 230, 253, 0.12);
  }

  .target-slot__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .target-slot__header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .target-slot__label {
    margin: 0;
    color: #f8fafc;
    font-size: 0.95rem;
    font-weight: 800;
  }

  .target-slot__detail {
    margin: 0.25rem 0 0;
    color: rgba(191, 219, 254, 0.72);
    font-size: 0.8rem;
  }

  .target-slot__badge {
    border-radius: 999px;
    padding: 0.28rem 0.65rem;
    background: rgba(71, 85, 105, 0.55);
    color: #e2e8f0;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .target-slot__badge--selected {
    background: rgba(14, 116, 144, 0.72);
    color: #f0f9ff;
  }

  .target-slot__edit {
    border-radius: 999px;
    border: 1px solid rgba(125, 211, 252, 0.3);
    background: rgba(15, 23, 42, 0.85);
    color: #e2e8f0;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.35rem 0.7rem;
  }

  .target-slot__card,
  .target-slot__placeholder {
    min-height: 8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    background: rgba(2, 6, 23, 0.42);
  }

  .target-slot__placeholder {
    border: 1px dashed rgba(148, 163, 184, 0.25);
    color: rgba(148, 163, 184, 0.9);
    font-size: 0.84rem;
    font-weight: 600;
  }

  .target-overlay__candidates {
    display: grid;
    gap: 0.75rem;
  }

  .target-overlay__group-label {
    margin: 0;
    color: rgba(148, 163, 184, 0.7);
    font-size: 0.74rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .target-overlay__candidate-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    color: rgba(191, 219, 254, 0.78);
    font-size: 0.8rem;
  }

  .target-overlay__candidate-header h3 {
    margin: 0;
    color: #f8fafc;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .target-overlay__candidate-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
    gap: 0.85rem;
  }

  .target-overlay__candidate-button {
    display: grid;
    gap: 0.45rem;
    justify-items: center;
    padding: 0.55rem;
    border: 1px solid rgba(71, 85, 105, 0.55);
    border-radius: 1.15rem;
    background: rgba(15, 23, 42, 0.65);
    transition:
      transform 150ms ease,
      border-color 150ms ease,
      background 150ms ease;
  }

  .target-overlay__candidate-button:hover {
    transform: translateY(-1px);
    border-color: rgba(125, 211, 252, 0.55);
  }

  .target-overlay__candidate-button--selected {
    border-color: rgba(125, 211, 252, 0.8);
    background: linear-gradient(180deg, rgba(14, 116, 144, 0.72), rgba(15, 23, 42, 0.82));
  }

  .target-overlay__candidate-label {
    color: #e2e8f0;
    font-size: 0.8rem;
    font-weight: 700;
    text-align: center;
  }

  :global(.target-overlay__footer) {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 0.9rem 1rem 1rem;
    border-top: 1px solid rgba(71, 85, 105, 0.45);
    background: rgba(2, 6, 23, 0.42);
  }

  .target-overlay__button {
    border-radius: 999px;
    padding: 0.7rem 1.15rem;
    font-weight: 800;
    border: 1px solid rgba(125, 211, 252, 0.35);
  }

  .target-overlay__button--ghost {
    background: rgba(15, 23, 42, 0.74);
    color: #e2e8f0;
  }

  .target-overlay__button--primary {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: linear-gradient(180deg, rgba(14, 116, 144, 0.96), rgba(8, 47, 73, 0.96));
    color: #f8fafc;
  }

  .target-overlay__button:disabled {
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    :global(.target-overlay) {
      width: min(96vw, 32rem);
    }

    :global(.target-overlay__header) {
      padding: 0.85rem 0.85rem 0.75rem;
    }

    .target-overlay__header-copy--with-source {
      padding-right: 6.75rem;
    }

    .target-overlay__source {
      top: 0.85rem;
      right: 0.85rem;
    }

    .target-overlay__body {
      padding: 0.85rem;
    }

    :global(.target-overlay__footer) {
      padding: 0.8rem 0.85rem 0.85rem;
    }

    .target-overlay__slots {
      grid-template-columns: 1fr;
    }
  }

</style>
