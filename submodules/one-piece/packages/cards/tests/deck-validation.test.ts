import { describe, expect, it } from "vite-plus/test";
import { getAllCards, getCard } from "../src/index.ts";
import { validateDeckForFormat, type DeckValidationEntry } from "../src/deck-validation.ts";

const MAIN_DECK_CARD_TYPES = new Set(["character", "event", "stage"]);

// Fills a rule-legal 50-card main deck for the given leader from the catalog:
// up to 4 copies per card, only cards sharing a color with the leader. The
// required entries are included verbatim so a test can exercise a specific
// card; the deck is only legal overall if they are.
function buildDeck(
  leaderId: string,
  required: ReadonlyArray<DeckValidationEntry> = [],
): DeckValidationEntry[] {
  const leader = getCard(leaderId);
  const mainDeck = required.map((entry) => ({ ...entry }));
  const usedCanonicalIds = new Set(mainDeck.map((entry) => getCard(entry.cardId).canonicalId));
  let total = mainDeck.reduce((sum, entry) => sum + entry.quantity, 0);
  for (const card of getAllCards()) {
    if (total >= 50) break;
    if (!MAIN_DECK_CARD_TYPES.has(card.cardType)) continue;
    if (usedCanonicalIds.has(card.canonicalId)) continue;
    if (!card.color.some((color) => leader.color.includes(color))) continue;
    const quantity = Math.min(4, 50 - total);
    mainDeck.push({ cardId: card.id, quantity });
    usedCanonicalIds.add(card.canonicalId);
    total += quantity;
  }
  if (total !== 50) throw new Error(`Could not build a 50-card deck for ${leaderId}.`);
  return [{ cardId: leaderId, quantity: 1 }, ...mainDeck];
}

function ruleOf(result: ReturnType<typeof validateDeckForFormat>, kind: string) {
  const rule = result.rules.find((candidate) => candidate.kind === kind);
  if (!rule) throw new Error(`Expected a ${kind} rule in the validation result.`);
  return rule;
}

describe("One Piece deck copy limits", () => {
  it("rejects more than four copies of an ordinary card", () => {
    const result = validateDeckForFormat(
      "standard",
      buildDeck("OP01-001", [{ cardId: "OP01-004", quantity: 5 }]),
    );

    expect(ruleOf(result, "copy-limit")).toMatchObject({ passed: false });
    expect(result.valid).toBe(false);
  });

  it("allows any number when the card definition has the unlimited-copies rule", () => {
    // OP01-075 Pacifista is blue; OP01-060 is a mono-blue Leader, so only the
    // copy limit is exercised.
    const result = validateDeckForFormat(
      "standard",
      buildDeck("OP01-060", [{ cardId: "OP01-075", quantity: 20 }]),
    );

    expect(ruleOf(result, "copy-limit")).toMatchObject({ passed: true });
    expect(result.valid).toBe(true);
  });

  it("still applies color legality to an unlimited-copies card", () => {
    // The unlimited-copies text replaces only the 4-copy limit (5-1-2-3), not
    // color legality (5-1-2-2): blue Pacifista under a mono-red Leader.
    const result = validateDeckForFormat("standard", [
      { cardId: "OP01-001", quantity: 1 },
      { cardId: "OP01-075", quantity: 50 },
    ]);

    expect(ruleOf(result, "copy-limit")).toMatchObject({ passed: true });
    expect(ruleOf(result, "color-legality")).toMatchObject({ passed: false });
    expect(result.valid).toBe(false);
  });
});

const st01Leader = { cardId: "ST01-001", quantity: 1 };
// The ST01 main deck is ST01-002..ST01-010 x4 plus ST01-011..ST01-017 x2 (50
// red cards), matching packages/engine/src/starter-decks.ts.
const st01MainDeck = [
  ...Array.from({ length: 9 }, (_, index) => ({
    cardId: `ST01-${String(index + 2).padStart(3, "0")}`,
    quantity: 4,
  })),
  ...Array.from({ length: 7 }, (_, index) => ({
    cardId: `ST01-${String(index + 11).padStart(3, "0")}`,
    quantity: 2,
  })),
];
const fiftyCardDeck = [st01Leader, ...st01MainDeck];

describe("One Piece deck construction rules", () => {
  it("accepts exactly 50 main-deck cards and rejects any other size", () => {
    const full = validateDeckForFormat("standard", fiftyCardDeck);
    expect(ruleOf(full, "deck-size")).toMatchObject({ passed: true });
    expect(full.valid).toBe(true);

    const fortyNine = validateDeckForFormat("standard", [
      st01Leader,
      ...st01MainDeck.slice(0, -1),
      { cardId: "ST01-017", quantity: 1 },
    ]);
    expect(ruleOf(fortyNine, "deck-size")).toMatchObject({ passed: false });
    expect(fortyNine.valid).toBe(false);

    const undersized = validateDeckForFormat("standard", [
      st01Leader,
      { cardId: "ST01-002", quantity: 4 },
    ]);
    expect(ruleOf(undersized, "deck-size")).toMatchObject({ passed: false });
    expect(undersized.valid).toBe(false);
  });

  it("requires exactly 10 DON!! cards once a DON!! deck is submitted", () => {
    const withTenDon = validateDeckForFormat("standard", [
      ...fiftyCardDeck,
      { cardId: "DON-001", quantity: 10 },
    ]);
    expect(ruleOf(withTenDon, "don-deck")).toMatchObject({ passed: true });
    expect(withTenDon.valid).toBe(true);

    const withNineDon = validateDeckForFormat("standard", [
      ...fiftyCardDeck,
      { cardId: "DON-001", quantity: 9 },
    ]);
    expect(ruleOf(withNineDon, "don-deck")).toMatchObject({ passed: false });
    expect(withNineDon.valid).toBe(false);
  });

  it("rejects a card whose color is not included on the leader", () => {
    // 49 red ST01 cards + 1 blue Pacifista: exactly 50 cards, so color
    // legality is the only failing rule.
    const result = validateDeckForFormat("standard", [
      st01Leader,
      ...st01MainDeck.slice(0, -1),
      { cardId: "ST01-017", quantity: 1 },
      { cardId: "OP01-075", quantity: 1 },
    ]);
    expect(ruleOf(result, "color-legality")).toMatchObject({ passed: false });
    expect(result.valid).toBe(false);
  });

  it("rejects a leader entry with quantity greater than 1", () => {
    const result = validateDeckForFormat("standard", [
      { cardId: "ST01-001", quantity: 2 },
      ...st01MainDeck,
    ]);
    expect(ruleOf(result, "leader-count")).toMatchObject({ passed: false });
    expect(result.valid).toBe(false);
  });

  it("rejects unknown card ids", () => {
    const result = validateDeckForFormat("standard", [
      st01Leader,
      ...Array.from({ length: 50 }, (_, index) => ({
        cardId: `NOT-A-CARD-${index}`,
        quantity: 1,
      })),
    ]);
    expect(ruleOf(result, "card-pool")).toMatchObject({ passed: false });
    expect(result.valid).toBe(false);
  });

  it("accepts a leader submitted with a printing id", () => {
    const result = validateDeckForFormat("standard", [
      { cardId: "OP01-001_p1", quantity: 1 },
      ...st01MainDeck,
    ]);
    expect(ruleOf(result, "leader-count")).toMatchObject({ passed: true });
    expect(ruleOf(result, "color-legality")).toMatchObject({ passed: true });
    expect(result.valid).toBe(true);
  });
});
