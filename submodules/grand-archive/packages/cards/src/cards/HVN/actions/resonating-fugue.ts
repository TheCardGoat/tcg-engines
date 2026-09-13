import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const resonatingFugue: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "optpu3fubb",
  slug: "resonating-fugue",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "optpu3fubb:face:default",
      catalogId: "optpu3fubb",
      name: "Resonating Fugue",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "MELODY"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\nSwitch the power and life stat of target Animal or Beast ally you control until end of turn. (Apply this effect after all other stat modifying effects.)",
      abilities: [
        {
          id: "optpu3fubb-a1",
          kind: "card-resolution",
          text: "[Class Bonus] This card costs 2 less to activate.\nSwitch the power and life stat of target Animal or Beast ally you control until end of turn. (Apply this effect after all other stat modifying effects.)",
          activationRules: [
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
                      kind: "any",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["ANIMAL"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
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
              sublayer: "swap",
            },
            change: {
              kind: "numeric",
              property: "power",
              operation: "swap",
              withProperty: "life",
            },
          },
        },
      ],
    },
  },
};

export default resonatingFugue;
