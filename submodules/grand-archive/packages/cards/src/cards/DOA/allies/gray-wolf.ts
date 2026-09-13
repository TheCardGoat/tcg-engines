import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const grayWolf: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hJ2xh9lNMR",
  slug: "gray-wolf",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hJ2xh9lNMR:face:default",
      catalogId: "hJ2xh9lNMR",
      name: "Gray Wolf",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "WOLF"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText: "Pride 2 (This ally won't obey you unless your champion is level 2 or higher.)",
      abilities: [
        {
          id: "hJ2xh9lNMR-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 2 (This ally won't obey you unless your champion is level 2 or higher.)",
          keyword: {
            name: "pride",
            value: 2,
          },
        },
      ],
    },
  },
};

export default grayWolf;
