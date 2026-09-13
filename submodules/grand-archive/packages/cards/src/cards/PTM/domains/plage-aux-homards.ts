import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const plageAuxHomards: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "s25QNTvfem",
  slug: "plage-aux-homards",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "s25QNTvfem:face:default",
      catalogId: "s25QNTvfem",
      name: "Plage aux Homards",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SIEGEABLE", "OCEAN"],
      },
      elements: ["WATER"],
      stats: {
        durability: 4,
      },
      rulesText:
        "On Enter: Put the top two cards of your deck into your graveyard.\n\n[Class Bonus] Deluge 4 — As long as you have four or more water element cards in your graveyard, Animal and Beast allies you control get +1 LIFE.",
      abilities: [
        {
          id: "s25QNTvfem-a1",
          kind: "triggered",
          text: "On Enter: Put the top two cards of your deck into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "mill",
            player: "controller",
            amount: 2,
          },
        },
        {
          id: "s25QNTvfem-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Deluge 4 — As long as you have four or more water element cards in your graveyard, Animal and Beast allies you control get +1 LIFE.",
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
                  right: 4,
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
            name: "Deluge 4",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default plageAuxHomards;
