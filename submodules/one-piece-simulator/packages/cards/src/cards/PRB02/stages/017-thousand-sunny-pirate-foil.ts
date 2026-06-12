import type { StageCard } from "@tcg/op-types";
import { prb02ThousandSunnyPirateFoil017I18n } from "./017-thousand-sunny-pirate-foil.i18n.ts";

export const prb02ThousandSunnyPirateFoil017: StageCard = {
  id: "ST14-017",
  cardType: "stage",
  color: ["black"],
  rarity: "C",
  setId: "PRB02",
  cost: 1,
  traits: ["Straw Hat Crew"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST14-017_r1.jpg",
      imageId: "ST14-017_r1",
    },
  ],
  effect:
    'All of your black "Straw Hat Crew" type Characters gain +1 cost.[On Play] If your Leader has the "Straw Hat Crew" type, draw 1 card.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Straw Hat Crew",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: prb02ThousandSunnyPirateFoil017I18n,
};
