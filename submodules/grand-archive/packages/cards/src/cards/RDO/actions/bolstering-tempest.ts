import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bolsteringTempest: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "PwHub76Fw4",
  slug: "bolstering-tempest",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "PwHub76Fw4:face:default",
      catalogId: "PwHub76Fw4",
      name: "Bolstering Tempest",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["EXALTED", "WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "This card costs 2 more to activate for each\ntarget beyond the first.\n\nAny amount of target Human allies get +3POWER until end of turn.",
      abilities: [
        {
          id: "PwHub76Fw4-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 2 more to activate for each\ntarget beyond the first.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "add",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "calculate",
                    operator: "maximum",
                    operands: [
                      {
                        kind: "calculate",
                        operator: "subtract",
                        operands: [
                          {
                            kind: "target-count",
                            ability: "this",
                          },
                          1,
                        ],
                      },
                      0,
                    ],
                  },
                  2,
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "PwHub76Fw4-a2",
          kind: "card-resolution",
          text: "Any amount of target Human allies get +3POWER until end of turn.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "any-number",
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
              property: "power",
              operation: "add",
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default bolsteringTempest;
