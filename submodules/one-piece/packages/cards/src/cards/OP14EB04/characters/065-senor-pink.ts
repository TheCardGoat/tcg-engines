import type { CharacterCard } from "@tcg/op-types";
import { op14eb04SenorPink065I18n } from "./065-senor-pink.i18n.ts";

export const op14eb04SenorPink065: CharacterCard = {
  id: "OP14-065",
  canonicalId: "OP14-065",
  slug: "senor-pink/op14-065",
  name: "Senor Pink",
  printings: [
    {
      id: "OP14-065",
      artId: "OP14-065",
      setCode: "OP14EB04",
      collectorNumber: "065",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-065_wIMpJ4o.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect: "[On K.O.] Your opponent returns 1 DON!! card from their field to their DON!! deck.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "returnDon",
            player: "opponent",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op14eb04SenorPink065I18n,
};
