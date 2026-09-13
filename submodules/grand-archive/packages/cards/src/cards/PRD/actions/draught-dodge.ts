import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const draughtDodge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "QFWIbwV25T",
  slug: "draught-dodge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "QFWIbwV25T:face:default",
      catalogId: "QFWIbwV25T",
      name: "Draught Dodge",
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
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prevent the next 2 damage that would be dealt to target unit this turn. \n\n[Class Bonus] If that unit is distant, draw a card into your memory. Otherwise, it becomes distant.",
      abilities: [
        {
          id: "QFWIbwV25T-a1",
          kind: "card-resolution",
          text: "Prevent the next 2 damage that would be dealt to target unit this turn.",
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
              amount: 2,
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "QFWIbwV25T-a2",
          kind: "card-resolution",
          text: "[Class Bonus] If that unit is distant, draw a card into your memory. Otherwise, it becomes distant.",
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
            kind: "conditional",
            condition: {
              kind: "object-state",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              state: "distant",
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
            else: {
              kind: "set-object-state",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              state: "distant",
              value: true,
            },
          },
        },
      ],
    },
  },
};

export default draughtDodge;
