import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const increasingDanger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7tUvIHeo0i",
  slug: "increasing-danger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7tUvIHeo0i:face:default",
      catalogId: "7tUvIHeo0i",
      name: "Increasing Danger",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText: "Draw a card. Each player draws a card into their memory.",
      abilities: [
        {
          id: "7tUvIHeo0i-a1",
          kind: "card-resolution",
          text: "Draw a card. Each player draws a card into their memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "draw",
                player: "each-player",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default increasingDanger;
