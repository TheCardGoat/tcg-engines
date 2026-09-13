import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const plantedExplosive: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5X5W2Uda5a",
  slug: "planted-explosive",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5X5W2Uda5a:face:default",
      catalogId: "5X5W2Uda5a",
      name: "Planted Explosive",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prepare 1 (You may remove a preparation counter from your champion as you activate this card.)\n\nDeal 2 damage to target unit. If Planted Explosive was prepared, deal 4 damage to that unit instead.",
      abilities: [
        {
          id: "5X5W2Uda5a-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 1 (You may remove a preparation counter from your champion as you activate this card.)",
          keyword: {
            name: "prepare",
            value: 1,
          },
        },
        {
          id: "5X5W2Uda5a-a2",
          kind: "card-resolution",
          text: "Deal 2 damage to target unit. If Planted Explosive was prepared, deal 4 damage to that unit instead.",
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
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "prepared",
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
              amount: 4,
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

export default plantedExplosive;
