import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const morriganLostSpirit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0rapy8v7x0",
  slug: "morrigan-lost-spirit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0rapy8v7x0:face:default",
      catalogId: "0rapy8v7x0",
      name: "Morrigan, Lost Spirit",
      lineageName: "Morrigan",
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
          id: "0rapy8v7x0-a1",
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

export default morriganLostSpirit;
