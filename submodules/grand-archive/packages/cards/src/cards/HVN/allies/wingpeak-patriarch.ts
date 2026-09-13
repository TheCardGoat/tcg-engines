import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wingpeakPatriarch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wov58exji1",
  slug: "wingpeak-patriarch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wov58exji1:face:default",
      catalogId: "wov58exji1",
      name: "Wingpeak Patriarch",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "BIRD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText: "Other Bird objects you control get +1 POWER.",
      abilities: [
        {
          id: "wov58exji1-a1",
          kind: "static",
          staticKind: "effects",
          text: "Other Bird objects you control get +1 POWER.",
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
                        kind: "subtype",
                        oneOf: ["BIRD"],
                      },
                      {
                        kind: "not-source",
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
          ],
        },
      ],
    },
  },
};

export default wingpeakPatriarch;
