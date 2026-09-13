import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const austerePriestess: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dwirzelaqo",
  slug: "austere-priestess",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dwirzelaqo:face:default",
      catalogId: "dwirzelaqo",
      name: "Austere Priestess",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: If you have no cards in your hand, draw a card. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "dwirzelaqo-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: If you have no cards in your hand, draw a card. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "count",
                  collection: {
                    zones: ["hand"],
                    player: "controller",
                  },
                },
                operator: "eq",
                right: 0,
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default austerePriestess;
