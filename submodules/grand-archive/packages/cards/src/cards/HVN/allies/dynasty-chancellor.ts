import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dynastyChancellor: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "do1blsupu0",
  slug: "dynasty-chancellor",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "do1blsupu0:face:default",
      catalogId: "do1blsupu0",
      name: "Dynasty Chancellor",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText:
        "Intercept\n\nOn Enter: If your Shifting Currents face North, put the top two cards of your deck into your graveyard.\n\nDeluge 3 — On Death: If you have three or more water element cards in your graveyard, draw a card.\n",
      abilities: [
        {
          id: "do1blsupu0-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "do1blsupu0-a2",
          kind: "triggered",
          text: "On Enter: If your Shifting Currents face North, put the top two cards of your deck into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "player-state",
              player: "controller",
              state: {
                named: "shifting-currents",
                value: "North",
              },
            },
            then: {
              kind: "mill",
              player: "controller",
              amount: 2,
            },
          },
        },
        {
          id: "do1blsupu0-a3",
          kind: "triggered",
          text: "Deluge 3 — On Death: If you have three or more water element cards in your graveyard, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
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
                right: 3,
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
          },
          label: {
            name: "Deluge 3",
          },
        },
      ],
    },
  },
};

export default dynastyChancellor;
