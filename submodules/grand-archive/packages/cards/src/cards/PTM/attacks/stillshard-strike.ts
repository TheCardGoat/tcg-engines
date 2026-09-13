import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stillshardStrike: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TDI5DOrWB5",
  slug: "stillshard-strike",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TDI5DOrWB5:face:default",
      catalogId: "TDI5DOrWB5",
      name: "Stillshard Strike",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 3,
      },
      rulesText:
        "Prepare 1\n\nOn Attack: If Stillshard Strike was prepared, recover 1+X, where X is the total amount of sheen counters on each defending unit.",
      abilities: [
        {
          id: "TDI5DOrWB5-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 1",
          keyword: {
            name: "prepare",
            value: 1,
          },
        },
        {
          id: "TDI5DOrWB5-a2",
          kind: "triggered",
          text: "On Attack: If Stillshard Strike was prepared, recover 1+X, where X is the total amount of sheen counters on each defending unit.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "sum-counters",
                collection: {
                  zones: ["field"],
                  player: "each-player",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                      {
                        kind: "object-state",
                        state: "defending",
                      },
                    ],
                  },
                },
                counter: {
                  named: "sheen",
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "prepared",
            },
            then: {
              kind: "recover",
              player: "controller",
              amount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  1,
                  {
                    kind: "variable",
                    symbol: "X",
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default stillshardStrike;
