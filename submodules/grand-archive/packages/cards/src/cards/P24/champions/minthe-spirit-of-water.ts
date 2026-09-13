import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mintheSpiritOfWater: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tiynu4lxnj",
  slug: "minthe-spirit-of-water",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tiynu4lxnj:face:default",
      catalogId: "tiynu4lxnj",
      name: "Minthe, Spirit of Water",
      lineageName: "Minthe",
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
          id: "tiynu4lxnj-a1",
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

export default mintheSpiritOfWater;
