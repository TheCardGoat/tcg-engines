import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const overchargedDroid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hAAokl4hnU",
  slug: "overcharged-droid",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hAAokl4hnU:face:default",
      catalogId: "hAAokl4hnU",
      name: "Overcharged Droid",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "DISCORP", "AUTOMATON", "WOLF"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "As long as you control two or more Powercell items, Overcharged Droid gets +1POWER and +1LIFE.",
      abilities: [
        {
          id: "hAAokl4hnU-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control two or more Powercell items, Overcharged Droid gets +1POWER and +1LIFE.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ITEM"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["POWERCELL"],
                          },
                        ],
                      },
                    },
                  },
                  operator: "gte",
                  right: 2,
                },
              },
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
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ITEM"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["POWERCELL"],
                          },
                        ],
                      },
                    },
                  },
                  operator: "gte",
                  right: 2,
                },
              },
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

export default overchargedDroid;
