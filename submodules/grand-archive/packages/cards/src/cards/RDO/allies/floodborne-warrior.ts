import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const floodborneWarrior: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "KFfmJZMdZN",
  slug: "floodborne-warrior",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "KFfmJZMdZN:face:default",
      catalogId: "KFfmJZMdZN",
      name: "Floodborne Warrior",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Deluge 2 — As long as you have two or more water element cards in your graveyard, Floodborne Warrior gets +1POWER and +1LIFE.",
      abilities: [
        {
          id: "KFfmJZMdZN-a1",
          kind: "static",
          staticKind: "effects",
          text: "Deluge 2 — As long as you have two or more water element cards in your graveyard, Floodborne Warrior gets +1POWER and +1LIFE.",
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
                      zones: ["graveyard"],
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["WATER"],
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
                      zones: ["graveyard"],
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["WATER"],
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
          label: {
            name: "Deluge 2",
          },
        },
      ],
    },
  },
};

export default floodborneWarrior;
