import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dynasticWhirlpool: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8ydxeQcp50",
  slug: "dynastic-whirlpool",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8ydxeQcp50:face:default",
      catalogId: "8ydxeQcp50",
      name: "Dynastic Whirlpool",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["EXALTED", "WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nEach opponent puts the top fifteen cards of their deck into their graveyard.",
      abilities: [
        {
          id: "8ydxeQcp50-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "8ydxeQcp50-a2",
          kind: "card-resolution",
          text: "Each opponent puts the top fifteen cards of their deck into their graveyard.",
          effect: {
            kind: "mill",
            player: "each-opponent",
            amount: 15,
          },
        },
      ],
    },
  },
};

export default dynasticWhirlpool;
