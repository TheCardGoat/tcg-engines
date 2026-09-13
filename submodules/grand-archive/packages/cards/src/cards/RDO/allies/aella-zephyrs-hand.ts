import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aellaZephyrsHand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "G8pN8Hackq",
  slug: "aella-zephyrs-hand",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "G8pN8Hackq:face:default",
      catalogId: "G8pN8Hackq",
      name: "Aella, Zephyr's Hand",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["EXALTED", "WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Fast Activation\n\n(3): As a Spell, suppress another target ally, item, or weapon. This ability costs (3) less to activate the first time you activate it.",
      abilities: [
        {
          id: "G8pN8Hackq-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Fast Activation",
          keyword: {
            name: "fast-activation",
          },
        },
        {
          id: "G8pN8Hackq-a2",
          kind: "activated",
          text: "(3): As a Spell, suppress another target ally, item, or weapon. This ability costs (3) less to activate the first time you activate it.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 3,
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: 3,
              condition: {
                kind: "ability-activation-count",
                ability: "this",
                scope: "source-instance",
                window: "this-turn",
                operator: "eq",
                value: 0,
              },
            },
          ],
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
                      oneOf: ["ALLY", "ITEM", "WEAPON"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "keyword-action",
              action: "suppress",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
            },
          },
        },
      ],
    },
  },
};

export default aellaZephyrsHand;
