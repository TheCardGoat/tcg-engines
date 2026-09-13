import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const miaoSpiritOfWater: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "U5rkT0JRzC",
  slug: "miao-spirit-of-water",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "U5rkT0JRzC:face:default",
      catalogId: "U5rkT0JRzC",
      name: "Miao, Spirit of Water",
      lineageName: "Miao",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["SPIRIT"],
        subtypes: ["SPIRIT"],
      },
      elements: ["WATER"],
      stats: {
        level: 0,
        life: 15,
      },
      rulesText: "On Enter: Draw seven  cards.",
      abilities: [
        {
          id: "U5rkT0JRzC-a1",
          kind: "triggered",
          text: "On Enter: Draw seven  cards.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 7,
          },
        },
      ],
    },
  },
};

export default miaoSpiritOfWater;
