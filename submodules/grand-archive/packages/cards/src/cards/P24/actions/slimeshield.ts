import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slimeshield: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hcpetipurz",
  slug: "slimeshield",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hcpetipurz:face:default",
      catalogId: "hcpetipurz",
      name: "Slimeshield",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SLIME", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] [Level 2+] This card costs 1 less to activate.\n\nPrevent the next 3 damage that would be dealt to target unit this turn. If that unit is a Slime ally, put a buff counter on it.",
      abilities: [
        {
          id: "hcpetipurz-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 2+] This card costs 1 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
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
          id: "hcpetipurz-a2",
          kind: "card-resolution",
          text: "Prevent the next 3 damage that would be dealt to target unit this turn. If that unit is a Slime ally, put a buff counter on it.",
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
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "replacement",
                event: {
                  name: "damage-dealt",
                  recipient: {
                    kind: "bound-object",
                    binding: "target-1",
                  },
                },
                operation: {
                  kind: "prevent",
                },
                capacity: {
                  amount: 3,
                  scope: "replacement-instance",
                },
                duration: {
                  kind: "this-turn",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SLIME"],
                      },
                    ],
                  },
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "event-subject",
                  },
                  counter: "buff",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default slimeshield;
