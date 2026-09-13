import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const coreFractal: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> =
  {
    canonicalId: "8hqHAU0Xj6",
    slug: "core-fractal",
    definitionKind: "token-representation",
    layout: {
      kind: "single-faced",
      face: {
        id: "8hqHAU0Xj6:face:default",
        catalogId: "8hqHAU0Xj6",
        name: "Core Fractal",
        cost: {
          kind: "reserve",
          amount: 3,
        },
        typeLine: {
          supertypes: [],
          types: ["PHANTASIA"],
          classes: ["CLERIC", "MAGE"],
          subtypes: ["CLERIC", "MAGE", "FRACTAL"],
        },
        elements: ["NORM"],
        stats: {},
        rulesText:
          "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
        abilities: [
          {
            id: "8hqHAU0Xj6-a1",
            kind: "static",
            staticKind: "intrinsic",
            text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
            keyword: {
              name: "reservable",
            },
          },
        ],
      },
    },
  };

export default coreFractal;
