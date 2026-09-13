import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const conduitOfSeasons: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nm77bnz4cc",
  slug: "conduit-of-seasons",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nm77bnz4cc:face:default",
      catalogId: "nm77bnz4cc",
      name: "Conduit of Seasons",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["TERA"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "If damage would be dealt to Conduit of Seasons while your Shifting Currents face West, prevent 2 of that damage.\n\nOn Attack: If your Shifting Currents face East, recover 1 and draw a card into your memory.",
      abilities: [
        {
          id: "nm77bnz4cc-a1",
          kind: "static",
          staticKind: "effects",
          text: "If damage would be dealt to Conduit of Seasons while your Shifting Currents face West, prevent 2 of that damage.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "source",
                },
              },
              condition: {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "West",
                },
              },
              operation: {
                kind: "prevent",
                amount: 2,
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
        {
          id: "nm77bnz4cc-a2",
          kind: "triggered",
          text: "On Attack: If your Shifting Currents face East, recover 1 and draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "player-state",
              player: "controller",
              state: {
                named: "shifting-currents",
                value: "East",
              },
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "recover",
                  player: "controller",
                  amount: 1,
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default conduitOfSeasons;
