import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfAstraeus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "B9RzxSut57",
  slug: "greater-boon-of-astraeus",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "B9RzxSut57:face:default",
      catalogId: "B9RzxSut57",
      name: "Greater Boon of Astraeus",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "This boon costs X+Y less to bestow, where X is the amount of wind element boons in your pantheon, and Y is the amount of wind element cards in your champion’s lineage.\n\nAs you gain this boon, draw a card for each of up to two times you've suppressed an object this turn.",
      abilities: [
        {
          id: "B9RzxSut57-a1",
          kind: "static",
          staticKind: "effects",
          text: "This boon costs X+Y less to bestow, where X is the amount of wind element boons in your pantheon, and Y is the amount of wind element cards in your champion’s lineage.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["pantheon"],
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["WIND"],
                  },
                },
              },
            },
            {
              symbol: "Y",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["inner-lineage"],
                  host: {
                    kind: "champion",
                    player: "controller",
                  },
                  relationship: "lineage-of",
                  filter: {
                    kind: "element",
                    oneOf: ["WIND"],
                  },
                },
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "bestow",
              subject: {
                kind: "source",
              },
              costOperation: "subtract",
              amount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  {
                    kind: "count",
                    collection: {
                      zones: ["pantheon"],
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["WIND"],
                      },
                    },
                  },
                  {
                    kind: "count",
                    collection: {
                      zones: ["inner-lineage"],
                      host: {
                        kind: "champion",
                        player: "controller",
                      },
                      relationship: "lineage-of",
                      filter: {
                        kind: "element",
                        oneOf: ["WIND"],
                      },
                    },
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
          id: "B9RzxSut57-a2",
          kind: "triggered",
          text: "As you gain this boon, draw a card for each of up to two times you've suppressed an object this turn.",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: {
              kind: "calculate",
              operator: "minimum",
              operands: [
                {
                  kind: "count",
                  collection: {
                    history: {
                      event: "keyword-action-performed",
                      window: "this-turn",
                      keywordAction: "suppress",
                    },
                  },
                },
                2,
              ],
            },
          },
        },
      ],
    },
  },
};

export default greaterBoonOfAstraeus;
