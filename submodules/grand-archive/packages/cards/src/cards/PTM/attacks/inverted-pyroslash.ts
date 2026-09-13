import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const invertedPyroslash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "X5XONoPY6Z",
  slug: "inverted-pyroslash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "X5XONoPY6Z:face:default",
      catalogId: "X5XONoPY6Z",
      name: "Inverted Pyroslash",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 6,
      },
      rulesText:
        "[Ciel Bonus] This card costs 2 less to activate for each of up to two fire element omens you have.\n\nOn Attack: Deal 5 damage to the attacker.",
      abilities: [
        {
          id: "X5XONoPY6Z-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Ciel Bonus] This card costs 2 less to activate for each of up to two fire element omens you have.",
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
                operator: "multiply",
                operands: [
                  {
                    kind: "calculate",
                    operator: "minimum",
                    operands: [
                      {
                        kind: "count",
                        collection: {
                          zones: ["banishment"],
                          player: "controller",
                          filter: {
                            kind: "all",
                            filters: [
                              {
                                kind: "has-counter",
                                counter: "omen",
                              },
                              {
                                kind: "element",
                                oneOf: ["FIRE"],
                              },
                            ],
                          },
                        },
                      },
                      2,
                    ],
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
          id: "X5XONoPY6Z-a2",
          kind: "triggered",
          text: "On Attack: Deal 5 damage to the attacker.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "event-attacker",
            },
            amount: 5,
          },
        },
      ],
    },
  },
};

export default invertedPyroslash;
