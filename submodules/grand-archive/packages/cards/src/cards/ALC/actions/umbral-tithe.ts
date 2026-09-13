import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const umbralTithe: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2snsdwmxz1",
  slug: "umbral-tithe",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2snsdwmxz1:face:default",
      catalogId: "2snsdwmxz1",
      name: "Umbral Tithe",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "This card costs 1 less to activate for each Curse card in each champion's lineage. \nEach player draws two cards into their memory. Then deal 4 damage to each champion controlled by players with six or more cards in their memory.",
      abilities: [
        {
          id: "2snsdwmxz1-a1",
          kind: "card-resolution",
          text: "This card costs 1 less to activate for each Curse card in each champion's lineage.\nEach player draws two cards into their memory. Then deal 4 damage to each champion controlled by players with six or more cards in their memory.",
          activationRules: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "count",
                    collection: {
                      zones: ["inner-lineage"],
                      player: "each-player",
                      filter: {
                        kind: "subtype",
                        oneOf: ["CURSE"],
                      },
                    },
                  },
                  1,
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "each-player",
                amount: 2,
                to: "memory",
              },
              {
                kind: "for-each-player",
                players: "each-player",
                bindEachAs: "memory-threshold-player",
                effect: {
                  kind: "conditional",
                  condition: {
                    kind: "compare",
                    comparison: {
                      left: {
                        kind: "count",
                        collection: {
                          zones: ["memory"],
                          player: {
                            binding: "memory-threshold-player",
                          },
                        },
                      },
                      operator: "gte",
                      right: 6,
                    },
                  },
                  then: {
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "champion",
                      player: {
                        binding: "memory-threshold-player",
                      },
                    },
                    amount: 4,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default umbralTithe;
