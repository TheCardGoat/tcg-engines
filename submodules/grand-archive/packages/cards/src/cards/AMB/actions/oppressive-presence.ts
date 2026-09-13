import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const oppressivePresence: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "j9hjjvkyyr",
  slug: "oppressive-presence",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "j9hjjvkyyr:face:default",
      catalogId: "j9hjjvkyyr",
      name: "Oppressive Presence",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only during an opponent's recollection phase.\n\nUntil end of turn, players can't declare attacks with allies unless they pay (X) for each attack declaration, where X is the highest POWER among fire element allies you control.",
      abilities: [
        {
          id: "j9hjjvkyyr-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only during an opponent's recollection phase.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "phase",
                    phase: "recollection",
                  },
                  {
                    kind: "turn-player",
                    player: "opponent",
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "j9hjjvkyyr-a2",
          kind: "card-resolution",
          text: "Until end of turn, players can't declare attacks with allies unless they pay (X) for each attack declaration, where X is the highest POWER among fire element allies you control.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "aggregate-property",
                operation: "maximum",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "element",
                        oneOf: ["FIRE"],
                      },
                    ],
                  },
                },
                property: "power",
                basis: "current",
                emptyValue: 0,
              },
            },
          ],
          effect: {
            kind: "rule-modification",
            mode: "add-cost",
            action: "attack",
            subject: {
              kind: "player",
              player: "each-player",
            },
            filter: {
              kind: "type",
              oneOf: ["ALLY"],
            },
            cost: {
              kind: "pay-reserve",
              amount: {
                kind: "aggregate-property",
                operation: "maximum",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "element",
                        oneOf: ["FIRE"],
                      },
                    ],
                  },
                },
                property: "power",
                basis: "current",
                emptyValue: 0,
              },
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default oppressivePresence;
