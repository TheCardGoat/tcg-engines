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
  it("rejects fractional quantities even when they total exactly 50", () => {
    const result = validateDeckForFormat(
      "standard",
      fiftyCardDeck.map((entry, index) => ({
        ...entry,
        quantity: entry.quantity + (index === 1 ? -0.5 : index === 10 ? 0.5 : 0),
      })),
    );
    expect(result.valid).toBe(false);
  });

  it("rejects negative quantities that cancel extra copies", () => {
    const result = validateDeckForFormat("standard", [
      ...fiftyCardDeck,
      { cardId: "ST01-002", quantity: 1 },
      { cardId: "ST01-002", quantity: -1 },
    ]);
    expect(result.valid).toBe(false);
  });

  it("rejects a zero-quantity Leader used to bypass the actual Leader's colors", () => {
    const result = validateDeckForFormat("standard", [
      { cardId: "ST01-001", quantity: 0 },
      { cardId: "OP01-060", quantity: 1 },
      ...st01MainDeck,
    ]);
    expect(result.valid).toBe(false);
  });

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

describe("Leader deck construction overrides", () => {
  it("rejects Rayleigh cost-five cards even when color, deck size and copies are legal", () => {
    const deck = buildDeck("OP12-001", [{ cardId: "ST01-013", quantity: 1 }]);
    expect(ruleOf(validateDeckForFormat("standard", deck), "leader-restrictions").passed).toBe(
      false,
    );
  });
  it("permits Rayleigh cost-four cards in a complete legal deck", () => {
    const entries: DeckValidationEntry[] = [];
    for (const card of getAllCards()) {
      if (entries.reduce((n, e) => n + e.quantity, 0) >= 50) break;
      if (
        !("cost" in card) ||
        card.cost >= 5 ||
        !card.color.includes("red") ||
        !MAIN_DECK_CARD_TYPES.has(card.cardType)
      )
        continue;
      const remaining = 50 - entries.reduce((n, e) => n + e.quantity, 0);
      entries.push({ cardId: card.id, quantity: Math.min(4, remaining) });
    }
    expect(
      validateDeckForFormat("standard", [{ cardId: "OP12-001", quantity: 1 }, ...entries]).valid,
    ).toBe(true);
  });
  it("honors Enel's six-card DON deck while rejecting ten", () => {
    const don = getAllCards().find((c) => c.cardType === "don");
    if (!don) throw Error("DON catalog");
    const deck = buildDeck("OP15-058");
    expect(
      validateDeckForFormat("standard", [...deck, { cardId: don.id, quantity: 6 }]).valid,
    ).toBe(true);
    expect(
      ruleOf(
        validateDeckForFormat("standard", [...deck, { cardId: don.id, quantity: 10 }]),
        "don-deck",
      ).passed,
    ).toBe(false);
  });
  it("uses exact negated traits for restricted Leaders (future P117 metadata fixture)", () => {
    const leader = getCard("OP01-060"),
      old = leader.effects;
    try {
      leader.effects = {
        ...old,
        deckBuildingRules: [
          {
            rule: "cannotInclude",
            filters: [{ filter: "trait", value: "East Blue", match: "exact", negate: true }],
          },
        ],
      };
      const valid = validateDeckForFormat("standard", [
        { cardId: leader.id, quantity: 1 },
        { cardId: "OP03-051", quantity: 4 },
      ]);
      expect(ruleOf(valid, "leader-restrictions").passed).toBe(true);
      // A synthetic longer type must not match the exact East Blue restriction.
      const card = getCard("OP03-051"),
        oldTraits = card.traits;
      try {
        card.traits = ["East Blue Pirates"];
        expect(
          ruleOf(
            validateDeckForFormat("standard", [
              { cardId: leader.id, quantity: 1 },
              { cardId: card.id, quantity: 4 },
            ]),
            "leader-restrictions",
          ).passed,
        ).toBe(false);
      } finally {
        card.traits = oldTraits;
      }

      expect(
        ruleOf(
          validateDeckForFormat("standard", [
            { cardId: leader.id, quantity: 1 },
            { cardId: "OP03-060", quantity: 4 },
          ]),
          "leader-restrictions",
        ).passed,
      ).toBe(false);
    } finally {
      leader.effects = old;
    }
  });
});

describe("One Piece sealed construction and designated-event eligibility", () => {
  const sealedDeck: DeckValidationEntry[] = [
    { cardId: "ST01-001", quantity: 1 },
    { cardId: "OP01-075", quantity: 20 },
    { cardId: "EB01-005", quantity: 20 },
    { cardId: "DON-001", quantity: 10 },
  ];

  it("permits any color and more than four copies in a forty-card main deck", () => {
    const result = validateDeckForFormat("sealed", sealedDeck);
    expect(result.valid).toBe(true);
    expect(result.label).toBe("Sealed");
    expect(ruleOf(result, "color-legality").passed).toBe(true);
    expect(ruleOf(result, "copy-limit").passed).toBe(true);
    expect(ruleOf(result, "deck-size").message).toBe("Deck has exactly 40 main-deck cards");
    const standard = validateDeckForFormat("standard", sealedDeck);
    expect(standard.valid).toBe(false);
    expect(ruleOf(standard, "color-legality").passed).toBe(false);
    expect(ruleOf(standard, "copy-limit").passed).toBe(false);
  });

  it.each([39, 41])("rejects a sealed main deck of %i cards", (count) => {
    const result = validateDeckForFormat("sealed", [
      { cardId: "ST01-001", quantity: 1 },
      { cardId: "EB01-005", quantity: count },
      { cardId: "DON-001", quantity: 10 },
    ]);
    expect(result.valid).toBe(false);
    expect(ruleOf(result, "deck-size").passed).toBe(false);
  });

  it.each([0, 9, 11])("requires the sealed DON deck when %i are submitted", (count) => {
    const deck = sealedDeck.filter((entry) => entry.cardId !== "DON-001");
    if (count) deck.push({ cardId: "DON-001", quantity: count });
    const result = validateDeckForFormat("sealed", deck);
    expect(result.valid).toBe(false);
    expect(ruleOf(result, "don-deck").passed).toBe(false);
  });

  it("retains printed Leader restrictions despite relaxed color and copy rules", () => {
    const base = [
      { cardId: "OP12-001", quantity: 1 },
      { cardId: "DON-001", quantity: 10 },
    ];
    expect(
      validateDeckForFormat("sealed", [...base, { cardId: "EB01-025", quantity: 40 }]).valid,
    ).toBe(true);
    const prohibited = validateDeckForFormat("sealed", [
      ...base,
      { cardId: "EB01-018", quantity: 40 },
    ]);
    expect(prohibited.valid).toBe(false);
    expect(ruleOf(prohibited, "leader-restrictions").passed).toBe(false);
  });

  it("retains a printed Leader DON-deck override", () => {
    const base = [
      { cardId: "OP15-058", quantity: 1 },
      { cardId: "EB01-005", quantity: 40 },
    ];
    expect(
      validateDeckForFormat("sealed", [...base, { cardId: "DON-001", quantity: 6 }]).valid,
    ).toBe(true);
    expect(
      ruleOf(
        validateDeckForFormat("sealed", [...base, { cardId: "DON-001", quantity: 10 }]),
        "don-deck",
      ).passed,
    ).toBe(false);
  });

  it("requires an explicit designated-event opt-in in sealed", () => {
    const deck = sealedDeck.map((entry) =>
      entry.cardId === "ST01-001" ? { ...entry, cardId: "EVENT-LEADER-MONKEY-D-LUFFY" } : entry,
    );
    expect(validateDeckForFormat("sealed", deck).valid).toBe(false);
    expect(
      ruleOf(validateDeckForFormat("sealed", deck), "designated-event-eligibility").passed,
    ).toBe(false);
    expect(validateDeckForFormat("sealed", deck, { allowDesignatedEventCards: false }).valid).toBe(
      false,
    );
    expect(validateDeckForFormat("sealed", deck, { allowDesignatedEventCards: true }).valid).toBe(
      true,
    );
  });

  it("never admits the designated-event Leader to standard, even with opt-in", () => {
    const deck = buildDeck("EVENT-LEADER-MONKEY-D-LUFFY");
    for (const options of [{}, { allowDesignatedEventCards: true }]) {
      const result = validateDeckForFormat("standard", deck, options);
      expect(result.valid).toBe(false);
      expect(ruleOf(result, "designated-event-eligibility").passed).toBe(false);
      expect(ruleOf(result, "deck-size").passed).toBe(true);
    }
  });

  it("still rejects unknown formats even with event eligibility", () => {
    expect(() =>
      validateDeckForFormat("event", sealedDeck, { allowDesignatedEventCards: true }),
    ).toThrow("Unknown One Piece format: event");
  });
});
