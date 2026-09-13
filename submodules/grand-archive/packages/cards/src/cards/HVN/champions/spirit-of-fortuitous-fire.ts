import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritOfFortuitousFire: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8mrjtrzx5t",
  slug: "spirit-of-fortuitous-fire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8mrjtrzx5t:face:default",
      catalogId: "8mrjtrzx5t",
      name: "Spirit of Fortuitous Fire",
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
      rulesText: "On Enter: Glimpse 7. Draw seven cards into your memory.",
      abilities: [
        {
          id: "8mrjtrzx5t-a1",
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

export default spiritOfFortuitousFire;
