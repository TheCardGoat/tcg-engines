import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const theMajesticSpirit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tsvbgl6ffq",
  slug: "the-majestic-spirit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tsvbgl6ffq:face:default",
      catalogId: "tsvbgl6ffq",
      name: "The Majestic Spirit",
      cost: {
        kind: "memory",
        amount: 12,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "BEAST", "AVATAR"],
      },
      elements: ["CRUX"],
      stats: {
        power: 4,
        life: 10,
      },
      rulesText:
        "Intercept, True Sight, Vigor\n\nChampions you control have spellshroud.\n\nIf another crux element unit you control would take damage, prevent half of that damage, rounded up.",
      abilities: [
        {
          id: "tsvbgl6ffq-a1",
          kind: "keyword-group",
          text: "Intercept, True Sight, Vigor",
          keywords: [
            {
              name: "intercept",
            },
            {
              name: "true-sight",
            },
            {
              name: "vigor",
            },
          ],
        },
        {
          id: "tsvbgl6ffq-a2",
          kind: "static",
          staticKind: "effects",
          text: "Champions you control have spellshroud.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
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
                  name: "spellshroud",
                },
              },
            },
          ],
        },
        {
          id: "tsvbgl6ffq-a3",
          kind: "static",
          staticKind: "effects",
          text: "If another crux element unit you control would take damage, prevent half of that damage, rounded up.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "all",
                        filters: [
                          {
                            kind: "element",
                            oneOf: ["CRUX"],
                          },
                          {
                            kind: "type",
                            oneOf: ["ALLY", "CHAMPION"],
                          },
                        ],
                      },
                      {
                        kind: "not-source",
                      },
                    ],
                  },
                },
              },
              operation: {
                kind: "prevent",
                amount: {
                  kind: "calculate",
                  operator: "divide",
                  operands: [
                    {
                      kind: "event-amount",
                    },
                    2,
                  ],
                  rounding: "up",
                },
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
      ],
    },
  },
};

export default theMajesticSpirit;
