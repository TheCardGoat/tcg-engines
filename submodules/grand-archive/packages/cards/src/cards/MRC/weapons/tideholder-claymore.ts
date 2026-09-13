import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tideholderClaymore: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5iqigcom2r",
  slug: "tideholder-claymore",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5iqigcom2r:face:default",
      catalogId: "5iqigcom2r",
      name: "Tideholder Claymore",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 5,
        durability: 3,
      },
      rulesText:
        "[Class Bonus] This card costs 1 less to materialize.\n\nAs an additional cost to use this weapon for an attack, pay (10), reduced by (1) for each water element card in your graveyard.",
      abilities: [
        {
          id: "5iqigcom2r-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to materialize.",
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
              action: "materialize",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "5iqigcom2r-a2",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to use this weapon for an attack, pay (10), reduced by (1) for each water element card in your graveyard.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "use-weapon-for-attack",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "pay-reserve",
                amount: {
                  kind: "calculate",
                  operator: "maximum",
                  operands: [
                    {
                      kind: "calculate",
                      operator: "subtract",
                      operands: [
                        10,
                        {
                          kind: "calculate",
                          operator: "multiply",
                          operands: [
                            {
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
                            1,
                          ],
                        },
                      ],
                    },
                    0,
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default tideholderClaymore;
