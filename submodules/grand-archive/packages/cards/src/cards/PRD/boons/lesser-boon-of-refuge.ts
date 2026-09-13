import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfRefuge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Wk4Pc7bj21",
  slug: "lesser-boon-of-refuge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Wk4Pc7bj21:face:default",
      catalogId: "Wk4Pc7bj21",
      name: "Lesser Boon of Refuge",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "As you gain this boon, prevent the next 2+X+Y damage that would be dealt to target object this turn, where X is the amount of wind element boons in your pantheon, and Y is the amount of wind element cards in your champion's lineage.",
      abilities: [
        {
          id: "Wk4Pc7bj21-a1",
          kind: "triggered",
          text: "As you gain this boon, prevent the next 2+X+Y damage that would be dealt to target object this turn, where X is the amount of wind element boons in your pantheon, and Y is the amount of wind element cards in your champion's lineage.",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
              subject: {
                kind: "source",
              },
            },
          },
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
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["pantheon"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["WIND"],
                      },
                      {
                        kind: "type",
                        oneOf: ["GREATER BOON", "LESSER BOON"],
                      },
                    ],
                  },
                },
              },
            },
            {
              symbol: "Y",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["inner-lineage"],
                  host: {
                    kind: "champion",
                    player: "controller",
                  },
                  relationship: "lineage-of",
                  filter: {
                    kind: "element",
                    oneOf: ["WIND"],
                  },
                },
              },
            },
          ],
          effect: {
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
              amount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  {
                    kind: "calculate",
                    operator: "add",
                    operands: [
                      2,
                      {
                        kind: "variable",
                        symbol: "X",
                      },
                    ],
                  },
                  {
                    kind: "variable",
                    symbol: "Y",
                  },
                ],
              },
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfRefuge;
