<script lang="ts">
  import { tick } from "svelte";
  import { ClipboardList, MessageSquareText, OctagonX, ScrollText, X } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Drawer from "$lib/components/ui/drawer";
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import { m } from "$lib/i18n/messages.js";
  import EmptyState from "@/design-system/simulator/display/EmptyState.svelte";
  import { AvailableMovesPanel, EventLogPanel } from "@/features/simulator/index.js";
  import MatchChatPanel from "@/features/match-chat/MatchChatPanel.svelte";
  import { maybeUseMatchChatControllerContext } from "@/features/match-chat/match-chat-controller.svelte.js";
  import { useSimulatorCardContext } from "@/features/simulator/context/simulator-card-context.svelte.js";
  import { useLorcanaSidebarPresenter } from "@/features/simulator/context/game-context.svelte.js";
  import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";

  type CompactPanelTab = "moves" | "log" | "chat";

  interface LorcanaCompactPanelsProps {
    open?: boolean;
    activeTab?: CompactPanelTab;
    readOnly?: boolean;
  }

  let {
    open = $bindable(false),
    activeTab = $bindable("moves"),
    readOnly = false,
  }: LorcanaCompactPanelsProps = $props();

  const sidebar = useLorcanaSidebarPresenter();
  const simulatorCardContext = useSimulatorCardContext();
  const matchChatContext = maybeUseMatchChatControllerContext();
  const matchChatController = $derived(matchChatContext?.controller ?? null);
  // Same merge the sidebar variant performs — feeds chat-system events
  // (proposal lifecycle, free-text-enabled, Manual Mode) into the unified
  // game log. Without this the compact/mobile log only shows engine
  // moves and silently drops the proposal trail.
  const chatMessages = $derived(matchChatController?.messages ?? []);

  function handleCardHover(card: LorcanaCardSnapshot): void {
    simulatorCardContext.setExternalPreviewCard(card);
  }

  function handleCardLeave(): void {
    simulatorCardContext.setExternalPreviewCard(null);
  }

  const moveCategorySummaries = $derived(sidebar.moveCategorySummaries);
  const availableMoveCategoryCount = $derived(sidebar.moveCategoryCount);
  const moveLogEntries = $derived(sidebar.moveLogEntries);
  const ownerSide = $derived(sidebar.ownerSide);
  const activeSide = $derived(sidebar.activeSide);
  const showRawLogRegistryJson = $derived(sidebar.showRawLogRegistryJson);
  const availableMovesSelectionState = $derived(sidebar.availableMovesSelectionState);

  const compactSelectionState = $derived(
    availableMovesSelectionState?.mode === "resolution-scry" ? null : availableMovesSelectionState,
  );
  const canConcede = $derived(!readOnly && sidebar.canConcede);

  const availableMovesTitle = $derived(m["sim.actions.panel.title"]({}));
  const eventLogTitle = $derived(m["sim.tabletop.eventLog.title"]({}));
  const chatTitle = $derived(m["sim.tabletop.chat.title"]({}));

  let concedeDialogOpen = $state(false);

  async function openConcedeDialog(): Promise<void> {
    if (!canConcede) {
      return;
    }

    open = false;
    await tick();
    concedeDialogOpen = true;
  }

  function closeConcedeDialog(): void {
    concedeDialogOpen = false;
  }

  function confirmConcede(): void {
    concedeDialogOpen = false;
    open = false;
    sidebar.handleMobileConcede();
  }

  $effect(() => {
    if (!matchChatController && activeTab === "chat") {
      activeTab = "moves";
    }
  });
</script>

<Drawer.Root bind:open direction="bottom" shouldScaleBackground={false}>
  <Drawer.Content
    direction="bottom"
    class="compact-panels-sheet border-sky-400/30 bg-slate-950/96 text-slate-100"
  >
    <Drawer.Header class="compact-panels-header">
      <div class="flex items-center justify-between gap-3">
        <Drawer.Title class="compact-panels-title">
          {activeTab === "moves"
            ? availableMovesTitle
            : activeTab === "log"
              ? eventLogTitle
              : chatTitle}
        </Drawer.Title>
        <div class="compact-panels-header-actions">
          {#if activeTab === "log"}
            <Button
              variant="outline"
              size="sm"
              class="compact-panels-concede"
              onclick={openConcedeDialog}
              disabled={!canConcede}
              aria-label={canConcede ? "Concede game" : "Concede unavailable"}
              title={canConcede ? "Concede game" : "Concede unavailable"}
            >
              <OctagonX class="size-4" />
              <span>Concede</span>
            </Button>
          {/if}

          <Drawer.Close class="compact-panels-close" aria-label="Close compact panel">
            <X class="size-4" />
          </Drawer.Close>
        </div>
      </div>
    </Drawer.Header>

    <div class="compact-panels-tabs" role="tablist" aria-label={m["sim.tabletop.aria"]({})}>
      <button
        type="button"
        role="tab"
        class="compact-tab"
        class:compact-tab--active={activeTab === "moves"}
        aria-selected={activeTab === "moves"}
        onclick={() => (activeTab = "moves")}
      >
        <ClipboardList class="size-4" />
        <span>{availableMovesTitle}</span>
        <span class="compact-tab-badge">{availableMoveCategoryCount}</span>
      </button>

      <button
        type="button"
        role="tab"
        class="compact-tab"
        class:compact-tab--active={activeTab === "log"}
        aria-selected={activeTab === "log"}
        onclick={() => (activeTab = "log")}
      >
        <ScrollText class="size-4" />
        <span>{eventLogTitle}</span>
        <span class="compact-tab-badge">{moveLogEntries.length}</span>
      </button>

      {#if matchChatController}
        <button
          type="button"
          role="tab"
          class="compact-tab"
          class:compact-tab--active={activeTab === "chat"}
          aria-selected={activeTab === "chat"}
          onclick={() => (activeTab = "chat")}
        >
          <MessageSquareText class="size-4" />
          <span>{chatTitle}</span>
          <span class="compact-tab-badge">{matchChatController.messages.length}</span>
        </button>
      {/if}
    </div>

    <div class="compact-panels-body">
      {#if activeTab === "moves"}
        {#if readOnly}
          <div class="compact-readonly-state">
            <p class="compact-readonly-state__title">{m["sim.postGame.actionsLocked"]({})}</p>
            <EmptyState
              icon="🏁"
              label={m["sim.postGame.actionsLockedDetail"]({})}
            />
          </div>
        {:else}
          <AvailableMovesPanel
            compact
            summaries={moveCategorySummaries}
            onExpandCategory={sidebar.expandCategoryMoves}
            supplementalActions={sidebar.resolutionActions}
            selectionState={compactSelectionState}
            interactiveSide={ownerSide}
            activeSide={activeSide ?? undefined}
            {showRawLogRegistryJson}
            activePlayerGuidance={sidebar.activePlayerGuidanceController}
            cardSnapshots={sidebar.cardSnapshotsById}
            onCardHover={handleCardHover}
            onCardLeave={handleCardLeave}
            onStartManualMoveSelection={({ id, moves }) =>
              sidebar.startManualCardActionSelection(id, moves)}
            onSelectCard={sidebar.handleAvailableMovesSelectionCard}
            onSelectPlayer={sidebar.handleAvailableMovesSelectionPlayer}
            onSelectOption={sidebar.handleAvailableMovesSelectionOption}
            onResolutionNamedCardQueryInput={sidebar.handleAvailableMovesNamedCardQueryInput}
            onSelectNamedCard={sidebar.handleAvailableMovesNamedCardSelection}
            onResolutionAmountChange={sidebar.updateResolutionSelectedAmount}
            onAssignScryCard={sidebar.handleAvailableMovesScryAssignment}
            onReorderScryCard={sidebar.handleAvailableMovesScryReorder}
            onBackSelection={sidebar.backActionSelectionSession}
            onCancelSelection={sidebar.cancelActionSelectionSession}
            onConfirmSelection={sidebar.confirmActionSelection}
            onResetManualMoveSelection={sidebar.cancelManualCardActionSelection}
            onExecuteMove={sidebar.handleAvailableMoveClick}
            hotkeyMode={sidebar.hotkeyMode}
          />
        {/if}
      {:else if activeTab === "log"}
        <EventLogPanel
          compact
          entries={moveLogEntries}
          {chatMessages}
          viewerSide={ownerSide}
          {showRawLogRegistryJson}
        />
      {:else}
        <MatchChatPanel compact viewerSide={ownerSide} />
      {/if}
    </div>
  </Drawer.Content>
</Drawer.Root>

<Dialog.Root bind:open={concedeDialogOpen}>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content class="compact-concede-dialog" showCloseButton={false}>
      <Dialog.Header class="compact-concede-dialog__header">
        <Dialog.Title class="compact-concede-dialog__title">
          {m["sim.sidebar.concedeDialog.title"]({})}
        </Dialog.Title>
        <Dialog.Description class="compact-concede-dialog__description">
          {m["sim.sidebar.concedeDialog.description"]({})}
        </Dialog.Description>
      </Dialog.Header>

      <Dialog.Footer class="compact-concede-dialog__footer">
        <Button
          variant="outline"
          class="compact-concede-dialog__button"
          onclick={closeConcedeDialog}
        >
          {m["sim.actions.cancel"]({})}
        </Button>
        <Button
          variant="destructive"
          class="compact-concede-dialog__button"
          onclick={confirmConcede}
        >
          {m["sim.actions.label.concede"]({})}
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.compact-panels-sheet) {
    max-height: min(62dvh, 32rem);
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 -24px 60px rgba(2, 6, 23, 0.72);
  }

  :global(.compact-panels-sheet [data-slot="sheet-header"]) {
    gap: 0;
    padding: 0.8rem 0.9rem 0.45rem;
  }

  :global(.compact-panels-title) {
    font-size: 0.88rem;
    font-weight: 800;
    color: #eff6ff;
  }

  .compact-panels-header-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  :global(.compact-panels-concede) {
    min-height: 2rem;
    gap: 0.35rem;
    border-color: rgba(153, 27, 27, 0.52);
    background: linear-gradient(180deg, rgba(69, 10, 10, 0.74), rgba(28, 25, 23, 0.92));
    color: rgba(254, 226, 226, 0.94);
    padding: 0.4rem 0.7rem;
    font-size: 0.72rem;
    font-weight: 800;
  }

  :global(.compact-panels-concede:hover:enabled) {
    border-color: rgba(185, 28, 28, 0.72);
    background: linear-gradient(180deg, rgba(87, 13, 13, 0.82), rgba(41, 37, 36, 0.98));
  }

  :global(.compact-panels-concede:disabled) {
    border-color: rgba(148, 163, 184, 0.18);
    background: rgba(15, 23, 42, 0.34);
    color: rgba(148, 163, 184, 0.78);
    opacity: 1;
  }

  .compact-panels-tabs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.4rem;
    padding: 0 0.9rem 0.6rem;
  }

  .compact-tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    min-height: 2.3rem;
    border-radius: 0.85rem;
    border: 1px solid rgba(125, 211, 252, 0.14);
    background: rgba(15, 23, 42, 0.72);
    color: rgba(226, 232, 240, 0.8);
    font-size: 0.76rem;
    font-weight: 700;
    transition: border-color 160ms ease, background 160ms ease, color 160ms ease;
  }

  .compact-tab--active {
    border-color: rgba(125, 211, 252, 0.62);
    background: linear-gradient(180deg, rgba(14, 116, 144, 0.9), rgba(8, 47, 73, 0.92));
    color: #f8fbff;
  }

  .compact-tab-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.2rem;
    min-height: 1.2rem;
    padding: 0 0.28rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    font-size: 0.64rem;
    line-height: 1;
  }

  .compact-panels-body {
    min-height: 0;
    max-height: calc(min(62dvh, 32rem) - 5.6rem);
    padding: 0 0.9rem calc(0.8rem + env(safe-area-inset-bottom));
    overflow-y: auto;
  }

  .compact-panels-body :global(.available-moves-panel),
  .compact-panels-body :global(.event-log) {
    min-height: auto;
  }

  .compact-readonly-state {
    display: grid;
    place-items: center;
    min-height: 12rem;
    gap: 0.4rem;
  }

  :global(.compact-concede-dialog) {
    max-width: min(92vw, 24rem);
  }

  :global(.compact-concede-dialog__header) {
    gap: 0.45rem;
  }

  :global(.compact-concede-dialog__title) {
    font-size: 0.98rem;
    font-weight: 800;
  }

  :global(.compact-concede-dialog__description) {
    color: rgba(226, 232, 240, 0.82);
  }

  :global(.compact-concede-dialog__footer) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.65rem;
  }

  :global(.compact-concede-dialog__button) {
    width: 100%;
  }

  .compact-readonly-state__title {
    margin: 0;
    font-size: 0.82rem;
    font-weight: 700;
    color: rgba(226, 232, 240, 0.9);
  }

  @media (max-width: 767px) {
    :global(.compact-panels-sheet) {
      max-height: min(64dvh, 34rem);
    }

    .compact-panels-body {
      max-height: calc(min(64dvh, 34rem) - 5.6rem);
    }
  }
</style>
