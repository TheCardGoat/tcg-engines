import type { DeckList } from "@tcg/gundam-engine";

function deck(name: string, source: string): DeckList {
  return {
    name,
    description: `Tournament fixture ${name.slice(-2)} (tcgtopdecks-hq export).`,
    cards: source.split(",").map((entry) => {
      const [cardNumber, count] = entry.split("x");
      return { cardNumber: cardNumber!, count: Number(count) };
    }),
    resource: { cardNumber: "R-001", count: 10 },
  };
}

// The source export had 49 cards; normalized to a legal 50-card fixture.
export const topdecks01 = deck(
  "Top Decks 01",
  "ST01-005x4,GD01-008x4,ST05-004x3,GD02-013x4,GD01-018x4,ST05-006x2,GD02-054x4,ST01-001x4,GD01-020x4,GD03-056x4,ST05-010x4,ST01-010x4,GD01-100x1,ST02-016x2,GD04-122x2",
);
export const topdecks02 = deck(
  "Top Decks 02",
  "GD01-086x3,GD02-079x2,GD04-077x3,GD01-051x2,GD01-044x4,GD04-068x4,ST03-001x2,GD01-066x2,GD04-033x4,ST04-011x2,GD01-093x4,ST03-010x4,ST03-013x4,GD01-118x4,ST04-012x2,ST03-015x4",
);
export const topdecks03 = deck(
  "Top Decks 03",
  "GD04-016x4,GD01-086x2,GD04-015x2,GD04-077x3,ST01-001x3,GD01-006x2,GD04-003x4,GD04-068x2,GD04-006x4,GD04-065x4,ST01-010x4,GD04-081x4,GD04-098x3,GD01-118x3,GD01-100x2,GD04-121x4",
);
export const topdecks04 = deck(
  "Top Decks 04",
  "GD01-086x4,GD02-079x2,GD04-077x4,GD01-073x3,ST04-001x4,GD04-068x3,ST02-001x4,GD01-066x2,GD01-024x4,GD03-018x1,ST04-010x4,ST02-010x4,GD01-118x4,GD01-120x1,GD04-117x2,GD01-126x2,GD03-125x2",
);
export const topdecks05 = deck(
  "Top Decks 05",
  "GD04-016x4,GD01-086x4,GD04-011x4,GD04-077x4,ST01-001x3,GD04-003x4,GD04-006x4,GD01-066x4,ST01-010x4,GD04-081x4,GD01-118x4,GD01-100x3,GD04-121x4",
);
export const topdecks06 = deck(
  "Top Decks 06",
  "GD04-016x4,GD01-086x4,GD04-011x3,ST01-001x3,GD01-006x2,GD04-003x4,GD04-068x2,GD04-006x4,GD04-065x4,ST01-010x4,GD04-081x4,GD04-098x4,GD01-118x4,GD04-121x4",
);
export const topdecks07 = deck(
  "Top Decks 07",
  "GD01-086x4,GD02-079x3,GD04-077x2,EB01-054x3,ST01-001x4,EB01-048x2,ST04-001x4,GD03-003x3,GD03-002x4,ST01-010x4,ST04-010x2,GD03-084x4,GD01-118x4,GD01-100x3,GD04-130x4",
);
export const topdecks08 = deck(
  "Top Decks 08",
  "GD01-086x3,GD02-079x1,GD04-077x3,ST01-001x4,GD01-005x2,GD04-068x2,GD04-066x4,GD03-010x3,ST01-010x4,GD01-088x4,GD01-118x3,ST01-014x3,GD04-101x3,GD01-100x3,ST04-012x3,GD02-100x1,GD04-130x4",
);
export const topdecks09 = deck(
  "Top Decks 09",
  "GD03-083x4,GD01-008x4,ST05-009x4,GD03-081x4,GD01-018x2,GD03-082x3,GD04-015x4,EB01-056x2,ST01-001x4,GD03-069x4,ST01-010x4,GD03-098x4,GD01-100x3,GD04-117x2,ST02-016x2",
);
export const topdecks10 = deck(
  "Top Decks 10",
  "ST05-004x4,ST03-008x4,ST05-006x4,GD02-054x4,GD02-058x2,GD03-056x4,GD02-055x4,ST02-001x4,GD03-050x3,GD01-024x3,ST05-010x4,ST02-010x4,ST09-009x2,ST05-015x4",
);
