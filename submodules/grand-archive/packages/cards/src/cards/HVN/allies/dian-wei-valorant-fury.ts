import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dianWeiValorantFury: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "h42l1w67ry",
  slug: "dian-wei-valorant-fury",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "h42l1w67ry:face:default",
      catalogId: "h42l1w67ry",
      name: "Dian Wei, Valorant Fury",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: For each Human ally you control, put the top card of your deck into your graveyard.\n\n[Class Bonus] Deluge 6 — As long as you have six or more water element cards in your graveyard, other Human allies you control get +1 POWER.",
      abilities: [
        {
          id: "h42l1w67ry-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: For each Human ally you control, put the top card of your deck into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
          effect: {
            kind: "repeat",
            count: {
              kind: "count",
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
                      kind: "subtype",
                      oneOf: ["HUMAN"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "mill",
              player: "controller",
              amount: 1,
            },
          },
        },
        {
          id: "h42l1w67ry-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Deluge 6 — As long as you have six or more water element cards in your graveyard, other Human allies you control get +1 POWER.",
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
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["HUMAN"],
                          },
                        ],
                      },
                      {
                        kind: "not-source",
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
                  right: 6,
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
          ],
          label: {
            name: "Deluge 6",
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

export default dianWeiValorantFury;
