import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const butlersAugury: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5u5ic64930",
  slug: "butlers-augury",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5u5ic64930:face:default",
      catalogId: "5u5ic64930",
      name: "Butler's Augury",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Ciel Bonus] This card costs 1 less to activate for each of up to two omens you have. \n\nDraw X cards into your memory, where X is five minus your influence. Then deal X damage to your champion. (If X is negative, don't draw cards and don't deal damage.)",
      abilities: [
        {
          id: "5u5ic64930-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Ciel Bonus] This card costs 1 less to activate for each of up to two omens you have.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
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
              amount: {
                kind: "calculate",
                operator: "minimum",
                operands: [
                  {
                    kind: "player-property",
                    player: "controller",
                    property: "omens",
                  },
                  2,
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "5u5ic64930-a2",
          kind: "card-resolution",
          text: "Draw X cards into your memory, where X is five minus your influence. Then deal X damage to your champion. (If X is negative, don't draw cards and don't deal damage.)",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "maximum",
                operands: [
                  0,
                  {
                    kind: "calculate",
                    operator: "subtract",
                    operands: [
                      5,
                      {
                        kind: "player-property",
                        player: "controller",
                        property: "influence",
                      },
                    ],
                  },
                ],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: {
                  kind: "calculate",
                  operator: "maximum",
                  operands: [
                    0,
                    {
                      kind: "calculate",
                      operator: "subtract",
                      operands: [
                        5,
                        {
                          kind: "player-property",
                          player: "controller",
                          property: "influence",
                        },
                      ],
                    },
                  ],
                },
                to: "memory",
              },
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "champion",
                  player: "controller",
                },
                amount: {
                  kind: "calculate",
                  operator: "maximum",
                  operands: [
                    0,
                    {
                      kind: "calculate",
                      operator: "subtract",
                      operands: [
                        5,
                        {
                          kind: "player-property",
                          player: "controller",
                          property: "influence",
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default butlersAugury;
