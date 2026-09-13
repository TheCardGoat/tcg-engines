import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const daQiaoCinderbinder: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ugl6g5znia",
  slug: "da-qiao-cinderbinder",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ugl6g5znia:face:default",
      catalogId: "ugl6g5znia",
      name: "Da Qiao, Cinderbinder",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE", "TAMER"],
        subtypes: ["MAGE", "TAMER", "ANIMAL", "HUMAN", "FOX"],
      },
      elements: ["FIRE"],
      stats: {
        power: 0,
        life: 4,
      },
      rulesText:
        "Allies with frenzy counters on them don't obey their controller. (They can't attack and intercept, and their activated abilities can't be activated.)\n\n[Class Bonus] REST: Choose one— \n• Put a frenzy counter on target ally.\n• Empower X, where X is the amount of allies on the field with a frenzy counter on them.",
      abilities: [
        {
          id: "ugl6g5znia-a1",
          kind: "static",
          staticKind: "effects",
          text: "Allies with frenzy counters on them don't obey their controller. (They can't attack and intercept, and their activated abilities can't be activated.)",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "attack",
              subject: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "has-counter",
                        counter: {
                          named: "frenzy",
                        },
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "intercept",
              subject: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "has-counter",
                        counter: {
                          named: "frenzy",
                        },
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "activate",
              subject: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "has-counter",
                        counter: {
                          named: "frenzy",
                        },
                      },
                    ],
                  },
                },
              },
              activationKind: "ability",
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ugl6g5znia-a2",
          kind: "activated",
          text: "[Class Bonus] REST: Choose one—\n• Put a frenzy counter on target ally.\n• Empower X, where X is the amount of allies on the field with a frenzy counter on them.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "mode-1",
                text: "Put a frenzy counter on target ally.",
                targets: [
                  {
                    id: "target-1",
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
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  counter: {
                    named: "frenzy",
                  },
                  amount: 1,
                },
              },
              {
                id: "mode-2",
                text: "Empower X, where X is the amount of allies on the field with a frenzy counter on them",
                variables: [
                  {
                    symbol: "X",
                    kind: "derived",
                    amount: {
                      kind: "count",
                      collection: {
                        zones: ["field"],
                        player: "each-player",
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "type",
                              oneOf: ["ALLY"],
                            },
                            {
                              kind: "has-counter",
                              counter: {
                                named: "frenzy",
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
                effect: {
                  kind: "keyword-action",
                  action: "empower",
                  amount: {
                    kind: "variable",
                    symbol: "X",
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

export default daQiaoCinderbinder;
