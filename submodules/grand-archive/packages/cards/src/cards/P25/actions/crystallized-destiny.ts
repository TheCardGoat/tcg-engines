import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crystallizedDestiny: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l36wwe3d5c",
  slug: "crystallized-destiny",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "l36wwe3d5c:face:default",
      catalogId: "l36wwe3d5c",
      name: "Crystallized Destiny",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "TAMER"],
        subtypes: ["CLERIC", "TAMER", "SPELL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "As long as you control two or more Fatestone and/or Fatebound objects, this card costs 2 less to activate.\n\nThe next time damage would be dealt to your champion this turn, prevent that damage. When 7 or more damage is prevented this way, cards your opponents activate this turn cost (2) more to activate.",
      abilities: [
        {
          id: "l36wwe3d5c-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control two or more Fatestone and/or Fatebound objects, this card costs 2 less to activate.",
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
                      player: "controller",
                      filter: {
                        kind: "any",
                        filters: [
                          {
                            kind: "subtype",
                            oneOf: ["FATESTONE"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["FATEBOUND"],
                          },
                        ],
                      },
                    },
                  },
                  operator: "gte",
                  right: 2,
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
          id: "l36wwe3d5c-a2",
          kind: "card-resolution",
          text: "The next time damage would be dealt to your champion this turn, prevent that damage. When 7 or more damage is prevented this way, cards your opponents activate this turn cost (2) more to activate.",
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
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
              expires: {
                kind: "this-turn",
              },
            },
            afterApply: {
              kind: "conditional",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "modified-ability-result-amount",
                    metric: "damage-prevented",
                  },
                  operator: "gte",
                  right: 7,
                },
              },
              then: {
                kind: "rule-modification",
                mode: "modify-cost",
                action: "activate",
                subject: {
                  kind: "player",
                  player: "each-opponent",
                },
                costKind: "reserve",
                costOperation: "add",
                amount: 2,
                duration: {
                  kind: "this-turn",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default crystallizedDestiny;
