import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shiraLostSpirit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1gpd7mbroj",
  slug: "shira-lost-spirit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1gpd7mbroj:face:default",
      catalogId: "1gpd7mbroj",
      name: "Shira, Lost Spirit",
      lineageName: "Shira",
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
          id: "1gpd7mbroj-a1",
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

export default shiraLostSpirit;
