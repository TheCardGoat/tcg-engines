import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const guardedDissipation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "r5zs29xxoo",
  slug: "guarded-dissipation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "r5zs29xxoo:face:default",
      catalogId: "r5zs29xxoo",
      name: "Guarded Dissipation",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prevent the next X damage that would be dealt to target unit this turn where X is the greatest power among Sword weapons you control. \n\n[Level 1+] Draw a card.",
      abilities: [
        {
          id: "r5zs29xxoo-a1",
          kind: "card-resolution",
          text: "Prevent the next X damage that would be dealt to target unit this turn where X is the greatest power among Sword weapons you control.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "aggregate-property",
                operation: "maximum",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["WEAPON"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SWORD"],
                      },
                    ],
                  },
                },
                property: "power",
                basis: "current",
                emptyValue: 0,
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: {
                kind: "variable",
                symbol: "X",
              },
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "r5zs29xxoo-a2",
          kind: "card-resolution",
          text: "[Level 1+] Draw a card.",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 1,
                },
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default guardedDissipation;
