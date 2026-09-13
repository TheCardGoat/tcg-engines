import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const kazeSpiritOfWind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FwXm0Bb6di",
  slug: "kaze-spirit-of-wind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FwXm0Bb6di:face:default",
      catalogId: "FwXm0Bb6di",
      name: "Kaze, Spirit of Wind",
      lineageName: "Kaze",
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
          id: "FwXm0Bb6di-a1",
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

export default kazeSpiritOfWind;
