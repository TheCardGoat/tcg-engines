import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const clarentSwordOfPeace: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "m31WVJ9F04",
  slug: "clarent-sword-of-peace",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "m31WVJ9F04:face:default",
      catalogId: "m31WVJ9F04",
      name: "Clarent, Sword of Peace",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] Remove a durability counter from Clarent: Prevent the next 1 non-combat damage that would be dealt to each unit you control this turn. (Activate this ability only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "m31WVJ9F04-a1",
          kind: "activated",
          text: "[Class Bonus] Remove a durability counter from Clarent: Prevent the next 1 non-combat damage that would be dealt to each unit you control this turn. (Activate this ability only if your champion's class matches this card's class.)",
          activation: "ability",
          cost: {
            kind: "remove-counter",
            subject: {
              kind: "source",
            },
            counter: "durability",
            amount: 1,
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
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
              combatDamage: false,
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 1,
              scope: "per-object",
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

export default clarentSwordOfPeace;
