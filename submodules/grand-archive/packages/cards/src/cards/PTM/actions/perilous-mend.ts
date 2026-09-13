import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const perilousMend: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "A5jpuUlwDd",
  slug: "perilous-mend",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "A5jpuUlwDd:face:default",
      catalogId: "A5jpuUlwDd",
      name: "Perilous Mend",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Put any amount of Curse cards from your hand and/or memory on the bottom of your champion's lineage in any order. Recover X, where X is three times the amount of cards put this way.\n\n[Class Bonus] If your champion is distant, draw a card.",
      abilities: [
        {
          id: "A5jpuUlwDd-a1",
          kind: "card-resolution",
          text: "[Class Bonus] Put any amount of Curse cards from your hand and/or memory on the bottom of your champion's lineage in any order. Recover X, where X is three times the amount of cards put this way.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  3,
                  {
                    kind: "modified-ability-result-amount",
                    metric: "cards-moved",
                  },
                ],
              },
            },
          ],
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
            kind: "choose",
            selection: {
              id: "lineage-curses",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "any-number",
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
                      kind: "subtype",
                      oneOf: ["CURSE"],
                    },
                  },
                  {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "subtype",
                      oneOf: ["CURSE"],
                    },
                  },
                ],
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "lineage-curses",
                  },
                  destination: {
                    zone: "inner-lineage",
                    host: {
                      kind: "champion",
                      player: "controller",
                    },
                    placement: {
                      kind: "bottom",
                      orderChosenBy: "controller",
                    },
                  },
                  bindResultAs: "moved-curses",
                },
                {
                  kind: "recover",
                  player: "controller",
                  amount: {
                    kind: "calculate",
                    operator: "multiply",
                    operands: [
                      3,
                      {
                        kind: "modified-ability-result-amount",
                        metric: "cards-moved",
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          id: "A5jpuUlwDd-a2",
          kind: "card-resolution",
          text: "[Class Bonus] If your champion is distant, draw a card.",
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
              kind: "object-state",
              subject: {
                kind: "champion",
                player: "controller",
              },
              state: "distant",
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default perilousMend;
