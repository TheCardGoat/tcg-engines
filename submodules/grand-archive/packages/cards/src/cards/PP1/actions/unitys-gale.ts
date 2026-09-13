import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const unitysGale: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uUWsgLmyTk",
  slug: "unitys-gale",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "uUWsgLmyTk:face:default",
      catalogId: "uUWsgLmyTk",
      name: "Unity's Gale",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target ally gets +3LIFE until end of turn. \n\nAt the beginning of the next end phase, if that ally is damaged and you don't control it, you gain the Crowd's Favor status.",
      abilities: [
        {
          id: "uUWsgLmyTk-a1",
          kind: "card-resolution",
          text: "Target ally gets +3LIFE until end of turn.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
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
              property: "life",
              operation: "add",
              amount: 3,
            },
          },
        },
        {
          id: "uUWsgLmyTk-a2",
          kind: "ability-modifier",
          text: "At the beginning of the next end phase, if that ally is damaged and you don't control it, you gain the Crowd's Favor status.",
          modifies: {
            kind: "preceding-non-modifier-ability",
          },
          operation: {
            kind: "append-effect",
            effect: {
              kind: "create-delayed-trigger",
              trigger: {
                kind: "event",
                event: {
                  name: "phase-begins",
                  phase: "end",
                },
              },
              limit: 1,
              effect: {
                kind: "conditional",
                condition: {
                  kind: "all",
                  conditions: [
                    {
                      kind: "object-state",
                      subject: {
                        kind: "bound",
                        binding: "target-1",
                      },
                      state: "damaged",
                    },
                    {
                      kind: "not",
                      condition: {
                        kind: "controls-subject",
                        player: "controller",
                        subject: {
                          kind: "bound",
                          binding: "target-1",
                        },
                      },
                    },
                  ],
                },
                then: {
                  kind: "set-player-state",
                  player: "controller",
                  state: {
                    named: "crowds-favor",
                  },
                  value: true,
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default unitysGale;
