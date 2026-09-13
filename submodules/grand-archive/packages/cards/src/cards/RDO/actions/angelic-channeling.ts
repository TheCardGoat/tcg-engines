import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const angelicChanneling: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "o3M5ZWSL6E",
  slug: "angelic-channeling",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "o3M5ZWSL6E:face:default",
      catalogId: "o3M5ZWSL6E",
      name: "Angelic Channeling",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ANGEL", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Banish up to three advanced element cards from your hand and/or memory. Draw a card into your memory for each card banished this way. When your champion levels up into a champion card with base level 3 the next time this game, put the banished cards on the top and/or bottom of your deck in any order.\n\nFloating Memory",
      abilities: [
        {
          id: "o3M5ZWSL6E-a1",
          kind: "card-resolution",
          text: "Banish up to three advanced element cards from your hand and/or memory. Draw a card into your memory for each card banished this way. When your champion levels up into a champion card with base level 3 the next time this game, put the banished cards on the top and/or bottom of your deck in any order.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish",
                player: "controller",
                selection: {
                  id: "channeled-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 3,
                  },
                  unique: true,
                  candidates: {
                    kind: "union",
                    sources: [
                      {
                        kind: "card",
                        zones: ["hand"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "element-category",
                          value: "advanced",
                        },
                      },
                      {
                        kind: "card",
                        zones: ["memory"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "element-category",
                          value: "advanced",
                        },
                      },
                    ],
                  },
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: {
                  kind: "count",
                  collection: {
                    binding: "channeled-cards",
                  },
                },
                to: "memory",
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "champion-leveled-up",
                    subject: {
                      kind: "event-object",
                      controller: "controller",
                      filter: {
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
                    },
                  },
                },
                limit: 1,
                expires: {
                  kind: "permanent",
                },
                effect: {
                  kind: "move-partition",
                  subject: {
                    kind: "bound",
                    binding: "channeled-cards",
                  },
                  chooser: "controller",
                  destinations: [
                    {
                      zone: "main-deck",
                      placement: {
                        kind: "top",
                        orderChosenBy: "controller",
                      },
                    },
                    {
                      zone: "main-deck",
                      placement: {
                        kind: "bottom",
                        orderChosenBy: "controller",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: "o3M5ZWSL6E-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default angelicChanneling;
