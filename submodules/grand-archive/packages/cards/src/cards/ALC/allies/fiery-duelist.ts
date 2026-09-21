import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fieryDuelist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wc8tuhuy4x",
  slug: "fiery-duelist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wc8tuhuy4x:face:default",
      catalogId: "wc8tuhuy4x",
      name: "Fiery Duelist",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)\n\nOn Enter: You may discard a fire element card. If you do, draw a card and Fiery Duelist becomes distant. (Units stay distant until the end of their controller's turn.)",
      abilities: [
        {
          id: "wc8tuhuy4x-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
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
        },
        {
          id: "wc8tuhuy4x-a2",
          kind: "triggered",
          text: "On Enter: You may discard a fire element card. If you do, draw a card and Fiery Duelist becomes distant. (Units stay distant until the end of their controller's turn.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "discard",
                    player: "controller",
                    selection: {
                      id: "discarded-card",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["hand"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["FIRE"],
                        },
                      },
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "draw",
                        player: "controller",
                        amount: 1,
                      },
                      {
                        kind: "set-object-state",
                        subject: {
                          kind: "source",
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
        },
      ],
    },
  },
};

export default fieryDuelist;
