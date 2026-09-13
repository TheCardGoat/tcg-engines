import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritOfWind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pNiyaGlIe7",
  slug: "spirit-of-wind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pNiyaGlIe7:face:default",
      catalogId: "pNiyaGlIe7",
      name: "Spirit of Wind",
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
      elements: ["WIND"],
      stats: {
        level: 0,
        life: 15,
      },
      rulesText: "On Enter: Draw seven cards.",
      abilities: [
        {
          id: "pNiyaGlIe7-a1",
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

export default spiritOfWind;
