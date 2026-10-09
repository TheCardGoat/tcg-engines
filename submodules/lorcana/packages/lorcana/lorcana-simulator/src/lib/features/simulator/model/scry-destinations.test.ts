import { describe, expect, it } from "bun:test";
import type { ResolutionSelectionDestinationRule } from "@tcg/lorcana-engine";
import type { CardFilter } from "@tcg/lorcana-types";
import {
  canAssignCardToScryDestination,
  getScryDestinationConstraintSummary,
  isScryDestinationManuallyOrdered,
} from "./scry-destinations.js";
import type { LorcanaCardSnapshot } from "./contracts.js";

const baseCard: LorcanaCardSnapshot = {
  cardId: "card-1",
  definitionId: "def-1",
  isMasked: false,
  label: "Reflection",
  ownerId: "player_one",
  ownerSide: "playerOne",
  zoneId: "deck",
  cardType: "action",
  actionSubtype: "song",
  cost: 1,
  facePresentation: "faceUp",
};

describe("scry destination helpers", () => {
  it("evaluates selection filters using card metadata", () => {
    expect(
      canAssignCardToScryDestination(baseCard, {
        id: "song-hand",
        zone: "hand",
        min: 0,
        max: 1,
        remainder: false,
        filters: [{ type: "song" }],
      }),
    ).toBe(true);

    expect(
      canAssignCardToScryDestination(baseCard, {
        id: "character-only",
        zone: "play",
        min: 0,
        max: 1,
        remainder: false,
        filters: [{ type: "card-type", cardType: "character" }],
      }),
    ).toBe(false);

    const downInNewOrleansPlayFilters: CardFilter = {
      type: "and",
      filters: [
        {
          type: "or",
          filters: [
            { type: "card-type", cardType: "character" },
            { type: "card-type", cardType: "item" },
            { type: "card-type", cardType: "location" },
          ],
        },
        {
          type: "cost-comparison",
          comparison: "less-or-equal",
          value: 6,
        },
      ],
    };

    const downInNewOrleansPlayRule: ResolutionSelectionDestinationRule = {
      id: "play-eligible",
      zone: "play",
      min: 0,
      max: 1,
      remainder: false,
      filters: [downInNewOrleansPlayFilters],
    };

    expect(
      canAssignCardToScryDestination(
        { ...baseCard, cardType: "action", actionSubtype: "song", cost: 3 },
        downInNewOrleansPlayRule,
      ),
    ).toBe(false);

    expect(
      canAssignCardToScryDestination(
        { ...baseCard, cardType: "character", cost: 3 },
        downInNewOrleansPlayRule,
      ),
    ).toBe(true);
  });

  it("formats destination summaries for the overlay", () => {
    expect(
      getScryDestinationConstraintSummary({
        id: "ink",
        zone: "inkwell",
        min: 1,
        max: 1,
        remainder: false,
        facedown: true,
        exerted: true,
      }),
    ).toContain("facedown, exerted");
  });

  it("only allows manual reorder for player-ordered deck destinations", () => {
    expect(
      isScryDestinationManuallyOrdered({
        id: "top",
        zone: "deck-top",
        min: 0,
        max: null,
        remainder: true,
        ordering: "player-choice",
      }),
    ).toBe(true);

    expect(
      isScryDestinationManuallyOrdered({
        id: "hand",
        zone: "hand",
        min: 0,
        max: 1,
        remainder: false,
      }),
    ).toBe(false);
  });
});

it("restricts Belle's hand destination to the named item or an action", () => {
  const rule: ResolutionSelectionDestinationRule = {
    id: "belle-hand",
    zone: "hand",
    min: 0,
    max: 1,
    remainder: false,
    filters: [
      {
        type: "or",
        filters: [
          {
            type: "and",
            filters: [
              { type: "card-type", cardType: "item" },
              { type: "has-name", name: "Belle's City Guide" },
            ],
          },
          { type: "card-type", cardType: "action" },
        ],
      },
    ],
  };
  expect(
    canAssignCardToScryDestination(
      { cardType: "item", nameVariants: ["Belle's City Guide"] },
      rule,
    ),
  ).toBe(true);
  expect(
    canAssignCardToScryDestination({ cardType: "item", nameVariants: ["Inkcaster Skates"] }, rule),
  ).toBe(false);
  expect(
    canAssignCardToScryDestination(
      { cardType: "character", nameVariants: ["Belle's City Guide"] },
      rule,
    ),
  ).toBe(false);
  expect(canAssignCardToScryDestination({ cardType: "action", actionSubtype: "song" }, rule)).toBe(
    true,
  );
});

it("restricts Fred's hand destination to a Super character or item", () => {
  const rule: ResolutionSelectionDestinationRule = {
    id: "fred-hand",
    zone: "hand",
    min: 0,
    max: 1,
    remainder: false,
    filters: [
      {
        type: "or",
        filters: [
          {
            type: "and",
            filters: [
              { type: "card-type", cardType: "character" },
              { type: "has-classification", classification: "Super" },
            ],
          },
          { type: "card-type", cardType: "item" },
        ],
      },
    ],
  };
  expect(
    canAssignCardToScryDestination({ cardType: "character", classifications: ["Super"] }, rule),
  ).toBe(true);
  expect(
    canAssignCardToScryDestination({ cardType: "character", classifications: ["Hero"] }, rule),
  ).toBe(false);
  expect(canAssignCardToScryDestination({ cardType: "item" }, rule)).toBe(true);
  expect(
    canAssignCardToScryDestination({ cardType: "action", classifications: ["Super"] }, rule),
  ).toBe(false);
});

it("offers Abby's hand route only for a song or a character with Singer", () => {
  const rule: ResolutionSelectionDestinationRule = {
    id: "abby-hand",
    zone: "hand",
    min: 0,
    max: 1,
    remainder: false,
    filters: [
      {
        type: "or",
        filters: [
          { type: "is-song" },
          {
            type: "and",
            filters: [
              { type: "card-type", cardType: "character" },
              { type: "has-keyword", keyword: "Singer" },
            ],
          },
        ],
      },
    ],
  };
  expect(canAssignCardToScryDestination({ cardType: "action", actionSubtype: "song" }, rule)).toBe(
    true,
  );
  expect(
    canAssignCardToScryDestination({ cardType: "character", keywords: ["Singer"] }, rule),
  ).toBe(true);
  expect(
    canAssignCardToScryDestination({ cardType: "character", keywords: ["Support"] }, rule),
  ).toBe(false);
  expect(canAssignCardToScryDestination({ cardType: "action" }, rule)).toBe(false);
  expect(canAssignCardToScryDestination({ cardType: "item", keywords: ["Singer"] }, rule)).toBe(
    false,
  );
  expect(canAssignCardToScryDestination({ cardType: "location" }, rule)).toBe(false);
});
