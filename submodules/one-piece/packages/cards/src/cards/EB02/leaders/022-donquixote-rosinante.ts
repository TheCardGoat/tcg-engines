import type { LeaderCard } from "@tcg/op-types";
import { eb02DonquixoteRosinante022I18n } from "./022-donquixote-rosinante.i18n.ts";

export const eb02DonquixoteRosinante022: LeaderCard = {
  id: "OP05-022",
  canonicalId: "OP05-022",
  slug: "donquixote-rosinante/op05-022",
  name: "Donquixote Rosinante",
  printings: [
    {
      id: "OP05-022",
      artId: "OP05-022",
      setCode: "EB02",
      collectorNumber: "022",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-022_Aqd5X1p.jpg",
    },
  ],
  cardType: "leader",
  color: ["blue", "green"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 4,
  traits: ["Donquixote Pirates Navy"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[End of Your Turn] If you have 6 or less cards in your hand, set this Leader as active.",
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
  i18n: eb02DonquixoteRosinante022I18n,
};
