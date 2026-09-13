import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gatherSlimes: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1dfhbt3yna",
  slug: "gather-slimes",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1dfhbt3yna:face:default",
      catalogId: "1dfhbt3yna",
      name: "Gather Slimes",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SLIME", "SKILL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Fast Activation\n\nReveal the top five cards of your deck. Recover X where X is the amount of Slime ally cards revealed this way. Put a Slime ally card from among them into your hand and the rest on the bottom of your deck in any order.",
      abilities: [
        {
          id: "1dfhbt3yna-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Fast Activation",
          keyword: {
            name: "fast-activation",
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
          id: "1dfhbt3yna-a2",
          kind: "card-resolution",
          text: "Reveal the top five cards of your deck. Recover X where X is the amount of Slime ally cards revealed this way. Put a Slime ally card from among them into your hand and the rest on the bottom of your deck in any order.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
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
                kind: "recover",
                player: "controller",
                amount: {
                  kind: "count",
                  collection: {
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
                          oneOf: ["SLIME"],
                        },
                      ],
                    },
                  },
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "selected-referenced-card",
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
                          oneOf: ["SLIME"],
                        },
                      ],
                    },
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "selected-referenced-card",
                      },
                      destination: {
                        zone: "hand",
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "binding-remainder",
                        binding: "referenced-cards",
                        excluding: "selected-referenced-card",
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

export default gatherSlimes;
