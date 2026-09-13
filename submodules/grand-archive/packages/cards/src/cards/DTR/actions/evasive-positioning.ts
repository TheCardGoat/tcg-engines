import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const evasivePositioning: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ddp7twycdq",
  slug: "evasive-positioning",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ddp7twycdq:face:default",
      catalogId: "ddp7twycdq",
      name: "Evasive Positioning",
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
        "Prevent the next 2 damage that would be dealt to target unit this turn. If that unit is a champion, it becomes distant.",
      abilities: [
        {
          id: "ddp7twycdq-a1",
          kind: "card-resolution",
          text: "Prevent the next 2 damage that would be dealt to target unit this turn. If that unit is a champion, it becomes distant.",
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
                  amount: 2,
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
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
                then: {
                  kind: "set-object-state",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  state: "distant",
                  value: true,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default evasivePositioning;
