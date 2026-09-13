import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const clumsyApprentice: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "LZ8JpWj27h",
  slug: "clumsy-apprentice",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "LZ8JpWj27h:face:default",
      catalogId: "LZ8JpWj27h",
      name: "Clumsy Apprentice",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText: "On Enter: Deal 2 damage to your champion. Draw a card.",
      abilities: [
        {
          id: "LZ8JpWj27h-a1",
          kind: "triggered",
          text: "On Enter: Deal 2 damage to your champion. Draw a card.",
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
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "champion",
                  player: "controller",
                },
                amount: 2,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default clumsyApprentice;
