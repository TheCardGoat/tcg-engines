import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const luBuIndomitableTitan: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xyan7zbtxi",
  slug: "lu-bu-indomitable-titan",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "xyan7zbtxi:face:default",
      catalogId: "xyan7zbtxi",
      name: "Lu Bu, Indomitable Titan",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["TERA"],
      stats: {
        power: 4,
        life: 4,
      },
      rulesText:
        "Taunt, Vigor\n\nOn Attack: If this is Lu Bu's first attack this turn, you may pay (2). If you do, wake up Lu Bu.\n \n[Diao Chan Bonus] If your champion would die with exactly thirty-two damage counters on them, banish them, transform Lu Bu, and destroy all other objects you control instead.",
      abilities: [
        {
          id: "xyan7zbtxi-a1",
          kind: "keyword-group",
          text: "Taunt, Vigor",
          keywords: [
            {
              name: "taunt",
            },
            {
              name: "vigor",
            },
          ],
        },
        {
          id: "xyan7zbtxi-a2",
          kind: "triggered",
          text: "On Attack: If this is Lu Bu's first attack this turn, you may pay (2). If you do, wake up Lu Bu.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
              occurrence: {
                count: 1,
                window: "this-turn",
                actorScope: "same-player",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "pay",
              player: "controller",
              cost: {
                kind: "pay-reserve",
                amount: 2,
              },
              then: {
                kind: "wake",
                subject: {
                  kind: "source",
                },
              },
            },
          },
        },
        {
          id: "xyan7zbtxi-a3",
          kind: "static",
          staticKind: "effects",
          text: "[Diao Chan Bonus] If your champion would die with exactly thirty-two damage counters on them, banish them, transform Lu Bu, and destroy all other objects you control instead.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-died",
                subject: {
                  kind: "event-object",
                  controller: "controller",
                  bindAs: "dying-champion",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "bound",
                  binding: "dying-champion",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "bound",
                      binding: "dying-champion",
                    },
                    counter: "damage",
                  },
                  operator: "eq",
                  right: 32,
                },
              },
              operation: {
                kind: "replace-with",
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "banish-object",
                      subject: {
                        kind: "bound",
                        binding: "dying-champion",
                      },
                    },
                    {
                      kind: "transform",
                      subject: {
                        kind: "source",
                      },
                    },
                    {
                      kind: "destroy",
                      subject: {
                        kind: "each",
                        collection: {
                          zones: ["field"],
                          player: "controller",
                          filter: {
                            kind: "not-source",
                          },
                        },
                      },
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
    flipFace: {
      id: "xyan7zbtxi:face:flip",
      catalogId: "1hlxj4rywq",
      name: "Lu Bu, Wrath Incarnate",
      lineageName: "Lu Bu",
      cost: {
        kind: "memory",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        level: 4,
        power: 8,
        life: 32,
      },
      rulesText:
        "Vigor\n\nOther champions get -3 level and all allies get -3 POWER.\n\nOn Ally Kill: Deal X unpreventable damage to each other champion where X is the killed ally's power stat plus its life stat.",
      abilities: [
        {
          id: "1hlxj4rywq-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Vigor",
          keyword: {
            name: "vigor",
          },
        },
        {
          id: "1hlxj4rywq-a2",
          kind: "static",
          staticKind: "effects",
          text: "Other champions get -3 level and all allies get -3 POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
                      {
                        kind: "not-source",
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
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
                operation: "subtract",
                amount: 3,
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              affectedSet: "dynamic",
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
                operation: "subtract",
                amount: 3,
              },
            },
          ],
        },
        {
          id: "1hlxj4rywq-a3",
          kind: "triggered",
          text: "On Ally Kill: Deal X unpreventable damage to each other champion where X is the killed ally's power stat plus its life stat.",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
            amount: {
              kind: "variable",
              symbol: "X",
            },
            preventable: false,
          },
        },
      ],
    },
  },
};

export default luBuIndomitableTitan;
