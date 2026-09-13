import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const streamOfConsciousness: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wa4x7e22tk",
  slug: "stream-of-consciousness",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wa4x7e22tk:face:default",
      catalogId: "wa4x7e22tk",
      name: "Stream of Consciousness",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] [Memory 4+] Glimpse 3. (Apply this effect only if your champion's class matches this card's class and only if there are four or more cards in your memory.)\n\nDraw a card into your memory.",
      abilities: [
        {
          id: "wa4x7e22tk-a1",
          kind: "card-resolution",
          text: "[Class Bonus] [Memory 4+] Glimpse 3. (Apply this effect only if your champion's class matches this card's class and only if there are four or more cards in your memory.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "memory-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["memory"],
                      player: "controller",
                    },
                  },
                  operator: "gte",
                  right: 4,
                },
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 3,
          },
        },
        {
          id: "wa4x7e22tk-a2",
          kind: "card-resolution",
          text: "Draw a card into your memory.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default streamOfConsciousness;
