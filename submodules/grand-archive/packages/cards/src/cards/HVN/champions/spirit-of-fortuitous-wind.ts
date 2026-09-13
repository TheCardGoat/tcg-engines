import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritOfFortuitousWind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gqxdu1fn5b",
  slug: "spirit-of-fortuitous-wind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gqxdu1fn5b:face:default",
      catalogId: "gqxdu1fn5b",
      name: "Spirit of Fortuitous Wind",
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
      rulesText: "On Enter: Glimpse 7. Draw seven cards into your memory.",
      abilities: [
        {
          id: "gqxdu1fn5b-a1",
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

export default spiritOfFortuitousWind;
