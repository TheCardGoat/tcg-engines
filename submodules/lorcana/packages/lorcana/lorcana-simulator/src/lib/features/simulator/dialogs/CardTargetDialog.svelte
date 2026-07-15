<script lang="ts">
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import { m } from "$lib/i18n/messages.js";
  import type {
    LorcanaCardSnapshot,
    LorcanaPlayerSide,
  } from "@/features/simulator/model/contracts.js";
  import type { LorcanaCardTarget } from "@tcg/lorcana-engine";
  import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";

  interface TargetSelectionPlayerEntry {
    id: string;
    label: string;
    selected: boolean;
    disabled?: boolean;
    side?: LorcanaPlayerSide;
  }

  interface CardTargetDialogProps {
    open?: boolean;
    /**
     * Card snapshots to render. Caller must scope this to the engine's
     * legal candidate set — the dialog does NOT filter or re-derive
     * legality. See `@tcg/lorcana-interaction`'s `PlayerInteractionView`
     * for the source of truth.
     */
    cards: LorcanaCardSnapshot[];
    target?: LorcanaCardTarget | null;
    playerSide: LorcanaPlayerSide;
    viewerSide?: LorcanaPlayerSide | null;
    /** Turn-action sources (e.g. ink); used for playable highlight in zone browsers. */
    playableCardIds?: string[];
    selectable?: boolean;
    players?: TargetSelectionPlayerEntry[];
    selectedCardIds?: string[];
    entryModeChoice?: {
      selected: boolean | null;
    };
    canConfirm?: boolean;
    titleText?: string;
    descriptionText?: string;
    emptyAllText?: string;
    emptyNoMatchText?: string;
    closeButtonLabel?: string;
    closeButtonAriaLabel?: string;
    footerCancelLabel?: string;
    footerDeclineLabel?: string;
    footerConfirmLabel?: string;
    selectionSummaryText?: string;
    summaryFormatter?: (
      matchCount: number,
      totalCount: number,
      playerLabel: string,
    ) => string;
    onSelectCard?: (cardId: string) => void;
    onSelectPlayer?: (playerId: string) => void;
    onSelectEntryMode?: (enterPlayExerted: boolean) => void;
    onConfirm?: () => void;
    onCancel?: () => void;
    onDecline?: () => void;
  }

  let {
    open = $bindable(false),
    cards,
    playerSide,
    viewerSide = null,
    playableCardIds = [],
    selectable = false,
    players = [],
    selectedCardIds = [],
    entryModeChoice,
    canConfirm = false,
    titleText,
    descriptionText,
    emptyAllText = m["sim.target.emptyAll"]({}),
    emptyNoMatchText = m["sim.target.emptyNoMatch"]({}),
    closeButtonLabel = m["sim.target.close"]({}),
    closeButtonAriaLabel = m["sim.target.closeAria"]({}),
    footerCancelLabel = m["sim.actions.cancel"]({}),
    footerDeclineLabel = m["sim.actions.label.skipOptionalEffect"]({}),
    footerConfirmLabel = m["sim.actions.confirm"]({}),
    selectionSummaryText,
    summaryFormatter = (matchCount, totalCount, playerLabel) =>
      m["sim.target.summary"]({ matchCount, totalCount, playerLabel }),
    onSelectCard,
    onSelectPlayer,
    onSelectEntryMode,
    onConfirm,
    onCancel,
    onDecline,
  }: CardTargetDialogProps = $props();

  const playerLabel = $derived(
    playerSide === "playerOne"
      ? m["sim.player.side.playerOne"]({})
      : m["sim.player.side.playerTwo"]({}),
  );

  /**
   * Render order: most-recently-added (top of stack) first.
   * Caller already provides the engine's authoritative candidate list,
   * so the dialog simply mirrors it without filtering.
   */
  const orderedCards = $derived(cards.slice().reverse());
  const selectedCount = $derived(
    selectedCardIds.length + players.filter((player) => player.selected).length,
  );
  const headerSummary = $derived(
    descriptionText ??
      summaryFormatter(orderedCards.length, cards.length, playerLabel),
  );
  const hasFooter = $derived(Boolean(onConfirm || onCancel || onDecline || entryModeChoice));
  const resolvedSelectionSummaryText = $derived(
    selectionSummaryText ??
      m["sim.target.selectedCount"]({ selectedCount }),
  );

  /** No card grid: shrink shell so player-only / empty steps are not stretched to full scry size. */
  const isCompactLayout = $derived(cards.length === 0);

  function handleSelectCard(cardId: string): void {
    onSelectCard?.(cardId);
  }

  function handleSelectPlayer(playerId: string): void {
    onSelectPlayer?.(playerId);
  }

  function handleCancel(): void {
    onCancel?.();
  }

  function handleDecline(): void {
    onDecline?.();
  }

  function handleEntryModeReady(): void {
    onSelectEntryMode?.(false);
  }

  function handleEntryModeExerted(): void {
    onSelectEntryMode?.(true);
  }

  function handlePlayerClick(event: MouseEvent): void {
    const playerId = (event.currentTarget as HTMLButtonElement).dataset.playerId;
    if (!playerId) {
      return;
    }

    handleSelectPlayer(playerId);
  }

  function handleCardClick(cardId: string): void {
    if (selectable) {
      handleSelectCard(cardId);
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay
      class="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in"
    />
    <Dialog.Content
      class={[
        "card-target-dialog fixed left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-sky-300/20 bg-slate-950/96 shadow-2xl",
        isCompactLayout
          ? "card-target-dialog--compact max-h-[min(92vh,520px)] w-[min(92vw,22rem)] gap-3 p-3 sm:w-[min(92vw,26rem)] sm:p-4"
          : "h-[min(88vh,760px)] w-[min(94vw,1120px)] gap-4 p-4 sm:p-5",
      ].join(" ")}
      showCloseButton={false}
    >
      <Dialog.Title class="sr-only">
        {titleText ?? m["sim.target.dialog.title"]({ playerLabel })}
      </Dialog.Title>
      <Dialog.Description class="sr-only">
        {m["sim.target.dialog.description"]({
          title: titleText ?? m["sim.target.dialog.title"]({ playerLabel }),
          matchCount: orderedCards.length,
          totalCount: cards.length,
        })}
      </Dialog.Description>

      <header class="dialog-header">
        <div>
          <h2>{titleText ?? m["sim.target.dialog.header"]({ playerLabel })}</h2>
          <p>{headerSummary}</p>
        </div>
        <Dialog.Close class="close-button" aria-label={closeButtonAriaLabel} onclick={handleCancel}>
          <span aria-hidden="true" class="close-button__icon">
            <svg viewBox="0 0 16 16" focusable="false">
              <path
                d="M4.22 4.22a.75.75 0 0 1 1.06 0L8 6.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L6.94 8 4.22 5.28a.75.75 0 0 1 0-1.06Z"
              />
            </svg>
          </span>
          <span>{closeButtonLabel}</span>
        </Dialog.Close>
      </header>

      {#if players.length > 0}
        <section class="player-section">
          <div class="section-header">
            <h3>{m["sim.target.players"]({})}</h3>
          </div>
          <div class="player-grid">
            {#each players as player (player.id)}
              <button
                type="button"
                class="player-button"
                class:player-button--selected={player.selected}
                data-player-id={player.id}
                disabled={player.disabled}
                onclick={handlePlayerClick}
              >
                {player.label}
              </button>
            {/each}
          </div>
        </section>
      {/if}

      <section
        class="dialog-content"
        class:dialog-content--compact={isCompactLayout}
        aria-live="polite"
      >
        {#if cards.length === 0}
          <p class="empty-state">
            {players.length > 0 ? m["sim.target.emptyPlayerStep"]({}) : emptyAllText}
          </p>
        {:else if orderedCards.length === 0}
          <p class="empty-state">{emptyNoMatchText}</p>
        {:else}
          <div class="section-header section-header--cards">
            <h3>{m["sim.target.cards"]({})}</h3>
            {#if selectable}
              <span>{resolvedSelectionSummaryText}</span>
            {/if}
          </div>
          <div class="card-grid">
            {#each orderedCards as card (card.cardId)}
              {@const isSelected = selectedCardIds.includes(card.cardId)}
              <button
                type="button"
                class="card-button"
                class:card-button--selected={isSelected}
                data-card-id={card.cardId}
                aria-label={selectable
                  ? m["sim.target.toggleSelectionAria"]({ cardLabel: card.label })
                  : m["sim.target.inspectAria"]({ cardLabel: card.label })}
                aria-pressed={selectable ? isSelected : undefined}
                onclick={() => handleCardClick(card.cardId)}
              >
                <div class:pointer-events-none={selectable}>
                  <LorcanaCard
                    {card}
                    isSelected={isSelected}
                    isMasked={card.isMasked}
                    isPlayable={playableCardIds.includes(card.cardId)}
                    isValidTarget={selectable && playableCardIds.includes(card.cardId)}
                    size="small"
                    hoverShowActions={!selectable}
                    interactionMeta={{
                      cardId: card.cardId,
                      ownerSide: card.ownerSide,
                      zoneId: card.zoneId,
                      selectionGroup: "target-dialog",
                      selectionMode: selectable ? "multi" : "none",
                      selectable,
                    }}
                  />
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </section>

      {#if hasFooter}
        <footer class="dialog-footer">
          {#if onCancel}
            <button
              type="button"
              class="footer-button footer-button--secondary"
              onclick={handleCancel}
            >
              {footerCancelLabel}
            </button>
          {/if}
          {#if onDecline}
            <button
              type="button"
              class="footer-button footer-button--secondary"
              onclick={handleDecline}
            >
              {footerDeclineLabel}
            </button>
          {/if}
          {#if entryModeChoice}
            <button
              type="button"
              class="footer-button footer-button--secondary"
              class:footer-button--selected={entryModeChoice.selected === false}
              onclick={handleEntryModeReady}
            >
              {m["sim.target.entryMode.ready"]({})}

            </button>
            <button
              type="button"
              class="footer-button footer-button--secondary"
              class:footer-button--selected={entryModeChoice.selected === true}
              onclick={handleEntryModeExerted}
            >
              {m["sim.target.entryMode.exerted"]({})}

            </button>
          {/if}
          {#if onConfirm}
            <button
              type="button"
              class="footer-button footer-button--primary"
              disabled={!canConfirm}
              onclick={onConfirm}
            >
              {footerConfirmLabel}
            </button>
          {/if}
        </footer>
      {/if}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  .dialog-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .dialog-header h2 {
    margin: 0;
    font-size: 1rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #f8fafc;
  }

  .dialog-header p {
    margin: 0.3rem 0 0;
    color: #94a3b8;
    font-size: 0.85rem;
  }

  :global(.close-button),
  .footer-button,
  .player-button {
    --close-border: rgba(148, 163, 184, 0.26);
    --close-bg: linear-gradient(180deg, rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.58));
    --close-text: #e2e8f0;
    --close-icon: #bfdbfe;
    display: inline-grid;
    grid-auto-flow: column;
    align-items: center;
    gap: 0.55rem;
    border: 1px solid var(--close-border);
    border-radius: 999px;
    background: var(--close-bg);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      0 10px 24px rgba(2, 6, 23, 0.28);
    color: var(--close-text);
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    line-height: 1;
    transition:
      transform 160ms ease,
      border-color 160ms ease,
      background 160ms ease,
      color 160ms ease,
      box-shadow 160ms ease;
  }

  :global(.close-button) {
    padding: 0.42rem 0.8rem 0.42rem 0.5rem;
  }

  .footer-button,
  .player-button {
    padding: 0.7rem 1rem;
  }

  :global(.close-button:hover),
  .footer-button:hover:enabled,
  .player-button:hover:enabled {
    border-color: rgba(125, 211, 252, 0.5);
    background:
      linear-gradient(180deg, rgba(30, 41, 59, 0.96), rgba(15, 23, 42, 0.74));
    color: #f8fafc;
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 16px 30px rgba(2, 6, 23, 0.35);
  }

  .footer-button--selected {
    --close-border: rgba(251, 191, 36, 0.7);
    --close-bg: linear-gradient(180deg, rgba(120, 53, 15, 0.7), rgba(69, 26, 3, 0.58));
    --close-text: #fef3c7;
  }

  :global(.close-button:focus-visible),
  .footer-button:focus-visible,
  .player-button:focus-visible,
  .card-button:focus-visible {
    outline: 2px solid rgba(125, 211, 252, 0.9);
    outline-offset: 2px;
  }

  .close-button__icon {
    display: inline-grid;
    place-items: center;
    width: 1.45rem;
    height: 1.45rem;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.16);
    color: var(--close-icon);
    box-shadow: inset 0 0 0 1px rgba(191, 219, 254, 0.14);
    flex-shrink: 0;
  }

  .close-button__icon svg {
    width: 0.85rem;
    height: 0.85rem;
    fill: currentColor;
  }

  .player-section {
    display: grid;
    gap: 0.65rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .section-header h3 {
    margin: 0;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(186, 230, 253, 0.8);
  }

  .section-header span {
    color: rgba(186, 230, 253, 0.78);
    font-size: 0.82rem;
    font-weight: 600;
  }

  .section-header--cards {
    margin-bottom: 0.75rem;
  }

  .player-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
  }

  .player-button--selected {
    border-color: rgba(125, 211, 252, 0.52);
    background: rgba(30, 41, 59, 0.96);
  }

  .dialog-content {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    border-radius: 0.75rem;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      radial-gradient(ellipse at top, rgba(30, 64, 175, 0.24), rgba(15, 23, 42, 0.65));
    padding: 0.75rem;
  }

  .dialog-content--compact {
    flex: 0 1 auto;
    min-height: unset;
    padding: 0.55rem 0.65rem;
  }

  .empty-state {
    color: #cbd5e1;
    margin: 0;
    text-align: center;
    padding: 1rem 0.5rem;
    font-size: 0.9rem;
  }

  .dialog-content--compact .empty-state {
    padding: 0.35rem 0.25rem;
    font-size: 0.82rem;
    line-height: 1.35;
    text-align: left;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
    gap: 0.65rem;
    align-items: start;
  }

  .card-button {
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: transform 180ms ease;
  }

  .card-button:hover,
  .card-button:focus-visible {
    transform: translateY(-3px);
  }

  .card-button--selected {
    outline: 2px solid rgba(59, 130, 246, 0.9);
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }

  .footer-button--primary:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
  }

  @media (max-width: 700px) {
    .dialog-content {
      border-radius: 0.6rem;
      padding: 0.6rem;
    }

    .card-grid {
      gap: 0.5rem;
      grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
    }
  }

  @media (max-width: 480px) {
    .card-grid {
      grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
    }
  }
</style>
