import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const veiledDash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "08kuz07nk4",
  slug: "veiled-dash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "08kuz07nk4:face:default",
      catalogId: "08kuz07nk4",
      name: "Veiled Dash",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nUp to two target units become distant, then reveal any amount of wind element cards from your memory. Prevent the next X damage that would be dealt to each of those units this turn where X is the amount of wind element cards revealed this way.",
      abilities: [
        {
          id: "08kuz07nk4-a1",
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
          id: "08kuz07nk4-a2",
          kind: "card-resolution",
          text: "Up to two target units become distant, then reveal any amount of wind element cards from your memory. Prevent the next X damage that would be dealt to each of those units this turn where X is the amount of wind element cards revealed this way.",
          targets: [
            {
              id: "target-units",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
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
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  binding: "revealed-wind-cards",
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-units",
                },
                state: "distant",
                value: true,
              },
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-wind-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "element",
                      oneOf: ["WIND"],
                    },
                  },
                },
              },
              {
                kind: "replacement",
                event: {
                  name: "damage-dealt",
                  recipient: {
                    kind: "bound-object",
                    binding: "target-units",
                  },
                },
                operation: {
                  kind: "prevent",
                },
                capacity: {
                  amount: {
                    kind: "count",
                    collection: {
                      binding: "revealed-wind-cards",
                    },
                  },
                  scope: "per-object",
                },
                duration: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default veiledDash;
