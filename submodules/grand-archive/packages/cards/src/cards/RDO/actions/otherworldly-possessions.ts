import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const otherworldlyPossessions: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "MuCOJRgMdj",
  slug: "otherworldly-possessions",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "MuCOJRgMdj:face:default",
      catalogId: "MuCOJRgMdj",
      name: "Otherworldly Possessions",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "For each different reserve cost among objects you control and cards in your graveyard, put an enlighten counter on your champion.",
      abilities: [
        {
          id: "MuCOJRgMdj-a1",
          kind: "card-resolution",
          text: "For each different reserve cost among objects you control and cards in your graveyard, put an enlighten counter on your champion.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field", "graveyard"],
                  player: "controller",
                },
                distinctBy: "reserve-cost",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "enlighten",
            amount: {
              kind: "count",
              collection: {
                zones: ["field", "graveyard"],
                player: "controller",
              },
              distinctBy: "reserve-cost",
            },
          },
        },
      ],
    },
  },
};

export default otherworldlyPossessions;
