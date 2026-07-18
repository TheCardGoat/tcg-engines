import type { CharacterCard } from "@tcg/op-types";
import { op14eb04LaoG075I18n } from "./075-lao-g.i18n.ts";

export const op14eb04LaoG075: CharacterCard = {
  id: "OP14-075",
  canonicalId: "OP14-075",
  slug: "lao-g/op14-075",
  name: "Lao.G",
  printings: [
    {
      id: "OP14-075",
      artId: "OP14-075",
      setCode: "OP14EB04",
      collectorNumber: "075",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-075_PKPlbgA.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "strike",
  effect:
    "[On K.O.] Add up to 1 DON!! card from your DON!! deck and rest it. Then, give up to 1 of your opponent's Characters −2000 power during this turn.",
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
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op14eb04LaoG075I18n,
};
