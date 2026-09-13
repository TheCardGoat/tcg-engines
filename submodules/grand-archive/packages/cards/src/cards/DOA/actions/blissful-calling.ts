import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blissfulCalling: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "YOjdZJpOO1",
  slug: "blissful-calling",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "YOjdZJpOO1:face:default",
      catalogId: "YOjdZJpOO1",
      name: "Blissful Calling",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "MELODY"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Look at the top five cards of your deck. You may reveal an Animal or Beast card from among them and put it into your hand. Put the rest on the bottom of your deck in any order.",
      abilities: [
        {
          id: "YOjdZJpOO1-a1",
          kind: "card-resolution",
          text: "Look at the top five cards of your deck. You may reveal an Animal or Beast card from among them and put it into your hand. Put the rest on the bottom of your deck in any order.",
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
                    amount: 5,
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
                    kind: "up-to",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "referenced-cards",
                    filter: {
                      kind: "subtype",
                      oneOf: ["ANIMAL", "BEAST"],
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
      ],
    },
  },
};

export default blissfulCalling;
