import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const diamondInTheRough: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hzPvtli28c",
  slug: "diamond-in-the-rough",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hzPvtli28c:face:default",
      catalogId: "hzPvtli28c",
      name: "Diamond in the Rough",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SUITED", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate for each of up to three Suited allies you control with different reserve costs.\n\nDraw a card and empower 1. Until end of turn, whenever you activate a Suited Spell card, empower 1. ",
      abilities: [
        {
          id: "hzPvtli28c-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate for each of up to three Suited allies you control with different reserve costs.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
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
                operator: "multiply",
                operands: [
                  {
                    kind: "calculate",
                    operator: "minimum",
                    operands: [
                      {
                        kind: "count",
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
                                kind: "subtype",
                                oneOf: ["SUITED"],
                              },
                            ],
                          },
                        },
                        distinctBy: "reserve-cost",
                      },
                      3,
                    ],
                  },
                  1,
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "hzPvtli28c-a2",
          kind: "card-resolution",
          text: "Draw a card and empower 1. Until end of turn, whenever you activate a Suited Spell card, empower 1.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                  },
                  {
                    kind: "keyword-action",
                    action: "empower",
                    amount: 1,
                  },
                ],
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "card-activated",
                    actor: "controller",
                    subject: {
                      kind: "event-object",
                      filter: {
                        kind: "subtype",
                        oneOf: ["SPELL"],
                      },
                    },
                  },
                },
                effect: {
                  kind: "keyword-action",
                  action: "empower",
                  amount: 1,
                },
                expires: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default diamondInTheRough;
