import type { CharacterCard } from "@tcg/op-types";
import { prb02LuckyRoux003I18n } from "./003-lucky-roux.i18n.ts";

export const prb02LuckyRoux003: CharacterCard = {
  id: "PRB02-003",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "PRB02",
  cost: 4,
  power: 2000,
  counter: 1000,
  traits: ["Red-Haired Pirates"],
  attribute: "ranged",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-003_p1.jpg",
      imageId: "PRB02-003_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Play] You may trash 1 Character card with 6000 power or more from your hand: Draw 2 cards.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02LuckyRoux003I18n,
};
