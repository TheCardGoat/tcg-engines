import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritOfFire: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "LMyKyVC2O9",
  slug: "spirit-of-fire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "LMyKyVC2O9:face:default",
      catalogId: "LMyKyVC2O9",
      name: "Spirit of Fire",
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
      elements: ["FIRE"],
      stats: {
        level: 0,
        life: 15,
      },
      rulesText: "On Enter: Draw seven cards.",
      abilities: [
        {
          id: "LMyKyVC2O9-a1",
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

export default spiritOfFire;
