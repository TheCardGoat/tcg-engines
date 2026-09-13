import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const riptideSlash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1tzgcxyky2",
  slug: "riptide-slash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1tzgcxyky2:face:default",
      catalogId: "1tzgcxyky2",
      name: "Riptide Slash",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Class Bonus] On Attack: Glimpse 2.  (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)\n\nOn Kill: You may put the top card of your deck into your graveyard.",
      abilities: [
        {
          id: "1tzgcxyky2-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Glimpse 2.  (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
            kind: "keyword-action",
            action: "glimpse",
            amount: 2,
          },
        },
        {
          id: "1tzgcxyky2-a2",
          kind: "triggered",
          text: "On Kill: You may put the top card of your deck into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "mill",
              player: "controller",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default riptideSlash;
