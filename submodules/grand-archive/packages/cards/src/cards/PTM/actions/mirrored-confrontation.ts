import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mirroredConfrontation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zHbIiP3knE",
  slug: "mirrored-confrontation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zHbIiP3knE:face:default",
      catalogId: "zHbIiP3knE",
      name: "Mirrored Confrontation",
      cost: {
        kind: "reserve",
        amount: 2,
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
        "Each player may reveal a champion card with base level 3 from their material deck. Each player that does draws a card into their memory and recovers 2.",
      abilities: [
        {
          id: "zHbIiP3knE-a1",
          kind: "card-resolution",
          text: "Each player may reveal a champion card with base level 3 from their material deck. Each player that does draws a card into their memory and recovers 2.",
          effect: {
            kind: "for-each-player",
            players: "each-player",
            bindEachAs: "revealing-player",
            effect: {
              kind: "optional",
              player: {
                binding: "revealing-player",
              },
              allOrNothing: true,
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "reveal",
                    player: {
                      binding: "revealing-player",
                    },
                    selection: {
                      id: "revealed-champion",
                      kind: "choice",
                      declared: "resolution",
                      chooser: {
                        binding: "revealing-player",
                      },
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      unique: true,
                      candidates: {
                        kind: "card",
                        zones: ["material-deck"],
                        relationship: "zone-of",
                        player: {
                          binding: "revealing-player",
                        },
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "type",
                              oneOf: ["CHAMPION"],
                            },
                            {
                              kind: "numeric",
                              comparison: {
                                left: {
                                  kind: "property",
                                  subject: {
                                    kind: "candidate",
                                  },
                                  property: "level",
                                  basis: "base",
                                },
                                operator: "eq",
                                right: 3,
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  {
                    kind: "draw",
                    player: {
                      binding: "revealing-player",
                    },
                    amount: 1,
                    to: "memory",
                  },
                  {
                    kind: "recover",
                    player: {
                      binding: "revealing-player",
                    },
                    amount: 2,
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default mirroredConfrontation;
