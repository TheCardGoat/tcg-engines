import type { CardInstanceId, PlayerId } from "@tcg/lorcana-types";
import type {
  ChoiceResolutionSelectionContext,
  LorcanaProjectedBagEffect,
  LorcanaProjectedBoardView,
  LorcanaProjectedPendingEffect,
  NameCardResolutionSelectionContext,
  OptionalResolutionSelectionContext,
  ResolutionExecutionOptions,
  ResolutionSelectionContext,
  ScryResolutionSelectionContext,
  TargetResolutionSelectionContext,
} from "@tcg/lorcana-engine";
import { SLOTTED_TARGET_SLOT_KEYS } from "@tcg/lorcana-engine";
import type { LorcanaCardType, LorcanaTargetDSL } from "@tcg/lorcana-types/targeting";

import { type ActivePromptEffect, buildPendingPromptQueue } from "./find-active-prompt";
import { revealedCardMatchesScryFilters } from "./scry-card-eligibility";
import { pickSurface } from "./surface/pick-surface";
import type {
  ActivePrompt,
  Interaction,
  InteractionSubmission,
  InteractionSurface,
  PlayerInteractionView,
  PromptQueueEntry,
  PromptScryDestination,
  PromptScryRevealedCard,
  PromptSlot,
  ViewerRole,
} from "./types/player-interaction-view";
import type { PromptCopyBadge, PromptCopyDescriptor, PromptKey } from "./types/prompt-keys";

const EMPTY_COPY: PromptCopyDescriptor = {
  titleKey: "prompt.target.choose-card",
  titleParams: {},
  badges: [],
};

const EMPTY_SUBMISSION: InteractionSubmission = {
  requestId: null,
  canSubmit: false,
  canCancel: false,
  autoRejected: false,
  submitPayload: null,
  cancelPayload: null,
};

const SLOT_LABEL_KEYS: Record<string, PromptKey> = {
  "move-damage:from": "prompt.slot.move-damage.from",
  "move-damage:to": "prompt.slot.move-damage.to",
  "move-to-location:subject": "prompt.slot.move-to-location.subject",
  "move-to-location:location": "prompt.slot.move-to-location.location",
  "shift-and-choose:chosenCard": "prompt.slot.shift-and-choose.chosen",
  "banish-and-play:banish": "prompt.slot.banish-and-play.banish",
  "banish-and-play:play": "prompt.slot.banish-and-play.play",
};

export type BuildPlayerInteractionViewOptions = {
  /**
   * Targets the chooser has tentatively selected in the UI session but not
   * yet submitted to the engine. Used to compute the active slot and the
   * `canSubmit` flag. When omitted, the view reflects only state already
   * acknowledged by the engine.
   */
  pendingSelectedCardIds?: readonly CardInstanceId[];
  pendingSelectedPlayerIds?: readonly PlayerId[];
  pendingActiveSlotIndex?: number | null;
  /**
   * Scry destination assignments the chooser has staged locally but not yet
   * submitted. Each entry maps a destination rule id to the ordered cards
   * the chooser placed there. When provided, the builder merges these into
   * `view.activePrompt.scryDestinations[].currentCardIds` and re-derives
   * `view.activePrompt.scryRevealed[].currentDestinationId / orderIndex`
   * so drag/tap interactions render in real time. When omitted, the view
   * reflects only `currentSelection.destinations` (engine-confirmed).
   *
   * `cards` accepts `string[]` so simulator session shapes pass through
   * without `CardInstanceId` brand casts at the boundary.
   */
  pendingScryAssignments?: ReadonlyArray<{
    id: string;
    zone: string;
    cards: readonly string[];
  }>;
};

/**
 * Build the renderer's contract from the engine's projected board.
 *
 * Pure function. No filtering, no legality decisions, no slot arithmetic
 * other than reading `SLOTTED_TARGET_SLOT_KEYS`. Drives ALL prompt
 * surfaces; the renderer is forbidden from re-deriving target legality.
 */
export function buildPlayerInteractionView(
  board: LorcanaProjectedBoardView,
  viewerId: PlayerId,
  options: BuildPlayerInteractionViewOptions = {},
): PlayerInteractionView {
  const queue = buildPendingPromptQueue(board);
  const promptQueue: PromptQueueEntry[] = queue.entries.map(toQueueEntry);

  if (!queue.active) {
    return {
      viewerId,
      viewerRole: "spectator",
      activePrompt: null,
      surface: "none",
      interactions: [],
      submission: EMPTY_SUBMISSION,
      copy: EMPTY_COPY,
      promptQueue,
      activeQueueIndex: -1,
      rawContext: null,
    };
  }

  const { selectionContext, requestId, effect } = queue.active;
  const controllerId = resolveControllerId(board, selectionContext, effect);
  const viewerRole = resolveViewerRole(viewerId, selectionContext.chooserId, controllerId);

  const activePrompt = buildActivePrompt(
    selectionContext,
    requestId,
    controllerId,
    board,
    options.pendingSelectedCardIds,
    options.pendingActiveSlotIndex,
    options.pendingScryAssignments,
  );
  const surface: InteractionSurface =
    viewerRole === "chooser" ? pickSurface(selectionContext) : "none";

  // Spectators and non-chooser-controllers see the prompt but no interactions.
  if (viewerRole !== "chooser") {
    return {
      viewerId,
      viewerRole,
      activePrompt,
      surface: "none",
      interactions: [],
      submission: {
        ...EMPTY_SUBMISSION,
        requestId,
        autoRejected: activePrompt.autoRejected,
      },
      copy: buildCopy(selectionContext),
      promptQueue,
      activeQueueIndex: queue.activeIndex,
      rawContext: selectionContext,
    };
  }

  const built = buildInteractionsForKind(selectionContext, options, board, controllerId);

  return {
    viewerId,
    viewerRole,
    activePrompt,
    surface,
    interactions: built.interactions,
    // Stamp requestId at the top level so every submission the renderer
    // ships back to the engine carries the prompt id it was built from.
    // The engine validates this in resolve-effect.ts (RESOLVE_EFFECT_NOT_PENDING).
    submission: { ...built.submission, requestId },
    copy: buildCopy(selectionContext),
    promptQueue,
    activeQueueIndex: queue.activeIndex,
    rawContext: selectionContext,
  };
}

function toQueueEntry(entry: ActivePromptEffect): PromptQueueEntry {
  return {
    requestId: entry.requestId,
    kind: entry.selectionContext.kind,
    chooserId: entry.selectionContext.chooserId,
    sourceCardId: entry.selectionContext.sourceCardId,
  };
}

function resolveControllerId(
  board: LorcanaProjectedBoardView,
  context: ResolutionSelectionContext,
  effect: LorcanaProjectedPendingEffect | LorcanaProjectedBagEffect,
): PlayerId {
  // Bag effects publish controllerId directly.
  if ("controllerId" in effect && effect.controllerId) {
    return effect.controllerId;
  }
  // Fall back to the source card's controller / owner. Some test snapshots
  // and partial projections may omit `board.cards` entirely; guard so the
  // builder degrades to the chooser-as-controller fallback instead of
  // throwing a TypeError on `undefined[key]`.
  const cards = board.cards as
    | Record<string, { controllerId?: PlayerId; ownerId?: PlayerId }>
    | undefined;
  const sourceCard = cards?.[context.sourceCardId as unknown as string];
  if (sourceCard) {
    return (sourceCard.controllerId ?? sourceCard.ownerId) as PlayerId;
  }
  // Last resort: the chooser is also the controller.
  return context.chooserId;
}

function resolveViewerRole(
  viewerId: PlayerId,
  chooserId: PlayerId,
  controllerId: PlayerId,
): ViewerRole {
  if (viewerId === chooserId) {
    return "chooser";
  }
  if (viewerId === controllerId) {
    return "non-chooser-controller";
  }
  return "spectator";
}

function buildActivePrompt(
  context: ResolutionSelectionContext,
  requestId: string,
  controllerId: PlayerId,
  board: LorcanaProjectedBoardView,
  pendingSelectedCardIds: BuildPlayerInteractionViewOptions["pendingSelectedCardIds"],
  pendingActiveSlotIndex: BuildPlayerInteractionViewOptions["pendingActiveSlotIndex"],
  pendingScry: BuildPlayerInteractionViewOptions["pendingScryAssignments"],
): ActivePrompt {
  if (context.kind === "target-selection" || context.kind === "discard-choice") {
    const selectedCardIds = resolveSelectedCardIds(context, pendingSelectedCardIds);
    return {
      requestId,
      kind: context.kind,
      chooserId: context.chooserId,
      controllerId,
      sourceCardId: context.sourceCardId,
      selectedCardIds: [...selectedCardIds],
      expectedSlottedKind: context.expectedSlottedKind ?? null,
      activeSlotIndex: computeActiveSlotIndex(
        context,
        selectedCardIds,
        pendingActiveSlotIndex,
        board,
      ),
      slots: buildSlots(context, selectedCardIds, board),
      autoResolvedSlotCount: countAutoResolvedSlots(context),
      minSelections: context.minSelections,
      maxSelections: context.maxSelections,
      declaredMaxSelections: context.declaredMaxSelections ?? null,
      autoRejected: context.autoRejected,
      scryDestinations: null,
      scryRevealed: null,
    };
  }
  if (context.kind === "scry-selection") {
    return {
      requestId,
      kind: context.kind,
      chooserId: context.chooserId,
      controllerId,
      sourceCardId: context.sourceCardId,
      selectedCardIds: [],
      expectedSlottedKind: null,
      activeSlotIndex: null,
      slots: null,
      autoResolvedSlotCount: 0,
      minSelections: 0,
      maxSelections: 0,
      declaredMaxSelections: null,
      autoRejected: false,
      scryDestinations: buildScryDestinations(context, pendingScry),
      scryRevealed: buildScryRevealed(context, pendingScry),
    };
  }
  return {
    requestId,
    kind: context.kind,
    chooserId: context.chooserId,
    controllerId,
    sourceCardId: context.sourceCardId,
    selectedCardIds:
      context.kind === "choice-selection"
        ? ([...(context.currentSelection.targets ?? [])] as CardInstanceId[])
        : [],
    expectedSlottedKind: null,
    activeSlotIndex: null,
    slots: null,
    autoResolvedSlotCount: 0,
    minSelections: 0,
    maxSelections: 0,
    declaredMaxSelections: null,
    autoRejected: false,
    scryDestinations: null,
    scryRevealed: null,
  };
}

/**
 * Slot keys the engine auto-resolved to the source card. Reads
 * `context.autoResolvedSlots` (engine-surfaced as of gap #15 fix) and
 * intersects with the canonical slot ordering so the UI can ask which
 * positions are locked-to-source.
 *
 * Fallback: when the engine has not surfaced `autoResolvedSlots` (older
 * snapshots, or kinds not yet annotated) we infer the **trailing** slots
 * from `maxSelections < totalSlots` for `move-damage`. Trailing rather
 * than leading because every Lorcana descriptor that compresses a slot
 * to the source uses `to: SELF` (Luisa, Isabela, Madam Mim). The previous
 * "leading slots" fallback flipped FROM and TO for those cards and
 * produced submissions the engine silently rejected.
 */
function getAutoResolvedSlotIndices(context: TargetResolutionSelectionContext): readonly number[] {
  if (!context.expectedSlottedKind) return [];
  const slotKeys = SLOTTED_TARGET_SLOT_KEYS[context.expectedSlottedKind];
  const declared = context.autoResolvedSlots;
  if (declared && declared.length > 0) {
    const declaredSet = new Set<string>(declared);
    const indices: number[] = [];
    slotKeys.forEach((key, index) => {
      if (declaredSet.has(key)) {
        indices.push(index);
      }
    });
    return indices;
  }
  if (context.expectedSlottedKind !== "move-damage") return [];
  if (context.maxSelections <= 0 || context.maxSelections >= slotKeys.length) return [];
  const trailingCount = slotKeys.length - context.maxSelections;
  const indices: number[] = [];
  for (let i = slotKeys.length - trailingCount; i < slotKeys.length; i += 1) {
    indices.push(i);
  }
  return indices;
}

function countAutoResolvedSlots(context: TargetResolutionSelectionContext): number {
  return getAutoResolvedSlotIndices(context).length;
}

function isAutoResolvedSlotIndex(
  context: TargetResolutionSelectionContext,
  index: number,
): boolean {
  return getAutoResolvedSlotIndices(context).includes(index);
}

function resolveSelectedCardIds(
  context: TargetResolutionSelectionContext,
  pendingSelectedCardIds: BuildPlayerInteractionViewOptions["pendingSelectedCardIds"],
): readonly CardInstanceId[] {
  return pendingSelectedCardIds ?? ((context.currentSelection.targets ?? []) as CardInstanceId[]);
}

function buildSlots(
  context: TargetResolutionSelectionContext,
  selectedCardIds: readonly CardInstanceId[] = resolveSelectedCardIds(context, undefined),
  board?: LorcanaProjectedBoardView,
): PromptSlot[] | null {
  if (!context.expectedSlottedKind) {
    return null;
  }
  const slottedKind = context.expectedSlottedKind;
  const keys = SLOTTED_TARGET_SLOT_KEYS[slottedKind];
  const moveToLocationSelection =
    slottedKind === "move-to-location" && board
      ? splitMoveToLocationSelection(
          board,
          selectedCardIds,
          getFixedMoveToLocationId(board, context),
        )
      : null;

  const autoResolvedIndices = getAutoResolvedSlotIndices(context);
  const autoResolvedSet = new Set<number>(autoResolvedIndices);

  return keys.map((key, index) => {
    let targetCardId: CardInstanceId | null;
    let autoResolved: boolean;
    if (autoResolvedSet.has(index)) {
      targetCardId = context.sourceCardId;
      autoResolved = true;
    } else {
      const filledIndex = countChooserSlotsBefore(autoResolvedIndices, index);
      const fixedMoveLocation =
        slottedKind === "move-to-location" && key === "location"
          ? getFixedMoveToLocationId(board, context)
          : null;
      targetCardId =
        slottedKind === "move-to-location" && key === "location"
          ? (fixedMoveLocation ?? moveToLocationSelection?.location ?? null)
          : slottedKind === "move-to-location" && key === "subject"
            ? (moveToLocationSelection?.subjects[0] ?? selectedCardIds[filledIndex] ?? null)
            : filledIndex < selectedCardIds.length
              ? selectedCardIds[filledIndex]
              : null;
      autoResolved = fixedMoveLocation !== null;
    }
    return {
      key,
      index,
      labelKey: SLOT_LABEL_KEYS[`${slottedKind}:${key}`] ?? "prompt.target.choose-card",
      autoResolved,
      locked: targetCardId !== null,
      targetCardId,
    };
  });
}

/**
 * Number of chooser-filled (non-auto-resolved) slots that appear *before*
 * the given visible slot index. Lets us index into the flat
 * `selectedCardIds` array correctly when auto-resolved slots are
 * interleaved with chooser slots — e.g. `move-damage` with `to: SELF`
 * has chooser=from at index 0 and auto=to at index 1, while `from: SELF`
 * has auto=from at index 0 and chooser=to at index 1.
 */
function countChooserSlotsBefore(
  autoResolvedIndices: readonly number[],
  slotIndex: number,
): number {
  let count = 0;
  for (let i = 0; i < slotIndex; i += 1) {
    if (!autoResolvedIndices.includes(i)) {
      count += 1;
    }
  }
  return count;
}

function getProjectedCardType(
  board: LorcanaProjectedBoardView,
  cardId: CardInstanceId,
): string | null {
  const cards = board.cards as Record<string, { cardType?: string; type?: string }> | undefined;
  const card = cards?.[cardId as unknown as string];
  return card?.cardType ?? card?.type ?? null;
}

function splitMoveToLocationSelection(
  board: LorcanaProjectedBoardView,
  selectedCardIds: readonly CardInstanceId[],
  fixedLocationId: CardInstanceId | null = null,
): { subjects: CardInstanceId[]; location: CardInstanceId | null } {
  const subjects: CardInstanceId[] = [];
  let location: CardInstanceId | null = fixedLocationId;

  for (const cardId of selectedCardIds) {
    if (getProjectedCardType(board, cardId) === "location") {
      location = fixedLocationId ?? cardId;
    } else {
      subjects.push(cardId);
    }
  }

  return { subjects, location };
}

function getProjectedAtLocationId(
  board: LorcanaProjectedBoardView | undefined,
  cardId: CardInstanceId,
): CardInstanceId | null {
  const cards = board?.cards as
    | Record<string, { atLocationId?: CardInstanceId; cardType?: string }>
    | undefined;
  const atLocationId = cards?.[cardId as unknown as string]?.atLocationId;
  if (!atLocationId) {
    return null;
  }
  return cards?.[atLocationId as unknown as string]?.cardType === "location" ? atLocationId : null;
}

function getFixedMoveToLocationId(
  board: LorcanaProjectedBoardView | undefined,
  context: TargetResolutionSelectionContext,
): CardInstanceId | null {
  if (context.expectedSlottedKind !== "move-to-location") {
    return null;
  }
  if (context.targetDsl.length !== 1) {
    return null;
  }
  return getProjectedAtLocationId(board, context.sourceCardId);
}

function computeActiveSlotIndex(
  context: TargetResolutionSelectionContext,
  selectedCardIds: readonly CardInstanceId[] = resolveSelectedCardIds(context, undefined),
  pendingActiveSlotIndex?: number | null,
  board?: LorcanaProjectedBoardView,
): number | null {
  if (!context.expectedSlottedKind) {
    return null;
  }
  const keys = SLOTTED_TARGET_SLOT_KEYS[context.expectedSlottedKind];
  if (
    typeof pendingActiveSlotIndex === "number" &&
    pendingActiveSlotIndex >= 0 &&
    pendingActiveSlotIndex < keys.length
  ) {
    return pendingActiveSlotIndex;
  }
  if (getFixedMoveToLocationId(board, context)) {
    return 0;
  }
  // The active slot is the first chooser-fillable (non-auto-resolved) slot
  // that has not yet received a selection. Auto-resolved slots are skipped
  // regardless of their position so `to: SELF` cards (Luisa) advance
  // through `from` (index 0) before the auto-locked `to` (index 1), while
  // `from: SELF` cards (Nero) leave `from` auto-locked and advance through
  // `to` (index 1).
  const autoResolvedIndices = getAutoResolvedSlotIndices(context);
  const chooserIndices = keys
    .map((_, index) => index)
    .filter((index) => !autoResolvedIndices.includes(index));
  if (chooserIndices.length === 0) {
    return keys.length - 1;
  }
  const nextChooserPosition = Math.min(selectedCardIds.length, chooserIndices.length - 1);
  return chooserIndices[nextChooserPosition];
}

/**
 * Sub-builders return submissions without `requestId` set; the top-level
 * `buildPlayerInteractionView` stamps it once for every viewer/kind path,
 * so individual `build*Interactions` helpers don't have to thread it.
 */
type BuiltInteractions = {
  interactions: Interaction[];
  submission: Omit<InteractionSubmission, "requestId">;
};

function buildInteractionsForKind(
  context: ResolutionSelectionContext,
  options: BuildPlayerInteractionViewOptions,
  board: LorcanaProjectedBoardView,
  controllerId: PlayerId,
): BuiltInteractions {
  switch (context.kind) {
    case "target-selection":
    case "discard-choice":
      return buildTargetInteractions(context, options, board, controllerId);
    case "choice-selection":
      return buildChoiceInteractions(context);
    case "optional-selection":
      return buildOptionalInteractions(context);
    case "name-card-selection":
      return buildNameCardInteractions(context);
    case "scry-selection":
      return buildScryInteractions(context, options.pendingScryAssignments);
    default:
      // Runtime guard for engine kinds added before the interaction layer
      // catches up. The exhaustiveness check above will fail compile when
      // `ResolutionSelectionKind` gains a new variant; this default keeps
      // the renderer surfaceing an explicit "unsupported" banner instead of
      // a frozen overlay until the new variant is wired.
      return assertNeverResolutionKind(context);
  }
}

function assertNeverResolutionKind(context: never): BuiltInteractions {
  const kind =
    typeof context === "object" && context !== null && "kind" in context
      ? String((context as { kind: unknown }).kind)
      : "unknown";
  return {
    interactions: [
      {
        kind: "unsupported",
        reason: `Resolution kind '${kind}' is not bridged by @tcg/lorcana-interaction yet.`,
      },
    ],
    submission: {
      canSubmit: false,
      canCancel: false,
      autoRejected: false,
      submitPayload: null,
      cancelPayload: null,
    },
  };
}

function buildTargetInteractions(
  context: TargetResolutionSelectionContext,
  options: BuildPlayerInteractionViewOptions,
  board: LorcanaProjectedBoardView,
  controllerId: PlayerId,
): BuiltInteractions {
  if (context.autoRejected) {
    return {
      interactions: [],
      submission: {
        canSubmit: false,
        canCancel: Boolean(context.canDeclineSelection),
        autoRejected: true,
        submitPayload: null,
        cancelPayload: context.canDeclineSelection ? buildCancelPayload(context) : null,
      },
    };
  }

  const interactions: Interaction[] = [];
  const selectedCardIds = resolveSelectedCardIds(context, options.pendingSelectedCardIds);
  const slotIndex =
    computeActiveSlotIndex(context, selectedCardIds, options.pendingActiveSlotIndex) ??
    computeTargetDslIndex(context, selectedCardIds);
  const cardCandidateIds = filterCardCandidatesForActiveSlot({
    board,
    context,
    controllerId,
    selectedCardIds,
    slotIndex,
  });

  for (const cardId of cardCandidateIds) {
    interactions.push({
      kind: "select-card",
      cardId,
      slotIndex,
      payload: buildTargetPayload(context, [cardId], [], board, selectedCardIds, slotIndex),
    });
  }
  for (const playerId of context.playerCandidateIds) {
    interactions.push({
      kind: "select-player",
      playerId,
      payload: buildTargetPayload(context, [], [playerId]),
    });
  }

  if (context.canDeclineSelection || context.originatesFromOptional) {
    interactions.push({
      kind: "decline-target-prompt",
      payload: buildCancelPayload(context),
    });
  }

  const pendingCount =
    (options.pendingSelectedCardIds?.length ?? 0) + (options.pendingSelectedPlayerIds?.length ?? 0);
  const fixedMoveToLocationId =
    context.expectedSlottedKind === "move-to-location"
      ? getFixedMoveToLocationId(board, context)
      : null;
  const moveToLocationSelection =
    context.expectedSlottedKind === "move-to-location"
      ? splitMoveToLocationSelection(board, selectedCardIds, fixedMoveToLocationId)
      : null;
  const moveToLocationSelectionCount =
    moveToLocationSelection !== null
      ? moveToLocationSelection.subjects.length + (moveToLocationSelection.location ? 1 : 0)
      : 0;
  const confirmedCardSelectionCount = context.currentSelection.targets?.length ?? 0;
  const moveToLocationUserSelectionCount =
    moveToLocationSelection !== null
      ? Math.max(0, selectedCardIds.length - confirmedCardSelectionCount)
      : 0;
  const canSubmit =
    moveToLocationSelection !== null
      ? moveToLocationSelection.subjects.length > 0 &&
        moveToLocationSelection.location !== null &&
        moveToLocationSelectionCount >= context.minSelections &&
        (context.maxSelections <= 0 || moveToLocationUserSelectionCount <= context.maxSelections)
      : pendingCount >= context.minSelections;

  return {
    interactions,
    submission: {
      canSubmit,
      canCancel: Boolean(context.canDeclineSelection || context.originatesFromOptional),
      autoRejected: false,
      submitPayload: canSubmit
        ? buildTargetSubmissionPayload(
            context,
            selectedCardIds,
            options.pendingSelectedPlayerIds ?? [],
            board,
          )
        : null,
      cancelPayload:
        context.canDeclineSelection || context.originatesFromOptional
          ? buildCancelPayload(context)
          : null,
    },
  };
}

function buildTargetPayload(
  context: TargetResolutionSelectionContext,
  selectedCards: readonly CardInstanceId[],
  selectedPlayers: readonly PlayerId[],
  board?: LorcanaProjectedBoardView,
  baseSelectedCards: readonly CardInstanceId[] = resolveSelectedCardIds(context, undefined),
  explicitActiveSlotIndex?: number,
): ResolutionExecutionOptions {
  // Slotted-target serialization: when the engine flagged
  // `expectedSlottedKind`, the UI MUST submit a slotted object instead of
  // a flat array. We build a fresh slotted shape using:
  //   - source card for auto-resolved slots
  //   - engine-confirmed selections (currentSelection.targets) for the
  //     already-filled visible slots
  //   - the new pick(s) appended at the active slot
  if (context.expectedSlottedKind && selectedCards.length > 0) {
    if (context.expectedSlottedKind === "move-to-location" && board) {
      const fixedLocationId = getFixedMoveToLocationId(board, context);
      const base = splitMoveToLocationSelection(board, baseSelectedCards, fixedLocationId);
      const next = splitMoveToLocationSelection(board, selectedCards, fixedLocationId);
      return {
        targets: {
          kind: "move-to-location",
          subject: [...base.subjects, ...next.subjects],
          location: fixedLocationId
            ? [fixedLocationId]
            : next.location
              ? [next.location]
              : base.location
                ? [base.location]
                : [],
        },
      };
    }

    const slotKeys = SLOTTED_TARGET_SLOT_KEYS[context.expectedSlottedKind];
    const autoResolvedIndices = getAutoResolvedSlotIndices(context);
    const autoResolvedSet = new Set<number>(autoResolvedIndices);
    const chooserIndices = slotKeys
      .map((_, index) => index)
      .filter((index) => !autoResolvedSet.has(index));
    const slotted: Record<string, CardInstanceId[]> = {};
    for (let i = 0; i < slotKeys.length; i += 1) {
      if (autoResolvedSet.has(i)) {
        slotted[slotKeys[i]] = [context.sourceCardId];
      } else {
        const chooserPosition = chooserIndices.indexOf(i);
        slotted[slotKeys[i]] =
          chooserPosition < baseSelectedCards.length ? [baseSelectedCards[chooserPosition]] : [];
      }
    }
    // Active slot: prefer the caller's explicit override; otherwise the
    // next unfilled chooser slot (clamped to the last chooser slot).
    let activeSlotIndex: number;
    if (typeof explicitActiveSlotIndex === "number") {
      activeSlotIndex = explicitActiveSlotIndex;
    } else if (chooserIndices.length === 0) {
      activeSlotIndex = slotKeys.length - 1;
    } else {
      const nextChooserPosition = Math.min(baseSelectedCards.length, chooserIndices.length - 1);
      activeSlotIndex = chooserIndices[nextChooserPosition];
    }
    const activeSlotKey = slotKeys[activeSlotIndex];
    slotted[activeSlotKey] = [...slotted[activeSlotKey], ...selectedCards];
    return {
      targets: {
        kind: context.expectedSlottedKind,
        ...slotted,
      } as ResolutionExecutionOptions["targets"],
    };
  }

  if (selectedPlayers.length > 0 && selectedCards.length === 0) {
    return { playerTargets: selectedPlayers as PlayerId[] };
  }

  return { targets: [...selectedCards, ...selectedPlayers] };
}

function buildTargetSubmissionPayload(
  context: TargetResolutionSelectionContext,
  selectedCards: readonly CardInstanceId[],
  selectedPlayers: readonly PlayerId[],
  board?: LorcanaProjectedBoardView,
): ResolutionExecutionOptions {
  if (context.expectedSlottedKind && selectedCards.length > 0) {
    if (context.expectedSlottedKind === "move-to-location" && board) {
      const fixedLocationId = getFixedMoveToLocationId(board, context);
      const selected = splitMoveToLocationSelection(board, selectedCards, fixedLocationId);
      return {
        targets: {
          kind: "move-to-location",
          subject: selected.subjects,
          location: fixedLocationId
            ? [fixedLocationId]
            : selected.location
              ? [selected.location]
              : [],
        },
      };
    }

    const slotKeys = SLOTTED_TARGET_SLOT_KEYS[context.expectedSlottedKind];
    const autoResolvedIndices = getAutoResolvedSlotIndices(context);
    const autoResolvedSet = new Set<number>(autoResolvedIndices);
    const chooserIndices = slotKeys
      .map((_, index) => index)
      .filter((index) => !autoResolvedSet.has(index));
    const slotted: Record<string, CardInstanceId[]> = {};

    for (let i = 0; i < slotKeys.length; i += 1) {
      if (autoResolvedSet.has(i)) {
        slotted[slotKeys[i]] = [context.sourceCardId];
      } else {
        const chooserPosition = chooserIndices.indexOf(i);
        slotted[slotKeys[i]] =
          chooserPosition < selectedCards.length ? [selectedCards[chooserPosition]] : [];
      }
    }

    return {
      targets: {
        kind: context.expectedSlottedKind,
        ...slotted,
      } as ResolutionExecutionOptions["targets"],
    };
  }

  if (selectedPlayers.length > 0 && selectedCards.length === 0) {
    return { playerTargets: selectedPlayers as PlayerId[] };
  }

  return { targets: [...selectedCards, ...selectedPlayers] };
}

function computeTargetDslIndex(
  context: TargetResolutionSelectionContext,
  selectedCardIds: readonly CardInstanceId[],
): number {
  if (context.targetDsl.length <= 1) {
    return 0;
  }

  return Math.min(selectedCardIds.length, context.targetDsl.length - 1);
}

function filterCardCandidatesForActiveSlot(params: {
  board: LorcanaProjectedBoardView;
  context: TargetResolutionSelectionContext;
  controllerId: PlayerId;
  selectedCardIds: readonly CardInstanceId[];
  slotIndex: number;
}): CardInstanceId[] {
  const { board, context, controllerId, selectedCardIds, slotIndex } = params;
  if (context.expectedSlottedKind === "move-to-location") {
    const fixedLocationId = getFixedMoveToLocationId(board, context);
    const selected = new Set<string>(selectedCardIds.map(String));
    if (fixedLocationId) {
      return context.cardCandidateIds.filter((cardId) => !selected.has(String(cardId)));
    }
    // This prompt has two asymmetric buckets: many characters and one
    // destination. Keep all engine candidates clickable so the UI can toggle
    // characters and replace the location by card type instead of forcing a
    // brittle "current slot" mode.
    return [...context.cardCandidateIds];
  }

  // Map the slot index to a target-DSL index by counting only chooser slots.
  // For `move-damage` with `to: SELF` (Luisa) the chooser slot is 0, so the
  // DSL index is 0 even though slotIndex is 0 and no slot is auto-leading.
  // For `from: SELF` (Nero) the chooser slot is 1, mapping to DSL index 0
  // (the engine only ships one DSL entry for the user-chosen slot).
  const targetDslIndex = context.expectedSlottedKind
    ? countChooserSlotsBefore(getAutoResolvedSlotIndices(context), slotIndex)
    : slotIndex;
  const target = context.targetDsl[targetDslIndex] ?? null;
  if (!target) {
    return [...context.cardCandidateIds];
  }

  const selected = new Set<string>(selectedCardIds.map(String));

  return context.cardCandidateIds.filter((cardId) => {
    if (selected.has(String(cardId))) {
      return false;
    }

    const card = board.cards[String(cardId)];
    if (!card) {
      return false;
    }

    if (hasExcludeSelf(target) && String(cardId) === String(context.sourceCardId)) {
      return false;
    }

    const zones = getTargetZones(target);
    if (zones && !zones.includes(card.zone)) {
      return false;
    }

    const allowedCardTypes = getAllowedCardTypes(target);
    if (allowedCardTypes.length > 0 && card.cardType && !allowedCardTypes.includes(card.cardType)) {
      return false;
    }

    const ownerId = card.controllerId ?? card.ownerId;
    const owner = getTargetOwner(target);
    if (owner === "you" && ownerId !== controllerId) {
      return false;
    }

    if (owner === "opponent" && ownerId === controllerId) {
      return false;
    }

    return true;
  });
}

function getAllowedCardTypes(target: LorcanaTargetDSL): LorcanaCardType[] {
  const cardTypes = getTargetCardTypes(target)?.filter(isLorcanaCardType) ?? [];
  if ("cardType" in target && isLorcanaCardType(target.cardType)) {
    return [...new Set([...cardTypes, target.cardType])];
  }

  return cardTypes;
}

function isLorcanaCardType(value: string | undefined): value is LorcanaCardType {
  return value === "character" || value === "action" || value === "item" || value === "location";
}

function hasExcludeSelf(target: LorcanaTargetDSL): boolean {
  return "excludeSelf" in target && target.excludeSelf === true;
}

function getTargetZones(target: LorcanaTargetDSL): readonly string[] | undefined {
  return "zones" in target ? target.zones : undefined;
}

function getTargetOwner(target: LorcanaTargetDSL): "you" | "opponent" | "any" | undefined {
  if (!("owner" in target)) {
    return undefined;
  }

  return target.owner === "you" || target.owner === "opponent" || target.owner === "any"
    ? target.owner
    : undefined;
}

function getTargetCardTypes(target: LorcanaTargetDSL): readonly string[] | undefined {
  return "cardTypes" in target ? target.cardTypes : undefined;
}

function buildCancelPayload(context: TargetResolutionSelectionContext): ResolutionExecutionOptions {
  if (context.originatesFromOptional) {
    return { resolveOptional: false };
  }
  return { targets: [] };
}

function buildChoiceInteractions(context: ChoiceResolutionSelectionContext): BuiltInteractions {
  const interactions: Interaction[] = context.options.map((option) => ({
    kind: "select-choice",
    index: option.index,
    label: option.label,
    legal: option.legal,
    payload: { choiceIndex: option.index },
  }));
  return {
    interactions,
    submission: {
      canSubmit: false,
      canCancel: false,
      autoRejected: false,
      submitPayload: null,
      cancelPayload: null,
    },
  };
}

function buildOptionalInteractions(context: OptionalResolutionSelectionContext): BuiltInteractions {
  const interactions: Interaction[] = [
    {
      kind: "accept-optional",
      acceptLabel: context.acceptLabel,
      payload: { resolveOptional: true },
    },
    {
      kind: "decline-optional",
      rejectLabel: context.rejectLabel,
      payload: { resolveOptional: false },
    },
  ];
  return {
    interactions,
    submission: {
      canSubmit: false,
      canCancel: false,
      autoRejected: false,
      submitPayload: null,
      cancelPayload: null,
    },
  };
}

function buildNameCardInteractions(
  _context: NameCardResolutionSelectionContext,
): BuiltInteractions {
  const interactions: Interaction[] = [
    {
      kind: "name-card",
      buildPayload: (namedCard) => ({ namedCard }),
    },
  ];
  return {
    interactions,
    submission: {
      canSubmit: false,
      canCancel: false,
      autoRejected: false,
      submitPayload: null,
      cancelPayload: null,
    },
  };
}

/**
 * Determine whether a destination supports manual ordering by the chooser.
 *
 * Mirrors the simulator's `isScryDestinationManuallyOrdered` heuristic so the
 * view + the existing renderer agree without re-deriving the rule. Manual
 * ordering applies to deck-top / deck-bottom rows when the engine doesn't
 * pin a specific ordering (or pins `player-choice`).
 */
function isScryDestinationOrderingEnabled(
  rule: ScryResolutionSelectionContext["destinationRules"][number],
): boolean {
  if (rule.zone !== "deck-top" && rule.zone !== "deck-bottom") {
    return false;
  }
  return rule.ordering === undefined || rule.ordering === "player-choice";
}

/**
 * Best-effort English label fallback when the engine doesn't supply
 * `rule.label`. The renderer is free to localize zone labels separately
 * (e.g. via `getScryZoneLabel`); this fallback exists so consumers always
 * see *something* for non-standard zones.
 */
function fallbackScryDestinationLabel(zone: string): string {
  return `to ${zone}`;
}

/**
 * Resolve the cards currently in a destination, preferring the chooser's
 * staged pending assignment over the engine-confirmed
 * `currentSelection.destinations`. This is what makes scry tap/drag
 * interactions render in real time (gap #18 / #3).
 */
function resolveDestinationCards(
  rule: ScryResolutionSelectionContext["destinationRules"][number],
  context: ScryResolutionSelectionContext,
  pending: BuildPlayerInteractionViewOptions["pendingScryAssignments"],
): readonly CardInstanceId[] {
  const pendingMatch = pending?.find((entry) => entry.id === rule.id);
  if (pendingMatch) {
    return pendingMatch.cards as readonly CardInstanceId[];
  }
  const engineMatch = (context.currentSelection.destinations ?? []).find(
    (entry) => entry.zone === rule.zone,
  );
  return (engineMatch?.cards ?? []) as CardInstanceId[];
}

function buildScryDestinations(
  context: ScryResolutionSelectionContext,
  pending: BuildPlayerInteractionViewOptions["pendingScryAssignments"],
): PromptScryDestination[] {
  return context.destinationRules.map((rule) => ({
    id: rule.id,
    zone: rule.zone,
    label: rule.label ?? fallbackScryDestinationLabel(rule.zone),
    min: rule.min,
    max: rule.max,
    remainder: rule.remainder,
    orderingEnabled: isScryDestinationOrderingEnabled(rule),
    currentCardIds: [...resolveDestinationCards(rule, context, pending)],
    ...(rule.exclusiveGroup ? { exclusiveGroup: rule.exclusiveGroup } : {}),
  }));
}

function buildScryRevealed(
  context: ScryResolutionSelectionContext,
  pending: BuildPlayerInteractionViewOptions["pendingScryAssignments"],
): PromptScryRevealedCard[] {
  const revealed =
    context.revealedCards.length > 0
      ? context.revealedCards.map((card) => ({
          cardId: card.cardId,
          label: card.label,
          ...(card.cardType ? { cardType: card.cardType } : {}),
          ...(card.actionSubtype ? { actionSubtype: card.actionSubtype } : {}),
          ...(typeof card.cost === "number" ? { cost: card.cost } : {}),
          ...(card.classifications ? { classifications: [...card.classifications] } : {}),
        }))
      : context.revealedCardIds.map((cardId) => ({
          cardId,
          label: String(cardId),
        }));

  // Build a lookup: cardId -> { destinationId, orderIndex }, preferring
  // pending assignments. Iterate per-rule so that destinationId always
  // matches the rule (not the engine zone).
  const placement = new Map<string, { destinationId: string; orderIndex: number }>();
  for (const rule of context.destinationRules) {
    const cards = resolveDestinationCards(rule, context, pending);
    cards.forEach((cardId, idx) => {
      placement.set(String(cardId), { destinationId: rule.id, orderIndex: idx });
    });
  }

  return revealed.map((card) => {
    const slot = placement.get(String(card.cardId));
    const eligibleDestinationIds: string[] = [];
    for (const rule of context.destinationRules) {
      // Remainder destinations have no filter — anything unassigned lands
      // there. Treat them as universally eligible so the UI can always offer
      // them as a fallback drop target.
      if (rule.remainder || revealedCardMatchesScryFilters(rule.filters, card)) {
        eligibleDestinationIds.push(rule.id);
      }
    }
    return {
      ...card,
      currentDestinationId: slot?.destinationId ?? null,
      orderIndex: slot?.orderIndex ?? null,
      eligibleDestinationIds,
    };
  });
}

/**
 * Whether a chooser's tentative arrangement satisfies every destination's
 * `min`/`max` constraints. A destination flagged as `remainder` absorbs any
 * unassigned revealed cards, so we treat it as having an effective count of
 * (currentCount + unassignedCount).
 */
function isScryArrangementSubmittable(
  destinations: readonly PromptScryDestination[],
  unassignedCount: number,
  totalRevealed: number,
): boolean {
  if (destinations.length === 0) {
    return false;
  }
  // Disjointness: no card may appear in more than one destination. The
  // builder's `resolveDestinationCards` is supposed to guarantee this, but
  // we validate at the submission boundary so a buggy upstream merge
  // cannot ship a payload that double-counts a card.
  const seen = new Set<string>();
  let assignedTotal = 0;
  for (const destination of destinations) {
    for (const cardId of destination.currentCardIds) {
      const key = String(cardId);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      assignedTotal += 1;
    }
  }
  // Conservation: assigned + unassigned must equal the revealed set.
  if (assignedTotal + unassignedCount !== totalRevealed) {
    return false;
  }
  const remainder = destinations.find((destination) => destination.remainder);
  for (const destination of destinations) {
    const effectiveCount =
      destination.id === remainder?.id
        ? destination.currentCardIds.length + unassignedCount
        : destination.currentCardIds.length;
    if (effectiveCount < destination.min) {
      return false;
    }
    if (destination.max !== null && effectiveCount > destination.max) {
      return false;
    }
  }
  // No remainder destination → every revealed card must be assigned.
  if (!remainder && unassignedCount > 0) {
    return false;
  }
  return true;
}

function buildScrySubmitPayload(
  context: ScryResolutionSelectionContext,
  destinations: readonly PromptScryDestination[],
): ResolutionExecutionOptions {
  return {
    destinations: destinations.map((destination) => {
      const matchedSelection = (context.currentSelection.destinations ?? []).find(
        (entry) => entry.zone === destination.zone,
      );
      // Prefer the chooser's in-flight assignments (carried on
      // `currentCardIds`) over the engine's last acknowledged selection so the
      // submit payload reflects the latest arrangement the renderer has shown.
      const cards =
        destination.currentCardIds.length > 0
          ? [...destination.currentCardIds]
          : [...(matchedSelection?.cards ?? [])];
      return {
        zone: destination.zone,
        cards: cards as CardInstanceId[],
      };
    }),
  };
}

function buildScryInteractions(
  context: ScryResolutionSelectionContext,
  pending: BuildPlayerInteractionViewOptions["pendingScryAssignments"],
): BuiltInteractions {
  const destinations = buildScryDestinations(context, pending);
  const revealed = buildScryRevealed(context, pending);
  const unassignedCount = revealed.filter((card) => card.currentDestinationId === null).length;

  const interactions: Interaction[] = [];
  // Keep the round-trip-friendly per-(card × destination) interactions. The
  // overlay can ignore them and read from `scryDestinations` /
  // `scryRevealed` instead, but existing tests / `simulateClick` round-trip
  // through these.
  for (const rule of context.destinationRules) {
    for (const cardId of context.revealedCardIds) {
      interactions.push({
        kind: "scry-place",
        cardId,
        destinationId: rule.id,
        orderIndex: 0,
        payload: {
          destinations: [{ zone: rule.zone, cards: [cardId] }],
        },
      });
    }
  }

  const canSubmit = isScryArrangementSubmittable(destinations, unassignedCount, revealed.length);
  return {
    interactions,
    submission: {
      canSubmit,
      canCancel: false,
      autoRejected: false,
      submitPayload: canSubmit ? buildScrySubmitPayload(context, destinations) : null,
      cancelPayload: null,
    },
  };
}

function buildCopy(context: ResolutionSelectionContext): PromptCopyDescriptor {
  switch (context.kind) {
    case "target-selection":
    case "discard-choice":
      return buildTargetCopy(context);
    case "choice-selection":
      return {
        titleKey: "prompt.choice.choose-one",
        titleParams: {},
        badges: [],
      };
    case "optional-selection":
      return {
        titleKey: "prompt.optional.accept-or-decline",
        titleParams: {},
        badges: [],
      };
    case "name-card-selection":
      return {
        titleKey: "prompt.name-card.title",
        titleParams: {},
        badges: [],
      };
    case "scry-selection":
      return {
        titleKey: "prompt.scry.reorder",
        titleParams: { amount: context.amount },
        badges: [],
      };
  }
}

function buildTargetCopy(context: TargetResolutionSelectionContext): PromptCopyDescriptor {
  const declaredMax = context.declaredMaxSelections ?? context.maxSelections;
  let titleKey: PromptKey = "prompt.target.choose-card";
  if (context.kind === "discard-choice") {
    titleKey = "prompt.discard.choose-cards";
  } else if (context.minSelections === 0 && declaredMax > 1) {
    titleKey = "prompt.target.choose-up-to";
  } else if (declaredMax > 1) {
    titleKey = "prompt.target.choose-cards";
  } else if (context.playerCandidateIds.length > 0) {
    titleKey = "prompt.target.choose-player";
  }
  if (context.cardCandidateIds.length === 0 && context.playerCandidateIds.length === 0) {
    titleKey = "prompt.target.no-legal-targets";
  }
  return {
    titleKey,
    titleParams: {
      min: context.minSelections,
      max: declaredMax,
    },
    badges: buildTargetBadges(context),
  };
}

/**
 * Convert engine target-DSL filters into renderer-side badge descriptors.
 *
 * IMPORTANT: badges are *display-only*. They do not affect legality — the
 * engine's `cardCandidateIds` is the only source of truth for what the
 * chooser can pick. A badge with `variant: "warning"` indicates a filter
 * the engine flagged as context-dependent (e.g. `sameNameAsChosenCard`)
 * which the renderer can't pre-evaluate visually.
 */
function buildTargetBadges(_context: TargetResolutionSelectionContext): PromptCopyBadge[] {
  // Initial cut: emit no badges. The renderer's i18n layer can extend
  // this to introspect `_context.targetDsl` and produce filter chips
  // when locale-aware badge rendering lands.
  return [];
}
