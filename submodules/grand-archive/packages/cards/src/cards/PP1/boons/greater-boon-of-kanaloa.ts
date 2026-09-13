import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfKanaloa: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xqkjh2YMT1",
  slug: "greater-boon-of-kanaloa",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "xqkjh2YMT1:face:default",
      catalogId: "xqkjh2YMT1",
      name: "Greater Boon of Kanaloa",
      cost: {
        kind: "reserve",
        amount: 16,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "Level Locked 2\n\nThis card costs 4 less to bestow for each graveyard with eight or more cards in it.\n\nAt the beginning of your end phase, recover 2.\n\nWater element allies you control get +1POWER and +1LIFE, and have intercept and vigor.",
      abilities: [
        {
          id: "xqkjh2YMT1-a1",
          kind: "static",
          staticKind: "effects",
          text: "Level Locked 2",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "base",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "xqkjh2YMT1-a2",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 4 less to bestow for each graveyard with eight or more cards in it.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "bestow",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "player-zone-count",
                    players: "each-player",
                    zone: "graveyard",
                    comparison: {
                      operator: "gte",
                      value: 8,
                    },
                  },
                  4,
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "xqkjh2YMT1-a3",
          kind: "triggered",
          text: "At the beginning of your end phase, recover 2.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "recover",
            player: "controller",
            amount: 2,
          },
        },
        {
          id: "xqkjh2YMT1-a4",
          kind: "static",
          staticKind: "effects",
          text: "Water element allies you control get +1POWER and +1LIFE, and have intercept and vigor.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["WATER"],
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 1,
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["WATER"],
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "add",
                amount: 1,
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["WATER"],
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "intercept",
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["WATER"],
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "vigor",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default greaterBoonOfKanaloa;
