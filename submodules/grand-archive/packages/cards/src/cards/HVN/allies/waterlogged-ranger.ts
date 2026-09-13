import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const waterloggedRanger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3w5wskifp2",
  slug: "waterlogged-ranger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3w5wskifp2:face:default",
      catalogId: "3w5wskifp2",
      name: "Waterlogged Ranger",
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
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)\n\nDeluge 3 — On Enter: If you have three or more water element cards in your graveyard, Waterlogged Ranger becomes distant. (Units stay distant until the end of their controller's turn.)",
      abilities: [
        {
          id: "3w5wskifp2-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "3w5wskifp2-a2",
          kind: "triggered",
          text: "Deluge 3 — On Enter: If you have three or more water element cards in your graveyard, Waterlogged Ranger becomes distant. (Units stay distant until the end of their controller's turn.)",
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
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
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
                operator: "gte",
                right: 3,
              },
            },
            then: {
              kind: "set-object-state",
              subject: {
                kind: "source",
              },
              state: "distant",
              value: true,
            },
          },
          label: {
            name: "Deluge 3",
          },
        },
      ],
    },
  },
};

export default waterloggedRanger;
