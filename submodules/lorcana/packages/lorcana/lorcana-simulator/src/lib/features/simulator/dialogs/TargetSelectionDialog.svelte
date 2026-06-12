<script lang="ts">
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
  import type {
    LorcanaCardSnapshot,
    LorcanaPlayerSide,
  } from "@/features/simulator/model/contracts.js";

  interface TargetSelectionPlayerEntry {
    id: string;
    label: string;
    selected: boolean;
    disabled?: boolean;
    side?: LorcanaPlayerSide;
  }

  interface TargetSelectionDialogProps {
    open?: boolean;
    title: string;
    message: string;
    cards: LorcanaCardSnapshot[];
    players?: TargetSelectionPlayerEntry[];
    selectedCardIds?: string[];
    canConfirm?: boolean;
    onSelectCard?: (cardId: string) => void;
    onSelectPlayer?: (playerId: string) => void;
    onConfirm?: () => void;
    onCancel?: () => void;
  }

  let {
    open = $bindable(false),
    title,
    message,
    cards,
    players = [],
    selectedCardIds = [],
    canConfirm = false,
    onSelectCard,
    onSelectPlayer,
    onConfirm,
    onCancel,
  }: TargetSelectionDialogProps = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay
      class="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in"
    />
    <Dialog.Content
      class="target-selection-dialog fixed left-1/2 top-1/2 z-50 flex h-[min(88vh,760px)] w-[min(94vw,1120px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-hidden rounded-3xl border border-sky-300/20 bg-slate-950/96 p-4 shadow-2xl sm:p-5"
      showCloseButton={false}
    >
      <Dialog.Title class="sr-only">{title}</Dialog.Title>
      <Dialog.Description class="sr-only">{message}</Dialog.Description>

      <header class="target-selection-dialog__header">
        <div>
          <h2>{title}</h2>
          <p>{message}</p>
        </div>
        <Dialog.Close
          class="target-selection-dialog__close"
          aria-label="Close target selector"
          onclick={() => onCancel?.()}
        >
          Close
        </Dialog.Close>
      </header>

      {#if players.length > 0}
        <section class="target-selection-dialog__players">
          <h3>Players</h3>
          <div class="target-selection-dialog__player-grid">
            {#each players as player (player.id)}
              <button
                type="button"
                class="target-selection-dialog__player-button"
                class:target-selection-dialog__player-button--selected={player.selected}
                disabled={player.disabled}
                onclick={() => onSelectPlayer?.(player.id)}
              >
                {player.label}
              </button>
            {/each}
          </div>
        </section>
      {/if}

      <section class="target-selection-dialog__cards">
        <div class="target-selection-dialog__cards-header">
          <h3>Cards</h3>
          <span>{selectedCardIds.length} selected</span>
        </div>

        {#if cards.length === 0}
          <p class="target-selection-dialog__empty">No card targets available.</p>
        {:else}
          <div class="target-selection-dialog__card-grid">
            {#each cards as card (card.cardId)}
              {@const isSelected = selectedCardIds.includes(card.cardId)}
              <button
                type="button"
                class="target-selection-dialog__card-button"
                class:target-selection-dialog__card-button--selected={isSelected}
                onclick={() => onSelectCard?.(card.cardId)}
              >
                <LorcanaCard
                  {card}
                  size="small"
                  isSelected={isSelected}
                  isMasked={card.isMasked}
                  interactionMeta={{
                    cardId: card.cardId,
                    ownerSide: card.ownerSide,
                    zoneId: card.zoneId,
                    selectionGroup: "pending-target-dialog",
                    selectionMode: "none",
                    selectable: false,
                  }}
                />
              </button>
            {/each}
          </div>
        {/if}
      </section>

      <footer class="target-selection-dialog__footer">
        <button
          type="button"
          class="target-selection-dialog__footer-button target-selection-dialog__footer-button--secondary"
          onclick={() => onCancel?.()}
        >
          Cancel
        </button>
        <button
          type="button"
          class="target-selection-dialog__footer-button target-selection-dialog__footer-button--primary"
          onclick={() => onConfirm?.()}
          disabled={!canConfirm}
        >
          Confirm
        </button>
      </footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  .target-selection-dialog__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .target-selection-dialog__header h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: #f8fafc;
  }

  .target-selection-dialog__header p {
    margin: 0.35rem 0 0;
    color: rgba(186, 230, 253, 0.78);
    font-size: 0.9rem;
  }

  :global(.target-selection-dialog__close),
  .target-selection-dialog__footer-button,
  .target-selection-dialog__player-button {
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.28);
    background: rgba(15, 23, 42, 0.82);
    color: #e2e8f0;
    font-weight: 700;
    transition:
      transform 150ms ease,
      border-color 150ms ease,
      background 150ms ease;
  }

  :global(.target-selection-dialog__close),
  .target-selection-dialog__footer-button {
    padding: 0.6rem 1rem;
  }

  :global(.target-selection-dialog__close:hover),
  .target-selection-dialog__footer-button:hover:enabled,
  .target-selection-dialog__player-button:hover:enabled {
    transform: translateY(-1px);
    border-color: rgba(125, 211, 252, 0.52);
    background: rgba(30, 41, 59, 0.96);
  }

  .target-selection-dialog__players,
  .target-selection-dialog__cards {
    display: grid;
    gap: 0.75rem;
  }

  .target-selection-dialog__players h3,
  .target-selection-dialog__cards-header h3 {
    margin: 0;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(186, 230, 253, 0.8);
  }

  .target-selection-dialog__player-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
  }

  .target-selection-dialog__player-button {
    padding: 0.7rem 1rem;
  }

  .target-selection-dialog__player-button--selected {
    border-color: rgba(56, 189, 248, 0.75);
    background: linear-gradient(180deg, rgba(14, 116, 144, 0.92), rgba(8, 47, 73, 0.92));
    color: #f0f9ff;
  }

  .target-selection-dialog__cards {
    min-height: 0;
    flex: 1;
  }

  .target-selection-dialog__cards-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    color: rgba(226, 232, 240, 0.72);
    font-size: 0.82rem;
  }

  .target-selection-dialog__card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
    gap: 0.9rem;
    overflow-y: auto;
    padding-right: 0.2rem;
  }

  .target-selection-dialog__card-button {
    display: flex;
    justify-content: center;
    padding: 0.35rem;
    border-radius: 1.1rem;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background: rgba(15, 23, 42, 0.48);
    transition:
      transform 150ms ease,
      border-color 150ms ease,
      background 150ms ease;
  }

  .target-selection-dialog__card-button:hover {
    transform: translateY(-2px);
    border-color: rgba(125, 211, 252, 0.4);
    background: rgba(15, 23, 42, 0.7);
  }

  .target-selection-dialog__card-button--selected {
    border-color: rgba(56, 189, 248, 0.7);
    background: linear-gradient(180deg, rgba(12, 74, 110, 0.55), rgba(15, 23, 42, 0.78));
  }

  .target-selection-dialog__empty {
    margin: 0;
    color: rgba(148, 163, 184, 0.86);
  }

  .target-selection-dialog__footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }

  .target-selection-dialog__footer-button--primary {
    border-color: rgba(56, 189, 248, 0.5);
    background: linear-gradient(180deg, rgba(3, 105, 161, 0.98), rgba(14, 116, 144, 0.95));
    color: #f0f9ff;
  }

  .target-selection-dialog__footer-button:disabled {
    opacity: 0.45;
    transform: none;
  }

  @media (max-width: 640px) {
    :global(.target-selection-dialog) {
      height: min(92vh, 860px);
      padding: 1rem;
    }

    .target-selection-dialog__card-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .target-selection-dialog__footer {
      justify-content: stretch;
    }

    .target-selection-dialog__footer-button {
      flex: 1;
    }
  }
</style>
