import type { CharacterCard } from "@tcg/op-types";
import { op15JewelryBonney105I18n } from "./op15-105-jewelry-bonney.i18n.ts";

export const op15JewelryBonney105: CharacterCard = {
  id: "OP15-105",
  canonicalId: "OP15-105",
  slug: "jewelry-bonney/op15-105",
  name: "Jewelry Bonney",
  printings: [
    {
      id: "OP15-105",
      artId: "OP15-105",
      setCode: "OP15",
      collectorNumber: "105",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-105_yt4eqp4.jpg",
      label: "Jewelry Bonney (OP15-105)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP15",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  effect:
    "If your Character with 7000 base power or less would be removed from the field by your opponent's effect, you may add 1 card from the top of your Life cards to your hand instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "basePower",
              comparison: "lte",
              value: 7000,
            },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "removeFromLife",
          player: "self",
          count: {
            amount: 1,
          },
          destination: "hand",
          position: "top",
        },
      },
    ],
  },
  i18n: op15JewelryBonney105I18n,
};
