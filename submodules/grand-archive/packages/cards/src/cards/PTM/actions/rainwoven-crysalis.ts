import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rainwovenCrysalis: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6dK2HO0ajX",
  slug: "rainwoven-crysalis",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6dK2HO0ajX:face:default",
      catalogId: "6dK2HO0ajX",
      name: "Rainwoven Crysalis",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "The next time damage would be dealt to your champion this turn, prevent all but 1 of that damage.\n\n[Merlin Bonus] Put two sheen counters on your Fractured Memories.",
      abilities: [
        {
          id: "6dK2HO0ajX-a1",
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
          id: "6dK2HO0ajX-a2",
          kind: "card-resolution",
          text: "[Merlin Bonus] Put two sheen counters on your Fractured Memories.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "name",
                  value: "Fractured Memories",
                },
              },
            },
            counter: {
              named: "sheen",
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default rainwovenCrysalis;
