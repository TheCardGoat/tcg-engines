<script lang="ts">
import { onDestroy, untrack } from "svelte";
import { X } from "@lucide/svelte";
import type {
	AvailableMovesSelectionEntry,
	AvailableMovesSelectionState,
	ExecutableMoveEntry,
	ExecutableMovePresentationCategoryId,
	LorcanaCardSnapshot,
	LorcanaPlayerSide,
	MoveCategorySummary,
	ResolutionActionView,
} from "@/features/simulator/model/contracts.js";
import type { HotkeyMode } from "@/features/simulator/context/game-context.svelte.js";
import { getMoveCategoryIcon } from "@/features/simulator/model/action-icons.js";
import { sortMoveCategories } from "@/features/simulator/model/move-presentation.js";
import { m } from "$lib/i18n/messages.js";
import type { ActivePlayerGuidanceController } from "@/features/simulator/model/active-player-guidance.js";
import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
import NamedCardSearchInput from "@/features/simulator/panels/NamedCardSearchInput.svelte";
import CardTextToken from "@/features/simulator/panels/CardTextToken.svelte";
import ResolutionAmountControls from "@/features/simulator/panels/ResolutionAmountControls.svelte";
import HotkeyDisplay from "@/features/simulator/hotkeys/HotkeyDisplay.svelte";

const PANEL_TITLE_ID = "available-moves-panel-title";

interface AvailableMovesPanelProps {
	/** Lightweight category summaries for the category list view (cheap to derive). */
	summaries: MoveCategorySummary[];
	/**
	 * Lazy expansion callback — called only when the user clicks a category
	 * or the panel needs full moves for drill-down. This avoids eagerly computing
	 * all getMoveOptions() on every state change.
	 */
	onExpandCategory: (
		categoryId: ExecutableMovePresentationCategoryId,
	) => ExecutableMoveEntry[];
	interactiveSide?: LorcanaPlayerSide | null;
	activeSide?: LorcanaPlayerSide;
	showRawLogRegistryJson?: boolean;
	supplementalActions?: ResolutionActionView[];
	selectionState?: AvailableMovesSelectionState | null;
	activePlayerGuidance?: ActivePlayerGuidanceController;
	cardSnapshots?: Record<string, LorcanaCardSnapshot>;
	onCardHover?: (card: LorcanaCardSnapshot) => void;
	onCardLeave?: () => void;
	onStartManualMoveSelection?: (payload: {
		id: ExecutableMovePresentationCategoryId;
		label: string;
		moves: ExecutableMoveEntry[];
	}) => boolean;
	onSelectCard?: (cardId: string) => boolean;
	onSelectPlayer?: (playerId: string) => boolean;
	onSelectOption?: (moveId: string) => boolean;
	onResolutionNamedCardQueryInput?: (query: string) => void;
	onSelectNamedCard?: (cardName: string) => boolean;
	onResolutionAmountChange?: (value: number) => boolean;
	onAssignScryCard?: (cardId: string, destinationId: string) => boolean;
	onReorderScryCard?: (
		destinationId: string,
		cardId: string,
		direction: "up" | "down",
	) => boolean;
	onBackSelection?: () => void;
	onCancelSelection?: () => void;
	onConfirmSelection?: () => boolean;
	onResetManualMoveSelection?: () => void;
	onExecuteMove?: (move: ExecutableMoveEntry) => void;
	hotkeyMode?: HotkeyMode;
	compact?: boolean;
}

let {
	summaries,
	onExpandCategory,
	interactiveSide = null,
	activeSide,
	showRawLogRegistryJson = false,
	supplementalActions = [],
	selectionState = null,
	activePlayerGuidance,
	cardSnapshots = {},
	onCardHover = () => {},
	onCardLeave = () => {},
	onStartManualMoveSelection,
	onSelectCard,
	onSelectPlayer,
	onSelectOption,
	onResolutionNamedCardQueryInput,
	onSelectNamedCard,
	onResolutionAmountChange,
	onAssignScryCard,
	onReorderScryCard,
	onBackSelection,
	onCancelSelection,
	onConfirmSelection,
	onResetManualMoveSelection,
	onExecuteMove,
	hotkeyMode = "on",
	compact = false,
}: AvailableMovesPanelProps = $props();

function hasParams(params: Record<string, unknown> | undefined): boolean {
	return Boolean(params && Object.keys(params).length > 0);
}

function isConfirmationCategory(
	categoryId: ExecutableMovePresentationCategoryId,
): boolean {
	return (
		categoryId === "undo" ||
		categoryId === "pass-turn" ||
		categoryId === "concede"
	);
}

function isConfirmationMove(move: ExecutableMoveEntry): boolean {
	return isConfirmationCategory(move.presentation.categoryId);
}

function buildConfirmationKey(move: ExecutableMoveEntry): string {
	return `${move.presentation.categoryId}:${move.id}`;
}

function getMoveButtonLabel(move: ExecutableMoveEntry): string {
	if (!isAwaitingConfirmation(move)) {
		return move.presentation.kind === "targeted"
			? move.presentation.optionLabel
			: move.label;
	}

	return m["sim.actions.confirmMoveLabel"]({ label: move.label });
}

function isAwaitingConfirmation(move: ExecutableMoveEntry): boolean {
	return pendingConfirmationKey === buildConfirmationKey(move);
}

function isCategoryAwaitingConfirmation(
	categoryId: ExecutableMovePresentationCategoryId,
): boolean {
	return (
		pendingConfirmationKey !== null &&
		pendingConfirmationKey.startsWith(`${categoryId}:`)
	);
}

function handleMoveClick(move: ExecutableMoveEntry): void {
	if (isConfirmationMove(move)) {
		const confirmationKey = buildConfirmationKey(move);
		if (pendingConfirmationKey !== confirmationKey) {
			pendingConfirmationKey = confirmationKey;
			return;
		}
	}

	pendingConfirmationKey = null;
	onResetManualMoveSelection?.();
	onExecuteMove?.(move);
}

interface MoveCategoryGroup {
	id: ExecutableMovePresentationCategoryId;
	label: string;
	isDirect: boolean;
}

let selectedCategoryId = $state<ExecutableMovePresentationCategoryId | null>(
	null,
);
let pendingConfirmationKey = $state<string | null>(null);
// Lazily expanded moves for the currently selected category drill-down.
// Only populated when the user clicks a non-direct category.
let expandedCategoryMoves = $state<ExecutableMoveEntry[]>([]);

/**
 * Category list derived from lightweight summaries — no getMoveOptions() calls.
 * This is the key perf optimization: the category buttons render from summaries
 * which are O(1) to derive from AvailableMove[], while full move expansion
 * (which calls getMoveOptions() for challenge/ability/location) only happens
 * on user interaction.
 */
const moveCategoryGroups = $derived.by<MoveCategoryGroup[]>(() => {
	return sortMoveCategories(
		summaries.map((s) => ({
			id: s.categoryId,
			label: s.categoryLabel,
			isDirect: s.isDirect,
		})),
	);
});

const selectedCategory = $derived(
	selectedCategoryId
		? (moveCategoryGroups.find((group) => group.id === selectedCategoryId) ??
				null)
		: null,
);

const visibleMoves = $derived(
	selectedCategory
		? expandedCategoryMoves.map((move) => ({
				...move,
				optionLabel:
					move.presentation.kind === "targeted"
						? move.presentation.optionLabel
						: move.label,
			}))
		: [],
);

const hasSupplementalActions = $derived(supplementalActions.length > 0);
const hasMoves = $derived(summaries.length > 0);

// When summaries change (new state), close any open drill-down to prevent
// showing stale or now-illegal expanded moves from the previous state.
// Reading selectedCategoryId inside untrack avoids re-triggering
// when the user opens a drill-down.
$effect(() => {
	void summaries;
	untrack(() => {
		selectedCategoryId = null;
		expandedCategoryMoves = [];
	});
});

$effect(() => {
	if (!pendingConfirmationKey) {
		return;
	}

	// Extract the pending category from the key (format: "categoryId:moveId")
	const pendingCategoryId = pendingConfirmationKey.split(":")[0];
	const stillAvailable = summaries.some(
		(s) => s.categoryId === pendingCategoryId,
	);

	if (!stillAvailable) {
		pendingConfirmationKey = null;
	}
});

$effect(() => {
	activePlayerGuidance?.setSecondLayerCategory(
		selectionState ? null : selectedCategory ? selectedCategory.label : null,
	);
});

function handleCategoryClick(group: MoveCategoryGroup): void {
	// Lazily expand moves only when a category is clicked.
	// Direct moves (pass-turn, concede, etc.) are expanded inline to get
	// the single ExecutableMoveEntry needed for execution.
	const expanded = onExpandCategory(group.id);

	if (group.isDirect) {
		if (expanded.length > 0) {
			handleMoveClick(expanded[0]);
		}
		return;
	}

	if (
		onStartManualMoveSelection?.({
			id: group.id,
			label: group.label,
			moves: expanded,
		})
	) {
		pendingConfirmationKey = null;
		selectedCategoryId = null;
		expandedCategoryMoves = [];
		return;
	}

	pendingConfirmationKey = null;
	onResetManualMoveSelection?.();
	expandedCategoryMoves = expanded;
	selectedCategoryId = group.id;
}

function handleBackClick(): void {
	selectedCategoryId = null;
	expandedCategoryMoves = [];
	pendingConfirmationKey = null;
	onResetManualMoveSelection?.();
}

function handleSupplementalActionClick(action: ResolutionActionView): void {
	pendingConfirmationKey = null;
	onResetManualMoveSelection?.();
	action.onClick();
}

function handleNamedCardQueryInput(event: Event): void {
	onResolutionNamedCardQueryInput?.(
		(event.currentTarget as HTMLInputElement).value,
	);
}

function handleSelectionEntryClick(): void;
function handleSelectionEntryClick(selectionId: string): void;
function handleSelectionEntryClick(
	selectionId: string | undefined = undefined,
): void {
	if (!selectionState) {
		return;
	}

	if (
		selectionState.mode === "action" &&
		selectionState.phase === "choose-option"
	) {
		if (selectionId) {
			onSelectOption?.(selectionId);
		}
		return;
	}

	if (
		selectionState.mode === "resolution-choice" ||
		selectionState.mode === "resolution-optional"
	) {
		if (selectionId) {
			onSelectOption?.(selectionId);
		}
		return;
	}

	if (selectionId) {
		onSelectCard?.(selectionId);
	}
}

function getEntryCard(
	entry: AvailableMovesSelectionEntry,
): LorcanaCardSnapshot | null {
	if ((entry.kind === "card" || entry.kind === "scry-card") && entry.cardId) {
		return cardSnapshots[entry.cardId] ?? null;
	}
	return null;
}

function getStringParam(
	params: Record<string, unknown>,
	key: string,
): string | null {
	return typeof params[key] === "string" ? params[key] : null;
}

function getStringArrayParam(
	params: Record<string, unknown>,
	key: string,
): string[] | null {
	return Array.isArray(params[key]) &&
		params[key].every((value) => typeof value === "string")
		? params[key]
		: null;
}

type MoveLabelSegment =
	| { kind: "text"; text: string }
	| { kind: "card"; card: LorcanaCardSnapshot; text?: string };

function buildMoveLabelSegments(move: ExecutableMoveEntry): MoveLabelSegment[] {
	if (isAwaitingConfirmation(move)) {
		return [{ kind: "text", text: getMoveButtonLabel(move) }];
	}

	switch (move.moveId) {
		case "playCard": {
			const params = move.params as Record<string, unknown>;
			const cardId = getStringParam(params, "cardId");
			const card = cardId ? (cardSnapshots[cardId] ?? null) : null;
			if (!card) {
				return [{ kind: "text", text: getMoveButtonLabel(move) }];
			}

			const targets = getStringArrayParam(params, "targets");
			const targetCardId = targets?.[0] ?? null;
			const targetCard = targetCardId
				? (cardSnapshots[targetCardId] ?? null)
				: null;
			const cost = getStringParam(params, "cost");
			const costLabel =
				cost === "shift"
					? "Shift"
					: cost === "sing"
						? "Sing"
						: cost === "singTogether"
							? "Sing Together"
							: cost === "free"
								? "Free"
								: null;

			return [
				{ kind: "card", card },
				...(costLabel
					? [
							{
								kind: "text",
								text: ` (${costLabel})`,
							} satisfies MoveLabelSegment,
						]
					: []),
				...(targetCard
					? [
							{ kind: "text", text: " -> " } satisfies MoveLabelSegment,
							{ kind: "card", card: targetCard } satisfies MoveLabelSegment,
						]
					: []),
			];
		}
		case "putCardIntoInkwell":
		case "quest":
		case "activateAbility": {
			const params = move.params as Record<string, unknown>;
			const cardId = getStringParam(params, "cardId");
			const card = cardId ? (cardSnapshots[cardId] ?? null) : null;
			if (!card) {
				return [{ kind: "text", text: getMoveButtonLabel(move) }];
			}

			const label = getMoveButtonLabel(move);
			const suffix = label.startsWith(card.label)
				? label.slice(card.label.length)
				: "";
			return [
				{ kind: "card", card },
				...(suffix
					? ([{ kind: "text", text: suffix }] as MoveLabelSegment[])
					: []),
			];
		}
		case "challenge": {
			const params = move.params as Record<string, unknown>;
			const attackerId = getStringParam(params, "attackerId");
			const defenderId = getStringParam(params, "defenderId");
			const attacker = attackerId ? (cardSnapshots[attackerId] ?? null) : null;
			const defender = defenderId ? (cardSnapshots[defenderId] ?? null) : null;
			if (attacker && defender) {
				return [
					{ kind: "card", card: attacker },
					{ kind: "text", text: " -> " },
					{ kind: "card", card: defender },
				];
			}
			return [{ kind: "text", text: getMoveButtonLabel(move) }];
		}
		case "moveCharacterToLocation": {
			const params = move.params as Record<string, unknown>;
			const characterId = getStringParam(params, "characterId");
			const locationId = getStringParam(params, "locationId");
			const character = characterId
				? (cardSnapshots[characterId] ?? null)
				: null;
			const location = locationId ? (cardSnapshots[locationId] ?? null) : null;
			if (character && location) {
				return [
					{ kind: "card", card: character },
					{ kind: "text", text: " -> " },
					{ kind: "card", card: location },
				];
			}
			return [{ kind: "text", text: getMoveButtonLabel(move) }];
		}
		default:
			return [{ kind: "text", text: getMoveButtonLabel(move) }];
	}
}

function shouldRenderCompactCardSelection(
	state: AvailableMovesSelectionState | null,
): state is AvailableMovesSelectionState {
	if (!compact || !state || state.entries.length === 0) {
		return false;
	}

	return state.entries.every(
		(entry) => entry.kind === "card" || entry.kind === "scry-card",
	);
}

function getSelectionActionHotkey(
	action: "back" | "cancel" | "confirm",
): string {
	switch (action) {
		case "back":
			return "Backspace";
		case "cancel":
			return "Escape";
		case "confirm":
			return "Enter";
	}
}

function getMoveCategoryHotkey(
	categoryId: ExecutableMovePresentationCategoryId,
): string | null {
	if (hotkeyMode === "off") {
		return null;
	}

	if (categoryId === "pass-turn") {
		return "Space";
	}

	// Top-level categories no longer claim digit hotkeys — number row 1-0 is
	// now reserved for hand cards. Per-card action shortcuts are surfaced via
	// the card quick-menu (action-menu layer) instead.
	return null;
}

onDestroy(() => {
	activePlayerGuidance?.setSecondLayerCategory(null);
});
</script>

<section
  class="available-moves-panel"
  aria-labelledby={compact ? undefined : PANEL_TITLE_ID}
  aria-label={compact ? m["sim.actions.panel.title"]({}) : undefined}
>
  {#if !compact}
    <header class="panel-header">
      <h2 id={PANEL_TITLE_ID}>{m["sim.actions.panel.title"]({})}</h2>
    </header>
  {/if}

  {#if !interactiveSide}
    <p class="empty-state">{m["sim.actions.empty.noInteractivePlayer"]({})}</p>
  {:else if !hasSupplementalActions && activeSide && activeSide !== interactiveSide}
    <p class="empty-state">{m["sim.actions.empty.waitingTurn"]({})}</p>
  {:else if !hasSupplementalActions && !hasMoves}
    <p class="empty-state">{m["sim.actions.empty.none"]({})}</p>
  {:else}
    {#if hasSupplementalActions}
      <div class="supplemental-actions" aria-label={m["sim.actions.panel.resolutionAria"]({})}>
        {#each supplementalActions as action (action.id)}
          <button
            type="button"
            class="supplemental-action"
            class:supplemental-action--emphasis={action.emphasis === true}
            onclick={() => handleSupplementalActionClick(action)}
            aria-label={m["sim.actions.executeAria"]({ label: action.label })}
          >
            <span class="supplemental-action__label">{action.label}</span>
            {#if action.detail}
              <span class="supplemental-action__detail">{action.detail}</span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}

    {#if selectionState}
      {@const SelectionCategoryIcon = getMoveCategoryIcon(selectionState.categoryId)}
      <div class="detail-header">
        {#if selectionState.canBack}
          <button
            type="button"
            class="back-button"
            onclick={() => onBackSelection?.()}
            aria-label={m["sim.actions.backToCategories"]({})}
          >
            {m["sim.actions.back"]({})}
            {#if hotkeyMode !== "off"}
              <HotkeyDisplay hotkey={getSelectionActionHotkey("back")} />
            {/if}
          </button>
        {/if}

        <div class="detail-copy detail-copy--with-trailing-action">
          <div class="detail-title detail-title--with-icon">
            <span class="move-category-icon-shell move-category-icon-shell--detail" aria-hidden="true">
              <SelectionCategoryIcon class="move-category-icon" />
            </span>
            <p class="detail-title__text">{selectionState.title}</p>
          </div>
          {#if selectionState.mode === "resolution-scry" && selectionState.headerSubtitle}
            <p class="detail-title__subtext">{selectionState.headerSubtitle}</p>
          {/if}
          <p class="detail-message">{selectionState.message}</p>
        </div>

        {#if onCancelSelection}
          <button
            type="button"
            class="icon-action-button"
            onclick={() => onCancelSelection?.()}
            aria-label={m["sim.actions.cancel"]({})}
            title={m["sim.actions.cancel"]({})}
          >
            <X class="icon-action-button__icon" />
          </button>
        {/if}
      </div>

      {#if selectionState.mode === "action" && (selectionState.sourceLabel || selectionState.targetLabel || selectionState.selectedMoveLabel)}
        <div class="selection-summary">
          {#if selectionState.sourceLabel}
            <div class="selection-summary__row">
              <span class="selection-summary__label">{m["sim.actions.selectionSummary.source"]({})}</span>
              <span class="selection-summary__value">{selectionState.sourceLabel}</span>
            </div>
          {/if}
          {#if selectionState.targetLabel}
            <div class="selection-summary__row">
              <span class="selection-summary__label">
                {selectionState.categoryId === "sing-card"
                  ? m["sim.actions.selectionSummary.singer"]({})
                  : m["sim.actions.selectionSummary.target"]({})}
              </span>
              <span class="selection-summary__value">{selectionState.targetLabel}</span>
            </div>
          {/if}
          {#if selectionState.selectedMoveLabel && selectionState.phase !== "choose-target"}
            <div class="selection-summary__row">
              <span class="selection-summary__label">{m["sim.actions.selectionSummary.selection"]({})}</span>
              <span class="selection-summary__value">{selectionState.selectedMoveLabel}</span>
            </div>
          {/if}
        </div>
      {/if}

      {#if selectionState.mode === "resolution-name-card"}
        <NamedCardSearchInput
          query={selectionState.query}
          results={[]}
          oninput={(query) => onResolutionNamedCardQueryInput?.(query)}
          onselect={(cardName) => { onSelectNamedCard?.(cardName); }} />
      {/if}

      {#if selectionState.mode === "resolution-scry"}
        <div class="scry-layout">
          <div class="scry-card-pool">
            <p class="scry-section-title">{m["sim.actions.scry.revealedCards"]({})}</p>
            <p class="move-detail">{m["sim.actions.scry.dragHint"]({})}</p>
          </div>

          <div class="scry-destinations">
            {#each selectionState.destinations as destination (destination.id)}
              <section class="scry-destination">
                <div class="scry-destination__header">
                  <p class="scry-section-title">{destination.label}</p>
                  <p class="move-detail">{destination.detail}</p>
                </div>

                <ol class="move-list">
                  {#each destination.cards as card, index (card.id)}
                    <li class="move-item">
                      <div class="move-button move-button--static">
                        <div class="move-content">
                          <p class="move-label">{card.label}</p>
                          {#if card.detail}
                            <p class="move-detail">{card.detail}</p>
                          {/if}
                        </div>
                        {#if destination.orderingEnabled}
                          <p class="move-detail">
                            {m['sim.actions.reorder.position']({ current: index + 1, total: destination.cards.length })}
                          </p>
                        {/if}
                      </div>
                    </li>
                  {/each}
                </ol>
              </section>
            {/each}
          </div>
        </div>
      {:else if selectionState.entries.length > 0}
        {@const selectionEntries = selectionState.entries}
        {#if shouldRenderCompactCardSelection(selectionState)}
          <div class="compact-card-selection-grid">
            {#each selectionEntries as entry (entry.id)}
              {@const selectionId = entry.cardId}
              {@const entryCard = getEntryCard(entry)}
              {#if entryCard}
                <button
                  type="button"
                  class="compact-card-selection-button"
                  class:compact-card-selection-button--selected={entry.selected}
                  disabled={entry.disabled === true}
                  onmouseenter={() => onCardHover(entryCard)}
                  onmouseleave={() => onCardLeave()}
                  onfocus={() => onCardHover(entryCard)}
                  onblur={() => onCardLeave()}
                  onclick={() => {
                    if (selectionId) {
                      handleSelectionEntryClick(selectionId);
                    }
                  }}
                >
                  <LorcanaCard
                    card={entryCard}
                    isMasked={entryCard.isMasked}
                    isSelected={entry.selected}
                    size="small"
                    showHoverCard={!compact}
                    interactionMeta={{
                      cardId: entryCard.cardId,
                      ownerSide: entryCard.ownerSide,
                      zoneId: entryCard.zoneId,
                      selectionGroup: "compact-available-moves",
                      selectionMode: "single",
                      selectable: entry.disabled !== true,
                    }}
                  />
                  <span class="compact-card-selection-label">
                    <CardTextToken
                      card={entryCard}
                      text={entry.label}
                      interactive={false}
                      onHover={() => onCardHover(entryCard)}
                      onLeave={onCardLeave}
                    />
                  </span>
                  {#if entry.detail}
                    <span class="compact-card-selection-detail">{entry.detail}</span>
                  {/if}
                  {#if entry.disabled && entry.disabledReason}
                    <span class="compact-card-selection-detail compact-card-selection-detail--disabled">
                      {entry.disabledReason}
                    </span>
                  {/if}
                </button>
              {/if}
            {/each}
          </div>
        {:else}
          <ol class="move-list">
            {#each selectionEntries as entry (entry.id)}
              {@const selectionId =
                entry.kind === "card" || entry.kind === "scry-card"
                  ? entry.cardId
                  : entry.kind === "player"
                    ? entry.playerId
                    : entry.moveId}
              {@const entryCard = getEntryCard(entry)}
              <li class="move-item">
                <button
                  type="button"
                  class="move-button"
                  class:move-button--selected={entry.selected}
                  disabled={entry.disabled === true}
                  onmouseenter={() => entryCard && onCardHover(entryCard)}
                  onmouseleave={() => entryCard && onCardLeave()}
                  onfocus={() => entryCard && onCardHover(entryCard)}
                  onblur={() => entryCard && onCardLeave()}
                  onclick={() => {
                    if (entry.kind === "named-card" && entry.moveId) {
                      onSelectNamedCard?.(entry.moveId);
                      return;
                    }

                    if (entry.kind === "player" && entry.playerId) {
                      onSelectPlayer?.(entry.playerId);
                      return;
                    }

                    selectionId && handleSelectionEntryClick(selectionId);
                  }}
                >
                  {#if entryCard}
                    <p class="move-label card-label">
                      <CardTextToken
                        card={entryCard}
                        text={entry.label}
                        interactive={false}
                        onHover={() => onCardHover(entryCard)}
                        onLeave={onCardLeave}
                      />
                    </p>
                  {:else}
                    <p class="move-label">{entry.label}</p>
                  {/if}
                  {#if entry.detail}
                    <p class="move-detail">{entry.detail}</p>
                  {/if}
                  {#if entry.disabled && entry.disabledReason}
                    <p class="move-confirmation-hint">{entry.disabledReason}</p>
                  {/if}
                </button>
              </li>
            {/each}
          </ol>
        {/if}
      {/if}

      {#if selectionState.mode === "resolution-target" && selectionState.amountSelection}
        <ResolutionAmountControls
          selection={selectionState.amountSelection}
          onChange={(value) => {
            onResolutionAmountChange?.(value);
          }}
        />
      {/if}

      <div class="selection-actions">
        {#if selectionState.canCancel}
          <button
            type="button"
            class="selection-action-button"
            onclick={() => onCancelSelection?.()}
          >
            {m["sim.actions.cancel"]({})}
            {#if hotkeyMode !== "off"}
              <HotkeyDisplay hotkey={getSelectionActionHotkey("cancel")} />
            {/if}
          </button>
        {/if}
        {#if selectionState.canDecline}
          <button
            type="button"
            class="selection-action-button"
            onclick={() => onSelectOption?.("reject")}
          >
            {selectionState.declineLabel ?? m["sim.actions.label.declineEffect"]({})}
          </button>
        {/if}
        {#if selectionState.canConfirm}
          <button
            type="button"
            class="selection-action-button selection-action-button--emphasis"
            onclick={() => onConfirmSelection?.()}
          >
            {m["sim.actions.confirmMoveLabel"]({ label: selectionState.categoryLabel })}
            {#if hotkeyMode !== "off"}
              <HotkeyDisplay hotkey={getSelectionActionHotkey("confirm")} />
            {/if}
          </button>
        {/if}
      </div>
    {:else if selectedCategory}
      {@const SelectedCategoryIcon = getMoveCategoryIcon(selectedCategory.id)}
      <div class="detail-header">
        <button
          type="button"
          class="back-button"
          onclick={handleBackClick}
          aria-label={m["sim.actions.backToCategories"]({})}
        >
          {m["sim.actions.back"]({})}
          {#if hotkeyMode !== "off"}
            <HotkeyDisplay hotkey={getSelectionActionHotkey("back")} />
          {/if}
        </button>
        <div class="detail-title detail-title--with-icon">
          <span class="move-category-icon-shell move-category-icon-shell--detail" aria-hidden="true">
            <SelectedCategoryIcon class="move-category-icon" />
          </span>
          <p class="detail-title__text">{selectedCategory.label}</p>
        </div>
      </div>

      <ol class="move-list">
        {#each visibleMoves as move (move.id)}
          <li class="move-item">
            <button
              type="button"
              class:move-button--confirming={isAwaitingConfirmation(move)}
              class="move-button"
              onmouseenter={() => {
                for (const segment of buildMoveLabelSegments(move)) {
                  if (segment.kind === "card") {
                    onCardHover(segment.card);
                    break;
                  }
                }
              }}
              onmouseleave={() => onCardLeave()}
              onfocus={() => {
                for (const segment of buildMoveLabelSegments(move)) {
                  if (segment.kind === "card") {
                    onCardHover(segment.card);
                    break;
                  }
                }
              }}
              onblur={() => onCardLeave()}
              onclick={() => handleMoveClick(move)}
              aria-label={m["sim.actions.executeAria"]({ label: getMoveButtonLabel(move) })}
            >
              <p class="move-label">
                {#each buildMoveLabelSegments(move) as segment}
                  {#if segment.kind === "card"}
                    <CardTextToken
                      card={segment.card}
                      text={segment.text}
                      interactive={false}
                      onHover={() => onCardHover(segment.card)}
                      onLeave={onCardLeave}
                    />
                  {:else}
                    {segment.text}
                  {/if}
                {/each}
              </p>
              {#if isAwaitingConfirmation(move)}
                <p class="move-confirmation-hint">{m["sim.actions.confirmMoveHint"]({})}</p>
              {/if}
              {#if showRawLogRegistryJson}
                <p class="move-id">{move.moveId}</p>
              {/if}
              {#if showRawLogRegistryJson && hasParams(move.params)}
                <p class="move-params">{JSON.stringify(move.params)}</p>
              {/if}
            </button>
          </li>
        {/each}
      </ol>
    {:else}
      <ol class="move-list">
        {#each moveCategoryGroups as group (group.id)}
          {@const MoveCategoryIcon = getMoveCategoryIcon(group.id)}
          {@const categoryHotkey = getMoveCategoryHotkey(group.id)}
          <li class="move-item">
            <button
              type="button"
              class:move-button--confirming={group.isDirect && isCategoryAwaitingConfirmation(group.id)}
              class="move-button move-button--category"
              onclick={() => handleCategoryClick(group)}
              aria-label={
                group.isDirect && isCategoryAwaitingConfirmation(group.id)
                  ? m["sim.actions.executeAria"]({ label: m["sim.actions.confirmMoveLabel"]({ label: group.label }) })
                  : group.isDirect
                    ? m["sim.actions.executeAria"]({ label: group.label })
                    : m["sim.actions.openCategoryAria"]({ label: group.label })
              }
            >
              <div class="move-content">
                <div class="move-label-row">
                  <span
                    class="move-category-icon-shell"
                    data-action-icon={group.id}
                    aria-hidden="true"
                  >
                    <MoveCategoryIcon class="move-category-icon" />
                  </span>
                  <p class="move-label">
                    {#if group.isDirect && isCategoryAwaitingConfirmation(group.id)}
                      {m["sim.actions.confirmMoveLabel"]({ label: group.label })}
                    {:else}
                      {group.label}
                    {/if}
                  </p>
                  {#if categoryHotkey}
                    <div class="move-hotkey">
                      <HotkeyDisplay hotkey={categoryHotkey} />
                    </div>
                  {/if}
                </div>
                {#if group.isDirect && isCategoryAwaitingConfirmation(group.id)}
                  <p class="move-confirmation-hint">{m["sim.actions.confirmMoveHint"]({})}</p>
                {/if}
              </div>
            </button>
          </li>
        {/each}
      </ol>
    {/if}
  {/if}
</section>

<style>
  .available-moves-panel {
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
    padding: 0.1rem 0 0;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.45rem;
    margin-bottom: 0.3rem;
    padding: 0 0.2rem;
  }

  h2 {
    margin: 0;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #95a8c1;
  }

  .empty-state {
    margin: 0;
    padding: 0 0.2rem;
    color: #92a6c0;
    font-size: 0.76rem;
    line-height: 1.35;
  }

  .supplemental-actions {
    display: grid;
    gap: 0.45rem;
    margin-bottom: 0.45rem;
    padding: 0 0.2rem;
  }

  .supplemental-action {
    display: grid;
    gap: 0.14rem;
    width: 100%;
    padding: 0.58rem 0.7rem;
    text-align: left;
    border-radius: 0.85rem;
    border: 1px solid rgba(125, 187, 242, 0.24);
    background:
      linear-gradient(180deg, rgba(14, 31, 52, 0.92), rgba(11, 24, 40, 0.88)),
      radial-gradient(circle at top left, rgba(94, 234, 212, 0.08), transparent 46%);
    color: #eff6ff;
    transition:
      border-color 150ms ease,
      background 150ms ease,
      transform 150ms ease;
  }

  .supplemental-action:hover,
  .supplemental-action:focus-visible {
    border-color: rgba(125, 187, 242, 0.48);
    background:
      linear-gradient(180deg, rgba(19, 40, 66, 0.96), rgba(13, 28, 47, 0.92)),
      radial-gradient(circle at top left, rgba(94, 234, 212, 0.12), transparent 46%);
    outline: none;
    transform: translateY(-1px);
  }

  .supplemental-action:focus-visible {
    box-shadow: 0 0 0 2px rgba(125, 187, 242, 0.42);
  }

  .supplemental-action--emphasis {
    border-color: rgba(244, 194, 96, 0.38);
    background:
      linear-gradient(180deg, rgba(72, 43, 12, 0.94), rgba(39, 25, 10, 0.9)),
      radial-gradient(circle at top left, rgba(245, 184, 73, 0.22), transparent 52%);
  }

  .supplemental-action--emphasis:hover,
  .supplemental-action--emphasis:focus-visible {
    border-color: rgba(244, 194, 96, 0.58);
    background:
      linear-gradient(180deg, rgba(89, 52, 15, 0.98), rgba(50, 31, 12, 0.94)),
      radial-gradient(circle at top left, rgba(245, 184, 73, 0.28), transparent 52%);
  }

  .supplemental-action__label {
    font-size: 0.78rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .supplemental-action__detail {
    color: rgba(214, 228, 245, 0.78);
    font-size: 0.68rem;
    line-height: 1.25;
  }

  .move-list {
    list-style: none;
    margin: 0;
    padding: 0 0.2rem;
    display: grid;
    gap: 0;
    min-height: 0;
    flex: 1;
    overflow-y: auto;
    border-top: 1px solid rgba(109, 149, 195, 0.16);
    align-content: start;
  }

  .detail-header {
    display: flex;
    align-items: flex-start;
    gap: 0.45rem;
    margin-bottom: 0.28rem;
    padding: 0 0.2rem;
  }

  .detail-copy {
    min-width: 0;
    display: grid;
    gap: 0.2rem;
    flex: 1;
  }

  .detail-copy--with-trailing-action {
    grid-template-columns: minmax(0, 1fr);
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border: 1px solid rgba(109, 149, 195, 0.22);
    background: rgba(15, 30, 49, 0.62);
    color: #d4e6fb;
    border-radius: 999px;
    padding: 0.22rem 0.58rem;
    font-size: 0.68rem;
    font-weight: 700;
    cursor: pointer;
  }

  .back-button:hover,
  .back-button:focus-visible {
    background: rgba(25, 47, 76, 0.85);
    outline: none;
  }

  .back-button:focus-visible {
    box-shadow: 0 0 0 2px rgba(125, 187, 242, 0.5);
  }

  .icon-action-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.9rem;
    height: 1.9rem;
    border: 1px solid rgba(109, 149, 195, 0.22);
    background: rgba(15, 30, 49, 0.62);
    color: #d4e6fb;
    border-radius: 999px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .icon-action-button:hover,
  .icon-action-button:focus-visible {
    background: rgba(25, 47, 76, 0.85);
    outline: none;
  }

  .icon-action-button:focus-visible {
    box-shadow: 0 0 0 2px rgba(125, 187, 242, 0.5);
  }

  .detail-title {
    color: #d7e6f8;
    font-size: 0.76rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .detail-title--with-icon {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  .detail-title__text {
    margin: 0;
  }

  .detail-title__subtext {
    margin: 0.15rem 0 0;
    max-height: 4.5rem;
    overflow-y: auto;
    color: #9eb6d6;
    font-size: 0.68rem;
    font-weight: 500;
    line-height: 1.35;
  }

  .detail-message {
    margin: 0;
    color: #a9c0dc;
    font-size: 0.72rem;
    line-height: 1.35;
    white-space: pre-line;
  }

  .selection-summary {
    display: grid;
    gap: 0.3rem;
    padding: 0 0.2rem 0.45rem;
  }

  .selection-summary__row {
    display: grid;
    gap: 0.08rem;
    padding: 0.45rem 0.6rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(109, 149, 195, 0.18);
    background: rgba(12, 24, 39, 0.7);
  }

  .selection-summary__label {
    color: #8ea7c4;
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .selection-summary__value {
    color: #e4edf8;
    font-size: 0.76rem;
    font-weight: 600;
    line-height: 1.25;
  }

  .scry-layout {
    display: grid;
    gap: 0.75rem;
    min-height: 0;
  }

  .scry-card-pool,
  .scry-destination {
    display: grid;
    gap: 0.55rem;
    padding: 0.7rem 0.2rem 0;
    border-top: 1px solid rgba(109, 149, 195, 0.16);
  }

  .scry-destinations {
    display: grid;
    gap: 0.65rem;
  }

  .scry-destination__header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0 0.2rem;
  }

  .scry-section-title {
    margin: 0;
    color: #d7e6f8;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .compact-card-selection-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.7rem 0.55rem;
    padding: 0.7rem 0.2rem 0;
    border-top: 1px solid rgba(109, 149, 195, 0.16);
    min-height: 0;
    overflow-y: auto;
    align-content: start;
  }

  .compact-card-selection-button {
    display: grid;
    justify-items: center;
    gap: 0.32rem;
    min-width: 0;
    padding: 0.18rem;
    border: 1px solid rgba(125, 187, 242, 0.16);
    border-radius: 1rem;
    background: linear-gradient(180deg, rgba(11, 24, 40, 0.72), rgba(8, 18, 31, 0.92));
    transition:
      border-color 150ms ease,
      background 150ms ease,
      transform 150ms ease,
      box-shadow 150ms ease;
  }

  .compact-card-selection-button:hover:enabled,
  .compact-card-selection-button:focus-visible {
    border-color: rgba(125, 187, 242, 0.46);
    background: linear-gradient(180deg, rgba(16, 34, 57, 0.82), rgba(10, 23, 39, 0.96));
    transform: translateY(-1px);
    outline: none;
  }

  .compact-card-selection-button:focus-visible {
    box-shadow: 0 0 0 2px rgba(125, 187, 242, 0.42);
  }

  .compact-card-selection-button:disabled {
    opacity: 0.46;
  }

  .compact-card-selection-button--selected {
    border-color: rgba(94, 234, 212, 0.58);
    box-shadow: 0 0 0 1px rgba(94, 234, 212, 0.18);
  }

  .compact-card-selection-label,
  .compact-card-selection-detail {
    display: block;
    width: 100%;
    text-align: center;
    line-height: 1.2;
  }

  .compact-card-selection-label {
    font-size: 0.7rem;
    font-weight: 700;
  }

  .compact-card-selection-detail {
    color: rgba(203, 213, 225, 0.78);
    font-size: 0.62rem;
  }

  .compact-card-selection-detail--disabled {
    color: #fca5a5;
  }

  .move-item {
    padding: 0;
    border-bottom: 1px solid rgba(109, 149, 195, 0.12);
  }

  .move-item:last-child {
    border-bottom: none;
  }

  .move-button {
    width: 100%;
    text-align: left;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    padding: 0.38rem 0.3rem;
    display: block;
    border-radius: 0.75rem;
  }

  .move-button--category {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.45rem;
  }

  .move-button--confirming {
    background: rgba(111, 46, 46, 0.22);
  }

  .move-button--selected {
    background: rgba(29, 78, 216, 0.22);
    box-shadow: inset 0 0 0 1px rgba(96, 165, 250, 0.32);
  }

  .move-button--static {
    cursor: default;
  }

  .move-button:hover,
  .move-button:focus-visible {
    background: rgba(25, 47, 76, 0.56);
    outline: none;
  }

  .move-button--confirming:hover,
  .move-button--confirming:focus-visible {
    background: rgba(135, 56, 56, 0.34);
  }

  .move-button:focus-visible {
    box-shadow: 0 0 0 2px rgba(125, 187, 242, 0.5);
  }

  .move-label {
    margin: 0;
    color: #e4edf8;
    font-size: 0.76rem;
    font-weight: 600;
    line-height: 1.2;
  }

  .move-label-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    width: 100%;
  }

  .card-label {
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-thickness: 1px;
  }

  .move-content {
    min-width: 0;
    display: contents;
  }

  .move-hotkey {
    margin-left: auto;
    flex-shrink: 0;
  }

  .move-category-icon-shell {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.65rem;
    height: 1.65rem;
    border-radius: 999px;
    border: 1px solid rgba(125, 187, 242, 0.22);
    background: rgba(15, 30, 49, 0.72);
    color: #bfdbfe;
    flex-shrink: 0;
  }

  .move-category-icon-shell--detail {
    width: 1.5rem;
    height: 1.5rem;
  }

  .move-confirmation-hint {
    margin: 0.16rem 0 0;
    color: #f7c5c5;
    font-size: 0.68rem;
    line-height: 1.2;
  }

  .move-detail {
    margin: 0.18rem 0 0;
    color: #9eb5cf;
    font-size: 0.68rem;
    line-height: 1.24;
  }

  .selection-actions {
    display: flex;
    gap: 0.45rem;
    padding: 0.55rem 0.2rem 0;
    margin-top: auto;
  }

  .selection-action-button {
    flex: 1;
    min-height: 2.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    border-radius: 0.8rem;
    border: 1px solid rgba(109, 149, 195, 0.24);
    background: rgba(15, 30, 49, 0.72);
    color: #d4e6fb;
    font-size: 0.74rem;
    font-weight: 700;
    cursor: pointer;
  }

  .selection-action-button:hover,
  .selection-action-button:focus-visible {
    background: rgba(25, 47, 76, 0.92);
    outline: none;
  }

  .selection-action-button:focus-visible {
    box-shadow: 0 0 0 2px rgba(125, 187, 242, 0.5);
  }

  .selection-action-button--emphasis {
    border-color: rgba(244, 194, 96, 0.38);
    background:
      linear-gradient(180deg, rgba(72, 43, 12, 0.94), rgba(39, 25, 10, 0.9)),
      radial-gradient(circle at top left, rgba(245, 184, 73, 0.22), transparent 52%);
    color: #fff7e7;
  }

  .selection-action-button--emphasis:hover,
  .selection-action-button--emphasis:focus-visible {
    background:
      linear-gradient(180deg, rgba(89, 52, 15, 0.98), rgba(50, 31, 12, 0.94)),
      radial-gradient(circle at top left, rgba(245, 184, 73, 0.28), transparent 52%);
  }

  .move-id {
    margin: 0.18rem 0 0;
    color: #93acc9;
    font-size: 0.7rem;
    line-height: 1.2;
    font-family: "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
      monospace;
  }

  .move-params {
    margin: 0.18rem 0 0;
    color: #bccce0;
    font-size: 0.68rem;
    line-height: 1.24;
    overflow-wrap: anywhere;
    font-family: "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
      monospace;
  }
</style>
