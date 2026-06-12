<script lang="ts">
import { tick, type Snippet } from "svelte";
import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
import DisconnectedPlayerOverlay from "@/features/gateway/ui/DisconnectedPlayerOverlay.svelte";
import TimedOutPlayerOverlay from "@/features/gateway/ui/TimedOutPlayerOverlay.svelte";
import UnauthenticatedPlayerOverlay from "@/features/gateway/ui/UnauthenticatedPlayerOverlay.svelte";
import { deriveClockView } from "@tcg/lorcana-engine";
import { useClockNow } from "@/features/simulator/model/clock-ticker.svelte.js";
import { m } from "$lib/i18n/messages.js";
import type {
	ExecutableMoveEntry,
	ExecutableMovePresentationCategoryId,
	ActionAvailableMovesSelectionState,
	AvailableMovesSelectionEntry,
	LorcanaCardSnapshot,
	LorcanaPlayerSide,
	LorcanaZoneId,
	ResolutionChoiceAvailableMovesSelectionState,
	ResolutionTargetAvailableMovesSelectionState,
} from "@/features/simulator/model/contracts.js";
import type { GuidanceAction } from "@/features/simulator/model/active-player-guidance.js";
import type { ActivePlayerGuidanceItem } from "@/features/simulator/model/active-player-guidance.js";
import {
	BOARD_CENTER_ANCHOR_ID,
	createCardAnchorId,
	createSeatHandAnchorId,
	measureBoardAnchorRect,
	type BoardAnchorRect,
	type BoardAnchorSnapshot,
	type BoardLocalRect,
} from "@/features/simulator/animations/board-move-animations.js";
import HandZone from "@/features/simulator/board/HandZone.svelte";
import CardTargetDialog from "@/features/simulator/dialogs/CardTargetDialog.svelte";
import DiscardPileDialog from "@/features/simulator/dialogs/DiscardPileDialog.svelte";
import InkwellDialog from "@/features/simulator/dialogs/InkwellDialog.svelte";
import * as Dialog from "$lib/design-system/primitives/dialog";
import { Button } from "$lib/design-system/primitives/button";
import ScryResolutionOverlay from "@/features/simulator/board/ScryResolutionOverlay.svelte";
import ChoiceResolutionOverlay from "@/features/simulator/board/ChoiceResolutionOverlay.svelte";
import PriorityNudge from "@/features/simulator/board/PriorityNudge.svelte";
import type { InteractionSelectChoice } from "@tcg/lorcana-interaction";
import ResolutionTargetOverlay from "@/features/simulator/board/ResolutionTargetOverlay.svelte";
import { shouldUseResolutionTargetOverlay } from "@/features/simulator/board/resolution-target-overlay.js";
import {
	getActionTargetSelectionModalZones,
	getTargetSelectionModalTitle,
	shouldAutoOpenTargetSelectionModal,
	shouldUseTargetSelectionModal,
} from "@/features/simulator/board/target-selection-modal.js";
import ActivePlayerGuidance from "@/features/simulator/panels/ActivePlayerGuidance.svelte";
import PendingEffectsPopover from "@/features/simulator/panels/PendingEffectsPopover.svelte";
import BoardAnimationLayer from "./BoardAnimationLayer.svelte";
import QuestAnimationLayer from "./QuestAnimationLayer.svelte";
import ChallengeAnimationLayer from "./ChallengeAnimationLayer.svelte";
import ActionAnimationLayer from "./ActionAnimationLayer.svelte";
import OverlayAnnouncementLayer from "./OverlayAnnouncementLayer.svelte";
import CardEffectAnimationLayer from "./CardEffectAnimationLayer.svelte";
import ChallengeAimOverlay from "@/features/simulator/board/ChallengeAimOverlay.svelte";
import MobilePlayerMenubar from "@/features/simulator/panels/MobilePlayerMenubar.svelte";
import PlayerIdentityStrip from "@/features/simulator/panels/PlayerIdentityStrip.svelte";
import SeatLane from "@/features/simulator/board/SeatLane.svelte";
import TurnActionRail from "@/features/simulator/board/TurnActionRail.svelte";
import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
import { toggleHandTuckState } from "@/features/simulator/board/hand-tuck-state.js";
import type {
	SimulatorHotkeyCardZone,
	SimulatorHotkeyDescriptor,
} from "@/features/simulator/hotkeys/hotkey-bindings.js";
import {
	useLorcanaGameContext,
	useLorcanaBoardPresenter,
	useLorcanaSidebarPresenter,
} from "@/features/simulator/context/game-context.svelte.js";
import { useSimulatorCardContext } from "@/features/simulator/context/simulator-card-context.svelte.js";
import { useLorcanaSimulatorDndContext } from "@/features/simulator/context/simulator-dnd-context.svelte.js";
import { bugReportContextFromBoard } from "@/features/simulator/support/feedback-api.js";
import { getManualModeContext } from "@/features/manual-mode/manual-mode-context.svelte.js";
import type { SimulatorLayoutMode } from "@/features/simulator/model/layout-mode.svelte.js";
import type { MatchNavigationContext } from "@/features/simulator/model/contracts.js";
import type {
	ConfirmableDirectMoveCategoryId,
	DirectMoveTriggerSource,
} from "@/features/simulator/model/direct-action-state.js";
import { getQuestAllSummary } from "@/features/simulator/model/turn-action-rail.js";
import { maybeUseMatchChatControllerContext } from "@/features/match-chat/match-chat-controller.svelte.js";
import {
	PRIORITY_NUDGE_DELAY_MS,
	createPriorityWindowKey,
	shouldArmPriorityNudge,
} from "@/features/simulator/model/priority-nudge-state.js";

type CardTargetDialogState = Pick<
	ResolutionTargetAvailableMovesSelectionState,
	| "sessionKey"
	| "title"
	| "message"
	| "entries"
	| "allowedZones"
	| "candidateCardIds"
	| "candidatePlayerIds"
	| "canConfirm"
	| "canDecline"
	| "declineLabel"
	| "playCardEntryModeChoice"
> & { mode: "resolution-target" | "action" };

interface PendingEffectsPopoverItem {
	id: string;
	kind: "bag" | "pending";
	title: string;
	summaryTitle?: string;
	subtitle: string;
	detail: string;
	badge: string;
	card: LorcanaCardSnapshot | null;
	instanceReferences?: Array<{
		id: string;
		label: string;
		cardId: string;
		card: LorcanaCardSnapshot | null;
	}>;
	isActive?: boolean;
	canResolve?: boolean;
	canAccept?: boolean;
	canReject?: boolean;
	disabledReason?: string;
	primaryActionLabel?: string;
	onResolve?: () => void;
	onPrimaryAction?: () => void;
	onAccept?: () => void;
	onReject?: () => void;
	statusMessage?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
	inlineActions?: GuidanceAction[];
}

	interface TabletopBoardProps {
	layoutMode?: SimulatorLayoutMode;
	compactActionCount?: number;
	pendingEffectsPopoverItems?: PendingEffectsPopoverItem[];
	activePlayerGuidance?: ActivePlayerGuidanceItem[];
	hotkeyDescriptors?: SimulatorHotkeyDescriptor[];
	supportReminderText?: string | null;
	supportReminderOpen?: boolean;
	onDismissSupportReminder?: () => void;
	onOpenCompactPanels?: (tab?: "moves" | "log") => void;
	pendingDirectMoveCategoryId?: ConfirmableDirectMoveCategoryId | null;
	onConfirmableDirectMoveCategory?: (
		categoryId: "pass-turn" | "quest-all" | "undo",
		source?: DirectMoveTriggerSource,
	) => void;
	onOpenSupportDialog?: () => void;
	onOpenFeedbackDialog?: () => void;
	onOpenBugReportDialog?: () => void;
	localMoveSubmissionCount?: number;
	opponentPresence?: import("@/features/gateway/opponent-presence.svelte.js").OpponentPresenceTracker | null;
	onSkipOpponent?: (() => void) | null;
	onDropOpponent?: (() => void) | null;
	onReportOpponent?: (() => void) | null;
	canReportOpponent?: boolean;
	gatewayStatus?: import("@/features/gateway/gateway-client.js").ConnectionStatus | null;
	/** True when the server announced a deploy before the socket closed. */
	serverInitiatedClose?: boolean;
	/** True when the gateway rejected the connection with a terminal auth error. */
	authError?: boolean;
	viewerMode?: "player" | "spectator";
	isAuthenticated?: boolean;
	matchContext?: MatchNavigationContext | null;
	onNextGame?: (() => void) | null;
	onReturnToMatchmaking?: (() => void | Promise<void>) | null;
	/** Optional overlay rendered between the two player lanes (e.g. replay controls). */
	boardOverlay?: Snippet;
}

interface PointerPosition {
	x: number;
	y: number;
}

const MOBILE_EXPANDED_MOVES_GUIDANCE_ID = "mobile-expanded-moves";

let {
	layoutMode = "desktop",
	compactActionCount = 0,
	pendingEffectsPopoverItems = [],
	activePlayerGuidance = [],
	hotkeyDescriptors = [],
	supportReminderText = null,
	supportReminderOpen = $bindable(false),
	onDismissSupportReminder,
	onOpenCompactPanels,
	pendingDirectMoveCategoryId = null,
	onConfirmableDirectMoveCategory,
	onOpenSupportDialog,
	onOpenFeedbackDialog,
	onOpenBugReportDialog,
	localMoveSubmissionCount = 0,
	opponentPresence = null,
	onSkipOpponent = null,
	onDropOpponent = null,
	onReportOpponent = null,
	canReportOpponent = false,
	gatewayStatus = null,
	serverInitiatedClose = false,
	authError = false,
	viewerMode = "player",
	isAuthenticated = true,
	matchContext = null,
	onNextGame = null,
	onReturnToMatchmaking = null,
	boardOverlay,
}: TabletopBoardProps = $props();

const board = useLorcanaBoardPresenter();
const sidebar = useLorcanaSidebarPresenter();
const game = useLorcanaGameContext();
const simulatorCardContext = useSimulatorCardContext();
const dnd = useLorcanaSimulatorDndContext();
const matchChatContext = maybeUseMatchChatControllerContext();
const matchChatController = $derived(matchChatContext?.controller ?? null);
const boardSnapshot = $derived(board.boardSnapshot);
const isPostGame = $derived(boardSnapshot?.status === "finished" || (matchContext?.matchCompleted ?? false));
const bugReportContext = $derived(bugReportContextFromBoard(boardSnapshot));
const ownerSide = $derived(board.ownerSide);
const questRotationDurationMs = $derived(board.questRotationDurationMs);
const topSeat = board.topSeat;
const bottomSeat = board.bottomSeat;

let tabletopRef: HTMLElement | null = $state(null);
let boardScrollRef: HTMLElement | null = $state(null);
let boardRef: HTMLElement | null = $state(null);
let boardAnchorSnapshot: BoardAnchorSnapshot | null = $state(null);
let challengePointerClientPosition: PointerPosition | null = $state(null);
let pendingEffectsOpen = $state(false);
let inlineMoveChoices = $state<{
	categoryId: ExecutableMovePresentationCategoryId;
	label: string;
	moves: ExecutableMoveEntry[];
} | null>(null);
let anchorRevision = 0;
let measurementRequestId = 0;
let targetSelectionDialogOpen = $state(false);
let dismissedTargetDialogSessionKey = $state<string | null>(null);
let userForcedTargetDialogOpen = $state(false);
let skipConfirmOpen = $state(false);
let dropConfirmOpen = $state(false);
let priorityNudgeVisible = $state(false);
let dismissedPriorityNudgeWindowKey = $state<string | null>(null);
const priorityNudgeTimerRef: { current: ReturnType<typeof setTimeout> | null } = { current: null };
let lastLocalMoveSubmissionCount = $state(0);
let handTuckState = $state<Record<LorcanaPlayerSide, boolean>>({
	playerOne: false,
	playerTwo: false,
});
const boardScrollListenerOptions: AddEventListenerOptions = { passive: true };

const bottomSide = $derived(board.bottomSide);
const topSide = $derived(board.topSide);
const hasOwnedView = $derived(board.hasOwnedView);
const discardCards = $derived(board.discardCards);
const inkwellCards = $derived(board.inkwellCards);
const topHasPriority = $derived(board.topHasPriority);
const bottomHasPriority = $derived(board.bottomHasPriority);
const prioritySide = $derived(board.prioritySide);
const topIsTurnPlayer = $derived(board.topIsTurnPlayer);
const bottomIsTurnPlayer = $derived(board.bottomIsTurnPlayer);
const activeSide = $derived(sidebar.activeSide);
const guidanceAnchor = $derived(sidebar.guidancePosition);
const topSummary = $derived(board.getPlayerSummary(topSide));
const bottomSummary = $derived(board.getPlayerSummary(bottomSide));
const isCompactLayout = $derived(layoutMode !== "desktop");
const isOpponentDisconnected = $derived(opponentPresence != null && !opponentPresence.opponentConnected);

// Opponent clock view — single source of truth for the skip/drop affordances
// and the "is the opponent timed out" overlay. Derives from the engine-projected
// ClockSnapshot plus the shared reactive `now`, so it stays in lockstep with
// what PlayerTimer renders.
const clockNow = useClockNow();
const opponentClockView = $derived(
	topSummary?.timer ? deriveClockView(topSummary.timer, clockNow.value) : null,
);
const isOpponentTimedOut = $derived(opponentClockView?.timedOutWithPriority ?? false);
const canSkipOpponent = $derived(opponentClockView?.canSkipOpponent ?? false);
const canDropOpponent = $derived(opponentClockView?.canDropOpponent ?? false);
// DEPLOYMENT CACHE STRATEGY: Delay showing the self-disconnect overlay by 2 seconds.
// During blue-green deploys, the socket drops and reconnects within ~1–2 seconds.
// Without a grace period, players see a jarring "Connection lost" flash that
// disappears almost immediately. The 2-second delay absorbs the typical deploy
// reconnect cycle so players never notice routine deployments.
const isGatewayDisconnected = $derived(gatewayStatus === "disconnected" || gatewayStatus === "reconnecting");
let isSelfDisconnected = $state(false);
let disconnectGraceTimer: ReturnType<typeof setTimeout> | null = null;
const DISCONNECT_GRACE_PERIOD_MS = 2_000;
$effect(() => {
  if (isGatewayDisconnected) {
    disconnectGraceTimer = setTimeout(() => {
      isSelfDisconnected = true;
    }, DISCONNECT_GRACE_PERIOD_MS);
  } else {
    if (disconnectGraceTimer) {
      clearTimeout(disconnectGraceTimer);
      disconnectGraceTimer = null;
    }
    isSelfDisconnected = false;
  }
  return () => {
    if (disconnectGraceTimer) {
      clearTimeout(disconnectGraceTimer);
      disconnectGraceTimer = null;
    }
  };
});
const isUnauthenticatedPlayer = $derived(
  viewerMode === "player" &&
  (
    authError === true ||
    (gatewayStatus === "connected" && isAuthenticated === false)
  ),
);

const isMobileLayout = $derived(layoutMode === "mobile");
const accessibleMobileControls = $derived(sidebar.accessibleMobileControls);
const isTopHandTucked = $derived(!isMobileLayout && handTuckState[topSide]);
const isBottomHandTucked = $derived(
	!isMobileLayout && handTuckState[bottomSide],
);
const selectedCard = $derived(sidebar.selectedActionSessionCard);
const compactPreviewCard = $derived.by(() => {
	if (!isCompactLayout) {
		return null;
	}

	return selectedCard ?? simulatorCardContext.hoveredCard ?? null;
});
const selectedCardPlayable = $derived.by(() => {
	if (!selectedCard) {
		return false;
	}

	const zoneId = selectedCard.zoneId;
	const isInkOrPlaySourceZone =
		zoneId === "hand" || zoneId === "discard" || zoneId === "limbo";

	return (
		selectedCard.ownerSide === bottomSide &&
		isInkOrPlaySourceZone &&
		board.playableHandCardIds.includes(selectedCard.cardId)
	);
});
const topPlayerLabel = $derived(
	hasOwnedView
		? m["sim.player.opponent"]({})
		: m["sim.player.side.playerTwo"]({}),
);
const bottomPlayerLabel = $derived(
	hasOwnedView ? m["sim.player.you"]({}) : m["sim.player.side.playerOne"]({}),
);
const manualMode = getManualModeContext();
const manualModeEnabled = $derived(manualMode?.enabled ?? false);
const canRequestBoardStateCorrection = $derived(!!manualMode && hasOwnedView);
function handleRequestBoardStateCorrection(): void {
	if (!manualMode) return;
	if (manualMode.enabled) {
		manualMode.requestDisable();
	} else {
		manualMode.requestEnable();
	}
}
const topPlayerId = $derived(board.getOwnerIdForSide(topSide));
const bottomPlayerId = $derived(board.getOwnerIdForSide(bottomSide));
const topPlayerDisplayName = $derived(
	topPlayerId ? game.resolvePlayerName(topPlayerId) : null,
);
const bottomPlayerDisplayName = $derived(
	bottomPlayerId ? game.resolvePlayerName(bottomPlayerId) : null,
);
const topPlayerSubscriptionTier = $derived(
	topPlayerId ? game.getPlayerSubscriptionTier(topPlayerId) : undefined,
);
const bottomPlayerSubscriptionTier = $derived(
	bottomPlayerId ? game.getPlayerSubscriptionTier(bottomPlayerId) : undefined,
);
const topPlayerMmr = $derived(
	topPlayerId ? game.getPlayerMmr(topPlayerId) : undefined,
);
const bottomPlayerMmr = $derived(
	bottomPlayerId ? game.getPlayerMmr(bottomPlayerId) : undefined,
);
const topPlayerBracketId = $derived(
	topPlayerId ? game.getPlayerBracketId(topPlayerId) : undefined,
);
const bottomPlayerBracketId = $derived(
	bottomPlayerId ? game.getPlayerBracketId(bottomPlayerId) : undefined,
);
const topPlayerIsMobile = $derived(
	topPlayerId ? game.isPlayerMobile(topPlayerId) : false,
);
const bottomPlayerIsMobile = $derived(
	bottomPlayerId ? game.isPlayerMobile(bottomPlayerId) : false,
);
const activeTurnTimer = $derived.by(() => {
	// Prefer whichever clock is actually ticking (priority may shift mid-turn)
	if (topSummary?.timer?.isRunning) return topSummary.timer;
	if (bottomSummary?.timer?.isRunning) return bottomSummary.timer;
	// Fallback: turn player (clock paused / no active player yet)
	if (topIsTurnPlayer) return topSummary?.timer;
	if (bottomIsTurnPlayer) return bottomSummary?.timer;
	return bottomSummary?.timer ?? topSummary?.timer;
});
const activeTurnTimerLabel = $derived.by(() => {
	const toClockLabel = (playerLabel: string) =>
		playerLabel === m["sim.player.you"]({})
			? m["sim.clock.label.your"]({})
			: m["sim.clock.label.player"]({ playerLabel });

	if (topSummary?.timer?.isRunning) return toClockLabel(topPlayerLabel);
	if (bottomSummary?.timer?.isRunning) return toClockLabel(bottomPlayerLabel);
	if (topIsTurnPlayer) return toClockLabel(topPlayerLabel);
	if (bottomIsTurnPlayer) return toClockLabel(bottomPlayerLabel);
	return toClockLabel(bottomPlayerLabel);
});
const moveCategoryCount = $derived(sidebar.moveCategoryCount);
const moveCategorySummaries = $derived(sidebar.moveCategorySummaries);
const moveCategoryIds = $derived(moveCategorySummaries.map((summary) => summary.categoryId));
const moveLogEntries = $derived(sidebar.moveLogEntries);
const availableMovesSelectionState = $derived(
	sidebar.availableMovesSelectionState,
);
const activeMobileMoveCategoryId = $derived(
	availableMovesSelectionState?.mode === "action"
		? availableMovesSelectionState.categoryId
		: (inlineMoveChoices?.categoryId ?? null),
);
const pendingEffectsCount = $derived(pendingEffectsPopoverItems.length);
const questAllSummary = $derived(
	getQuestAllSummary(moveCategorySummaries, board.cardSnapshotsById),
);
const questAllLore = $derived(questAllSummary?.lore ?? null);
const questAllCount = $derived(questAllSummary?.count ?? null);
const canPassTurn = $derived(
	moveCategorySummaries.some((summary) => summary.categoryId === "pass-turn"),
);
const canUndo = $derived(
	moveCategorySummaries.some((summary) => summary.categoryId === "undo"),
);
const canQuestAll = $derived(
	moveCategorySummaries.some((summary) => summary.categoryId === "quest-all"),
);
const priorityNudgeWindowKey = $derived(createPriorityWindowKey({
	ownerSide,
	prioritySide,
	stateID: boardSnapshot?.stateID,
	turnNumber: boardSnapshot?.turnNumber,
	moveCategoryIds,
}));
const priorityNudgeArmed = $derived(shouldArmPriorityNudge({
	viewerMode,
	isPostGame,
	ownerSide,
	prioritySide,
	moveCategoryIds,
	hasActiveSelection: availableMovesSelectionState !== null,
}));
const targetSelectionState = $derived.by(() => {
	if (
		availableMovesSelectionState?.mode === "resolution-target" ||
		(availableMovesSelectionState?.mode === "action" &&
			(availableMovesSelectionState.phase === "choose-target" ||
				availableMovesSelectionState.phase === "choose-cost"))
	) {
		return availableMovesSelectionState;
	}

	return null;
});
function createActionTargetDialogSessionKey(
	state: ActionAvailableMovesSelectionState,
	allowedZones: readonly LorcanaZoneId[],
): string {
	return [
		"action-target",
		state.categoryId,
		state.sourceCardId ?? "none",
		state.selectedMoveId ?? "none",
		allowedZones.join(","),
		state.entries.map((entry) => entry.id).join("|"),
	].join(":");
}

function createActionTargetDialogState(
	state: ActionAvailableMovesSelectionState,
): CardTargetDialogState | null {
	const entryCandidateCardIds = state.entries.flatMap((entry) =>
		entry.kind === "card" && typeof entry.cardId === "string" ? [entry.cardId] : [],
	);
	const candidateCardIds =
		entryCandidateCardIds.length > 0
			? entryCandidateCardIds
			: sidebar.selectableActionSessionCardIds;
	const allowedZones =
		candidateCardIds.length > 0
			? [
					...new Set(
						candidateCardIds.flatMap((cardId) => {
							const zoneId = board.cardSnapshotsById[cardId]?.zoneId;
							return zoneId ? [zoneId] : [];
						}),
					),
				]
			: getActionTargetSelectionModalZones(state, board.cardSnapshotsById);

	if (
		!shouldUseTargetSelectionModal({
			allowedZones,
			candidatePlayerIds: [],
			categoryId: state.categoryId,
		})
	) {
		return null;
	}

	return {
		mode: "action",
		sessionKey: createActionTargetDialogSessionKey(state, allowedZones),
		title: state.title,
		message: state.message,
		entries: state.entries,
		allowedZones,
		candidateCardIds,
		candidatePlayerIds: [],
		canConfirm: state.canConfirm,
	};
}

const resolutionTargetOverlayState = $derived.by(
	(): ResolutionTargetAvailableMovesSelectionState | null => {
  if (shouldUseResolutionTargetOverlay(targetSelectionState)) {
    return targetSelectionState as ResolutionTargetAvailableMovesSelectionState;
  }

  return null;
},
);
const genericTargetModalState = $derived.by(
	(): CardTargetDialogState | null => {
		if (!targetSelectionState || resolutionTargetOverlayState) {
			return null;
		}

		if (
			targetSelectionState.mode === "resolution-target" &&
			shouldUseTargetSelectionModal(targetSelectionState)
		) {
			return targetSelectionState;
		}

		if (targetSelectionState.mode === "action") {
			return createActionTargetDialogState(targetSelectionState);
		}

		return null;
	},
);
const dialogTargetState = $derived.by(
	(): CardTargetDialogState | null =>
		genericTargetModalState ??
		(userForcedTargetDialogOpen && targetSelectionState?.mode === "resolution-target"
			? targetSelectionState
			: null),
);
const scrySelectionState = $derived.by(() => {
  if (availableMovesSelectionState?.mode === "resolution-scry") {
    return availableMovesSelectionState;
  }

  return null;
});
const choiceSelectionState = $derived.by((): ResolutionChoiceAvailableMovesSelectionState | null => {
  if (availableMovesSelectionState?.mode === "resolution-choice") {
    return availableMovesSelectionState;
  }

  return null;
});

/**
 * Renderer-facing view of the active engine prompt, with the chooser's
 * in-flight selection state merged in. Owned by `LorcanaSidebarPresenter`
 * because the sidebar holds `#resolutionSelectionSession`. Use this for
 * overlay rendering — `game.interactionView` returns an engine-only
 * view that's stale for renderer copy (e.g. `submission.canSubmit`
 * after a target click but before submit). See gap #18 in
 * `docs/player-interaction-rewrite.md`.
 */
const interactionView = $derived(sidebar.interactionView);

const choiceFocusCard = $derived.by(() => {
  const prompt = interactionView?.activePrompt;
  const focusId = prompt?.selectedCardIds[0];
  if (!focusId) return null;
  return board.cardSnapshotsById[focusId as unknown as string] ?? null;
});

const choiceSourceCard = $derived.by(() => {
  const sourceId = interactionView?.activePrompt?.sourceCardId;
  if (!sourceId) return null;
  return board.cardSnapshotsById[sourceId as unknown as string] ?? null;
});

const selectedChoiceIndex = $derived(
  sidebar.resolutionSelectionSession?.selectedChoiceIndex ?? null,
);

function handleChoiceInteraction(interaction: InteractionSelectChoice): void {
  sidebar.selectResolutionChoice(interaction.index);
}

const hasActiveOverlay = $derived(
  Boolean(resolutionTargetOverlayState || scrySelectionState || choiceSelectionState || dialogTargetState),
);

function getDialogCardIds(
	state: CardTargetDialogState | null,
): string[] {
	if (!state) {
		return [];
	}

	const entryCardIds = state.entries.flatMap((entry) =>
		entry.kind === "card" && typeof entry.cardId === "string" ? [entry.cardId] : [],
	);

	return entryCardIds.length > 0 ? entryCardIds : state.candidateCardIds;
}

const targetSelectionDialogCards = $derived.by(
	() =>
		getDialogCardIds(dialogTargetState)
			.map((cardId) => game.resolveCardSnapshot(cardId))
			.filter((card): card is LorcanaCardSnapshot => card !== null) ?? [],
);
const targetSelectionDialogPlayers = $derived.by(
	() =>
		dialogTargetState?.entries
			.filter(
				(entry): entry is AvailableMovesSelectionEntry & { playerId: string } =>
					entry.kind === "player" && typeof entry.playerId === "string",
			)
			.map((entry) => ({
				id: entry.playerId,
				label: entry.label,
				selected: entry.selected,
				disabled: entry.disabled,
			})) ?? [],
);
const selectedTargetCardIds = $derived.by(
	() => {
		const selectedSlotCardIds =
			(interactionView?.activePrompt?.slots ?? [])
				.flatMap((slot) =>
					slot.targetCardId && !slot.autoResolved ? [String(slot.targetCardId)] : [],
				) ?? [];
		if (selectedSlotCardIds.length > 0) {
			return selectedSlotCardIds;
		}

		return (
			dialogTargetState?.entries
			.filter(
				(entry): entry is AvailableMovesSelectionEntry & { cardId: string } =>
					entry.kind === "card" &&
					typeof entry.cardId === "string" &&
					entry.selected,
			)
				.map((entry) => entry.cardId) ?? []
		);
	},
);
const selectedTargetCount = $derived.by(
	() =>
		selectedTargetCardIds.length +
		(targetSelectionDialogPlayers.filter((player) => player.selected).length ?? 0),
);
const targetSelectionDialogTitle = $derived.by(() => {
	if (!dialogTargetState) {
		return "";
	}

	return getTargetSelectionModalTitle(dialogTargetState);
});
const targetSelectionDialogDescription = $derived.by(() => {
	if (!dialogTargetState) {
		return "";
	}

	if (
		dialogTargetState.allowedZones.length === 1 &&
		dialogTargetState.allowedZones[0] !== "play"
	) {
		return dialogTargetState.message;
	}

	return dialogTargetState.message;
});
const activeTargetDialogSessionKey = $derived(
	dialogTargetState?.sessionKey ?? null,
);
const hasPendingEffects = $derived(sidebar.hasPendingEffects);
// Strict-visibility rule: a card only gets a badge when its hotkey would
// actually do something right now. We filter on `enabled` so off-layer zones
// quietly disappear from the UI as the active layer changes.
function buildHotkeyBindingMap(
  descriptors: ReadonlyArray<SimulatorHotkeyDescriptor>,
  zone: SimulatorHotkeyCardZone,
): Map<string, string> {
  return new Map(
    descriptors
      .filter(
        (descriptor) =>
          descriptor.kind === "card" &&
          descriptor.cardZone === zone &&
          descriptor.enabled &&
          typeof descriptor.cardId === "string",
      )
      .map((descriptor) => [descriptor.cardId!, descriptor.hotkey]),
  );
}
const opponentPlayHotkeys = $derived(buildHotkeyBindingMap(hotkeyDescriptors, "opponent-play"));
const ownedPlayHotkeys = $derived(buildHotkeyBindingMap(hotkeyDescriptors, "your-play"));
const ownedHandHotkeys = $derived(buildHotkeyBindingMap(hotkeyDescriptors, "your-hand"));
const opponentHandHotkeys = $derived(buildHotkeyBindingMap(hotkeyDescriptors, "opponent-hand"));
const canConcede = $derived(sidebar.canConcede);
const challengeSelectionSession = $derived(sidebar.actionSelectionSession);
const isChallengeAimOverlayVisible = $derived(
	challengeSelectionSession?.categoryId === "challenge" &&
		(challengeSelectionSession.phase === "choose-target" ||
			challengeSelectionSession.phase === "confirm") &&
		!dnd.isDraggingPlayCard,
);
const canOpenTargetModal = $derived(
	Boolean(targetSelectionState) && !isChallengeAimOverlayVisible,
);
const challengeAttackerCard = $derived.by(() => {
	const attackerId = challengeSelectionSession?.sourceCardId;
	if (!isChallengeAimOverlayVisible || !attackerId) {
		return null;
	}

	return board.cardSnapshotsById[attackerId] ?? null;
});
const lockedChallengeTargetCard = $derived.by(() => {
	if (!isChallengeAimOverlayVisible) {
		return null;
	}

	const lockedTargetId = challengeSelectionSession?.targetCardId;
	if (lockedTargetId) {
		return board.cardSnapshotsById[lockedTargetId] ?? null;
	}

	const hoveredCard = simulatorCardContext.hoveredCard;
	if (!hoveredCard) {
		return null;
	}

	return sidebar.getActionSessionCardState(hoveredCard.cardId).isSelectable
		? hoveredCard
		: null;
});
const challengeBoardSize = $derived.by(() => {
	const boardRect = boardAnchorSnapshot?.boardRect;
	if (boardRect) {
		return {
			width: boardRect.width,
			height: boardRect.height,
		};
	}

	return {
		width: boardRef?.clientWidth ?? 0,
		height: boardRef?.clientHeight ?? 0,
	};
});
const challengePointerPosition = $derived.by(() => {
	if (!challengePointerClientPosition) {
		return null;
	}

	return resolveBoardLocalPoint(
		challengePointerClientPosition.x,
		challengePointerClientPosition.y,
	);
});
const challengeSourceAnchorRect = $derived.by(() => {
	if (!challengeAttackerCard) {
		return null;
	}

	return resolveCardAnchorLocalRect(challengeAttackerCard);
});
const lockedChallengeTargetRect = $derived.by(() => {
	if (!lockedChallengeTargetCard) {
		return null;
	}

	return resolveCardAnchorLocalRect(lockedChallengeTargetCard);
});
const challengeTargetPoint = $derived.by(() => {
	if (lockedChallengeTargetRect) {
		return {
			x: lockedChallengeTargetRect.centerX,
			y: lockedChallengeTargetRect.centerY,
		};
	}

	return challengePointerPosition;
});
const challengePreview = $derived.by(() => {
	if (!challengeAttackerCard || !lockedChallengeTargetCard) {
		return null;
	}

	return board.previewChallenge(
		challengeAttackerCard.cardId,
		lockedChallengeTargetCard.cardId,
	);
});

function openCompactPreview(): void {
	if (!compactPreviewCard) {
		return;
	}

	simulatorCardContext.openGlobalPreview(compactPreviewCard);
}

function clearCompactPreview(): void {
	sidebar.cancelActionSelectionSession();
}

function clearInteractionState(): void {
	if (sidebar.actionSelectionSession) {
		sidebar.cancelActionSelectionSession();
		return;
	}

	if (inlineMoveChoices) {
		inlineMoveChoices = null;
	}
}

function shouldPreserveInteractionState(target: EventTarget | null): boolean {
	if (!(target instanceof Element)) {
		return false;
	}

	return Boolean(
		target.closest(
			[
				"[data-card-id]",
				"button",
				"a",
				"input",
				"select",
				"textarea",
				"[role='button']",
				"[role='dialog']",
				"[data-sidebar]",
				"[data-radix-popper-content-wrapper]",
			].join(", "),
		),
	);
}

function handleTabletopPointerDown(event: PointerEvent): void {
	if (shouldPreserveInteractionState(event.target)) {
		return;
	}

	clearInteractionState();
}

function openPlayerSettings(): void {
	sidebar.handleOpenPlayerSettings();
}

function toggleGuidancePosition(): void {
	sidebar.handleGuidancePositionToggle();
}

function handleMobileConcede(): void {
	sidebar.handleMobileConcede();
}

function dismissPriorityNudge(): void {
	dismissedPriorityNudgeWindowKey = priorityNudgeWindowKey;
	priorityNudgeVisible = false;
}

function handleLocalMoveSubmitted(): void {
	dismissPriorityNudge();
}

function sendPriorityThinkingPreset(): void {
	matchChatController?.sendPreset("thinking");
	dismissPriorityNudge();
}

function handlePriorityNudgePassTurn(): void {
	const passTurnWasAlreadyArmed = pendingDirectMoveCategoryId === "pass-turn";
	onConfirmableDirectMoveCategory?.("pass-turn", "pointer");
	if (passTurnWasAlreadyArmed) {
		dismissPriorityNudge();
	}
}

function handleMobileReportPlayer(): void {
	sidebar.handleMobileReportPlayer();
}

function handleAdvancePendingEffects(): void {
	pendingEffectsOpen = true;
}

function openTargetSelectionDialog(): void {
	if (!targetSelectionState) {
		return;
	}

	if (!genericTargetModalState) {
		userForcedTargetDialogOpen = true;
	}
	dismissedTargetDialogSessionKey = null;
	targetSelectionDialogOpen = true;
}

function handleTargetSelectionDialogCard(cardId: string): boolean {
	const prompt = interactionView?.activePrompt;
	const nextSlot = prompt?.slots?.find((slot) => !slot.autoResolved && !slot.locked);
	if (prompt && prompt.activeSlotIndex === null && nextSlot) {
		sidebar.selectResolutionTargetSlot(nextSlot.index);
	}

	const selected =
		sidebar.handleAvailableMovesSelectionCard(cardId) ||
		sidebar.toggleResolutionTargetSelection(cardId);
	return selected;
}

function handleMobileMoveCategory(
	categoryId: ExecutableMovePresentationCategoryId,
): void {
	const moves = sidebar.expandCategoryMoves(categoryId);
	if (moves.length === 0) {
		return;
	}

	const summary =
		moveCategorySummaries.find((entry) => entry.categoryId === categoryId) ??
		null;
	if (summary?.isDirect) {
		if (
			(categoryId === "pass-turn" || categoryId === "quest-all") &&
			onConfirmableDirectMoveCategory
		) {
			inlineMoveChoices = null;
			onConfirmableDirectMoveCategory(categoryId, "pointer");
			return;
		}

		inlineMoveChoices = null;
		handleLocalMoveSubmitted();
		sidebar.handleAvailableMoveClick(moves[0]);
		return;
	}

	if (sidebar.startManualCardActionSelection(categoryId, moves)) {
		inlineMoveChoices = null;
		return;
	}

	inlineMoveChoices = {
		categoryId,
		label:
			summary?.categoryLabel ??
			moves[0]?.presentation.categoryLabel ??
			categoryId,
		moves,
	};
}

function handleBackInlineMoveChoices(): void {
	inlineMoveChoices = null;
}

function handleExecuteInlineMoveChoice(move: ExecutableMoveEntry): void {
	inlineMoveChoices = null;
	handleLocalMoveSubmitted();
	sidebar.handleAvailableMoveClick(move);
}

function toggleHandTucked(playerSide: LorcanaPlayerSide): void {
	handTuckState = toggleHandTuckState(handTuckState, playerSide);
}

async function scheduleAnchorMeasurement(): Promise<void> {
	measurementRequestId += 1;
	const requestId = measurementRequestId;
	await tick();

	requestAnimationFrame(() => {
		if (requestId !== measurementRequestId) {
			return;
		}

		publishAnchorSnapshot();
	});
}

function publishAnchorSnapshot(): void {
	if (!tabletopRef || !boardRef) {
		return;
	}

	const boardRect = boardRef.getBoundingClientRect();
	if (boardRect.width <= 0 || boardRect.height <= 0) {
		return;
	}

	const anchors: Record<string, ReturnType<typeof measureBoardAnchorRect>> = {};
	for (const element of tabletopRef.querySelectorAll<HTMLElement>(
		"[data-board-anchor-id]",
	)) {
		const anchorId = element.dataset.boardAnchorId;
		if (!anchorId) {
			continue;
		}

		anchors[anchorId] = measureBoardAnchorRect(element.getBoundingClientRect());
	}

	anchorRevision += 1;
	boardAnchorSnapshot = {
		revision: anchorRevision,
		boardRect: measureBoardAnchorRect(boardRect),
		anchors,
	};
	board.handleBoardAnchorsChange(boardAnchorSnapshot);
}

function toBoardLocalRect(
	anchorRect: BoardAnchorRect,
	boardRect: BoardAnchorRect,
): BoardLocalRect {
	return {
		x: anchorRect.left - boardRect.left,
		y: anchorRect.top - boardRect.top,
		width: anchorRect.width,
		height: anchorRect.height,
		centerX: anchorRect.centerX - boardRect.left,
		centerY: anchorRect.centerY - boardRect.top,
	};
}

function resolveBoardLocalPoint(
	clientX: number,
	clientY: number,
): PointerPosition | null {
	const boardRect = boardAnchorSnapshot?.boardRect;
	if (!boardRect) {
		return null;
	}

	return {
		x: clientX - boardRect.left,
		y: clientY - boardRect.top,
	};
}

function resolveCardAnchorLocalRect(
	card: LorcanaCardSnapshot,
): BoardLocalRect | null {
	const boardRect = boardAnchorSnapshot?.boardRect;
	const anchorRect =
		boardAnchorSnapshot?.anchors[
			createCardAnchorId(card.ownerSide, card.zoneId, card.cardId)
		];
	if (!boardRect || !anchorRect) {
		return null;
	}

	return toBoardLocalRect(anchorRect, boardRect);
}

function handleBoardPointerMove(event: PointerEvent): void {
	if (!isChallengeAimOverlayVisible) {
		return;
	}

	challengePointerClientPosition = {
		x: event.clientX,
		y: event.clientY,
	};
}

function handleBoardPointerLeave(): void {
	challengePointerClientPosition = null;
}

function formatInkSummary(playerSide: LorcanaPlayerSide): string {
	const summary = board.getPlayerSummary(playerSide);
	if (!summary) {
		return "0/0";
	}

	return `${summary.availableInk ?? 0}/${summary.inkwellCount}`;
}

$effect(() => {
	if (!boardSnapshot || !tabletopRef || !boardRef) {
		return;
	}

	scheduleAnchorMeasurement();
});

$effect(() => {
	if (!tabletopRef || !boardRef) {
		return;
	}

	const resizeObserver =
		typeof ResizeObserver === "undefined"
			? null
			: new ResizeObserver(() => {
					scheduleAnchorMeasurement();
				});
	const syncedScrollContainers = Array.from(
		tabletopRef.querySelectorAll<HTMLElement>("[data-board-scroll-sync]"),
	);

	resizeObserver?.observe(tabletopRef);
	resizeObserver?.observe(boardRef);
	if (boardScrollRef) {
		resizeObserver?.observe(boardScrollRef);
		boardScrollRef.addEventListener(
			"scroll",
			scheduleAnchorMeasurement,
			boardScrollListenerOptions,
		);
	}
	for (const scrollContainer of syncedScrollContainers) {
		scrollContainer.addEventListener(
			"scroll",
			scheduleAnchorMeasurement,
			boardScrollListenerOptions,
		);
	}
	window.addEventListener("resize", scheduleAnchorMeasurement);

	return () => {
		resizeObserver?.disconnect();
		boardScrollRef?.removeEventListener(
			"scroll",
			scheduleAnchorMeasurement,
			boardScrollListenerOptions,
		);
		for (const scrollContainer of syncedScrollContainers) {
			scrollContainer.removeEventListener(
				"scroll",
				scheduleAnchorMeasurement,
				boardScrollListenerOptions,
			);
		}
		window.removeEventListener("resize", scheduleAnchorMeasurement);
	};
});

$effect(() => {
	if (isChallengeAimOverlayVisible) {
		return;
	}

	challengePointerClientPosition = null;
});

$effect(() => {
	if (availableMovesSelectionState) {
		inlineMoveChoices = null;
	}
});

$effect(() => {
	if (!targetSelectionState) {
		userForcedTargetDialogOpen = false;
	}
});

$effect(() => {
	const sessionKey = activeTargetDialogSessionKey;
	if (!sessionKey) {
		targetSelectionDialogOpen = false;
		dismissedTargetDialogSessionKey = null;
		return;
	}

	targetSelectionDialogOpen = shouldAutoOpenTargetSelectionModal(
		sessionKey,
		dismissedTargetDialogSessionKey,
	);
});

$effect(() => {
	if (!inlineMoveChoices) {
		return;
	}

	const inlineChoices = inlineMoveChoices;
	const matchesCategory = moveCategorySummaries.some(
		(summary) => summary.categoryId === inlineChoices.categoryId,
	);
	if (!matchesCategory) {
		inlineMoveChoices = null;
	}
});

$effect(() => {
	if (localMoveSubmissionCount === lastLocalMoveSubmissionCount) {
		return;
	}

	lastLocalMoveSubmissionCount = localMoveSubmissionCount;
	handleLocalMoveSubmitted();
});

$effect(() => {
	if (priorityNudgeTimerRef.current) {
		clearTimeout(priorityNudgeTimerRef.current);
		priorityNudgeTimerRef.current = null;
	}

	priorityNudgeVisible = false;

	if (!priorityNudgeArmed || dismissedPriorityNudgeWindowKey === priorityNudgeWindowKey) {
		return;
	}

	priorityNudgeTimerRef.current = setTimeout(() => {
		priorityNudgeVisible = true;
		priorityNudgeTimerRef.current = null;
	}, PRIORITY_NUDGE_DELAY_MS);

	return () => {
		if (priorityNudgeTimerRef.current) {
			clearTimeout(priorityNudgeTimerRef.current);
			priorityNudgeTimerRef.current = null;
		}
	};
});

$effect(() => {
	if (!isMobileLayout) {
		sidebar.activePlayerGuidanceController.remove(
			MOBILE_EXPANDED_MOVES_GUIDANCE_ID,
		);
		return;
	}

	if (!inlineMoveChoices) {
		sidebar.activePlayerGuidanceController.remove(
			MOBILE_EXPANDED_MOVES_GUIDANCE_ID,
		);
		return;
	}

	sidebar.activePlayerGuidanceController.upsert({
		id: MOBILE_EXPANDED_MOVES_GUIDANCE_ID,
		message: m["sim.guidance.secondLayer.chooseCategoryAction"]({
			category: inlineMoveChoices.label,
		}),
		actions: [
			{
				id: "mobile-expanded-moves-back",
				label: m["sim.actions.back"]({}),
				onClick: handleBackInlineMoveChoices,
			},
			...inlineMoveChoices.moves.map((move) => ({
				id: `mobile-expanded-moves:${move.id}`,
				label: move.label,
				onClick: () => handleExecuteInlineMoveChoice(move),
			})),
		],
		mode: "default",
	});

	return () => {
		sidebar.activePlayerGuidanceController.remove(
			MOBILE_EXPANDED_MOVES_GUIDANCE_ID,
		);
	};
});

$effect(() => {
	if (!isMobileLayout) {
		return;
	}

	if (!handTuckState.playerOne && !handTuckState.playerTwo) {
		return;
	}

	handTuckState = {
		playerOne: false,
		playerTwo: false,
	};
});
</script>

<div
  class="tabletop-container w-full h-full relative"
  data-layout-mode={layoutMode}
  data-accessible-controls={accessibleMobileControls ? "true" : undefined}
  role="presentation"
  bind:this={tabletopRef}
  onpointerdown={handleTabletopPointerDown}
  style:--quest-rotation-duration="{questRotationDurationMs}ms"
>
  <PendingEffectsPopover
    items={pendingEffectsPopoverItems}
    bind:open={pendingEffectsOpen}
    canOpenTargetModal={canOpenTargetModal}
    onOpenTargetModal={openTargetSelectionDialog}
    initialDockPosition={isMobileLayout ? "top" : "middle"}
    hasActiveOverlay={hasActiveOverlay}
  />

  {#if dialogTargetState}
    <CardTargetDialog
      bind:open={targetSelectionDialogOpen}
      playerSide={ownerSide ?? "playerOne"}
      viewerSide={ownerSide}
      cards={targetSelectionDialogCards}
      selectable={true}
      players={targetSelectionDialogPlayers}
      selectedCardIds={selectedTargetCardIds}
      entryModeChoice={dialogTargetState.playCardEntryModeChoice}
      canConfirm={dialogTargetState.canConfirm}
      titleText={targetSelectionDialogTitle}
      descriptionText={targetSelectionDialogDescription}
      footerDeclineLabel={dialogTargetState.declineLabel}
      selectionSummaryText={`${selectedTargetCount} selected`}
      onSelectCard={handleTargetSelectionDialogCard}
      onSelectPlayer={sidebar.handleAvailableMovesSelectionPlayer}
      onSelectEntryMode={sidebar.selectResolutionEnterPlayExerted}
      onConfirm={sidebar.confirmActionSelection}
      onDecline={dialogTargetState.canDecline
        ? sidebar.rejectActiveResolutionSelection
        : undefined}
      onCancel={() => {
        if (dialogTargetState?.canDecline) {
          sidebar.rejectActiveResolutionSelection();
        } else {
          userForcedTargetDialogOpen = false;
          dismissedTargetDialogSessionKey = activeTargetDialogSessionKey;
          targetSelectionDialogOpen = false;
        }
      }}
    />
  {/if}

  {#if resolutionTargetOverlayState && interactionView}
    <ResolutionTargetOverlay
      view={interactionView}
      cardSnapshotsById={board.cardSnapshotsById}
      viewerSide={ownerSide}
      amountSelection={resolutionTargetOverlayState?.amountSelection}
      onSelectCard={sidebar.handleAvailableMovesSelectionCard}
      onSelectSlot={sidebar.selectResolutionTargetSlot}
      onAmountChange={sidebar.updateResolutionSelectedAmount}
      onConfirm={sidebar.confirmActionSelection}
      onDismiss={sidebar.cancelActionSelectionSession}
    />
  {/if}

  {#if scrySelectionState && interactionView}
    <ScryResolutionOverlay
      view={interactionView}
      cardSnapshotsById={board.cardSnapshotsById}
      viewerSide={ownerSide}
      bodyguardEntryMode={sidebar.scryBodyguardEntryMode}
      onAssignCard={sidebar.handleAvailableMovesScryAssignment}
      onReorderCard={sidebar.handleAvailableMovesScryReorder}
      onSelectBodyguardEntryMode={sidebar.selectResolutionEnterPlayExerted}
      onConfirm={sidebar.confirmActionSelection}
      onDismiss={sidebar.cancelActionSelectionSession}
    />
  {/if}

  {#if choiceSelectionState && interactionView}
    <ChoiceResolutionOverlay
      view={interactionView}
      sourceCard={choiceSourceCard}
      targetCard={choiceFocusCard}
      selectedChoiceIndex={selectedChoiceIndex}
      onSelectChoice={handleChoiceInteraction}
      onConfirm={sidebar.confirmActionSelection}
      onDismiss={sidebar.cancelActionSelectionSession}
    />
  {/if}

  <div class="tabletop-layout">
    {#if isMobileLayout}
      <div class="chrome-slot chrome-slot--menubar chrome-slot--topbar">
        <MobilePlayerMenubar
          seat="top"
          player={{
            label: topPlayerLabel,
            displayName: topPlayerDisplayName,
            subscriptionTier: topPlayerSubscriptionTier,
            bracketId: topPlayerBracketId,
            mmr: topPlayerMmr,
            isMobile: topPlayerIsMobile,
            side: topSide,
            summary: topSummary,
            isActive: activeSide === topSide,
            isTurnPlayer: topIsTurnPlayer,
            hasPriority: topHasPriority,
          }}
          timer={topSummary?.timer}
          logCount={moveLogEntries.length}
          selectedCard={selectedCard}
          selectedCardPlayable={selectedCardPlayable}
          {supportReminderText}
          bind:supportReminderOpen
          onOpenSettings={openPlayerSettings}
          onOpenSupport={onOpenSupportDialog}
          onDismissSupportReminder={onDismissSupportReminder}
          onOpenLog={() => onOpenCompactPanels?.("log")}
          onOpenCardPreview={openCompactPreview}
          onReportPlayer={handleMobileReportPlayer}
          canRequestBoardStateCorrection={canRequestBoardStateCorrection}
          isCorrectionActive={manualModeEnabled}
          onRequestBoardStateCorrection={handleRequestBoardStateCorrection}
          bugReportContext={bugReportContext}
          {matchContext}
          ownerSide={board.ownerSide}
        />
      </div>
    {/if}

    <div
      class:chrome-slot={true}
      class:chrome-slot--hand={true}
      class:chrome-slot--top={true}
      class:chrome-slot--mobile={isMobileLayout}
      class:chrome-slot--desktop={!isMobileLayout}
      class:chrome-slot--opponent-hand={hasOwnedView}
      class:chrome-slot--tucked={isTopHandTucked}
      data-hand-shell-side={topSide}
      data-hand-tucked={isTopHandTucked}
    >
      <div
        class="seat-hand-anchor seat-hand-anchor--top"
        data-board-anchor-id={createSeatHandAnchorId(topSide)}
        aria-hidden="true"
      ></div>
      <HandZone
        {layoutMode}
        playerSide={topSide}
        seat={topSeat}
        isOpponent={hasOwnedView}
        hotkeyBindings={opponentHandHotkeys}
      />
    </div>

    {#if !isMobileLayout}
      <button
        type="button"
        class="desktop-hand-toggle desktop-hand-toggle--top"
        class:desktop-hand-toggle--visible={isTopHandTucked}
        aria-label={isTopHandTucked ? m["sim.hand.show"]({}) : m["sim.hand.hide"]({})}
        aria-pressed={isTopHandTucked}
        data-testid={`hand-tuck-toggle-${topSide}`}
        onclick={() => toggleHandTucked(topSide)}
      >
        <span class="desktop-hand-toggle__label">
          {isTopHandTucked ? m["sim.hand.show"]({}) : m["sim.hand.hide"]({})}
        </span>
        {#if isTopHandTucked}
          <ChevronDownIcon class="size-4" />
        {:else}
          <ChevronUpIcon class="size-4" />
        {/if}
      </button>
    {/if}

    <div
      class="board-scroll-area overflow-hidden"
      class:board-scroll-area--mobile={isMobileLayout}
      bind:this={boardScrollRef}
    >
      <div
        class="tabletop-board relative flex h-full w-full min-w-0"
        bind:this={boardRef}
        role="presentation"
        onpointermove={handleBoardPointerMove}
        onpointerleave={handleBoardPointerLeave}
        onclick={() => { if (simulatorCardContext.isInspectOpen) simulatorCardContext.closeCardInspect(); }}
      >
        <div class="board-center-anchor-region" aria-hidden="true">
          <div
            class="board-center-anchor"
            data-board-anchor-id={BOARD_CENTER_ANCHOR_ID}
          ></div>
        </div>

        <div class="board-lanes flex flex-1 flex-col gap-1 min-w-0 z-[1] overflow-hidden">
          <SeatLane
            {layoutMode}
            playerSide={topSide}
            seat={topSeat}
            isOpponent={hasOwnedView}
            isTurnPlayer={topIsTurnPlayer}
            hasPriority={topHasPriority}
            lore={topSummary?.lore ?? 0}
            seatPosition="top"
            playHotkeyBindings={opponentPlayHotkeys}
            isPlayerEffectTarget={board.activePlayerEffectTargets().has(topSide)}
            isDisconnected={isOpponentDisconnected}
            isTimedOut={isOpponentTimedOut}
            onDiscardClick={() => board.handleDiscardClick(topSide)}
            onInkwellClick={() => board.handleInkwellClick(topSide)}
            onReportOpponent={onReportOpponent ?? undefined}
            onLocalMoveSubmitted={handleLocalMoveSubmitted}
            {canReportOpponent}
          >
            {#snippet playerIdentity()}
              <PlayerIdentityStrip
                displayName={topPlayerDisplayName}
                bracketId={topPlayerBracketId}
                mmr={topPlayerMmr}
                isMobile={topPlayerIsMobile}
                compact
              />
            {/snippet}
            {#snippet timeoutOverlay()}
              {#if opponentClockView && (canSkipOpponent || canDropOpponent)}
                <TimedOutPlayerOverlay
                  canSkip={canSkipOpponent}
                  canDrop={canDropOpponent}
                  isSpectator={viewerMode === "spectator"}
                  onSkip={() => { skipConfirmOpen = true; }}
                  onDrop={() => { dropConfirmOpen = true; }}
                />
              {/if}
            {/snippet}
            {#snippet disconnectOverlay()}
              {#if opponentPresence}
                <DisconnectedPlayerOverlay
                  variant="opponent"
                  secondsRemaining={opponentPresence.secondsRemaining}
                  canDrop={opponentPresence.canDrop}
                  isSpectator={viewerMode === "spectator"}
                  onDrop={onDropOpponent ?? undefined}
                />
              {/if}
            {/snippet}
          </SeatLane>

          {#if boardOverlay}
            <div class="board-overlay-slot">
              {@render boardOverlay()}
            </div>
          {/if}

          <SeatLane
            {layoutMode}
            playerSide={bottomSide}
            seat={bottomSeat}
            isOpponent={false}
            isTurnPlayer={bottomIsTurnPlayer}
            hasPriority={bottomHasPriority}
            lore={bottomSummary?.lore ?? 0}
            seatPosition="bottom"
            playHotkeyBindings={ownedPlayHotkeys}
            isPlayerEffectTarget={board.activePlayerEffectTargets().has(bottomSide)}
            isDisconnected={isSelfDisconnected || isUnauthenticatedPlayer}
            onDiscardClick={() => board.handleDiscardClick(bottomSide)}
            onInkwellClick={() => board.handleInkwellClick(bottomSide)}
            onLocalMoveSubmitted={handleLocalMoveSubmitted}
          >
            {#snippet playerIdentity()}
              <PlayerIdentityStrip
                displayName={bottomPlayerDisplayName}
                bracketId={bottomPlayerBracketId}
                mmr={bottomPlayerMmr}
                isMobile={bottomPlayerIsMobile}
                compact
              />
            {/snippet}
            {#snippet disconnectOverlay()}
              {#if isUnauthenticatedPlayer}
                <UnauthenticatedPlayerOverlay />
              {:else}
                <DisconnectedPlayerOverlay variant="self" isServerDeploy={serverInitiatedClose} />
              {/if}
            {/snippet}
          </SeatLane>
        </div>

        <ChallengeAimOverlay
          width={challengeBoardSize.width}
          height={challengeBoardSize.height}
          sourceRect={challengeSourceAnchorRect}
          targetPoint={challengeTargetPoint}
          lockedTargetRect={lockedChallengeTargetRect}
          preview={challengePreview}
        />
        <BoardAnimationLayer />
        <QuestAnimationLayer />
        <CardEffectAnimationLayer />
        <ChallengeAnimationLayer />
        <ActionAnimationLayer />
        <OverlayAnnouncementLayer />
      </div>
    </div>

    <div
      class:chrome-slot={true}
      class:chrome-slot--hand={true}
      class:chrome-slot--bottom={true}
      class:chrome-slot--mobile={isMobileLayout}
      class:chrome-slot--desktop={!isMobileLayout}
      class:chrome-slot--tucked={isBottomHandTucked}
      data-hand-shell-side={bottomSide}
      data-hand-tucked={isBottomHandTucked}
    >
      <div
        class="seat-hand-anchor seat-hand-anchor--bottom"
        data-board-anchor-id={createSeatHandAnchorId(bottomSide)}
        aria-hidden="true"
      ></div>
      <HandZone
        {layoutMode}
        playerSide={bottomSide}
        seat={bottomSeat}
        isOpponent={false}
        hotkeyBindings={ownedHandHotkeys}
      />
    </div>

    {#if !isMobileLayout}
      <button
        type="button"
        class="desktop-hand-toggle desktop-hand-toggle--bottom"
        class:desktop-hand-toggle--visible={isBottomHandTucked}
        aria-label={isBottomHandTucked ? m["sim.hand.show"]({}) : m["sim.hand.hide"]({})}
        aria-pressed={isBottomHandTucked}
        data-testid={`hand-tuck-toggle-${bottomSide}`}
        onclick={() => toggleHandTucked(bottomSide)}
      >
        <span class="desktop-hand-toggle__label">
          {isBottomHandTucked ? m["sim.hand.show"]({}) : m["sim.hand.hide"]({})}
        </span>
        {#if isBottomHandTucked}
          <ChevronUpIcon class="size-4" />
        {:else}
          <ChevronDownIcon class="size-4" />
        {/if}
      </button>
    {/if}

    {#if isMobileLayout}
      <div class="chrome-slot chrome-slot--menubar chrome-slot--bottombar">
        <MobilePlayerMenubar
          seat="bottom"
          player={{
            label: bottomPlayerLabel,
            displayName: bottomPlayerDisplayName,
            subscriptionTier: bottomPlayerSubscriptionTier,
            bracketId: bottomPlayerBracketId,
            mmr: bottomPlayerMmr,
            isMobile: bottomPlayerIsMobile,
            side: bottomSide,
            summary: bottomSummary,
            isActive: activeSide === bottomSide,
            isTurnPlayer: bottomIsTurnPlayer,
            hasPriority: bottomHasPriority,
          }}
          actionCount={moveCategoryCount}
          moveSummaries={moveCategorySummaries}
          activeMoveCategoryId={activeMobileMoveCategoryId}
          timer={bottomSummary?.timer}
          isOwnClock={hasOwnedView}
          {questAllCount}
          {questAllLore}
          armedDirectCategoryId={pendingDirectMoveCategoryId}
          pendingCount={pendingEffectsCount}
          {hasPendingEffects}
          {pendingEffectsOpen}
          logCount={moveLogEntries.length}
          {canConcede}
          canRequestBoardStateCorrection={canRequestBoardStateCorrection}
          isCorrectionActive={manualModeEnabled}
          onRequestBoardStateCorrection={handleRequestBoardStateCorrection}
          onOpenMoves={() => onOpenCompactPanels?.("moves")}
          onExecuteMoveCategory={handleMobileMoveCategory}
          onOpenLog={() => onOpenCompactPanels?.("log")}
          onOpenSettings={openPlayerSettings}
          onOpenSupport={onOpenSupportDialog}
          onOpenFeedback={onOpenFeedbackDialog}
          onOpenBugReport={onOpenBugReportDialog}
          onConcede={handleMobileConcede}
          onOpenPendingEffects={handleAdvancePendingEffects}
          bugReportContext={bugReportContext}
          {isPostGame}
          {matchContext}
          ownerSide={board.ownerSide}
          onNextGame={onNextGame ?? undefined}
          onReturnToMatchmaking={onReturnToMatchmaking ?? undefined}
        />
      </div>
    {/if}
  </div>

  {#if !isMobileLayout && hasOwnedView && bottomSummary}
    <TurnActionRail
      timer={activeTurnTimer}
      timerLabel={activeTurnTimerLabel}
      isOwnClock={!(topSummary?.timer?.isRunning) && hasOwnedView}
      {canPassTurn}
      armedCategoryId={pendingDirectMoveCategoryId}
      onPassTurn={() => onConfirmableDirectMoveCategory?.("pass-turn", "pointer")}
    />
  {/if}

  {#if priorityNudgeVisible}
    <PriorityNudge
      {canPassTurn}
      onSendThinking={sendPriorityThinkingPreset}
      onPassTurn={handlePriorityNudgePassTurn}
      onDismiss={dismissPriorityNudge}
    />
  {/if}

  {#if !hasActiveOverlay}
    <ActivePlayerGuidance
      items={activePlayerGuidance}
      anchor={guidanceAnchor}
      isBottomHandExpanded={!isBottomHandTucked && !isMobileLayout}
      isTopHandExpanded={!isTopHandTucked && !isMobileLayout}
      onToggleAnchor={toggleGuidancePosition}
      canOpenTargetModal={canOpenTargetModal}
      onOpenTargetModal={openTargetSelectionDialog}
      onAmountChange={sidebar.updateResolutionSelectedAmount}
    />
  {/if}

  <DiscardPileDialog
    bind:open={() => board.isDiscardDialogOpen, (open) => board.setDiscardDialogOpen(open)}
    cards={discardCards}
    playerSide={board.discardDialogSide ?? "playerOne"}
    viewerSide={ownerSide}
    playableCardIds={board.playableHandCardIds}
    target={board.discardTarget}
  />

  <InkwellDialog
    bind:open={() => board.isInkwellDialogOpen, (open) => board.setInkwellDialogOpen(open)}
    cards={inkwellCards}
    playerSide={board.inkwellDialogSide ?? "playerOne"}
    viewerSide={ownerSide}
    target={board.inkwellTarget}
  />

  <!-- Skip opponent turn confirmation -->
  <Dialog.Root bind:open={skipConfirmOpen}>
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content class="max-w-sm">
        <Dialog.Header>
          <Dialog.Title>{m["sim.timeout.skip.title"]({})}</Dialog.Title>
          <Dialog.Description>
            {m["sim.timeout.skip.description"]({})}
          </Dialog.Description>
        </Dialog.Header>
        <p class="text-muted-foreground text-xs italic">
          {m["sim.timeout.skip.note"]({})}
        </p>
        <Dialog.Footer>
          <Dialog.Close>
            <Button variant="outline" size="sm">{m["sim.actions.cancel"]({})}</Button>
          </Dialog.Close>
          <Button size="sm" onclick={() => { skipConfirmOpen = false; onSkipOpponent?.(); }}>
            {m["sim.timeout.skip.confirm"]({})}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>

  <!-- Drop opponent confirmation -->
  <Dialog.Root bind:open={dropConfirmOpen}>
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content class="max-w-sm">
        <Dialog.Header>
          <Dialog.Title>{m["sim.timeout.drop.title"]({})}</Dialog.Title>
          <Dialog.Description>
            {m["sim.timeout.drop.description"]({})}
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close>
            <Button variant="outline" size="sm">{m["sim.actions.cancel"]({})}</Button>
          </Dialog.Close>
          <Button variant="destructive" size="sm" onclick={() => { dropConfirmOpen = false; onDropOpponent?.(); }}>
            {m["sim.timeout.drop.confirm"]({})}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</div>

<style>
  .tabletop-container {
    --hand-guidance-offset: 3rem;
    --hand-guidance-clearance: 1.65rem;
    --top-hand-screen-offset: -2rem;
    --bottom-hand-screen-offset: 1rem;
    --hand-tuck-peek: 1.5rem;
    --desktop-footer-gutter: 0px;
    --desktop-footer-left-reserve: 0px;
    --desktop-footer-right-reserve: 0px;
    --desktop-hand-overscan: 0px;
    /* hand-zone-height = card height (122px / 0.9582) */
    --hand-zone-height: calc(122px / 0.9582);
    --hand-tuck-distance: calc(var(--hand-zone-height) - var(--hand-tuck-peek));
    /* overflow: clip (not hidden) prevents the browser from auto-scrolling this
       container when a hand-zone card receives focus. overflow:hidden creates a
       scroll container that the browser can scroll to reveal out-of-view elements
       (e.g. the partially-hidden opponent hand at top:-2rem). overflow:clip clips
       identically but is NOT scrollable by any means. */
    overflow: clip;
    background: radial-gradient(ellipse at 50% 0%, #1a2744 0%, #0f1720 60%, #080c12 100%);
  }

  .tabletop-layout {
    --sim-play-card-width: 180px;
    --sim-hand-card-width: 122px;
    --sim-side-zone-card-width: 50px;
    --mobile-menubar-height: 3.15rem;
    --mobile-hand-height: 3.8rem;

    margin: 0;
    padding: 0;
    container-type: size;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0;
    min-height: 100%;
    height: 100%;
    min-width: 0;
  }

  .chrome-slot {
    position: relative;
    z-index: 30;
    flex-shrink: 0;
  }

  .chrome-slot--menubar {
    pointer-events: auto;
  }

  .chrome-slot--topbar {
    height: auto;
    flex: 0 0 auto;
    overflow: hidden;
    margin-bottom: 0;
  }

  .chrome-slot--bottombar {
    height: auto;
    flex: 0 0 auto;
    overflow: hidden;
    margin-top: 0;
  }

  .chrome-slot--hand {
    display: flex;
    justify-content: center;
    min-width: 0;
    pointer-events: none;
  }

  .chrome-slot--mobile.chrome-slot--hand {
    height: var(--mobile-hand-height);
    flex: 0 0 var(--mobile-hand-height);
    overflow: hidden;
    border-radius: 0;
    border: 1px solid rgba(125, 211, 252, 0.14);
    border-left: none;
    border-right: none;
    background: linear-gradient(180deg, rgba(3, 12, 26, 0.92), rgba(7, 22, 41, 0.88));
    box-shadow: 0 14px 32px rgba(2, 6, 23, 0.26);
  }

  .chrome-slot--mobile.chrome-slot--opponent-hand {
    height: calc(var(--mobile-hand-height) - 0.95rem);
    flex-basis: calc(var(--mobile-hand-height) - 0.95rem);
  }

  .chrome-slot--desktop.chrome-slot--hand {
    position: absolute;
    left: 0.45rem;
    right: 0.45rem;
    z-index: 2;
    pointer-events: none;
    transition: transform 110ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform;
  }

  .chrome-slot--desktop.chrome-slot--top {
    top: calc(0.45rem + var(--top-hand-screen-offset));
  }

  .chrome-slot--desktop.chrome-slot--bottom {
    bottom: calc(
      0.45rem + env(safe-area-inset-bottom) - var(--bottom-hand-screen-offset) - var(--desktop-hand-overscan)
    );
  }

  .chrome-slot--desktop.chrome-slot--top.chrome-slot--tucked {
    transform: translateY(calc(var(--hand-tuck-distance) * -1));
  }

  .chrome-slot--desktop.chrome-slot--bottom.chrome-slot--tucked {
    transform: translateY(var(--hand-tuck-distance));
  }

  .desktop-hand-toggle {
    position: absolute;
    left: 50%;
    z-index: 60;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    width: max-content;
    min-width: max-content;
    height: auto;
    padding: 0.36rem 0.82rem;
    border: 1px solid rgba(147, 197, 253, 0.48);
    border-radius: 999px;
    background:
      linear-gradient(180deg, rgba(18, 32, 57, 0.98), rgba(8, 18, 31, 0.96)),
      rgba(7, 18, 31, 0.96);
    box-shadow:
      0 10px 24px rgba(7, 18, 31, 0.42),
      0 0 0 1px rgba(191, 219, 254, 0.12) inset;
    color: rgba(241, 245, 249, 0.99);
    line-height: 1;
    white-space: nowrap;
    transform: translateX(-50%);
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 160ms ease,
      transform 160ms ease,
      border-color 160ms ease,
      box-shadow 160ms ease,
      background 160ms ease;
  }

  .desktop-hand-toggle__label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .desktop-hand-toggle--top {
    top: 0.35rem;
  }


  .desktop-hand-toggle--visible {
    opacity: 1;
    pointer-events: auto;
  }

  .tabletop-board {
    container-type: size;
    position: relative;
    min-width: 100%;
    min-height: 0;
    height: 100%;
    isolation: isolate;
    background: linear-gradient(180deg, #264a73 0%, #1e3a5f 50%, #1a3252 100%);
  }

  .board-scroll-area {
    position: relative;
    flex: 1;
    min-height: 0;
    min-width: 0;
    display: flex;
    overflow: hidden;
  }

  .board-scroll-area--mobile {
    margin-top: -1px;
    margin-bottom: -1px;
    border: 1px solid rgba(125, 211, 252, 0.14);
    border-left: none;
    border-right: none;
    box-shadow:
      0 22px 60px rgba(0, 0, 0, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    border-radius: 0;
  }

  .board-scroll-area--mobile > .tabletop-board {
    border-radius: 0;
  }

  .board-lanes {
    position: relative;
    min-height: 0;
    height: 100%;
    padding: 0;
  }

  .tabletop-container[data-layout-mode="mobile"] .board-lanes {
    gap: 0;
  }

  .board-lanes :global(.seat-lane) {
    min-height: 0;
  }

  .seat-hand-anchor,
  .board-center-anchor-region,
  .board-center-anchor {
    position: absolute;
    pointer-events: none;
    opacity: 0;
  }

  .seat-hand-anchor {
    width: 90px;
    height: 118px;
    left: 50%;
    transform: translateX(-50%);
  }

  .seat-hand-anchor--top {
    top: 0;
  }

  .seat-hand-anchor--bottom {
    bottom: 0;
  }

  .board-overlay-slot {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    pointer-events: none;
  }

  .board-overlay-slot > :global(*) {
    pointer-events: auto;
  }

  .board-center-anchor-region {
    inset: 0;
    z-index: 0;
  }

  .board-center-anchor {
    width: 200px;
    height: 280px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .tabletop-container :global(.card-face:not(.card-face--exerted)) {
    transform: none !important;
  }

  .tabletop-container :global(.card-face.card-face--exerted),
  .tabletop-container :global(.card-back.card-back--exerted) {
    transform: rotate(20deg) scale(0.96) !important;
    transform-origin: center center !important;
  }

  .tabletop-container :global([data-zone-id="play"] .card-face),
  .tabletop-container :global([data-zone-id="play"] .card-back) {
    transition: transform var(--quest-rotation-duration, 200ms) cubic-bezier(0.4, 0, 0.2, 1);
  }

  .tabletop-container :global(.ink-segment--available),
  .tabletop-container :global(.ink-drop),
  .tabletop-container :global(.drop-indicator),
  .tabletop-container :global(.playable-indicator) {
    animation: none !important;
  }

  @media (max-width: 1239px) {
    .tabletop-container {
      --hand-guidance-offset: 2.5rem;
      --hand-guidance-clearance: 1.05rem;
    }
  }

  @media (max-width: 767px) {
    .tabletop-container {
      --hand-guidance-offset: 2.2rem;
      --hand-guidance-clearance: 0.8rem;
    }

    .tabletop-layout {
      --mobile-menubar-height: 2.7rem;
      --mobile-hand-height: 3.55rem;
    }

    .board-lanes {
      padding: 0;
    }
  }

  /* Accessible controls: restore larger touch targets on mobile */
  .tabletop-container[data-accessible-controls="true"] .tabletop-layout {
    --mobile-menubar-height: 4.6rem;
    --mobile-hand-height: 5.5rem;
  }

  .tabletop-container[data-accessible-controls="true"] .chrome-slot--topbar {
    margin-bottom: 0.2rem;
  }

  .tabletop-container[data-accessible-controls="true"] .chrome-slot--bottombar {
    margin-top: 0.2rem;
  }

  .tabletop-container[data-accessible-controls="true"] .chrome-slot--mobile.chrome-slot--hand {
    border-radius: 1rem;
    border: 1px solid rgba(125, 211, 252, 0.14);
  }

  .tabletop-container[data-accessible-controls="true"] .chrome-slot--mobile.chrome-slot--top {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .tabletop-container[data-accessible-controls="true"] .chrome-slot--mobile.chrome-slot--bottom {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .tabletop-container[data-accessible-controls="true"][data-layout-mode="mobile"] :global(.seat-lane) {
    gap: 0.38rem;
    padding: 0.5rem 0.4rem 0.42rem;
  }

  .tabletop-container[data-accessible-controls="true"][data-layout-mode="mobile"] :global(.bar-zones) {
    --bar-row-card-height: 44px;
    height: 74px;
    min-height: 74px;
    max-height: 74px;
    padding: 0.25rem;
    gap: 0.25rem;
  }

  .tabletop-container[data-accessible-controls="true"][data-layout-mode="mobile"] .board-lanes {
    gap: 0.25rem;
  }

  @media (max-width: 767px) {
    .tabletop-container[data-accessible-controls="true"] .tabletop-layout {
      --mobile-menubar-height: 4.35rem;
      --mobile-hand-height: 5rem;
    }
  }

  @media (min-width: 1240px) {
    .tabletop-container {
      --desktop-footer-gutter: clamp(4rem, 7vh, 5.75rem);
      --desktop-footer-left-reserve: clamp(10rem, 18vw, 12rem);
      --desktop-footer-right-reserve: clamp(13rem, 22vw, 15rem);
      --desktop-hand-overscan: calc(var(--hand-zone-height) * 0.20);
    }

    .tabletop-layout {
      --sim-play-card-width: clamp(200px, min(36cqh, 24cqw), 340px);
      --sim-hand-card-width: clamp(104px, min(15.5cqh, 11.5cqw), 146px);
      --sim-side-zone-card-width: clamp(46px, min(8cqh, 5cqw), 72px);
      padding-bottom: calc(var(--desktop-footer-gutter) + env(safe-area-inset-bottom));
    }

    /* use max clamp value (146px) as safe upper bound for hand height */
    .tabletop-container {
      --hand-zone-height: calc(146px / 0.9582);
    }

    .chrome-slot--desktop.chrome-slot--top:hover + .desktop-hand-toggle--top,
    .desktop-hand-toggle--top:hover,
    .desktop-hand-toggle--top:focus-visible {
      opacity: 1;
      pointer-events: auto;
      border-color: rgba(147, 197, 253, 0.64);
      box-shadow:
        0 12px 26px rgba(7, 18, 31, 0.42),
        0 0 0 1px rgba(191, 219, 254, 0.16) inset;
    }

    .chrome-slot--desktop.chrome-slot--top:hover + .desktop-hand-toggle--top,
    .desktop-hand-toggle--top:hover,
    .desktop-hand-toggle--top:focus-visible {
      transform: translate(-50%, -0.1rem);
    }

  }

  @media (min-width: 1240px) and (max-width: 1439px) {
    .tabletop-container {
      --desktop-footer-left-reserve: clamp(9rem, 17vw, 10.5rem);
      --desktop-footer-right-reserve: clamp(11.5rem, 21vw, 13.25rem);
      --hand-zone-height: calc(136px / 0.9582);
      --desktop-hand-overscan: calc(var(--hand-zone-height) * 0.23);
    }

    .tabletop-layout {
      --sim-hand-card-width: clamp(98px, min(14.5cqh, 10.75cqw), 136px);
    }
  }

  @media (min-width: 1600px) {
    .tabletop-layout {
      --sim-play-card-width: clamp(240px, min(40cqh, 26cqw), 380px);
    }
  }

</style>
