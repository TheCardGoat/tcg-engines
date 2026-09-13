import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dinahLostSpirit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gOus3YnrRq",
  slug: "dinah-lost-spirit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gOus3YnrRq:face:default",
      catalogId: "gOus3YnrRq",
      name: "Dinah, Lost Spirit",
      lineageName: "Dinah",
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
          id: "gOus3YnrRq-a1",
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

export default dinahLostSpirit;
