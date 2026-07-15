import { describe, expect, it } from "bun:test";

import { shouldUseResolutionTargetOverlay } from "./resolution-target-overlay.js";
import type { AvailableMovesSelectionState } from "@/features/simulator/model/contracts.js";

describe("shouldUseResolutionTargetOverlay", () => {
  it("uses the board overlay for move-damage target prompts", () => {
    const state: AvailableMovesSelectionState = {
      mode: "resolution-target",
      sessionKey: "resolution:move-damage",
      sourceCardId: "source",
      categoryId: "unknown",
      categoryLabel: "Resolve effect",
      title: "Effect",
      message: "Choose the character to move damage from.",
      canBack: false,
      canCancel: true,
      canConfirm: false,
      entries: [],
      effectType: "move-damage",
      target: null,
      allowedZones: ["play"],
      candidateCardIds: [],
      candidatePlayerIds: [],
      viewerSide: "playerOne",
      candidateEntries: [],
      activeSlotIndex: 0,
      slots: [
        {
          id: "slot-1",
          label: "Move damage from",
          cardType: "character",
          targetId: null,
          targetLabel: null,
          targetCardId: null,
          locked: false,
        },
        {
          id: "slot-2",
          label: "Move damage to",
          cardType: "character",
          targetId: null,
          targetLabel: null,
          targetCardId: null,
          locked: false,
        },
      ],
      amountSelection: null,
      selectedTargetLabels: [],
      minimumSelections: 2,
      maximumSelections: 2,
    };

    expect(shouldUseResolutionTargetOverlay(state)).toBe(true);
  });

  it("does not use the overlay for single-slot effects like deal-damage", () => {
    const state: AvailableMovesSelectionState = {
      mode: "resolution-target",
      sessionKey: "resolution:deal-damage",
      sourceCardId: "source",
      categoryId: "unknown",
      categoryLabel: "Resolve effect",
      title: "Effect",
      message: "Choose the character to deal damage to.",
      canBack: false,
      canCancel: true,
      canConfirm: false,
      entries: [],
      effectType: "deal-damage",
      target: null,
      allowedZones: ["play"],
      candidateCardIds: [],
      candidatePlayerIds: [],
      viewerSide: "playerOne",
      candidateEntries: [],
      activeSlotIndex: 0,
      slots: [
        {
          id: "slot-1",
          label: "Deal damage to",
          cardType: "character",
          targetId: null,
          targetLabel: null,
          targetCardId: null,
          locked: false,
        },
      ],
      amountSelection: null,
      selectedTargetLabels: [],
      minimumSelections: 0,
      maximumSelections: 3,
    };

    expect(shouldUseResolutionTargetOverlay(state)).toBe(false);
  });

  it("keeps multi-character move-to-location prompts on the inline board surface", () => {
    const state: AvailableMovesSelectionState = {
      mode: "resolution-target",
      sessionKey: "resolution:move-to-location",
      sourceCardId: "source",
      categoryId: "unknown",
      categoryLabel: "Resolve effect",
      title: "Effect",
      message: "Choose characters to move, then choose a location.",
      canBack: false,
      canCancel: true,
      canConfirm: false,
      entries: [],
      effectType: "move-to-location",
      target: null,
      allowedZones: ["play"],
      candidateCardIds: ["character-a", "location-a"],
      candidatePlayerIds: [],
      viewerSide: "playerOne",
      candidateEntries: [],
      activeSlotIndex: 0,
      slots: [
        {
          id: "subject",
          label: "Character to move",
          cardType: "character",
          targetId: null,
          targetLabel: null,
          targetCardId: null,
          locked: false,
        },
        {
          id: "location",
          label: "Move to location",
          cardType: "location",
          targetId: null,
          targetLabel: null,
          targetCardId: null,
          locked: false,
        },
      ],
      amountSelection: null,
      selectedTargetLabels: [],
      minimumSelections: 1,
      maximumSelections: 5,
    };

    expect(shouldUseResolutionTargetOverlay(state)).toBe(false);
  });

  it("keeps generic target prompts on the legacy dialog", () => {
    const state: AvailableMovesSelectionState = {
      mode: "resolution-target",
      sessionKey: "resolution:generic",
      sourceCardId: null,
      categoryId: "unknown",
      categoryLabel: "Resolve effect",
      title: "Effect",
      message: "Select the required target or player before resolving this effect.",
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
    };

    expect(shouldUseResolutionTargetOverlay(state)).toBe(false);
  });
});
