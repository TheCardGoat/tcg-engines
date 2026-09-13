import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const frog: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zGlZDatGXe",
  slug: "frog",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zGlZDatGXe:face:default",
      catalogId: "zGlZDatGXe",
      name: "Croaking Webfoot",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "FROG"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "zGlZDatGXe-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default frog;
