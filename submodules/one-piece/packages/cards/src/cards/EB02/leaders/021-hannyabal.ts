import type { LeaderCard } from "@tcg/op-types";
import { eb02Hannyabal021I18n } from "./021-hannyabal.i18n.ts";

export const eb02Hannyabal021: LeaderCard = {
  id: "EB01-021",
  canonicalId: "EB01-021",
  slug: "hannyabal/eb01-021",
  name: "Hannyabal",
  printings: [
    {
      id: "EB01-021",
      artId: "EB01-021",
      setCode: "EB02",
      collectorNumber: "021",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-021_p2.jpg",
    },
  ],
  cardType: "leader",
  color: ["blue", "purple"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 4,
  traits: ["Impel Down"],
  attribute: "slash",
  effect:
    '[End of Your Turn] You may return 1 of your "Impel Down" type Characters with a cost of 2 or more to the owner\'s hand: Add up to 1 DON!! card from your DON!! deck and set it as active.',
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
  i18n: eb02Hannyabal021I18n,
};
