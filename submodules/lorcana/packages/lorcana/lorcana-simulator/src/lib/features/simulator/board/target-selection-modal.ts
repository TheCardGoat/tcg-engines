import type {
  ActionAvailableMovesSelectionState,
  LorcanaCardSnapshot,
  LorcanaZoneId,
  ResolutionTargetAvailableMovesSelectionState,
} from "@/features/simulator/model/contracts.js";

export type TargetSelectionModalPolicyState = Pick<
  ResolutionTargetAvailableMovesSelectionState,
  "allowedZones" | "candidatePlayerIds" | "categoryId" | "playCardEntryModeChoice"
>;

const TARGET_ZONE_LABELS = {
  deck: "Deck",
  hand: "Hand",
  play: "Play",
  inkwell: "Inkwell",
  discard: "Discard",
  limbo: "Limbo",
} as const;

/**
 * CardTargetDialog policy (see TabletopBoard `dialogTargetState` / `shouldAutoOpenTargetSelectionModal`):
 *
 * - **Modal + auto-open** when targets live in zones that aren't individually clickable on the
 *   board (deck, inkwell, limbo, discard) or when choosing players.
 * - **No modal** for `play`- or `hand`-zone targets — both are rendered as clickable cards on
 *   the chooser's own screen, and clicks are routed through `assignResolutionTargetSelection`.
 *   (`hand` always refers to the chooser's own hand in Lorcana — you can't be asked to pick a
 *   specific card from an opponent's hand.)
 * - Optional effects merged to target-selection with `originatesFromOptional` use the same modal
 *   rules; Cancel / decline still sends `resolveOptional: false` via presenter logic.
 */
const ZONES_USING_CARD_TARGET_MODAL = ["discard", "deck", "inkwell", "limbo"] as const;

function selectionUsesCardTargetModal(selectionState: TargetSelectionModalPolicyState): boolean {
  if (selectionState.candidatePlayerIds.length > 0) {
    return true;
  }

  // Bodyguard cards played from hand require an entry-mode choice (ready vs exerted).
  // The normal hand-zone board-click flow has no UI for this choice, so force the modal.
  if (selectionState.playCardEntryModeChoice !== undefined) {
    return true;
  }

  return ZONES_USING_CARD_TARGET_MODAL.some((zone) => selectionState.allowedZones.includes(zone));
}

export function shouldUseTargetSelectionModal(
  selectionState: TargetSelectionModalPolicyState | null | undefined,
): boolean {
  return Boolean(
    selectionState &&
    selectionState.categoryId !== "alter-hand" &&
    selectionUsesCardTargetModal(selectionState),
  );
}

export function getActionTargetSelectionModalZones(
  selectionState: ActionAvailableMovesSelectionState | null | undefined,
  cardSnapshotsById: Record<string, LorcanaCardSnapshot>,
): LorcanaZoneId[] {
  if (
    selectionState?.mode !== "action" ||
    (selectionState.phase !== "choose-target" && selectionState.phase !== "choose-cost")
  ) {
    return [];
  }

  const zones = new Set<LorcanaZoneId>();

  for (const entry of selectionState.entries) {
    if (entry.kind !== "card" || entry.disabled || !entry.cardId) {
      continue;
    }

    const zoneId = cardSnapshotsById[entry.cardId]?.zoneId;
    if (zoneId) {
      zones.add(zoneId);
    }
  }

  return [...zones];
}

export function shouldAutoOpenTargetSelectionModal(
  sessionKey: string | null | undefined,
  lastAutoOpenedSessionKey: string | null | undefined,
): boolean {
  return Boolean(sessionKey && sessionKey !== lastAutoOpenedSessionKey);
}

export function getTargetSelectionModalTitle(
  selectionState: Pick<TargetSelectionModalPolicyState, "allowedZones"> & { title: string },
): string {
  if (selectionState.allowedZones.length === 1 && selectionState.allowedZones[0] !== "play") {
    return `${TARGET_ZONE_LABELS[selectionState.allowedZones[0]]} targets`;
  }

  return selectionState.title;
}
