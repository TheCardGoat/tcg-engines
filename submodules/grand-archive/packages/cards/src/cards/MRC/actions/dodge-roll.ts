import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dodgeRoll: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gcom2ry208",
  slug: "dodge-roll",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gcom2ry208:face:default",
      catalogId: "gcom2ry208",
      name: "Dodge Roll",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prevent the next 3 non-combat damage that would be dealt to target unit you control this turn. That unit becomes distant. (Units stay distant until the end of their controller’s turn.)",
      abilities: [
        {
          id: "gcom2ry208-a1",
          kind: "card-resolution",
          text: "Prevent the next 3 non-combat damage that would be dealt to target unit you control this turn. That unit becomes distant. (Units stay distant until the end of their controller’s turn.)",
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
                relationship: "controlled-by",
                player: "controller",
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
                    binding: "target-unit",
                  },
                  combatDamage: false,
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
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-unit",
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

export default dodgeRoll;
