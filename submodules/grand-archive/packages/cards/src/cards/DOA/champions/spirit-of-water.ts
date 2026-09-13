import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritOfWater: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tafqldAGRF",
  slug: "spirit-of-water",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tafqldAGRF:face:default",
      catalogId: "tafqldAGRF",
      name: "Spirit of Water",
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
      rulesText: "On Enter: Draw seven cards.",
      abilities: [
        {
          id: "tafqldAGRF-a1",
          kind: "triggered",
          text: "On Enter: Draw seven cards.",
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

export default spiritOfWater;
