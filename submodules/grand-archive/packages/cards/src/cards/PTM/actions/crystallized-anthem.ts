import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crystallizedAnthem: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XfAJlQt9hH",
  slug: "crystallized-anthem",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XfAJlQt9hH:face:default",
      catalogId: "XfAJlQt9hH",
      name: "Crystallized Anthem",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["EXALTED", "WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prevent the next 2 damage that would be dealt to each unit you control this turn. When damage is prevented this way, put two sheen counters on your Fractured Memories.\n\nAt the beginning of your next recollection phase, Memorite objects you control get +1POWER for every six sheen counters on your Fractured Memories until end of turn.",
      abilities: [
        {
          id: "XfAJlQt9hH-a1",
          kind: "card-resolution",
          text: "Prevent the next 2 damage that would be dealt to each unit you control this turn. When damage is prevented this way, put two sheen counters on your Fractured Memories.",
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 2,
              scope: "per-object",
            },
            afterApply: {
              kind: "add-counter",
              subject: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "name",
                    value: "Fractured Memories",
                  },
                },
              },
              counter: {
                named: "sheen",
              },
              amount: 2,
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "XfAJlQt9hH-a2",
          kind: "card-resolution",
          text: "At the beginning of your next recollection phase, Memorite objects you control get +1POWER for every six sheen counters on your Fractured Memories until end of turn.",
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "phase-begins",
                phase: "recollection",
                actor: "controller",
              },
            },
            effect: {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["MEMORITE"],
                  },
                },
              },
              affectedSet: "locked",
              duration: {
                kind: "this-turn",
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
                amount: {
                  kind: "calculate",
                  operator: "divide",
                  operands: [
                    {
                      kind: "sum-counters",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "name",
                          value: "Fractured Memories",
                        },
                      },
                      counter: {
                        named: "sheen",
                      },
                    },
                    6,
                  ],
                  rounding: "down",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default crystallizedAnthem;
