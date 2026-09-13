import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fulminatingStorm: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cECG4Wrl9M",
  slug: "fulminating-storm",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cECG4Wrl9M:face:default",
      catalogId: "cECG4Wrl9M",
      name: "Fulminating Storm",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Remove up to nine enlighten counters from your champion. Deal X damage to each champion you don't control, where X is the amount of counters removed this way. \n\n[Class Bonus] For every three enlighten counters removed this way, draw a card.",
      abilities: [
        {
          id: "cECG4Wrl9M-a1",
          kind: "card-resolution",
          text: "Remove up to nine enlighten counters from your champion. Deal X damage to each champion you don't control, where X is the amount of counters removed this way.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "modified-ability-result-amount",
                metric: "counters-removed",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "remove-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "enlighten",
                amount: 9,
                bindResultAs: "removed-counters",
              },
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "each-opponent",
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                },
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            ],
          },
        },
        {
          id: "cECG4Wrl9M-a2",
          kind: "ability-modifier",
          text: "[Class Bonus] For every three enlighten counters removed this way, draw a card.",
          modifies: {
            kind: "preceding-non-modifier-ability",
          },
          operation: {
            kind: "append-effect",
            effect: {
              kind: "repeat",
              count: {
                kind: "calculate",
                operator: "divide",
                operands: [
                  {
                    kind: "modified-ability-result-amount",
                    metric: "counters-removed",
                  },
                  3,
                ],
                rounding: "down",
              },
              effect: {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            },
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
      ],
    },
  },
};

export default fulminatingStorm;
