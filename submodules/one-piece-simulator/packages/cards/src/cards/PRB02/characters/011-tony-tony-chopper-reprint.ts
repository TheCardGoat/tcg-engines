import type { CharacterCard } from "@tcg/op-types";
import { prb02TonyTonyChopperReprint011I18n } from "./011-tony-tony-chopper-reprint.i18n.ts";

export const prb02TonyTonyChopperReprint011: CharacterCard = {
  id: "OP10-011",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "PRB02",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Straw Hat Crew Punk Hazard"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-011_p1.jpg",
      imageId: "OP10-011_p1",
    },
  ],
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[Opponent\'s Turn] This Character gains +2000 power.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: prb02TonyTonyChopperReprint011I18n,
};
