import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const falseStep: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "47o7eanl1g",
  slug: "false-step",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "47o7eanl1g:face:default",
      catalogId: "47o7eanl1g",
      name: "False Step",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL", "REACTION"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "If damage would be dealt to your champion this turn, prevent 2 of that damage. Your champion becomes distant. Then you may pay (2). If you do, allies you control also become distant.",
      abilities: [
        {
          id: "47o7eanl1g-a1",
          kind: "card-resolution",
          text: "If damage would be dealt to your champion this turn, prevent 2 of that damage. Your champion becomes distant. Then you may pay (2). If you do, allies you control also become distant.",
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
              amount: 2,
            },
            afterApply: {
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
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "pay",
                        player: "controller",
                        cost: {
                          kind: "pay-reserve",
                          amount: 2,
                        },
                      },
                      {
                        kind: "set-object-state",
                        subject: {
                          kind: "each",
                          collection: {
                            zones: ["field"],
                            player: "controller",
                            filter: {
                              kind: "type",
                              oneOf: ["ALLY"],
                            },
                          },
                        },
                        state: "distant",
                        value: true,
                      },
                    ],
                  },
                },
              ],
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default falseStep;
