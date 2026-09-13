import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const radiantRepudiation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "RO2CcBrILQ",
  slug: "radiant-repudiation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "RO2CcBrILQ:face:default",
      catalogId: "RO2CcBrILQ",
      name: "Radiant Repudiation",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL", "REACTION"],
      },
      elements: ["NEOS"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prevent the next 4 damage that would be dealt to target neos element unit this turn. Whenever damage is prevented this way, deal 2 damage to target unit.",
      abilities: [
        {
          id: "RO2CcBrILQ-a1",
          kind: "card-resolution",
          text: "Prevent the next 4 damage that would be dealt to target neos element unit this turn. Whenever damage is prevented this way, deal 2 damage to target unit.",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "element",
                      oneOf: ["NEOS"],
                    },
                  ],
                },
              },
            },
            {
              id: "target-2",
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
              amount: 4,
              scope: "replacement-instance",
            },
            afterApply: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-2",
              },
              amount: 2,
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

export default radiantRepudiation;
