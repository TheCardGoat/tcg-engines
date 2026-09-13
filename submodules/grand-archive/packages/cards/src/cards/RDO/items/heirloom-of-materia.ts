import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const heirloomOfMateria: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sZlDgmVTD7",
  slug: "heirloom-of-materia",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sZlDgmVTD7:face:default",
      catalogId: "sZlDgmVTD7",
      name: "Heirloom of Materia",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {},
      rulesText:
        "Banish Heirloom of Materia: Choose one—\n• Remove all damage counters from target champion you don’t control. Return those counters onto that champion at the beginning of your next turn.\n• For each opponent, for every two token objects they control, they sacrifice one.\n\n(3), Banish Heirloom of Materia: Draw a card into your memory.",
      abilities: [
        {
          id: "sZlDgmVTD7-a1",
          kind: "activated",
          text: "Banish Heirloom of Materia: Choose one—\n• Remove all damage counters from target champion you don’t control. Return those counters onto that champion at the beginning of your next turn.\n• For each opponent, for every two token objects they control, they sacrifice one.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "delay-damage",
                text: "Remove all damage counters from target champion you don’t control. Return those counters onto that champion at the beginning of your next turn.",
                targets: [
                  {
                    id: "target-champion",
                    kind: "target",
                    declared: "announcement",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      relationship: "controlled-by",
                      player: "opponent",
                      filter: {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
                    },
                  },
                ],
                variables: [
                  {
                    symbol: "X",
                    kind: "derived",
                    amount: {
                      kind: "binding",
                      binding: "removed-damage-count",
                    },
                  },
                ],
                effect: {
                  kind: "bind-value",
                  value: {
                    kind: "counter-count",
                    subject: {
                      kind: "bound",
                      binding: "target-champion",
                    },
                    counter: "damage",
                  },
                  bindAs: "removed-damage-count",
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "remove-counter",
                        subject: {
                          kind: "bound",
                          binding: "target-champion",
                        },
                        counter: "damage",
                        amount: {
                          kind: "binding",
                          binding: "removed-damage-count",
                        },
                      },
                      {
                        kind: "create-delayed-trigger",
                        trigger: {
                          kind: "event",
                          event: {
                            name: "turn-begins",
                            actor: "controller",
                          },
                        },
                        starts: {
                          kind: "next-turn",
                          whose: "controller",
                        },
                        limit: 1,
                        effect: {
                          kind: "add-counter",
                          subject: {
                            kind: "bound",
                            binding: "target-champion",
                          },
                          counter: "damage",
                          amount: {
                            kind: "binding",
                            binding: "removed-damage-count",
                          },
                        },
                      },
                    ],
                  },
                },
              },
              {
                id: "sacrifice-tokens",
                text: "For each opponent, for every two token objects they control, they sacrifice one.",
                effect: {
                  kind: "for-each-player",
                  players: "each-opponent",
                  bindEachAs: "affected-opponent",
                  effect: {
                    kind: "choose",
                    selection: {
                      id: "sacrificed-tokens",
                      kind: "choice",
                      declared: "resolution",
                      chooser: {
                        binding: "affected-opponent",
                      },
                      count: {
                        kind: "exactly",
                        amount: {
                          kind: "calculate",
                          operator: "divide",
                          operands: [
                            {
                              kind: "count",
                              collection: {
                                zones: ["field"],
                                player: {
                                  binding: "affected-opponent",
                                },
                                filter: {
                                  kind: "token",
                                  value: true,
                                },
                              },
                            },
                            2,
                          ],
                          rounding: "down",
                        },
                      },
                      unique: true,
                      candidates: {
                        kind: "object",
                        zones: ["field"],
                        relationship: "controlled-by",
                        player: {
                          binding: "affected-opponent",
                        },
                        filter: {
                          kind: "token",
                          value: true,
                        },
                      },
                    },
                    effect: {
                      kind: "sacrifice",
                      subject: {
                        kind: "bound",
                        binding: "sacrificed-tokens",
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        {
          id: "sZlDgmVTD7-a2",
          kind: "activated",
          text: "(3), Banish Heirloom of Materia: Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default heirloomOfMateria;
