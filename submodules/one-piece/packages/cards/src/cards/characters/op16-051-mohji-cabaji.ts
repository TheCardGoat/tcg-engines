import type { CharacterCard } from "@tcg/op-types";
import { op16MohjiCabaji051I18n } from "./op16-051-mohji-cabaji.i18n.ts";

export const op16MohjiCabaji051: CharacterCard = {
  id: "OP16-051",
  canonicalId: "OP16-051",
  slug: "mohji-cabaji/op16-051",
  name: "Mohji & Cabaji",
  printings: [
    {
      id: "OP16-051",
      artId: "OP16-051",
      setCode: "OP16",
      collectorNumber: "051",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-051_F2dRpkH.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP16",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Cross Guild"],
  attribute: ["slash", "wisdom"],
  effect: "[On Play] If you have 5 or less cards in your hand, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 5,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op16MohjiCabaji051I18n,
};
