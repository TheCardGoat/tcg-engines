import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const luminescentSlash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "y8BNOi4rwD",
  slug: "luminescent-slash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "y8BNOi4rwD:face:default",
      catalogId: "y8BNOi4rwD",
      name: "Luminescent Slash",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 6,
      },
      rulesText:
        "[Mordred Bonus] This card costs 2 less to activate for each other attack card you've activated this turn.\n\n[Mordred Bonus] Luminescent Slash gets +2POWER for each other attack card you've activated this turn.",
      abilities: [
        {
          id: "y8BNOi4rwD-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Mordred Bonus] This card costs 2 less to activate for each other attack card you've activated this turn.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Mordred",
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
                    kind: "count",
                    collection: {
                      excludingSource: true,
                      filter: {
                        kind: "type",
                        oneOf: ["ATTACK"],
                      },
                      history: {
                        event: "card-activated",
                        window: "this-turn",
                      },
                    },
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
          id: "y8BNOi4rwD-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Mordred Bonus] Luminescent Slash gets +2POWER for each other attack card you've activated this turn.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Mordred",
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
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
                amount: {
                  kind: "calculate",
                  operator: "multiply",
                  operands: [
                    {
                      kind: "count",
                      collection: {
                        excludingSource: true,
                        filter: {
                          kind: "type",
                          oneOf: ["ATTACK"],
                        },
                        history: {
                          event: "card-activated",
                          window: "this-turn",
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
      ],
    },
  },
};

export default luminescentSlash;
