import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const righteousRetribution: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TO9qqKHakv",
  slug: "righteous-retribution",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TO9qqKHakv:face:default",
      catalogId: "TO9qqKHakv",
      name: "Righteous Retribution",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL", "REACTION"],
      },
      elements: ["EXALTED", "FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nThe next time damage would be dealt to your champion this turn, prevent 5 of that damage. Your champion’s first attack during your next turn gets +X POWER, where X is the amount of damage prevented this way. ",
      abilities: [
        {
          id: "TO9qqKHakv-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
          id: "TO9qqKHakv-a2",
          kind: "card-resolution",
          text: "The next time damage would be dealt to your champion this turn, prevent 5 of that damage. Your champion’s first attack during your next turn gets +X POWER, where X is the amount of damage prevented this way.",
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
              amount: 5,
            },
            afterApply: {
              kind: "bind-value",
              value: {
                kind: "modified-ability-result-amount",
                metric: "damage-prevented",
              },
              bindAs: "prevented-damage",
              effect: {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "turn-begins",
                    actor: "controller",
                  },
                },
                limit: 1,
                effect: {
                  kind: "create-delayed-trigger",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "attack-declared",
                      subject: {
                        kind: "event-object",
                        controller: "controller",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                    },
                  },
                  limit: 1,
                  expires: {
                    kind: "this-turn",
                  },
                  effect: {
                    kind: "continuous",
                    subjects: {
                      kind: "event-subject",
                    },
                    affectedSet: "locked",
                    duration: {
                      kind: "this-attack",
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
                        kind: "binding",
                        binding: "prevented-damage",
                      },
                    },
                  },
                },
              },
            },
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default righteousRetribution;
