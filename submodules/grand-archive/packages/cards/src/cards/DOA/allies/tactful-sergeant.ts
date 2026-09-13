import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tactfulSergeant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7UXGwC7lSO",
  slug: "tactful-sergeant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7UXGwC7lSO:face:default",
      catalogId: "7UXGwC7lSO",
      name: "Tactful Sergeant",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText: "On Enter: If your champion has attacked this turn, draw a card into your memory.",
      abilities: [
        {
          id: "7UXGwC7lSO-a1",
          kind: "triggered",
          text: "On Enter: If your champion has attacked this turn, draw a card into your memory.",
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
            kind: "conditional",
            condition: {
              kind: "history",
              event: "attack-declared",
              window: "this-turn",
              actor: "controller",
              filter: {
                kind: "type",
                oneOf: ["CHAMPION"],
              },
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

export default tactfulSergeant;
