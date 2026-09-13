import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blazingDestrier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ptY1FUlbbs",
  slug: "blazing-destrier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ptY1FUlbbs:face:default",
      catalogId: "ptY1FUlbbs",
      name: "Blazing Destrier",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "HORSE"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Steadfast (This ally can retaliate while rested and doesn’t rest to do so.)\n\nWhenever Blazing Destrier is attacked, deal 2 damage to the attacker and your champion.",
      abilities: [
        {
          id: "ptY1FUlbbs-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Steadfast (This ally can retaliate while rested and doesn’t rest to do so.)",
          keyword: {
            name: "steadfast",
          },
        },
        {
          id: "ptY1FUlbbs-a2",
          kind: "triggered",
          text: "Whenever Blazing Destrier is attacked, deal 2 damage to the attacker and your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              recipient: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "event-attacker",
                },
                amount: 2,
              },
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "champion",
                  player: "controller",
                },
                amount: 2,
              },
            ],
          },
        },
      ],
    },
  },
};

export default blazingDestrier;
