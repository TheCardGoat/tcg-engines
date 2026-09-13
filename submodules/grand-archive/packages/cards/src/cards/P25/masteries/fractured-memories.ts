import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fracturedMemories: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "mastery-representation"
> = {
  canonicalId: "UAJGQFbXjs",
  slug: "fractured-memories",
  definitionKind: "mastery-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "UAJGQFbXjs:face:default",
      catalogId: "UAJGQFbXjs",
      name: "Fractured Memories",
      cost: {
        kind: "none",
      },
      typeLine: {
        supertypes: [],
        types: ["MASTERY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: [],
      stats: {},
      rulesText:
        '[Merlin Bonus] Your champion has "On Ally Kill: Put X sheen counters onto your Fractured Memories, where X is the amount of sheen counters that were on the killed ally."\n\n[Merlin Bonus]Your champion has "On Champion Hit: You may move all sheen counters on the hit champion to your Fractured Memories. When three or more counters are moved this way, deal 3 damage to that champion."',
      abilities: [
        {
          id: "UAJGQFbXjs-a1",
          kind: "static",
          staticKind: "effects",
          text: '[Merlin Bonus] Your champion has "On Ally Kill: Put X sheen counters onto your Fractured Memories, where X is the amount of sheen counters that were on the killed ally."',
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "UAJGQFbXjs-a10000",
                  kind: "triggered",
                  text: "On Ally Kill: Put X sheen counters onto your Fractured Memories, where X is the amount of sheen counters that were on the killed ally.",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "object-killed",
                      subject: {
                        kind: "ability-bearer",
                      },
                      recipient: {
                        kind: "event-object",
                        filter: {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                      },
                    },
                  },
                  variables: [
                    {
                      symbol: "X",
                      kind: "derived",
                      amount: {
                        kind: "counter-count",
                        subject: {
                          kind: "event-recipient",
                        },
                        counter: {
                          named: "sheen",
                        },
                        basis: "last-known",
                        missing: "zero",
                      },
                    },
                  ],
                  effect: {
                    kind: "add-counter",
                    subject: {
                      kind: "mastery",
                      player: "controller",
                      name: "Fractured Memories",
                    },
                    counter: {
                      named: "sheen",
                    },
                    amount: {
                      kind: "counter-count",
                      subject: {
                        kind: "event-recipient",
                      },
                      counter: {
                        named: "sheen",
                      },
                      basis: "last-known",
                      missing: "zero",
                    },
                  },
                },
              },
            },
          ],
        },
        {
          id: "UAJGQFbXjs-a2",
          kind: "static",
          staticKind: "effects",
          text: '[Merlin Bonus]Your champion has "On Champion Hit: You may move all sheen counters on the hit champion to your Fractured Memories. When three or more counters are moved this way, deal 3 damage to that champion."',
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "UAJGQFbXjs-a11001",
                  kind: "triggered",
                  text: "On Champion Hit: You may move all sheen counters on the hit champion to your Fractured Memories. When three or more counters are moved this way, deal 3 damage to that champion.",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "attack-hit",
                      subject: {
                        kind: "ability-bearer",
                      },
                      recipient: {
                        kind: "event-object",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                    },
                  },
                  effect: {
                    kind: "optional",
                    player: "controller",
                    allOrNothing: true,
                    effect: {
                      kind: "reflexive",
                      action: {
                        kind: "move-counter",
                        from: {
                          kind: "event-recipient",
                        },
                        to: {
                          kind: "mastery",
                          player: "controller",
                          name: "Fractured Memories",
                        },
                        counter: {
                          named: "sheen",
                        },
                        amount: {
                          kind: "all",
                        },
                        bindResultAs: "moved-sheen-count",
                      },
                      consequence: {
                        kind: "conditional",
                        condition: {
                          kind: "compare",
                          comparison: {
                            left: {
                              kind: "binding",
                              binding: "moved-sheen-count",
                            },
                            operator: "gte",
                            right: 3,
                          },
                        },
                        then: {
                          kind: "deal-damage",
                          source: {
                            kind: "ability-bearer",
                          },
                          recipient: {
                            kind: "event-recipient",
                          },
                          amount: 3,
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default fracturedMemories;
