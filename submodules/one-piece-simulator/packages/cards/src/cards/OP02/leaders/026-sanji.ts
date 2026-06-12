import type { LeaderCard } from "@tcg/op-types";
import { op02Sanji026I18n } from "./026-sanji.i18n.ts";

export const op02Sanji026: LeaderCard = {
  id: "OP02-026",
  cardType: "leader",
  color: ["blue", "green"],
  rarity: "L",
  setId: "OP02",
  power: 5000,
  life: 4,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-026_p1.jpg",
      imageId: "OP02-026_p1",
    },
  ],
  effect:
    "[Once Per Turn] When you play a Character with no base effect from your hand, if you have 3 or less Characters, set up to 2 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "whenYouPlayCharacter",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op02Sanji026I18n,
};
