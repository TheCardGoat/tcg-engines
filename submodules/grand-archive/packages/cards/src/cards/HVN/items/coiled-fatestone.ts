import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const coiledFatestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ulh4lplwqe",
  slug: "coiled-fatestone",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "ulh4lplwqe:face:default",
      catalogId: "ulh4lplwqe",
      name: "Coiled Fatestone",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "On Enter: Discard two cards at random. For each fire element card discarded this way, draw a card.\n\n[Guo Jia Bonus] REST, (1): As a Spell, deal 1 damage to each champion. Put an age counter on Coiled Fatestone. Then if there are three or more age counters on Coiled Fatestone, remove all of them and transform Coiled Fatestone. ",
      abilities: [
        {
          id: "ulh4lplwqe-a1",
          kind: "triggered",
          text: "On Enter: Discard two cards at random. For each fire element card discarded this way, draw a card.",
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
            kind: "sequence",
            effects: [
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "discarded-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 2,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                  method: "random",
                },
              },
              {
                kind: "for-each",
                collection: {
                  binding: "discarded-card",
                  filter: {
                    kind: "element",
                    oneOf: ["FIRE"],
                  },
                },
                bindEachAs: "that-card",
                effect: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
            ],
          },
        },
        {
          id: "ulh4lplwqe-a2",
          kind: "activated",
          text: "[Guo Jia Bonus] REST, (1): As a Spell, deal 1 damage to each champion. Put an age counter on Coiled Fatestone. Then if there are three or more age counters on Coiled Fatestone, remove all of them and transform Coiled Fatestone.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "pay-reserve",
                amount: 1,
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "perform-as",
                sourceKind: "spell",
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "deal-damage",
                      source: {
                        kind: "source",
                      },
                      recipient: {
                        kind: "each",
                        collection: {
                          zones: ["field"],
                          filter: {
                            kind: "type",
                            oneOf: ["CHAMPION"],
                          },
                        },
                      },
                      amount: 1,
                    },
                    {
                      kind: "add-counter",
                      subject: {
                        kind: "source",
                      },
                      counter: {
                        named: "age",
                      },
                      amount: 1,
                    },
                  ],
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "counter-count",
                      subject: {
                        kind: "source",
                      },
                      counter: {
                        named: "age",
                      },
                    },
                    operator: "gte",
                    right: 3,
                  },
                },
                then: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "remove-counter",
                      subject: {
                        kind: "source",
                      },
                      counter: {
                        named: "age",
                      },
                      amount: {
                        kind: "all",
                      },
                    },
                    {
                      kind: "transform",
                      subject: {
                        kind: "source",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
    flipFace: {
      id: "ulh4lplwqe:face:flip",
      catalogId: "emszllu6dm",
      name: "Serpentine Judicator",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "SNAKE"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText: "Your opponents can't recover.",
      abilities: [
        {
          id: "emszllu6dm-a1",
          kind: "static",
          staticKind: "effects",
          text: "Your opponents can't recover.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "recover",
              subject: {
                kind: "player",
                player: "opponent",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default coiledFatestone;
