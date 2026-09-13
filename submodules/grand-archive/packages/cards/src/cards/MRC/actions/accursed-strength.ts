import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const accursedStrength: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "j3fkza233s",
  slug: "accursed-strength",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "j3fkza233s:face:default",
      catalogId: "j3fkza233s",
      name: "Accursed Strength",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Diana Bonus] This card costs 1 less to activate.\n\nDraw 3+X cards, where X is the amount of Curse cards in your champion's lineage minus your influence. (If the amount of cards you would draw is negative, don't draw any cards.)",
      abilities: [
        {
          id: "j3fkza233s-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Diana Bonus] This card costs 1 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diana",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "j3fkza233s-a2",
          kind: "card-resolution",
          text: "Draw 3+X cards, where X is the amount of Curse cards in your champion's lineage minus your influence. (If the amount of cards you would draw is negative, don't draw any cards.)",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "subtract",
                operands: [
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
                        kind: "subtype",
                        oneOf: ["CURSE"],
                      },
                    },
                  },
                  {
                    kind: "player-property",
                    player: "controller",
                    property: "influence",
                  },
                ],
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: {
              kind: "calculate",
              operator: "maximum",
              operands: [
                0,
                {
                  kind: "calculate",
                  operator: "add",
                  operands: [
                    3,
                    {
                      kind: "calculate",
                      operator: "subtract",
                      operands: [
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
                              kind: "subtype",
                              oneOf: ["CURSE"],
                            },
                          },
                        },
                        {
                          kind: "player-property",
                          player: "controller",
                          property: "influence",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default accursedStrength;
