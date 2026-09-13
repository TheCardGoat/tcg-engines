import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const miasmicFog: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OwhKGEMTXm",
  slug: "miasmic-fog",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "OwhKGEMTXm:face:default",
      catalogId: "OwhKGEMTXm",
      name: "Miasmic Fog",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText: "All allies get -1LIFE.",
      abilities: [
        {
          id: "OwhKGEMTXm-a1",
          kind: "static",
          staticKind: "effects",
          text: "All allies get -1LIFE.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
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
                operation: "subtract",
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default miasmicFog;
