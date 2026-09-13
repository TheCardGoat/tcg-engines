import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const beckonAttention: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rTesQpssPz",
  slug: "beckon-attention",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "rTesQpssPz:face:default",
      catalogId: "rTesQpssPz",
      name: "Beckon Attention",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nChange the target of an attack that targets a unit you don't control to your champion. If you do, you gain the Crowd's Favor status.",
      abilities: [
        {
          id: "rTesQpssPz-a1",
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
          id: "rTesQpssPz-a2",
          kind: "card-resolution",
          text: "Change the target of an attack that targets a unit you don't control to your champion. If you do, you gain the Crowd's Favor status.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "current-attack-target-matches",
              controller: "opponent",
              filter: {
                kind: "type",
                oneOf: ["ALLY", "CHAMPION"],
              },
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  bindSucceededAs: "attack-retargeted",
                  effect: {
                    kind: "retarget",
                    subject: {
                      kind: "current-attack",
                    },
                    chooser: "controller",
                    newTarget: {
                      kind: "champion",
                      player: "controller",
                    },
                  },
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "attack-retargeted",
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
              ],
            },
          },
        },
      ],
    },
  },
};

export default beckonAttention;
