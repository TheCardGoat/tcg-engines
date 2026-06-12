import type { LeaderCard } from "@tcg/op-types";
import { eb01Hannyabal021I18n } from "./021-hannyabal.i18n.ts";

export const eb01Hannyabal021: LeaderCard = {
  id: "EB01-021",
  cardType: "leader",
  color: ["blue", "purple"],
  rarity: "L",
  setId: "EB01",
  power: 5000,
  life: 4,
  traits: ["Impel Down"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-021_p1.jpg",
      imageId: "EB01-021_p1",
    },
  ],
  effect:
    "[End of Your Turn] You may return 1 of your [Impel Down] type Characters with a cost of 2 or more to the owner's hand: Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb01Hannyabal021I18n,
};
