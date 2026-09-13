import type { GundamFormatLegalityPolicy } from "./format-legality.ts";

export const GUNDAM_EN_US_CONSTRUCTED_FORMAT_ID = "constructed-en-us";

export const GUNDAM_EN_US_APRIL_2026_POLICY_URL = "https://www.gundam-gcg.com/en/news/01_234.html";
export const GUNDAM_EN_US_JULY_2026_ANNOUNCEMENT_URL =
  "https://www.gundam-gcg.com/en/news/01_277.html";
export const GUNDAM_EN_US_CURRENT_POLICY_URL = "https://www.gundam-gcg.com/en/news/01_279.html";

/**
 * Card-number group explicitly listed by the official July 24, 2026 current
 * B&R page for vanilla Units with Lv.2, cost 1, 2 AP, and 2 HP.
 */
export const GUNDAM_EN_US_JULY_2026_VANILLA_UNIT_GROUP = [
  "GD01-035",
  "GD01-060",
  "GD01-085",
  "GD02-013",
  "GD02-080",
  "GD03-032",
  "GD03-063",
  "GD04-078",
  "GD05-014",
  "GD05-027",
  "GD05-042",
  "GD05-062",
  "GD05-077",
  "ST01-005",
  "ST04-008",
  "ST05-004",
  "ST05-009",
  "ST06-004",
  "ST09-005",
  "ST10-005",
] as const;

/**
 * Immutable EN-US policy snapshots sourced from official announcements.
 *
 * Construction mode is intentionally separate: this policy series applies to
 * both standard and BO3 decks, while `validateDeckList` decides whether a
 * sideboard is permitted. Where a sideboard exists, its resolved cards are
 * included in the same policy counts as the main deck.
 */
export const GUNDAM_EN_US_OFFICIAL_FORMAT_POLICIES = [
  {
    id: "en-us-constructed-2026-04-01",
    formatId: GUNDAM_EN_US_CONSTRUCTED_FORMAT_ID,
    version: "2026-04-01",
    announcedAt: "2026-03-27",
    effectiveFrom: "2026-04-01",
    effectiveUntil: "2026-07-24",
    sourceUrls: [GUNDAM_EN_US_APRIL_2026_POLICY_URL],
    copyRestrictions: [
      {
        cardId: "ST02-016",
        maxCopies: 2,
        reason: "Official EN-US Restricted (2) list",
      },
    ],
    unresolvedExceptions: [
      {
        id: "wings-of-advance-unchanged-lineup",
        description:
          "The unchanged Wings of Advance [ST02] starter deck may use its original three ST02-016 copies. The checked-in official source snapshot does not provide the complete per-card quantity multiset needed to prove the registered Main Deck and Resource Deck, so this exception is not automatically applied.",
        sourceUrl: GUNDAM_EN_US_APRIL_2026_POLICY_URL,
      },
    ],
  },
  {
    id: "en-us-constructed-2026-07-24",
    formatId: GUNDAM_EN_US_CONSTRUCTED_FORMAT_ID,
    version: "2026-07-24",
    announcedAt: "2026-07-10",
    effectiveFrom: "2026-07-24",
    sourceUrls: [GUNDAM_EN_US_JULY_2026_ANNOUNCEMENT_URL, GUNDAM_EN_US_CURRENT_POLICY_URL],
    bannedCards: [
      {
        cardId: "GD01-020",
        reason: "Official EN-US banned-card list",
      },
    ],
    copyRestrictions: [
      {
        cardId: "ST02-016",
        maxCopies: 2,
        reason: "Official EN-US Restricted (2) list",
      },
    ],
    compositionRestrictions: [
      {
        id: "gd01-008-gd05-015",
        kind: "cannot-combine",
        cardIds: ["GD01-008", "GD05-015"],
        reason: "Official EN-US banned pair",
      },
      {
        id: "st01-010-st05-010",
        kind: "cannot-combine",
        cardIds: ["ST01-010", "ST05-010"],
        reason: "Official EN-US banned pair",
      },
      {
        id: "vanilla-lv2-cost1-2ap-2hp",
        kind: "mutually-exclusive-identities",
        cardIds: GUNDAM_EN_US_JULY_2026_VANILLA_UNIT_GROUP,
        reason:
          "Official EN-US banned-pair group for listed effectless Lv.2, cost 1, 2 AP, 2 HP Units",
      },
    ],
    unresolvedExceptions: [
      {
        id: "wings-of-advance-unchanged-lineup",
        description:
          "The unchanged Wings of Advance [ST02] starter deck may use its original three ST02-016 copies. The checked-in official source snapshot does not provide the complete per-card quantity multiset needed to prove the registered Main Deck and Resource Deck, so this exception is not automatically applied.",
        sourceUrl: GUNDAM_EN_US_APRIL_2026_POLICY_URL,
      },
      {
        id: "iron-bloom-unchanged-lineup",
        description:
          "The unchanged Iron Bloom [ST05] starter deck may retain its original matching vanilla Units. The checked-in official source snapshot does not provide the complete per-card quantity multiset or Resource identity needed to prove the registered Main Deck and Resource Deck, so this exception is not automatically applied.",
        sourceUrl: GUNDAM_EN_US_JULY_2026_ANNOUNCEMENT_URL,
      },
    ],
  },
] as const satisfies ReadonlyArray<GundamFormatLegalityPolicy>;
