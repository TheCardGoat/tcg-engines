import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lenaDorumegiasHerald: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gwve1d47o7",
  slug: "lena-dorumegias-herald",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gwve1d47o7:face:default",
      catalogId: "gwve1d47o7",
      name: "Lena, Dorumegia's Herald",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] True Sight\n\n(4), REST: Look at the top four cards of your deck. You may reveal a Ranger ally card from among them and put it into your hand. Put the rest on the bottom of your deck in any order. This ability costs (2) less to activate as long as Lena is distant.",
      abilities: [
        {
          id: "gwve1d47o7-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] True Sight",
          keyword: {
            name: "true-sight",
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
        },
        {
          id: "gwve1d47o7-a2",
          kind: "activated",
          text: "(4), REST: Look at the top four cards of your deck. You may reveal a Ranger ally card from among them and put it into your hand. Put the rest on the bottom of your deck in any order. This ability costs (2) less to activate as long as Lena is distant.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 4,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: 2,
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "distant",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "looked-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 4,
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
                kind: "choose",
                selection: {
                  id: "ranger-ally",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "looked-cards",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["RANGER"],
                        },
                      ],
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
                        id: "ranger-ally",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "up-to",
                          amount: 1,
                        },
                        unique: true,
                        candidates: {
                          kind: "card",
                          binding: "looked-cards",
                          filter: {
                            kind: "all",
                            filters: [
                              {
                                kind: "type",
                                oneOf: ["ALLY"],
                              },
                              {
                                kind: "subtype",
                                oneOf: ["RANGER"],
                              },
                            ],
                          },
                        },
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "ranger-ally",
                      },
                      destination: {
                        zone: "hand",
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "binding-remainder",
                        binding: "looked-cards",
                        excluding: "ranger-ally",
                      },
                      destination: {
                        zone: "main-deck",
                        placement: {
                          kind: "bottom",
                          orderChosenBy: "controller",
                        },
                      },
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

export default lenaDorumegiasHerald;
