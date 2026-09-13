import { describe, expect, it } from "vite-plus/test";
import { normalizeBaseObjectProperties, registerFabCardDefinition } from "../cards.ts";

describe("normalized base-object loader", () => {
  it("separates every type-box category and preserves numeric absence", () => {
    const base = normalizeBaseObjectProperties({
      canonicalId: "card-1",
      name: "Test Attack",
      types: ["Draconic", "Ninja", "Action", "Attack"],
      traits: ["Go again"],
      color: "Red",
      pitch: "1",
      power: 0,
      keywords: [{ name: "go-again" }],
      abilities: [],
    });

    expect(base).toEqual({
      names: ["Test Attack"],
      color: "red",
      typeBox: {
        metatypes: [],
        supertypes: ["Ninja", "Draconic"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Ninja", "Draconic"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      traits: ["Go again"],
      textBoxIds: ["card-1"],
      activeFaceIds: ["card-1:face:front"],
      numeric: { pitch: 1, power: 0 },
      keywords: [{ name: "go-again" }],
      abilities: [],
    });
    expect("cost" in base.numeric).toBe(false);
  });

  it("registers an exact normalized record once", () => {
    const registered = registerFabCardDefinition({
      canonicalId: "hero-1",
      types: ["Guardian", "Hero", "Young"],
      health: 20,
      intelligence: 4,
    });

    expect(registered.base.typeBox).toEqual({
      metatypes: [],
      supertypes: ["Guardian"],
      types: ["Hero"],
      subtypes: ["Young"],
    });
    expect(registered.base.numeric).toEqual({ life: 20, intellect: 4 });
    expect(registered.layout).toEqual({ kind: "single" });
    expect(registered.slug).toBe("hero-1");
    expect(registered.base.color).toBeNull();
    expect(registered.base.keywords.every((keyword) => typeof keyword !== "string")).toBe(true);
  });

  it("rejects an unknown catalog vocabulary token", () => {
    expect(() =>
      normalizeBaseObjectProperties({
        canonicalId: "bad",
        types: ["Action", "Made Up Type"],
      }),
    ).toThrow("unsupported FAB type-box vocabulary token Made Up Type");
  });
});
