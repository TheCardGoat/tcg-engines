import type { LeaderCard } from "@tcg/op-types";
import { op09NicoRobin062I18n } from "./062-nico-robin.i18n.ts";

export const op09NicoRobin062: LeaderCard = {
  id: "OP09-062",
  cardType: "leader",
  color: ["purple", "yellow"],
  rarity: "L",
  setId: "OP09",
  power: 5000,
  life: 4,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-062_p1.jpg",
      imageId: "OP09-062_p1",
    },
  ],
  effect:
    "[Banish] (When this card deals damage, the target card is trashed without activating its Trigger.)\n[When Attacking] You may trash 1 card with a [Trigger] from your hand: Add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    keywords: ["banish"],
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09NicoRobin062I18n,
};
