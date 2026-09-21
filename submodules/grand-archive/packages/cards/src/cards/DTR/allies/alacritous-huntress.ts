import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const alacritousHuntress: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7i24g0nbxz",
  slug: "alacritous-huntress",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7i24g0nbxz:face:default",
      catalogId: "7i24g0nbxz",
      name: "Alacritous Huntress",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2POWER.) \n\nOn Enter: Reveal up to one Aethercharge card from your hand. You may discard it or load it into an Aetherwing weapon you control. If you do, draw a card.\n",
      abilities: [
        {
          id: "7i24g0nbxz-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "7i24g0nbxz-a2",
          kind: "triggered",
          text: "On Enter: Reveal up to one Aethercharge card from your hand. You may discard it or load it into an Aetherwing weapon you control. If you do, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-aethercharge",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "subtype",
                      oneOf: ["AETHERCHARGE"],
                    },
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "collection-exists",
                  collection: {
                    binding: "revealed-aethercharge",
                  },
                },
                then: {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "move",
                        subject: {
                          kind: "bound",
                          binding: "revealed-aethercharge",
                        },
                        from: "hand",
                        destination: {
                          zone: "graveyard",
                        },
                      },
                      {
                        kind: "draw",
                        player: "controller",
                        amount: 1,
                      },
                    ],
                  },
                  otherwise: {
                    kind: "conditional",
                    condition: {
                      kind: "collection-exists",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "type",
                              oneOf: ["WEAPON"],
                            },
                            {
                              kind: "subtype",
                              oneOf: ["AETHERWING"],
                            },
                          ],
                        },
                      },
                    },
                    then: {
                      kind: "optional",
                      player: "controller",
                      allOrNothing: true,
                      effect: {
                        kind: "sequence",
                        effects: [
                          {
                            kind: "choose",
                            selection: {
                              id: "aetherwing-weapon",
                              kind: "choice",
                              declared: "resolution",
                              chooser: "controller",
                              count: {
                                kind: "exactly",
                                amount: 1,
                              },
                              candidates: {
                                kind: "object",
                                zones: ["field"],
                                relationship: "controlled-by",
                                player: "controller",
                                filter: {
                                  kind: "all",
                                  filters: [
                                    {
                                      kind: "type",
                                      oneOf: ["WEAPON"],
                                    },
                                    {
                                      kind: "subtype",
                                      oneOf: ["AETHERWING"],
                                    },
                                  ],
                                },
                              },
                            },
                            effect: {
                              kind: "move",
                              subject: {
                                kind: "bound",
                                binding: "revealed-aethercharge",
                              },
                              from: "hand",
                              destination: {
                                zone: "loaded",
                                host: {
                                  kind: "bound",
                                  binding: "aetherwing-weapon",
                                },
                              },
                            },
                          },
                          {
                            kind: "draw",
                            player: "controller",
                            amount: 1,
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

export default alacritousHuntress;
