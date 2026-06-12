import type { LeaderCard } from "@tcg/op-types";
import { op05DonquixoteRosinante022I18n } from "./022-donquixote-rosinante.i18n.ts";

export const op05DonquixoteRosinante022: LeaderCard = {
  id: "OP05-022",
  cardType: "leader",
  color: ["blue", "green"],
  rarity: "L",
  setId: "OP05",
  power: 5000,
  life: 4,
  traits: ["Donquixote Pirates Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-022_p1.jpg",
      imageId: "OP05-022_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [End of Your Turn] If you have 6 or less cards in your hand, set this Leader as active.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 6,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
      },
    ],
  },
  i18n: op05DonquixoteRosinante022I18n,
};
