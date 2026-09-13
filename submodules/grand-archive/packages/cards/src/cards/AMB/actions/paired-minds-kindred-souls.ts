import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pairedMindsKindredSouls: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7qjnqww067",
  slug: "paired-minds-kindred-souls",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7qjnqww067:face:default",
      catalogId: "7qjnqww067",
      name: "Paired Minds, Kindred Souls",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Look at the top ten cards of your deck. Reveal a Horse ally card from among them and put it into your hand. Put the rest on the bottom of your deck in any order.\n\n[Class Bonus] If you control a unique ally, the next Horse ally card you activate this turn costs 2 less to activate.",
      abilities: [
        {
          id: "7qjnqww067-a1",
          kind: "card-resolution",
          text: "Look at the top ten cards of your deck. Reveal a Horse ally card from among them and put it into your hand. Put the rest on the bottom of your deck in any order.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "referenced-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 10,
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
                  id: "chosen-card",
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
                    binding: "referenced-cards",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["HORSE"],
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
                        id: "revealed-card",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "all",
                        },
                        unique: true,
                        candidates: {
                          kind: "card",
                          binding: "chosen-card",
                        },
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "chosen-card",
                      },
                      destination: {
                        zone: "hand",
                      },
                    },
                  ],
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "ordered-remainder",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  ordered: true,
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "referenced-cards",
                    excluding: ["chosen-card"],
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "ordered-remainder",
                  },
                  destination: {
                    zone: "main-deck",
                    placement: {
                      kind: "bottom",
                    },
                  },
                },
              },
            ],
          },
        },
        {
          id: "7qjnqww067-a2",
          kind: "card-resolution",
          text: "[Class Bonus] If you control a unique ally, the next Horse ally card you activate this turn costs 2 less to activate.",
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
          effect: {
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
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "supertype",
                      oneOf: ["UNIQUE"],
                    },
                  ],
                },
              },
            },
            then: {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                  {
                    kind: "subtype",
                    oneOf: ["HORSE"],
                  },
                ],
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "for-next-event",
                event: "card-activated",
                expires: {
                  kind: "this-turn",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default pairedMindsKindredSouls;
