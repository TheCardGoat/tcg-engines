import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanRepudiation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "t91W06HOqY",
  slug: "aenean-repudiation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "t91W06HOqY:face:default",
      catalogId: "t91W06HOqY",
      name: "Aenean Repudiation",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "AENEAN", "SPELL"],
      },
      elements: ["EXALTED", "NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Aenean Progression (This card costs (2) more to activate for each time you've resolved a card with Aenean progression this game.)\n\nEach player discards all but seven cards from their hand and/or memory. If you control an Elysian object, each opponent discards an additional card.",
      abilities: [
        {
          id: "t91W06HOqY-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Aenean Progression (This card costs (2) more to activate for each time you've resolved a card with Aenean progression this game.)",
          keyword: {
            name: "aenean-progression",
          },
        },
        {
          id: "t91W06HOqY-a2",
          kind: "card-resolution",
          text: "Each player discards all but seven cards from their hand and/or memory. If you control an Elysian object, each opponent discards an additional card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "for-each-player",
                players: "each-player",
                bindEachAs: "discarding-player",
                effect: {
                  kind: "discard",
                  player: {
                    binding: "discarding-player",
                  },
                  selection: {
                    id: "discard-to-seven",
                    kind: "choice",
                    declared: "resolution",
                    chooser: {
                      binding: "discarding-player",
                    },
                    count: {
                      kind: "exactly",
                      amount: {
                        kind: "calculate",
                        operator: "maximum",
                        operands: [
                          0,
                          {
                            kind: "calculate",
                            operator: "subtract",
                            operands: [
                              {
                                kind: "player-property",
                                player: {
                                  binding: "discarding-player",
                                },
                                property: "influence",
                              },
                              7,
                            ],
                          },
                        ],
                      },
                    },
                    unique: true,
                    candidates: {
                      kind: "union",
                      sources: [
                        {
                          kind: "card",
                          zones: ["hand"],
                          relationship: "zone-of",
                          player: {
                            binding: "discarding-player",
                          },
                        },
                        {
                          kind: "card",
                          zones: ["memory"],
                          relationship: "zone-of",
                          player: {
                            binding: "discarding-player",
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "controls",
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["ELYSIAN"],
                  },
                },
                then: {
                  kind: "for-each-player",
                  players: "each-opponent",
                  bindEachAs: "discarding-opponent",
                  effect: {
                    kind: "discard",
                    player: {
                      binding: "discarding-opponent",
                    },
                    selection: {
                      id: "additional-discard",
                      kind: "choice",
                      declared: "resolution",
                      chooser: {
                        binding: "discarding-opponent",
                      },
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      unique: true,
                      candidates: {
                        kind: "union",
                        sources: [
                          {
                            kind: "card",
                            zones: ["hand"],
                            relationship: "zone-of",
                            player: {
                              binding: "discarding-opponent",
                            },
                          },
                          {
                            kind: "card",
                            zones: ["memory"],
                            relationship: "zone-of",
                            player: {
                              binding: "discarding-opponent",
                            },
                          },
                        ],
                      },
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

export default aeneanRepudiation;
