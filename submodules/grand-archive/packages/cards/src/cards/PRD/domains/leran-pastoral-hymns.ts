import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const leranPastoralHymns: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "CGdu1Vmlok",
  slug: "leran-pastoral-hymns",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "CGdu1Vmlok:face:default",
      catalogId: "CGdu1Vmlok",
      name: "Leran, Pastoral Hymns",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SIEGEABLE", "SETTLEMENT"],
      },
      elements: ["FIRE"],
      stats: {
        durability: 6,
      },
      rulesText:
        "As long as your influence is four or less, this card costs 6 less to activate.\n\nAt the beginning of each player's end phase, if that player's influence is eight or more, deal X-7 damage to that player's champion, where X is that player's influence.",
      abilities: [
        {
          id: "CGdu1Vmlok-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as your influence is four or less, this card costs 6 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "player-property",
                    player: "controller",
                    property: "influence",
                  },
                  operator: "lte",
                  right: 4,
                },
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 6,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "CGdu1Vmlok-a2",
          kind: "triggered",
          text: "At the beginning of each player's end phase, if that player's influence is eight or more, deal X-7 damage to that player's champion, where X is that player's influence.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "player-property",
                player: "event-actor",
                property: "influence",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "player-property-compare",
              players: "event-actor",
              quantifier: "any",
              property: "influence",
              operator: "gte",
              value: 8,
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "champion",
                player: "event-actor",
              },
              amount: {
                kind: "calculate",
                operator: "subtract",
                operands: [
                  {
                    kind: "variable",
                    symbol: "X",
                  },
                  7,
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default leranPastoralHymns;
