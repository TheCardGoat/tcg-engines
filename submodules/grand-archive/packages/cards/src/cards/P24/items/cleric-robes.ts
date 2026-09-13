import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const clericRobes: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pv4n1n3gyg",
  slug: "cleric-robes",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pv4n1n3gyg:face:default",
      catalogId: "pv4n1n3gyg",
      name: "Cleric Robes",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ROBE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Class Bonus] On Enter: Draw a card. (Apply this effect only if your champion’s class matches this card’s class.)\n\n(1), REST: Prevent the next 1 damage that would be dealt to your champion this turn.",
      abilities: [
        {
          id: "pv4n1n3gyg-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Draw a card. (Apply this effect only if your champion’s class matches this card’s class.)",
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
          id: "pv4n1n3gyg-a2",
          kind: "activated",
          text: "(1), REST: Prevent the next 1 damage that would be dealt to your champion this turn.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 1,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
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
            },
            capacity: {
              amount: 1,
              scope: "replacement-instance",
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

export default clericRobes;
