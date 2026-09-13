import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const devouringMalice: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1keruycrwi",
  slug: "devouring-malice",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1keruycrwi:face:default",
      catalogId: "1keruycrwi",
      name: "Devouring Malice",
      cost: {
        kind: "memory",
        amount: {
          kind: "variable",
          symbol: "X",
        },
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "ARTIFACT"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "Devouring Malice enters the field with X gem counters on it.\n\nREST, Remove a gem counter from Devouring Malice: As a Spell, choose one that hasn't been chosen—\n• Put three debuff counters on target ally.\n• Deal 3 damage to target champion and recover 3.\n• Deal 8 unpreventable damage to your champion and draw two cards.",
      abilities: [
        {
          id: "1keruycrwi-a1",
          kind: "static",
          staticKind: "effects",
          text: "Devouring Malice enters the field with X gem counters on it.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "add-object-counters",
                counters: [
                  {
                    counter: {
                      named: "gem",
                    },
                    amount: {
                      kind: "variable",
                      symbol: "X",
                    },
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "1keruycrwi-a2",
          kind: "activated",
          text: "REST, Remove a gem counter from Devouring Malice: As a Spell, choose one that hasn't been chosen—\n• Put three debuff counters on target ally.\n• Deal 3 damage to target champion and recover 3.\n• Deal 8 unpreventable damage to your champion and draw two cards.",
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
                kind: "remove-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "gem",
                },
                amount: 1,
              },
            ],
          },
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "select-modes",
              choose: {
                kind: "exactly",
                amount: 1,
              },
              excludePreviouslyChosen: true,
              trackChosenAs: "chosen-modes",
              modes: [
                {
                  id: "mode-1",
                  text: "Put three debuff counters on target ally.",
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
                    counter: "debuff",
                    amount: 3,
                  },
                },
                {
                  id: "mode-2",
                  text: "Deal 3 damage to target champion and recover 3.",
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
                          oneOf: ["CHAMPION"],
                        },
                      },
                    },
                  ],
                  effect: {
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "bound",
                      binding: "target-1",
                    },
                    amount: 3,
                  },
                },
                {
                  id: "mode-3",
                  text: "Deal 8 unpreventable damage to your champion and draw two cards",
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "deal-damage",
                        source: {
                          kind: "source",
                        },
                        recipient: {
                          kind: "champion",
                          player: "controller",
                        },
                        amount: 8,
                        preventable: false,
                      },
                      {
                        kind: "draw",
                        player: "controller",
                        amount: 2,
                      },
                    ],
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

export default devouringMalice;
