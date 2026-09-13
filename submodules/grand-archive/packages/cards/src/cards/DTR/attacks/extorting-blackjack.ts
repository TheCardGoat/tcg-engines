import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const extortingBlackjack: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bfg5ubeczk",
  slug: "extorting-blackjack",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bfg5ubeczk:face:default",
      catalogId: "bfg5ubeczk",
      name: "Extorting Blackjack",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 2,
      },
      rulesText:
        "As long as the total reserve cost among your omens is exactly 21, Extorting Blackjack gets +10POWER.\n\n[Class Bonus] On Attack: Recover X, where X is the amount of omens you have with different costs.",
      abilities: [
        {
          id: "bfg5ubeczk-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as the total reserve cost among your omens is exactly 21, Extorting Blackjack gets +10POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "aggregate-property",
                    operation: "sum",
                    collection: {
                      zones: ["banishment"],
                      player: "controller",
                      filter: {
                        kind: "has-counter",
                        counter: "omen",
                      },
                    },
                    property: "reserve-cost",
                    basis: "current",
                    emptyValue: 0,
                  },
                  operator: "eq",
                  right: 21,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 10,
              },
            },
          ],
        },
        {
          id: "bfg5ubeczk-a2",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Recover X, where X is the amount of omens you have with different costs.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "has-counter",
                    counter: "omen",
                  },
                },
                distinctBy: "reserve-cost",
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
            kind: "recover",
            player: "controller",
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
      ],
    },
  },
};

export default extortingBlackjack;
