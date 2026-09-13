import { describe, expect, it } from "vitest";
import type { FabCardDefinitionInput } from "./cards.ts";
import { toFabCardDefinition } from "./cards.ts";
import {
  createDefaultFabPregameSelection,
  FAB_FORMAT_RULES,
  reconcileFabPregameSelection,
  validateFabPregameSelection,
  type FabPregameCardPool,
  type FabPregameFormat,
} from "./pregame.ts";
import { bolfarBearHands } from "../../cards/src/cards/heroes/bolfar-bear-hands.ts";
import { anothos } from "../../cards/src/cards/weapons/anothos.ts";
import { ironrotHelm } from "../../cards/src/cards/equipment/ironrot-helm.ts";
import { shiyanaDiamondGemini } from "../../cards/src/cards/heroes/shiyana-diamond-gemini.ts";
import { dromaiAshArtist } from "../../cards/src/cards/heroes/dromai-ash-artist.ts";
import { redHotRed } from "../../cards/src/cards/actions/red-hot.ts";
import { zaneBroadlyBeloved } from "../../cards/src/cards/heroes/zane-broadly-beloved.ts";
import { kassai } from "../../cards/src/cards/heroes/kassai.ts";
import { jubeelSpellbane } from "../../cards/src/cards/weapons/jubeel-spellbane.ts";
import { cintariSaber } from "../../cards/src/cards/weapons/cintari-saber.ts";
import { mercilessBattleaxe } from "../../cards/src/cards/weapons/merciless-battleaxe.ts";

const definitions: Record<string, FabCardDefinitionInput> = {
  hero: { canonicalId: "hero", name: "Hero", types: ["Hero"] },
  headA: { canonicalId: "headA", name: "Head A", types: ["Equipment", "Head"] },
  headB: { canonicalId: "headB", name: "Head B", types: ["Equipment", "Head"] },
  chest: { canonicalId: "chest", name: "Chest", types: ["Equipment", "Chest"] },
  sword: { canonicalId: "sword", name: "Sword", types: ["Weapon", "1H"] },
  dagger: { canonicalId: "dagger", name: "Dagger", types: ["Weapon", "1H"] },
  offhand: { canonicalId: "offhand", name: "Off-Hand", types: ["Equipment", "Off-Hand"] },
  quiver: { canonicalId: "quiver", name: "Quiver", types: ["Equipment", "Quiver"] },
  greatsword: { canonicalId: "greatsword", name: "Greatsword", types: ["Weapon", "2H"] },
  bow: { canonicalId: "bow", name: "Longbow", types: ["Weapon", "Bow", "2H"] },
  altHero: { canonicalId: "altHero", name: "Other Hero", types: ["Hero"] },
  youngHero: { canonicalId: "youngHero", name: "Young Hero", types: ["Hero", "Young"] },
  mentor: { canonicalId: "mentor", name: "Mentor", types: ["Mentor"] },
  companion: {
    canonicalId: "companion",
    name: "Companion",
    types: ["Companion", "Off-Hand", "Ally"],
  },
  demiHero: { canonicalId: "demiHero", name: "Demi-Hero", types: ["Demi-Hero"] },
  macro: { canonicalId: "macro", name: "Macro Object", types: ["Macro"] },
  attack: { canonicalId: "attack", name: "Attack", types: ["Action", "Attack"] },
  defense: { canonicalId: "defense", name: "Defense", types: ["Defense Reaction"] },
  bruteHero: { canonicalId: "bruteHero", name: "Brute Hero", types: ["Brute", "Hero"] },
  arakniHero: {
    canonicalId: "arakniHero",
    name: "Arakni, Huntsman",
    types: ["Assassin", "Hero"],
  },
  specAttack: {
    canonicalId: "specAttack",
    name: "Regicide",
    types: ["Assassin", "Action", "Attack"],
    keywords: [{ name: "specialization", hero: "Arakni" }],
  },
  hybridAttack: {
    canonicalId: "hybridAttack",
    name: "Hybrid Attack",
    types: ["Brute", "Warrior", "Action", "Attack"],
    supertypeSets: [["Brute"], ["Warrior"]],
  },
  multiclassAttack: {
    canonicalId: "multiclassAttack",
    name: "Multiclass Attack",
    types: ["Pirate", "Necromancer", "Action", "Attack"],
  },
  malformedHybridAttack: {
    canonicalId: "malformedHybridAttack",
    name: "Malformed Hybrid Attack",
    types: ["Ninja", "Action", "Attack"],
    supertypeSets: [["Brute"], ["Warrior"]],
  },
};

function pool(format: FabPregameFormat = "cc"): FabPregameCardPool {
  return {
    format,
    heroId: "hero",
    cardDefinitions: definitions,
    entries: [
      { canonicalId: "headA", quantity: 1, source: "equipment" },
      { canonicalId: "headB", quantity: 1, source: "equipment" },
      { canonicalId: "sword", quantity: 1, source: "equipment" },
      { canonicalId: "dagger", quantity: 1, source: "inventory" },
      { canonicalId: "offhand", quantity: 1, source: "inventory" },
      { canonicalId: "quiver", quantity: 1, source: "inventory" },
      { canonicalId: "greatsword", quantity: 1, source: "inventory" },
      { canonicalId: "bow", quantity: 1, source: "inventory" },
      { canonicalId: "attack", quantity: 55, source: "main" },
      { canonicalId: "defense", quantity: 5, source: "main" },
      { canonicalId: "defense", quantity: 10, source: "inventory" },
    ],
  };
}

describe("FAB pregame selection", () => {
  it("models the official deck, pool, copy, rarity, and hero-age rules", () => {
    expect(FAB_FORMAT_RULES).toMatchObject({
      cc: {
        heroAge: "adult",
        cardPoolMaximum: 80,
        deckSize: 60,
        exactDeckSize: false,
        copyLimit: 3,
      },
      silverAge: {
        heroAge: "young",
        cardPoolMaximum: 55,
        deckSize: 40,
        exactDeckSize: true,
        copyLimit: 2,
        eligibleRarities: ["B", "C", "R"],
      },
      ll: {
        heroAge: "adult",
        cardPoolMaximum: 80,
        deckSize: 60,
        exactDeckSize: false,
        copyLimit: 3,
      },
      blitz: {
        heroAge: "young",
        cardPoolMaximum: 52,
        deckSize: 40,
        exactDeckSize: true,
        copyLimit: 1,
      },
      shapeshifter: {
        heroAge: "young",
        cardPoolMaximum: null,
        deckSize: 30,
        exactDeckSize: false,
        copyLimit: null,
        legendaryLimit: false,
        enforceHeroCardPool: false,
      },
    });
  });

  it.each([
    ["cc", 60, true, 59, false, 61, true],
    ["ll", 60, true, 59, false, 61, true],
    ["blitz", 40, true, 39, false, 41, false],
    ["silverAge", 40, true, 39, false, 41, false],
    ["shapeshifter", 30, true, 29, false, 31, true],
  ] as const)(
    "enforces %s starting-deck size",
    (format, required, requiredValid, short, shortValid, long, longValid) => {
      const selection = (quantity: number) => ({
        equipment: {},
        deck: [
          { canonicalId: "attack", quantity: Math.min(quantity, 55) },
          ...(quantity > 55 ? [{ canonicalId: "defense", quantity: quantity - 55 }] : []),
        ],
      });
      expect(validateFabPregameSelection(pool(format), selection(required)).valid).toBe(
        requiredValid,
      );
      expect(validateFabPregameSelection(pool(format), selection(short)).valid).toBe(shortValid);
      expect(validateFabPregameSelection(pool(format), selection(long)).valid).toBe(longValid);
    },
  );

  it("classifies single-list arena cards and defaults to all deck cards", () => {
    const input = pool();
    const singleList: FabPregameCardPool = {
      ...input,
      entries: input.entries.map((entry) =>
        entry.canonicalId === "headA" ? { ...entry, source: "main" } : entry,
      ),
    };
    const selection = createDefaultFabPregameSelection(singleList);
    expect(selection.equipment.head).toBe("headA");
    expect(selection.deck.reduce((sum, entry) => sum + entry.quantity, 0)).toBe(70);
    expect(selection.deck.some((entry) => entry.canonicalId === "headA")).toBe(false);
  });

  it("allows empty slots and one 1H weapon with one Off-Hand", () => {
    const selection = createDefaultFabPregameSelection(pool());
    const withOffHand = {
      ...selection,
      equipment: { weapon1: "sword", weapon2: "offhand" },
    };
    expect(validateFabPregameSelection(pool(), withOffHand)).toMatchObject({ valid: true });
  });

  it.each([
    [{ weapon1: "sword", weapon2: "dagger" }, "two one-handed weapons"],
    [{ weapon1: "quiver" }, "a lone quiver"],
    [{ weapon1: "offhand" }, "a lone off-hand"],
  ])("allows %s (%s)", (equipment, _label) => {
    const selection = createDefaultFabPregameSelection(pool());
    expect(validateFabPregameSelection(pool(), { ...selection, equipment })).toMatchObject({
      valid: true,
    });
  });

  it.each([0, -1, 1.5])("rejects the untrusted deck quantity %s", (quantity) => {
    const result = validateFabPregameSelection(
      pool(),
      { equipment: {}, deck: [{ canonicalId: "attack", quantity }] },
      { relaxDeckSize: true },
    );
    expect(result).toMatchObject({ valid: false, deckCount: 0 });
    expect(result.issues).toContainEqual(expect.objectContaining({ code: "invalid-quantity" }));
  });

  it("rejects duplicate body use, 2H combinations, and arena cards in the deck", () => {
    const selection = createDefaultFabPregameSelection(pool());
    const invalid = {
      equipment: { head: "headA", chest: "headB", weapon1: "greatsword", weapon2: "offhand" },
      deck: [...selection.deck, { canonicalId: "headA", quantity: 1 }],
    };
    const result = validateFabPregameSelection(pool(), invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(["wrong-equipment-slot", "weapon-combination", "arena-card-in-deck"]),
    );
  });

  it("relaxes only deck size for practice", () => {
    const input = pool();
    const short = { equipment: {}, deck: [{ canonicalId: "attack", quantity: 3 }] };
    expect(validateFabPregameSelection(input, short).valid).toBe(false);
    expect(validateFabPregameSelection(input, short, { relaxDeckSize: true }).valid).toBe(true);
  });

  it("1.1.3b / 2.14.1b: accepts one matching hybrid supertype set without weakening multiclass", () => {
    const input: FabPregameCardPool = {
      format: "cc",
      heroId: "bruteHero",
      cardDefinitions: definitions,
      entries: [
        { canonicalId: "hybridAttack", quantity: 1, source: "main" },
        { canonicalId: "multiclassAttack", quantity: 1, source: "inventory" },
      ],
    };

    const result = validateFabPregameSelection(
      input,
      { equipment: {}, deck: [{ canonicalId: "hybridAttack", quantity: 1 }] },
      { relaxDeckSize: true },
    );

    expect(result.issues).not.toContainEqual(
      expect.objectContaining({ canonicalId: "hybridAttack" }),
    );
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "hero-supertype-mismatch",
        canonicalId: "multiclassAttack",
      }),
    );
  });

  it("8.3.7: rejects a specialization that does not match the hero moniker", () => {
    const input: FabPregameCardPool = {
      format: "cc",
      heroId: "bruteHero",
      cardDefinitions: definitions,
      entries: [{ canonicalId: "specAttack", quantity: 1, source: "main" }],
    };
    const result = validateFabPregameSelection(
      input,
      { equipment: {}, deck: [{ canonicalId: "specAttack", quantity: 1 }] },
      { relaxDeckSize: true },
    );
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "specialization-mismatch",
        canonicalId: "specAttack",
      }),
    );
  });

  it("8.3.7: accepts a specialization that matches the hero moniker", () => {
    const input: FabPregameCardPool = {
      format: "cc",
      heroId: "arakniHero",
      cardDefinitions: definitions,
      entries: [{ canonicalId: "specAttack", quantity: 1, source: "main" }],
    };
    const result = validateFabPregameSelection(
      input,
      { equipment: {}, deck: [{ canonicalId: "specAttack", quantity: 1 }] },
      { relaxDeckSize: true },
    );
    expect(result.issues).not.toContainEqual(
      expect.objectContaining({ code: "specialization-mismatch" }),
    );
  });

  it("8.3.7: accepts either moniker printed on a multi-hero specialization", () => {
    const hero = toFabCardDefinition(dromaiAshArtist);
    const specialization = toFabCardDefinition(redHotRed);
    const input: FabPregameCardPool = {
      format: "cc",
      heroId: hero.canonicalId,
      cardDefinitions: {
        [hero.canonicalId]: hero,
        [specialization.canonicalId]: specialization,
      },
      entries: [{ canonicalId: specialization.canonicalId, quantity: 1, source: "main" }],
    };
    const result = validateFabPregameSelection(
      input,
      { equipment: {}, deck: [{ canonicalId: specialization.canonicalId, quantity: 1 }] },
      { relaxDeckSize: true },
    );

    expect(result.issues).not.toContainEqual(
      expect.objectContaining({
        code: "specialization-mismatch",
        canonicalId: specialization.canonicalId,
      }),
    );
  });

  it("8.3.7: rejects a multi-hero specialization for an unrelated hero", () => {
    const hero = toFabCardDefinition(kassai);
    const specialization = toFabCardDefinition(redHotRed);
    const input: FabPregameCardPool = {
      format: "cc",
      heroId: hero.canonicalId,
      cardDefinitions: {
        [hero.canonicalId]: hero,
        [specialization.canonicalId]: specialization,
      },
      entries: [{ canonicalId: specialization.canonicalId, quantity: 1, source: "main" }],
    };
    const result = validateFabPregameSelection(
      input,
      { equipment: {}, deck: [{ canonicalId: specialization.canonicalId, quantity: 1 }] },
      { relaxDeckSize: true },
    );

    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "specialization-mismatch",
        canonicalId: specialization.canonicalId,
      }),
    );
  });

  it("8.3.7: Shiyana may include any-hero specialization cards", () => {
    const shiyanaDef = toFabCardDefinition(shiyanaDiamondGemini);
    const input: FabPregameCardPool = {
      format: "shapeshifter",
      heroId: shiyanaDef.canonicalId,
      cardDefinitions: {
        ...definitions,
        [shiyanaDef.canonicalId]: shiyanaDef,
      },
      entries: [{ canonicalId: "specAttack", quantity: 1, source: "main" }],
    };
    const result = validateFabPregameSelection(
      input,
      { equipment: {}, deck: [{ canonicalId: "specAttack", quantity: 1 }] },
      { relaxDeckSize: true },
    );
    expect(result.issues).not.toContainEqual(
      expect.objectContaining({ code: "specialization-mismatch" }),
    );
  });

  it("rejects a hybrid group that invents a supertype absent from the type box", () => {
    const input: FabPregameCardPool = {
      format: "cc",
      heroId: "bruteHero",
      cardDefinitions: definitions,
      entries: [{ canonicalId: "malformedHybridAttack", quantity: 1, source: "main" }],
    };

    expect(() =>
      validateFabPregameSelection(
        input,
        { equipment: {}, deck: [{ canonicalId: "malformedHybridAttack", quantity: 1 }] },
        { relaxDeckSize: true },
      ),
    ).toThrow("hybrid supertype group contains a supertype absent from its type box");
  });

  it("rejects weapons when the hero has continuous restrict equip (Bolfar)", () => {
    // Production path: Bolfar "You can't equip weapons" is a catalog static
    // continuous rule-modification. Pregame seating must honor it.
    const bolfarDef = toFabCardDefinition(bolfarBearHands);
    // Use a Guardian weapon so the negative assertion isolates Bolfar's equip
    // restriction rather than failing the independent hero-supertype pool gate.
    const bladeDef = toFabCardDefinition(anothos);
    const helmDef = toFabCardDefinition(ironrotHelm);
    const bolfarPool: FabPregameCardPool = {
      format: "blitz",
      heroId: bolfarDef.canonicalId,
      cardDefinitions: {
        [bolfarDef.canonicalId]: bolfarDef,
        [bladeDef.canonicalId]: bladeDef,
        [helmDef.canonicalId]: helmDef,
        attack: definitions.attack!,
      },
      entries: [
        { canonicalId: bladeDef.canonicalId, quantity: 1, source: "equipment" },
        { canonicalId: helmDef.canonicalId, quantity: 1, source: "equipment" },
        { canonicalId: "attack", quantity: 40, source: "main" },
      ],
    };
    const weaponSeat = {
      equipment: { weapon1: bladeDef.canonicalId },
      deck: [{ canonicalId: "attack", quantity: 40 }],
    };
    const weaponResult = validateFabPregameSelection(bolfarPool, weaponSeat);
    expect(weaponResult.valid).toBe(false);
    expect(weaponResult.issues.map((i) => i.code)).toContain("equip-restricted");

    // Non-weapon equipment (helm) is still legal.
    const helmSeat = {
      equipment: { head: helmDef.canonicalId },
      deck: [{ canonicalId: "attack", quantity: 40 }],
    };
    expect(validateFabPregameSelection(bolfarPool, helmSeat).valid).toBe(true);

    // Reconcile strips a requested weapon and keeps the hero legal.
    const reconciled = reconcileFabPregameSelection(bolfarPool, weaponSeat);
    expect(reconciled.selection.equipment.weapon1).toBeUndefined();
    expect(reconciled.validation.valid).toBe(true);
  });

  it("Zane may seat a 2H sword as 1H beside another 1H weapon", () => {
    const zaneDef = toFabCardDefinition(zaneBroadlyBeloved);
    const jubeelDef = toFabCardDefinition(jubeelSpellbane);
    const saberDef = toFabCardDefinition(cintariSaber);
    const pool: FabPregameCardPool = {
      format: "blitz",
      heroId: zaneDef.canonicalId,
      cardDefinitions: {
        [zaneDef.canonicalId]: zaneDef,
        [jubeelDef.canonicalId]: jubeelDef,
        [saberDef.canonicalId]: saberDef,
        attack: definitions.attack!,
      },
      entries: [
        { canonicalId: jubeelDef.canonicalId, quantity: 1, source: "equipment" },
        { canonicalId: saberDef.canonicalId, quantity: 1, source: "equipment" },
        { canonicalId: "attack", quantity: 40, source: "main" },
      ],
    };
    const result = validateFabPregameSelection(pool, {
      equipment: { weapon1: jubeelDef.canonicalId, weapon2: saberDef.canonicalId },
      deck: [{ canonicalId: "attack", quantity: 40 }],
    });
    expect(result.valid).toBe(true);
  });

  it("a Warrior without Zane's grant cannot seat a 2H sword beside a 1H", () => {
    const kassaiDef = toFabCardDefinition(kassai);
    const jubeelDef = toFabCardDefinition(jubeelSpellbane);
    const saberDef = toFabCardDefinition(cintariSaber);
    const pool: FabPregameCardPool = {
      format: "blitz",
      heroId: kassaiDef.canonicalId,
      cardDefinitions: {
        [kassaiDef.canonicalId]: kassaiDef,
        [jubeelDef.canonicalId]: jubeelDef,
        [saberDef.canonicalId]: saberDef,
        attack: definitions.attack!,
      },
      entries: [
        { canonicalId: jubeelDef.canonicalId, quantity: 1, source: "equipment" },
        { canonicalId: saberDef.canonicalId, quantity: 1, source: "equipment" },
        { canonicalId: "attack", quantity: 40, source: "main" },
      ],
    };
    const result = validateFabPregameSelection(pool, {
      equipment: { weapon1: jubeelDef.canonicalId, weapon2: saberDef.canonicalId },
      deck: [{ canonicalId: "attack", quantity: 40 }],
    });
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain("weapon-combination");
  });

  it("Zane's grant does not apply to a 2H axe", () => {
    const zaneDef = toFabCardDefinition(zaneBroadlyBeloved);
    const axeDef = toFabCardDefinition(mercilessBattleaxe);
    const saberDef = toFabCardDefinition(cintariSaber);
    const pool: FabPregameCardPool = {
      format: "blitz",
      heroId: zaneDef.canonicalId,
      cardDefinitions: {
        [zaneDef.canonicalId]: zaneDef,
        [axeDef.canonicalId]: axeDef,
        [saberDef.canonicalId]: saberDef,
        attack: definitions.attack!,
      },
      entries: [
        { canonicalId: axeDef.canonicalId, quantity: 1, source: "equipment" },
        { canonicalId: saberDef.canonicalId, quantity: 1, source: "equipment" },
        { canonicalId: "attack", quantity: 40, source: "main" },
      ],
    };
    const result = validateFabPregameSelection(pool, {
      equipment: { weapon1: axeDef.canonicalId, weapon2: saberDef.canonicalId },
      deck: [{ canonicalId: "attack", quantity: 40 }],
    });
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain("weapon-combination");
  });

  it("replaces an invalid partial selection with the complete default loadout", () => {
    const input = pool();
    const result = reconcileFabPregameSelection(input, {
      equipment: { weapon1: "greatsword", weapon2: "offhand" },
      deck: [{ canonicalId: "defense", quantity: 2 }],
    });
    expect(result.validation.valid).toBe(true);
    expect(result.selection.equipment).toEqual({
      head: "headA",
      weapon1: "sword",
      weapon2: "dagger",
    });
    expect(result.selection.deck).toContainEqual({ canonicalId: "attack", quantity: 55 });
    expect(result.selection.deck).toContainEqual({ canonicalId: "defense", quantity: 15 });
  });

  it("8.2.15a: a 2H bow + a quiver is a legal seating (regression: was wrongly rejected)", () => {
    const selection = createDefaultFabPregameSelection(pool());
    const seat = { ...selection, equipment: { weapon1: "bow", weapon2: "quiver" } };
    const result = validateFabPregameSelection(pool(), seat);
    expect(result.issues.some((issue) => issue.code === "weapon-combination")).toBe(false);
  });

  it("8.2.15a: reconciliation preserves a valid bow and quiver selection", () => {
    const result = reconcileFabPregameSelection(pool(), {
      equipment: { weapon1: "bow", weapon2: "quiver" },
      deck: [
        { canonicalId: "attack", quantity: 55 },
        { canonicalId: "defense", quantity: 5 },
      ],
    });
    expect(result.validation.valid).toBe(true);
    expect(result.selection.equipment).toEqual({ weapon1: "bow", weapon2: "quiver" });
  });

  it("8.2.2b: a 2H non-bow + a quiver is rejected (only a 2H bow may share with a quiver)", () => {
    const selection = createDefaultFabPregameSelection(pool());
    const seat = { ...selection, equipment: { weapon1: "greatsword", weapon2: "quiver" } };
    const result = validateFabPregameSelection(pool(), seat);
    expect(result.issues.some((issue) => issue.code === "weapon-combination")).toBe(true);
  });

  it("8.2.10b: two off-hands is rejected", () => {
    const selection = createDefaultFabPregameSelection(pool());
    const seat = { ...selection, equipment: { weapon1: "offhand", weapon2: "offhand" } };
    const result = validateFabPregameSelection(pool(), seat);
    expect(result.issues.some((issue) => issue.code === "weapon-combination")).toBe(true);
  });

  it("8.2.15b: two quivers is rejected", () => {
    const selection = createDefaultFabPregameSelection(pool());
    const seat = { ...selection, equipment: { weapon1: "quiver", weapon2: "quiver" } };
    const result = validateFabPregameSelection(pool(), seat);
    expect(result.issues.some((issue) => issue.code === "weapon-combination")).toBe(true);
  });

  it("8.1.5b: a Hero card cannot be part of the card-pool", () => {
    const result = validateFabPregameSelection(
      pool(),
      { equipment: {}, deck: [{ canonicalId: "altHero", quantity: 1 }] },
      { relaxDeckSize: true },
    );
    expect(result.issues.some((issue) => issue.code === "hero-in-card-pool")).toBe(true);
  });

  it("8.1.10a: a Mentor requires a young hero (default adult hero is rejected)", () => {
    const adultPool: FabPregameCardPool = {
      ...pool(),
      entries: [...pool().entries, { canonicalId: "mentor", quantity: 1, source: "main" }],
    };
    const result = validateFabPregameSelection(adultPool, {
      equipment: {},
      deck: [
        { canonicalId: "mentor", quantity: 1 },
        { canonicalId: "attack", quantity: 59 },
      ],
    });
    expect(result.issues.some((issue) => issue.code === "mentor-requires-young-hero")).toBe(true);
  });

  it("8.1.10a: a Mentor is allowed when the hero has the printed Young subtype", () => {
    const youngPool: FabPregameCardPool = {
      format: "blitz",
      heroId: "youngHero",
      cardDefinitions: definitions,
      entries: [
        { canonicalId: "mentor", quantity: 1, source: "main" },
        { canonicalId: "attack", quantity: 40, source: "main" },
      ],
    };
    const result = validateFabPregameSelection(youngPool, {
      equipment: {},
      deck: [
        { canonicalId: "mentor", quantity: 1 },
        { canonicalId: "attack", quantity: 39 },
      ],
    });
    expect(result.issues.some((issue) => issue.code === "mentor-requires-young-hero")).toBe(false);
  });

  it("8.1.14: a Companion is classified as an arena-card and rejected from the deck", () => {
    const result = validateFabPregameSelection(
      pool(),
      { equipment: {}, deck: [{ canonicalId: "companion", quantity: 1 }] },
      { relaxDeckSize: true },
    );
    expect(result.issues.some((issue) => issue.code === "arena-card-in-deck")).toBe(true);
  });

  it("8.1.11: a Demi-Hero is classified as an arena-card and rejected from the deck", () => {
    const result = validateFabPregameSelection(
      pool(),
      { equipment: {}, deck: [{ canonicalId: "demiHero", quantity: 1 }] },
      { relaxDeckSize: true },
    );
    expect(result.issues.some((issue) => issue.code === "arena-card-in-deck")).toBe(true);
  });

  it("8.1.13a: a Macro-typed card cannot be in the card-pool", () => {
    const result = validateFabPregameSelection(
      pool(),
      { equipment: {}, deck: [{ canonicalId: "macro", quantity: 1 }] },
      { relaxDeckSize: true },
    );
    expect(result.issues.some((issue) => issue.code === "macro-outside-macro-object")).toBe(true);
  });
});
