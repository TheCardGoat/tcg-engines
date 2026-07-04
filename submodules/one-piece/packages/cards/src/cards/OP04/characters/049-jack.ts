import type { CharacterCard } from "@tcg/op-types";
import { op04Jack049I18n } from "./049-jack.i18n.ts";

export const op04Jack049: CharacterCard = {
  id: "OP04-049",
  canonicalId: "OP04-049",
  slug: "jack/op04-049",
  name: "Jack",
  printings: [
    {
      id: "OP04-049",
      artId: "OP04-049",
      setCode: "OP04",
      collectorNumber: "049",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-049.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP04",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  effect: "[On K.O.] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onKo",
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
  i18n: op04Jack049I18n,
};
