import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aithneSpiritOfFire: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "eb3ib5el99",
  slug: "aithne-spirit-of-fire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "eb3ib5el99:face:default",
      catalogId: "eb3ib5el99",
      name: "Aithne, Spirit of Fire",
      lineageName: "Aithne",
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
          id: "eb3ib5el99-a1",
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

export default aithneSpiritOfFire;
