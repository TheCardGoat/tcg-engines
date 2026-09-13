import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const desperateDive: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oz13xfpk9x",
  slug: "desperate-dive",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oz13xfpk9x:face:default",
      catalogId: "oz13xfpk9x",
      name: "Desperate Dive",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nPrevent the next X damage that would be dealt to target unit you control this turn where X is the amount of water element cards in your graveyard. That unit becomes distant.",
      abilities: [
        {
          id: "oz13xfpk9x-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
          id: "oz13xfpk9x-a2",
          kind: "card-resolution",
          text: "Prevent the next X damage that would be dealt to target unit you control this turn where X is the amount of water element cards in your graveyard. That unit becomes distant.",
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
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
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
                  zones: ["graveyard"],
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["WATER"],
                  },
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
                  amount: {
                    kind: "variable",
                    symbol: "X",
                  },
                  scope: "replacement-instance",
                },
                duration: {
                  kind: "this-turn",
                },
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                state: "distant",
                value: true,
              },
            ],
          },
        },
      ],
    },
  },
};

export default desperateDive;
