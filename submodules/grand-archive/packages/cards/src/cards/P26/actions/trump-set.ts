import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const trumpSet: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "w7g91ru45w",
  slug: "trump-set",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "w7g91ru45w:face:default",
      catalogId: "w7g91ru45w",
      name: "Trump Set",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SUITED", "SKILL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion's class matches this card's class)\n\nChange the target of an attack to a Suited ally you control. If you do, that ally gets +3POWER and +3LIFE until end of turn.",
      abilities: [
        {
          id: "w7g91ru45w-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion's class matches this card's class)",
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
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "w7g91ru45w-a2",
          kind: "card-resolution",
          text: "Change the target of an attack to a Suited ally you control. If you do, that ally gets +3POWER and +3LIFE until end of turn.",
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-suited-ally",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SUITED"],
                    },
                  ],
                },
              },
            },
            effect: {
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
                      kind: "bound",
                      binding: "chosen-suited-ally",
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
                    kind: "sequence",
                    effects: [
                      {
                        kind: "continuous",
                        subjects: {
                          kind: "bound",
                          binding: "chosen-suited-ally",
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
                          amount: 3,
                        },
                      },
                      {
                        kind: "continuous",
                        subjects: {
                          kind: "bound",
                          binding: "chosen-suited-ally",
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
                    ],
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

export default trumpSet;
