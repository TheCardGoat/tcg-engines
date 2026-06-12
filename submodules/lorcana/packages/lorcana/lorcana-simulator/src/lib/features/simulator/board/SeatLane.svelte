<script lang="ts">
import type {
	LorcanaPlayerSide,
	LorcanaTableSeat,
	ExecutableMovePresentationCategoryId,
} from "@/features/simulator/model/contracts.js";
import type { SimulatorLayoutMode } from "@/features/simulator/model/layout-mode.svelte.js";
import CardImage from "@/design-system/simulator/cards/CardImage.svelte";
import PlayZone from "./PlayZone.svelte";
import InkwellZone from "@/features/simulator/board/InkwellZone.svelte";
import ItemZone from "./ItemZone.svelte";
import DeckZone from "@/features/simulator/board/DeckZone.svelte";
import DiscardZone from "./DiscardZone.svelte";
import {
	useLorcanaBoardPresenter,
	useLorcanaSidebarPresenter,
} from "@/features/simulator/context/game-context.svelte.js";
import { createLoreBadgeAnchorId } from "@/features/simulator/animations/quest-animations.js";
import { useLorcanaSimulatorDndContext } from "@/features/simulator/context/simulator-dnd-context.svelte.js";
import {
	ORDERED_MOVE_CATEGORIES,
	getCategoryLabel,
} from "@/features/simulator/model/move-presentation.js";
import * as Tooltip from "$lib/design-system/primitives/tooltip/index.js";
import * as ContextMenu from "$lib/design-system/primitives/context-menu";
import * as Dialog from "$lib/design-system/primitives/dialog";
import { Button } from "$lib/design-system/primitives/button";
import { m } from "$lib/i18n/messages.js";
import { getManualModeContext } from "@/features/manual-mode/manual-mode-context.svelte.js";

interface SeatLaneProps {
	layoutMode?: SimulatorLayoutMode;
	playerSide: LorcanaPlayerSide;
	seat: LorcanaTableSeat;
	isOpponent: boolean;
	isTurnPlayer: boolean;
	hasPriority: boolean;
	lore?: number;
	seatPosition: "top" | "bottom";
	playHotkeyBindings?: Map<string, string>;
	isPlayerEffectTarget?: boolean;
	isDisconnected?: boolean;
	isTimedOut?: boolean;
	disconnectOverlay?: import("svelte").Snippet;
	timeoutOverlay?: import("svelte").Snippet;
	playerIdentity?: import("svelte").Snippet;
	onDiscardClick?: () => void;
	onInkwellClick?: () => void;
	onProposeCancel?: () => void;
	onReportOpponent?: () => void;
	onLocalMoveSubmitted?: () => void;
	canReportOpponent?: boolean;
}

let {
	layoutMode = "desktop",
	playerSide,
	seat,
	isOpponent,
	isTurnPlayer,
	hasPriority,
	lore = 0,
	seatPosition,
	playHotkeyBindings = new Map(),
	isPlayerEffectTarget = false,
	isDisconnected = false,
	isTimedOut = false,
	disconnectOverlay,
	timeoutOverlay,
	onDiscardClick,
	onInkwellClick,
	onProposeCancel,
	onReportOpponent,
	onLocalMoveSubmitted,
	canReportOpponent = false,
}: SeatLaneProps = $props();

const board = useLorcanaBoardPresenter();
const sidebar = useLorcanaSidebarPresenter();
const dnd = useLorcanaSimulatorDndContext();

const ownerId = $derived(board.getOwnerIdForSide(playerSide));
const boardSummary = $derived(board.getPlayerSummary(playerSide));
const visualSettings = $derived(board.getPlayerVisualSettings(playerSide));
const hasItemsInPlay = $derived.by(() =>
	board
		.getZoneCards(playerSide, "play")
		.some((card) => card.cardType === "item"),
);
const showSeparateItemZone = $derived(layoutMode !== "mobile" && hasItemsInPlay);
const playZoneExcludedCardTypes = $derived.by(
	(): Array<"item"> => (layoutMode === "mobile" ? [] : ["item"]),
);
const effectSourceCards = $derived.by(() => {
	const sourceIds = boardSummary?.effectSourceCardIds ?? [];
	const cardSnapshotsById = board.cardSnapshotsById;
	return sourceIds
		.map((sourceId) => cardSnapshotsById[sourceId] ?? null)
		.filter((card): card is NonNullable<typeof card> => card !== null);
});
const playerActiveEffects = $derived(boardSummary?.activeEffects ?? []);
const playerEffectAriaLabel = $derived(
  playerActiveEffects.length > 0
    ? `Active player effects: ${playerActiveEffects.map((effect) => effect.label).join(", ")}`
    : "",
);
const hasFallbackEffectLabel = $derived(
  effectSourceCards.length === 0 && playerActiveEffects.length > 0,
);
const fallbackEffectLabel = $derived(playerActiveEffects[0]?.label ?? "");
const hiddenFallbackEffectCount = $derived(Math.max(0, playerActiveEffects.length - 1));
const visibleEffectSourceCards = $derived(effectSourceCards.slice(0, 3));
const hiddenEffectSourceCount = $derived(
	Math.max(0, effectSourceCards.length - visibleEffectSourceCards.length),
);
const priorityChipLabel = $derived.by(() => {
	if (!hasPriority) return "";
	if (!board.hasOwnedView) return m["sim.priority.label.generic"]({});
	return isOpponent
		? m["sim.priority.label.opponent"]({})
		: m["sim.priority.label.yours"]({});
});

// Context menu move availability (reflects current player's moves regardless of lane)
const canPassTurn = $derived(
	sidebar.moveCategorySummaries.some((s) => s.categoryId === "pass-turn"),
);
const canUndo = $derived(
	sidebar.moveCategorySummaries.some((s) => s.categoryId === "undo"),
);
const canQuestAll = $derived(
	sidebar.moveCategorySummaries.some((s) => s.categoryId === "quest-all"),
);
const canConcede = $derived(sidebar.canConcede);
const availableCategoryIds = $derived(
	new Set(sidebar.moveCategorySummaries.map((s) => s.categoryId)),
);
const loreDropState = $derived(dnd.getLoreDropState(playerSide));

const manualMode = getManualModeContext();
const manualModeEnabled = $derived(manualMode?.enabled ?? false);

function handleLoreIncrement(): void {
	if (!manualMode || !ownerId) return;
	manualMode.setLore(ownerId, lore + 1);
}

function handleLoreDecrement(): void {
	if (!manualMode || !ownerId) return;
	manualMode.setLore(ownerId, Math.max(0, lore - 1));
}

// Card-based moves require selecting a specific card — always disabled in context menu
const CARD_BASED = new Set<ExecutableMovePresentationCategoryId>([
	"ink-card",
	"play-card",
	"shift-card",
	"sing-card",
	"quest",
	"challenge",
	"activate-ability",
	"move-to-location",
]);

type ConfirmableAction = "pass-turn" | "undo" | "concede" | "disable-manual-mode";
let pendingAction = $state<ConfirmableAction | null>(null);

const confirmDialogConfig = $derived.by(() => {
	switch (pendingAction) {
		case "pass-turn":
			return {
				title: m["sim.sidebar.passTurnDialog.title"]({}),
				description: m["sim.sidebar.passTurnDialog.description"]({}),
				confirmLabel: m["sim.actions.label.passTurn"]({}),
				destructive: false,
			};
		case "undo":
			return {
				title: m["sim.sidebar.undoDialog.title"]({}),
				description: m["sim.sidebar.undoDialog.description"]({}),
				confirmLabel: m["sim.actions.label.undo"]({}),
				destructive: false,
			};
		case "concede":
			return {
				title: m["sim.sidebar.concedeDialog.title"]({}),
				description: m["sim.sidebar.concedeDialog.description"]({}),
				confirmLabel: m["sim.actions.label.concede"]({}),
				destructive: true,
			};
		case "disable-manual-mode":
			return {
				title: m["sim.manualMode.disableDialog.title"]({}),
				description: m["sim.manualMode.disableDialog.description"]({}),
				confirmLabel: m["sim.manualMode.disableDialog.confirmLabel"]({}),
				destructive: false,
			};
		default:
			return null;
	}
});

const CONFIRMABLE_CATEGORIES = new Set<string>(["pass-turn", "undo", "concede"]);

function executeDirectCategory(categoryId: ExecutableMovePresentationCategoryId): void {
	if (CONFIRMABLE_CATEGORIES.has(categoryId)) {
		pendingAction = categoryId as ConfirmableAction;
		return;
	}
	const moves = sidebar.expandCategoryMoves(categoryId);
	if (moves.length > 0) {
		onLocalMoveSubmitted?.();
		sidebar.handleAvailableMoveClick(moves[0]);
	}
}

function confirmPendingAction(): void {
	if (!pendingAction) return;
	if (pendingAction === "concede") {
		sidebar.handleMobileConcede();
	} else if (pendingAction === "disable-manual-mode") {
		manualMode?.requestDisable();
	} else {
		const moves = sidebar.expandCategoryMoves(pendingAction);
		if (moves.length > 0) {
			onLocalMoveSubmitted?.();
			sidebar.handleAvailableMoveClick(moves[0]);
		}
	}
	pendingAction = null;
}
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger>
    {#snippet child({ props })}
      <div
        class="seat-lane"
        class:seat-lane--top={seatPosition === "top"}
        class:seat-lane--bottom={seatPosition === "bottom"}
        class:seat-lane--turn={isTurnPlayer}
        class:seat-lane--priority={hasPriority}
        class:seat-lane--player-effect-target={isPlayerEffectTarget}
        class:seat-lane--disconnected={isDisconnected}
        class:seat-lane--timed-out={isTimedOut}
        data-layout-mode={layoutMode}
        data-priority-owner={hasPriority && board.hasOwnedView ? (isOpponent ? "opponent" : "self") : undefined}
        {...props}
      >
        <div class="seat-lane__content" class:seat-lane__content--dimmed={isDisconnected || isTimedOut}>
        <div
          class="seat-corner-stack"
          class:seat-corner-stack--top={seatPosition === "top"}
          class:seat-corner-stack--bottom={seatPosition === "bottom"}
        >
          {#if seatPosition === "top" && (visibleEffectSourceCards.length > 0 || hasFallbackEffectLabel)}
            <div
              class="seat-effect-strip"
              aria-label={playerEffectAriaLabel}
            >
              {#each visibleEffectSourceCards as effectCard, index (effectCard.cardId)}
                {@const effectDescriptions = playerActiveEffects
                  .filter((e) => e.sourceCardId === effectCard.cardId)
                  .map((e) => e.description)
                  .join("; ")}
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    {#snippet child({ props })}
                      <div
                        class="seat-effect-card"
                        style={`--effect-card-offset:${index}`}
                        aria-label={effectCard.label}
                        {...props}
                      >
                        {#if effectCard.set && effectCard.cardNumber && !effectCard.isMasked}
                          <CardImage
                            set={effectCard.set}
                            number={effectCard.cardNumber}
                            crop="art_only"
                            alt={effectCard.label}
                            class="seat-effect-card__image"
                          />
                        {:else}
                          <div class="seat-effect-card__placeholder" aria-hidden="true"></div>
                        {/if}
                      </div>
                    {/snippet}
                  </Tooltip.Trigger>
                  <Tooltip.Content
                    side="top"
                    sideOffset={6}
                    class="rounded-lg border border-white/10 bg-slate-950/95 px-2.5 py-1.5 text-[0.7rem] leading-snug text-slate-100 shadow-xl max-w-[14rem]"
                  >
                    <div class="font-semibold">{effectCard.label}</div>
                    {#if effectDescriptions}
                      <div class="mt-0.5 text-slate-300">{effectDescriptions}</div>
                    {/if}
                  </Tooltip.Content>
                </Tooltip.Root>
              {/each}
              {#if hiddenEffectSourceCount > 0}
                <div
                  class="seat-effect-overflow"
                  title={`${hiddenEffectSourceCount} additional active player effect source${hiddenEffectSourceCount === 1 ? "" : "s"}`}
                >
                  +{hiddenEffectSourceCount}
                </div>
              {/if}
              {#if hasFallbackEffectLabel}
                <div class="seat-effect-pill" title={playerActiveEffects.map((effect) => effect.description).join("; ")}>
                  <span>{fallbackEffectLabel}</span>
                  {#if hiddenFallbackEffectCount > 0}
                    <span class="seat-effect-pill__count">+{hiddenFallbackEffectCount}</span>
                  {/if}
                </div>
              {/if}
            </div>
          {/if}

          <div class="seat-badges">
            {#if manualModeEnabled && manualMode}
              <Tooltip.Root>
                <Tooltip.Trigger>
                  {#snippet child({ props })}
                    <button
                      type="button"
                      class="seat-chip seat-chip--manual"
                      class:seat-chip--manual-self={!isOpponent}
                      aria-label={isOpponent
                        ? m["sim.manualMode.chip.ariaLabel.opponent"]({})
                        : m["sim.manualMode.chip.ariaLabel.self"]({})}
                      {...props}
                      onclick={(event) => {
                        (props as { onclick?: (e: MouseEvent) => void }).onclick?.(event);
                        if (!isOpponent) pendingAction = "disable-manual-mode";
                      }}
                    >
                      <span class="seat-chip--manual__dot" aria-hidden="true"></span>
                      <span class="seat-chip--manual__label">
                        {isOpponent
                          ? m["sim.manualMode.chip.label.opponent"]({})
                          : m["sim.manualMode.chip.label.self"]({})}
                      </span>
                    </button>
                  {/snippet}
                </Tooltip.Trigger>
                <Tooltip.Content
                  side={seatPosition === "top" ? "bottom" : "top"}
                  sideOffset={6}
                  class="rounded-lg border border-amber-300/30 bg-slate-950/95 px-2.5 py-1.5 text-[0.7rem] leading-snug text-slate-100 shadow-xl max-w-[16rem]"
                >
                  <div class="font-semibold text-amber-200">{m["sim.manualMode.tooltip.title"]({})}</div>
                  <div class="mt-0.5 text-slate-300">
                    {m["sim.manualMode.tooltip.description"]({})}
                  </div>
                  {#if !isOpponent}
                    <div class="mt-1 text-slate-400">{m["sim.manualMode.tooltip.disableHint"]({})}</div>
                  {/if}
                </Tooltip.Content>
              </Tooltip.Root>
            {/if}
            {#if seatPosition === "top" || seatPosition === "bottom"}
              <span
                class="seat-chip seat-chip--lore"
                class:seat-chip--lore-quest-target={loreDropState !== "none"}
                class:seat-chip--lore-quest-hovered={loreDropState === "valid"}
                class:seat-chip--lore-manual={manualModeEnabled}
                data-board-anchor-id={createLoreBadgeAnchorId(playerSide)}
                data-lore-drop-target={playerSide}
                data-player-side={playerSide}
                aria-label={`Lore: ${lore}`}
              >
                {#if manualModeEnabled}
                  <button
                    type="button"
                    class="seat-chip__lore-btn"
                    aria-label={`Decrease lore for ${playerSide}`}
                    onclick={handleLoreDecrement}
                    disabled={lore <= 0}
                  >−</button>
                {/if}
                <span class="seat-chip__lore-value">Lore: {lore}</span>
                {#if manualModeEnabled}
                  <button
                    type="button"
                    class="seat-chip__lore-btn"
                    aria-label={`Increase lore for ${playerSide}`}
                    onclick={handleLoreIncrement}
                  >+</button>
                {/if}
                {#if loreDropState !== "none"}
                  <span class="seat-chip__drop-hint" aria-hidden="true">
                    {m["sim.dnd.lore.dropHint"]({})}
                  </span>
                {/if}
              </span>
            {/if}
            {#if isTurnPlayer}
              <span class="seat-chip seat-chip--turn">Turn</span>
            {/if}
            {#if hasPriority}
              <span class="seat-chip seat-chip--priority">
                <span class="seat-chip__priority-dot" aria-hidden="true"></span>
                {priorityChipLabel}
              </span>
            {/if}
          </div>

          {#if seatPosition === "bottom" && (visibleEffectSourceCards.length > 0 || hasFallbackEffectLabel)}
            <div
              class="seat-effect-strip"
              aria-label={playerEffectAriaLabel}
            >
              {#each visibleEffectSourceCards as effectCard, index (effectCard.cardId)}
                {@const effectDescriptions = playerActiveEffects
                  .filter((e) => e.sourceCardId === effectCard.cardId)
                  .map((e) => e.description)
                  .join("; ")}
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    {#snippet child({ props })}
                      <div
                        class="seat-effect-card"
                        style={`--effect-card-offset:${index}`}
                        aria-label={effectCard.label}
                        {...props}
                      >
                        {#if effectCard.set && effectCard.cardNumber && !effectCard.isMasked}
                          <CardImage
                            set={effectCard.set}
                            number={effectCard.cardNumber}
                            crop="art_only"
                            alt={effectCard.label}
                            class="seat-effect-card__image"
                          />
                        {:else}
                          <div class="seat-effect-card__placeholder" aria-hidden="true"></div>
                        {/if}
                      </div>
                    {/snippet}
                  </Tooltip.Trigger>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={6}
                    class="rounded-lg border border-white/10 bg-slate-950/95 px-2.5 py-1.5 text-[0.7rem] leading-snug text-slate-100 shadow-xl max-w-[14rem]"
                  >
                    <div class="font-semibold">{effectCard.label}</div>
                    {#if effectDescriptions}
                      <div class="mt-0.5 text-slate-300">{effectDescriptions}</div>
                    {/if}
                  </Tooltip.Content>
                </Tooltip.Root>
              {/each}
              {#if hiddenEffectSourceCount > 0}
                <div
                  class="seat-effect-overflow"
                  title={`${hiddenEffectSourceCount} additional active player effect source${hiddenEffectSourceCount === 1 ? "" : "s"}`}
                >
                  +{hiddenEffectSourceCount}
                </div>
              {/if}
              {#if hasFallbackEffectLabel}
                <div class="seat-effect-pill" title={playerActiveEffects.map((effect) => effect.description).join("; ")}>
                  <span>{fallbackEffectLabel}</span>
                  {#if hiddenFallbackEffectCount > 0}
                    <span class="seat-effect-pill__count">+{hiddenFallbackEffectCount}</span>
                  {/if}
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <div class="seat-playmat"
          data-owner-id={ownerId}
          data-playmat-id={visualSettings.playmat.id}
          data-playmat-src={visualSettings.playmat.src ?? ""}
          style:background-image={visualSettings.playmat.src ? `url(${visualSettings.playmat.src})` : undefined}
        ></div>

        <div class="seat-lane__section seat-lane__section--bar">
          <div class="bar-zones">
            <div class="bar-zones__center-viewport" data-board-scroll-sync>
              <div class="bar-zones__center-content" class:bar-zones__center-content--with-items={showSeparateItemZone}>
                <div class="bar-zone-shell bar-zone-shell--inkwell">
                  <InkwellZone
                    {isOpponent}
                    {playerSide}
                    {seat}
                    onCounterClick={onInkwellClick}
                    hasItemsInPlay={showSeparateItemZone}
                  />
                </div>

                {#if showSeparateItemZone}
                  <div class="bar-zone-shell bar-zone-shell--items">
                    <ItemZone
                      {layoutMode}
                      {isOpponent}
                      {playerSide}
                      {seat}
                    />
                  </div>
                {/if}
              </div>
            </div>

            <div class="bar-zone-shell bar-zone-shell--side bar-zone-shell--deck">
              <DeckZone
                {isOpponent}
                {playerSide}
                {seat}
              />
            </div>

            <div class="bar-zone-shell bar-zone-shell--side bar-zone-shell--discard">
              <DiscardZone
                {isOpponent}
                {playerSide}
                {seat}
                onClick={onDiscardClick}
              />
            </div>
          </div>
        </div>

        <div class="seat-lane__section seat-lane__section--play">
          <PlayZone
            {layoutMode}
            zoneId="play"
            {playerSide}
            {seat}
            {isOpponent}
            label=""
            excludeCardTypes={playZoneExcludedCardTypes}
            hotkeyBindings={playHotkeyBindings}
          />
        </div>
        </div><!-- /.seat-lane__content -->

        {#if isTimedOut && timeoutOverlay}
          {@render timeoutOverlay()}
        {:else if isDisconnected && disconnectOverlay}
          {@render disconnectOverlay()}
        {/if}
      </div>
    {/snippet}
  </ContextMenu.Trigger>

  <ContextMenu.Content>
    <ContextMenu.Item
      disabled={!canPassTurn}
      onSelect={() => { pendingAction = "pass-turn"; }}
    >
      {m["sim.actions.label.passTurn"]({})}
      <ContextMenu.Shortcut>Space</ContextMenu.Shortcut>
    </ContextMenu.Item>
    <ContextMenu.Item
      disabled={!canUndo}
      onSelect={() => { pendingAction = "undo"; }}
    >
      {m["sim.actions.label.undo"]({})}
    </ContextMenu.Item>
    <ContextMenu.Item
      disabled={!canQuestAll}
      onSelect={() => executeDirectCategory("quest-all")}
    >
      {m["sim.actions.label.questAll"]({})}
    </ContextMenu.Item>

    <ContextMenu.Separator />

    <ContextMenu.Item
      disabled={!canConcede}
      variant="destructive"
      onSelect={() => { pendingAction = "concede"; }}
    >
      {m["sim.actions.label.concede"]({})}
    </ContextMenu.Item>
    <ContextMenu.Item
      disabled={!onProposeCancel}
      onSelect={() => onProposeCancel?.()}
    >
      {m["sim.actions.label.proposeCancel"]({})}
    </ContextMenu.Item>
    {#if manualMode}
      <ContextMenu.Item
        onSelect={() => {
          if (manualModeEnabled) manualMode.requestDisable();
          else manualMode.requestEnable();
        }}
      >
        {manualModeEnabled
          ? "Exit Board State Correction…"
          : "Request Board State Correction…"}
      </ContextMenu.Item>
    {/if}

    {#if isOpponent}
      <ContextMenu.Item
        disabled={!canReportOpponent || !onReportOpponent}
        variant="destructive"
        onSelect={() => onReportOpponent?.()}
      >
        {m["sim.player.report.openAria"]({})}
      </ContextMenu.Item>
    {/if}

    <ContextMenu.Separator />

    <ContextMenu.Sub>
      <ContextMenu.SubTrigger>{m["sim.contextMenu.allMoves"]({})}</ContextMenu.SubTrigger>
      <ContextMenu.SubContent>
        {#each ORDERED_MOVE_CATEGORIES as categoryId}
          {@const isCardBased = CARD_BASED.has(categoryId)}
          {@const disabled = isCardBased || !availableCategoryIds.has(categoryId)}
          <ContextMenu.Item
            {disabled}
            onSelect={() => { if (!disabled && !isCardBased) executeDirectCategory(categoryId); }}
          >
            {getCategoryLabel(categoryId)}
          </ContextMenu.Item>
        {/each}
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
  </ContextMenu.Content>
</ContextMenu.Root>

<!-- Confirmation dialog — outside ContextMenu.Root so bits-ui dismiss cycle doesn't interfere -->
<Dialog.Root open={pendingAction !== null} onOpenChange={(open) => { if (!open) pendingAction = null; }}>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content class="seat-lane-concede-dialog" showCloseButton={false}>
      {#if confirmDialogConfig}
        <Dialog.Header class="seat-lane-concede-dialog__header">
          <Dialog.Title class="seat-lane-concede-dialog__title">
            {confirmDialogConfig.title}
          </Dialog.Title>
          <Dialog.Description class="seat-lane-concede-dialog__description">
            {confirmDialogConfig.description}
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer class="seat-lane-concede-dialog__footer">
          <Button
            variant="outline"
            class="seat-lane-concede-dialog__button"
            onclick={() => { pendingAction = null; }}
          >
            {m["sim.actions.cancel"]({})}
          </Button>
          <Button
            variant={confirmDialogConfig.destructive ? "destructive" : "default"}
            class="seat-lane-concede-dialog__button"
            onclick={confirmPendingAction}
          >
            {confirmDialogConfig.confirmLabel}
          </Button>
        </Dialog.Footer>
      {/if}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  .seat-lane {
    position: relative;
    display: flex;
    flex: 1 1 0;
    min-height: 0;
    flex-direction: column;
    gap: 0.55rem;
    padding: 0.7rem 0.6rem 0.6rem;
    border-radius: 18px;
    border: 1px solid rgba(96, 125, 165, 0.16);
    background: linear-gradient(180deg, rgba(8, 17, 30, 0.14) 0%, rgba(8, 17, 30, 0.04) 100%);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    transition:
      border-color 160ms ease,
      box-shadow 160ms ease,
      background 160ms ease;
    overflow: visible;
    isolation: isolate;
    container-type: size;
  }

  .seat-lane__content {
    display: contents;
    transition: filter 0.5s ease;
  }

  .seat-lane__content--dimmed {
    display: contents;
    filter: grayscale(0.7) brightness(0.55);
  }

  /* When disconnected, apply filter to direct children via the content wrapper.
     Since display:contents passes through, we target the actual children. */
  .seat-lane--disconnected > .seat-lane__content--dimmed > * {
    filter: grayscale(0.7) brightness(0.55);
    transition: filter 0.5s ease;
  }

  .seat-lane__section {
    position: relative;
    z-index: 1;
    min-width: 0;
  }

  .seat-lane__section--play {
    flex: 1 1 0;
    min-height: 0;
    display: flex;
  }

  .seat-lane--bottom .seat-lane__section--play {
    order: 1;
  }

  .seat-lane--bottom .seat-lane__section--bar {
    order: 2;
  }

  .seat-corner-stack {
    position: absolute;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.28rem;
    pointer-events: none;
  }

  .seat-corner-stack--top {
    left: 0.42rem;
    bottom: 0.42rem;
    flex-direction: column;
  }

  .seat-corner-stack--bottom {
    left: 0.42rem;
    top: 0.42rem;
  }

  .seat-badges {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    pointer-events: auto;
  }

  .seat-playmat {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    border-radius: inherit;
    background:
      linear-gradient(180deg, rgba(8, 17, 30, 0.3) 0%, rgba(8, 17, 30, 0.12) 100%),
      radial-gradient(circle at center, rgba(58, 88, 124, 0.16), transparent 70%);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.58;
    pointer-events: none;
  }

  .seat-playmat::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(5, 10, 18, 0.14), rgba(5, 10, 18, 0.24)),
      repeating-linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.02) 0,
        rgba(255, 255, 255, 0.02) 2px,
        transparent 2px,
        transparent 14px
      );
  }

  .seat-lane--turn {
    border-color: rgba(238, 194, 106, 0.45);
    background:
      linear-gradient(180deg, rgba(104, 73, 20, 0.24) 0%, rgba(46, 31, 9, 0.08) 100%),
      linear-gradient(180deg, rgba(8, 17, 30, 0.14) 0%, rgba(8, 17, 30, 0.04) 100%);
    box-shadow:
      inset 0 0 0 1px rgba(255, 213, 129, 0.08),
      inset 0 1px 0 rgba(255, 248, 220, 0.08);
  }

  .seat-lane--priority {
    border-color: rgba(118, 199, 255, 0.85);
    background:
      linear-gradient(180deg, rgba(20, 55, 100, 0.22) 0%, rgba(8, 25, 55, 0.08) 100%),
      linear-gradient(180deg, rgba(8, 17, 30, 0.14) 0%, rgba(8, 17, 30, 0.04) 100%);
    box-shadow:
      0 0 0 1px rgba(118, 199, 255, 0.32),
      0 0 32px rgba(45, 146, 221, 0.28),
      inset 0 0 0 1px rgba(190, 230, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    animation: priority-glow-pulse 2s ease-in-out infinite;
  }

  .seat-lane--priority::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 2px solid rgba(125, 211, 252, 0.72);
    pointer-events: none;
  }

  .seat-lane--priority::after {
    content: "";
    position: absolute;
    inset: 0.35rem;
    border-radius: calc(var(--seat-lane-radius, 1rem) - 0.35rem);
    background:
      linear-gradient(90deg, rgba(125, 211, 252, 0.16), transparent 18%, transparent 82%, rgba(125, 211, 252, 0.12));
    pointer-events: none;
  }

  .seat-lane--priority[data-priority-owner="self"]::before {
    border-color: rgba(250, 204, 21, 0.78);
  }

  .seat-lane--priority[data-priority-owner="self"]::after {
    background:
      linear-gradient(90deg, rgba(250, 204, 21, 0.18), transparent 18%, transparent 82%, rgba(250, 204, 21, 0.12));
  }

  @keyframes priority-glow-pulse {
    0%, 100% {
      box-shadow:
        0 0 0 1px rgba(118, 199, 255, 0.32),
        0 0 32px rgba(45, 146, 221, 0.28),
        inset 0 0 0 1px rgba(190, 230, 255, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
    50% {
      box-shadow:
        0 0 0 2px rgba(118, 199, 255, 0.48),
        0 0 52px rgba(45, 146, 221, 0.42),
        inset 0 0 0 1px rgba(190, 230, 255, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .seat-lane--priority {
      animation: none;
    }
  }

  .seat-lane--player-effect-target {
    animation: seat-player-effect-pulse 300ms ease-out both;
  }

  @keyframes seat-player-effect-pulse {
    0% {
      border-color: rgba(255, 100, 100, 0.85);
      box-shadow:
        0 0 0 2px rgba(255, 80, 80, 0.4),
        0 0 36px rgba(220, 60, 60, 0.36),
        inset 0 0 0 1px rgba(255, 160, 160, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
    40% {
      border-color: rgba(255, 120, 120, 0.7);
      box-shadow:
        0 0 0 1px rgba(255, 100, 100, 0.3),
        0 0 20px rgba(220, 60, 60, 0.22);
    }
    100% {
      border-color: rgba(96, 125, 165, 0.16);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .seat-lane--player-effect-target {
      animation: none;
      border-color: rgba(255, 100, 100, 0.4);
    }
  }

  .seat-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 1.65rem;
    padding: 0.12rem 0.62rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(6, 14, 25, 0.92);
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.28);
    color: #eef6ff;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .seat-chip--lore {
    border-color: rgba(148, 163, 184, 0.4);
    background: linear-gradient(180deg, rgba(30, 41, 59, 0.96) 0%, rgba(15, 23, 42, 0.96) 100%);
    color: #cbd5e1;
    text-shadow: none;
    font-size: 1rem;
    padding: 0.22rem 0.72rem;
    transition: transform 150ms ease, border-color 150ms ease, background 150ms ease, box-shadow 150ms ease, border-radius 150ms ease, padding 150ms ease, min-width 150ms ease;
  }

  .seat-chip--lore-quest-target {
    pointer-events: auto;
    flex-direction: column;
    padding: 0.75rem 1.1rem;
    min-width: 4.5rem;
    transform: scale(1.0);
    border-color: rgba(74, 222, 128, 0.75);
    background: linear-gradient(180deg, rgba(22, 101, 52, 0.96) 0%, rgba(15, 60, 30, 0.96) 100%);
    color: #bbf7d0;
    cursor: copy;
    border-radius: 10px;
  }

  .seat-chip--lore-quest-hovered {
    transform: scale(1.06);
    border-color: rgba(74, 222, 128, 1);
    box-shadow: 0 0 18px rgba(74, 222, 128, 0.6);
  }

  .seat-chip--lore-manual {
    gap: 0.35rem;
    padding: 0.18rem 0.42rem;
    border-color: rgba(99, 102, 241, 0.55);
    z-index: 99;
  }

  .seat-chip__lore-value {
    line-height: 1;
  }

  .seat-chip__lore-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 9999px;
    border: 1px solid rgba(99, 102, 241, 0.6);
    background: rgba(99, 102, 241, 0.18);
    color: #e0e7ff;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    transition: background 120ms ease, transform 120ms ease;
  }

  .seat-chip__lore-btn:hover:not(:disabled) {
    background: rgba(99, 102, 241, 0.35);
  }

  .seat-chip__lore-btn:active:not(:disabled) {
    transform: scale(0.92);
    cursor: pointer;
  }

  .seat-chip__lore-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .seat-chip__drop-hint {
    display: block;
    font-size: 0.52rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(187, 247, 208, 0.85);
    margin-top: 0.1rem;
  }

  .seat-chip--turn {
    border-color: rgba(247, 210, 131, 0.7);
    background: linear-gradient(180deg, rgba(128, 87, 20, 0.96) 0%, rgba(94, 56, 11, 0.96) 100%);
    color: #fff1cf;
  }

  .seat-chip--priority {
    border-color: rgba(155, 221, 255, 0.78);
    background: linear-gradient(180deg, rgba(32, 103, 155, 0.96) 0%, rgba(16, 66, 110, 0.96) 100%);
    color: #ebf8ff;
    gap: 0.35rem;
    padding-inline: 0.58rem;
  }

  .seat-lane--priority[data-priority-owner="self"] .seat-chip--priority {
    border-color: rgba(250, 204, 21, 0.78);
    background: linear-gradient(180deg, rgba(180, 83, 9, 0.96) 0%, rgba(120, 53, 15, 0.96) 100%);
    color: #fef3c7;
  }

  .seat-chip__priority-dot {
    width: 0.46rem;
    height: 0.46rem;
    border-radius: 999px;
    background: currentColor;
    box-shadow: 0 0 8px currentColor;
  }

  .seat-chip--manual {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.18rem 0.55rem;
    border: 1px solid rgba(251, 191, 36, 0.7);
    background: linear-gradient(180deg, rgba(180, 83, 9, 0.92) 0%, rgba(120, 53, 15, 0.92) 100%);
    color: #fef3c7;
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: default;
    transition: filter 120ms ease, transform 120ms ease;
  }

  .seat-chip--manual-self {
    cursor: pointer;
  }

  .seat-chip--manual-self:hover {
    filter: brightness(1.15);
    transform: translateY(-1px);
  }

  .seat-chip--manual__dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 9999px;
    background: rgba(251, 191, 36, 0.95);
    box-shadow: 0 0 6px rgba(251, 191, 36, 0.85);
    animation: seat-chip-manual-pulse 1.6s ease-in-out infinite;
  }

  @keyframes seat-chip-manual-pulse {
    0%, 100% {
      opacity: 0.65;
      box-shadow: 0 0 4px rgba(251, 191, 36, 0.55);
    }
    50% {
      opacity: 1;
      box-shadow: 0 0 10px rgba(251, 191, 36, 1);
    }
  }

  .seat-effect-strip {
    display: flex;
    margin-bottom: 1.5rem;
    align-items: center;
    min-height: 1.35rem;
  }

  .seat-effect-card {
    position: relative;
    width: 1.15rem;
    height: 1.35rem;
    margin-left: calc(var(--effect-card-offset) * -0.35rem);
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35));
    border-radius: 0.18rem;
    overflow: hidden;
    opacity: 0.65;
    transition: opacity 0.15s ease;
    cursor: default;
  }

  .seat-effect-card:hover {
    opacity: 0.9;
  }

  .seat-effect-card :global(.seat-effect-card__image) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .seat-effect-card__placeholder {
    width: 100%;
    height: 100%;
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 0.18rem;
  }

  .seat-effect-overflow {
    margin-left: 0.2rem;
    padding: 0.1rem 0.26rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.34);
    background: rgba(15, 23, 42, 0.88);
    color: #cbd5e1;
    font-size: 0.58rem;
    font-weight: 700;
    line-height: 1;
  }

  .seat-effect-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.22rem;
    margin-left: 0.28rem;
    max-width: 7.2rem;
    padding: 0.14rem 0.38rem;
    border-radius: 999px;
    border: 1px solid rgba(125, 211, 252, 0.3);
    background: rgba(3, 105, 161, 0.22);
    color: #e0f2fe;
    font-size: 0.58rem;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .seat-effect-pill__count {
    color: rgba(191, 219, 254, 0.92);
  }

  .seat-lane--priority :global(.board-zone) {
    box-shadow: 0 0 0 1px rgba(118, 199, 255, 0.18);
  }

  .seat-lane--turn :global(.board-zone) {
    background-image: linear-gradient(180deg, rgba(255, 214, 143, 0.04), rgba(255, 214, 143, 0));
  }

  .bar-zones {
    --bar-row-card-aspect: 1.21927;
    /* Tie ink card height to seat-lane height so ink stays ~half of play-card height.
   Derivation: play_h ≈ 0.6667 × (lane_h - bar_h - bands); solving for ink_h ≈ 0.5 × play_h
   gives ink_h ≈ 0.25 × lane_h - 15px. Clamped to keep readable at extremes. */
    --bar-row-card-height: clamp(36px, calc(25cqh - 15px), 64px);
    --bar-row-card-width: calc(var(--bar-row-card-height) * var(--bar-row-card-aspect));
    --zone-card-height: var(--bar-row-card-height);
    --zone-card-width: var(--bar-row-card-width);
    --side-zone-width: calc(var(--zone-card-width) + 0.5rem);
    --bar-shell-padding: 0.26rem;
    --bar-shell-radius: 12px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--side-zone-width) var(--side-zone-width);
    align-items: stretch;
    width: 100%;
    height: 90px;
    min-height: 90px;
    max-height: 90px;
    padding: 0.42rem;
    gap: 0.35rem;
    border: 1px solid rgba(103, 147, 192, 0.18);
    border-radius: 14px;
    background:
      linear-gradient(180deg, rgba(8, 18, 31, 0.72) 0%, rgba(7, 14, 24, 0.56) 100%),
      linear-gradient(90deg, rgba(120, 170, 218, 0.05) 0%, rgba(120, 170, 218, 0) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      inset 0 0 0 1px rgba(148, 163, 184, 0.04);
    container-type: inline-size;
  }

  .bar-zone-shell {
    position: relative;
    display: flex;
    min-width: 0;
    min-height: 0;
    padding: var(--bar-shell-padding);
    border-radius: var(--bar-shell-radius);
    border: 1px solid rgba(110, 149, 192, 0.2);
    background:
      linear-gradient(180deg, rgba(14, 27, 45, 0.56) 0%, rgba(10, 18, 31, 0.32) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      inset 0 0 0 1px rgba(255, 255, 255, 0.02);
  }

  .seat-lane--top .bar-zone-shell {
    background:
      linear-gradient(180deg, rgba(54, 27, 23, 0.54) 0%, rgba(28, 14, 12, 0.34) 100%);
    border-color: rgba(188, 120, 102, 0.2);
  }

  .bar-zone-shell--side {
    align-items: stretch;
    justify-content: stretch;
  }

  .bar-zone-shell--inkwell,
  .bar-zone-shell--items {
    flex: 1 1 0;
  }

  .bar-zone-shell--inkwell {
    padding: 0;
  }

  .bar-zone-shell--items {
    padding: 0;
  }

  .bar-zones__center-viewport {
    min-width: 0;
    min-height: 0;
    overflow: visible;
  }

  .bar-zones__center-content {
    display: flex;
    align-items: stretch;
    gap: 0.35rem;
    min-width: 100%;
    width: 100%;
    height: 100%;
  }

  .bar-zones__center-content--with-items {
    width: 100%;
  }

  @container (max-width: 400px) {
    .bar-zones {
      --bar-row-card-height: 52px;
    }
  }

  .bar-zones :global(.discard-zone),
  .bar-zones :global(.deck-zone) {
    min-width: var(--side-zone-width);
    min-height: var(--zone-card-height, 70px);
  }

  .bar-zones :global(.inkwell-container) {
    min-width: 160px;
  }

  .bar-zones :global(.item-zone) {
    min-width: 132px;
  }

  .bar-zones :global(.inkwell-container),
  .bar-zones :global(.item-zone) {
    height: 100%;
    max-width: none;
    flex: 1 1 0;
    min-width: 0;
  }

  .bar-zone-shell :global(
      .inkwell-container:not(.inkwell-container--drop-preview):not(.inkwell-container--drop-valid):not(
          .inkwell-container--drop-invalid
        )
    ) {
    width: 100%;
    height: 100%;
    --ink-card-width: var(--bar-row-card-width);
    --ink-card-height: var(--bar-row-card-height);
    --ink-card-gap: 0.25rem;
    padding: 0;
    border: none;
    border-radius: calc(var(--bar-shell-radius) - 2px);
    background: transparent;
    box-shadow: none;
  }

  .bar-zone-shell :global(.item-zone) {
    width: 100%;
    height: 100%;
    --item-zone-card-height: clamp(64px, calc(var(--bar-row-card-height) + 24px), 76px);
    --item-zone-card-width: calc(var(--item-zone-card-height) * var(--bar-row-card-aspect));
    --item-grid-gap: 0.25rem;
    --item-container-padding: 0;
    padding: 0;
    border: none;
    border-radius: calc(var(--bar-shell-radius) - 2px);
    background: transparent;
    box-shadow: none;
  }

  .bar-zone-shell :global(.discard-zone),
  .bar-zone-shell :global([data-zone-id="deck"]) {
    width: 100%;
    height: 100%;
    min-width: 0 !important;
    min-height: 0 !important;
    padding: 0;
    border: none;
    border-radius: calc(var(--bar-shell-radius) - 2px);
    background: transparent !important;
    box-shadow: none !important;
  }

  .bar-zone-shell :global(.discard-zone:hover),
  .bar-zone-shell :global([data-zone-id="deck"]:hover) {
    transform: none;
  }

  .seat-lane[data-layout-mode="mobile"] {
    gap: 0.25rem;
    padding: 0.22rem 0.25rem 0.2rem;
    border-radius: 14px;
  }

  .seat-lane[data-layout-mode="mobile"] {
    border-radius: 0;
  }

  .seat-lane[data-layout-mode="mobile"] .bar-zones {
    --bar-row-card-height: 36px;
    height: 52px;
    min-height: 52px;
    max-height: 52px;
    padding: 0;
    gap: 0;
  }

  .seat-lane[data-layout-mode="mobile"] .seat-chip {
    min-height: 1.15rem;
    padding-inline: 0.38rem;
    font-size: 0.52rem;
    letter-spacing: 0.08em;
  }

  @media (max-width: 600px) {
    .seat-lane {
      padding: 0.62rem 0.4rem 0.5rem;
      border-radius: 14px;
    }

    .seat-chip {
      min-height: 1.45rem;
      padding-inline: 0.52rem;
      font-size: 0.6rem;
      letter-spacing: 0.09em;
    }
  }

  @media (min-width: 1240px) {
    .bar-zones {
      --bar-row-card-height: var(--sim-side-zone-card-height, clamp(36px, calc(25cqh - 15px), 64px));
      min-height: calc(var(--zone-card-height) + 1.25rem);
      max-height: calc(var(--zone-card-height) + 1.25rem);
      height: calc(var(--zone-card-height) + 1.25rem);
      padding: clamp(0.3rem, 0.8cqh, 0.45rem);
    }
  }

  :global(.seat-lane-concede-dialog) {
    max-width: 24rem;
  }

  :global(.seat-lane-concede-dialog__header) {
    gap: 0.45rem;
  }

  :global(.seat-lane-concede-dialog__title) {
    font-size: 1rem;
    font-weight: 800;
  }

  :global(.seat-lane-concede-dialog__description) {
    color: rgba(71, 85, 105, 1);
  }

  :global(.seat-lane-concede-dialog__footer) {
    display: flex;
    justify-content: flex-end;
    gap: 0.65rem;
  }

  :global(.seat-lane-concede-dialog__button) {
    min-width: 7rem;
  }
</style>
