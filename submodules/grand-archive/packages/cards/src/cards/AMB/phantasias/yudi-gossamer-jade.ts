import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const yudiGossamerJade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l94wp7qjwb",
  slug: "yudi-gossamer-jade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "l94wp7qjwb:face:default",
      catalogId: "l94wp7qjwb",
      name: "Yudi, Gossamer Jade",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "Whenever you empower an amount, if that amount is greater than the amount of root counters on Yudi, put a root counter on it.\n\n[Class Bonus] Players can't declare attacks with non-tera element units unless they pay (X) for each attack declaration, where X is the amount of root counters on Yudi.",
      abilities: [
        {
          id: "l94wp7qjwb-a1",
          kind: "triggered",
          text: "Whenever you empower an amount, if that amount is greater than the amount of root counters on Yudi, put a root counter on it.",
          trigger: {
            kind: "event",
            event: {
              name: "keyword-action-performed",
              actor: "controller",
              action: "empower",
            },
          },
          interveningCondition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "event-amount",
              },
              operator: "gt",
              right: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "root",
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "root",
            },
            amount: 1,
          },
        },
        {
          id: "l94wp7qjwb-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Players can't declare attacks with non-tera element units unless they pay (X) for each attack declaration, where X is the amount of root counters on Yudi.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "root",
                },
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
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "attack",
              subject: {
                kind: "player",
                player: "each-player",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                  {
                    kind: "not",
                    filter: {
                      kind: "element",
                      oneOf: ["TERA"],
                    },
                  },
                ],
              },
              cost: {
                kind: "pay-reserve",
                amount: {
                  kind: "counter-count",
                  subject: {
                    kind: "source",
                  },
                  counter: {
                    named: "root",
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default yudiGossamerJade;
