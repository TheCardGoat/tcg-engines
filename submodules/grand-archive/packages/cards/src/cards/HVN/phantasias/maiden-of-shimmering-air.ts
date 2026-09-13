import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const maidenOfShimmeringAir: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3n4l6aoj4t",
  slug: "maiden-of-shimmering-air",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3n4l6aoj4t:face:default",
      catalogId: "3n4l6aoj4t",
      name: "Maiden of Shimmering Air",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA", "ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "APPARITION"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "3n4l6aoj4t-a1",
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

export default maidenOfShimmeringAir;
