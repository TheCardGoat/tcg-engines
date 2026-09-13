import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aquamirageWhisper: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3n5x9fbkn0",
  slug: "aquamirage-whisper",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3n5x9fbkn0:face:default",
      catalogId: "3n5x9fbkn0",
      name: "Aquamirage Whisper",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERWING"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "Spellshroud (This object can't be targeted by Spells.)\n\n[Class Bonus] On Hit: Glimpse 1+X where X is the amount of damage dealt by this hit. Then put the top card of your deck into your graveyard.",
      abilities: [
        {
          id: "3n5x9fbkn0-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Spellshroud (This object can't be targeted by Spells.)",
          keyword: {
            name: "spellshroud",
          },
        },
        {
          id: "3n5x9fbkn0-a2",
          kind: "triggered",
          text: "[Class Bonus] On Hit: Glimpse 1+X where X is the amount of damage dealt by this hit. Then put the top card of your deck into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "event-amount",
              },
            },
          ],
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
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: {
                  kind: "calculate",
                  operator: "add",
                  operands: [
                    1,
                    {
                      kind: "variable",
                      symbol: "X",
                    },
                  ],
                },
              },
              {
                kind: "mill",
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

export default aquamirageWhisper;
