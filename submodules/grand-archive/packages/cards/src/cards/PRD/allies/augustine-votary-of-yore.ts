import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const augustineVotaryOfYore: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "KdlhoQ1evn",
  slug: "augustine-votary-of-yore",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "KdlhoQ1evn:face:default",
      catalogId: "KdlhoQ1evn",
      name: "Augustine, Votary of Yore",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "REST: Cascade—\n• 1—  Up to one target object loses spellshroud and stealth until the end of your next turn. Glimpse 2.\n• 2— As a Spell, destroy target item or weapon with memory cost 0 or reserve cost 4 or less. If you do, its controller summons a Core Fractal token.\n(This ability changes each cascade.)",
      abilities: [
        {
          id: "KdlhoQ1evn-a1",
          kind: "activated",
          text: "REST: Cascade—\n• 1—  Up to one target object loses spellshroud and stealth until the end of your next turn. Glimpse 2.\n• 2— As a Spell, destroy target item or weapon with memory cost 0 or reserve cost 4 or less. If you do, its controller summons a Core Fractal token.\n(This ability changes each cascade.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
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
                counts: [1],
                text: "Up to one target object loses spellshroud and stealth until the end of your next turn. Glimpse 2.",
                targets: [
                  {
                    id: "stripped-object",
                    kind: "target",
                    declared: "announcement",
                    chooser: "controller",
                    count: {
                      kind: "up-to",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                    },
                  },
                ],
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "continuous",
                      subjects: {
                        kind: "bound",
                        binding: "stripped-object",
                      },
                      affectedSet: "locked",
                      duration: {
                        kind: "until-end-of-next-turn",
                        whose: "controller",
                      },
                      layer: {
                        layer: "D",
                        modifies: "ability",
                      },
                      change: {
                        kind: "remove-keyword",
                        keyword: {
                          name: "spellshroud",
                        },
                      },
                    },
                    {
                      kind: "continuous",
                      subjects: {
                        kind: "bound",
                        binding: "stripped-object",
                      },
                      affectedSet: "locked",
                      duration: {
                        kind: "until-end-of-next-turn",
                        whose: "controller",
                      },
                      layer: {
                        layer: "D",
                        modifies: "ability",
                      },
                      change: {
                        kind: "remove-keyword",
                        keyword: {
                          name: "stealth",
                        },
                      },
                    },
                    {
                      kind: "keyword-action",
                      action: "glimpse",
                      player: "controller",
                      amount: 2,
                    },
                  ],
                },
              },
              {
                id: "cascade-2",
                counts: [2],
                text: "As a Spell, destroy target item or weapon with memory cost 0 or reserve cost 4 or less. If you do, its controller summons a Core Fractal token.",
                targets: [
                  {
                    id: "destroyed-object",
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
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ITEM", "WEAPON"],
                          },
                          {
                            kind: "any",
                            filters: [
                              {
                                kind: "numeric",
                                comparison: {
                                  left: {
                                    kind: "property",
                                    subject: {
                                      kind: "candidate",
                                    },
                                    property: "memory-cost",
                                    basis: "base",
                                  },
                                  operator: "lte",
                                  right: 0,
                                },
                              },
                              {
                                kind: "numeric",
                                comparison: {
                                  left: {
                                    kind: "property",
                                    subject: {
                                      kind: "candidate",
                                    },
                                    property: "reserve-cost",
                                    basis: "base",
                                  },
                                  operator: "lte",
                                  right: 4,
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "perform-as",
                  sourceKind: "spell",
                  effect: {
                    kind: "reflexive",
                    action: {
                      kind: "destroy",
                      subject: {
                        kind: "bound",
                        binding: "destroyed-object",
                      },
                    },
                    consequence: {
                      kind: "summon",
                      controller: {
                        controllerOf: "destroyed-object",
                      },
                      object: "Core Fractal",
                    },
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

export default augustineVotaryOfYore;
