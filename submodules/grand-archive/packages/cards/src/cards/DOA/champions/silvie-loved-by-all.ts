import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const silvieLovedByAll: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GKEpAulogu",
  slug: "silvie-loved-by-all",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "GKEpAulogu:face:default",
      catalogId: "GKEpAulogu",
      name: "Silvie, Loved by All",
      lineageName: "Silvie",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["TERA"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        'Silvie Lineage (Silvie, Loved by All must be leveled from a previous level "Silvie" champion.)\n\nAnimal and Beast allies you control get +1 LIFE and have intercept.',
      abilities: [
        {
          id: "GKEpAulogu-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Silvie Lineage (Silvie, Loved by All must be leveled from a previous level "Silvie" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Silvie",
          },
        },
        {
          id: "GKEpAulogu-a2",
          kind: "static",
          staticKind: "effects",
          text: "Animal and Beast allies you control get +1 LIFE and have intercept.",
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
                        kind: "any",
                        filters: [
                          {
                            kind: "subtype",
                            oneOf: ["ANIMAL"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["BEAST"],
                          },
                        ],
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
                        kind: "any",
                        filters: [
                          {
                            kind: "subtype",
                            oneOf: ["ANIMAL"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["BEAST"],
                          },
                        ],
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
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "intercept",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default silvieLovedByAll;
