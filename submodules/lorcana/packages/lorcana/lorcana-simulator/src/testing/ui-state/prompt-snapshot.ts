import type {
  LorcanaProjectedBagEffect,
  LorcanaProjectedBoardView,
  LorcanaProjectedPendingEffect,
  ResolutionSelectionContext,
  ResolutionSelectionKind,
  SlottedTargetKind,
  TargetResolutionSelectionContext,
} from "@tcg/lorcana-engine";
import type { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  buildPlayerInteractionView,
  findActivePrompt,
  type Interaction,
  type PlayerInteractionView,
  type PromptSlot,
} from "@tcg/lorcana-interaction";
import type { CardInstanceId, PlayerId } from "@tcg/lorcana-types";

import type {
  AvailableMovesSelectionEntry,
  LorcanaCardSnapshot,
  ResolutionTargetSelectionSlotState,
} from "@/features/simulator/model/contracts.js";
import { buildCardSnapshotMap } from "@/features/simulator/model/board-utils.js";
import {
  getBagEffectPayloadMeta,
  getPendingEffectPayloadMeta,
} from "@/features/simulator/model/pending-effect-payload.js";
import {
  getResolutionTargetPromptMessage,
  isSupportedResolutionTargetEffectType,
  type SupportedResolutionTargetEffectType,
} from "@/features/simulator/model/resolution-target-prompt.js";

export type PromptSnapshot = {
  /** Selection kind published by the engine on `board.pendingChoice`. */
  kind: ResolutionSelectionKind;
  /** Engine request id — same value the engine will expect back in `resolveEffect`. */
  requestId: string;
  /** Player id whose UI must display and resolve this prompt (the `chooserId`). */
  chooserId: string;
  /** Source card that spawned this resolution (trigger source or action card). */
  sourceCardId: string;
  /** `"target-selection"` / `"discard-choice"` contexts expose these; other kinds report 0. */
  minSelections: number;
  maxSelections: number;
  /** Raw candidate ids published by the engine. */
  cardCandidateIds: readonly string[];
  playerCandidateIds: readonly string[];
  /** When the engine asks for a slotted payload, this is the discriminator the UI must satisfy. */
  expectedSlottedKind: SlottedTargetKind | null;
  /** Effect family inferred from the pending-effect / bag payload metadata. `null` if unsupported. */
  effectType: SupportedResolutionTargetEffectType | null;
  /** Full UI prompt state as the game-context would render it. `null` when not a target prompt. */
  prompt: ResolutionTargetPromptState | null;
  /** Localized prompt copy for the active slot (if any). */
  message: string | null;
};

export type ResolutionTargetPromptState = {
  effectType: SupportedResolutionTargetEffectType;
  candidateEntries: AvailableMovesSelectionEntry[];
  activeSlotIndex: number | null;
  slots: ResolutionTargetSelectionSlotState[];
  autoResolvedFromSlots: number;
};

type AnyProjectedEffect = LorcanaProjectedPendingEffect | LorcanaProjectedBagEffect;

/**
 * Mirror of the legacy presenter's `SLOT_LABELS` (resolution-target-prompt.ts).
 * Kept inline here so the snapshot helper preserves the legacy human-readable
 * slot labels expected by existing tests, without re-importing the deleted
 * presenter machinery.
 */
const SLOT_LABELS: Record<SupportedResolutionTargetEffectType, readonly string[]> = {
  "move-damage": ["Move damage from", "Move damage to"],
  "move-to-location": ["Character to move", "Move to location"],
  "deal-damage": ["Deal damage to"],
  banish: ["Choose card to banish"],
  discard: ["Choose card to discard"],
  "return-to-hand": ["Choose card to return"],
  ready: ["Choose card to ready"],
  exert: ["Choose card to exert"],
  "modify-stat": ["Choose character"],
  "gain-keyword": ["Choose card"],
  "remove-damage": ["Choose card to heal"],
};

/**
 * Mirror of the legacy presenter's `SLOT_CARD_TYPES`. Kept inline for the same
 * reason as `SLOT_LABELS`.
 */
const SLOT_CARD_TYPES: Record<
  SupportedResolutionTargetEffectType,
  readonly ResolutionTargetSelectionSlotState["cardType"][]
> = {
  "move-damage": ["character", "character"],
  "move-to-location": ["character", "location"],
  "deal-damage": [null],
  banish: [null],
  discard: [null],
  "return-to-hand": [null],
  ready: [null],
  exert: [null],
  "modify-stat": ["character"],
  "gain-keyword": [null],
  "remove-damage": [null],
};

function isTargetContext(
  context: ResolutionSelectionContext,
): context is TargetResolutionSelectionContext {
  return context.kind === "target-selection" || context.kind === "discard-choice";
}

function locateEffectByRequestId(
  board: LorcanaProjectedBoardView,
  requestId: string,
): { effect: AnyProjectedEffect; origin: "pending-effect" | "bag" } | null {
  const pendingEffect = board.pendingEffects.find((effect) => effect.id === requestId);
  if (pendingEffect) {
    return { effect: pendingEffect, origin: "pending-effect" };
  }

  const bagEffect = board.bagEffects.find((effect) => effect.id === requestId);
  if (bagEffect) {
    return { effect: bagEffect, origin: "bag" };
  }

  return null;
}

function inferEffectType(
  effect: AnyProjectedEffect,
  origin: "pending-effect" | "bag",
): SupportedResolutionTargetEffectType | null {
  const rawEffectType =
    origin === "pending-effect"
      ? getPendingEffectPayloadMeta(effect.payload).effectType
      : getBagEffectPayloadMeta(effect.payload).effectType;

  return isSupportedResolutionTargetEffectType(rawEffectType) ? rawEffectType : null;
}

function buildSelectedLabel(
  targetId: string | null,
  context: TargetResolutionSelectionContext,
  cardSnapshotsById: Record<string, LorcanaCardSnapshot>,
): string | null {
  if (!targetId) {
    return null;
  }

  const card = cardSnapshotsById[targetId] ?? null;
  if (card) {
    return card.label;
  }

  if (context.playerCandidateIds.some((candidateId) => String(candidateId) === String(targetId))) {
    return targetId;
  }

  return targetId;
}

/**
 * Build the legacy `ResolutionTargetSelectionSlotState[]` shape from the
 * interaction view's `PromptSlot[]` (when the engine published a slotted
 * prompt) or fabricate a single-slot legacy shape from `effectType +
 * maxSelections` for non-slotted target prompts.
 *
 * The output mirrors `buildSlotStates` from the deleted presenter so the
 * existing snapshot tests continue to pass.
 */
function buildLegacySlots(params: {
  effectType: SupportedResolutionTargetEffectType;
  viewSlots: readonly PromptSlot[] | null;
  selectedTargets: readonly string[];
  context: TargetResolutionSelectionContext;
  cardSnapshotsById: Record<string, LorcanaCardSnapshot>;
  autoResolvedFromSlots: number;
}): ResolutionTargetSelectionSlotState[] {
  const {
    effectType,
    viewSlots,
    selectedTargets,
    context,
    cardSnapshotsById,
    autoResolvedFromSlots,
  } = params;

  const baseLabels = SLOT_LABELS[effectType];
  const baseCardTypes = SLOT_CARD_TYPES[effectType];

  // Slotted prompts: take the slot count from the view, but layer
  // UI-pending `selectedTargets` on top of the engine-confirmed
  // `targetCardId` so callers can simulate "user has picked source,
  // slot 1 is now active" without a server round-trip. The legacy
  // presenter treated `selectedTargets[i]` as the canonical pick at
  // slot `i + autoResolvedFromSlots` UNLESS the caller already prepended
  // the source card (then no shift).
  if (viewSlots && viewSlots.length > 0) {
    const preselectedTargetCount = Math.max(
      context.currentSelection.targets?.length ?? 0,
      autoResolvedFromSlots,
    );
    // If the caller passed `[sourceCardId, ...]`, treat selectedTargets as
    // already-aligned to slot indices (matches the legacy `effectiveSelectedTargets`
    // shift rule). Otherwise treat them as visible-slot picks.
    const callerPrependedSource =
      autoResolvedFromSlots > 0 &&
      selectedTargets[0] === (context.sourceCardId as unknown as string);
    return viewSlots.map((slot) => {
      const pendingIndex = callerPrependedSource ? slot.index : slot.index - autoResolvedFromSlots;
      const pendingTargetId =
        !slot.autoResolved && pendingIndex >= 0 ? (selectedTargets[pendingIndex] ?? null) : null;
      const targetId = slot.targetCardId ?? pendingTargetId ?? null;
      const card = targetId ? (cardSnapshotsById[targetId] ?? null) : null;
      const labelIndex = Math.min(slot.index, baseLabels.length - 1);
      const cardTypeIndex = Math.min(slot.index, baseCardTypes.length - 1);

      return {
        id: `${effectType}:slot:${slot.index}`,
        label: baseLabels[labelIndex] ?? baseLabels[baseLabels.length - 1],
        cardType: baseCardTypes[cardTypeIndex] ?? baseCardTypes[baseCardTypes.length - 1],
        targetId,
        targetLabel: buildSelectedLabel(targetId, context, cardSnapshotsById),
        targetCardId: card?.cardId ?? (card ? null : targetId),
        locked: slot.index < preselectedTargetCount,
      };
    });
  }

  // Non-slotted prompts: fabricate slots from the effect type's static label
  // list, padded out to `maxSelections` so multi-target flat prompts (e.g.
  // The Leviathan, Mulan Triple Shot) report the right slot count.
  const slotCount = Math.max(
    baseLabels.length,
    context.maxSelections > 0 ? context.maxSelections : 0,
  );
  const preselectedTargetCount = Math.max(
    context.currentSelection.targets?.length ?? 0,
    autoResolvedFromSlots,
  );

  return Array.from({ length: slotCount }, (_, index) => {
    const label = baseLabels[index] ?? baseLabels[baseLabels.length - 1];
    const cardType = baseCardTypes[index] ?? baseCardTypes[baseCardTypes.length - 1];
    const targetId = selectedTargets[index] ?? null;
    const card = targetId ? (cardSnapshotsById[targetId] ?? null) : null;

    return {
      id: `${effectType}:slot:${index}`,
      label,
      cardType,
      targetId,
      targetLabel: buildSelectedLabel(targetId, context, cardSnapshotsById),
      targetCardId: card?.cardId ?? (card ? null : targetId),
      locked: index < preselectedTargetCount,
    };
  });
}

function buildCandidateEntriesFromView(params: {
  view: PlayerInteractionView;
  cardSnapshotsById: Record<string, LorcanaCardSnapshot>;
  context: TargetResolutionSelectionContext;
  slots: readonly ResolutionTargetSelectionSlotState[];
  activeSlotIndex: number | null;
  autoResolvedFromSlots: number;
}): AvailableMovesSelectionEntry[] {
  const { view, cardSnapshotsById, context, slots, activeSlotIndex, autoResolvedFromSlots } =
    params;
  const seen = new Set<string>();
  const entries: AvailableMovesSelectionEntry[] = [];

  // Active slot is what the chooser is currently editing. The engine's
  // published `cardCandidateIds` is filtered for whichever slot the engine
  // believes is active; when `selectedTargets` carries a UI-pending pick that
  // hasn't been engine-confirmed, we need to re-apply the active slot's
  // card-type / owner filters locally so the snapshot reflects what the UI
  // would show.
  const activeSlot = activeSlotIndex !== null ? (slots[activeSlotIndex] ?? null) : null;
  const otherSlotTargetIds = new Set(
    slots.flatMap((slot, index) =>
      index !== activeSlotIndex && slot.targetId ? [slot.targetId] : [],
    ),
  );

  // `owner: "opponent"` in the target DSL is defined relative to the source
  // card's controller, NOT the chooser. They diverge for `chosenBy: "opponent"`
  // effects (Dinky / Be King) where the controller forces the opponent to pick
  // their own characters. Use the source's ownerId as the reference frame.
  const sourceOwnerId =
    (context.sourceCardId
      ? cardSnapshotsById[context.sourceCardId as unknown as string]?.ownerId
      : undefined) ?? (context.chooserId as unknown as string);

  // `targetDsl` is parallel to the user-visible slots; offset by the number of
  // auto-resolved leading slots so the DSL entry matches the active slot.
  const rawTargetDsl = context.targetDsl as Array<{ owner?: string }> | undefined;
  const adjustedTargetDsl =
    autoResolvedFromSlots > 0 && rawTargetDsl
      ? Array.from({ length: autoResolvedFromSlots }, () => ({}) as { owner?: string }).concat(
          rawTargetDsl,
        )
      : rawTargetDsl;
  const slotOwner =
    activeSlotIndex !== null ? adjustedTargetDsl?.[activeSlotIndex]?.owner : undefined;

  for (const interaction of view.interactions) {
    if (!isSelectCardInteraction(interaction)) {
      continue;
    }
    const cardId = String(interaction.cardId);
    if (seen.has(cardId)) {
      continue;
    }
    seen.add(cardId);

    const card = cardSnapshotsById[cardId] ?? null;
    if (!card) {
      // Skip ids the simulator doesn't have a snapshot for; matches the
      // legacy presenter behaviour where un-snapshottable candidates were
      // dropped via `flatMap`.
      continue;
    }
    if (activeSlot && activeSlot.cardType !== null && card.cardType !== activeSlot.cardType) {
      continue;
    }
    if (otherSlotTargetIds.has(cardId)) {
      continue;
    }
    if (slotOwner === "opponent" && sourceOwnerId) {
      const isOpponentCard = card.ownerId !== sourceOwnerId;
      if (!isOpponentCard) {
        continue;
      }
    }

    entries.push({
      id: `resolution:card:${cardId}`,
      kind: "card",
      cardId,
      label: card.label,
      selected: false,
    });
  }

  return entries;
}

function isSelectCardInteraction(
  interaction: Interaction,
): interaction is Interaction & { kind: "select-card"; cardId: string } {
  return interaction.kind === "select-card";
}

/**
 * Build a plain, assertable snapshot of the UI prompt state the simulator would render
 * for the engine's current `board.pendingChoice`. Returns `null` when no selection is
 * pending.
 *
 * Intended for fast unit/integration tests that want to verify "engine published a
 * target prompt that the UI will render correctly" without a browser. The snapshot
 * derives its prompt state from `buildPlayerInteractionView` (the single renderer
 * contract), then maps the new view shape onto the legacy
 * `ResolutionTargetSelectionSlotState` / `AvailableMovesSelectionEntry` shapes the
 * existing tests assert on.
 *
 * Usage:
 * ```ts
 * const engine = LorcanaMultiplayerTestEngine.createWithFixture(...);
 * engine.asPlayerOne().playCard(someCard);
 * const snapshot = snapshotPendingPrompt(engine);
 * expect(snapshot?.expectedSlottedKind).toBe("move-damage");
 * ```
 *
 * Pass `playerId` to read the view for a specific player (default: player one).
 * Pass `selectedTargets` to simulate the UI mid-selection — useful for asserting
 * how the destination slot's candidate list changes after the user picks a source.
 */
export function snapshotPendingPrompt(
  engine: LorcanaMultiplayerTestEngine,
  opts: { playerId?: string; selectedTargets?: readonly string[] } = {},
): PromptSnapshot | null {
  const client = opts.playerId
    ? engine.asLorcanaPlayer(opts.playerId)
    : engine.asLorcanaPlayerOne();
  const board = client.getBoard();
  const selectedTargets = opts.selectedTargets ?? [];

  const active = findActivePrompt(board);
  if (!active) {
    return null;
  }

  const view = buildPlayerInteractionView(board, client.getClientPlayerId() as PlayerId, {
    pendingSelectedCardIds: selectedTargets as readonly CardInstanceId[],
  });

  // The view's activePrompt mirrors `findActivePrompt(board)`; when the
  // engine has a prompt, both are non-null. Guard for type safety.
  if (!view.activePrompt) {
    return null;
  }

  const selectionContext = active.selectionContext;
  const requestId = view.activePrompt.requestId;

  if (!isTargetContext(selectionContext)) {
    return {
      kind: selectionContext.kind,
      requestId,
      chooserId: view.activePrompt.chooserId as unknown as string,
      sourceCardId: view.activePrompt.sourceCardId as unknown as string,
      minSelections: 0,
      maxSelections: 0,
      cardCandidateIds: [],
      playerCandidateIds: [],
      expectedSlottedKind: null,
      effectType: null,
      prompt: null,
      message: null,
    };
  }

  // For target contexts: locate the source effect (pending-effect vs bag) so
  // we can run `inferEffectType` against the same payload metadata the legacy
  // presenter used. The view's activeQueueIndex isn't enough because we need
  // the pending-effect/bag origin to pick the right payload-meta accessor.
  const located = locateEffectByRequestId(board, requestId);
  const effectType = located ? inferEffectType(located.effect, located.origin) : null;

  // biome-ignore lint/suspicious/noExplicitAny: buildCardSnapshotMap expects MatchStaticResources; we pass through.
  const staticResources = client.staticResources as any;
  const cardSnapshotsById = buildCardSnapshotMap(board, staticResources);

  let prompt: ResolutionTargetPromptState | null = null;
  let activeSlotIndex: number | null = null;
  if (effectType && selectionContext.playerCandidateIds.length === 0) {
    const slots = buildLegacySlots({
      effectType,
      viewSlots: view.activePrompt.slots,
      selectedTargets,
      context: selectionContext,
      cardSnapshotsById,
      autoResolvedFromSlots: view.activePrompt.autoResolvedSlotCount,
    });

    activeSlotIndex = computeLegacyActiveSlotIndex(slots);

    const candidateEntries = buildCandidateEntriesFromView({
      view,
      cardSnapshotsById,
      context: selectionContext,
      slots,
      activeSlotIndex,
      autoResolvedFromSlots: view.activePrompt.autoResolvedSlotCount,
    });

    prompt = {
      effectType,
      candidateEntries,
      activeSlotIndex,
      slots,
      autoResolvedFromSlots: view.activePrompt.autoResolvedSlotCount,
    };
  }

  return {
    kind: selectionContext.kind,
    requestId,
    chooserId: view.activePrompt.chooserId as unknown as string,
    sourceCardId: view.activePrompt.sourceCardId as unknown as string,
    minSelections: selectionContext.minSelections,
    maxSelections: selectionContext.maxSelections,
    cardCandidateIds: selectionContext.cardCandidateIds as readonly string[],
    playerCandidateIds: selectionContext.playerCandidateIds as readonly string[],
    expectedSlottedKind: view.activePrompt.expectedSlottedKind,
    effectType,
    prompt,
    message: effectType ? getResolutionTargetPromptMessage(effectType, activeSlotIndex) : null,
  };
}

/**
 * Compute the active slot index from the synthesized legacy slot list,
 * mirroring the deleted presenter's `getDefaultActiveSlotIndex` rule:
 * the first unlocked, unfilled slot, falling back to the last unlocked
 * slot when every editable slot is filled.
 */
function computeLegacyActiveSlotIndex(
  slots: readonly ResolutionTargetSelectionSlotState[],
): number | null {
  const unfilledEditable = slots.findIndex((slot) => !slot.locked && !slot.targetId);
  if (unfilledEditable >= 0) {
    return unfilledEditable;
  }
  const lastEditable = [...slots].reverse().find((slot) => !slot.locked);
  if (!lastEditable) {
    return null;
  }
  return slots.findIndex((slot) => slot.id === lastEditable.id);
}
