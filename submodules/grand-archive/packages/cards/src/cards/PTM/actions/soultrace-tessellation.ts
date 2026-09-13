import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const soultraceTessellation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7ePq6I4uZ8",
  slug: "soultrace-tessellation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7ePq6I4uZ8:face:default",
      catalogId: "7ePq6I4uZ8",
      name: "Soultrace Tessellation",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["CRUX"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prepare 1\n\nPut three sheen counters on target unit. If Soultrace Tessellation was prepared, put an additional sheen counter on that unit for every three cards in your banishment.",
      abilities: [
        {
          id: "7ePq6I4uZ8-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 1",
          keyword: {
            name: "prepare",
            value: 1,
          },
        },
        {
          id: "7ePq6I4uZ8-a2",
          kind: "card-resolution",
          text: "Put three sheen counters on target unit. If Soultrace Tessellation was prepared, put an additional sheen counter on that unit for every three cards in your banishment.",
          targets: [
            {
              id: "target-unit",
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
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-unit",
            },
            counter: {
              named: "sheen",
            },
            amount: {
              kind: "calculate",
              operator: "add",
              operands: [
                3,
                {
                  kind: "conditional",
                  condition: {
                    kind: "activation-state",
                    state: "prepared",
                  },
                  then: {
                    kind: "calculate",
                    operator: "divide",
                    operands: [
                      {
                        kind: "count",
                        collection: {
                          zones: ["banishment"],
                          player: "controller",
                        },
                      },
                      3,
                    ],
                    rounding: "down",
                  },
                  else: 0,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default soultraceTessellation;
