<script lang="ts">
  import MessageCircle from "@lucide/svelte/icons/message-circle";
  import OctagonX from "@lucide/svelte/icons/octagon-x";
  import Undo2 from "@lucide/svelte/icons/undo-2";
  import Users from "@lucide/svelte/icons/users";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { Button } from "$lib/design-system/primitives/button";
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import * as Popover from "$lib/design-system/primitives/popover";
  import * as Sidebar from "$lib/design-system/primitives/sidebar";
  import { m } from "$lib/i18n/messages.js";
  import { useLorcanaSidebarPresenter } from "@/features/simulator/context/game-context.svelte.js";
  import type { ConfirmableDirectMoveCategoryId } from "@/features/simulator/model/direct-action-state.js";
  import { getQuestAllSummary } from "@/features/simulator/model/turn-action-rail.js";
  import EventLogPanel from "@/features/simulator/panels/EventLogPanel.svelte";
  import PlayerInfo from "@/features/simulator/panels/PlayerInfo.svelte";
  import type { MatchNavigationContext } from "@/features/simulator/model/contracts.js";
  import { useHumanVsAiOrchestrator } from "@/features/simulator-devtools/vs-ai/context.js";
  import AiPlayerControls from "@/features/simulator-devtools/vs-ai/AiPlayerControls.svelte";
  import { maybeUseMatchChatControllerContext } from "@/features/match-chat/match-chat-controller.svelte.js";

  interface LorcanaSimulatorSidebarProps {
    readOnly?: boolean;
    onOpenHotkeys?: () => void;
    onOpenSupport?: () => void;
    supportReminderText?: string | null;
    supportReminderOpen?: boolean;
    onDismissSupportReminder?: () => void;
    pendingDirectMoveCategoryId?: ConfirmableDirectMoveCategoryId | null;
    onTriggerUndo?: (() => void) | null;
    onTriggerQuestAll?: (() => void) | null;
    matchContext?: MatchNavigationContext | null;
    onNextGame?: (() => void) | null;
    onReturnToMatchmaking?: (() => void | Promise<void>) | null;
    /** Whether the opponent is AFK (idle or tab hidden). */
    isOpponentAfk?: boolean;
    /** Whether the current viewer can report the opponent (auth + opponent identity available). */
    canReportOpponent?: boolean;
    onReportOpponent?: () => void;
  }

  let {
    readOnly = false,
    onOpenHotkeys,
    onOpenSupport,
    supportReminderText = null,
    supportReminderOpen = $bindable(false),
    onDismissSupportReminder,
    pendingDirectMoveCategoryId = null,
    onTriggerUndo = null,
    onTriggerQuestAll = null,
    matchContext = null,
    onNextGame = null,
    onReturnToMatchmaking = null,
    isOpponentAfk = false,
    canReportOpponent = false,
    onReportOpponent,
  }: LorcanaSimulatorSidebarProps = $props();

  const sidebar = useLorcanaSidebarPresenter();
  const aiOrchestratorStore = useHumanVsAiOrchestrator();
  const matchChatContext = maybeUseMatchChatControllerContext();
  const matchChatController = $derived(matchChatContext?.controller ?? null);

  const boardSnapshot = $derived(sidebar.boardSnapshot);
  const isPostGame = $derived(boardSnapshot?.status === "finished" || (matchContext?.matchCompleted ?? false));
  const topSide = $derived(sidebar.topSide);
  const bottomSide = $derived(sidebar.bottomSide);
  const hasOwnedView = $derived(sidebar.hasOwnedView);
  const headerPlayerData = $derived(sidebar.headerPlayerData);
  const footerPlayerData = $derived(sidebar.footerPlayerData);
  const headerPlayerLabel = $derived(sidebar.headerPlayerLabel);
  const footerPlayerLabel = $derived(sidebar.footerPlayerLabel);
  const headerPlayerIsMobile = $derived(sidebar.headerPlayerIsMobile);
  const footerPlayerIsMobile = $derived(sidebar.footerPlayerIsMobile);
  const headerPlayerMmr = $derived(sidebar.headerPlayerMmr);
  const footerPlayerMmr = $derived(sidebar.footerPlayerMmr);
  const headerPlayerSubscriptionTier = $derived(sidebar.headerPlayerSubscriptionTier);
  const footerPlayerSubscriptionTier = $derived(sidebar.footerPlayerSubscriptionTier);
  const moveLogEntries = $derived(sidebar.moveLogEntries);
  const ownerSide = $derived(sidebar.ownerSide);
  const activeSide = $derived(sidebar.activeSide);
  const showRawLogRegistryJson = $derived(sidebar.showRawLogRegistryJson);
  const canUndo = $derived(
    !readOnly && sidebar.moveCategorySummaries.some((summary) => summary.categoryId === "undo"),
  );
  const canConcede = $derived(!readOnly && sidebar.canConcede);
  const canSend = $derived(matchChatController?.canSend ?? false);
  const presetKeys = $derived(matchChatController?.presetKeys ?? []);
  const chatMessages = $derived(matchChatController?.messages ?? []);
  const freeTextEnabled = $derived(matchChatController?.freeTextEnabled ?? false);
  const freeTextProposalPending = $derived(
    matchChatController?.freeTextProposalPending ?? false,
  );
  const maxTextLength = $derived(matchChatController?.maxTextLength ?? 280);
  let chatDraftText = $state("");

  function handleSendChatDraft(): void {
    if (!matchChatController) return;
    const trimmed = chatDraftText.trim();
    if (trimmed.length === 0) return;
    matchChatController.sendText(trimmed);
    chatDraftText = "";
    chatPopoverOpen = false;
  }

  function handleChatDraftKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendChatDraft();
    }
  }

  function handleProposeFreeText(): void {
    matchChatController?.proposeEnableFreeText();
  }
  const undoArmed = $derived(pendingDirectMoveCategoryId === "undo");
  const undoLabel = $derived(
    undoArmed
      ? m["sim.actions.confirmMoveLabel"]({ label: m["sim.actions.label.undo"]({}) })
      : m["sim.actions.label.undo"]({}),
  );
  const concedeLabel = $derived(m["sim.actions.label.concede"]({}));
  const questAllSummary = $derived(
    getQuestAllSummary(sidebar.moveCategorySummaries, sidebar.cardSnapshotsById),
  );
  const canQuestAll = $derived(
    !readOnly && sidebar.moveCategorySummaries.some((summary) => summary.categoryId === "quest-all"),
  );
  const questAllArmed = $derived(pendingDirectMoveCategoryId === "quest-all");
  const questAllBaseLabel = $derived(
    questAllSummary
      ? m["sim.actions.label.questWithAll"]({ count: questAllSummary.count, lore: questAllSummary.lore })
      : m["sim.actions.label.questAll"]({}),
  );
  const questAllLabel = $derived(
    questAllArmed
      ? m["sim.actions.confirmMoveLabel"]({ label: questAllBaseLabel })
      : questAllBaseLabel,
  );

  let concedeDialogOpen = $state(false);
  let chatPopoverOpen = $state(false);

  function handleUndoClick(): void {
    if (!canUndo) {
      return;
    }

    onTriggerUndo?.();
  }

  function openConcedeDialog(): void {
    if (!canConcede) {
      return;
    }

    concedeDialogOpen = true;
  }

  function closeConcedeDialog(): void {
    concedeDialogOpen = false;
  }

  function confirmConcede(): void {
    concedeDialogOpen = false;
    sidebar.handleMobileConcede();
  }
</script>

  <Sidebar.Root collapsible="offcanvas" variant="sidebar" side="left">
  <Sidebar.Header class="sidebar-header-sticky">
    {#if matchContext && matchContext.format !== "best_of_1"}
      <div class="sidebar-match-badge" aria-label={m["sim.sidebar.matchInfoAria"]({})}>
        <span class="sidebar-match-badge__format">
          {matchContext.format === "best_of_3" ? m["sim.match.bo3"]({}) : m["sim.match.bo1"]({})}
        </span>
        <span class="sidebar-match-badge__sep">·</span>
        <span class="sidebar-match-badge__game">
          {m["sim.match.gameOf"]({ current: matchContext.gameIndex, total: matchContext.format === "best_of_3" ? 3 : 1 })}
        </span>
        <span class="sidebar-match-badge__sep">·</span>
        <span class="sidebar-match-badge__score">
          {#if hasOwnedView && bottomSide === "playerTwo"}
            {m["sim.match.score"]({ p1: matchContext.player2Score, p2: matchContext.player1Score })}
          {:else}
            {m["sim.match.score"]({ p1: matchContext.player1Score, p2: matchContext.player2Score })}
          {/if}
        </span>
      </div>
    {/if}
    {#if boardSnapshot && headerPlayerData}
      <PlayerInfo
        name={headerPlayerLabel}
        seat="top"
        side={topSide}
        lore={headerPlayerData.lore}
        deckCount={headerPlayerData.deckCount}
        handCount={headerPlayerData.handCount}
        discardCount={headerPlayerData.discardCount}
        inkwellCount={headerPlayerData.inkwellCount}
        availableInk={headerPlayerData.availableInk}
        isActive={activeSide === topSide}
        isOpponent={hasOwnedView}
        {hasOwnedView}
        isAfk={hasOwnedView && isOpponentAfk}
        isMobile={headerPlayerIsMobile}
        mmr={headerPlayerMmr}
        subscriptionTier={headerPlayerSubscriptionTier}
        timer={headerPlayerData.timer}
        showReport={hasOwnedView && canReportOpponent}
        onReportClick={onReportOpponent}
      >
        {#if $aiOrchestratorStore}
          <AiPlayerControls orchestrator={$aiOrchestratorStore} />
        {/if}
      </PlayerInfo>
    {/if}
  </Sidebar.Header>

  <Sidebar.Content class="sidebar-content-body">
    <div class="sidebar-content-stack">
      <EventLogPanel
        entries={moveLogEntries}
        viewerSide={ownerSide}
        {showRawLogRegistryJson}
        {chatMessages}
      />

      {#if canSend && presetKeys.length > 0}
        <div class="sidebar-chat-bubble-anchor">
          <Popover.Root bind:open={chatPopoverOpen}>
            <Popover.Trigger>
              <button
                type="button"
                class="sidebar-chat-bubble"
                aria-label={m["sim.tabletop.chat.title"]({})}
                title={m["sim.tabletop.chat.title"]({})}
              >
                <MessageCircle class="size-3" />
              </button>
            </Popover.Trigger>
            <Popover.Content
              class="sidebar-chat-popover"
              side="top"
              align="end"
              sideOffset={8}
            >
              <div class="sidebar-chat-popover__presets">
                {#each presetKeys as presetKey}
                  <Button
                    variant="ghost"
                    class="sidebar-preset-pill"
                    onclick={() => {
                      matchChatController?.sendPreset(presetKey);
                      chatPopoverOpen = false;
                    }}
                    aria-label={m["sim.tabletop.chat.sendPreset"]({ label: m[`sim.tabletop.chat.preset.${presetKey}`]({}) })}
                    title={m[`sim.tabletop.chat.preset.${presetKey}`]({})}
                  >
                    {m[`sim.tabletop.chat.preset.${presetKey}`]({})}
                  </Button>
                {/each}
              </div>

              {#if freeTextEnabled}
                <div class="sidebar-chat-popover__free-text">
                  <input
                    type="text"
                    bind:value={chatDraftText}
                    onkeydown={handleChatDraftKeydown}
                    maxlength={maxTextLength}
                    placeholder={m["sim.tabletop.chat.freeText.placeholder"]({})}
                    aria-label={m["sim.tabletop.chat.freeText.inputAria"]({})}
                    class="sidebar-chat-popover__input"
                  />
                  <Button
                    variant="ghost"
                    class="sidebar-preset-pill"
                    onclick={handleSendChatDraft}
                    disabled={chatDraftText.trim().length === 0}
                    aria-label={m["sim.tabletop.chat.freeText.sendAria"]({})}
                  >
                    {m["sim.tabletop.chat.freeText.sendLabel"]({})}
                  </Button>
                </div>
              {:else}
                <div class="sidebar-chat-popover__free-text">
                  <Button
                    variant="ghost"
                    class="sidebar-preset-pill sidebar-preset-pill--full"
                    onclick={handleProposeFreeText}
                    disabled={freeTextProposalPending}
                    aria-label={m["sim.tabletop.chat.freeText.proposeAria"]({})}
                    title={m["sim.tabletop.chat.freeText.proposeTitle"]({})}
                  >
                    {freeTextProposalPending
                      ? m["sim.tabletop.chat.freeText.proposePending"]({})
                      : m["sim.tabletop.chat.freeText.proposeLabel"]({})}
                  </Button>
                </div>
              {/if}
            </Popover.Content>
          </Popover.Root>
        </div>
      {/if}
    </div>
  </Sidebar.Content>

  <Sidebar.Footer class="sidebar-footer-sticky">
    {#if isPostGame}
      <div class="sidebar-post-game-strip" aria-label={m["sim.postGame.sidebar.navigationAria"]({})}>
        {#if matchContext && matchContext.format !== "best_of_1"}
          <div class="sidebar-post-game-score">
            {#if matchContext.nextGameId}
              <span>{m["sim.postGame.sidebar.gameOf"]({ current: matchContext.gameIndex, total: 3 })}</span>
              <span class="sidebar-post-game-score__sep">·</span>
              {#if hasOwnedView && bottomSide === "playerTwo"}
                <span>{matchContext.player2Score} – {matchContext.player1Score}</span>
              {:else}
                <span>{matchContext.player1Score} – {matchContext.player2Score}</span>
              {/if}
            {:else}
              <span>{m["sim.postGame.outcome.complete"]({})}</span>
              <span class="sidebar-post-game-score__sep">·</span>
              {#if hasOwnedView && bottomSide === "playerTwo"}
                <span>{matchContext.player2Score} – {matchContext.player1Score}</span>
              {:else}
                <span>{matchContext.player1Score} – {matchContext.player2Score}</span>
              {/if}
            {/if}
          </div>
        {/if}
        {#if matchContext?.nextGameId && onNextGame}
          <Button
            class="sidebar-action-button sidebar-post-game-cta--primary"
            onclick={() => onNextGame!()}
            disabled={matchContext.navigating}
          >
            {#if matchContext.navigating}
              <LoaderCircle class="mr-1.5 size-3.5 animate-spin" />
              {m["sim.sidebar.loadingNextGame"]({})}
            {:else}
              {m["sim.postGame.sidebar.goToNextGame"]({})}
            {/if}
          </Button>
        {:else}
          <Button
            class="sidebar-action-button sidebar-post-game-cta--primary"
            onclick={() => void onReturnToMatchmaking?.()}
          >
            {m["sim.postGame.returnToMatchmaking"]({})}
          </Button>
        {/if}
      </div>
    {:else}
    <div class="sidebar-action-strip" aria-label={m["sim.sidebar.actions.aria"]({})}>
        {#if canQuestAll}
          <Button
            variant="outline"
            class={`sidebar-action-button sidebar-action-button--quest-all${questAllArmed ? " sidebar-action-button--armed" : ""}`}
            onclick={() => onTriggerQuestAll?.()}
            aria-label={questAllLabel}
            title={questAllLabel}
          >
            <Users class="size-4" />
            <span>{questAllLabel}</span>
          </Button>
        {/if}

        <div class="sidebar-action-strip__row">
          <Button
            variant="outline"
            class={`sidebar-action-button sidebar-action-button--undo${undoArmed ? " sidebar-action-button--armed" : ""}`}
            onclick={handleUndoClick}
            disabled={!canUndo}
            aria-label={canUndo ? undoLabel : "Undo unavailable"}
            title={canUndo ? undoLabel : "Undo unavailable"}
          >
            <Undo2 class="size-4" />
            <span>{undoLabel}</span>
          </Button>

          <Button
            variant="outline"
            class="sidebar-action-button sidebar-action-button--concede"
            onclick={openConcedeDialog}
            disabled={!canConcede}
            aria-label={canConcede ? concedeLabel : "Concede unavailable"}
            title={canConcede ? concedeLabel : "Concede unavailable"}
          >
            <OctagonX class="size-4" />
            <span>{concedeLabel}</span>
          </Button>
        </div>

      </div>
    {/if}

    {#if boardSnapshot && footerPlayerData}
      <PlayerInfo
        seat="bottom"
        name={footerPlayerLabel}
        side={bottomSide}
        lore={footerPlayerData.lore}
        deckCount={footerPlayerData.deckCount}
        handCount={footerPlayerData.handCount}
        discardCount={footerPlayerData.discardCount}
        inkwellCount={footerPlayerData.inkwellCount}
        availableInk={footerPlayerData.availableInk}
        isActive={activeSide === bottomSide}
        isOpponent={false}
        {hasOwnedView}
        showSettings
        showSupport
        isMobile={footerPlayerIsMobile}
        mmr={footerPlayerMmr}
        subscriptionTier={footerPlayerSubscriptionTier}
        timer={footerPlayerData.timer}
        onSettingsClick={sidebar.handleOpenPlayerSettings}
        onSupportClick={onOpenSupport}
        {supportReminderText}
        bind:supportReminderOpen
        onDismissSupportReminder={onDismissSupportReminder}
      />
    {/if}
  </Sidebar.Footer>

  <Sidebar.Rail />
</Sidebar.Root>

<Dialog.Root bind:open={concedeDialogOpen}>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content class="sidebar-concede-dialog" showCloseButton={false}>
      <Dialog.Header class="sidebar-concede-dialog__header">
        <Dialog.Title class="sidebar-concede-dialog__title">
          {m["sim.sidebar.concedeDialog.title"]({})}
        </Dialog.Title>
        <Dialog.Description class="sidebar-concede-dialog__description">
          {m["sim.sidebar.concedeDialog.description"]({})}
        </Dialog.Description>
      </Dialog.Header>

      <Dialog.Footer class="sidebar-concede-dialog__footer">
        <Button
          variant="outline"
          class="sidebar-concede-dialog__button"
          onclick={closeConcedeDialog}
        >
          {m["sim.actions.cancel"]({})}
        </Button>
        <Button
          variant="destructive"
          class="sidebar-concede-dialog__button"
          onclick={confirmConcede}
        >
          {m["sim.actions.label.concede"]({})}
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global([data-sidebar="sidebar"]) {
    background: rgba(9, 16, 28, 0.92) !important;
    border-right: 1px solid rgba(113, 154, 204, 0.3);
  }

  :global(.sidebar-header-sticky) {
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(9, 16, 28, 0.92);
    border-bottom: 1px solid rgba(113, 154, 204, 0.3);
    padding: 0.35rem 0.4rem;
    flex-shrink: 0;
  }

  .sidebar-match-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    font-size: 0.68rem;
    font-weight: 600;
    color: rgba(148, 163, 184, 0.9);
    letter-spacing: 0.02em;
    padding: 0.2rem 0.1rem 0.25rem;
    border-bottom: 1px solid rgba(109, 149, 195, 0.16);
    margin-bottom: 0.15rem;
  }

  .sidebar-match-badge__sep {
    color: rgba(100, 116, 139, 0.5);
  }

  :global(.sidebar-footer-sticky) {
    position: sticky;
    bottom: 0;
    z-index: 10;
    background: rgba(9, 16, 28, 0.92);
    border-top: 1px solid rgba(113, 154, 204, 0.3);
    padding: 0.35rem 0.4rem;
    margin-top: auto;
    flex-shrink: 0;
  }

  :global(.sidebar-content-body) {
    flex: 1;
    min-height: 0;
    padding: 0.25rem 0.4rem;
    overflow: hidden;
  }

  .sidebar-content-stack {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .sidebar-chat-bubble-anchor {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 10;
  }

  .sidebar-action-strip {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    border-bottom: 1px solid rgba(109, 149, 195, 0.16);
    padding-bottom: 0.45rem;
    margin-bottom: 0.1rem;
  }

  .sidebar-post-game-strip {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    border-bottom: 1px solid rgba(109, 149, 195, 0.16);
    padding-bottom: 0.45rem;
    margin-bottom: 0.1rem;
  }

  .sidebar-post-game-score {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(148, 163, 184, 0.9);
    letter-spacing: 0.02em;
    padding: 0 0.1rem;
  }

  .sidebar-post-game-score__sep {
    color: rgba(100, 116, 139, 0.55);
  }

  :global(.sidebar-post-game-cta--primary) {
    min-height: 2.4rem;
    justify-content: center;
    gap: 0.45rem;
    border-radius: 0.9rem;
    font-size: 0.78rem;
    font-weight: 800;
    background:
      linear-gradient(180deg, rgba(14, 116, 144, 0.92), rgba(8, 47, 73, 0.96));
    border-color: rgba(125, 211, 252, 0.42);
    color: #f8fafc;
  }

  :global(.sidebar-post-game-cta--secondary) {
    min-height: 2.4rem;
    justify-content: center;
    gap: 0.45rem;
    border-radius: 0.9rem;
    font-size: 0.72rem;
    font-weight: 700;
    border-color: rgba(125, 211, 252, 0.18);
    background:
      linear-gradient(180deg, rgba(8, 47, 73, 0.6), rgba(15, 23, 42, 0.7));
    color: #cbd5e1;
  }

  .sidebar-action-strip__row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .sidebar-chat-bubble {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 999px;
    border: 1px solid rgba(125, 211, 252, 0.22);
    background:
      linear-gradient(180deg, rgba(8, 47, 73, 0.88), rgba(15, 23, 42, 0.96));
    color: #e0f2fe;
    cursor: pointer;
    transition:
      border-color 160ms ease,
      background 160ms ease,
      transform 160ms ease;
  }

  .sidebar-chat-bubble:hover {
    border-color: rgba(125, 211, 252, 0.48);
    background:
      linear-gradient(180deg, rgba(14, 62, 95, 0.92), rgba(20, 32, 52, 0.98));
    transform: scale(1.06);
  }

  :global(.sidebar-chat-popover) {
    width: auto;
    min-width: 10rem;
    max-width: 16rem;
    padding: 0.5rem;
    border-radius: 0.85rem;
    border: 1px solid rgba(125, 211, 252, 0.22);
    background: rgba(9, 16, 28, 0.96);
    box-shadow: 0 12px 32px rgba(2, 6, 23, 0.6);
  }

  .sidebar-chat-popover__presets {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .sidebar-chat-popover__free-text {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(125, 211, 252, 0.18);
  }

  .sidebar-chat-popover__input {
    flex: 1;
    min-height: 2rem;
    padding: 0 0.55rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(125, 211, 252, 0.22);
    background: rgba(15, 23, 42, 0.6);
    color: #e0f2fe;
    font-size: 0.72rem;
  }

  .sidebar-chat-popover__input:focus {
    outline: none;
    border-color: rgba(125, 211, 252, 0.55);
  }

  :global(.sidebar-preset-pill--full) {
    flex: 1;
    justify-content: center;
  }

  :global(.sidebar-action-button) {
    min-height: 2.4rem;
    justify-content: center;
    gap: 0.45rem;
    border-radius: 0.9rem;
    font-size: 0.78rem;
    font-weight: 800;
  }

  :global(.sidebar-action-button--quest-all) {
    min-height: 2rem;
    gap: 0.3rem;
    border-color: rgba(125, 211, 252, 0.24);
    background:
      linear-gradient(180deg, rgba(8, 47, 73, 0.9), rgba(15, 23, 42, 0.98));
    color: #e0f2fe;
    font-size: 0.7rem;
  }

  :global(.sidebar-action-button--undo) {
    border-color: rgba(125, 211, 252, 0.22);
    background:
      linear-gradient(180deg, rgba(8, 47, 73, 0.88), rgba(15, 23, 42, 0.96));
    color: #e0f2fe;
  }

  :global(.sidebar-action-button--concede) {
    border-color: rgba(153, 27, 27, 0.42);
    background:
      linear-gradient(180deg, rgba(69, 10, 10, 0.76), rgba(28, 25, 23, 0.94));
    color: #fee2e2;
  }

  :global(.sidebar-action-button--armed) {
    border-color: rgba(251, 191, 36, 0.58);
    box-shadow:
      0 0 0 1px rgba(251, 191, 36, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  :global(.sidebar-action-button:disabled) {
    border-color: rgba(148, 163, 184, 0.18);
    background: rgba(15, 23, 42, 0.34);
    color: rgba(148, 163, 184, 0.78);
    opacity: 1;
  }

  :global(.sidebar-preset-pill) {
    height: auto;
    min-height: 1.7rem;
    padding: 0.22rem 0.6rem;
    border-radius: 999px;
    border: 1px solid rgba(109, 149, 195, 0.22);
    background: rgba(15, 28, 48, 0.55);
    color: #c7d9ee;
    font-size: 0.68rem;
    font-weight: 600;
    line-height: 1.3;
    white-space: normal;
    text-align: center;
  }

  :global(.sidebar-preset-pill:hover) {
    background: rgba(30, 55, 88, 0.75);
    border-color: rgba(125, 211, 252, 0.38);
    color: #e0f2fe;
  }

  :global(.sidebar-concede-dialog) {
    max-width: 24rem;
  }

  :global(.sidebar-concede-dialog__header) {
    gap: 0.45rem;
  }

  :global(.sidebar-concede-dialog__title) {
    font-size: 1rem;
    font-weight: 800;
  }

  :global(.sidebar-concede-dialog__description) {
    color: rgba(71, 85, 105, 1);
  }

  :global(.sidebar-concede-dialog__footer) {
    display: flex;
    justify-content: flex-end;
    gap: 0.65rem;
  }

  :global(.sidebar-concede-dialog__button) {
    min-width: 7rem;
  }
</style>
