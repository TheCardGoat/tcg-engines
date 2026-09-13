import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const penumbralWaltz: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nt1lyk1dvd",
  slug: "penumbral-waltz",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nt1lyk1dvd:face:default",
      catalogId: "nt1lyk1dvd",
      name: "Penumbral Waltz",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL", "REACTION"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, remove X preparation counters from your champion. \n\nPrevent the next X+3 damage that would be dealt to your champion this turn. \n\n[Tristan Bonus] If X is 3 or greater, summon two Ominous Shadow tokens.",
      abilities: [
        {
          id: "nt1lyk1dvd-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, remove X preparation counters from your champion.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "remove-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "nt1lyk1dvd-a2",
          kind: "card-resolution",
          text: "Prevent the next X+3 damage that would be dealt to your champion this turn.",
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  {
                    kind: "variable",
                    symbol: "X",
                  },
                  3,
                ],
              },
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "nt1lyk1dvd-a3",
          kind: "card-resolution",
          text: "[Tristan Bonus] If X is 3 or greater, summon two Ominous Shadow tokens.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Tristan",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "variable",
                  symbol: "X",
                },
                operator: "gte",
                right: 3,
              },
            },
            then: {
              kind: "summon",
              object: "Ominous Shadow",
              controller: "controller",
              bindResultAs: "summoned-token",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default penumbralWaltz;
