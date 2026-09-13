import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fatestoneOfHeaven: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "al6pqkmgmz",
  slug: "fatestone-of-heaven",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "al6pqkmgmz:face:default",
      catalogId: "al6pqkmgmz",
      name: "Fatestone of Heaven",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["LUXEM"],
      stats: {},
      rulesText:
        "On Enter: Destroy target non-champion object with memory cost 1 or less, or reserve cost 5 or less.\n\n[Guo Jia Bonus] (3): Reveal all cards in your memory. If three or more luxem element cards were revealed this way, transform Fatestone of Heaven. Activate this ability only once per turn and at slow speed.",
      abilities: [
        {
          id: "al6pqkmgmz-a1",
          kind: "triggered",
          text: "On Enter: Destroy target non-champion object with memory cost 1 or less, or reserve cost 5 or less.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
                      kind: "not",
                      filter: {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
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
                            right: 1,
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
                            right: 5,
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
        {
          id: "al6pqkmgmz-a2",
          kind: "activated",
          text: "[Guo Jia Bonus] (3): Reveal all cards in your memory. If three or more luxem element cards were revealed this way, transform Fatestone of Heaven. Activate this ability only once per turn and at slow speed.",
          activation: "ability",
          speed: "slow",
          cost: {
            kind: "pay-reserve",
            amount: 3,
          },
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
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-memory",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "count",
                      collection: {
                        binding: "revealed-memory",
                        filter: {
                          kind: "element",
                          oneOf: ["LUXEM"],
                        },
                      },
                    },
                    operator: "gte",
                    right: 3,
                  },
                },
                then: {
                  kind: "transform",
                  subject: {
                    kind: "source",
                  },
                },
              },
            ],
          },
        },
      ],
    },
    flipFace: {
      id: "al6pqkmgmz:face:flip",
      catalogId: "xkthg3cwx5",
      name: "Heavenly Drake",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "DRAGON"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "Spellshroud (Units with spellshroud can’t be targeted by Spells.)\n\nVigor (At the beginning of your end phase, wake up Heavenly Drake.)\n\nOn Death: Recover 3.",
      abilities: [
        {
          id: "xkthg3cwx5-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Spellshroud (Units with spellshroud can’t be targeted by Spells.)",
          keyword: {
            name: "spellshroud",
          },
        },
        {
          id: "xkthg3cwx5-a2",
          kind: "triggered",
          intrinsic: true,
          text: "Vigor (At the beginning of your end phase, wake up Heavenly Drake.)",
          keyword: {
            name: "vigor",
          },
        },
        {
          id: "xkthg3cwx5-a3",
          kind: "triggered",
          text: "On Death: Recover 3.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "recover",
            player: "controller",
            amount: 3,
          },
        },
      ],
    },
  },
};

export default fatestoneOfHeaven;
