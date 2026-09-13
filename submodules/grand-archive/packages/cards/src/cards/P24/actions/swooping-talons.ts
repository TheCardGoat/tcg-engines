import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const swoopingTalons: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rj52215upu",
  slug: "swooping-talons",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rj52215upu:face:default",
      catalogId: "rj52215upu",
      name: "Swooping Talons",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Choose one —\n• Deal 2 damage to target ally.\n• [Level 2+] Destroy target item with memory cost 0 or reserve cost 4 or less. (Choose this option only if your champion is level 2 or higher.)",
      abilities: [
        {
          id: "rj52215upu-a1",
          kind: "card-resolution",
          text: "Choose one —\n• Deal 2 damage to target ally.\n• [Level 2+] Destroy target item with memory cost 0 or reserve cost 4 or less. (Choose this option only if your champion is level 2 or higher.)",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "mode-1",
                text: "Deal 2 damage to target ally.",
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
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  amount: 2,
                },
              },
              {
                id: "mode-2",
                text: "[Level 2+] Destroy target item with memory cost 0 or reserve cost 4 or less",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "property",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      property: "level",
                      basis: "current",
                    },
                    operator: "gte",
                    right: 2,
                  },
                },
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
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ITEM"],
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
                  kind: "destroy",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  bindResultAs: "destroyed-object",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default swoopingTalons;
