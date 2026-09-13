import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const torrentialBlast: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vwbcizm6h3",
  slug: "torrential-blast",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vwbcizm6h3:face:default",
      catalogId: "vwbcizm6h3",
      name: "Torrential Blast",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] Put the top two cards of your deck into your graveyard. (Apply this effect only if your champion's class matches this card's class.)\n\nDeal an amount of damage to up to one target ally equal to the amount of water element cards in your graveyard.",
      abilities: [
        {
          id: "vwbcizm6h3-a1",
          kind: "card-resolution",
          text: "[Class Bonus] Put the top two cards of your deck into your graveyard. (Apply this effect only if your champion's class matches this card's class.)",
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
            kind: "mill",
            player: "controller",
            amount: 2,
          },
        },
        {
          id: "vwbcizm6h3-a2",
          kind: "card-resolution",
          text: "Deal an amount of damage to up to one target ally equal to the amount of water element cards in your graveyard.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: {
              kind: "count",
              collection: {
                zones: ["graveyard"],
                player: "controller",
                filter: {
                  kind: "element",
                  oneOf: ["WATER"],
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default torrentialBlast;
