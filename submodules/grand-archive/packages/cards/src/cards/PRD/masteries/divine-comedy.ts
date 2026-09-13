import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const divineComedy: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "mastery-representation"
> = {
  canonicalId: "ts9VdtFtk1",
  slug: "divine-comedy",
  definitionKind: "mastery-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "ts9VdtFtk1:face:default",
      catalogId: "ts9VdtFtk1",
      name: "Divine Comedy",
      cost: {
        kind: "none",
      },
      typeLine: {
        supertypes: [],
        types: ["MASTERY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ULTIMATE", "BOOK"],
      },
      elements: [],
      stats: {},
      rulesText:
        "[Dante Bonus] (4): Activate this ability only once per turn, and only at slow speed. This ability costs (4) less to activate the first time you activate it. This ability's activation can't be negated. Cascade— (Each page represents one effect of the cascade ability.)\n• 1— Until the beginning of your next turn, your opponents can't activate cards with an even reserve cost. (Zero is considered even.)\n• 2— As a Spell, destroy target non-champion object. When that object is destroyed this way, recover 4.\n• 3— Until the beginning of your next turn, your opponents can't activate cards with an even reserve cost. (Zero is considered even.)\n• 4— Remove all damage counters from your champion, then deal 20+X unpreventable damage to each champion your opponents control, where X is ten times the amount of damage counters removed this way.",
      abilities: [
        {
          id: "ts9VdtFtk1-a1",
          kind: "activated",
          text: "[Dante Bonus] (4): Activate this ability only once per turn, and only at slow speed. This ability costs (4) less to activate the first time you activate it. This ability's activation can't be negated. Cascade— (Each page represents one effect of the cascade ability.)\n• 1— Until the beginning of your next turn, your opponents can't activate cards with an even reserve cost. (Zero is considered even.)\n• 2— As a Spell, destroy target non-champion object. When that object is destroyed this way, recover 4.\n• 3— Until the beginning of your next turn, your opponents can't activate cards with an even reserve cost. (Zero is considered even.)\n• 4— Remove all damage counters from your champion, then deal 20+X unpreventable damage to each champion your opponents control, where X is ten times the amount of damage counters removed this way.",
          activation: "ability",
          speed: "slow",
          cost: {
            kind: "pay-reserve",
            amount: 4,
          },
          stackBehavior: {
            canBeNegated: false,
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: 4,
              condition: {
                kind: "ability-activation-count",
                ability: "this",
                scope: "source-instance",
                window: "this-turn",
                operator: "eq",
                value: 0,
              },
            },
          ],
          limit: {
            count: 1,
            per: "turn",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Dante",
              },
            },
          ],
          cascade: {
            kind: "cascade",
            advanceOn: "activation",
            tracking: {
              scope: "source-instance",
              includesCurrent: true,
              advancesIfStackEntryFailsToResolve: true,
            },
            copiedAbility: "repeat-pending-effect-without-advancing",
            modes: [
              {
                id: "cascade-1",
                text: "Until the beginning of your next turn, your opponents can't activate cards with an even reserve cost. (Zero is considered even.)",
                counts: [1],
                effect: {
                  kind: "rule-modification",
                  mode: "forbid",
                  action: "activate",
                  subject: {
                    kind: "player",
                    player: "each-player",
                  },
                  filter: {
                    kind: "parity",
                    property: "reserve-cost",
                    value: "even",
                  },
                  duration: {
                    kind: "until-start-of-turn",
                    whose: "controller",
                  },
                },
              },
              {
                id: "cascade-2",
                text: "As a Spell, destroy target non-champion object. When that object is destroyed this way, recover 4.",
                counts: [2],
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
                        kind: "not",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
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
                        kind: "destroy",
                        subject: {
                          kind: "bound",
                          binding: "target-1",
                        },
                        bindResultAs: "destroyed-this-way",
                      },
                    },
                    {
                      kind: "conditional",
                      condition: {
                        kind: "effect-succeeded",
                        binding: "destroyed-this-way",
                      },
                      then: {
                        kind: "recover",
                        player: "controller",
                        amount: 4,
                      },
                    },
                  ],
                },
              },
              {
                id: "cascade-3",
                text: "Until the beginning of your next turn, your opponents can't activate cards with an even reserve cost. (Zero is considered even.)",
                counts: [3],
                effect: {
                  kind: "rule-modification",
                  mode: "forbid",
                  action: "activate",
                  subject: {
                    kind: "player",
                    player: "each-player",
                  },
                  filter: {
                    kind: "parity",
                    property: "reserve-cost",
                    value: "even",
                  },
                  duration: {
                    kind: "until-start-of-turn",
                    whose: "controller",
                  },
                },
              },
              {
                id: "cascade-4",
                text: "Remove all damage counters from your champion, then deal 20+X unpreventable damage to each champion your opponents control, where X is ten times the amount of damage counters removed this way.",
                counts: [4],
                variables: [
                  {
                    symbol: "X",
                    kind: "derived",
                    amount: {
                      kind: "calculate",
                      operator: "multiply",
                      operands: [
                        {
                          kind: "binding",
                          binding: "removed-counters",
                        },
                        10,
                      ],
                    },
                  },
                ],
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "remove-counter",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      counter: "damage",
                      amount: {
                        kind: "all",
                      },
                      bindResultAs: "removed-counters",
                    },
                    {
                      kind: "deal-damage",
                      source: {
                        kind: "source",
                      },
                      recipient: {
                        kind: "each",
                        collection: {
                          zones: ["field"],
                          player: "opponent",
                          filter: {
                            kind: "type",
                            oneOf: ["CHAMPION"],
                          },
                        },
                      },
                      amount: {
                        kind: "calculate",
                        operator: "add",
                        operands: [
                          20,
                          {
                            kind: "variable",
                            symbol: "X",
                          },
                        ],
                      },
                      preventable: false,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default divineComedy;
