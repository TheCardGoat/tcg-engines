import type { CharacterCard } from "@tcg/op-types";
import { prb02BrookSt01011PirateFoil011I18n } from "./011-brook-st01-011-pirate-foil.i18n.ts";

export const prb02BrookSt01011PirateFoil011: CharacterCard = {
  id: "ST01-011",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "PRB02",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-011_r1.jpg",
      imageId: "ST01-011_r1",
    },
  ],
  effect: "[On Play] Give up to 2 rested DON!! cards to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: prb02BrookSt01011PirateFoil011I18n,
};
