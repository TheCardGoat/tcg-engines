import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const roseEternalParagon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2bbmoqk2c7",
  slug: "rose-eternal-paragon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2bbmoqk2c7:face:default",
      catalogId: "2bbmoqk2c7",
      name: "Rose, Eternal Paragon",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN", "WARRIOR"],
        subtypes: ["GUARDIAN", "WARRIOR", "AUTOMATON"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Intercept, True Sight\n\n[Class Bonus] Fast Activation (You may activate this card at fast speed.)\n\n[Level 2+] On Enter: You may change the target of an attack to Rose. If you do, Rose gets +1 LIFE until end of turn.",
      abilities: [
        {
          id: "2bbmoqk2c7-a1",
          kind: "keyword-group",
          text: "Intercept, True Sight",
          keywords: [
            {
              name: "intercept",
            },
            {
              name: "true-sight",
            },
          ],
        },
        {
          id: "2bbmoqk2c7-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
          },
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
        },
        {
          id: "2bbmoqk2c7-a3",
          kind: "triggered",
          text: "[Level 2+] On Enter: You may change the target of an attack to Rose. If you do, Rose gets +1 LIFE until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "retarget",
                    subject: {
                      kind: "current-attack",
                    },
                    chooser: "controller",
                    newTarget: {
                      kind: "source",
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "continuous",
                    subjects: {
                      kind: "source",
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
                      amount: 1,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default roseEternalParagon;
