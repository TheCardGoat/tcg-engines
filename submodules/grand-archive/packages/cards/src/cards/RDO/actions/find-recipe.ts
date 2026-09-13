import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const findRecipe: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "NyJZ7Eys2b",
  slug: "find-recipe",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "NyJZ7Eys2b:face:default",
      catalogId: "NyJZ7Eys2b",
      name: "Find Recipe",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Scavenge 6 for a Potion card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
      abilities: [
        {
          id: "NyJZ7Eys2b-a1",
          kind: "card-resolution",
          text: "Scavenge 6 for a Potion card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
          effect: {
            kind: "keyword-action",
            action: "scavenge",
            amount: 6,
            filter: {
              kind: "subtype",
              oneOf: ["POTION"],
            },
          },
        },
      ],
    },
  },
};

export default findRecipe;
