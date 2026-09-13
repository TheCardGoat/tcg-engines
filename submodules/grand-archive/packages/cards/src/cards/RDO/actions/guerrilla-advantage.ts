import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const guerrillaAdvantage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "JxCzS4XJ3V",
  slug: "guerrilla-advantage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "JxCzS4XJ3V:face:default",
      catalogId: "JxCzS4XJ3V",
      name: "Guerrilla Advantage",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] As long as an opponent controls three or more units, this card costs 2 less to activate.\n\nPut two preparation counters on your champion.",
      abilities: [
        {
          id: "JxCzS4XJ3V-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as an opponent controls three or more units, this card costs 2 less to activate.",
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
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      player: "each-opponent",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                  operator: "gte",
                  right: 3,
                },
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "JxCzS4XJ3V-a2",
          kind: "card-resolution",
          text: "Put two preparation counters on your champion.",
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default guerrillaAdvantage;
