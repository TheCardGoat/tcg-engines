import { describe, expect, it } from "vitest";
import { compileFabMatchProgram } from "./match-program.ts";
import type { FabPairedCardFace } from "@tcg/flesh-and-blood-types";

const publicCards = [
  { canonicalId: "a", names: ["A"] },
  { canonicalId: "b", names: ["B"] },
] as const;

describe("FAB match programs", () => {
  it("normalizes definitions deterministically and exposes an immutable registry", () => {
    const first = compileFabMatchProgram(
      {
        b: { canonicalId: "b", types: ["Action"] },
        a: { canonicalId: "a", types: ["Hero"] },
      },
      publicCards,
    );
    const second = compileFabMatchProgram(
      {
        a: { canonicalId: "a", types: ["Hero"] },
        b: { canonicalId: "b", types: ["Action"] },
      },
      [...publicCards].reverse(),
    );

    expect(first.fingerprint).toBe(second.fingerprint);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.cardDefinitions)).toBe(true);
    expect(Object.isFrozen(first.cardDefinitions.a)).toBe(true);
    expect(Object.isFrozen(first.cardDefinitions.a!.base)).toBe(true);
    expect(Object.isFrozen(first.cardDefinitions.a!.base.typeBox.types)).toBe(true);
    expect(Object.isFrozen(first.publicCardIdentities)).toBe(true);
  });

  it("owns a detached deeply-frozen definition graph", () => {
    const source = {
      card: {
        canonicalId: "card",
        types: ["Action"],
        abilities: [
          {
            id: "card-a1",
            kind: "static" as const,
            staticKind: "continuous" as const,
            text: "This has go again.",
            effect: {
              type: "gain-life" as const,
              amount: 1,
              target: { selector: "controller" as const },
            },
          },
        ],
      },
    };
    const program = compileFabMatchProgram(source, publicCards);
    source.card.types[0] = "Equipment";

    expect(program.cardDefinitions.card!.base.typeBox.types).toEqual(["Action"]);
    expect(Object.isFrozen(program.cardDefinitions.card!.base.abilities)).toBe(true);
    expect(Object.isFrozen(program.cardDefinitions.card!.base.abilities![0])).toBe(true);
    expect(Object.isFrozen(program.cardDefinitions.card!.base.abilities![0]!.effect)).toBe(true);
  });

  it("owns a detached deeply-frozen public identity graph", () => {
    const source = [{ canonicalId: "card", names: ["Card"] }];
    const program = compileFabMatchProgram({}, source);

    source[0]!.canonicalId = "changed";
    source[0]!.names[0] = "Changed";

    expect(program.publicCardIdentities).toEqual([{ canonicalId: "card", names: ["Card"] }]);
    expect(Object.isFrozen(program.publicCardIdentities[0])).toBe(true);
    expect(Object.isFrozen(program.publicCardIdentities[0]!.names)).toBe(true);
  });

  it("changes identity when executable authored behavior changes", () => {
    const base = compileFabMatchProgram(
      { card: { canonicalId: "card", types: ["Action"] } },
      publicCards,
    );
    const changed = compileFabMatchProgram(
      {
        card: {
          canonicalId: "card",
          types: ["Action"],
          power: 1,
        },
      },
      publicCards,
    );
    expect(changed.fingerprint).not.toBe(base.fingerprint);
  });

  it("changes identity when the public name catalog changes", () => {
    const definitions = { card: { canonicalId: "card", types: ["Action"] } };
    const first = compileFabMatchProgram(definitions, publicCards);
    const changed = compileFabMatchProgram(definitions, [
      ...publicCards,
      { canonicalId: "global-only", names: ["Global Only"] },
    ]);
    expect(changed.fingerprint).not.toBe(first.fingerprint);
  });

  it("rejects an absent or malformed public name catalog", () => {
    expect(() => Reflect.apply(compileFabMatchProgram, undefined, [{}, undefined])).toThrow(
      "requires an explicit public card identity catalog",
    );
    expect(() => compileFabMatchProgram({}, [{ canonicalId: "card", names: [" "] }])).toThrow(
      "require a canonical id and at least one name",
    );
    expect(() =>
      compileFabMatchProgram({}, [
        { canonicalId: "card", names: ["Card"] },
        { canonicalId: "card", names: ["Card Reprint"] },
      ]),
    ).toThrow("Duplicate public FAB card identity: card");
  });

  it("rejects paired layouts whose face identities are ambiguous or belong to another card", () => {
    const pairedFace = (faceId: FabPairedCardFace["faceId"]): FabPairedCardFace => ({
      faceId,
      name: "Face",
      typeText: "Action",
      types: ["Action"],
      traits: [],
      text: "",
      keywords: [],
      abilities: [],
    });
    expect(() =>
      compileFabMatchProgram(
        {
          card: {
            canonicalId: "card",
            types: ["Action"],
            layout: {
              kind: "twin",
              front: pairedFace("card:face:front"),
              back: pairedFace("other:face:back"),
            },
          },
        },
        publicCards,
      ),
    ).toThrowError("requires two distinct canonical face ids");
  });
});
