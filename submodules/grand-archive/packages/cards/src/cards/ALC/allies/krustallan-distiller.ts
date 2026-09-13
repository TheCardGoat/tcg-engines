import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const krustallanDistiller: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "c08c9htu9a",
  slug: "krustallan-distiller",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "c08c9htu9a:face:default",
      catalogId: "c08c9htu9a",
      name: "Krustallan Distiller",
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
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Enter: If you've brewed a Potion this turn, draw a card into your memory. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "c08c9htu9a-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: If you've brewed a Potion this turn, draw a card into your memory. (Apply this effect only if your champion's class matches this card's class.)",
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
              kind: "history",
              event: "card-activated",
              window: "this-turn",
              actor: "controller",
              filter: {
                kind: "subtype",
                oneOf: ["POTION"],
              },
              activationState: "brewed",
              minimum: 1,
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
      ],
    },
  },
};

export default krustallanDistiller;
