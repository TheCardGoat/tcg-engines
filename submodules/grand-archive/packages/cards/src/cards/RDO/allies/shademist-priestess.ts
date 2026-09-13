import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shademistPriestess: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "w1d0uc5dxZ",
  slug: "shademist-priestess",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "w1d0uc5dxZ:face:default",
      catalogId: "w1d0uc5dxZ",
      name: "Shademist Priestess",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN", "CLERIC"],
        subtypes: ["ASSASSIN", "CLERIC", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText:
        "Stealth\n\nWhenever your champion is dealt damage from a source you don't control,  you may recover 1.\n\nFloating Memory",
      abilities: [
        {
          id: "w1d0uc5dxZ-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "w1d0uc5dxZ-a2",
          kind: "triggered",
          text: "Whenever your champion is dealt damage from a source you don't control,  you may recover 1.",
          trigger: {
            kind: "event",
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
              subject: {
                kind: "event-object",
                controller: "opponent",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "recover",
              player: "controller",
              amount: 1,
            },
          },
        },
        {
          id: "w1d0uc5dxZ-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default shademistPriestess;
