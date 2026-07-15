import { describe, expect, it } from "bun:test";

import {
  getActionTargetSelectionModalZones,
  getTargetSelectionModalTitle,
  shouldAutoOpenTargetSelectionModal,
  shouldUseTargetSelectionModal,
} from "./target-selection-modal.js";
import type {
  ActionAvailableMovesSelectionState,
  LorcanaCardSnapshot,
  ResolutionTargetAvailableMovesSelectionState,
} from "@/features/simulator/model/contracts.js";

function createSelectionState(
  overrides: Partial<ResolutionTargetAvailableMovesSelectionState> = {},
): ResolutionTargetAvailableMovesSelectionState {
  return {
    mode: "resolution-target",
    sessionKey: "resolution:test",
    sourceCardId: "source-card",
    categoryId: "unknown",
    categoryLabel: "Resolve effect",
    title: "Resolve effect",
    message: "Select a valid target for this effect.",
    canBack: false,
    canCancel: true,
    canConfirm: false,
    entries: [],
    effectType: null,
    target: null,
    allowedZones: ["discard"],
    candidateCardIds: [],
    candidatePlayerIds: [],
    viewerSide: "playerOne",
    candidateEntries: [],
    activeSlotIndex: null,
    slots: [],
    amountSelection: null,
    selectedTargetLabels: [],
    minimumSelections: 1,
    maximumSelections: 1,
    ...overrides,
  };
}

function createActionSelectionState(
  overrides: Partial<ActionAvailableMovesSelectionState> = {},
): ActionAvailableMovesSelectionState {
  return {
    mode: "action",
    categoryId: "play-card",
    categoryLabel: "Play card",
    phase: "choose-target",
    title: "Hand-in-the-Box - Sid's Toy",
    message:
      "Choose a Toy character from your discard to put on bottom of your deck to play Hand-in-the-Box - Sid's Toy for free.",
    canBack: true,
    canCancel: true,
    canConfirm: false,
    entries: [
      {
        id: "available-moves:card:toy-1",
        kind: "card",
        cardId: "toy-1",
        label: "Wind-Up Frog - Sid's Toy",
        selected: false,
      },
    ],
    sourceCardId: "hand-in-the-box",
    sourceLabel: "Hand-in-the-Box - Sid's Toy",
    targetCardId: null,
    targetLabel: null,
    selectedMoveId: "play-card:hand-in-the-box:spring-loaded",
    selectedMoveLabel: "Play: Put Toy on Deck Bottom",
    ...overrides,
  };
}

function createCardSnapshot(overrides: Partial<LorcanaCardSnapshot> = {}): LorcanaCardSnapshot {
  return {
    cardId: "toy-1",
    definitionId: "wind-up-frog",
    isMasked: false,
    label: "Wind-Up Frog - Sid's Toy",
    ownerId: "player_one",
    ownerSide: "playerOne",
    zoneId: "discard",
    facePresentation: "faceUp",
    ...overrides,
  };
}

describe("target selection modal helpers", () => {
  it("uses the modal for discard-target sessions", () => {
    expect(shouldUseTargetSelectionModal(createSelectionState())).toBe(true);
  });

  it("derives discard zones for action target-selection sessions", () => {
    expect(
      getActionTargetSelectionModalZones(createActionSelectionState(), {
        "toy-1": createCardSnapshot(),
      }),
    ).toEqual(["discard"]);
  });

  it("derives discard zones for action cost-selection sessions", () => {
    expect(
      getActionTargetSelectionModalZones(
        createActionSelectionState({
          phase: "choose-cost",
        }),
        {
          "toy-1": createCardSnapshot(),
        },
      ),
    ).toEqual(["discard"]);
  });

  it("ignores disabled action target entries when deriving modal zones", () => {
    expect(
      getActionTargetSelectionModalZones(
        createActionSelectionState({
          entries: [
            {
              id: "available-moves:card:toy-1",
              kind: "card",
              cardId: "toy-1",
              label: "Wind-Up Frog - Sid's Toy",
              selected: false,
              disabled: true,
            },
          ],
        }),
        {
          "toy-1": createCardSnapshot(),
        },
      ),
    ).toEqual([]);
  });

  it("uses the modal for player-target sessions", () => {
    expect(
      shouldUseTargetSelectionModal(
        createSelectionState({
          allowedZones: [],
          candidatePlayerIds: ["player_one", "player_two"],
        }),
      ),
    ).toBe(true);
  });

  it("uses the modal for deck and inkwell targets", () => {
    expect(
      shouldUseTargetSelectionModal(
        createSelectionState({
          allowedZones: ["deck"],
        }),
      ),
    ).toBe(true);
    expect(
      shouldUseTargetSelectionModal(
        createSelectionState({
          allowedZones: ["inkwell"],
        }),
      ),
    ).toBe(true);
  });

  it("skips the modal for play-zone-only card targets", () => {
    expect(
      shouldUseTargetSelectionModal(
        createSelectionState({
          allowedZones: ["play"],
        }),
      ),
    ).toBe(false);
  });

  it("skips the modal for hand-zone targets (chooser's own hand is clickable inline)", () => {
    expect(
      shouldUseTargetSelectionModal(
        createSelectionState({
          allowedZones: ["hand"],
        }),
      ),
    ).toBe(false);
  });

  it("forces the modal when a Bodyguard entry-mode choice is required (hand-zone card)", () => {
    // Bodyguard cards played from hand require an exerted/ready choice that the
    // board-click flow cannot present — the modal must open to show the choice UI.
    expect(
      shouldUseTargetSelectionModal(
        createSelectionState({
          allowedZones: ["hand"],
          playCardEntryModeChoice: { selected: null },
        }),
      ),
    ).toBe(true);
  });

  it("auto-opens only for a new session key", () => {
    expect(shouldAutoOpenTargetSelectionModal("resolution:1", null)).toBe(true);
    expect(shouldAutoOpenTargetSelectionModal("resolution:1", "resolution:1")).toBe(false);
    expect(shouldAutoOpenTargetSelectionModal(null, "resolution:1")).toBe(false);
  });

  it("uses a zone-specific title for single-zone non-play targets", () => {
    expect(getTargetSelectionModalTitle(createSelectionState())).toBe("Discard targets");
    expect(
      getTargetSelectionModalTitle(
        createSelectionState({
          allowedZones: ["deck"],
        }),
      ),
    ).toBe("Deck targets");
  });

  it("keeps the generic title for play-zone targets", () => {
    expect(
      getTargetSelectionModalTitle(
        createSelectionState({
          title: "Pending effect",
          allowedZones: ["play"],
        }),
      ),
    ).toBe("Pending effect");
  });
});
