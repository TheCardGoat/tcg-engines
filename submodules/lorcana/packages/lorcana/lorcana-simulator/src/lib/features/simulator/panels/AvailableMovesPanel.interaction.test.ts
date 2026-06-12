import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";

import AvailableMovesPanel from "@/features/simulator/panels/AvailableMovesPanel.svelte";
import type {
  AvailableMovesSelectionState,
  LorcanaCardSnapshot,
  MoveCategorySummary,
} from "@/features/simulator/model/contracts.js";
import { getFormattedHotkeyParts } from "@/features/simulator/hotkeys/hotkey-bindings.js";

const placeholderSummaries: MoveCategorySummary[] = [
  {
    categoryId: "pass-turn",
    categoryLabel: "Pass turn",
    sourceCardIds: [],
    isDirect: true,
  },
];

const cardSnapshots: Record<string, LorcanaCardSnapshot> = {
  "card-1": {
    cardId: "card-1",
    definitionId: "001-001",
    isMasked: false,
    label: "Friends on the Other Side",
    ownerId: "player_one",
    ownerSide: "playerOne",
    zoneId: "hand",
    cardType: "action",
    inkType: ["amethyst"],
    facePresentation: "faceUp",
  },
};

describe("AvailableMovesPanel interactions", () => {
  it("renders shared action icons for move categories", () => {
    const summaries: MoveCategorySummary[] = [
      {
        categoryId: "quest",
        categoryLabel: "Quest",
        sourceCardIds: ["card-1"],
        isDirect: false,
      },
      {
        categoryId: "challenge",
        categoryLabel: "Challenge",
        sourceCardIds: ["card-2"],
        isDirect: false,
      },
      {
        categoryId: "move-to-location",
        categoryLabel: "Move to location",
        sourceCardIds: ["card-3"],
        isDirect: false,
      },
    ];

    const { body } = render(AvailableMovesPanel, {
      props: {
        summaries,
        onExpandCategory: () => [],
        interactiveSide: "playerOne",
      },
    });

    expect(body).toContain('data-action-icon="quest"');
    expect(body).toContain('data-action-icon="challenge"');
    expect(body).toContain('data-action-icon="move-to-location"');
  });

  it("renders selection hotkey hints but not category digit hints", () => {
    const selectionState: AvailableMovesSelectionState = {
      mode: "resolution-choice",
      categoryId: "unknown",
      categoryLabel: "Resolve effect",
      title: "Resolve effect",
      message: "Choose a branch.",
      canBack: true,
      canCancel: true,
      canConfirm: true,
      entries: [
        {
          id: "choice:0",
          kind: "option",
          moveId: "0",
          label: "Ready chosen character",
          selected: false,
        },
      ],
    };

    const rootView = render(AvailableMovesPanel, {
      props: {
        summaries: [
          {
            categoryId: "play-card",
            categoryLabel: "Play",
            sourceCardIds: ["card-1"],
            isDirect: false,
          },
        ],
        onExpandCategory: () => [],
        interactiveSide: "playerOne",
      },
    });

    const selectionView = render(AvailableMovesPanel, {
      props: {
        summaries: placeholderSummaries,
        onExpandCategory: () => [],
        interactiveSide: "playerOne",
        selectionState,
      },
    });

    const cancelHotkey = getFormattedHotkeyParts("Escape")[0]!;
    const confirmHotkey = getFormattedHotkeyParts("Enter")[0]!;
    const backHotkey = getFormattedHotkeyParts("Backspace")[0]!;

    // Top-level move categories no longer claim digit hotkeys — number row
    // 1-0 is reserved for hand cards. Per-card action shortcuts live in the
    // card quick-menu (action-menu layer) instead.
    expect(rootView.body).not.toContain(">2<");
    expect(selectionView.body).toContain(`>${cancelHotkey}<`);
    expect(selectionView.body).toContain(`>${confirmHotkey}<`);
    expect(selectionView.body).toContain(`>${backHotkey}<`);
  });

  it("renders disabled resolution choices in the sidebar list", () => {
    const selectionState: AvailableMovesSelectionState = {
      mode: "resolution-choice",
      categoryId: "unknown",
      categoryLabel: "Resolve effect",
      title: "The Queen - Commanding Presence",
      message: "Choose a branch before resolving this effect.",
      canBack: false,
      canCancel: true,
      canConfirm: false,
      entries: [
        {
          id: "choice:0",
          kind: "option",
          moveId: "0",
          label: "Ready chosen character",
          selected: false,
        },
        {
          id: "choice:1",
          kind: "option",
          moveId: "1",
          label: "Deal 2 damage",
          selected: false,
          disabled: true,
          disabledReason: "Unavailable",
        },
      ],
    };

    const { body } = render(AvailableMovesPanel, {
      props: {
        summaries: placeholderSummaries,
        onExpandCategory: () => [],
        interactiveSide: "playerOne",
        selectionState,
      },
    });

    expect(body).toContain("Ready chosen character");
    expect(body).toContain("Deal 2 damage");
    expect(body).toContain("Unavailable");
    expect(body).toContain("disabled");
  });

  it("renders named-card search input when a resolution requires a card name", () => {
    const selectionState: AvailableMovesSelectionState = {
      mode: "resolution-name-card",
      categoryId: "unknown",
      categoryLabel: "Resolve effect",
      title: "Ariel - Spectacular Singer",
      message: "Name a card before resolving this effect.",
      canBack: false,
      canCancel: true,
      canConfirm: true,
      query: "elsa",
      selectedLabel: "Elsa - Ice Surfer",
      entries: [
        {
          id: "named-card:elsa-ice-surfer",
          kind: "named-card",
          moveId: "Elsa - Ice Surfer",
          label: "Elsa - Ice Surfer",
          selected: true,
        },
      ],
    };

    const { body } = render(AvailableMovesPanel, {
      props: {
        summaries: placeholderSummaries,
        onExpandCategory: () => [],
        interactiveSide: "playerOne",
        selectionState,
      },
    });

    expect(body).toContain('type="search"');
    expect(body).toContain("Search Lorcana cards");
    expect(body).toContain("Elsa - Ice Surfer");
  });

  it("renders scry destinations as an overlay summary without assignment controls", () => {
    const selectionState: AvailableMovesSelectionState = {
      mode: "resolution-scry",
      categoryId: "unknown",
      categoryLabel: "Resolve effect",
      sourceCardId: "card-1",
      title: "Merlin - Rabbit",
      message: "Arrange the revealed cards to finish resolving this effect.",
      canBack: false,
      canCancel: true,
      canConfirm: false,
      remainingManualAssignments: 1,
      entries: [
        {
          id: "scry:1",
          kind: "scry-card",
          cardId: "card-1",
          label: "Elsa - Ice Surfer",
          detail: "Unassigned",
          selected: false,
        },
      ],
      destinations: [
        {
          id: "top",
          zone: "deck-top",
          label: "Top of deck",
          detail: "0+ cards",
          orderingEnabled: true,
          rule: { id: "top", zone: "deck-top", min: 0, max: null, remainder: false },
          cards: [],
        },
        {
          id: "bottom",
          zone: "deck-bottom",
          label: "Bottom of deck",
          detail: "0+ cards",
          orderingEnabled: true,
          rule: { id: "bottom", zone: "deck-bottom", min: 0, max: null, remainder: true },
          cards: [],
        },
      ],
    };

    const { body } = render(AvailableMovesPanel, {
      props: {
        summaries: placeholderSummaries,
        onExpandCategory: () => [],
        interactiveSide: "playerOne",
        selectionState,
      },
    });

    expect(body).toContain("Revealed cards");
    expect(body).toContain("Use the board overlay to drag cards between rows");
    expect(body).toContain(">Top of deck<");
    expect(body).toContain(">Bottom of deck<");
    expect(body).not.toContain("Elsa - Ice Surfer");
  });

  it("renders available move card names with the shared event-log card token markup", () => {
    const selectionState: AvailableMovesSelectionState = {
      mode: "resolution-target",
      sessionKey: "resolution:play-card",
      sourceCardId: null,
      categoryId: "play-card",
      categoryLabel: "Play",
      title: "Play",
      message: "Select a card to play.",
      canBack: false,
      canCancel: true,
      canConfirm: false,
      effectType: null,
      target: {
        selector: "all",
        owner: "you",
        zones: ["hand"],
      },
      allowedZones: ["hand"],
      candidateCardIds: ["card-1"],
      candidatePlayerIds: [],
      viewerSide: "playerOne",
      candidateEntries: [],
      activeSlotIndex: null,
      slots: [],
      amountSelection: null,
      selectedTargetLabels: [],
      minimumSelections: 1,
      maximumSelections: 1,
      entries: [
        {
          id: "play:card-1",
          kind: "card",
          cardId: "card-1",
          label: "Friends on the Other Side",
          selected: false,
        },
      ],
    };

    const { body } = render(AvailableMovesPanel, {
      props: {
        summaries: placeholderSummaries,
        onExpandCategory: () => [],
        interactiveSide: "playerOne",
        cardSnapshots,
        selectionState,
      },
    });

    expect(body).toContain("Friends on the Other Side");
    expect(body).toContain("underline-offset-2");
    expect(body).toContain("text-fuchsia-300");
  });
});
