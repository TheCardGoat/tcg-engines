import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";

import DeckValidationDetails from "./DeckValidationDetails.svelte";
import type { DeckFormatResult } from "@tcg/lorcana-types";
import type { ProfileDeckSummary } from "../api/player-context-api.js";

const deck: ProfileDeckSummary = {
  deckId: "deck-1",
  deckName: "Set 13 Test",
  activeDeckVersionId: "version-1",
  activeDeckListId: "list-1",
  cardCount: 60,
  colorMask: 0,
  updatedAt: "2026-07-03T00:00:00.000Z",
  validFormats: ["infinity"],
};

describe("DeckValidationDetails", () => {
  it("renders Early Access validation failures with underlined card hover references", () => {
    const validation: DeckFormatResult = {
      formatId: "attack-of-the-vine",
      valid: false,
      rules: [
        {
          kind: "CARD_SET",
          passed: false,
          message: "Cards not legal in Attack of the Vine: Mickey Mouse.",
          details: {
            type: "CARD_SET",
            formatLabel: "Attack of the Vine",
            cards: [
              {
                publicId: "mickey",
                fullName: "Mickey Mouse - Brave Little Tailor",
                sets: ["ROJ"],
                quantity: 4,
              },
            ],
          },
        },
      ],
    };

    const { body } = render(DeckValidationDetails, {
      props: {
        deck,
        formatId: "attack-of-the-vine",
        initialResult: validation,
        initialCatalog: {
          mickey: {
            fullName: "Mickey Mouse - Brave Little Tailor",
            name: "Mickey Mouse",
            version: "Brave Little Tailor",
            set: "008",
            cardNumber: 123,
            cardType: "character",
            inkType: ["amber"],
          },
        } as never,
      },
    });

    expect(body).toContain("Deck not legal for Early Access");
    expect(body).toContain("Cards outside this format");
    expect(body).toContain("Mickey Mouse - Brave Little Tailor");
    expect(body).toContain("underline");
    expect(body).toContain("show card preview");
  });

  it("falls back to underlined text and caps long card lists", () => {
    const cards = Array.from({ length: 8 }, (_, index) => ({
      publicId: `card-${index}`,
      fullName: `Invalid Card ${index}`,
      sets: ["ROJ" as const],
      quantity: 1,
    }));
    const validation: DeckFormatResult = {
      formatId: "attack-of-the-vine",
      valid: false,
      rules: [
        {
          kind: "CARD_SET",
          passed: false,
          message: "Cards not legal in Attack of the Vine.",
          details: {
            type: "CARD_SET",
            formatLabel: "Attack of the Vine",
            cards,
          },
        },
      ],
    };

    const { body } = render(DeckValidationDetails, {
      props: {
        deck,
        formatId: "attack-of-the-vine",
        initialResult: validation,
        initialCatalog: {},
      },
    });

    expect(body).toContain("Invalid Card 0");
    expect(body).toContain("Invalid Card 5");
    expect(body).not.toContain("Invalid Card 6");
    expect(body).toContain("and 2 more");
    expect(body).toContain("decoration-dotted");
  });

  it("renders an explanation when validation has no itemized failed rules", () => {
    const validation: DeckFormatResult = {
      formatId: "core-constructed",
      valid: false,
      rules: [],
    };

    const { body } = render(DeckValidationDetails, {
      props: {
        deck,
        formatId: "core-constructed",
        initialResult: validation,
        initialCatalog: {},
      },
    });

    expect(body).toContain("Deck not legal for Core Constructed");
    expect(body).toContain("No itemized issues returned");
    expect(body).toContain("This deck is not listed as legal for Core Constructed");
    expect(body).not.toContain("sim.matchmaking.matchmaking.formats.core-constructed");
  });

  it("renders server legality rule messages when card details are not included", () => {
    const validation: DeckFormatResult = {
      formatId: "infinity",
      valid: false,
      rules: [
        {
          kind: "CARD_SET",
          passed: false,
          message: "Cards not legal in Infinity: Test Card.",
        },
      ],
    };

    const { body } = render(DeckValidationDetails, {
      props: {
        deck,
        formatId: "infinity",
        initialResult: validation,
        initialCatalog: {},
      },
    });

    expect(body).toContain("Deck not legal for Infinity");
    expect(body).toContain("Cards outside this format");
    expect(body).toContain("Cards not legal in Infinity: Test Card.");
  });

  it("shows a player-facing recreate message for ambiguous legacy deck ids", () => {
    const validation: DeckFormatResult = {
      formatId: "core-constructed",
      valid: false,
      rules: [
        {
          kind: "CARD_SET",
          passed: false,
          message:
            "This deck was saved with outdated card IDs that can no longer be safely matched to the correct cards. Please recreate or re-import this deck before joining matchmaking.",
        },
      ],
    };

    const { body } = render(DeckValidationDetails, {
      props: {
        deck,
        formatId: "core-constructed",
        initialResult: validation,
        initialCatalog: {},
      },
    });

    expect(body).toContain("Deck needs to be recreated");
    expect(body).toContain(
      "Please recreate or re-import the deck from your deck list before joining matchmaking.",
    );
    expect(body).not.toContain("Ambiguous legacy card IDs");
    expect(body).not.toContain("hab");
  });

  it("renders readable text for every deck validation invalidation kind", () => {
    const validation: DeckFormatResult = {
      formatId: "attack-of-the-vine",
      valid: false,
      rules: [
        {
          kind: "DECK_SIZE",
          passed: false,
          message: "Deck has 58 cards but requires at least 60.",
          details: {
            type: "DECK_SIZE",
            count: 58,
            minimum: 60,
          },
        },
        {
          kind: "INK_TYPES",
          passed: false,
          message: "Deck uses too many ink types.",
          details: {
            type: "INK_TYPES",
            inkTypes: ["amber", "emerald", "ruby"],
            maximum: 2,
          },
        },
        {
          kind: "CARD_QUANTITY",
          passed: false,
          message: "Too many copies: Test Copy.",
          details: {
            type: "CARD_QUANTITY",
            cards: [
              {
                publicId: "copy-card",
                fullName: "Test Copy",
                sets: ["ROJ"],
                quantity: 5,
                maximum: 4,
              },
            ],
          },
        },
        {
          kind: "CARD_SET",
          passed: false,
          message: "Cards not legal in Early Access: Old Card.",
          details: {
            type: "CARD_SET",
            formatLabel: "Early Access",
            cards: [
              {
                publicId: "old-card",
                fullName: "Old Card",
                sets: ["TFC"],
                quantity: 1,
              },
            ],
          },
        },
        {
          kind: "BANNED_CARD",
          passed: false,
          message: "Banned in Early Access: Banned Card.",
          details: {
            type: "BANNED_CARD",
            formatLabel: "Early Access",
            cards: [
              {
                publicId: "banned-card",
                fullName: "Banned Card",
                sets: ["ROJ"],
                quantity: 1,
              },
            ],
          },
        },
        {
          kind: "REQUIRES_ANY_SET",
          passed: false,
          message: "Early Access requires at least one card from: 013.",
          details: {
            type: "REQUIRES_ANY_SET",
            requiredSets: ["013"],
          },
        },
      ],
    };

    const { body } = render(DeckValidationDetails, {
      props: {
        deck,
        formatId: "attack-of-the-vine",
        initialResult: validation,
        initialCatalog: {},
      },
    });

    expect(body).toContain("(6 issues)");
    expect(body).toContain("Deck size");
    expect(body).toContain("Add 2 more card(s). This deck has 58, and the minimum is 60.");
    expect(body).toContain("Too many ink types");
    expect(body).toContain("Use at most 2 ink types. This deck uses amber, emerald, ruby.");
    expect(body).toContain("Too many copies");
    expect(body).toContain("Reduce these cards to their allowed copy limit.");
    expect(body).toContain("Test Copy");
    expect(body).toContain("5 copies, maximum 4");
    expect(body).toContain("Cards outside this format");
    expect(body).toContain("Remove these cards or choose a format where they are legal.");
    expect(body).toContain("Old Card");
    expect(body).toContain("Banned cards");
    expect(body).toContain("Remove these cards before joining this format.");
    expect(body).toContain("Banned Card");
    expect(body).toContain("Missing Early Access cards");
    expect(body).toContain("Add at least one card from 013.");
  });
});
