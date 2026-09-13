import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tableStraight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "57WTJAiXLr",
  slug: "table-straight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "57WTJAiXLr:face:default",
      catalogId: "57WTJAiXLr",
      name: "Table Straight",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SUITED", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Reveal any amount of Suited cards from your memory. Depending on the length of the longest consecutive streak of reserve costs among cards revealed this way and Suited allies you control— \n• 2, 3, or 4— Draw a card.\n• 5 or 6— Draw two cards.\n• 7 or more— Draw three cards.",
      abilities: [
        {
          id: "57WTJAiXLr-a1",
          kind: "card-resolution",
          text: "Reveal any amount of Suited cards from your memory. Depending on the length of the longest consecutive streak of reserve costs among cards revealed this way and Suited allies you control—\n• 2, 3, or 4— Draw a card.\n• 5 or 6— Draw two cards.\n• 7 or more— Draw three cards.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-suited-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "subtype",
                      oneOf: ["SUITED"],
                    },
                  },
                },
              },
              {
                kind: "branch-on-value",
                value: {
                  kind: "longest-consecutive-property-run",
                  collections: [
                    {
                      binding: "revealed-suited-cards",
                    },
                    {
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
                            kind: "subtype",
                            oneOf: ["SUITED"],
                          },
                        ],
                      },
                    },
                  ],
                  property: "reserve-cost",
                  basis: "base",
                },
                branches: [
                  {
                    minimum: 0,
                    maximum: 1,
                    effect: {
                      kind: "no-op",
                    },
                  },
                  {
                    minimum: 2,
                    maximum: 4,
                    effect: {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                    },
                  },
                  {
                    minimum: 5,
                    maximum: 6,
                    effect: {
                      kind: "draw",
                      player: "controller",
                      amount: 2,
                    },
                  },
                  {
                    minimum: 7,
                    effect: {
                      kind: "draw",
                      player: "controller",
                      amount: 3,
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },
};

export default tableStraight;
