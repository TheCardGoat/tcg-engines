import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flashGrenade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "isxy5lh23q",
  slug: "flash-grenade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "isxy5lh23q:face:default",
      catalogId: "isxy5lh23q",
      name: "Flash Grenade",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Class Bonus] On Enter: Draw a card. (Apply this effect only if your champion's class matches this card's class.)\n\nBanish Flash Grenade: Until end of turn, if damage would be dealt to a distant unit you control, prevent 3 of that damage.",
      abilities: [
        {
          id: "isxy5lh23q-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Draw a card. (Apply this effect only if your champion's class matches this card's class.)",
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
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "isxy5lh23q-a2",
          kind: "activated",
          text: "Banish Flash Grenade: Until end of turn, if damage would be dealt to a distant unit you control, prevent 3 of that damage.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "object-state",
                      state: "distant",
                    },
                  ],
                },
              },
            },
            operation: {
              kind: "prevent",
              amount: 3,
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default flashGrenade;
