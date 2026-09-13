import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const intervention: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vmqe225jkb",
  slug: "intervention",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vmqe225jkb:face:default",
      catalogId: "vmqe225jkb",
      name: "Intervention",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] While paying for this card's reserve cost, you may rest your champion to pay for 2 of that cost. (Apply this effect only if your champion's class matches this card's class)\n\nPrevent the next 4 damage that would be dealt to target unit this turn.",
      abilities: [
        {
          id: "vmqe225jkb-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] While paying for this card's reserve cost, you may rest your champion to pay for 2 of that cost. (Apply this effect only if your champion's class matches this card's class)",
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
              mode: "payment-contribution",
              action: "pay-cost",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              cost: {
                kind: "rest",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
              },
              amount: 2,
              contributionBasis: "total",
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "vmqe225jkb-a2",
          kind: "card-resolution",
          text: "Prevent the next 4 damage that would be dealt to target unit this turn.",
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
              amount: 4,
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

export default intervention;
