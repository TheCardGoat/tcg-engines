import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dazzlingCourtesan: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "znk6g5o8ys",
  slug: "dazzling-courtesan",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "znk6g5o8ys:face:default",
      catalogId: "znk6g5o8ys",
      name: "Dazzling Courtesan",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Kindle 3 (You may banish up to three fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card's cost.)",
      abilities: [
        {
          id: "znk6g5o8ys-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kindle 3 (You may banish up to three fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card's cost.)",
          keyword: {
            name: "kindle",
            value: 3,
          },
        },
      ],
    },
  },
};

export default dazzlingCourtesan;
