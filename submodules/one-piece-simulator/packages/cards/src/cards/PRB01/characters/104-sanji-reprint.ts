import type { CharacterCard } from "@tcg/op-types";
import { prb01SanjiReprint104I18n } from "./104-sanji-reprint.i18n.ts";

export const prb01SanjiReprint104: CharacterCard = {
  id: "OP04-104",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "PRB01",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["The Vinsmoke Family"],
  attribute: "ranged",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-104_p3.jpg",
      imageId: "OP04-104_p3",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[Trigger] You may trash 1 card from your hand: Play this card.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "trigger",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb01SanjiReprint104I18n,
};
