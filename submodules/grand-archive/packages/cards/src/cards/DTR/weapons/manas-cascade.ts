import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const manasCascade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xywyzv14iv",
  slug: "manas-cascade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xywyzv14iv:face:default",
      catalogId: "xywyzv14iv",
      name: "Mana's Cascade",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERWING"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "[Diana Bonus] On Attack: If there are two or more water element Aethercharge cards in the attacker's intent, this attack gets +1POWER and gains ”On Champion Hit: That opponent banishes a card at random from their memory.”",
      abilities: [
        {
          id: "xywyzv14iv-a1",
          kind: "triggered",
          text: "[Diana Bonus] On Attack: If there are two or more water element Aethercharge cards in the attacker's intent, this attack gets +1POWER and gains ”On Champion Hit: That opponent banishes a card at random from their memory.”",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
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
            kind: "conditional",
            condition: {
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
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "element",
                          oneOf: ["WATER"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["AETHERCHARGE"],
                        },
                      ],
                    },
                  },
                },
                operator: "gte",
                right: 2,
              },
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
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
                {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-ability",
                    ability: {
                      id: "granted-ncendf-a1",
                      kind: "triggered",
                      text: "On Champion Hit: That opponent banishes a card at random from their memory.",
                      trigger: {
                        kind: "event",
                        event: {
                          name: "attack-hit",
                          subject: {
                            kind: "source",
                          },
                          recipient: {
                            kind: "event-object",
                            bindAs: "trigger-recipient",
                            filter: {
                              kind: "type",
                              oneOf: ["CHAMPION"],
                            },
                          },
                        },
                      },
                      effect: {
                        kind: "banish",
                        player: "event-recipient-controller",
                        selection: {
                          id: "banished-cards",
                          kind: "choice",
                          declared: "resolution",
                          chooser: "event-recipient-controller",
                          count: {
                            kind: "exactly",
                            amount: 1,
                          },
                          candidates: {
                            kind: "card",
                            zones: ["memory"],
                            relationship: "zone-of",
                            player: "event-recipient-controller",
                          },
                          method: "random",
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default manasCascade;
