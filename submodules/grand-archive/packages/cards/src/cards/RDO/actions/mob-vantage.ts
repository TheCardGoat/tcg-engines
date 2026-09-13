import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mobVantage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bBI0TC54pV",
  slug: "mob-vantage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bBI0TC54pV:face:default",
      catalogId: "bBI0TC54pV",
      name: "Mob Vantage",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] As long as an opponent controls three or more units, this card costs 2 less to activate.\n\nYour champion becomes distant. Draw a card into your memory.",
      abilities: [
        {
          id: "bBI0TC54pV-a1",
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
          id: "bBI0TC54pV-a2",
          kind: "card-resolution",
          text: "Your champion becomes distant. Draw a card into your memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "set-object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "distant",
                value: true,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default mobVantage;
