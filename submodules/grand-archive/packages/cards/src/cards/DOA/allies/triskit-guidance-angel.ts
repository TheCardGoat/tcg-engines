import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const triskitGuidanceAngel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ilW4cRlI0C",
  slug: "triskit-guidance-angel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ilW4cRlI0C:face:default",
      catalogId: "ilW4cRlI0C",
      name: "Triskit, Guidance Angel",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ANGEL"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 2,
        life: 12,
      },
      rulesText:
        "(Unique — You can control only one object with this card's name.)\n\nFire, water and wind elements are enabled for you.\n\nOn Enter: You may banish your champion. If you do, Triskit becomes a unique champion with base level 3.",
      abilities: [
        {
          id: "ilW4cRlI0C-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Unique — You can control only one object with this card's name.)",
          keyword: {
            name: "unique",
          },
        },
        {
          id: "ilW4cRlI0C-a2",
          kind: "static",
          staticKind: "effects",
          text: "Fire, water and wind elements are enabled for you.",
          effects: [
            {
              kind: "continuous-player-state",
              players: "controller",
              state: {
                named: "enabled-element",
                value: "FIRE",
              },
              value: true,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
            {
              kind: "continuous-player-state",
              players: "controller",
              state: {
                named: "enabled-element",
                value: "WATER",
              },
              value: true,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
            {
              kind: "continuous-player-state",
              players: "controller",
              state: {
                named: "enabled-element",
                value: "WIND",
              },
              value: true,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ilW4cRlI0C-a3",
          kind: "triggered",
          text: "On Enter: You may banish your champion. If you do, Triskit becomes a unique champion with base level 3.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish-object",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                },
                {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "continuous",
                      subjects: {
                        kind: "source",
                      },
                      affectedSet: "locked",
                      duration: {
                        kind: "permanent",
                      },
                      layer: {
                        layer: "B",
                        modifies: "type",
                      },
                      change: {
                        kind: "set-types",
                        types: ["CHAMPION"],
                      },
                    },
                    {
                      kind: "continuous",
                      subjects: {
                        kind: "source",
                      },
                      affectedSet: "locked",
                      duration: {
                        kind: "permanent",
                      },
                      layer: {
                        layer: "B",
                        modifies: "type",
                      },
                      change: {
                        kind: "add-characteristic",
                        characteristic: {
                          kind: "supertype",
                          value: "UNIQUE",
                        },
                      },
                    },
                    {
                      kind: "continuous",
                      subjects: {
                        kind: "source",
                      },
                      affectedSet: "locked",
                      duration: {
                        kind: "permanent",
                      },
                      layer: {
                        layer: "A",
                        modifies: "base-stats",
                      },
                      change: {
                        kind: "numeric",
                        property: "level",
                        operation: "set",
                        amount: 3,
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default triskitGuidanceAngel;
