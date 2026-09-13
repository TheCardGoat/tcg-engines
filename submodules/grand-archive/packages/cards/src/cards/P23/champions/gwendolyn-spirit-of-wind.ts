import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gwendolynSpiritOfWind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "74wa4x7e22",
  slug: "gwendolyn-spirit-of-wind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "74wa4x7e22:face:default",
      catalogId: "74wa4x7e22",
      name: "Gwendolyn, Spirit of Wind",
      lineageName: "Gwendolyn",
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
          id: "74wa4x7e22-a1",
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

export default gwendolynSpiritOfWind;
