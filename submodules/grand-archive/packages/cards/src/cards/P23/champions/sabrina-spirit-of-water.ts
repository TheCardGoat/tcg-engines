import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sabrinaSpiritOfWater: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tk3ir1o0qt",
  slug: "sabrina-spirit-of-water",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tk3ir1o0qt:face:default",
      catalogId: "tk3ir1o0qt",
      name: "Sabrina, Spirit of Water",
      lineageName: "Sabrina",
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
          id: "tk3ir1o0qt-a1",
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

export default sabrinaSpiritOfWater;
