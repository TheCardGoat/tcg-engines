import type { CharacterCard } from "@tcg/op-types";
import { prb02SaboP073PirateFoil073I18n } from "./073-sabo-p-073-pirate-foil.i18n.ts";

export const prb02SaboP073PirateFoil073: CharacterCard = {
  id: "P-073",
  cardType: "character",
  color: ["yellow"],
  rarity: "P",
  setId: "PRB02",
  cost: 5,
  power: 5000,
  counter: 2000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-073_r1.jpg",
      imageId: "P-073_r1",
    },
  ],
  effect:
    "[Activate:Main][Once Per Turn] You may add 1 card from the top or bottom of your Life cards to your hand: This character gains +1000 power during this turn.Disclaimer: This card was reprinted from the original set with a different border (Note: the original print had a full art border).",
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb02SaboP073PirateFoil073I18n,
};
