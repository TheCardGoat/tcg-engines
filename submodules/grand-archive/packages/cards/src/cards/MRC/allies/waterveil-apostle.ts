import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const waterveilApostle: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tiymuyv3fp",
  slug: "waterveil-apostle",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tiymuyv3fp:face:default",
      catalogId: "tiymuyv3fp",
      name: "Waterveil Apostle",
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
        power: 1,
        life: 4,
      },
      rulesText:
        "[Class Bonus] [Memory 4+] At the beginning of your recollection phase, gather. (Apply this effect only if your champion’s class matches this card’s class and only if there are four or more cards in your memory.)",
      abilities: [
        {
          id: "tiymuyv3fp-a1",
          kind: "triggered",
          text: "[Class Bonus] [Memory 4+] At the beginning of your recollection phase, gather. (Apply this effect only if your champion’s class matches this card’s class and only if there are four or more cards in your memory.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
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
            action: "gather",
          },
        },
      ],
    },
  },
};

export default waterveilApostle;
