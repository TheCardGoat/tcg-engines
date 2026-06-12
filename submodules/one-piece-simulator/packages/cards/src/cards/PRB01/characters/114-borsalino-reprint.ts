import type { CharacterCard } from "@tcg/op-types";
import { prb01BorsalinoReprint114I18n } from "./114-borsalino-reprint.i18n.ts";

export const prb01BorsalinoReprint114: CharacterCard = {
  id: "OP02-114",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "PRB01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-114_p3.jpg",
      imageId: "OP02-114_p3",
    },
  ],
  effect:
    "[Opponent's Turn] This Character gains +1000 power and cannot be K.O.'d by effects.[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
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
            value: 1000,
            duration: "permanent",
          },
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "byEffect",
          },
        ],
      },
    ],
  },
  i18n: prb01BorsalinoReprint114I18n,
};
