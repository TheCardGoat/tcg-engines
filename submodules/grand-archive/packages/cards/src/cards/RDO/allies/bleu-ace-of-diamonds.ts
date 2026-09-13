import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bleuAceOfDiamonds: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k5Kid67duu",
  slug: "bleu-ace-of-diamonds",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k5Kid67duu:face:default",
      catalogId: "k5Kid67duu",
      name: "Bleu, Ace of Diamonds",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SUITED", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "On Enter: Generate up to X Bolt of Diamonds cards and put them into your memory. X is 0. Depending on the total reserve cost of Suited objects you control— \n• 6— X is 1 instead.\n• 10— X is 2 instead.\n• 21— X is 4 instead.\n\nFloating Memory",
      abilities: [
        {
          id: "k5Kid67duu-a1",
          kind: "triggered",
          text: "On Enter: Generate up to X Bolt of Diamonds cards and put them into your memory. X is 0. Depending on the total reserve cost of Suited objects you control—\n• 6— X is 1 instead.\n• 10— X is 2 instead.\n• 21— X is 4 instead.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "aggregate-property",
                      operation: "sum",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "subtype",
                          oneOf: ["SUITED"],
                        },
                      },
                      property: "reserve-cost",
                      basis: "current",
                      emptyValue: 0,
                    },
                    operator: "gte",
                    right: 21,
                  },
                },
                then: 4,
                else: {
                  kind: "conditional",
                  condition: {
                    kind: "compare",
                    comparison: {
                      left: {
                        kind: "aggregate-property",
                        operation: "sum",
                        collection: {
                          zones: ["field"],
                          player: "controller",
                          filter: {
                            kind: "subtype",
                            oneOf: ["SUITED"],
                          },
                        },
                        property: "reserve-cost",
                        basis: "current",
                        emptyValue: 0,
                      },
                      operator: "gte",
                      right: 10,
                    },
                  },
                  then: 2,
                  else: {
                    kind: "conditional",
                    condition: {
                      kind: "compare",
                      comparison: {
                        left: {
                          kind: "aggregate-property",
                          operation: "sum",
                          collection: {
                            zones: ["field"],
                            player: "controller",
                            filter: {
                              kind: "subtype",
                              oneOf: ["SUITED"],
                            },
                          },
                          property: "reserve-cost",
                          basis: "current",
                          emptyValue: 0,
                        },
                        operator: "gte",
                        right: 6,
                      },
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose-value",
                trackAs: "generated-bolt-count",
                selection: {
                  id: "generated-bolt-count",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "number",
                    minimum: 0,
                    maximum: {
                      kind: "conditional",
                      condition: {
                        kind: "compare",
                        comparison: {
                          left: {
                            kind: "aggregate-property",
                            operation: "sum",
                            collection: {
                              zones: ["field"],
                              player: "controller",
                              filter: {
                                kind: "subtype",
                                oneOf: ["SUITED"],
                              },
                            },
                            property: "reserve-cost",
                            basis: "current",
                            emptyValue: 0,
                          },
                          operator: "gte",
                          right: 21,
                        },
                      },
                      then: 4,
                      else: {
                        kind: "conditional",
                        condition: {
                          kind: "compare",
                          comparison: {
                            left: {
                              kind: "aggregate-property",
                              operation: "sum",
                              collection: {
                                zones: ["field"],
                                player: "controller",
                                filter: {
                                  kind: "subtype",
                                  oneOf: ["SUITED"],
                                },
                              },
                              property: "reserve-cost",
                              basis: "current",
                              emptyValue: 0,
                            },
                            operator: "gte",
                            right: 10,
                          },
                        },
                        then: 2,
                        else: {
                          kind: "conditional",
                          condition: {
                            kind: "compare",
                            comparison: {
                              left: {
                                kind: "aggregate-property",
                                operation: "sum",
                                collection: {
                                  zones: ["field"],
                                  player: "controller",
                                  filter: {
                                    kind: "subtype",
                                    oneOf: ["SUITED"],
                                  },
                                },
                                property: "reserve-cost",
                                basis: "current",
                                emptyValue: 0,
                              },
                              operator: "gte",
                              right: 6,
                            },
                          },
                          then: 1,
                          else: 0,
                        },
                      },
                    },
                  },
                },
              },
              {
                kind: "generate",
                card: "Bolt of Diamonds",
                player: "controller",
                destination: {
                  zone: "memory",
                },
                amount: {
                  kind: "binding",
                  binding: "generated-bolt-count",
                },
              },
            ],
          },
        },
        {
          id: "k5Kid67duu-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default bleuAceOfDiamonds;
