<script lang="ts">
  import "../../../app.css";
  import { untrack, type Snippet } from "svelte";
  import { m } from "$lib/i18n/messages.js";
  import { Button } from "$lib/design-system/primitives/button";
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import * as Sidebar from "$lib/design-system/primitives/sidebar";
  import SimulatorHotkeyLayer from "@/features/simulator/hotkeys/SimulatorHotkeyLayer.svelte";
  import SimulatorHotkeysDialog from "@/features/simulator/hotkeys/SimulatorHotkeysDialog.svelte";
  import { buildSimulatorHotkeyDescriptors } from "@/features/simulator/hotkeys/simulator-hotkey-registry.js";
  import {
    HAND_CARD_HOTKEYS,
    OPPONENT_HAND_HOTKEYS,
    OPPONENT_PLAY_HOTKEYS,
    PLAY_CARD_HOTKEYS,
  } from "@/features/simulator/hotkeys/hotkey-bindings.js";
  import { getOrderedPlayZoneCards } from "@/features/simulator/hotkeys/board-order.js";
  import { Toaster } from "$lib/design-system/primitives/sonner";
  import { toast } from "svelte-sonner";
  import { DragDropProvider } from "@dnd-kit/svelte";
  import { Feedback, PointerActivationConstraints, PointerSensor } from "@dnd-kit/dom";
  import type { LorcanaEngineBase, LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
  import type { PlayerInteractionView } from "@tcg/lorcana-interaction";
  import type {
    ExecutableMoveEntry,
    ExecutableMovePresentationCategoryId,
    LorcanaPlayerSide,
    LorcanaSimulatorReadModel,
    SimulatorMoveError,
  } from "@/features/simulator/model/contracts.js";
  import type { PendingEffectsPopoverItem } from "@/features/simulator/context/game-context.svelte.js";
  import type { LorcanaPlayerSettingsMap } from "@/features/simulator/model/player-visual-settings.js";
  import type { PlayerMatchMetadata } from "@/features/simulator/model/player-match-metadata.js";
  import type { MatchChatController } from "@/features/match-chat/match-chat-controller.svelte.js";

  import LorcanaSimulatorSidebar from "./LorcanaSimulatorSidebar.svelte";
  import LorcanaCompactPanels from "./LorcanaCompactPanels.svelte";
  import PlayerSettingsDialog from "@/features/simulator/dialogs/PlayerSettingsDialog.svelte";
  import SimulatorSupportDialog from "@/features/simulator/dialogs/SimulatorSupportDialog.svelte";
  import SimulatorFeedbackDialog from "@/features/simulator/support/SimulatorFeedbackDialog.svelte";
  import SimulatorBugReportDialog from "@/features/simulator/support/SimulatorBugReportDialog.svelte";
  import SimulatorPlayerReportDialog from "@/features/simulator/support/SimulatorPlayerReportDialog.svelte";
  import {
    dismissSupportReminderForAWeek,
    resolveSupportReminderState,
  } from "@/features/simulator/support/support-reminder-state.svelte.js";
  import {
    SIMULATOR_SUPPORT_REMINDER_VARIANTS,
  } from "@/features/simulator/support/support-reminder-copy.js";
  import { setSimulatorCardContext } from "@/features/simulator/context/simulator-card-context.svelte.js";
  import { setLorcanaSimulatorDndContext } from "@/features/simulator/context/simulator-dnd-context.svelte.js";
  import GlobalCardPreview from "@/features/simulator/dialogs/GlobalCardPreview.svelte";
  import TabletopBoard from "@/features/simulator/board/TabletopBoard.svelte";
  import {
    type LorcanaGameContext,
    setLorcanaGameContext,
    useLorcanaBoardPresenter,
    useLorcanaSidebarPresenter,
  } from "@/features/simulator/context/game-context.svelte.js";
  import { setMatchChatController } from "@/features/match-chat/match-chat-controller.svelte.js";
  import { SimulatorLayoutModeObserver } from "@/features/simulator/model/layout-mode.svelte.js";
  import PostGameSummaryDialog from "@/features/simulator/post-game/PostGameSummaryDialog.svelte";
  import ConfettiOverlay from "@/features/simulator/board/ConfettiOverlay.svelte";
  import { playSound } from "@/features/simulator/animations/sound-service.js";
  import {
    createInitialPostGameModalState,
    dismissPostGameModal,
    reopenPostGameModal,
    syncPostGameModalState,
  } from "@/features/simulator/post-game/modal-state.js";
  import { buildPostGameSummary } from "@/features/simulator/post-game/summary.js";
  import type { HotkeyMode } from "@/features/simulator/context/game-context.svelte.js";
  import {
    clearPendingDirectMoveIfUnavailable,
    isConfirmableDirectMoveCategoryId,
    togglePendingDirectMove,
    type PendingDirectMove,
  } from "@/features/simulator/model/direct-action-state.js";
  import { bugReportContextFromBoard } from "@/features/simulator/support/feedback-api.js";

  import type { ServerGameplaySettings } from "@/features/settings/player-settings-store.svelte.js";
  import type { OpponentPresenceTracker } from "@/features/gateway/opponent-presence.svelte.js";
  import type { OpponentAfkTracker } from "@/features/gateway/opponent-afk.svelte.js";
  import type { ConnectionStatus } from "@/features/gateway/gateway-client.js";
  import type { MatchNavigationContext } from "@/features/simulator/model/contracts.js";

  interface LorcanaTabletopSimulatorProps {
    engine: LorcanaEngineBase;
    readModel?: Pick<LorcanaSimulatorReadModel, "getMoveLog"> &
      Partial<Pick<LorcanaSimulatorReadModel, "subscribeStateUpdates">>;
    playerSettings?: LorcanaPlayerSettingsMap;
    playerMetadataMap?: Record<string, PlayerMatchMetadata>;
    serverGameplaySettings?: ServerGameplaySettings;
    gameContext?: LorcanaGameContext | null;
    interactionView?: PlayerInteractionView | null;
    postGameGameId?: string | null;
    onReturnToMatchmaking?: (() => void | Promise<void>) | null;
    viewerMode?: "player" | "spectator";
    isAuthenticated?: boolean;
    matchChatController?: MatchChatController | null;
    opponentPresence?: OpponentPresenceTracker | null;
    opponentAfk?: OpponentAfkTracker | null;
    onSkipOpponent?: (() => void) | null;
    onDropOpponent?: (() => void) | null;
    gatewayStatus?: ConnectionStatus | null;
    /** True when the server announced a deploy before the socket closed. */
    serverInitiatedClose?: boolean;
    /** True when the gateway rejected the connection with a terminal auth error. */
    authError?: boolean;
    matchContext?: MatchNavigationContext | null;
    onNextGame?: (() => void) | null;
    /** Identity of the opponent for moderation actions (player reports). */
    opponentGameProfileId?: string | null;
    opponentDisplayName?: string | null;
    /** Match ID associated with the current game, used for report context. */
    moderationMatchId?: string | null;
    /** Optional overlay rendered between the two player lanes (e.g. replay controls). */
    boardOverlay?: Snippet;
    /** Override which side appears at the bottom (e.g. replay viewer perspective). */
    ownerSide?: LorcanaPlayerSide | null;
  }

  let {
    engine,
    readModel,
    playerSettings = {},
    playerMetadataMap = {},
    serverGameplaySettings,
    gameContext = $bindable(null),
    interactionView = $bindable(null),
    postGameGameId = null,
    onReturnToMatchmaking = null,
    viewerMode = "player",
    isAuthenticated = false,
    matchChatController = null,
    opponentPresence = null,
    opponentAfk = null,
    onSkipOpponent = null,
    onDropOpponent = null,
    gatewayStatus = null,
    serverInitiatedClose = false,
    authError = false,
    matchContext = null,
    onNextGame = null,
    opponentGameProfileId = null,
    opponentDisplayName = null,
    moderationMatchId = null,
    boardOverlay,
    ownerSide: ownerSideOverride = null,
  }: LorcanaTabletopSimulatorProps = $props();
  let sidebarOpen = $state(true);

  const game = setLorcanaGameContext({
    get engine() {
      return engine;
    },
    get readModel() {
      return readModel;
    },
    get playerSettings() {
      return playerSettings;
    },
    get playerMetadataMap() {
      return playerMetadataMap;
    },
  });
  gameContext = game;

  const sidebar = useLorcanaSidebarPresenter();
  $effect(() => {
    interactionView = sidebar.interactionView;
  });
  $effect(() => {
    if (serverGameplaySettings) {
      sidebar.initializeFromServer(serverGameplaySettings);
    }
  });
  const board = useLorcanaBoardPresenter();

  const simulatorCardContext = setSimulatorCardContext({
    onMulliganSelectionChange: () => {
      sidebar.pendingMulliganDangerConfirm = null;
    },
  });
  const dndContext = setLorcanaSimulatorDndContext();
  const matchChatContext = setMatchChatController(null);

  $effect(() => {
    matchChatContext.controller = matchChatController;
  });

  const layout = new SimulatorLayoutModeObserver();
  const layoutMode = $derived(layout.current);
  const boardSnapshot = $derived(game.boardSnapshot());
  const bugReportContext = $derived(
    bugReportContextFromBoard(boardSnapshot, {
      platform: layoutMode,
      matchId: moderationMatchId,
    }),
  );
  const moveLogEntries = $derived(game.moveLogEntries());
  const ownerSide = $derived(ownerSideOverride ?? game.ownerSide());
  const pendingMoveError = $derived(sidebar.pendingMoveError);
  const mobileNotice = $derived(sidebar.mobileNotice);
  const isCompactLayout = $derived(layout.isCompact);
  let localMoveSubmissionCount = $state(0);
  const isEngineFinished = $derived(boardSnapshot?.status === "finished");
  const isPostGame = $derived(isEngineFinished || (matchContext?.matchCompleted ?? false));
  const postGameBoardSnapshot = $derived.by((): LorcanaProjectedBoardView | null => {
    if (!boardSnapshot) {
      return null;
    }

    if (isEngineFinished) {
      return boardSnapshot;
    }

    if (matchContext?.matchCompleted) {
      return {
        ...boardSnapshot,
        status: "finished",
        winner: matchContext.winnerId ?? boardSnapshot.winner,
        reason: matchContext.endReason ?? boardSnapshot.reason ?? "Match completed",
      };
    }

    return null;
  });
  const isSpectator = $derived(viewerMode === "spectator");
  const readOnlyMode = $derived(isPostGame || isSpectator);
  const compactActionCount = $derived(isPostGame ? 0 : sidebar.moveCategoryCount);
  const moveCategorySummaries = $derived(sidebar.moveCategorySummaries);
  const availableMovesSelectionState = $derived(sidebar.availableMovesSelectionState);
  const showRawLogRegistryJson = $derived(sidebar.showRawLogRegistryJson);
  const topSide = $derived(sidebar.topSide);
  const bottomSide = $derived(sidebar.bottomSide);
  const pendingEffectsPopoverItems = $derived.by(() =>
    isPostGame ? ([] as PendingEffectsPopoverItem[]) : sidebar.pendingEffectsPopoverItems,
  );
  const activePlayerGuidance = $derived.by(() =>
    isPostGame ? [] : sidebar.activePlayerGuidance,
  );
  const opponentPlayHotkeyCards = $derived.by(() =>
    getOrderedPlayZoneCards(
      board.getZoneCards(topSide, "play").filter((card) => card.cardType !== "item"),
      "top",
    ).slice(0, OPPONENT_PLAY_HOTKEYS.length),
  );
  const ownedPlayHotkeyCards = $derived.by(() =>
    ownerSide
      ? getOrderedPlayZoneCards(
          board.getZoneCards(bottomSide, "play").filter((card) => card.cardType !== "item"),
          "bottom",
        ).slice(0, PLAY_CARD_HOTKEYS.length)
      : [],
  );
  const ownedHandHotkeyCards = $derived.by(() =>
    ownerSide ? board.getZoneCards(bottomSide, "hand").slice(0, HAND_CARD_HOTKEYS.length) : [],
  );
  // Opponent hand cards are normally face-down with no addressable IDs. They
  // only become hotkey-targetable when an effect surfaces them in the active
  // selection state (e.g. "look at opponent's hand").
  const opponentHandHotkeyCards = $derived.by(() => {
    const selection = availableMovesSelectionState;
    if (!selection) return [];

    const opponentHand = board.getZoneCards(topSide, "hand");
    if (opponentHand.length === 0) return [];

    const opponentHandById = new Map(opponentHand.map((card) => [card.cardId, card]));
    const surfaced: typeof opponentHand = [];
    for (const entry of selection.entries) {
      if (entry.kind !== "card" || !entry.cardId || entry.disabled === true) continue;
      const card = opponentHandById.get(entry.cardId);
      if (card) surfaced.push(card);
      if (surfaced.length >= OPPONENT_HAND_HOTKEYS.length) break;
    }
    return surfaced;
  });
  // A card is "armed" when the quick-menu (with action hotkeys) is open. The
  // detailed-inspect popover doesn't bind 1-9 to actions, so it must NOT enter
  // the action-menu layer — otherwise the card row hotkeys would silently
  // disable for every detailed inspect, which is a regression from browse.
  const armedCardId = $derived(
    simulatorCardContext.isInspectOpen && sidebar.cardInfoMode === "quick"
      ? simulatorCardContext.inspectedCard?.cardId ?? null
      : null,
  );
  const finishedGameKey = $derived.by(() =>
    postGameBoardSnapshot && postGameGameId
      ? `${postGameGameId}:${postGameBoardSnapshot.stateID ?? postGameBoardSnapshot.turnNumber}:${postGameBoardSnapshot.winner ?? "draw"}`
      : null,
  );
  const postGameSummary = $derived.by(() => {
    if (!postGameBoardSnapshot || !postGameGameId) {
      return null;
    }

    return buildPostGameSummary({
      board: postGameBoardSnapshot,
      entries: moveLogEntries,
      viewerSide: ownerSide,
    });
  });
  // Hand cards overlap nearby drop zones, so we require a bit of movement before
  // starting a drag. Touch keeps a larger threshold to avoid long-press-only drag,
  // while mouse gets a smaller threshold so clicks do not misfire into the inkwell.
  const sensors = [
    PointerSensor.configure({
      activationConstraints(event) {
        if (event.pointerType === "touch") {
          return [new PointerActivationConstraints.Distance({ value: 4 })];
        }

        return [new PointerActivationConstraints.Distance({ value: 2 })];
      },
    }),
  ];
  let lastToastedMoveError = $state<SimulatorMoveError | null>(null);
  let compactPanelsOpen = $state(false);
  let compactPanelsTab = $state<"moves" | "log" | "chat">("moves");
  let lastMobileNoticeId = $state<number | null>(null);
  let showConfetti = $state(false);
  let postGameModalState = $state(createInitialPostGameModalState());
  let postGameDialogOpen = $state(false);
  let hotkeysDialogOpen = $state(false);
  let pendingDirectMove = $state<PendingDirectMove | null>(null);
  let supportDialogOpen = $state(false);
  let feedbackDialogOpen = $state(false);
  let bugReportDialogOpen = $state(false);
  let playerReportDialogOpen = $state(false);
  let supportReminderVisible = $state(false);
  let supportReminderOpen = $state(false);
  let supportReminderVariantIndex = $state<number | null>(null);
  const supportReminderText = $derived(
    supportReminderVisible && supportReminderVariantIndex !== null
      ? SIMULATOR_SUPPORT_REMINDER_VARIANTS[supportReminderVariantIndex] ?? null
      : null,
  );

  $effect(() => {
    const nextReminderState = resolveSupportReminderState({
      variantCount: SIMULATOR_SUPPORT_REMINDER_VARIANTS.length,
    });

    supportReminderVisible = nextReminderState.visible;
    supportReminderOpen = nextReminderState.visible;
    supportReminderVariantIndex = nextReminderState.variantIndex;
  });

  $effect(() => {
    const nextEngine = engine;
    const nextReadModel = readModel;
    const nextPlayerSettings = playerSettings;

    untrack(() => {
      console.log("[LorcanaTabletopSimulator] Sync");
      game.syncEngine(nextEngine, nextReadModel, nextPlayerSettings);
    });
  });

  $effect(() => {
    if (!isCompactLayout) {
      compactPanelsOpen = false;
      compactPanelsTab = "moves";
    }
  });

  $effect(() => {
    const nextState = syncPostGameModalState(postGameModalState, finishedGameKey);
    if (
      nextState.open === postGameModalState.open &&
      nextState.finishedGameKey === postGameModalState.finishedGameKey &&
      nextState.autoOpenedFinishedGameKey === postGameModalState.autoOpenedFinishedGameKey
    ) {
      return;
    }

    postGameModalState = nextState;
    postGameDialogOpen = nextState.open;
  });

  $effect(() => {
    if (!isEngineFinished || !postGameSummary) {
      return;
    }

    const result = postGameSummary.outcome.viewerResult;
    if (result === "victory") {
      playSound("victory");
      showConfetti = true;
    } else if (result === "defeat") {
      playSound("defeat");
    }
  });

  $effect(() => {
    if (postGameDialogOpen === postGameModalState.open) {
      return;
    }

    postGameModalState = postGameDialogOpen
      ? reopenPostGameModal(postGameModalState)
      : dismissPostGameModal(postGameModalState);
  });

  $effect(() => {
    if (!pendingMoveError || pendingMoveError === lastToastedMoveError) {
      return;
    }

    lastToastedMoveError = pendingMoveError;

    toast.error(pendingMoveError.rawReason ?? pendingMoveError.message, {
      description:
        pendingMoveError.rawReason && pendingMoveError.rawReason !== pendingMoveError.message
          ? pendingMoveError.message
          : undefined,
    });
  });

  $effect(() => {
    if (!mobileNotice || mobileNotice.id === lastMobileNoticeId) {
      return;
    }

    lastMobileNoticeId = mobileNotice.id;

    if (mobileNotice.tone === "info") {
      toast.info(mobileNotice.message);
      return;
    }

    toast(mobileNotice.message);
  });

  $effect(() => {
    pendingDirectMove = clearPendingDirectMoveIfUnavailable(
      pendingDirectMove,
      new Set(moveCategorySummaries.map((summary) => summary.categoryId)),
    );
  });

  const hotkeyDescriptors = $derived.by(() =>
    buildSimulatorHotkeyDescriptors({
      moveCategorySummaries,
      selectionState: availableMovesSelectionState,
      pendingDirectMove,
      armedCardId,
      opponentPlayCards: opponentPlayHotkeyCards,
      ownedPlayCards: ownedPlayHotkeyCards,
      ownedHandCards: ownedHandHotkeyCards,
      opponentHandCards: opponentHandHotkeyCards,
      canBack: availableMovesSelectionState?.canBack ?? false,
      canCancel:
        Boolean(pendingDirectMove) ||
        Boolean(availableMovesSelectionState?.canCancel) ||
        Boolean(sidebar.actionSelectionSession) ||
        Boolean(sidebar.resolutionSelectionSession),
      canConfirm:
        Boolean(pendingDirectMove) ||
        Boolean(availableMovesSelectionState?.canConfirm) ||
        sidebar.actionSelectionSession?.phase === "confirm",
      openCommandPalette: () => {
        hotkeysDialogOpen = true;
      },
      cancel: handleCancelHotkey,
      back: handleBackHotkey,
      confirm: handleConfirmHotkey,
      runMoveCategory: handleMoveCategoryHotkey,
      inspectCard: (card) => {
        simulatorCardContext.openCardInspect({ card });
      },
      selectCard: (cardId) => {
        sidebar.handleAvailableMovesSelectionCard(cardId);
      },
    }),
  );
  // Confirm/cancel/back must always work to prevent miss-clicks regardless
  // of HotkeyMode. Everything else respects the user's mode choice — `off`
  // really means off (no Mod+K palette, no Space pass-turn), `confirm-only`
  // adds Space, `on` enables every binding. The library's
  // `ignoreInputs: true` silences these while typing in chat.
  const ALWAYS_ON_HOTKEY_IDS = new Set(["global-cancel", "global-back", "global-confirm"]);
  function getVisibleHotkeyDescriptors(
    descriptors: typeof hotkeyDescriptors,
    hotkeyMode: HotkeyMode,
  ) {
    switch (hotkeyMode) {
      case "off":
        return descriptors.filter((descriptor) => ALWAYS_ON_HOTKEY_IDS.has(descriptor.id));
      case "confirm-only":
        return descriptors.filter(
          (descriptor) =>
            ALWAYS_ON_HOTKEY_IDS.has(descriptor.id) ||
            (descriptor.kind === "move" && descriptor.categoryId === "pass-turn"),
        );
      case "on":
      default:
        return descriptors;
    }
  }
  const visibleHotkeyDescriptors = $derived(
    getVisibleHotkeyDescriptors(hotkeyDescriptors, sidebar.hotkeyMode),
  );
  // The three navigation keys (Escape/Enter/Backspace) live in their own
  // layer so they survive when card hotkeys are off. They DO pause while
  // Player Settings is open — the dialog's own native Escape handler closes
  // it, and pausing here prevents Enter from confirming a queued game move
  // through the modal.
  const alwaysOnHotkeyDescriptors = $derived(
    visibleHotkeyDescriptors.filter((descriptor) => ALWAYS_ON_HOTKEY_IDS.has(descriptor.id)),
  );
  const gameplayHotkeyDescriptors = $derived(
    visibleHotkeyDescriptors.filter((descriptor) => !ALWAYS_ON_HOTKEY_IDS.has(descriptor.id)),
  );
  const gameplayHotkeysPaused = $derived(sidebar.isPlayerSettingsOpen);

  export function runAnimation(...args: Parameters<typeof game.runAnimation>): ReturnType<typeof game.runAnimation> {
    return game.runAnimation(...args);
  }

  function openCompactPanels(tab: "moves" | "log" = "moves"): void {
    compactPanelsTab = tab;
    compactPanelsOpen = true;
  }

  function openPostGameSummary(): void {
    postGameModalState = reopenPostGameModal(postGameModalState);
    postGameDialogOpen = true;
  }

  async function handleReturnToMatchmaking(): Promise<void> {
    await onReturnToMatchmaking?.();
  }

  function queueDirectMoveConfirmation(pendingMove: PendingDirectMove): void {
    pendingDirectMove = pendingMove;
    if (pendingMove.source === "keyboard") {
      toast.info(m["sim.actions.confirmMoveLabel"]({ label: pendingMove.label }), {
        description: m["sim.actions.confirmMoveHotkeyHint"]({}),
      });
    }
  }

  function submitAvailableMove(move: ExecutableMoveEntry): void {
    localMoveSubmissionCount += 1;
    sidebar.handleAvailableMoveClick(move);
  }

  function handleConfirmableDirectMoveCategory(
    categoryId: "pass-turn" | "undo" | "quest-all",
    source: "keyboard" | "pointer" = "pointer",
  ): void {
    const summary = moveCategorySummaries.find((candidate) => candidate.categoryId === categoryId);
    if (!summary) {
      return;
    }

    const moves = sidebar.expandCategoryMoves(summary.categoryId);
    const move = moves[0];
    if (!move) {
      return;
    }

    const execute = () => {
      submitAvailableMove(move);
    };
    const result = togglePendingDirectMove(pendingDirectMove, move, execute, source);

    if (result.shouldExecuteImmediately) {
      pendingDirectMove = null;
      execute();
      return;
    }

    if (result.nextPendingDirectMove) {
      queueDirectMoveConfirmation(result.nextPendingDirectMove);
    }
  }

  function handleMoveCategoryHotkey(categoryId: ExecutableMovePresentationCategoryId): void {
    const summary = moveCategorySummaries.find((candidate) => candidate.categoryId === categoryId);
    if (!summary) {
      return;
    }

    const moves = sidebar.expandCategoryMoves(summary.categoryId);
    if (moves.length === 0) {
      return;
    }

    if (summary.isDirect) {
      const move = moves[0];
      if (!move) {
        return;
      }

      if (isConfirmableDirectMoveCategoryId(summary.categoryId)) {
        handleConfirmableDirectMoveCategory(summary.categoryId, "keyboard");
        return;
      }

      submitAvailableMove(move);
      pendingDirectMove = null;
      return;
    }

    sidebar.startManualCardActionSelection(summary.categoryId, moves);
    pendingDirectMove = null;
  }

  function handleCancelHotkey(): void {
    if (hotkeysDialogOpen) {
      hotkeysDialogOpen = false;
      return;
    }

    if (pendingDirectMove) {
      pendingDirectMove = null;
      return;
    }

    sidebar.cancelActionSelectionSession();
  }

  function handleBackHotkey(): void {
    sidebar.backActionSelectionSession();
  }

  function handleConfirmHotkey(): void {
    if (pendingDirectMove) {
      const pendingMove = pendingDirectMove;
      pendingDirectMove = null;
      pendingMove.execute();
      return;
    }

    sidebar.confirmActionSelection();
  }

  function openSupportDialog(): void {
    supportDialogOpen = true;
  }

  function openFeedbackDialog(): void {
    supportDialogOpen = false;
    postGameDialogOpen = false;
    feedbackDialogOpen = true;
  }

  function openBugReportDialog(): void {
    supportDialogOpen = false;
    postGameDialogOpen = false;
    bugReportDialogOpen = true;
  }

  function openPlayerReportDialog(): void {
    if (!opponentGameProfileId) return;
    postGameDialogOpen = false;
    playerReportDialogOpen = true;
  }

  const moderationGameId = $derived(boardSnapshot?.gameID ?? null);
  const canReportOpponent = $derived(
    isAuthenticated && !!opponentGameProfileId && viewerMode === "player",
  );
  // Post-game modal shows the entry whenever there's a real opponent — auth
  // errors at submit time are surfaced by the dialog. We don't want to hide
  // the action from guest/quick-match players who hit the timeout screen.
  const canShowPostGameReport = $derived(
    !!opponentGameProfileId && viewerMode === "player",
  );
</script>

<DragDropProvider
        plugins={(defaults) => [...defaults, Feedback.configure({})]}
        {sensors}
        onDragStart={dndContext.handleDragStart}
        onDragMove={dndContext.handleDragMove}
        onDragEnd={dndContext.handleDragEnd}
>
  <Sidebar.Provider bind:open={sidebarOpen}>
    <div class="simulator-dark simulator-v2">
      <SimulatorHotkeyLayer descriptors={alwaysOnHotkeyDescriptors} paused={gameplayHotkeysPaused} />
      <SimulatorHotkeyLayer descriptors={gameplayHotkeyDescriptors} paused={gameplayHotkeysPaused} />
      <Toaster theme="dark" position="top-right"/>
      {#if !isCompactLayout}
        <LorcanaSimulatorSidebar
          readOnly={readOnlyMode}
          isOpponentAfk={opponentAfk?.isAfk ?? false}
          {supportReminderText}
          bind:supportReminderOpen
          onDismissSupportReminder={() => {
            dismissSupportReminderForAWeek();
            supportReminderVisible = false;
            supportReminderOpen = false;
          }}
          pendingDirectMoveCategoryId={pendingDirectMove?.categoryId ?? null}
          onTriggerUndo={() => {
            handleConfirmableDirectMoveCategory("undo", "pointer");
          }}
          onTriggerQuestAll={() => {
            handleConfirmableDirectMoveCategory("quest-all", "pointer");
          }}
          onOpenHotkeys={() => {
            hotkeysDialogOpen = true;
          }}
          onOpenSupport={openBugReportDialog}
          {canReportOpponent}
          onReportOpponent={openPlayerReportDialog}
          {matchContext}
          onNextGame={onNextGame ?? undefined}
          onReturnToMatchmaking={handleReturnToMatchmaking}
        />
      {/if}

      {#if !isCompactLayout}
        <Sidebar.Inset aria-label={m["sim.tabletop.aria"]({})}>
          <div class="absolute z-50 cursor-pointer top-1 left-1">
            <Sidebar.Trigger class="cursor-pointer"/>
          </div>

          {#if boardSnapshot}
            <TabletopBoard
              {layoutMode}
              {compactActionCount}
              {pendingEffectsPopoverItems}
              {activePlayerGuidance}
              {opponentPresence}
              {onSkipOpponent}
              {onDropOpponent}
              onReportOpponent={openPlayerReportDialog}
              {canReportOpponent}
              {gatewayStatus}
              {serverInitiatedClose}
              {authError}
              {viewerMode}
              {isAuthenticated}
              {supportReminderText}
              bind:supportReminderOpen
              onDismissSupportReminder={() => {
                dismissSupportReminderForAWeek();
                supportReminderVisible = false;
                supportReminderOpen = false;
              }}
              hotkeyDescriptors={visibleHotkeyDescriptors}
              pendingDirectMoveCategoryId={pendingDirectMove?.categoryId ?? null}
              {localMoveSubmissionCount}
              onConfirmableDirectMoveCategory={handleConfirmableDirectMoveCategory}
              onOpenSupportDialog={openSupportDialog}
              onOpenFeedbackDialog={openFeedbackDialog}
              onOpenBugReportDialog={openBugReportDialog}
              {matchContext}
              onNextGame={onNextGame ?? undefined}
              onReturnToMatchmaking={handleReturnToMatchmaking}
              {boardOverlay}
            />
          {:else}
            <div class="loading">{m["sim.tabletop.loading"]({})}</div>
            <span class="loading loading-spinner loading-xl"></span>
          {/if}
        </Sidebar.Inset>
      {:else}
        <main class="compact-inset" aria-label={m["sim.tabletop.aria"]({})}>
          {#if boardSnapshot}
            <TabletopBoard
              {opponentPresence}
              {onSkipOpponent}
              {onDropOpponent}
              onReportOpponent={openPlayerReportDialog}
              {canReportOpponent}
              {gatewayStatus}
              {serverInitiatedClose}
              {authError}
              {viewerMode}
              {isAuthenticated}
              {layoutMode}
              {compactActionCount}
              {pendingEffectsPopoverItems}
              {activePlayerGuidance}
              {supportReminderText}
              bind:supportReminderOpen
              onDismissSupportReminder={() => {
                dismissSupportReminderForAWeek();
                supportReminderVisible = false;
                supportReminderOpen = false;
              }}
              onOpenCompactPanels={openCompactPanels}
              hotkeyDescriptors={visibleHotkeyDescriptors}
              pendingDirectMoveCategoryId={pendingDirectMove?.categoryId ?? null}
              {localMoveSubmissionCount}
              onConfirmableDirectMoveCategory={handleConfirmableDirectMoveCategory}
              onOpenSupportDialog={openSupportDialog}
              onOpenFeedbackDialog={openFeedbackDialog}
              onOpenBugReportDialog={openBugReportDialog}
              {matchContext}
              onNextGame={onNextGame ?? undefined}
              onReturnToMatchmaking={handleReturnToMatchmaking}
              {boardOverlay}
            />
          {:else}
            <div class="loading">{m["sim.tabletop.loading"]({})}</div>
            <span class="loading loading-spinner loading-xl"></span>
          {/if}
        </main>
      {/if}

    {#if pendingMoveError}
      <Dialog.Root bind:open={sidebar.showRawErrorDialog}>
        <Dialog.Portal>
          <Dialog.Overlay class="raw-error-overlay" />
          <Dialog.Content class="raw-error-dialog" showCloseButton={false}>
            <Dialog.Title class="raw-error-title">
              {m["sim.errorPanel.rawTitle"]({})}
            </Dialog.Title>
            <Dialog.Description class="raw-error-description">
              {m["sim.errorPanel.rawDescription"]({})}
            </Dialog.Description>

            <pre class="raw-error-payload">{sidebar.formatRawMoveError(pendingMoveError)}</pre>

            <Dialog.Footer class="raw-error-footer">
              <Dialog.Close class="raw-error-close">
                {m["sim.errorPanel.close"]({})}
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    {/if}

      <GlobalCardPreview/>
      <SimulatorHotkeysDialog
        bind:open={hotkeysDialogOpen}
        descriptors={visibleHotkeyDescriptors.filter((descriptor) => descriptor.enabled)}
      />
      <PlayerSettingsDialog
        bind:open={sidebar.isPlayerSettingsOpen}
        selectedLocale={sidebar.selectedLocale}
        {showRawLogRegistryJson}
        hotkeyMode={sidebar.hotkeyMode}
        cardPreviewMode={sidebar.cardPreviewMode}
        cardInfoMode={sidebar.cardInfoMode}
        onLocaleSelection={sidebar.handleLocaleSelection}
        onToggleRawLogRegistryJson={sidebar.handleRawLogRegistryToggle}
        onHotkeyModeChange={sidebar.handleHotkeyModeChange}
        onCardPreviewModeChange={sidebar.handleCardPreviewModeChange}
        onCardInfoModeChange={sidebar.handleCardInfoModeChange}
        primaryClickAction={sidebar.primaryClickAction}
        onPrimaryClickActionChange={sidebar.handlePrimaryClickActionChange}
        animationSpeed={sidebar.animationSpeed}
        onAnimationSpeedChange={sidebar.handleAnimationSpeedChange}
        soundVolume={sidebar.soundVolume}
        onSoundVolumeChange={sidebar.handleSoundVolumeChange}
        accessibleMobileControls={sidebar.accessibleMobileControls}
        onToggleAccessibleMobileControls={sidebar.handleAccessibleMobileControlsToggle}
        showZoneCounters={sidebar.showZoneCounters}
        onToggleShowZoneCounters={sidebar.handleShowZoneCountersToggle}
        selectedCardBack={sidebar.selectedCardBack}
        selectedPlaymat={sidebar.selectedPlaymat}
        onCardBackChange={sidebar.handleCardBackChange}
        onPlaymatChange={sidebar.handlePlaymatChange}
        onOpenFeedback={openFeedbackDialog}
        onOpenBugReport={openBugReportDialog}
        onOpenHotkeys={() => {
          hotkeysDialogOpen = true;
        }}
      />
      <SimulatorSupportDialog
        bind:open={supportDialogOpen}
        onOpenFeedback={openFeedbackDialog}
        onOpenBugReport={openBugReportDialog}
      />
      <SimulatorFeedbackDialog bind:open={feedbackDialogOpen} />
      <SimulatorBugReportDialog bind:open={bugReportDialogOpen} gameContext={bugReportContext} />
      <SimulatorPlayerReportDialog
        bind:open={playerReportDialogOpen}
        reportedDisplayName={opponentDisplayName}
        reportedGameProfileId={opponentGameProfileId}
        matchId={moderationMatchId}
        gameId={moderationGameId}
      />
      {#if isCompactLayout}
      <LorcanaCompactPanels
        bind:open={compactPanelsOpen}
        bind:activeTab={compactPanelsTab}
        readOnly={readOnlyMode}
      />
      {/if}

      {#if postGameGameId && postGameSummary}
        <PostGameSummaryDialog
          bind:open={postGameDialogOpen}
          gameId={postGameGameId}
          summary={postGameSummary}
          {isAuthenticated}
          onReturnToMatchmaking={handleReturnToMatchmaking}
          {matchContext}
          ownerSide={ownerSide}
          onNextGame={onNextGame ?? undefined}
          onOpenBugReport={openBugReportDialog}
          onOpenFeedback={openFeedbackDialog}
          onOpenPlayerReport={canShowPostGameReport ? openPlayerReportDialog : undefined}
        />

        {#if !postGameDialogOpen}
          <div class="post-game-launcher">
            <Button class="post-game-launcher__button" onclick={openPostGameSummary}>
              {m["sim.postGame.viewSummary"]({})}
            </Button>
          </div>
        {/if}
      {/if}
      <ConfettiOverlay show={showConfetti} />
    </div>
  </Sidebar.Provider>
</DragDropProvider>

<style>
  :global([data-slot="sidebar-wrapper"]) {
    min-height: 100vh !important;
    min-height: 100dvh !important;
    height: 100vh !important;
    height: 100dvh !important;
    overflow: hidden;
  }

  .simulator-v2 {
    --bg: #070f1b;
    --text-primary: #e5edf7;

    height: 100vh;
    height: 100dvh;
    max-height: 100vh;
    max-height: 100dvh;
    width: 100%;
    display: flex;
    background:
      radial-gradient(circle at 10% -5%, rgba(40, 74, 115, 0.5), transparent 55%),
      radial-gradient(circle at 95% 0%, rgba(32, 78, 70, 0.22), transparent 60%),
      var(--bg);
    font-family: "Trebuchet MS", "Segoe UI", sans-serif;
    overflow: hidden;
  }

  .loading {
    display: grid;
    place-items: center;
    height: 100%;
    color: #cbd9ea;
    font-size: 0.95rem;
  }

  :global([data-sidebar="trigger"]) {
    color: var(--text-primary) !important;
    background: rgba(17, 31, 50, 0.88) !important;
    border: 1px solid rgba(108, 145, 192, 0.28) !important;
  }

  :global([data-sidebar="trigger"]:hover) {
    background: rgba(25, 47, 76, 0.95) !important;
  }

  :global([data-slot="sidebar-inset"]) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: transparent !important;
  }

  .compact-inset {
    flex: 1;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 0.35rem;
    padding-bottom: calc(0.35rem + env(safe-area-inset-bottom));
    overflow: hidden;
  }

  .post-game-launcher {
    position: absolute;
    right: 1rem;
    bottom: calc(1rem + env(safe-area-inset-bottom));
    z-index: 60;
    display: flex;
    justify-content: flex-end;
    pointer-events: none;
  }

  :global(.post-game-launcher__button) {
    pointer-events: auto;
    min-height: 2.9rem;
    border-color: rgba(125, 211, 252, 0.42);
    background:
      linear-gradient(180deg, rgba(14, 116, 144, 0.92), rgba(8, 47, 73, 0.96));
    color: #f8fafc;
    box-shadow: 0 18px 40px rgba(2, 6, 23, 0.42);
  }

  @media (max-width: 767px) {
    .compact-inset {
      margin: 0;
      padding: 0;
    }

    .post-game-launcher {
      right: 0.75rem;
      left: 0.75rem;
      bottom: calc(4.75rem + env(safe-area-inset-bottom));
      justify-content: stretch;
    }

    :global(.post-game-launcher__button) {
      width: 100%;
    }
  }

  :global(.raw-error-overlay) {
    background: rgba(3, 7, 18, 0.76);
    backdrop-filter: blur(6px);
  }

  :global(.raw-error-dialog) {
    max-width: min(42rem, calc(100vw - 2rem));
    background: linear-gradient(180deg, rgba(10, 18, 31, 0.98), rgba(7, 15, 27, 0.98));
    border-color: rgba(108, 145, 192, 0.28);
    color: #e5edf7;
  }

  :global(.raw-error-title) {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
  }

  :global(.raw-error-description) {
    margin-top: -0.5rem;
    color: rgba(203, 217, 234, 0.8);
  }

  .raw-error-payload {
    margin: 0;
    max-height: min(24rem, 55vh);
    overflow: auto;
    border-radius: 12px;
    border: 1px solid rgba(108, 145, 192, 0.18);
    background: rgba(2, 6, 23, 0.92);
    padding: 0.9rem;
    font-size: 0.78rem;
    line-height: 1.55;
    color: #dbeafe;
    white-space: pre-wrap;
    word-break: break-word;
  }

  :global(.raw-error-footer) {
    margin-top: 0.25rem;
  }

  :global(.raw-error-close) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: 1px solid rgba(108, 145, 192, 0.28);
    background: rgba(17, 31, 50, 0.72);
    padding: 0.55rem 0.9rem;
    color: #e5edf7;
    font-size: 0.88rem;
    transition:
      background 160ms ease,
      border-color 160ms ease;
  }

  :global(.raw-error-close:hover) {
    background: rgba(25, 47, 76, 0.9);
    border-color: rgba(108, 145, 192, 0.4);
  }

</style>
