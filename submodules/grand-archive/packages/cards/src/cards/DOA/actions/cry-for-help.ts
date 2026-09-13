import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cryForHelp: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nIKhHFa0rK",
  slug: "cry-for-help",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nIKhHFa0rK:face:default",
      catalogId: "nIKhHFa0rK",
      name: "Cry for Help",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Change the target of an attack that targets your champion to an ally you control. Class Bonus: That ally gets +1 LIFE until end of turn.",
      abilities: [
        {
          id: "nIKhHFa0rK-a1",
          kind: "card-resolution",
          text: "Change the target of an attack that targets your champion to an ally you control. Class Bonus: That ally gets +1 LIFE until end of turn.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "conditional",
                condition: {
                  kind: "current-attack-target-matches",
                  controller: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
                then: {
                  kind: "choose",
                  selection: {
                    id: "target-1",
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
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                  effect: {
                    kind: "retarget",
                    subject: {
                      kind: "current-attack",
                    },
                    chooser: "controller",
                    newTarget: {
                      kind: "bound",
                      binding: "target-1",
                    },
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "champion-matches-source",
                  characteristic: "class",
                },
                then: {
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
                    amount: 1,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default cryForHelp;
