import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cometfall: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4d5vettczb",
  slug: "cometfall",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4d5vettczb:face:default",
      catalogId: "4d5vettczb",
      name: "Cometfall",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "Starcalling — (2) (As you're looking at this card while glimpsing, you may activate it by paying this cost. If you do, put all other cards you're looking at on the bottom of your deck in any order.)\n\nDeal 3 damage to all non-astra element units. Class Bonus: Deal 4 damage to those units instead.",
      abilities: [
        {
          id: "4d5vettczb-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Starcalling — (2) (As you're looking at this card while glimpsing, you may activate it by paying this cost. If you do, put all other cards you're looking at on the bottom of your deck in any order.)",
          keyword: {
            name: "starcalling",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
          },
        },
        {
          id: "4d5vettczb-a2",
          kind: "card-resolution",
          text: "Deal 3 damage to all non-astra element units. Class Bonus: Deal 4 damage to those units instead.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "champion-matches-source",
              characteristic: "class",
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "each-player",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "not",
                        filter: {
                          kind: "element",
                          oneOf: ["ASTRA"],
                        },
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    ],
                  },
                },
              },
              amount: 4,
            },
            else: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "each-player",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "not",
                        filter: {
                          kind: "element",
                          oneOf: ["ASTRA"],
                        },
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    ],
                  },
                },
              },
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default cometfall;
