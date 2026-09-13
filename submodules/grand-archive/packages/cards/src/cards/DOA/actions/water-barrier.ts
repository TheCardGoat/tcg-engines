import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const waterBarrier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xWJND68I8X",
  slug: "water-barrier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xWJND68I8X:face:default",
      catalogId: "xWJND68I8X",
      name: "Water Barrier",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "The next time damage would be dealt to your champion this turn, prevent all but 1 of that damage.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "xWJND68I8X-a1",
          kind: "card-resolution",
          text: "The next time damage would be dealt to your champion this turn, prevent all but 1 of that damage.",
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            operation: {
              kind: "prevent",
              amount: {
                kind: "calculate",
                operator: "subtract",
                operands: [
                  {
                    kind: "event-amount",
                  },
                  1,
                ],
              },
            },
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
        {
          id: "xWJND68I8X-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
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
        },
      ],
    },
  },
};

export default waterBarrier;
