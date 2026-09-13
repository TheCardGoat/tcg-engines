import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rictusTiding: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4g7kufs4kg",
  slug: "rictus-tiding",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4g7kufs4kg:face:default",
      catalogId: "4g7kufs4kg",
      name: "Rictus Tiding",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Reveal the top two cards of your deck. If the total reserve cost of the revealed cards is 8, put both of them into your memory. Otherwise put one of them into your memory and the other on the bottom of your deck.",
      abilities: [
        {
          id: "4g7kufs4kg-a1",
          kind: "card-resolution",
          text: "Reveal the top two cards of your deck. If the total reserve cost of the revealed cards is 8, put both of them into your memory. Otherwise put one of them into your memory and the other on the bottom of your deck.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 2,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "aggregate-property",
                      operation: "sum",
                      collection: {
                        binding: "revealed-cards",
                      },
                      property: "reserve-cost",
                      basis: "base",
                    },
                    operator: "eq",
                    right: 8,
                  },
                },
                then: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "revealed-cards",
                  },
                  from: "main-deck",
                  destination: {
                    zone: "memory",
                  },
                },
                else: {
                  kind: "choose",
                  selection: {
                    id: "memory-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "card",
                      binding: "revealed-cards",
                    },
                  },
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "move",
                        subject: {
                          kind: "bound",
                          binding: "memory-card",
                        },
                        from: "main-deck",
                        destination: {
                          zone: "memory",
                        },
                      },
                      {
                        kind: "move",
                        subject: {
                          kind: "binding-remainder",
                          binding: "revealed-cards",
                          excluding: "memory-card",
                        },
                        from: "main-deck",
                        destination: {
                          zone: "main-deck",
                          placement: {
                            kind: "bottom",
                          },
                        },
                      },
                    ],
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

export default rictusTiding;
