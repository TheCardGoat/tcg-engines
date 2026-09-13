import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ghostsightMare: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wosk26yg5z",
  slug: "ghostsight-mare",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wosk26yg5z:face:default",
      catalogId: "wosk26yg5z",
      name: "Ghostsight Mare",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "HORSE"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText: "True Sight (This ally can attack units with stealth.)",
      abilities: [
        {
          id: "wosk26yg5z-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "True Sight (This ally can attack units with stealth.)",
          keyword: {
            name: "true-sight",
          },
        },
      ],
    },
  },
};

export default ghostsightMare;
