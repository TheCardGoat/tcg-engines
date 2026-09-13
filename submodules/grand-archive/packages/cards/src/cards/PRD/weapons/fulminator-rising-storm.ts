import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fulminatorRisingStorm: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "F1JIgewvFI",
  slug: "fulminator-rising-storm",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "F1JIgewvFI:face:default",
      catalogId: "F1JIgewvFI",
      name: "Fulminator, Rising Storm",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "SWORD"],
      },
      elements: ["ARCANE"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "[Lorraine Bonus] Fulminator enters the field with LV-2 static counters on it. (LV refers to your champion's level. Whenever an arcane element unit deals combat damage to an object, you may remove a static counter from this weapon and deal 1 damage to the object that was dealt damage.)",
      abilities: [
        {
          id: "F1JIgewvFI-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Lorraine Bonus] Fulminator enters the field with LV-2 static counters on it. (LV refers to your champion's level. Whenever an arcane element unit deals combat damage to an object, you may remove a static counter from this weapon and deal 1 damage to the object that was dealt damage.)",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "subtract",
                operands: [
                  {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  2,
                ],
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Lorraine",
              },
            },
          ],
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "add-object-counters",
                counters: [
                  {
                    counter: "static",
                    amount: {
                      kind: "calculate",
                      operator: "subtract",
                      operands: [
                        {
                          kind: "property",
                          subject: {
                            kind: "champion",
                            player: "controller",
                          },
                          property: "level",
                          basis: "current",
                        },
                        2,
                      ],
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
      ],
    },
  },
};

export default fulminatorRisingStorm;
