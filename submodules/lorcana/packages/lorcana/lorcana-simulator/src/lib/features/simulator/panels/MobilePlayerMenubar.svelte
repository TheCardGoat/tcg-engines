<script lang="ts">
  import { tick } from "svelte";
  import {
    Activity,
    BookOpenText,
    CircleHelp,
    ClipboardEdit,
    Eye,
    Flag,
    Gem,
    Hand,
    Layers,
    MessageSquare,
    PaintBucket,
    Settings,
    Sparkles,
    Star,
    ShieldCheck,
    Swords,
    Trash2,
    X,
    OctagonX,
    LoaderCircle,
  } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import * as Drawer from "$lib/components/ui/drawer";
  import { ScrollArea } from "$lib/design-system/primitives/scroll-area";
  import { m } from "$lib/i18n/messages.js";
  import SimulatorSupportActions from "@/features/simulator/support/SimulatorSupportActions.svelte";
  import SimulatorSupportReminder from "@/features/simulator/support/SimulatorSupportReminder.svelte";
  import { resolvePatronTierConfig } from "@/features/simulator/model/player-tier.js";
  import MatchChatPanel from "@/features/match-chat/MatchChatPanel.svelte";
  import { maybeUseMatchChatControllerContext } from "@/features/match-chat/match-chat-controller.svelte.js";
  import type { BugReportContext } from "@/features/simulator/support/feedback-api.js";
  import type {
    ActionAvailableMovesSelectionState,
    ExecutableMoveEntry,
    ExecutableMovePresentationCategoryId,
    LorcanaCardSnapshot,
    LorcanaPlayerSide,
    LorcanaPlayerSummary,
    MoveCategorySummary,
  } from "@/features/simulator/model/contracts.js";
  import { getExertIconUrl, getLoreIconUrl } from "@/features/simulator/model/asset-urls.js";
  import {
    type RevealedBottomControlState,
    type RevealedBottomControlId,
    isBottomControlRevealed,
    revealBottomControl,
    sortBottomSeatMoveSummaries,
  } from "@/features/simulator/panels/mobile-player-menubar.js";
  import { getMoveCategoryIcon } from "@/features/simulator/model/action-icons.js";
  import PlayerTimer from "@/features/simulator/panels/PlayerTimer.svelte";
  import PlayerIdentityStrip from "@/features/simulator/panels/PlayerIdentityStrip.svelte";
  import type {
    ConfirmableDirectMoveCategoryId,
  } from "@/features/simulator/model/direct-action-state.js";
  import type { ClockSnapshot } from "@tcg/lorcana-engine";
  import type { MatchNavigationContext } from "@/features/simulator/model/contracts.js";

  interface CompactPlayerSummary {
    label: string;
    /** Real account display name when available (preferred). */
    displayName?: string | null;
    /** Subscription tier id (tier2..tier5) for badge styling. */
    subscriptionTier?: string | null;
    bracketId?: string | null;
    mmr?: number | null;
    isMobile?: boolean;
    side: LorcanaPlayerSide;
    summary: LorcanaPlayerSummary | null;
    isActive: boolean;
    isTurnPlayer: boolean;
    hasPriority: boolean;
  }

  interface MoveConfirmationState {
    categoryId: ExecutableMovePresentationCategoryId;
    title: string;
    description: string;
    confirmLabel: string;
    tone: "default" | "danger";
  }

  interface MobilePlayerMenubarProps {
    seat: "top" | "bottom";
    player: CompactPlayerSummary;
    actionCount?: number;
    moveSummaries?: MoveCategorySummary[];
    activeMoveCategoryId?: ExecutableMovePresentationCategoryId | null;
    timer?: ClockSnapshot;
    isOwnClock?: boolean;
    questAllCount?: number | null;
    questAllLore?: number | null;
    armedDirectCategoryId?: ConfirmableDirectMoveCategoryId | null;
    pendingCount?: number;
    hasPendingEffects?: boolean;
    pendingEffectsOpen?: boolean;
    logCount?: number;
    selectedCard?: LorcanaCardSnapshot | null;
    selectedCardPlayable?: boolean;
    canConcede?: boolean;
    /** Whether the seat can request Board State Correction right now. */
    canRequestBoardStateCorrection?: boolean;
    /** Whether Board State Correction is currently active (toggles label). */
    isCorrectionActive?: boolean;
    onRequestBoardStateCorrection?: () => void;
    onOpenDetails?: () => void;
    onOpenMoves?: () => void;
    onExecuteMoveCategory?: (categoryId: ExecutableMovePresentationCategoryId) => void;
    onOpenLog?: () => void;
    onOpenPendingEffects?: () => void;
    onOpenSettings?: () => void;
    onOpenSupport?: () => void;
    supportReminderText?: string | null;
    supportReminderOpen?: boolean;
    onDismissSupportReminder?: () => void;
    onOpenFeedback?: () => void;
    onOpenBugReport?: () => void;
    onOpenCardPreview?: () => void;
    onConcede?: () => void;
    onReportPlayer?: () => void;
    bugReportContext?: BugReportContext;
    isPostGame?: boolean;
    matchContext?: MatchNavigationContext | null;
    ownerSide?: import("@/features/simulator/model/contracts.js").LorcanaPlayerSide | null;
    onNextGame?: (() => void) | null;
    onReturnToMatchmaking?: (() => void | Promise<void>) | null;
  }

  let {
    seat,
    player,
    actionCount = 0,
    moveSummaries = [],
    activeMoveCategoryId = null,
    timer,
    isOwnClock = false,
    questAllCount = null,
    questAllLore = null,
    armedDirectCategoryId = null,
    pendingCount = 0,
    hasPendingEffects = false,
    pendingEffectsOpen = false,
    logCount = 0,
    selectedCard = null,
    selectedCardPlayable = false,
    canConcede = false,
    canRequestBoardStateCorrection = false,
    isCorrectionActive = false,
    onRequestBoardStateCorrection,
    onOpenDetails,
    onOpenMoves,
    onExecuteMoveCategory,
    onOpenLog,
    onOpenPendingEffects,
    onOpenSettings,
    onOpenSupport,
    supportReminderText = null,
    supportReminderOpen = $bindable(false),
    onDismissSupportReminder,
    onOpenFeedback,
    onOpenBugReport,
    onOpenCardPreview,
    onConcede,
    onReportPlayer,
    bugReportContext,
    isPostGame = false,
    matchContext = null,
    ownerSide = null,
    onNextGame = null,
    onReturnToMatchmaking = null,
  }: MobilePlayerMenubarProps = $props();

  let detailsOpen = $state(false);
  let confirmDialogOpen = $state(false);
  let moveConfirmation = $state<MoveConfirmationState | null>(null);
  let revealedBottomControls = $state<RevealedBottomControlState>(null);
  let chatDrawerOpen = $state(false);
  let lastSeenChatCount = $state(0);
  const chatControllerContext = maybeUseMatchChatControllerContext();
  const chatController = $derived(chatControllerContext?.controller ?? null);
  const chatMessageCount = $derived(chatController?.messages.length ?? 0);
  const chatUnreadCount = $derived(Math.max(0, chatMessageCount - lastSeenChatCount));
  $effect(() => {
    if (chatDrawerOpen) {
      lastSeenChatCount = chatMessageCount;
    }
  });
  function handleOpenChat(): void {
    chatDrawerOpen = true;
  }

  const loreIconUrl = getLoreIconUrl();
  const exertIconUrl = getExertIconUrl();
  const loreValue = $derived(player.summary?.lore ?? 0);
  const handCount = $derived(player.summary?.handCount ?? 0);
  const deckCount = $derived(player.summary?.deckCount ?? 0);
  const discardCount = $derived(player.summary?.discardCount ?? 0);
  const inkSummary = $derived(`${player.summary?.availableInk ?? 0}/${player.summary?.inkwellCount ?? 0}`);
  const seatLabel = $derived(seat === "top" ? "opponent" : "player");
  const detailsSide = $derived(seat === "top" ? "top" : "bottom");
  const seatEyebrow = $derived(
    seat === "top" ? m["sim.player.opponent"]({}) : m["sim.player.you"]({}),
  );
  const displayName = $derived(
    player.displayName && player.displayName.trim().length > 0
      ? player.displayName
      : player.label,
  );
  const hasDistinctDisplayName = $derived(
    displayName.trim().toLocaleLowerCase() !== seatEyebrow.trim().toLocaleLowerCase(),
  );
  const patronConfig = $derived(resolvePatronTierConfig(player.subscriptionTier));
  const stateBadges = $derived.by(() => {
    const badges: string[] = [];
    if (player.isActive) {
      badges.push("Active");
    }
    if (player.isTurnPlayer) {
      badges.push("Turn");
    }
    if (player.hasPriority) {
      badges.push("Priority");
    }
    return badges;
  });
  const loreMaskStyle = `mask-image: url("${loreIconUrl}"); -webkit-mask-image: url("${loreIconUrl}");`;
  const exertMaskStyle = `mask-image: url("${exertIconUrl}"); -webkit-mask-image: url("${exertIconUrl}");`;
  const confirmationMoveCategoryIds = new Set<ExecutableMovePresentationCategoryId>([
    "concede",
  ]);
  const moveStripBlockedCategoryIds = new Set<ExecutableMovePresentationCategoryId>([
    "concede",
    "pass-turn",
    "quest-all",
  ]);
  const passTurnSummary = $derived(
    seat === "bottom"
      ? moveSummaries.find((summary) => summary.categoryId === "pass-turn") ?? null
      : null,
  );
  const passTurnAvailable = $derived(passTurnSummary !== null);
  const questAllSummary = $derived(
    seat === "bottom"
      ? moveSummaries.find((summary) => summary.categoryId === "quest-all") ?? null
      : null,
  );
  const questAllAvailable = $derived(
    questAllSummary !== null && questAllLore !== null && questAllCount !== null,
  );
  const passTurnArmed = $derived(armedDirectCategoryId === "pass-turn");
  const questAllArmed = $derived(armedDirectCategoryId === "quest-all");
  const passTurnButtonLabel = $derived(
    passTurnArmed
      ? m["sim.actions.confirmMoveLabel"]({ label: m["sim.actions.label.passTurn"]({}) })
      : m["sim.actions.label.passTurn"]({}),
  );
  const questAllButtonLabel = $derived(
    questAllArmed
      ? "Confirm"
      : m["sim.actions.label.questAll"]({}),
  );
  const questAllAriaLabel = $derived(
    questAllLore !== null && questAllCount !== null
      ? `Quest with all using ${questAllCount} character${questAllCount === 1 ? "" : "s"} for ${questAllLore} lore`
      : "Quest with all",
  );
  const safeMoveSummaries = $derived.by(() =>
    seat === "bottom"
      ? moveSummaries.filter((summary) => !moveStripBlockedCategoryIds.has(summary.categoryId))
      : moveSummaries,
  );
  const orderedSafeMoveSummaries = $derived.by(() => {
    if (seat !== "bottom") {
      return safeMoveSummaries;
    }

    return sortBottomSeatMoveSummaries(safeMoveSummaries);
  });
  const safeActionCount = $derived(
    seat === "bottom"
      ? Math.max(0, actionCount - Number(passTurnSummary !== null) - Number(canConcede))
      : actionCount,
  );
  const moveButtonSummaries = $derived.by(() =>
    seat === "bottom"
      ? orderedSafeMoveSummaries.map((summary) => ({
          ...summary,
          icon: getMoveCategoryIcon(summary.categoryId),
          isActive: activeMoveCategoryId === summary.categoryId,
          requiresConfirmation: confirmationMoveCategoryIds.has(summary.categoryId),
          showLabel: isBottomControlRevealed(revealedBottomControls, summary.categoryId),
        }))
      : [],
  );
  $effect(() => {
    const categoryId = moveConfirmation?.categoryId;
    if (!categoryId) {
      return;
    }

    if (!moveSummaries.some((summary) => summary.categoryId === categoryId)) {
      moveConfirmation = null;
      confirmDialogOpen = false;
    }
  });

  $effect(() => {
    if (!confirmDialogOpen && moveConfirmation) {
      moveConfirmation = null;
    }
  });

  function openDetails(): void {
    detailsOpen = true;
    onOpenDetails?.();
  }

  function handleSettingsClick(): void {
    detailsOpen = false;
    onOpenSettings?.();
  }

  function handleReportClick(): void {
    detailsOpen = false;
    onReportPlayer?.();
  }

  function handleCorrectionClick(): void {
    if (!canRequestBoardStateCorrection && !isCorrectionActive) {
      return;
    }
    detailsOpen = false;
    onRequestBoardStateCorrection?.();
  }

  async function handleConcedeClick(): Promise<void> {
    if (!canConcede) {
      return;
    }

    detailsOpen = false;
    await tick();
    openMoveConfirmation("concede");
  }

  function handlePassTurnClick(): void {
    if (!passTurnAvailable) {
      return;
    }

    markBottomControlAsRevealed("pass-turn");
    onExecuteMoveCategory?.("pass-turn");
  }

  function handleQuestAllClick(): void {
    if (!questAllAvailable) {
      return;
    }

    markBottomControlAsRevealed("quest-all");
    onExecuteMoveCategory?.("quest-all");
  }

  function handleMoveCategoryClick(categoryId: ExecutableMovePresentationCategoryId): void {
    markBottomControlAsRevealed(categoryId);

    if (confirmationMoveCategoryIds.has(categoryId)) {
      openMoveConfirmation(categoryId);
      return;
    }

    onExecuteMoveCategory?.(categoryId);
  }

  function handlePendingEffectsClick(): void {
    markBottomControlAsRevealed("pending-effects");
    onOpenPendingEffects?.();
  }

  function markBottomControlAsRevealed(controlId: RevealedBottomControlId): void {
    if (seat !== "bottom") {
      return;
    }

    revealedBottomControls = revealBottomControl(revealedBottomControls, controlId);
  }

  function openMoveConfirmation(categoryId: ExecutableMovePresentationCategoryId): void {
    moveConfirmation = {
      categoryId,
      title: "Concede game?",
      description: "This will immediately end the current match for you.",
      confirmLabel: "Concede",
      tone: "danger",
    };
    confirmDialogOpen = true;
  }

  function closeMoveConfirmation(): void {
    confirmDialogOpen = false;
    moveConfirmation = null;
  }

  function confirmMoveConfirmation(): void {
    const confirmation = moveConfirmation;
    if (!confirmation) {
      return;
    }

    confirmDialogOpen = false;
    moveConfirmation = null;

    if (confirmation.categoryId === "concede" && !onExecuteMoveCategory) {
      detailsOpen = false;
      onConcede?.();
      return;
    }

    onExecuteMoveCategory?.(confirmation.categoryId);
  }

</script>

{#if seat === "bottom"}
  <div class="mobile-menubar-frame mobile-menubar-frame--bottom">
    <div class="mobile-menubar-shell mobile-menubar-shell--bottom" data-testid="mobile-bottom-menubar">
      {#if isPostGame}
      <div class="mobile-menubar-primary" data-testid="mobile-bottom-primary">
        <Button
          variant="outline"
          size="xs"
          class="mobile-bottom-primary-action quick-action quick-action--revealed mobile-bottom-control mobile-bottom-lore"
          onclick={openDetails}
          aria-label={`Open ${seatLabel} details`}
          data-testid={`mobile-${seat}-lore-chip`}
        >
          <span class="lore-chip__content">
            <span aria-hidden="true" class="lore-chip__icon" style={loreMaskStyle}></span>
            <span class="lore-chip__value">{loreValue}</span>
          </span>
        </Button>
      </div>
        <div class="mobile-menubar-post-game-cta" data-testid="mobile-bottom-post-game-cta">
          {#if matchContext?.nextGameId && onNextGame}
            <Button
              class="mobile-post-game-cta-button mobile-post-game-cta-button--primary"
              onclick={() => onNextGame!()}
              disabled={matchContext.navigating}
            >
              {#if matchContext.navigating}
                <LoaderCircle class="mr-1.5 size-3.5 animate-spin" />
                Loading…
              {:else}
                Next Game →
              {/if}
            </Button>
          {:else}
            <Button
              class="mobile-post-game-cta-button mobile-post-game-cta-button--primary"
              onclick={() => void onReturnToMatchmaking?.()}
            >
              Return to Matchmaking
            </Button>
          {/if}
        </div>
      {:else}
      <div class="mobile-menubar-cluster mobile-menubar-cluster--utility" data-testid="mobile-bottom-utility-cluster">
        <div class="mobile-menubar-primary" data-testid="mobile-bottom-primary">
          <Button
            variant="outline"
            size="xs"
            class="mobile-bottom-primary-action quick-action quick-action--revealed mobile-bottom-control mobile-bottom-lore"
            onclick={openDetails}
            aria-label={`Open ${seatLabel} details`}
            data-testid={`mobile-${seat}-lore-chip`}
          >
            <span class="lore-chip__content">
              <span aria-hidden="true" class="lore-chip__icon" style={loreMaskStyle}></span>
              <span class="lore-chip__value">{loreValue}</span>
            </span>
          </Button>
        </div>
      <div
        data-slot="button-group"
        class="mobile-menubar-center"
        data-testid="mobile-bottom-center"
      >
        {#if timer}
          <div class="mobile-turn-status mobile-turn-status--pinned" data-testid="mobile-bottom-timer">
            <PlayerTimer snapshot={timer} {isOwnClock} />
          </div>
        {/if}

        <div class="mobile-menubar-scroller" data-testid="mobile-bottom-utility">
          <div class="mobile-move-strip" aria-label="Available moves" data-testid="mobile-bottom-move-strip">
            {#each moveButtonSummaries as summary (summary.categoryId)}
              {@const Icon = summary.icon}
              <Button
                variant="outline"
                size="icon-sm"
                class={`quick-action quick-action--icon-only mobile-bottom-control${summary.isActive ? " quick-action--primary" : ""}${summary.categoryId === "concede" ? " quick-action--danger" : ""}`}
                onclick={() => handleMoveCategoryClick(summary.categoryId)}
                aria-label={summary.categoryLabel}
                title={summary.categoryLabel}
                data-testid={`mobile-bottom-move-${summary.categoryId}`}
              >
                <Icon class="size-4" />
              </Button>
            {/each}

            {#if moveButtonSummaries.length === 0 && safeActionCount > 0}
              <Button
                variant="outline"
                size="icon-sm"
                class="quick-action quick-action--icon-only mobile-bottom-control"
                onclick={onOpenMoves}
                aria-label="Open available moves"
                title="Open available moves"
                data-testid="mobile-bottom-move-fallback"
              >
                <Swords class="size-4" />
                <span class="quick-action__badge">{actionCount}</span>
              </Button>
            {/if}

            {#if hasPendingEffects}
              <Button
                variant="outline"
                size="icon-sm"
                class="quick-action quick-action--icon-only quick-metric quick-metric--interactive mobile-bottom-control"
                onclick={handlePendingEffectsClick}
                aria-label={`Resolve next pending effect (${pendingCount} queued)`}
                title={`Resolve next pending effect (${pendingCount} queued)`}
                aria-pressed={pendingEffectsOpen}
                data-testid="mobile-bottom-pending-effects"
              >
                <Activity class="size-4" />
                <span class="quick-action__badge">{pendingCount}</span>
              </Button>
            {/if}
          </div>
        </div>
      </div>
      </div><!-- /.mobile-menubar-cluster--utility -->

      <div class="mobile-menubar-cluster mobile-menubar-cluster--primary" data-testid="mobile-bottom-primary-cluster">
      <div class="mobile-menubar-pinned-actions" data-testid="mobile-bottom-secondary">
        <Button
          variant="outline"
          size="icon-sm"
          class={`mobile-bottom-primary-action quick-action quick-action--revealed quick-action--quest-all mobile-bottom-control${questAllArmed ? " quick-action--primary" : ""}${questAllAvailable ? "" : " mobile-bottom-primary-action--ghost"}`}
          onclick={handleQuestAllClick}
          disabled={!questAllAvailable}
          aria-label={questAllAvailable ? questAllAriaLabel : "Quest with all unavailable"}
          title={questAllAvailable ? questAllAriaLabel : "Quest with all unavailable"}
          data-testid="mobile-bottom-quest-all"
        >
          <span class="quick-action__label-group">
            <span class="quick-action__label quick-action__label--micro">
              {questAllButtonLabel}
            </span>
            {#if questAllLore !== null && questAllCount !== null}
              <span class="quick-action__stat-row">
                <span class="quick-action__stat" aria-label={`${questAllCount} ready characters`}>
                  <span
                    aria-hidden="true"
                    class="quick-action__stat-icon quick-action__stat-icon--exert"
                    style={exertMaskStyle}
                  ></span>
                  <span>{questAllCount}</span>
                </span>
                <span class="quick-action__stat" aria-label={`${questAllLore} lore`}>
                  <span
                    aria-hidden="true"
                    class="quick-action__stat-icon quick-action__stat-icon--lore"
                    style={loreMaskStyle}
                  ></span>
                  <span>+{questAllLore}</span>
                </span>
              </span>
            {/if}
          </span>
        </Button>

        <Button
          variant="outline"
          size="icon-sm"
          class={`mobile-bottom-primary-action quick-action quick-action--revealed quick-action--pass-turn mobile-bottom-control${passTurnArmed ? " quick-action--primary" : ""}${passTurnAvailable ? "" : " mobile-bottom-primary-action--ghost"}`}
          onclick={handlePassTurnClick}
          disabled={!passTurnAvailable}
          aria-label={passTurnAvailable ? passTurnButtonLabel : "Pass turn unavailable"}
          title={passTurnAvailable ? passTurnButtonLabel : "Pass turn unavailable"}
          data-testid="mobile-bottom-pass-turn"
        >
          <span class="quick-action__label quick-action__label--micro">
            {passTurnButtonLabel}
          </span>
        </Button>
      </div>
      </div><!-- /.mobile-menubar-cluster--primary -->
      {/if}
    </div>
  </div>
{:else}
  <div
    class={`mobile-menubar-frame mobile-menubar-frame--top border border-sky-300/20 px-0.5 py-0.5 bg-slate-950/90 shadow-[0_14px_36px_rgba(2,6,23,0.36)] backdrop-blur${seat === "top" ? " rounded-b-2xl" : ""}`}
  >
    <div class="mobile-menubar-shell">
      <Button
        variant="outline"
        size="xs"
        class="lore-chip lore-chip--compact"
        onclick={openDetails}
        aria-label={`Open ${seatLabel} details`}
        data-testid={`mobile-${seat}-lore-chip`}
      >
        <span class="lore-chip__content">
          <span aria-hidden="true" class="lore-chip__icon" style={loreMaskStyle}></span>
          <span class="lore-chip__value">{loreValue}</span>
        </span>
      </Button>

      {#if timer}
        <div class="mobile-turn-status mobile-turn-status--pinned" data-testid="mobile-top-timer">
          <PlayerTimer snapshot={timer} isOwnClock={false} />
        </div>
      {/if}

      {#if matchContext && matchContext.format !== "best_of_1"}
        <span class="mobile-match-badge" aria-label="Match info">
          {matchContext.format === "best_of_3" ? m["sim.match.bo3"]({}) : m["sim.match.bo1"]({})}
          <span class="mobile-match-badge__sep">·</span>
          {matchContext.gameIndex}/{matchContext.format === "best_of_3" ? 3 : 1}
          <span class="mobile-match-badge__sep">·</span>
          {#if ownerSide === "playerTwo"}
            {matchContext.player2Score}-{matchContext.player1Score}
          {:else}
            {matchContext.player1Score}-{matchContext.player2Score}
          {/if}
        </span>
      {/if}

      <div data-slot="button-group" class="mobile-action-group">
        <Button
          variant="outline"
          size="icon-sm"
          class="quick-action quick-action--icon-only"
          onclick={onOpenCardPreview}
          disabled={!selectedCard}
          aria-label="Open selected card preview"
          title={selectedCard ? selectedCard.label : "No card selected"}
        >
          <Eye class="size-4" />
          {#if selectedCardPlayable}
            <span class="quick-action__badge quick-action__badge--playable">Live</span>
          {/if}
        </Button>

        {#if supportReminderText && onOpenSupport}
          <SimulatorSupportReminder
            text={supportReminderText}
            bind:open={supportReminderOpen}
            side="top"
            align="end"
            onOpen={onOpenSupport}
            onDismiss={onDismissSupportReminder}
          >
            {#snippet child({ props })}
              <Button
                variant="outline"
                size="icon-sm"
                class="quick-action quick-action--icon-only"
                onclick={onOpenSupport}
                aria-label={m["sim.player.support.openAria"]({})}
                title={m["sim.player.support.openAria"]({})}
                {...props}
              >
                <CircleHelp class="size-4" />
              </Button>
            {/snippet}
          </SimulatorSupportReminder>
        {:else}
          <Button
            variant="outline"
            size="icon-sm"
            class="quick-action quick-action--icon-only"
            onclick={onOpenSupport}
            aria-label={m["sim.player.support.openAria"]({})}
            title={m["sim.player.support.openAria"]({})}
          >
            <CircleHelp class="size-4" />
          </Button>
        {/if}

        {#if chatController}
          <Button
            variant="outline"
            size="icon-sm"
            class="quick-action quick-action--icon-only"
            onclick={handleOpenChat}
            aria-label={chatUnreadCount > 0 ? `Open chat (${chatUnreadCount} new)` : "Open chat"}
            title="Open chat"
            data-testid="mobile-top-chat"
          >
            <MessageSquare class="size-4" />
            {#if chatUnreadCount > 0}
              <span class="quick-action__badge quick-action__badge--chat">{chatUnreadCount > 9 ? "9+" : chatUnreadCount}</span>
            {/if}
          </Button>
        {/if}

        <Button
          variant="outline"
          size="icon-sm"
          class="quick-action quick-action--icon-only"
          onclick={onOpenSettings}
          aria-label="Open player settings"
          title="Open player settings"
        >
          <Settings class="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon-sm"
          class="quick-action quick-action--icon-only"
          onclick={onOpenLog}
          aria-label="Open event log"
          title="Open event log"
        >
          <BookOpenText class="size-4" />
          <span class="quick-action__badge">{logCount}</span>
        </Button>
      </div>
    </div>
  </div>
{/if}

<Drawer.Root bind:open={detailsOpen} direction={detailsSide} shouldScaleBackground={false}>
  <Drawer.Content class={`player-details-sheet player-details-sheet--${detailsSide} border-sky-300/20 bg-slate-950/98 text-slate-100`}>
    <Drawer.Header class="player-details-sheet__header">
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <span class="player-details-sheet__eyebrow">{seatEyebrow}</span>
          <Drawer.Title class="player-details-sheet__title">
            {hasDistinctDisplayName ? displayName : seatEyebrow}
          </Drawer.Title>
        </div>
        <Drawer.Close class="drawer-close-button" aria-label={`Close ${seatLabel} details`}>
          <X class="size-4" />
        </Drawer.Close>
      </div>
    </Drawer.Header>

    <ScrollArea>
      <div class="space-y-2.5 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div class="rounded-[1rem] bg-slate-900/90 p-2.5 ring-1 ring-inset ring-sky-300/12">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                {#if patronConfig}
                  <span
                    class="player-patron-pill"
                    style:--patron-color={patronConfig.color}
                    style:--patron-glow={patronConfig.glow}
                    style:--patron-border={patronConfig.borderColor}
                    title={patronConfig.name()}
                    aria-label={patronConfig.name()}
                  >
                    {#if patronConfig.icon === "sparkles"}
                      <Sparkles size={10} />
                    {:else if patronConfig.icon === "gem"}
                      <Gem size={10} />
                    {:else if patronConfig.icon === "shield"}
                      <ShieldCheck size={10} />
                    {:else}
                      <Star size={10} />
                    {/if}
                  </span>
                {/if}
                {#if hasDistinctDisplayName}
                  <span class="player-details-sheet__name">{displayName}</span>
                {:else if patronConfig}
                  <span class="player-details-sheet__name">{seatEyebrow}</span>
                {/if}
                <PlayerIdentityStrip
                  displayName={null}
                  bracketId={player.bracketId}
                  mmr={player.mmr}
                  isMobile={player.isMobile}
                  compact
                />
              </div>
              {#if patronConfig}
                <span
                  class="player-details-sheet__tier-label"
                  style:--patron-color={patronConfig.color}
                >
                  {patronConfig.name()}
                </span>
              {/if}
            </div>

            <div class="flex items-center gap-1.5 rounded-full bg-sky-950/70 px-2.5 py-1.25 ring-1 ring-inset ring-sky-300/18">
              <span class="text-[0.95rem] font-black leading-none text-amber-300">{loreValue}</span>
              <span aria-hidden="true" class="sheet-lore-icon" style={loreMaskStyle}></span>
            </div>
          </div>
        </div>
        {#if seat === "bottom"}
          <div class="grid gap-1.5">
            <button type="button" class="sheet-action-button" onclick={handleSettingsClick}>
              <div class="sheet-action-button__copy">
                <span class="sheet-action-button__label">Player Settings</span>
                <span class="sheet-action-button__meta">Controls, language, previews, and speed</span>
              </div>
              <Settings class="size-4 shrink-0" />
            </button>

            {#if onRequestBoardStateCorrection && (canRequestBoardStateCorrection || isCorrectionActive) && !isPostGame}
              <button
                type="button"
                class="sheet-action-button"
                onclick={handleCorrectionClick}
              >
                <div class="sheet-action-button__copy">
                  <span class="sheet-action-button__label">
                    {isCorrectionActive ? "Exit Board State Correction" : "Request Board State Correction"}
                  </span>
                  <span class="sheet-action-button__meta">
                    {isCorrectionActive
                      ? "Return to normal play once both players have aligned the board."
                      : "Ask the opponent to pause and manually adjust the board state together."}
                  </span>
                </div>
                <ClipboardEdit class="size-4 shrink-0" />
              </button>
            {/if}

            <div class="sheet-support-actions">
              <p class="sheet-support-actions__title">{m["sim.support.title"]({})}</p>
              <p class="sheet-support-actions__description">
                {m["sim.support.description"]({})}
              </p>
              <SimulatorSupportActions
                surface="sheet"
                onOpenBugReport={onOpenBugReport}
                onOpenFeedback={onOpenFeedback}
              />
            </div>

            <button
              type="button"
              class="sheet-action-button sheet-action-button--danger"
              onclick={handleConcedeClick}
              disabled={!canConcede}
            >
              <div class="sheet-action-button__copy">
                <span class="sheet-action-button__label">Concede</span>
                <span class="sheet-action-button__meta">
                  {canConcede
                    ? "Open a confirmation dialog before conceding."
                    : "Concede is not available right now."}
                </span>
              </div>
              <OctagonX class="size-4 shrink-0" />
            </button>
          </div>
        {:else}
          <div class="grid gap-1.5">
            {#if onRequestBoardStateCorrection && (canRequestBoardStateCorrection || isCorrectionActive) && !isPostGame}
              <button
                type="button"
                class="sheet-action-button"
                onclick={handleCorrectionClick}
              >
                <div class="sheet-action-button__copy">
                  <span class="sheet-action-button__label">
                    {isCorrectionActive ? "Exit Board State Correction" : "Request Board State Correction"}
                  </span>
                  <span class="sheet-action-button__meta">
                    {isCorrectionActive
                      ? "Return to normal play once both players have aligned the board."
                      : "Ask the opponent to pause and manually adjust the board state together."}
                  </span>
                </div>
                <ClipboardEdit class="size-4 shrink-0" />
              </button>
            {/if}
            <button
              type="button"
              class="sheet-action-button sheet-action-button--warning"
              onclick={handleReportClick}
            >
              <div class="sheet-action-button__copy">
                <span class="sheet-action-button__label">Report Player</span>
                <span class="sheet-action-button__meta">Open the current placeholder reporting action.</span>
              </div>
              <Flag class="size-4 shrink-0" />
            </button>
          </div>
        {/if}
        <div class="grid grid-cols-2 gap-1.5 text-xs">
          <div class="stat-card">
            <p class="stat-card__label">Hand</p>
            <div class="stat-card__value-row">
              <span class="stat-card__value">{handCount}</span>
              <Hand class="size-4" />
            </div>
          </div>
          <div class="stat-card">
            <p class="stat-card__label">Deck</p>
            <div class="stat-card__value-row">
              <span class="stat-card__value">{deckCount}</span>
              <Layers class="size-4" />
            </div>
          </div>
          <div class="stat-card">
            <p class="stat-card__label">Discard</p>
            <div class="stat-card__value-row">
              <span class="stat-card__value">{discardCount}</span>
              <Trash2 class="size-4" />
            </div>
          </div>
          <div class="stat-card">
            <p class="stat-card__label">Ink</p>
            <div class="stat-card__value-row">
              <span class="stat-card__value">{inkSummary}</span>
              <PaintBucket class="size-4" />
            </div>
          </div>
        </div>

      
      </div>
    </ScrollArea>
  </Drawer.Content>
</Drawer.Root>

<Drawer.Root bind:open={chatDrawerOpen} direction="bottom" shouldScaleBackground={false}>
  <Drawer.Content class="mobile-chat-sheet border-sky-300/20 bg-slate-950/98 text-slate-100">
    <Drawer.Header class="mobile-chat-sheet__header">
      <div class="flex items-center justify-between gap-3">
        <Drawer.Title class="mobile-chat-sheet__title">Match chat</Drawer.Title>
        <Drawer.Close class="drawer-close-button" aria-label="Close chat">
          <X class="size-4" />
        </Drawer.Close>
      </div>
    </Drawer.Header>
    <div class="mobile-chat-sheet__body">
      <MatchChatPanel viewerSide={ownerSide} />
    </div>
  </Drawer.Content>
</Drawer.Root>

<Dialog.Root bind:open={confirmDialogOpen}>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content class="mobile-confirm-dialog" showCloseButton={false}>
      <Dialog.Header class="mobile-confirm-dialog__header">
        <Dialog.Title class="mobile-confirm-dialog__title">
          {moveConfirmation?.title ?? "Confirm action"}
        </Dialog.Title>
        <Dialog.Description class="mobile-confirm-dialog__description">
          {moveConfirmation?.description ?? ""}
        </Dialog.Description>
      </Dialog.Header>

      <Dialog.Footer class="mobile-confirm-dialog__footer">
        <Button
          variant="outline"
          class="mobile-confirm-dialog__button"
          onclick={closeMoveConfirmation}
        >
          Cancel
        </Button>
        <Button
          variant={moveConfirmation?.tone === "danger" ? "destructive" : "default"}
          class="mobile-confirm-dialog__button"
          onclick={confirmMoveConfirmation}
        >
          {moveConfirmation?.confirmLabel ?? "Confirm"}
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  .mobile-menubar-frame {
    padding-left: max(0.12rem, env(safe-area-inset-left));
    padding-right: max(0.12rem, env(safe-area-inset-right));
  }

  .mobile-menubar-shell {
    display: flex;
    align-items: center;
    gap: 0.28rem;
  }

  .mobile-match-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.65rem;
    font-weight: 600;
    color: rgba(148, 163, 184, 0.85);
    white-space: nowrap;
    letter-spacing: 0.01em;
  }

  .mobile-match-badge__sep {
    color: rgba(100, 116, 139, 0.45);
  }

  .mobile-menubar-shell--bottom {
    gap: 0.28rem;
    align-items: stretch;
  }

  .mobile-menubar-primary,
  .mobile-menubar-secondary {
    flex: 0 0 auto;
  }

  .mobile-menubar-pinned-actions {
    display: inline-flex;
    align-items: stretch;
    gap: 0.14rem;
    flex: 0 0 auto;
  }

  .mobile-menubar-cluster {
    display: inline-flex;
    align-items: stretch;
    gap: 0;
    border-radius: 1rem;
    border: 1px solid rgba(125, 211, 252, 0.18);
    background: rgba(15, 23, 42, 0.78);
    padding: 0.12rem;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 6px 16px rgba(2, 6, 23, 0.22);
  }

  .mobile-menubar-cluster--utility {
    flex: 1 1 auto;
    min-width: 0;
  }

  .mobile-menubar-cluster--utility > .mobile-menubar-primary {
    border-right: 1px solid rgba(125, 211, 252, 0.1);
    padding-right: 0.18rem;
    margin-right: 0.18rem;
  }

  .mobile-menubar-cluster--utility > .mobile-menubar-center {
    border: none;
    background: transparent;
    box-shadow: none;
    padding: 0;
    flex: 1 1 auto;
    min-width: 0;
  }

  .mobile-menubar-cluster--primary {
    flex: 0 0 auto;
    background: linear-gradient(180deg, rgba(8, 47, 73, 0.85), rgba(15, 23, 42, 0.92));
    border-color: rgba(125, 211, 252, 0.34);
  }

  .mobile-menubar-cluster--primary > .mobile-menubar-pinned-actions {
    gap: 0.14rem;
  }

  .mobile-menubar-post-game-cta {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0.08rem 0.12rem;
  }

  :global(.mobile-post-game-cta-button) {
    flex: 1;
    min-height: 2.2rem;
    border-radius: 0.72rem;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.01em;
    justify-content: center;
  }

  :global(.mobile-post-game-cta-button--primary) {
    background:
      linear-gradient(180deg, rgba(14, 116, 144, 0.92), rgba(8, 47, 73, 0.96));
    border-color: rgba(125, 211, 252, 0.42);
    color: #f8fafc;
  }

  .mobile-menubar-center {
    display: flex;
    min-width: 0;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    gap: 0.14rem;
    border-radius: 0.72rem;
    border: 1px solid rgba(125, 211, 252, 0.14);
    background: rgba(15, 23, 42, 0.82);
    padding: 0.08rem 0.12rem;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  }

  .mobile-turn-status {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
  }

  .mobile-turn-status--pinned {
    min-width: 3.35rem;
  }

  .mobile-menubar-scroller {
    min-width: 0;
    flex: 1;
    overflow: hidden;
  }

  :global(.lore-chip) {
    min-height: 1.95rem;
    min-width: 3rem;
    gap: 0.18rem;
    border: 1px solid rgba(125, 211, 252, 0.24);
    background:
      linear-gradient(180deg, rgba(8, 47, 73, 0.96), rgba(15, 23, 42, 0.96));
    padding: 0.22rem 0.4rem;
    color: #f8fafc;
    transition:
      border-color 160ms ease,
      transform 160ms ease,
      background 160ms ease;
  }

  :global(.lore-chip:hover) {
    border-color: rgba(125, 211, 252, 0.42);
    transform: translateY(-1px);
  }

  :global(.lore-chip--compact) {
    width: auto;
    min-width: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.22rem 0.28rem;
  }

  :global(.mobile-anchor-button) {
    width: auto;
    min-width: 0;
    min-height: 1.95rem;
    border-color: rgba(125, 211, 252, 0.28);
    background:
      linear-gradient(180deg, rgba(8, 47, 73, 0.96), rgba(15, 23, 42, 0.96));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      0 8px 18px rgba(2, 6, 23, 0.24);
  }

  .lore-chip__content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.16rem;
    white-space: nowrap;
  }

  .mobile-action-group {
    display: flex;
    min-width: 0;
    flex: 0 1 auto;
    align-items: center;
    justify-content: flex-end;
    gap: 0.14rem;
    overflow: hidden;
    border-radius: 0.8rem;
    border: 1px solid rgba(125, 211, 252, 0.14);
    background: rgba(15, 23, 42, 0.78);
    padding: 0.12rem;
    margin-left: auto;
  }

  :global(.mobile-side-button) {
    width: 2.6rem;
    min-width: 2.6rem;
  }

  :global(.mobile-stack-button) {
    width: 100%;
    min-width: 2.8rem;
  }

  :global(.mobile-side-button--disabled) {
    border-color: rgba(148, 163, 184, 0.18);
    background: rgba(15, 23, 42, 0.34);
    color: rgba(148, 163, 184, 0.78);
    opacity: 1;
  }

  .mobile-move-strip {
    display: inline-flex;
    min-width: 0;
    flex: 1;
    align-items: center;
    justify-content: flex-start;
    gap: 0.12rem;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
  }

  .mobile-move-strip::-webkit-scrollbar {
    display: none;
  }

  .sheet-support-actions {
    display: grid;
    gap: 0.3rem;
    margin-top: 0.2rem;
  }

  .sheet-support-actions__title {
    margin: 0;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(148, 163, 184, 0.88);
  }

  .sheet-support-actions__description {
    margin: 0;
    font-size: 0.74rem;
    line-height: 1.45;
    color: rgba(191, 219, 254, 0.66);
  }

  .lore-chip__value {
    display: block;
    font-size: 0.85rem;
    font-weight: 900;
    line-height: 1;
    color: #fcd34d;
    text-align: center;
  }

  .lore-chip__icon {
    display: block;
    width: 0.85rem;
    height: 0.85rem;
    flex-shrink: 0;
    background: #fcd34d;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-position: center;
    mask-size: contain;
    -webkit-mask-size: contain;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35));
  }

  :global(.quick-action) {
    min-height: 1.85rem;
    gap: 0.18rem;
    position: relative;
    flex-shrink: 0;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(125, 211, 252, 0.16);
    background: transparent;
    padding: 0.22rem 0.4rem;
    font-size: 0.68rem;
    font-weight: 700;
    color: rgba(241, 245, 249, 0.92);
    transition:
      border-color 160ms ease,
      background 160ms ease,
      color 160ms ease,
      transform 160ms ease;
  }

  :global(.quick-action:hover:enabled) {
    background: rgba(18, 39, 64, 0.94);
    transform: translateY(-1px);
    border-color: rgba(125, 211, 252, 0.3);
  }

  :global(.quick-action:disabled) {
    opacity: 0.45;
  }

  :global(.quick-action--primary) {
    background:
      linear-gradient(180deg, rgba(14, 116, 144, 0.92), rgba(8, 47, 73, 0.96));
    color: #f8fbff;
    border-color: rgba(125, 211, 252, 0.42);
  }

  :global(.quick-action--danger) {
    border-color: rgba(127, 29, 29, 0.65);
    background: linear-gradient(180deg, rgba(69, 10, 10, 0.76), rgba(28, 25, 23, 0.94));
    color: rgba(254, 226, 226, 0.92);
  }

  :global(.quick-action--danger:hover:enabled) {
    border-color: rgba(153, 27, 27, 0.78);
    background: linear-gradient(180deg, rgba(87, 13, 13, 0.84), rgba(41, 37, 36, 0.98));
  }

  :global(.quick-action--icon-only) {
    min-width: 1.72rem;
    padding: 0;
  }

  :global(.mobile-bottom-control) {
    min-width: 1.9rem;
    min-height: 1.9rem;
  }

  :global(.mobile-bottom-primary-action) {
    min-width: 3.6rem;
    min-height: 100%;
    align-self: stretch;
  }

  :global(.mobile-bottom-lore) {
    min-width: 3rem;
    padding-inline: 0.34rem;
    align-self: stretch;
  }

  :global(.mobile-bottom-primary-action--ghost) {
    border-color: rgba(148, 163, 184, 0.18);
    background: rgba(15, 23, 42, 0.34);
    color: rgba(148, 163, 184, 0.78);
    opacity: 1;
  }

  :global(.quick-action--revealed) {
    justify-content: center;
    min-width: max-content;
    padding: 0 0.58rem;
  }

  .quick-action__label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    line-height: 1;
  }

  .quick-action__label--micro {
    font-size: clamp(0.56rem, 1.65vw, 0.62rem);
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .quick-action__label-group {
    display: grid;
    justify-items: center;
    gap: 0.06rem;
  }

  .quick-action__stat-row {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.18rem;
    white-space: nowrap;
  }

  .quick-action__stat {
    display: inline-flex;
    align-items: center;
    gap: 0.12rem;
    font-size: clamp(0.54rem, 1.55vw, 0.6rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: rgba(224, 242, 254, 0.82);
  }

  .quick-action__stat-icon {
    display: inline-flex;
    width: 0.52rem;
    height: 0.52rem;
    flex-shrink: 0;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-position: center;
    mask-size: contain;
    -webkit-mask-size: contain;
  }

  .quick-action__stat-icon--exert {
    background: rgba(191, 219, 254, 0.8);
  }

  .quick-action__stat-icon--lore {
    background: #fcd34d;
  }

  .quick-action__meta {
    font-size: clamp(0.62rem, 1.7vw, 0.68rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(224, 242, 254, 0.82);
  }

  :global(.quick-action--pass-turn) {
    width: auto;
    min-width: 3.6rem;
    padding-inline: 0.34rem;
  }

  :global(.quick-action--quest-all) {
    width: auto;
    min-width: 4.35rem;
    padding-inline: 0.34rem;
  }

  .quick-action__badge {
    position: absolute;
    top: 0.08rem;
    right: 0.08rem;
    display: inline-flex;
    min-width: 0.88rem;
    min-height: 0.88rem;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    padding: 0 0.2rem;
    font-size: clamp(0.58rem, 1.55vw, 0.64rem);
    font-weight: 800;
    line-height: 1;
  }

  .quick-action__badge--playable {
    background: rgba(16, 185, 129, 0.18);
    color: #bbf7d0;
  }

  :global(.quick-action__badge--chat) {
    background: linear-gradient(180deg, #38bdf8, #0ea5e9);
    color: #0c1322;
    box-shadow: 0 0 8px rgba(56, 189, 248, 0.42);
  }

  :global(.mobile-chat-sheet) {
    max-height: min(78dvh, 40rem);
    display: flex;
    flex-direction: column;
    padding-bottom: 0;
  }

  :global(.mobile-chat-sheet__header) {
    padding: 0.8rem 0.9rem 0.4rem;
  }

  :global(.mobile-chat-sheet__title) {
    font-size: 0.95rem;
    font-weight: 800;
    color: #f8fafc;
  }

  .mobile-chat-sheet__body {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    padding: 0 0.65rem calc(0.65rem + env(safe-area-inset-bottom));
    display: flex;
    flex-direction: column;
  }

  .mobile-chat-sheet__body :global(> *) {
    flex: 1 1 auto;
    min-height: 0;
  }


  :global(.quick-metric) {
    min-height: 1.85rem;
    gap: 0.22rem;
    background: transparent;
    padding: 0;
    font-size: 0.72rem;
    font-weight: 700;
    color: rgba(191, 219, 254, 0.88);
  }

  :global(.quick-metric--interactive) {
    border: 1px solid rgba(125, 211, 252, 0.16);
    transition:
      border-color 160ms ease,
      background 160ms ease,
      transform 160ms ease;
  }

  :global(.quick-metric--interactive:hover) {
    border-color: rgba(125, 211, 252, 0.34);
    background: rgba(18, 39, 64, 0.9);
    transform: translateY(-1px);
  }

  :global(.player-details-sheet) {
    max-height: min(78dvh, 34rem);
    box-shadow: 0 0 0 1px rgba(125, 211, 252, 0.08), 0 24px 64px rgba(2, 6, 23, 0.72);
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
  }

  :global(.player-details-sheet--top) {
    max-height: min(72dvh, 32rem);
    padding-top: env(safe-area-inset-top);
  }

  :global(.player-details-sheet__header) {
    gap: 0;
    padding: 0.8rem 0.9rem 0.25rem;
  }

  :global(.player-details-sheet__title) {
    font-size: 1rem;
    font-weight: 800;
    color: #f8fafc;
    margin-top: 0.05rem;
    line-height: 1.1;
  }

  :global(.player-details-sheet__eyebrow) {
    display: block;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(148, 163, 184, 0.78);
    line-height: 1;
  }

  :global(.player-details-sheet__name) {
    font-size: 0.95rem;
    font-weight: 800;
    color: #f8fafc;
    line-height: 1.15;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :global(.player-details-sheet__tier-label) {
    display: inline-block;
    margin-top: 0.18rem;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--patron-color, rgba(148, 163, 184, 0.85));
  }

  :global(.player-patron-pill) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.15rem;
    height: 1.15rem;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid var(--patron-border);
    color: var(--patron-color);
    flex-shrink: 0;
    box-shadow:
      0 0 4px var(--patron-glow),
      0 0 8px var(--patron-glow),
      inset 0 0 4px rgba(255, 255, 255, 0.06);
    filter: drop-shadow(0 0 3px var(--patron-glow));
  }


  .stat-card {
    border-radius: 1rem;
    background: rgba(15, 23, 42, 0.9);
    padding: 0.62rem 0.72rem;
    box-shadow: inset 0 0 0 1px rgba(125, 211, 252, 0.08);
  }

  .stat-card__label {
    margin: 0;
    color: rgba(148, 163, 184, 0.9);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: clamp(0.72rem, 1.9vw, 0.76rem);
    font-weight: 700;
  }

  .stat-card__value-row {
    margin-top: 0.28rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    color: #e2e8f0;
  }

  .stat-card__value {
    font-size: 0.84rem;
    font-weight: 800;
    color: #f8fafc;
  }

  .sheet-action-button {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 0.9rem;
    border-radius: 1rem;
    border: 1px solid rgba(125, 211, 252, 0.12);
    background: rgba(15, 23, 42, 0.92);
    padding: 0.68rem 0.82rem;
    text-align: left;
    color: #f8fafc;
    transition:
      border-color 160ms ease,
      transform 160ms ease,
      background 160ms ease;
  }

  .sheet-action-button:hover:enabled {
    transform: translateY(-1px);
    border-color: rgba(125, 211, 252, 0.28);
    background: rgba(18, 39, 64, 0.96);
  }

  .sheet-action-button:disabled {
    opacity: 0.45;
  }

  .sheet-action-button--danger {
    border-color: rgba(127, 29, 29, 0.45);
    background: linear-gradient(180deg, rgba(69, 10, 10, 0.92), rgba(24, 24, 27, 0.98));
  }

  .sheet-action-button--warning {
    border-color: rgba(251, 191, 36, 0.2);
    background: linear-gradient(180deg, rgba(69, 39, 0, 0.82), rgba(31, 41, 55, 0.96));
  }

  .sheet-action-button__copy {
    display: grid;
    gap: 0.1rem;
    min-width: 0;
  }

  .sheet-action-button__label {
    font-size: 0.8rem;
    font-weight: 800;
    color: #f8fafc;
  }

  .sheet-action-button__meta {
    font-size: clamp(0.7rem, 1.8vw, 0.74rem);
    color: rgba(191, 219, 254, 0.7);
  }

  .sheet-lore-icon {
    width: 0.95rem;
    height: 0.95rem;
    flex-shrink: 0;
    background: #fcd34d;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-position: center;
    mask-size: contain;
    -webkit-mask-size: contain;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35));
  }

  :global(.mobile-confirm-dialog) {
    max-width: min(22rem, calc(100vw - 1.5rem));
    border-color: rgba(125, 211, 252, 0.18);
    background: linear-gradient(180deg, rgba(11, 19, 32, 0.98), rgba(5, 10, 18, 0.98));
    color: #f8fafc;
    box-shadow: 0 24px 64px rgba(2, 6, 23, 0.72);
  }

  :global(.mobile-confirm-dialog__header) {
    gap: 0.45rem;
    text-align: left;
  }

  :global(.mobile-confirm-dialog__title) {
    font-size: 1rem;
    font-weight: 800;
    color: #f8fafc;
  }

  :global(.mobile-confirm-dialog__description) {
    color: rgba(191, 219, 254, 0.78);
    font-size: 0.8rem;
    line-height: 1.4;
  }

  :global(.mobile-confirm-dialog__footer) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.55rem;
  }

  :global(.mobile-confirm-dialog__button) {
    min-height: 2.7rem;
    font-weight: 800;
  }

  @media (max-width: 380px) {
    :global(.quick-action--icon-only) {
      min-width: 1.7rem;
    }

    :global(.lore-chip) {
      min-width: 3.1rem;
      padding-inline: 0.44rem;
    }

    .mobile-menubar-shell--bottom {
      gap: 0.12rem;
    }

    .mobile-menubar-center {
      gap: 0.12rem;
      padding-inline: 0.1rem;
    }

    .mobile-turn-status--pinned {
      min-width: 3rem;
    }

    :global(.quick-action--pass-turn) {
      min-width: 3.25rem;
      padding-inline: 0.26rem;
    }

    :global(.quick-action--quest-all) {
      min-width: 3.9rem;
      padding-inline: 0.26rem;
    }

    .quick-action__label--micro {
      font-size: 0.54rem;
    }

    .quick-action__stat {
      font-size: 0.52rem;
      gap: 0.1rem;
    }
  }
</style>
