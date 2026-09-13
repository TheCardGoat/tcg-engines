import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const umbraSight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "f15joh300z",
  slug: "umbra-sight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "f15joh300z:face:default",
      catalogId: "f15joh300z",
      name: "Umbra Sight",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CURSE", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Draw a card.\n\nYou may draw a card into your memory and put Umbra Sight on the bottom of your champion's lineage. When you do, deal 2 unpreventable damage to your champion for each Curse card in your champion's lineage.",
      abilities: [
        {
          id: "f15joh300z-a1",
          kind: "card-resolution",
          text: "Draw a card.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "f15joh300z-a2",
          kind: "card-resolution",
          text: "You may draw a card into your memory and put Umbra Sight on the bottom of your champion's lineage. When you do, deal 2 unpreventable damage to your champion for each Curse card in your champion's lineage.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["inner-lineage"],
                  host: {
                    kind: "champion",
                    player: "controller",
                  },
                  relationship: "lineage-of",
                  filter: {
                    kind: "subtype",
                    oneOf: ["CURSE"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
                {
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  destination: {
                    zone: "inner-lineage",
                    host: {
                      kind: "champion",
                      player: "controller",
                    },
                    placement: {
                      kind: "bottom",
                    },
                  },
                },
                {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "champion",
                    player: "controller",
                  },
                  amount: {
                    kind: "calculate",
                    operator: "multiply",
                    operands: [
                      2,
                      {
                        kind: "count",
                        collection: {
                          zones: ["inner-lineage"],
                          host: {
                            kind: "champion",
                            player: "controller",
                          },
                          relationship: "lineage-of",
                          filter: {
                            kind: "subtype",
                            oneOf: ["CURSE"],
                          },
                        },
                      },
                    ],
                  },
                  preventable: false,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default umbraSight;
