import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const brissaSpiritOfWind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7wra95faoq",
  slug: "brissa-spirit-of-wind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7wra95faoq:face:default",
      catalogId: "7wra95faoq",
      name: "Brissa, Spirit of Wind",
      lineageName: "Brissa",
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
          id: "7wra95faoq-a1",
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

export default brissaSpiritOfWind;
