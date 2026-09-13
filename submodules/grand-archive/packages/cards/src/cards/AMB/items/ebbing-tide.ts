import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ebbingTide: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "s7pmqsl3jw",
  slug: "ebbing-tide",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "s7pmqsl3jw:face:default",
      catalogId: "s7pmqsl3jw",
      name: "Ebbing Tide",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "FAN"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Hindered (This object enters the field rested)\n\nREST: Empower 2. Activate this ability only if your Shifting Currents face East or West.\n\nREST, Banish Ebbing Tide: Empower X, where X is the amount of water element cards in your graveyard. Activate this ability only at slow speed and only if your Shifting Currents face North or South.",
      abilities: [
        {
          id: "s7pmqsl3jw-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "s7pmqsl3jw-a2",
          kind: "activated",
          text: "REST: Empower 2. Activate this ability only if your Shifting Currents face East or West.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          condition: {
            kind: "any",
            conditions: [
              {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "East",
                },
              },
              {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "West",
                },
              },
            ],
          },
          effect: {
            kind: "keyword-action",
            action: "empower",
            amount: 2,
          },
        },
        {
          id: "s7pmqsl3jw-a3",
          kind: "activated",
          text: "REST, Banish Ebbing Tide: Empower X, where X is the amount of water element cards in your graveyard. Activate this ability only at slow speed and only if your Shifting Currents face North or South.",
          activation: "ability",
          speed: "slow",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "banish-self",
              },
            ],
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
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
            },
          ],
          condition: {
            kind: "any",
            conditions: [
              {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "North",
                },
              },
              {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "South",
                },
              },
            ],
          },
          effect: {
            kind: "keyword-action",
            action: "empower",
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
      ],
    },
  },
};

export default ebbingTide;
