import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fatestoneOfBalance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v4gtq1ibth",
  slug: "fatestone-of-balance",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "v4gtq1ibth:face:default",
      catalogId: "v4gtq1ibth",
      name: "Fatestone of Balance",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Guo Jia Bonus] Whenever an opponent activates a card, if that opponent has exactly three cards in their memory, transform Fatestone of Balance. (Apply this effect only if your champion is Guo Jia.)",
      abilities: [
        {
          id: "v4gtq1ibth-a1",
          kind: "triggered",
          text: "[Guo Jia Bonus] Whenever an opponent activates a card, if that opponent has exactly three cards in their memory, transform Fatestone of Balance. (Apply this effect only if your champion is Guo Jia.)",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "opponent",
            },
          },
          interveningCondition: {
            kind: "player-zone-count",
            players: "event-actor",
            quantifier: "all",
            zone: "memory",
            operator: "eq",
            value: 3,
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "transform",
            subject: {
              kind: "source",
            },
          },
        },
      ],
    },
    flipFace: {
      id: "v4gtq1ibth:face:flip",
      catalogId: "cl8s8yxarq",
      name: "Woodland Shoats",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "BOAR"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText: "Steadfast (This ally can retaliate while rested and doesn't rest to do so.)",
      abilities: [
        {
          id: "cl8s8yxarq-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Steadfast (This ally can retaliate while rested and doesn't rest to do so.)",
          keyword: {
            name: "steadfast",
          },
        },
      ],
    },
  },
};

export default fatestoneOfBalance;
