import type { CharacterCard } from "@tcg/op-types";
import { op01Holedem113I18n } from "./113-holedem.i18n.ts";

export const op01Holedem113: CharacterCard = {
  id: "OP01-113",
  canonicalId: "OP01-113",
  slug: "holedem",
  name: "Holedem",
  printings: [
    {
      id: "OP01-113",
      artId: "OP01-113",
      setCode: "OP01",
      collectorNumber: "113",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-113.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "special",
  effect:
    "[On K.O.] Add up to 1 DON!! card from your DON!! deck and rest it.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: op01Holedem113I18n,
};
