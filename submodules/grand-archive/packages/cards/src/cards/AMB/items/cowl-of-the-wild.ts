import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cowlOfTheWild: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "t203gysyp8",
  slug: "cowl-of-the-wild",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "t203gysyp8:face:default",
      catalogId: "t203gysyp8",
      name: "Cowl of the Wild",
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
      rulesText:
        "As long as you control one or more non-Human Tamer allies, your champion gets +1 level.",
      abilities: [
        {
          id: "t203gysyp8-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control one or more non-Human Tamer allies, your champion gets +1 level.",
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
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "not",
                        filter: {
                          kind: "subtype",
                          oneOf: ["HUMAN"],
                        },
                      },
                      {
                        kind: "subtype",
                        oneOf: ["TAMER"],
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

export default cowlOfTheWild;
