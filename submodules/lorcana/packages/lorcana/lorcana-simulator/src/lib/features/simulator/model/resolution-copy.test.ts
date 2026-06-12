import { describe, expect, it } from "bun:test";
import type {
  CardInstanceId,
  PlayerId,
  TargetResolutionSelectionContext,
} from "@tcg/lorcana-engine";

import {
  buildResolutionCopyBundle,
  buildScryOverlayHeaderHeading,
  getResolutionInteractionStatusMessage,
  SCRY_OVERLAY_TITLE_MAX_CHARS,
} from "./resolution-copy.js";
import type { LorcanaCardSnapshot } from "./contracts.js";

function asCardId(value: string): CardInstanceId {
  return value as CardInstanceId;
}

function asPlayerId(value: string): PlayerId {
  return value as PlayerId;
}

function createCardSnapshot(overrides: Partial<LorcanaCardSnapshot> = {}): LorcanaCardSnapshot {
  return {
    cardId: overrides.cardId ?? "card-1",
    definitionId: overrides.definitionId ?? "card-1",
    isMasked: overrides.isMasked ?? false,
    label: overrides.label ?? "Goofy - Musketeer",
    ownerId: overrides.ownerId ?? "player-1",
    ownerSide: overrides.ownerSide ?? "playerOne",
    zoneId: overrides.zoneId ?? "play",
    facePresentation: overrides.facePresentation ?? "faceUp",
    cardType: overrides.cardType ?? "character",
    textEntries: overrides.textEntries ?? [],
    ...overrides,
  };
}

function createTargetSelectionContext(
  overrides: Partial<TargetResolutionSelectionContext> = {},
): TargetResolutionSelectionContext {
  return {
    origin: "pending-effect",
    requestId: "effect-1",
    kind: "target-selection",
    sourceCardId: asCardId("source-1"),
    chooserId: asPlayerId("player-1"),
    currentSelection: {},
    submitField: "targets",
    targetDsl: [],
    cardCandidateIds: [asCardId("target-1")],
    playerCandidateIds: [],
    allowedZones: ["play"],
    minSelections: 1,
    maxSelections: 1,
    ordered: false,
    autoRejected: false,
    ...overrides,
  };
}

describe("resolution-copy", () => {
  it("builds rich optional-effect copy when title and description are available", () => {
    const sourceCard = createCardSnapshot({
      label: "Mulan - Disguised Soldier",
      textEntries: [
        {
          title: "WHERE DO I SIGN IN?",
          description:
            "When you play this character, you may draw a card, then choose and discard a card.",
        },
      ],
    });

    const copy = buildResolutionCopyBundle({
      kind: "optional-selection",
      sourceCard,
    });

    expect(copy.referenceLabel).toBe("Mulan - Disguised Soldier: WHERE DO I SIGN IN?");
    expect(copy.detailMessage).toBe(
      "Resolve optional effect from Mulan - Disguised Soldier: WHERE DO I SIGN IN?. When you play this character, you may draw a card, then choose and discard a card.",
    );
    expect(copy.promptMessage).toBe(copy.detailMessage);
    expect(copy.promptInlineReference).toEqual({
      label: "Mulan - Disguised Soldier: WHERE DO I SIGN IN?.",
      card: sourceCard,
      prefix: "Resolve optional effect from ",
      suffix: " When you play this character, you may draw a card, then choose and discard a card.",
    });
  });

  it("falls back to description-only optional copy when no title is present", () => {
    const sourceCard = createCardSnapshot({
      label: "Ariel - Adventurous Collector",
      textEntries: [
        {
          title: "",
          description: "You may draw a card.",
        },
      ],
    });

    const copy = buildResolutionCopyBundle({
      kind: "optional-selection",
      sourceCard,
    });

    expect(copy.detailMessage).toBe(
      "Resolve optional effect from Ariel - Adventurous Collector: You may draw a card.",
    );
    expect(copy.promptMessage).toBe(
      "Accept or decline Ariel - Adventurous Collector directly from the simulator.",
    );
  });

  it("uses explicit effect titles for single-target target-selection prompts", () => {
    const sourceCard = createCardSnapshot({
      label: "Jasmine - Resourceful Infiltrator",
    });

    const copy = buildResolutionCopyBundle({
      kind: "target-selection",
      sourceCard,
      effectTitle: "JUST WHAT YOU NEED",
      targetSelectionContext: createTargetSelectionContext(),
    });

    expect(copy.referenceLabel).toBe("Jasmine - Resourceful Infiltrator: JUST WHAT YOU NEED");
    expect(copy.promptMessage).toBe(
      "Select the required target or player for Jasmine - Resourceful Infiltrator: JUST WHAT YOU NEED.",
    );
  });

  it("uses abilityIndex to resolve localized target-selection prompts", () => {
    const sourceCard = createCardSnapshot({
      label: "Jasmine - Resourceful Infiltrator",
      textEntries: [
        {
          title: "JUST WHAT YOU NEED",
          description:
            "When you play this character, you may give another chosen character Resist +1 until the start of your next turn.",
        },
        {
          title: "",
          description: "Ward",
        },
      ],
    });

    const copy = buildResolutionCopyBundle({
      kind: "target-selection",
      sourceCard,
      abilityIndex: 0,
      targetSelectionContext: createTargetSelectionContext(),
    });

    expect(copy.referenceLabel).toBe("Jasmine - Resourceful Infiltrator: JUST WHAT YOU NEED");
    expect(copy.promptMessage).toBe(
      "Select the required target or player for Jasmine - Resourceful Infiltrator: JUST WHAT YOU NEED.",
    );
    expect(copy.detailMessage).toBe(copy.promptMessage);
  });

  it("falls back to a single-entry card title when abilityIndex is unavailable", () => {
    const sourceCard = createCardSnapshot({
      label: "Jasmine - Resourceful Infiltrator",
      textEntries: [
        {
          title: "JUST WHAT YOU NEED",
          description:
            "When you play this character, you may give another chosen character Resist +1 until the start of your next turn.",
        },
      ],
    });

    const copy = buildResolutionCopyBundle({
      kind: "target-selection",
      sourceCard,
      targetSelectionContext: createTargetSelectionContext(),
    });

    expect(copy.referenceLabel).toBe("Jasmine - Resourceful Infiltrator: JUST WHAT YOU NEED");
    expect(copy.promptMessage).toBe(
      "Select the required target or player for Jasmine - Resourceful Infiltrator: JUST WHAT YOU NEED.",
    );
  });

  it("avoids guessing a title from multi-entry cards when abilityIndex is unavailable", () => {
    const sourceCard = createCardSnapshot({
      label: "Jasmine - Resourceful Infiltrator",
      textEntries: [
        {
          title: "JUST WHAT YOU NEED",
          description:
            "When you play this character, you may give another chosen character Resist +1 until the start of your next turn.",
        },
        {
          title: "",
          description: "Ward",
        },
      ],
    });

    const copy = buildResolutionCopyBundle({
      kind: "target-selection",
      sourceCard,
      targetSelectionContext: createTargetSelectionContext(),
    });

    expect(copy.referenceLabel).toBe("Jasmine - Resourceful Infiltrator");
    expect(copy.promptMessage).toBe(
      "Select the required target or player for Jasmine - Resourceful Infiltrator.",
    );
  });

  it("keeps multi-target prompts more specific", () => {
    const copy = buildResolutionCopyBundle({
      kind: "target-selection",
      sourceCard: createCardSnapshot({ label: "Twin Fire", cardType: "action" }),
      targetSelectionContext: createTargetSelectionContext({
        minSelections: 1,
        maxSelections: 2,
      }),
    });

    expect(copy.promptMessage).toBe("Select 1-2 valid targets for Twin Fire.");
  });

  it('uses "up to N (optional)" wording when the selection accepts 0 targets', () => {
    const copy = buildResolutionCopyBundle({
      kind: "target-selection",
      sourceCard: createCardSnapshot({ label: "Elsa - Spirit of Winter" }),
      effectTitle: "DEEP FREEZE",
      targetSelectionContext: createTargetSelectionContext({
        minSelections: 0,
        maxSelections: 2,
      }),
    });

    expect(copy.promptMessage).toBe(
      "Choose up to 2 targets for Elsa - Spirit of Winter: DEEP FREEZE (optional).",
    );
    expect(copy.subtitle).toBe("Target selection (optional)");
  });

  it("shows the printed max from declaredMaxSelections even when runtime candidates clamp it", () => {
    // Elsa on an otherwise-empty board: only self is a valid target so the
    // engine clamps `maxSelections` to 1, but the card text still reads
    // "up to 2". The prompt should reflect the card text, not the clamp.
    const copy = buildResolutionCopyBundle({
      kind: "target-selection",
      sourceCard: createCardSnapshot({ label: "Elsa - Spirit of Winter" }),
      effectTitle: "DEEP FREEZE",
      targetSelectionContext: createTargetSelectionContext({
        minSelections: 0,
        maxSelections: 1,
        declaredMaxSelections: 2,
      }),
    });

    expect(copy.promptMessage).toBe(
      "Choose up to 2 targets for Elsa - Spirit of Winter: DEEP FREEZE (optional).",
    );
  });

  it("covers choice, name-card, and scry flows", () => {
    const sourceCard = createCardSnapshot({
      label: "Yzma - On Edge",
      textEntries: [
        {
          title: "WHY DO WE EVEN HAVE THAT LEVER?",
          description: "Choose one.",
        },
      ],
    });

    expect(
      buildResolutionCopyBundle({
        kind: "choice-selection",
        sourceCard,
      }).promptMessage,
    ).toBe("Choose an effect for Yzma - On Edge: WHY DO WE EVEN HAVE THAT LEVER?.");

    expect(
      buildResolutionCopyBundle({
        kind: "choice-selection",
        sourceCard,
        targetLabel: "Cinderella - Dream Come True",
      }).promptMessage,
    ).toBe(
      "Choose an effect for Yzma - On Edge: WHY DO WE EVEN HAVE THAT LEVER? targeting Cinderella - Dream Come True.",
    );

    expect(
      buildResolutionCopyBundle({
        kind: "choice-selection",
        sourceCard,
        targetLabel: "Cinderella - Dream Come True",
      }).sessionStatusMessage,
    ).toBe(
      "Choose how Yzma - On Edge: WHY DO WE EVEN HAVE THAT LEVER? resolves targeting Cinderella - Dream Come True.",
    );

    expect(
      buildResolutionCopyBundle({
        kind: "name-card-selection",
        sourceCard,
      }).promptMessage,
    ).toBe("Name a card before resolving Yzma - On Edge: WHY DO WE EVEN HAVE THAT LEVER?.");
    expect(
      buildResolutionCopyBundle({
        kind: "scry-selection",
        sourceCard,
      }).promptMessage,
    ).toBe(
      "Arrange the revealed cards to finish resolving Yzma - On Edge: WHY DO WE EVEN HAVE THAT LEVER?.",
    );
  });

  it("returns null abilityDescription for optional-selection when description is already embedded in promptMessage", () => {
    // When cardLabel + title + description are all present, the description is embedded
    // in the promptMessage so abilityDescription is omitted to avoid duplication.
    const sourceCard = createCardSnapshot({
      label: "Mulan - Disguised Soldier",
      textEntries: [
        {
          title: "WHERE DO I SIGN IN?",
          description: "  When you play this character, you may draw a card.  ",
        },
      ],
    });

    const copy = buildResolutionCopyBundle({
      kind: "optional-selection",
      sourceCard,
    });

    expect(copy.abilityDescription).toBeNull();
    expect(copy.promptMessage).toContain("When you play this character, you may draw a card.");
  });

  it("includes abilityDescription from the primary text entry description for non-optional-selection kinds", () => {
    const sourceCard = createCardSnapshot({
      label: "Mulan - Disguised Soldier",
      textEntries: [
        {
          title: "WHERE DO I SIGN IN?",
          description: "  When you play this character, you may draw a card.  ",
        },
      ],
    });

    const copy = buildResolutionCopyBundle({
      kind: "target-selection",
      sourceCard,
      targetSelectionContext: createTargetSelectionContext(),
    });

    expect(copy.abilityDescription).toBe("When you play this character, you may draw a card.");
  });

  it("returns null abilityDescription when no text entries exist", () => {
    const copy = buildResolutionCopyBundle({
      kind: "target-selection",
      sourceCard: createCardSnapshot({ textEntries: [] }),
      targetSelectionContext: createTargetSelectionContext(),
    });

    expect(copy.abilityDescription).toBeNull();
  });

  it("returns null abilityDescription when the card itself is null", () => {
    const copy = buildResolutionCopyBundle({
      kind: "target-selection",
      sourceCard: null,
      targetSelectionContext: createTargetSelectionContext(),
    });

    expect(copy.abilityDescription).toBeNull();
  });

  it("uses abilityIndex to select the correct abilityDescription from multi-entry cards", () => {
    const sourceCard = createCardSnapshot({
      label: "Jasmine - Resourceful Infiltrator",
      textEntries: [
        {
          title: "JUST WHAT YOU NEED",
          description:
            "When you play this character, you may give another chosen character Resist +1.",
        },
        {
          title: "",
          description: "Ward",
        },
      ],
    });

    const copyFirst = buildResolutionCopyBundle({
      kind: "target-selection",
      sourceCard,
      abilityIndex: 0,
      targetSelectionContext: createTargetSelectionContext(),
    });
    expect(copyFirst.abilityDescription).toBe(
      "When you play this character, you may give another chosen character Resist +1.",
    );

    const copySecond = buildResolutionCopyBundle({
      kind: "target-selection",
      sourceCard,
      abilityIndex: 1,
      targetSelectionContext: createTargetSelectionContext(),
    });
    expect(copySecond.abilityDescription).toBe("Ward");
  });

  it("uses generic copy when card context is unavailable", () => {
    const copy = buildResolutionCopyBundle({
      kind: "target-selection",
      sourceCard: null,
      targetSelectionContext: createTargetSelectionContext(),
    });

    expect(copy.referenceLabel).toBeNull();
    expect(copy.promptMessage).toBe(
      "Select the required target or player before resolving this effect.",
    );
    expect(copy.sessionStatusMessage).toBe("Select target for this effect.");
  });

  it("keeps short scry overlay titles as a single line", () => {
    expect(buildScryOverlayHeaderHeading("Arrange cards for Moana.", "Moana")).toEqual({
      title: "Arrange cards for Moana.",
      headerSubtitle: null,
    });
  });

  it("splits long scry overlay titles using the card label", () => {
    const long =
      "Resolve optional effect from Water Has Memory: Look at the top 4 cards of chosen player's deck.";
    expect(long.length).toBeGreaterThan(SCRY_OVERLAY_TITLE_MAX_CHARS);
    expect(buildScryOverlayHeaderHeading(long, "Water Has Memory")).toEqual({
      title: "Water Has Memory",
      headerSubtitle: long,
    });
  });

  it("ellipsizes long scry titles when no card label is available", () => {
    const long = "x".repeat(SCRY_OVERLAY_TITLE_MAX_CHARS + 20);
    const out = buildScryOverlayHeaderHeading(long, null);
    expect(out.title.endsWith("…")).toBe(true);
    expect(out.title.length).toBe(SCRY_OVERLAY_TITLE_MAX_CHARS + 1);
    expect(out.headerSubtitle).toBe(long);
  });

  it("reports dynamic interaction status consistently", () => {
    expect(
      getResolutionInteractionStatusMessage({
        kind: "target-selection",
        phase: "selecting",
        selectedTargetCount: 2,
      }),
    ).toBe("Selecting targets (2 selected)...");
    expect(
      getResolutionInteractionStatusMessage({
        kind: "optional-selection",
        phase: "selecting",
      }),
    ).toBe("Deciding whether to resolve...");
    expect(
      getResolutionInteractionStatusMessage({
        kind: "scry-selection",
        phase: "executing",
      }),
    ).toBe("Executing...");
  });
});
