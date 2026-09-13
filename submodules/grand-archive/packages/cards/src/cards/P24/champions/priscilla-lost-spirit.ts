import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const priscillaLostSpirit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2zr5ys29xx",
  slug: "priscilla-lost-spirit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2zr5ys29xx:face:default",
      catalogId: "2zr5ys29xx",
      name: "Priscilla, Lost Spirit",
      lineageName: "Priscilla",
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
      elements: ["NORM"],
      stats: {
        level: 0,
        life: 15,
      },
      rulesText: "On Enter: Draw seven cards.",
      abilities: [
        {
          id: "2zr5ys29xx-a1",
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

export default priscillaLostSpirit;
