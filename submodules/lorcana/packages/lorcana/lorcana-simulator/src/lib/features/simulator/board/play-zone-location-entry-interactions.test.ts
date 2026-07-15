import { describe, expect, it, mock } from "bun:test";

import {
  handlePlayZoneLocationEntryDirectSelection,
  isPlayZoneLocationEntryDirectSelectionMode,
  isPlayZoneLocationEntryResolutionSelectionMode,
} from "./play-zone-location-entry-interactions.js";
import { createCardSnapshot } from "@/features/simulator-devtools/test-data/factories.js";

describe("play zone location entry interactions", () => {
  it("enables direct selection for challenge and move-to-location target sessions", () => {
    expect(
      isPlayZoneLocationEntryDirectSelectionMode({
        categoryId: "challenge",
        phase: "choose-target",
      }),
    ).toBe(true);
    expect(
      isPlayZoneLocationEntryDirectSelectionMode({
        categoryId: "move-to-location",
        phase: "choose-source",
      }),
    ).toBe(true);
    expect(
      isPlayZoneLocationEntryDirectSelectionMode({
        categoryId: "activate-ability",
        phase: "choose-target",
      }),
    ).toBe(false);
    expect(
      isPlayZoneLocationEntryDirectSelectionMode({
        categoryId: "challenge",
        phase: "confirm",
      }),
    ).toBe(false);
  });

  it("enables direct selection for active resolution target candidates", () => {
    expect(
      isPlayZoneLocationEntryResolutionSelectionMode(
        {
          context: {
            kind: "target-selection",
            cardCandidateIds: ["location"],
          },
        },
        "location",
      ),
    ).toBe(true);
    expect(
      isPlayZoneLocationEntryResolutionSelectionMode(
        {
          context: {
            kind: "target-selection",
            cardCandidateIds: ["other-location"],
          },
        },
        "location",
      ),
    ).toBe(false);
    expect(
      isPlayZoneLocationEntryResolutionSelectionMode(
        {
          context: {
            kind: "choice-selection",
            cardCandidateIds: ["location"],
          },
        },
        "location",
      ),
    ).toBe(false);
  });

  it("forwards wrapper clicks to sidebar selection in direct selection mode", () => {
    const card = createCardSnapshot("playerTwo", "play", {
      id: "occupant",
      name: "Agustin Madrigal - Clumsy Dad",
      type: "character",
    });
    const stopPropagation = mock(() => {});
    const onSelect = mock(() => {});

    expect(
      handlePlayZoneLocationEntryDirectSelection({
        card,
        event: { stopPropagation },
        directSelectionMode: true,
        onSelect,
      }),
    ).toBe(true);

    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(card);
  });

  it("returns false and leaves normal card interaction untouched outside direct selection mode", () => {
    const card = createCardSnapshot("playerTwo", "play", {
      id: "location",
      name: "Hidden Cove - Tranquil Haven",
      type: "location",
    });
    const stopPropagation = mock(() => {});
    const onSelect = mock(() => {});

    expect(
      handlePlayZoneLocationEntryDirectSelection({
        card,
        event: { stopPropagation },
        directSelectionMode: false,
        onSelect,
      }),
    ).toBe(false);

    expect(stopPropagation).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });
});
