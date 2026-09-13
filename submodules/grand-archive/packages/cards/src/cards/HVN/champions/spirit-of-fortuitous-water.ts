import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritOfFortuitousWater: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "q6prapdczd",
  slug: "spirit-of-fortuitous-water",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "q6prapdczd:face:default",
      catalogId: "q6prapdczd",
      name: "Spirit of Fortuitous Water",
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
      rulesText: "On Enter: Glimpse 7. Draw seven cards into your memory.",
      abilities: [
        {
          id: "q6prapdczd-a1",
          kind: "triggered",
          text: "On Enter: Glimpse 7. Draw seven cards into your memory.",
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
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 7,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 7,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default spiritOfFortuitousWater;
