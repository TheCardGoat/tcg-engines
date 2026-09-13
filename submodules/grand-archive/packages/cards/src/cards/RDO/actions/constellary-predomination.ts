import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const constellaryPredomination: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Z1L77xhMcC",
  slug: "constellary-predomination",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Z1L77xhMcC:face:default",
      catalogId: "Z1L77xhMcC",
      name: "Constellary Predomination",
      cost: {
        kind: "reserve",
        amount: 8,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ULTIMATE", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "slow",
      stats: {},
      rulesText:
        '[Diana Bonus] Glimpse 8. For the rest of the game, your champion has "On Attack: If there are three or more cards in the attacker\'s intent, wake up the attacker and glimpse 4."',
      abilities: [
        {
          id: "Z1L77xhMcC-a1",
          kind: "card-resolution",
          text: '[Diana Bonus] Glimpse 8. For the rest of the game, your champion has "On Attack: If there are three or more cards in the attacker\'s intent, wake up the attacker and glimpse 4."',
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diana",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                player: "controller",
                amount: 8,
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "champion",
                  player: "controller",
                },
                affectedSet: "dynamic",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-ability",
                  ability: {
                    id: "granted-x3kbcx-a1",
                    kind: "triggered",
                    text: "On Attack: If there are three or more cards in the attacker's intent, wake up the attacker and glimpse 4.",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "attack-declared",
                        subject: {
                          kind: "ability-bearer",
                        },
                      },
                    },
                    interveningCondition: {
                      kind: "compare",
                      comparison: {
                        left: {
                          kind: "count",
                          collection: {
                            zones: ["intent"],
                            host: {
                              kind: "event-attacker",
                            },
                            relationship: "intent-of",
                          },
                        },
                        operator: "gte",
                        right: 3,
                      },
                    },
                    effect: {
                      kind: "sequence",
                      effects: [
                        {
                          kind: "wake",
                          subject: {
                            kind: "event-attacker",
                          },
                        },
                        {
                          kind: "keyword-action",
                          action: "glimpse",
                          player: "controller",
                          amount: 4,
                        },
                      ],
                    },
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

export default constellaryPredomination;
