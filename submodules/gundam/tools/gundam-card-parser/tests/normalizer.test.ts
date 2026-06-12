import { describe, expect, test } from "vite-plus/test";
import {
  NormalizationError,
  normalize,
  normalizeBase,
  normalizeCommand,
  normalizePilot,
  normalizeResource,
  normalizeUnit,
} from "../src/normalizer.ts";
import type { RawGundamCard } from "../src/types/scraper.ts";

// ── Factory ────────────────────────────────────────────────────────────────────

function makeRaw(overrides: Partial<RawGundamCard> = {}): RawGundamCard {
  return {
    id: "GD01-001",
    code: "GD01-001",
    name: "Test Unit",
    rarity: "C",
    cardType: "unit",
    level: "1",
    cost: 2,
    color: "Blue",
    ap: 3,
    hp: 4,
    effect: null,
    zone: null,
    trait: null,
    link: null,
    images: { small: null, large: null },
    sourceTitle: null,
    getIt: null,
    set: { id: "GD01", name: "Test Set" },
    ...overrides,
  };
}

// ── normalizeUnit ──────────────────────────────────────────────────────────────

describe("normalizeUnit", () => {
  test("produces a UnitCard with all basic fields", () => {
    const card = normalizeUnit(makeRaw({ ap: 3, hp: 5, color: "Red", rarity: "R" }));
    expect(card).toMatchObject({
      cardNumber: "GD01-001",
      name: "Test Unit",
      type: "unit",
      ap: 3,
      hp: 5,
      color: "red",
      level: 1,
      cost: 2,
      rarity: "rare",
      keywordEffects: [],
    });
  });

  test("parses official LR rarity as legendRare", () => {
    const card = normalizeUnit(makeRaw({ rarity: "LR" }));
    expect(card.rarity).toBe("legendRare");
  });

  test("parses plus rarity as its base rarity", () => {
    const card = normalizeUnit(makeRaw({ rarity: "LR +" }));
    expect(card.rarity).toBe("legendRare");
  });

  test("parses double-plus rarity as its base rarity", () => {
    const card = normalizeUnit(makeRaw({ rarity: "C ++" }));
    expect(card.rarity).toBe("common");
  });

  test("parses official promo rarity", () => {
    const card = normalizeUnit(makeRaw({ rarity: "P" }));
    expect(card.rarity).toBe("promo");
  });

  test("uses code for cardNumber when code is set", () => {
    const card = normalizeUnit(makeRaw({ id: "raw-id", code: "GD01-042" }));
    expect(card.cardNumber).toBe("GD01-042");
  });

  test("falls back to id when code is empty string", () => {
    const card = normalizeUnit(makeRaw({ id: "raw-id", code: "" }));
    expect(card.cardNumber).toBe("raw-id");
  });

  test("normalizes catalog metadata from scraped fields", () => {
    const card = normalizeUnit(
      makeRaw({
        id: "GD01_042",
        code: "GD01-042",
        name: "Gundam Aerial",
        rarity: "R+",
        effect: "Deploy effect.",
        images: {
          small: "https://example.test/cards/GD01-042-small.webp",
          large: "https://example.test/cards/GD01-042.webp",
        },
        getIt: "Included in Booster Packs [GD01]",
        set: {
          id: "GD01",
          name: "Newtype Rising",
          packageId: "boosters",
        },
      }),
    );

    expect(card).toMatchObject({
      id: "GD01-042",
      externalId: "gundam:gd01-042",
      slug: "gundam-aerial-gd01-042",
      displayName: "Gundam Aerial",
      rulesText: "Deploy effect.",
      set: {
        code: "GD01",
        name: "Newtype Rising",
        packageId: "boosters",
      },
      printNumber: "GD01-042",
      selectedPrintingId: "GD01-042",
      imageUrl: "https://example.test/cards/GD01-042.webp",
      sourceImageUrl: "https://example.test/cards/GD01-042.webp",
      legality: "legal",
    });
    expect(card.printings).toEqual([
      {
        id: "GD01-042",
        collectorNumber: "GD01-042",
        cardNumber: "GD01-042",
        set: {
          code: "GD01",
          name: "Newtype Rising",
          packageId: "boosters",
        },
        rarity: "rare",
        finish: "parallel",
        imageUrl: "https://example.test/cards/GD01-042.webp",
        sourceImageUrl: "https://example.test/cards/GD01-042.webp",
        productName: "Included in Booster Packs [GD01]",
      },
    ]);
  });

  test("prefers raw set name over distribution text for catalog set name", () => {
    const card = normalizeUnit(
      makeRaw({
        getIt: "Included in Booster Packs [GD01]",
        set: { id: "GD01", name: "Basic Cards" },
      }),
    );

    expect(card.set).toMatchObject({
      code: "GD01",
      name: "Basic Cards",
    });
    expect(card.printings?.[0]?.productName).toBe("Included in Booster Packs [GD01]");
  });

  test("treats p-suffix catalog ids as parallel printings even without plus rarity", () => {
    const card = normalizeUnit(makeRaw({ id: "ST09-001_p1", code: "ST09-001", rarity: "C" }));

    expect(card.id).toBe("ST09-001-p1");
    expect(card.selectedPrintingId).toBe("ST09-001-p1");
    expect(card.printings?.[0]).toMatchObject({
      id: "ST09-001-p1",
      cardNumber: "ST09-001",
      rarity: "common",
      finish: "parallel",
    });
  });

  test("normalizes fullwidth digit ap and hp to numbers", () => {
    const card = normalizeUnit(makeRaw({ ap: "３", hp: "５" }));
    expect(card.ap).toBe(3);
    expect(card.hp).toBe(5);
  });

  test("treats null ap and hp as 0", () => {
    const card = normalizeUnit(makeRaw({ ap: null, hp: null }));
    expect(card.ap).toBe(0);
    expect(card.hp).toBe(0);
  });

  test("treats dash string ap and hp as 0", () => {
    const card = normalizeUnit(makeRaw({ ap: "-", hp: "-" }));
    expect(card.ap).toBe(0);
    expect(card.hp).toBe(0);
  });

  test("strips leading + from stat string", () => {
    const card = normalizeUnit(makeRaw({ ap: "+3", hp: "+5" }));
    expect(card.ap).toBe(3);
    expect(card.hp).toBe(5);
  });

  test("parses null level as 0", () => {
    const card = normalizeUnit(makeRaw({ level: null }));
    expect(card.level).toBe(0);
  });

  test("parses non-numeric level as 0", () => {
    const card = normalizeUnit(makeRaw({ level: "X" }));
    expect(card.level).toBe(0);
  });

  test("parses null cost as 0", () => {
    const card = normalizeUnit(makeRaw({ cost: null }));
    expect(card.cost).toBe(0);
  });

  test("parses traits from parenthesized text", () => {
    const card = normalizeUnit(makeRaw({ trait: "(Earth Federation)(Gundam)" }));
    expect(card.traits).toEqual(["earth federation", "gundam"]);
  });

  test("parses traits from slash-separated text", () => {
    const card = normalizeUnit(makeRaw({ trait: "Earth Federation/Gundam" }));
    expect(card.traits).toEqual(["Earth Federation", "Gundam"]);
  });

  test("returns empty traits for null trait", () => {
    const card = normalizeUnit(makeRaw({ trait: null }));
    expect(card.traits).toEqual([]);
  });

  test("returns empty traits for empty string trait", () => {
    const card = normalizeUnit(makeRaw({ trait: "" }));
    expect(card.traits).toEqual([]);
  });

  test("returns empty traits for dash trait", () => {
    const card = normalizeUnit(makeRaw({ trait: "-" }));
    expect(card.traits).toEqual([]);
  });

  test("includes linkCondition when link is set", () => {
    const card = normalizeUnit(makeRaw({ link: "Blue" }));
    expect(card.linkCondition).toBe("Blue");
  });

  test("omits linkCondition when link is null", () => {
    const card = normalizeUnit(makeRaw({ link: null }));
    expect(card).not.toHaveProperty("linkCondition");
  });

  test("omits linkCondition when link is dash", () => {
    const card = normalizeUnit(makeRaw({ link: "-" }));
    expect(card).not.toHaveProperty("linkCondition");
  });

  test("parses zone with spaces to camelCase Zone", () => {
    const card = normalizeUnit(makeRaw({ zone: "Battle Area" }));
    expect(card.zone).toBe("battleArea");
  });

  test("parses Shield Area zone", () => {
    const card = normalizeUnit(makeRaw({ zone: "Shield Area" }));
    expect(card.zone).toBe("shieldArea");
  });

  test("parses Resource Deck zone", () => {
    const card = normalizeUnit(makeRaw({ zone: "Resource Deck" }));
    expect(card.zone).toBe("resourceDeck");
  });

  test("omits zone when zone is null", () => {
    const card = normalizeUnit(makeRaw({ zone: null }));
    expect(card).not.toHaveProperty("zone");
  });

  test("includes effect string when present", () => {
    const card = normalizeUnit(makeRaw({ effect: "【Deploy】 Draw 1." }));
    expect(card.effect).toBe("【Deploy】 Draw 1.");
  });

  test("omits effect field when null", () => {
    const card = normalizeUnit(makeRaw({ effect: null }));
    expect(card).not.toHaveProperty("effect");
  });

  test("extracts Blocker keyword from a bare standalone segment", () => {
    const card = normalizeUnit(makeRaw({ effect: "<Blocker>\n【Deploy】 Draw 1." }));
    expect(card.keywordEffects).toEqual([{ keyword: "Blocker" }]);
  });

  test("extracts Repair 1 from a standalone segment with reminder text", () => {
    const card = normalizeUnit(
      makeRaw({
        effect:
          "<Repair 1> (At the end of your turn, this Unit recovers the specified number of HP.)\n【When Paired】 Draw 1.",
      }),
    );
    expect(card.keywordEffects).toEqual([{ keyword: "Repair", value: 1 }]);
  });

  test("extracts Breach with larger numeric value", () => {
    const card = normalizeUnit(makeRaw({ effect: "<Breach 3>\n【Deploy】 Draw 1." }));
    expect(card.keywordEffects).toEqual([{ keyword: "Breach", value: 3 }]);
  });

  test("extracts FirstStrike keyword from a standalone segment", () => {
    const card = normalizeUnit(makeRaw({ effect: "<First Strike>\n【Deploy】 Draw 1." }));
    expect(card.keywordEffects).toEqual([{ keyword: "FirstStrike" }]);
  });

  test("extracts HighManeuver from hyphenated form", () => {
    const card = normalizeUnit(makeRaw({ effect: "<High-Maneuver>\n【Deploy】 Draw 1." }));
    expect(card.keywordEffects).toEqual([{ keyword: "HighManeuver" }]);
  });

  test("extracts multiple distinct keywords from effect text", () => {
    const card = normalizeUnit(
      makeRaw({
        effect:
          "<Blocker> (reminder)\n<Repair 1> (reminder)\n<High-Maneuver> (reminder)\n【Deploy】 Draw 1.",
      }),
    );
    expect(card.keywordEffects).toEqual([
      { keyword: "Blocker" },
      { keyword: "Repair", value: 1 },
      { keyword: "HighManeuver" },
    ]);
  });

  test("deduplicates repeated printed keywords", () => {
    const card = normalizeUnit(makeRaw({ effect: "<Repair 1>\n<Repair 1>\n【Deploy】 Draw 1." }));
    expect(card.keywordEffects).toEqual([{ keyword: "Repair", value: 1 }]);
  });

  test("decodes HTML-encoded angle brackets", () => {
    const card = normalizeUnit(makeRaw({ effect: "&lt;Repair 1&gt; (reminder text)" }));
    expect(card.keywordEffects).toEqual([{ keyword: "Repair", value: 1 }]);
  });

  test("ignores unknown angle-bracket text", () => {
    const card = normalizeUnit(makeRaw({ effect: "<Unknown> <NotAKeyword 5>" }));
    expect(card.keywordEffects).toEqual([]);
  });

  // Regression tests: keywords that are only referenced or conditionally
  // granted must not be promoted into the card's intrinsic keywordEffects,
  // because the engine seeds derived-state keywords from this field. See
  // PR review on gd02/unit/074-gundam-aerial-rebuild.ts and related cards.

  test("ignores conditional/granted keyword inside 'While ...' clause", () => {
    const card = normalizeUnit(
      makeRaw({
        effect: "While you have another (Gjallarhorn) Unit in play, this Unit gets <Blocker>.",
      }),
    );
    expect(card.keywordEffects).toEqual([]);
  });

  test("ignores keyword referenced inside a condition clause", () => {
    const card = normalizeUnit(
      makeRaw({
        effect: "【During Pair】While this Unit has <Repair>, it gets AP+1.",
      }),
    );
    expect(card.keywordEffects).toEqual([]);
  });

  test("ignores keyword bestowed inside a timing block", () => {
    const card = normalizeUnit(
      makeRaw({ effect: "【Deploy】This Unit gains <Blocker> during this turn." }),
    );
    expect(card.keywordEffects).toEqual([]);
  });

  test("only extracts the printed keyword when an effect also grants another keyword", () => {
    const card = normalizeUnit(
      makeRaw({
        effect: "<High-Maneuver>\n【When Paired】This Unit gains <Blocker> during this turn.",
      }),
    );
    expect(card.keywordEffects).toEqual([{ keyword: "HighManeuver" }]);
  });

  test("preserves multiple printed keywords on their own lines", () => {
    const card = normalizeUnit(
      makeRaw({
        effect:
          "<Blocker> (Rest this Unit to change the attack target to it.)\n<First Strike> (Attack damage is dealt before opposing damage.)\n【Deploy】 Draw 1.",
      }),
    );
    expect(card.keywordEffects).toEqual([{ keyword: "Blocker" }, { keyword: "FirstStrike" }]);
  });

  test("returns empty keywordEffects when effect is null", () => {
    const card = normalizeUnit(makeRaw({ effect: null }));
    expect(card.keywordEffects).toEqual([]);
  });

  test("maps all rarity strings correctly", () => {
    const cases: Array<[string, string]> = [
      ["C", "common"],
      ["Common", "common"],
      ["U", "uncommon"],
      ["UC", "uncommon"],
      ["Uncommon", "uncommon"],
      ["R", "rare"],
      ["Rare", "rare"],
      ["SR", "superRare"],
      ["Super Rare", "superRare"],
      ["SuperRare", "superRare"],
      ["SCR", "secretRare"],
      ["SEC", "secretRare"],
      ["SecretRare", "secretRare"],
      ["Secret Rare", "secretRare"],
    ];
    for (const [raw, expected] of cases) {
      expect(normalizeUnit(makeRaw({ rarity: raw })).rarity).toBe(expected);
    }
  });

  test("maps all color strings correctly", () => {
    const cases: Array<[string, string]> = [
      ["Blue", "blue"],
      ["blue", "blue"],
      ["Green", "green"],
      ["green", "green"],
      ["Red", "red"],
      ["red", "red"],
      ["White", "white"],
      ["white", "white"],
      ["Purple", "purple"],
      ["purple", "purple"],
    ];
    for (const [raw, expected] of cases) {
      expect(normalizeUnit(makeRaw({ color: raw })).color).toBe(expected);
    }
  });

  test("returns undefined color for null", () => {
    expect(normalizeUnit(makeRaw({ color: null })).color).toBeUndefined();
  });

  test("returns undefined color for empty string", () => {
    expect(normalizeUnit(makeRaw({ color: "" })).color).toBeUndefined();
  });

  test("throws NormalizationError for unknown rarity", () => {
    expect(() => normalizeUnit(makeRaw({ rarity: "UNKNOWN" }))).toThrow(NormalizationError);
  });

  test("throws NormalizationError for missing rarity", () => {
    expect(() => normalizeUnit(makeRaw({ rarity: "" }))).toThrow(NormalizationError);
  });

  test("throws NormalizationError for unknown color", () => {
    expect(() => normalizeUnit(makeRaw({ color: "Pink" }))).toThrow(NormalizationError);
  });
});

// ── normalizePilot ─────────────────────────────────────────────────────────────

describe("normalizePilot", () => {
  const base = (): RawGundamCard => makeRaw({ cardType: "pilot" });

  test("produces PilotCard with apBonus and hpBonus", () => {
    const card = normalizePilot({ ...base(), ap: 2, hp: 1 });
    expect(card).toMatchObject({
      type: "pilot",
      apBonus: 2,
      hpBonus: 1,
    });
  });

  test("normalizes null ap/hp to 0", () => {
    const card = normalizePilot({ ...base(), ap: null, hp: null });
    expect(card.apBonus).toBe(0);
    expect(card.hpBonus).toBe(0);
  });

  test("normalizes fullwidth digits in ap/hp", () => {
    const card = normalizePilot({ ...base(), ap: "２", hp: "１" });
    expect(card.apBonus).toBe(2);
    expect(card.hpBonus).toBe(1);
  });

  test("does not include ap or hp keys", () => {
    const card = normalizePilot({ ...base(), ap: 2, hp: 1 });
    expect(card).not.toHaveProperty("ap");
    expect(card).not.toHaveProperty("hp");
  });

  test("includes effect and keywordEffects", () => {
    const card = normalizePilot({
      ...base(),
      effect: "<Support 1>\n【Burst】 Draw 1.",
    });
    expect(card.effect).toBe("<Support 1>\n【Burst】 Draw 1.");
    expect(card.keywordEffects).toEqual([{ keyword: "Support", value: 1 }]);
  });

  test("omits effect when null", () => {
    const card = normalizePilot({ ...base(), effect: null });
    expect(card).not.toHaveProperty("effect");
  });
});

// ── normalizeCommand ───────────────────────────────────────────────────────────

describe("normalizeCommand", () => {
  const base = (): RawGundamCard => makeRaw({ cardType: "command" });

  test("produces CommandCard without pilot fields by default", () => {
    const card = normalizeCommand({ ...base(), effect: "【Main】②：Draw 1." });
    expect(card).toMatchObject({
      type: "command",
    });
    expect(card).not.toHaveProperty("pilotName");
    expect(card).not.toHaveProperty("apBonus");
    expect(card).not.toHaveProperty("hpBonus");
  });

  test("maps 【Pilot】 keyword name and printed AP/HP bonuses", () => {
    const card = normalizeCommand({
      ...base(),
      ap: 1,
      hp: 0,
      effect: "【Main】Draw 1.\n【Pilot】[Char Aznable]",
    });
    expect(card.pilotName).toBe("Char Aznable");
    expect(card.apBonus).toBe(1);
    expect(card.hpBonus).toBe(0);
  });

  test("does not materialize burst as top-level CommandCard metadata", () => {
    const card = normalizeCommand({
      ...base(),
      effect: "【Burst】 Draw 2. 【Main】②：Deploy 1 Unit card from your hand.",
    });
    expect(card).not.toHaveProperty("pilotName");
  });

  test("handles null effect without throwing", () => {
    const card = normalizeCommand({ ...base(), effect: null });
    expect(card).not.toHaveProperty("pilotName");
  });

  test("omits effect field when null", () => {
    const card = normalizeCommand({ ...base(), effect: null });
    expect(card).not.toHaveProperty("effect");
  });

  test("does not include ap, hp fields", () => {
    const card = normalizeCommand(base());
    expect(card).not.toHaveProperty("ap");
    expect(card).not.toHaveProperty("hp");
  });
});

// ── normalizeBase ──────────────────────────────────────────────────────────────

describe("normalizeBase", () => {
  const base = (): RawGundamCard => makeRaw({ cardType: "base", color: null, ap: null });

  test("produces BaseCard with hp but no ap", () => {
    const card = normalizeBase({ ...base(), hp: 10 });
    expect(card).toMatchObject({ type: "base", hp: 10 });
    expect(card).not.toHaveProperty("ap");
  });

  test("normalizes fullwidth hp digit", () => {
    const card = normalizeBase({ ...base(), hp: "１０" });
    expect(card.hp).toBe(10);
  });

  test("treats null hp as 0", () => {
    const card = normalizeBase({ ...base(), hp: null });
    expect(card.hp).toBe(0);
  });

  test("includes traits", () => {
    const card = normalizeBase({ ...base(), trait: "(White Base)" });
    expect(card.traits).toEqual(["white base"]);
  });

  test("omits effect when null", () => {
    const card = normalizeBase({ ...base(), effect: null });
    expect(card).not.toHaveProperty("effect");
  });
});

// ── normalizeResource ──────────────────────────────────────────────────────────

describe("normalizeResource", () => {
  const base = (): RawGundamCard =>
    makeRaw({ cardType: "resource", color: null, ap: null, hp: null });

  test("produces ResourceCard with required fields", () => {
    const card = normalizeResource(base());
    expect(card).toMatchObject({
      type: "resource",
      cardNumber: "GD01-001",
      name: "Test Unit",
      level: 1,
      cost: 2,
      rarity: "common",
      keywordEffects: [],
    });
  });

  test("does not include color, ap, or hp fields", () => {
    const card = normalizeResource(base());
    expect(card).not.toHaveProperty("color");
    expect(card).not.toHaveProperty("ap");
    expect(card).not.toHaveProperty("hp");
  });

  test("includes traits", () => {
    const card = normalizeResource({ ...base(), trait: "EX Resource/Combat" });
    expect(card.traits).toEqual(["EX Resource", "Combat"]);
  });

  test("omits effect when null", () => {
    const card = normalizeResource({ ...base(), effect: null });
    expect(card).not.toHaveProperty("effect");
  });
});

// ── normalize (dispatcher) ─────────────────────────────────────────────────────

describe("normalize", () => {
  test("dispatches to Unit for all Unit casing variants", () => {
    for (const ct of ["Unit", "UNIT", "unit"]) {
      expect(normalize(makeRaw({ cardType: ct })).type).toBe("unit");
    }
  });

  test("dispatches to Pilot for all Pilot casing variants", () => {
    for (const ct of ["Pilot", "PILOT", "pilot"]) {
      expect(normalize(makeRaw({ cardType: ct })).type).toBe("pilot");
    }
  });

  test("dispatches to Command for all Command casing variants", () => {
    for (const ct of ["Command", "COMMAND", "command"]) {
      expect(normalize(makeRaw({ cardType: ct })).type).toBe("command");
    }
  });

  test("dispatches to Base for all Base casing variants", () => {
    for (const ct of ["Base", "BASE", "base"]) {
      expect(normalize(makeRaw({ cardType: ct, color: null })).type).toBe("base");
    }
  });

  test("dispatches to Resource for all Resource casing variants", () => {
    for (const ct of ["Resource", "RESOURCE", "resource"]) {
      expect(normalize(makeRaw({ cardType: ct, color: null })).type).toBe("resource");
    }
  });

  test("throws NormalizationError for unknown card type", () => {
    expect(() => normalize(makeRaw({ cardType: "Spell" }))).toThrow(NormalizationError);
  });
});

// ── NormalizationError ─────────────────────────────────────────────────────────

describe("NormalizationError", () => {
  test("has cardId and field properties", () => {
    const err = new NormalizationError("GD01-001", "rarity", "unknown rarity");
    expect(err.cardId).toBe("GD01-001");
    expect(err.field).toBe("rarity");
    expect(err.name).toBe("NormalizationError");
  });

  test("includes cardId and field in message", () => {
    const err = new NormalizationError("GD01-001", "rarity", "unknown rarity");
    expect(err.message).toContain("GD01-001");
    expect(err.message).toContain("rarity");
  });

  test("is an instance of Error", () => {
    const err = new NormalizationError("id", "field", "msg");
    expect(err).toBeInstanceOf(Error);
  });

  test("thrown error from normalize carries cardId from id field", () => {
    const raw = makeRaw({ id: "BAD-007", cardType: "Trap" });
    try {
      normalize(raw);
      // Should not reach here
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(NormalizationError);
      expect((e as NormalizationError).cardId).toBe("BAD-007");
      expect((e as NormalizationError).field).toBe("cardType");
    }
  });
});
