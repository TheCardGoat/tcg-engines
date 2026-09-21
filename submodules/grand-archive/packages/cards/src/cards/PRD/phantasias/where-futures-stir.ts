import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const whereFuturesStir: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jmaPje9XgG",
  slug: "where-futures-stir",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jmaPje9XgG:face:default",
      catalogId: "jmaPje9XgG",
      name: "Where Futures Stir",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "TRIAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "At the beginning of your end phase, you may rest an ally you control with base power 0. If you do, put a training counter on Where Futures Stir.\n\n(2), Sacrifice Where Futures Stir: Draw two cards. Activate this ability only if there are three or more training counters on Where Futures Stir.",
      abilities: [
        {
          id: "jmaPje9XgG-a1",
          kind: "triggered",
          text: "At the beginning of your end phase, you may rest an ally you control with base power 0. If you do, put a training counter on Where Futures Stir.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "choose",
                    selection: {
                      id: "chosen-controlled-object",
                      kind: "choice",
                      declared: "resolution",
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
                          kind: "all",
                          filters: [
                            {
                              kind: "type",
                              oneOf: ["ALLY"],
                            },
                            {
                              kind: "numeric",
                              comparison: {
                                left: {
                                  kind: "property",
                                  subject: {
                                    kind: "candidate",
                                  },
                                  property: "power",
                                  basis: "base",
                                },
                                operator: "eq",
                                right: 0,
                              },
                            },
                          ],
                        },
                        relationship: "controlled-by",
                        player: "controller",
                      },
                    },
                    effect: {
                      kind: "rest",
                      subject: {
                        kind: "bound",
                        binding: "chosen-controlled-object",
                      },
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "add-counter",
                    subject: {
                      kind: "source",
                    },
                    counter: {
                      named: "training",
                    },
                    amount: 1,
                  },
                },
              ],
            },
          },
        },
        {
          id: "jmaPje9XgG-a2",
          kind: "activated",
          text: "(2), Sacrifice Where Futures Stir: Draw two cards. Activate this ability only if there are three or more training counters on Where Futures Stir.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "training",
                },
              },
              operator: "gte",
              right: 3,
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default whereFuturesStir;
