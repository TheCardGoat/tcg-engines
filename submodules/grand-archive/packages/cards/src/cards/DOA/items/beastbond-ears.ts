import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const beastbondEars: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "JPcFmCpdiF",
  slug: "beastbond-ears",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "JPcFmCpdiF:face:default",
      catalogId: "JPcFmCpdiF",
      name: "Beastbond Ears",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "Your champion gets +1 level as long as you control an Animal or Beast ally.",
      abilities: [
        {
          id: "JPcFmCpdiF-a1",
          kind: "static",
          staticKind: "effects",
          text: "Your champion gets +1 level as long as you control an Animal or Beast ally.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
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
                property: "level",
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

export default beastbondEars;
