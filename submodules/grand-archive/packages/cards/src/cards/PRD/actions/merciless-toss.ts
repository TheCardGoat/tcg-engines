import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mercilessToss: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ZIU4bH6D9q",
  slug: "merciless-toss",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ZIU4bH6D9q:face:default",
      catalogId: "ZIU4bH6D9q",
      name: "Merciless Toss",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion's class matches this card's class.)\n\nDeal 6 damage to target ally if it's damaged. Otherwise, deal 2 damage to it.",
      abilities: [
        {
          id: "ZIU4bH6D9q-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
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
          id: "ZIU4bH6D9q-a2",
          kind: "card-resolution",
          text: "Deal 6 damage to target ally if it's damaged. Otherwise, deal 2 damage to it.",
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
                  oneOf: ["ALLY"],
                },
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
              state: "damaged",
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 6,
            },
            else: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default mercilessToss;
