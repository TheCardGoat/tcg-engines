import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const towerOfDis: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "I46x6lgLk8",
  slug: "tower-of-dis",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "I46x6lgLk8:face:default",
      catalogId: "I46x6lgLk8",
      name: "Tower of Dis",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SIEGEABLE", "DISCORP", "SPIRE"],
      },
      elements: ["NORM"],
      stats: {
        durability: 4,
      },
      rulesText:
        "(Siegeable — This domain can be attacked. It takes damage in the form of removing durability counters.)\n\nDisCorp Automaton allies you control get +1POWER and +1LIFE.",
      abilities: [
        {
          id: "I46x6lgLk8-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Siegeable — This domain can be attacked. It takes damage in the form of removing durability counters.)",
          keyword: {
            name: "siegeable",
          },
        },
        {
          id: "I46x6lgLk8-a2",
          kind: "static",
          staticKind: "effects",
          text: "DisCorp Automaton allies you control get +1POWER and +1LIFE.",
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
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["AUTOMATON"],
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
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["AUTOMATON"],
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
          ],
        },
      ],
    },
  },
};

export default towerOfDis;
