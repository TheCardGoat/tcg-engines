import { expect, test, describe } from "vite-plus/test";
import {
  normalize,
  normalizeAll,
  NormalizationError,
  RecordCardCatalog,
  parseKeywords,
} from "../src/index.ts";
import type { RawOPCard } from "../src/index.ts";

const baseRaw: RawOPCard = {
  card_name: "Roronoa Zoro",
  set_name: "Romance Dawn",
  card_text: "[Rush] (This card can attack on the turn it is played.)",
  set_id: "OP-01",
  rarity: "SR",
  card_set_id: "OP01-001",
  card_color: "Red",
  card_type: "Character",
  life: null,
  card_cost: "3",
  card_power: "5000",
  sub_types: "Supernovas/Straw Hat Crew",
  counter_amount: 2000,
  attribute: "Slash",
  card_image_id: "OP01-001",
  card_image: "https://example.com/OP01-001.png",
  inventory_price: 10,
  market_price: 9,
};

describe("normalize", () => {
  test("normalizes a character card", () => {
    const card = normalize(baseRaw);
    expect(card.cardType).toBe("character");
    if (card.cardType !== "character") return;
    expect(card.id).toBe("OP01-001");
    expect(card.i18n.en.name).toBe("Roronoa Zoro");
    expect(card.color).toEqual(["red"]);
    expect(card.rarity).toBe("SR");
    expect(card.setId).toBe("OP01");
    expect(card.cost).toBe(3);
    expect(card.power).toBe(5000);
    expect(card.counter).toBe(2000);
    expect(card.attribute).toBe("slash");
    expect(card.traits).toEqual(["Supernovas", "Straw Hat Crew"]);
    expect(card.i18n.en.imageUrl).toBe("https://example.com/OP01-001.png");
  });

  test("normalizes a leader card", () => {
    const raw: RawOPCard = {
      ...baseRaw,
      card_set_id: "OP01-001",
      card_type: "Leader",
      card_cost: null,
      card_power: "5000",
      life: "5",
      counter_amount: 0,
    };
    const card = normalize(raw);
    expect(card.cardType).toBe("leader");
    if (card.cardType !== "leader") return;
    expect(card.power).toBe(5000);
    expect(card.life).toBe(5);
    expect(card.counter).toBeUndefined();
  });

  test("normalizes an event card", () => {
    const raw: RawOPCard = {
      ...baseRaw,
      card_set_id: "OP01-050",
      card_type: "Event",
      card_cost: "2",
      card_power: null,
      counter_amount: 0,
      attribute: null,
      card_text: "Draw 2 cards.\n[Trigger] Draw 1 card.",
    };
    const card = normalize(raw);
    expect(card.cardType).toBe("event");
    if (card.cardType !== "event") return;
    expect(card.cost).toBe(2);
    expect(card.trigger).toBe("Draw 1 card.");
    expect(card.i18n.en.effect).toBe("Draw 2 cards.");
  });

  test("does not treat mid-sentence [Trigger] as trigger clause", () => {
    // S-Snake: "[Trigger]" appears mid-sentence as a card property descriptor
    const raw: RawOPCard = {
      ...baseRaw,
      card_set_id: "EB03-059",
      card_type: "Character",
      card_cost: "4",
      card_power: "7000",
      counter_amount: 1000,
      attribute: null,
      card_text:
        "[On Play] Add up to 1 Character card with a [Trigger] from your hand to the top of your Life cards face-up.\n[Trigger] Your opponent cannot attack this turn.",
    };
    const card = normalize(raw);
    if (card.cardType !== "character") return;
    expect(card.i18n.en.effect).toBe(
      "[On Play] Add up to 1 Character card with a [Trigger] from your hand to the top of your Life cards face-up.",
    );
    expect(card.trigger).toBe("Your opponent cannot attack this turn.");
  });

  test("captures full trigger text containing bracketed card names", () => {
    // Lilith: trigger text contains [Vegapunk] card reference in brackets
    const raw: RawOPCard = {
      ...baseRaw,
      card_set_id: "EB03-058",
      card_type: "Character",
      card_cost: "4",
      card_power: "6000",
      counter_amount: 1000,
      attribute: null,
      card_text:
        "[Your Turn] [On Play] If you have 2 or less Life cards, draw 1 card.\n[Trigger] If your Leader is [Vegapunk], play this card.",
    };
    const card = normalize(raw);
    if (card.cardType !== "character") return;
    expect(card.trigger).toBe("If your Leader is [Vegapunk], play this card.");
    expect(card.i18n.en.effect).toBe(
      "[Your Turn] [On Play] If you have 2 or less Life cards, draw 1 card.",
    );
  });

  test("normalizes a DON!! card", () => {
    const raw: RawOPCard = {
      ...baseRaw,
      card_set_id: "OP01-DON",
      card_type: "DON!!",
      card_cost: null,
      card_power: null,
      life: null,
      counter_amount: 0,
      attribute: null,
      rarity: "DON",
    };
    const card = normalize(raw);
    expect(card.cardType).toBe("don");
  });

  test("handles multi-color cards", () => {
    const raw: RawOPCard = { ...baseRaw, card_color: "Red/Blue" };
    const card = normalize(raw);
    expect(card.color).toEqual(["red", "blue"]);
  });

  test("throws NormalizationError for unknown card type", () => {
    const raw: RawOPCard = { ...baseRaw, card_type: "Unknown" };
    expect(() => normalize(raw)).toThrowError(NormalizationError);
  });

  test("throws NormalizationError for unknown color", () => {
    const raw: RawOPCard = { ...baseRaw, card_color: "Orange" };
    expect(() => normalize(raw)).toThrowError(NormalizationError);
  });

  test("throws NormalizationError when leader missing power", () => {
    const raw: RawOPCard = {
      ...baseRaw,
      card_type: "Leader",
      card_power: null,
      life: "5",
    };
    expect(() => normalize(raw)).toThrowError(NormalizationError);
  });
});

describe("parseKeywords", () => {
  test("extracts [Rush] from simple text", () => {
    expect(parseKeywords("[Rush] (This card can attack on the turn it is played.)")).toEqual([
      "rush",
    ]);
  });

  test("extracts [Blocker] at start of a line", () => {
    expect(
      parseKeywords(
        "[On Play] Do something.\n[Blocker] (After your opponent declares an attack, you may rest this card.)",
      ),
    ).toEqual(["blocker"]);
  });

  test("extracts multiple keywords", () => {
    expect(parseKeywords("[Rush] [Double Attack] (This card deals 2 damage.)")).toEqual([
      "rush",
      "doubleAttack",
    ]);
  });

  test("does not extract mid-sentence gains [Rush]", () => {
    expect(parseKeywords("This Character gains [Rush] during this turn.")).toEqual([]);
  });

  test("does not extract mid-sentence a [Blocker] Character", () => {
    expect(
      parseKeywords(
        "Your opponent cannot activate a [Blocker] Character that has 2000 or less power.",
      ),
    ).toEqual([]);
  });

  test("returns empty array when no keywords found", () => {
    expect(parseKeywords("[On Play] Draw 2 cards.")).toEqual([]);
  });

  test("extracts [Banish] alongside other effects", () => {
    expect(
      parseKeywords(
        "[Banish] (When this card deals damage, the target card is trashed without activating its Trigger.)\n[DON!! x1] Give blue Events in your hand -1 cost.",
      ),
    ).toEqual(["banish"]);
  });

  test("extracts [Rush: Character]", () => {
    expect(parseKeywords("[Rush: Character] [On Play] Do something.")).toEqual(["rushCharacter"]);
  });

  test("does not duplicate keywords", () => {
    expect(parseKeywords("[Rush]\n[Rush]")).toEqual(["rush"]);
  });
});

describe("keyword parsing in normalize", () => {
  test("baseRaw with [Rush] gets effects.keywords", () => {
    const card = normalize(baseRaw);
    expect(card.effects).toEqual({ keywords: ["rush"] });
  });

  test("card without keywords has no effects", () => {
    const raw: RawOPCard = {
      ...baseRaw,
      card_text: "[On Play] Draw 2 cards.",
    };
    const card = normalize(raw);
    expect(card.effects).toBeUndefined();
  });

  test("card with empty text has no effects", () => {
    const raw: RawOPCard = {
      ...baseRaw,
      card_text: "",
    };
    const card = normalize(raw);
    expect(card.effects).toBeUndefined();
  });
});

describe("normalizeAll", () => {
  test("normalizes an array of raw cards", () => {
    const cards = normalizeAll([baseRaw]);
    expect(cards).toHaveLength(1);
    expect(cards[0]?.cardType).toBe("character");
  });
});

describe("RecordCardCatalog", () => {
  const card = normalize(baseRaw);
  const catalog = new RecordCardCatalog("OP01", { [card.id]: card });

  test("get returns the card", () => {
    expect(catalog.get("OP01-001")).toEqual(card);
  });

  test("has returns true for existing id", () => {
    expect(catalog.has("OP01-001")).toBe(true);
  });

  test("has returns false for missing id", () => {
    expect(catalog.has("OP01-999")).toBe(false);
  });

  test("all returns all cards", () => {
    expect(catalog.all()).toHaveLength(1);
  });

  test("ref is correct", () => {
    expect(catalog.ref).toBe("OP01");
  });
});
