import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const connivingPlans: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2b2w1ydw5z",
  slug: "conniving-plans",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2b2w1ydw5z:face:default",
      catalogId: "2b2w1ydw5z",
      name: "Conniving Plans",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Put the top two cards of your deck into your graveyard.\n\nDeluge 4 — If there are four or more water element cards in your graveyard, put a preparation counter on your champion and draw a card into your memory.\n",
      abilities: [
        {
          id: "2b2w1ydw5z-a1",
          kind: "card-resolution",
          text: "Put the top two cards of your deck into your graveyard.",
          effect: {
            kind: "mill",
            player: "controller",
            amount: 2,
          },
        },
        {
          id: "2b2w1ydw5z-a2",
          kind: "card-resolution",
          text: "Deluge 4 — If there are four or more water element cards in your graveyard, put a preparation counter on your champion and draw a card into your memory.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "count",
                  collection: {
                    zones: ["graveyard"],
                    player: "controller",
                    filter: {
                      kind: "element",
                      oneOf: ["WATER"],
                    },
                  },
                },
                operator: "gte",
                right: 4,
              },
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "add-counter",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "preparation",
                  amount: 1,
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              ],
            },
          },
          label: {
            name: "Deluge 4",
          },
        },
      ],
    },
  },
};

export default connivingPlans;
