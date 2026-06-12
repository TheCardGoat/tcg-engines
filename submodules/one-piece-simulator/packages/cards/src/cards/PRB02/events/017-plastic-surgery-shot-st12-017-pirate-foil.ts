import type { EventCard } from "@tcg/op-types";
import { prb02PlasticSurgeryShotSt12017PirateFoil017I18n } from "./017-plastic-surgery-shot-st12-017-pirate-foil.i18n.ts";

export const prb02PlasticSurgeryShotSt12017PirateFoil017: EventCard = {
  id: "ST12-017",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "PRB02",
  cost: 1,
  traits: ["Straw Hat Crew"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST12-017_r1.jpg",
      imageId: "ST12-017_r1",
    },
  ],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, reveal 1 card from the top of your deck, play up to 1 Character card with a cost of 2, and place the rest at the top or bottom of your deck.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: prb02PlasticSurgeryShotSt12017PirateFoil017I18n,
};
