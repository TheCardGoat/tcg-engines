import type { DeckList } from "@tcg/gundam-engine";

/**
 * Tournament decklists imported from tcgtopdecks-hq.com.  The source exports
 * card numbers only, so keep the neutral ordinal names stable for shared
 * simulator links and bot-bench identifiers.
 */
export const topdecks01: DeckList = {
  name: "Top Decks 01",
  description: "Tournament fixture 01 (tcgtopdecks-hq export).",
  cards: [
    { cardNumber: "ST01-005", count: 4 },
    { cardNumber: "GD01-008", count: 4 },
    { cardNumber: "ST05-004", count: 3 },
    { cardNumber: "GD02-013", count: 4 },
    // Source export had 49 cards; normalized to a legal 50-card fixture.
    { cardNumber: "GD01-018", count: 4 },
    { cardNumber: "ST05-006", count: 2 },
    { cardNumber: "GD02-054", count: 4 },
    { cardNumber: "ST01-001", count: 4 },
    { cardNumber: "GD01-020", count: 4 },
    { cardNumber: "GD03-056", count: 4 },
    { cardNumber: "ST05-010", count: 4 },
    { cardNumber: "ST01-010", count: 4 },
    { cardNumber: "GD01-100", count: 1 },
    { cardNumber: "ST02-016", count: 2 },
    { cardNumber: "GD04-122", count: 2 },
  ],
  resource: { cardNumber: "R-001", count: 10 },
};

export const topdecks02: DeckList = {
  name: "Top Decks 02",
  description: "Tournament fixture 02 (tcgtopdecks-hq export).",
  cards: [
    { cardNumber: "GD01-086", count: 3 },
    { cardNumber: "GD02-079", count: 2 },
    { cardNumber: "GD04-077", count: 3 },
    { cardNumber: "GD01-051", count: 2 },
    { cardNumber: "GD01-044", count: 4 },
    { cardNumber: "GD04-068", count: 4 },
    { cardNumber: "ST03-001", count: 2 },
    { cardNumber: "GD01-066", count: 2 },
    { cardNumber: "GD04-033", count: 4 },
    { cardNumber: "ST04-011", count: 2 },
    { cardNumber: "GD01-093", count: 4 },
    { cardNumber: "ST03-010", count: 4 },
    { cardNumber: "ST03-013", count: 4 },
    { cardNumber: "GD01-118", count: 4 },
    { cardNumber: "ST04-012", count: 2 },
    { cardNumber: "ST03-015", count: 4 },
  ],
  resource: { cardNumber: "R-001", count: 10 },
};

export const topdecks03: DeckList = {
  name: "Top Decks 03",
  description: "Tournament fixture 03 (tcgtopdecks-hq export).",
  cards: [
    { cardNumber: "GD04-016", count: 4 },
    { cardNumber: "GD01-086", count: 2 },
    { cardNumber: "GD04-015", count: 2 },
    { cardNumber: "GD04-077", count: 3 },
    { cardNumber: "ST01-001", count: 3 },
    { cardNumber: "GD01-006", count: 2 },
    { cardNumber: "GD04-003", count: 4 },
    { cardNumber: "GD04-068", count: 2 },
    { cardNumber: "GD04-006", count: 4 },
    { cardNumber: "GD04-065", count: 4 },
    { cardNumber: "ST01-010", count: 4 },
    { cardNumber: "GD04-081", count: 4 },
    { cardNumber: "GD04-098", count: 3 },
    { cardNumber: "GD01-118", count: 3 },
    { cardNumber: "GD01-100", count: 2 },
    { cardNumber: "GD04-121", count: 4 },
  ],
  resource: { cardNumber: "R-001", count: 10 },
};

export const topdecks04: DeckList = {
  name: "Top Decks 04",
  description: "Tournament fixture 04 (tcgtopdecks-hq export).",
  cards: [
    { cardNumber: "GD01-086", count: 4 },
    { cardNumber: "GD02-079", count: 2 },
    { cardNumber: "GD04-077", count: 4 },
    { cardNumber: "GD01-073", count: 3 },
    { cardNumber: "ST04-001", count: 4 },
    { cardNumber: "GD04-068", count: 3 },
    { cardNumber: "ST02-001", count: 4 },
    { cardNumber: "GD01-066", count: 2 },
    { cardNumber: "GD01-024", count: 4 },
    { cardNumber: "GD03-018", count: 1 },
    { cardNumber: "ST04-010", count: 4 },
    { cardNumber: "ST02-010", count: 4 },
    { cardNumber: "GD01-118", count: 4 },
    { cardNumber: "GD01-120", count: 1 },
    { cardNumber: "GD04-117", count: 2 },
    { cardNumber: "GD01-126", count: 2 },
    { cardNumber: "GD03-125", count: 2 },
  ],
  resource: { cardNumber: "R-001", count: 10 },
};

export const topdecks05: DeckList = {
  name: "Top Decks 05",
  description: "Tournament fixture 05 (tcgtopdecks-hq export).",
  cards: [
    { cardNumber: "GD04-016", count: 4 },
    { cardNumber: "GD01-086", count: 4 },
    { cardNumber: "GD04-011", count: 4 },
    { cardNumber: "GD04-077", count: 4 },
    { cardNumber: "ST01-001", count: 3 },
    { cardNumber: "GD04-003", count: 4 },
    { cardNumber: "GD04-006", count: 4 },
    { cardNumber: "GD01-066", count: 4 },
    { cardNumber: "ST01-010", count: 4 },
    { cardNumber: "GD04-081", count: 4 },
    { cardNumber: "GD01-118", count: 4 },
    { cardNumber: "GD01-100", count: 3 },
    { cardNumber: "GD04-121", count: 4 },
  ],
  resource: { cardNumber: "R-001", count: 10 },
};

export const topdecks06: DeckList = {
  name: "Top Decks 06",
  description: "Tournament fixture 06 (tcgtopdecks-hq export).",
  cards: [
    { cardNumber: "GD04-016", count: 4 },
    { cardNumber: "GD01-086", count: 4 },
    { cardNumber: "GD04-011", count: 3 },
    { cardNumber: "ST01-001", count: 3 },
    { cardNumber: "GD01-006", count: 2 },
    { cardNumber: "GD04-003", count: 4 },
    { cardNumber: "GD04-068", count: 2 },
    { cardNumber: "GD04-006", count: 4 },
    { cardNumber: "GD04-065", count: 4 },
    { cardNumber: "ST01-010", count: 4 },
    { cardNumber: "GD04-081", count: 4 },
    { cardNumber: "GD04-098", count: 4 },
    { cardNumber: "GD01-118", count: 4 },
    { cardNumber: "GD04-121", count: 4 },
  ],
  resource: { cardNumber: "R-001", count: 10 },
};

export const topdecks07: DeckList = {
  name: "Top Decks 07",
  description: "Tournament fixture 07 (tcgtopdecks-hq export).",
  cards: [
    { cardNumber: "GD01-086", count: 4 },
    { cardNumber: "GD02-079", count: 3 },
    { cardNumber: "GD04-077", count: 2 },
    { cardNumber: "EB01-054", count: 3 },
    { cardNumber: "ST01-001", count: 4 },
    { cardNumber: "EB01-048", count: 2 },
    { cardNumber: "ST04-001", count: 4 },
    { cardNumber: "GD03-003", count: 3 },
    { cardNumber: "GD03-002", count: 4 },
    { cardNumber: "ST01-010", count: 4 },
    { cardNumber: "ST04-010", count: 2 },
    { cardNumber: "GD03-084", count: 4 },
    { cardNumber: "GD01-118", count: 4 },
    { cardNumber: "GD01-100", count: 3 },
    { cardNumber: "GD04-130", count: 4 },
  ],
  resource: { cardNumber: "R-001", count: 10 },
};

export const topdecks08: DeckList = {
  name: "Top Decks 08",
  description: "Tournament fixture 08 (tcgtopdecks-hq export).",
  cards: [
    { cardNumber: "GD01-086", count: 3 },
    { cardNumber: "GD02-079", count: 1 },
    { cardNumber: "GD04-077", count: 3 },
    { cardNumber: "ST01-001", count: 4 },
    { cardNumber: "GD01-005", count: 2 },
    { cardNumber: "GD04-068", count: 2 },
    { cardNumber: "GD04-066", count: 4 },
    { cardNumber: "GD03-010", count: 3 },
    { cardNumber: "ST01-010", count: 4 },
    { cardNumber: "GD01-088", count: 4 },
    { cardNumber: "GD01-118", count: 3 },
    { cardNumber: "ST01-014", count: 3 },
    { cardNumber: "GD04-101", count: 3 },
    { cardNumber: "GD01-100", count: 3 },
    { cardNumber: "ST04-012", count: 3 },
    { cardNumber: "GD02-100", count: 1 },
    { cardNumber: "GD04-130", count: 4 },
  ],
  resource: { cardNumber: "R-001", count: 10 },
};

export const topdecks09: DeckList = {
  name: "Top Decks 09",
  description: "Tournament fixture 09 (tcgtopdecks-hq export).",
  cards: [
    { cardNumber: "GD03-083", count: 4 },
    { cardNumber: "GD01-008", count: 4 },
    { cardNumber: "ST05-009", count: 4 },
    { cardNumber: "GD03-081", count: 4 },
    { cardNumber: "GD01-018", count: 2 },
    { cardNumber: "GD03-082", count: 3 },
    { cardNumber: "GD04-015", count: 4 },
    { cardNumber: "EB01-056", count: 2 },
    { cardNumber: "ST01-001", count: 4 },
    { cardNumber: "GD03-069", count: 4 },
    { cardNumber: "ST01-010", count: 4 },
    { cardNumber: "GD03-098", count: 4 },
    { cardNumber: "GD01-100", count: 3 },
    { cardNumber: "GD04-117", count: 2 },
    { cardNumber: "ST02-016", count: 2 },
  ],
  resource: { cardNumber: "R-001", count: 10 },
};

export const topdecks10: DeckList = {
  name: "Top Decks 10",
  description: "Tournament fixture 10 (tcgtopdecks-hq export).",
  cards: [
    { cardNumber: "ST05-004", count: 4 },
    { cardNumber: "ST03-008", count: 4 },
    { cardNumber: "ST05-006", count: 4 },
    { cardNumber: "GD02-054", count: 4 },
    { cardNumber: "GD02-058", count: 2 },
    { cardNumber: "GD03-056", count: 4 },
    { cardNumber: "GD02-055", count: 4 },
    { cardNumber: "ST02-001", count: 4 },
    { cardNumber: "GD03-050", count: 3 },
    { cardNumber: "GD01-024", count: 3 },
    { cardNumber: "ST05-010", count: 4 },
    { cardNumber: "ST02-010", count: 4 },
    { cardNumber: "ST09-009", count: 2 },
    { cardNumber: "ST05-015", count: 4 },
  ],
  resource: { cardNumber: "R-001", count: 10 },
};
