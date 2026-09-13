import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";

function executableCard(id: string, amount: number) {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        cost: { kind: "none" },
        typeLine: {
          supertypes: [],
          types: ["ACTION"],
          classes: ["MAGE"],
          subtypes: [],
        },
        elements: ["NORM"],
        stats: {},
        rulesText: `Draw ${amount}.`,
        abilities: [
          {
            id: `${id}-a1`,
            kind: "card-resolution",
            text: `Draw ${amount}.`,
            effect: { kind: "draw", player: "controller", amount },
          },
        ],
      },
    },
  } satisfies GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
}

function illegallyFastCard(
  id: string,
  type: "ALLY" | "ATTACK" | "DOMAIN" | "ITEM" | "PHANTASIA" | "WEAPON",
) {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        cost: { kind: "reserve", amount: 1 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["MAGE"],
          subtypes: [],
        },
        elements: ["NORM"],
        speed: "fast",
        stats: type === "ALLY" ? { power: 1, life: 1 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  } satisfies GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
}

function functionalCard(
  id: string,
  type: "ACTION" | "ALLY" | "ATTACK" | "CHAMPION" | "DOMAIN" | "ITEM" | "WEAPON",
  subtypes: readonly string[],
  stats: {
    readonly level?: number;
    readonly power?: number;
    readonly life?: number;
    readonly durability?: number;
  },
) {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        cost: { kind: "reserve", amount: 1 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["MAGE"],
          subtypes,
        },
        elements: ["NORM"],
        speed: "slow",
        stats,
        rulesText: "",
        abilities: [],
      },
    },
  } satisfies GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
}

describe("Grand Archive match programs", () => {
  it("owns a detached, deeply frozen executable card graph", () => {
    const source = executableCard("immutable-program-card", 1);
    const program = createGrandArchiveMatchProgram([source]);
    const compiled = program.cardsById[source.canonicalId]!;
    if (compiled.layout.kind !== "single-faced") throw new Error("Expected a single-faced card");

    source.layout.face.name = "Mutated Name";
    source.layout.face.abilities[0]!.effect.amount = 99;

    expect(compiled.layout.face.name).toBe("immutable-program-card");
    expect(compiled.layout.face.abilities[0]).toMatchObject({
      effect: { kind: "draw", amount: 1 },
    });
    expect(Object.isFrozen(program)).toBe(true);
    expect(Object.isFrozen(program.cardsById)).toBe(true);
    expect(Object.isFrozen(compiled)).toBe(true);
    expect(Object.isFrozen(compiled.layout.face)).toBe(true);
    expect(Object.isFrozen(compiled.layout.face.abilities)).toBe(true);
    expect(Object.isFrozen(compiled.layout.face.abilities[0])).toBe(true);
  });

  it("fingerprints equivalent programs independently of input order", () => {
    const first = executableCard("program-order-first", 1);
    const second = executableCard("program-order-second", 2);

    expect(createGrandArchiveMatchProgram([first, second]).fingerprint).toBe(
      createGrandArchiveMatchProgram([second, first]).fingerprint,
    );
  });

  it.each(["ALLY", "ATTACK", "DOMAIN", "ITEM", "PHANTASIA", "WEAPON"] as const)(
    "rejects a printed fast-speed %s definition",
    (type) => {
      const card = illegallyFastCard(`fast-${type.toLowerCase()}`, type);

      expect(() => createGrandArchiveMatchProgram([card])).toThrow(
        `gives slow-only ${type} cards fast speed`,
      );
    },
  );

  it.each([
    functionalCard("ally-without-power", "ALLY", [], { life: 1 }),
    functionalCard("attack-without-power", "ATTACK", [], {}),
    functionalCard("weapon-without-power", "WEAPON", [], { durability: 3 }),
    functionalCard("bullet-without-power", "ITEM", ["BULLET"], {}),
    functionalCard("arrow-without-power", "ITEM", ["ARROW"], {}),
    functionalCard("aethercharge-without-power", "ACTION", ["SPELL", "AETHERCHARGE"], {}),
  ])("rejects $canonicalId without its required power stat", (card) => {
    expect(() => createGrandArchiveMatchProgram([card])).toThrow(
      "requires a power stat for its card or functional type",
    );
  });

  it.each([
    functionalCard("champion-without-life", "CHAMPION", [], { level: 0 }),
    functionalCard("ally-without-life", "ALLY", [], { power: 1 }),
  ])("rejects $canonicalId without its required life stat", (card) => {
    expect(() => createGrandArchiveMatchProgram([card])).toThrow(
      "requires a life stat for its card type",
    );
  });

  it.each([
    functionalCard("weapon-without-durability", "WEAPON", [], { power: 1 }),
    functionalCard("siegeable-without-durability", "DOMAIN", ["SIEGEABLE"], {}),
  ])("rejects $canonicalId without its required durability stat", (card) => {
    expect(() => createGrandArchiveMatchProgram([card])).toThrow(
      "requires a durability stat for its functional type",
    );
  });
});
