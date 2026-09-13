import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const jueyingShadowmare: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "c3plbuv3fr",
  slug: "jueying-shadowmare",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "c3plbuv3fr:face:default",
      catalogId: "c3plbuv3fr",
      name: "Jueying, Shadowmare",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE", "TAMER"],
        subtypes: ["MAGE", "TAMER", "BEAST", "HORSE"],
      },
      elements: ["WATER"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "Pride 3\n\nAs long as you control a water element unique Human ally, Jueying loses pride, and has stealth and true sight.",
      abilities: [
        {
          id: "c3plbuv3fr-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 3",
          keyword: {
            name: "pride",
            value: 3,
          },
        },
        {
          id: "c3plbuv3fr-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control a water element unique Human ally, Jueying loses pride, and has stealth and true sight.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["WATER"],
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["HUMAN"],
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "remove-keyword",
                keyword: {
                  name: "pride",
                  anyValue: true,
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["WATER"],
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["HUMAN"],
                      },
                    ],
                  },
                },
              },
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
                  name: "stealth",
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["WATER"],
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["HUMAN"],
                      },
                    ],
                  },
                },
              },
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
                  name: "true-sight",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default jueyingShadowmare;
