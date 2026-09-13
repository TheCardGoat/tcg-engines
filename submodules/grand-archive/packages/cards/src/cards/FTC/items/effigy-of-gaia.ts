import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const effigyOfGaia: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "akb1k0zi5h",
  slug: "effigy-of-gaia",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "akb1k0zi5h:face:default",
      catalogId: "akb1k0zi5h",
      name: "Effigy of Gaia",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BAUBLE"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "[Class Bonus] Your champion gets +1 level as long as you control an Animal or Beast ally.\n\nWhenever an opponent activates an attack card with cleave, Animal and Beast allies you control get +2 LIFE until end of turn. ",
      abilities: [
        {
          id: "akb1k0zi5h-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Your champion gets +1 level as long as you control an Animal or Beast ally.",
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
        {
          id: "akb1k0zi5h-a2",
          kind: "triggered",
          text: "Whenever an opponent activates an attack card with cleave, Animal and Beast allies you control get +2 LIFE until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "opponent",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ATTACK"],
                },
              },
            },
          },
          effect: {
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
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
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
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default effigyOfGaia;
