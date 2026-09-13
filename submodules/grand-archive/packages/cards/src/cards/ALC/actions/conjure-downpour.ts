import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const conjureDownpour: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "r0zadf9q1w",
  slug: "conjure-downpour",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "r0zadf9q1w:face:default",
      catalogId: "r0zadf9q1w",
      name: "Conjure Downpour",
      cost: {
        kind: "reserve",
        amount: 3,
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
        "Until end of turn, whenever a unit attacks, that attack gets -2 POWER. \n\n[Class Bonus] [Memory 4+] Draw a card into your memory. (Apply this effect only if your champion's class matches this card's class and only if there are four or more cards in your memory.)",
      abilities: [
        {
          id: "r0zadf9q1w-a1",
          kind: "card-resolution",
          text: "Until end of turn, whenever a unit attacks, that attack gets -2 POWER.",
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "attack-declared",
                subject: {
                  kind: "event-object",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                },
              },
            },
            effect: {
              kind: "continuous",
              subjects: {
                kind: "event-source",
              },
              affectedSet: "locked",
              duration: {
                kind: "this-attack",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "subtract",
                amount: 2,
              },
            },
            expires: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "r0zadf9q1w-a2",
          kind: "card-resolution",
          text: "[Class Bonus] [Memory 4+] Draw a card into your memory. (Apply this effect only if your champion's class matches this card's class and only if there are four or more cards in your memory.)",
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

export default conjureDownpour;
